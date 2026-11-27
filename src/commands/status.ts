import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import { getTechOsDir } from '../core/paths.js';
import { findNextUnblockedSlice, readPlanFile } from '../core/plan-parser.js';

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function runStatus(cwd: string = process.cwd()): Promise<void> {
  const techOsDir = getTechOsDir(cwd);

  if (!(await fileExists(techOsDir))) {
    console.log(pc.yellow('\nPasta .tech-os/ não encontrada neste projeto.'));
    console.log(`Rode ${pc.cyan('tech-os init')} para inicializar.\n`);
    return;
  }

  const hasManifesto = await fileExists(path.join(techOsDir, '00-manifesto.md'));
  const hasDominio = await fileExists(path.join(techOsDir, '_dominio.md'));

  console.log(pc.bold(pc.cyan('\n📊 Tech OS — Status do Projeto\n')));
  console.log(
    `  Fundação: ${hasManifesto ? pc.green('✓ 00-manifesto.md') : pc.red('✗ 00-manifesto.md')}  ${
      hasDominio ? pc.green('✓ _dominio.md') : pc.yellow('○ _dominio.md')
    }\n`
  );

  const entries = await fs.readdir(techOsDir, { withFileTypes: true });
  const featureDirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  if (featureDirs.length === 0) {
    console.log(pc.dim('  Nenhuma feature iniciada ainda. Use a skill tos-discovery para começar.\n'));
    return;
  }

  for (const dir of featureDirs) {
    const featurePath = path.join(techOsDir, dir);
    const stages = [
      { key: 'discovery', file: '01-discovery.md' },
      { key: 'blueprint', file: '02-blueprint.md' },
      { key: 'contratos', file: '03-contratos.md' },
      { key: 'plano', file: '04-plano.md' },
    ];

    const badges: string[] = [];
    for (const s of stages) {
      const ok = await fileExists(path.join(featurePath, s.file));
      badges.push(ok ? pc.green(`✓ ${s.key}`) : pc.dim(`· ${s.key}`));
    }

    console.log(`  ${pc.bold(dir)}`);
    console.log(`    Fases: ${badges.join('  ')}`);

    const planPath = path.join(featurePath, '04-plano.md');
    if (await fileExists(planPath)) {
      const slices = await readPlanFile(planPath);
      const doneCount = slices.filter((s) => s.status === 'done').length;
      const next = findNextUnblockedSlice(slices);

      console.log(`    Fatias: ${doneCount}/${slices.length} concluídas`);
      if (slices.length > 0 && doneCount === slices.length) {
        console.log(`    Estado: ${pc.green('COMPLETE')}`);
      } else if (next) {
        const modeTag = next.mode === 'HUMANO' ? pc.yellow('[HUMANO]') : pc.cyan('[AUTO]');
        console.log(`    Próxima: ${next.id} ${modeTag} ${next.title}`);
      } else if (slices.length > 0) {
        console.log(`    Estado: ${pc.yellow('Bloqueado em dependências')}`);
      }
    }
    console.log('');
  }
}
