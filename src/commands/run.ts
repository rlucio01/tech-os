import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import pc from 'picocolors';
import { getTechOsDir } from '../core/paths.js';
import {
  findNextUnblockedSlice,
  PlanSlice,
  readPlanFile,
  updateSliceStatus,
} from '../core/plan-parser.js';
import { scanWorkingTreeForSecrets } from '../core/secret-guard.js';

export type RunnerType = 'claude' | 'codex' | 'custom';

export interface RunOptions {
  runner?: RunnerType;
  cmd?: string;
  testCmd?: string;
  dryRun?: boolean;
  commit?: boolean;
}

async function readIfExists(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function extractTestCommand(manifesto: string, override?: string): string | null {
  if (override) return override;
  const match = manifesto.match(/Comando de Verificação \(DoD\):\*\*\s*`([^`]+)`/i);
  return match ? match[1].trim() : null;
}

function buildCleanPrompt(params: {
  feature: string;
  slice: PlanSlice;
  manifesto: string;
  dominio: string;
  design: string;
  blueprint: string;
  contratos: string;
}): string {
  const parts = [
    `Você está executando UMA única fatia do Tech OS em contexto limpo.`,
    `NÃO amplie o escopo. Altere apenas o necessário para concluir a fatia abaixo.`,
    ``,
    `## Fatia Atual`,
    `- ID: ${params.slice.id}`,
    `- Tarefa: ${params.slice.title}`,
    `- User Story: ${params.slice.us}`,
    `- Feature: ${params.feature}`,
  ];

  if (params.manifesto) parts.push('', '## 00-manifesto.md', params.manifesto.trim());
  if (params.dominio) parts.push('', '## _dominio.md', params.dominio.trim());
  if (params.design) parts.push('', '## _design.md', params.design.trim());
  if (params.blueprint) parts.push('', '## 02-blueprint.md', params.blueprint.trim());
  if (params.contratos) parts.push('', '## 03-contratos.md', params.contratos.trim());

  parts.push(
    '',
    '## Instrução Final',
    `Implemente ${params.slice.id}, escreva/atualize os testes correspondentes e garanta que tudo passe.`
  );

  return parts.join('\n');
}

function invokeRunner(runner: RunnerType, prompt: string, customCmd?: string): boolean {
  if (runner === 'custom') {
    if (!customCmd) {
      throw new Error('Runner "custom" exige --cmd "<comando>".');
    }
    const res = spawnSync(customCmd, {
      input: prompt,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: true,
    });
    return res.status === 0;
  }

  if (runner === 'claude') {
    const res = spawnSync('claude', ['-p', prompt], {
      stdio: 'inherit',
      shell: true,
    });
    return res.status === 0;
  }

  if (runner === 'codex') {
    const res = spawnSync('codex', ['exec', prompt], {
      stdio: 'inherit',
      shell: true,
    });
    return res.status === 0;
  }

  return false;
}

function runShellCommand(command: string): boolean {
  const res = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
  });
  return res.status === 0;
}

function printSummary(completedSlices: string[], startTimeMs: number): void {
  const elapsedSec = ((Date.now() - startTimeMs) / 1000).toFixed(1);
  console.log(pc.dim(`  Resumo: ${completedSlices.length} fatia(s) concluída(s) [${completedSlices.join(', ') || '-'}] em ${elapsedSec}s\n`));
}

export async function runLoop(
  feature: string,
  maxIterationsArg: string | undefined,
  options: RunOptions,
  cwd: string = process.cwd()
): Promise<void> {
  const maxIterations = maxIterationsArg ? Number.parseInt(maxIterationsArg, 10) : 10;
  if (Number.isNaN(maxIterations) || maxIterations <= 0) {
    throw new Error('maxIterations deve ser um número inteiro positivo.');
  }

  const techOsDir = getTechOsDir(cwd);
  const featureDir = path.join(techOsDir, feature);
  const planPath = path.join(featureDir, '04-plano.md');

  const planRaw = await readIfExists(planPath);
  if (!planRaw) {
    console.log(pc.red(`\n✗ Plano não encontrado em ${planPath}`));
    console.log(`Gere o plano primeiro com a skill ${pc.cyan('tos-planejar')}.\n`);
    process.exitCode = 1;
    return;
  }

  const manifesto = await readIfExists(path.join(techOsDir, '00-manifesto.md'));
  const dominio = await readIfExists(path.join(techOsDir, '_dominio.md'));
  const design = await readIfExists(path.join(techOsDir, '_design.md'));
  const blueprint = await readIfExists(path.join(featureDir, '02-blueprint.md'));
  const contratos = await readIfExists(path.join(featureDir, '03-contratos.md'));

  const testCmd = extractTestCommand(manifesto, options.testCmd);
  const runner: RunnerType = options.runner ?? 'claude';
  const shouldCommit = options.commit !== false;
  const startTimeMs = Date.now();
  const completedSlices: string[] = [];

  console.log(pc.bold(pc.cyan(`\n🔁 Tech OS Runner — ${feature}\n`)));
  console.log(`  Runner: ${runner}${options.dryRun ? pc.yellow(' (dry-run)') : ''}`);
  console.log(`  DoD:    ${testCmd ?? pc.dim('nenhum comando configurado')}\n`);

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const slices = await readPlanFile(planPath);
    const next = findNextUnblockedSlice(slices);

    if (!next) {
      const allDone = slices.length > 0 && slices.every((s) => s.status === 'done');
      if (allDone) {
        console.log(pc.green('✓ Todas as fatias foram concluídas! <promise>COMPLETE</promise>'));
      } else {
        console.log(pc.yellow('⚠ Nenhuma fatia desbloqueada encontrada. Verifique dependências em 04-plano.md.'));
      }
      printSummary(completedSlices, startTimeMs);
      return;
    }

    if (next.mode === 'HUMANO') {
      console.log(pc.yellow(`⏸ Pausado em ${next.id} [HUMANO]: ${next.title}`));
      console.log(
        pc.dim(`  Conclua esta etapa manualmente, marque [x] em 04-plano.md e rode "tech-os run ${feature}" novamente.`)
      );
      printSummary(completedSlices, startTimeMs);
      return;
    }

    console.log(pc.bold(`→ Iteração ${iteration}/${maxIterations}: [${next.id}] ${next.title}`));

    const prompt = buildCleanPrompt({
      feature,
      slice: next,
      manifesto,
      dominio,
      design,
      blueprint,
      contratos,
    });

    if (options.dryRun) {
      console.log(pc.dim('\n--- PROMPT EM CONTEXTO LIMPO ---'));
      console.log(prompt);
      console.log(pc.dim('--- FIM DO DRY-RUN ---\n'));
      return;
    }

    await updateSliceStatus(planPath, next.id, 'in_progress');
    const agentOk = invokeRunner(runner, prompt, options.cmd);

    if (!agentOk) {
      console.log(pc.red(`✗ Runner falhou na fatia ${next.id}. Marcando [~] e interrompendo.`));
      process.exitCode = 1;
      printSummary(completedSlices, startTimeMs);
      return;
    }

    if (testCmd) {
      console.log(pc.dim(`  Rodando DoD: ${testCmd}`));
      const testOk = runShellCommand(testCmd);
      if (!testOk) {
        console.log(pc.red(`✗ DoD falhou na fatia ${next.id}. Marcando [~] e interrompendo.`));
        process.exitCode = 1;
        printSummary(completedSlices, startTimeMs);
        return;
      }
    }

    if (shouldCommit) {
      const secrets = await scanWorkingTreeForSecrets(cwd);
      if (secrets.length > 0) {
        console.log(pc.red(`✗ Secret Guard bloqueou o commit da fatia ${next.id}:`));
        for (const s of secrets) {
          console.log(`  ${pc.red('•')} ${s.file}: ${s.reason}`);
        }
        process.exitCode = 1;
        printSummary(completedSlices, startTimeMs);
        return;
      }
    }

    await updateSliceStatus(planPath, next.id, 'done');
    completedSlices.push(next.id);
    console.log(pc.green(`✓ ${next.id} concluída!`));

    if (shouldCommit) {
      const commitMsg = `feat(${next.id}): ${next.title}`;
      const committed = runShellCommand(`git add -A && git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
      if (committed) {
        console.log(pc.dim(`  git commit: ${commitMsg}`));
      } else {
        console.log(pc.yellow('  ⚠ Não foi possível criar commit git (sem alterações ou repo não inicializado).'));
      }
    }
    console.log('');
  }

  console.log(pc.yellow(`⏹ Limite de ${maxIterations} iterações atingido.`));
  printSummary(completedSlices, startTimeMs);
}
