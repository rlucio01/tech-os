import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import pc from 'picocolors';
import { detectInstalledTools, fileExists } from '../core/installer.js';
import { getTechOsDir } from '../core/paths.js';
import { scanWorkingTreeForSecrets } from '../core/secret-guard.js';

function checkCommandAvailable(cmd: string): boolean {
  const res = spawnSync(cmd, ['--version'], { stdio: 'ignore', shell: true });
  return res.status === 0;
}

export async function runDoctor(cwd: string = process.cwd()): Promise<void> {
  console.log(pc.bold(pc.cyan('\n🩺 Tech OS — Diagnóstico do Projeto\n')));

  let warnings = 0;

  // 1. Git repository
  const hasGit = await fileExists(path.join(cwd, '.git'));
  console.log(
    hasGit ? `  ${pc.green('✓')} Repositório Git inicializado` : `  ${pc.yellow('⚠')} Repositório Git não encontrado (commits automáticos do run não funcionarão)`
  );
  if (!hasGit) warnings++;

  // 2. .gitignore protecting .env
  const gitignorePath = path.join(cwd, '.gitignore');
  let envIgnored = false;
  if (await fileExists(gitignorePath)) {
    const content = await fs.readFile(gitignorePath, 'utf-8');
    envIgnored = /^\s*\.env/m.test(content);
  }
  console.log(
    envIgnored ? `  ${pc.green('✓')} .gitignore protege arquivos .env` : `  ${pc.yellow('⚠')} .env não está listado no .gitignore`
  );
  if (!envIgnored) warnings++;

  // 3. .tech-os/ foundation
  const techOsDir = getTechOsDir(cwd);
  const hasManifesto = await fileExists(path.join(techOsDir, '00-manifesto.md'));
  console.log(
    hasManifesto ? `  ${pc.green('✓')} .tech-os/00-manifesto.md presente` : `  ${pc.red('✗')} .tech-os/00-manifesto.md ausente (rode tech-os init)`
  );
  if (!hasManifesto) warnings++;

  // 4. Tools detected
  const tools = await detectInstalledTools(cwd);
  console.log(
    tools.length > 0
      ? `  ${pc.green('✓')} Integrações detectadas: ${tools.join(', ')}`
      : `  ${pc.yellow('⚠')} Nenhuma integração (Antigravity/Claude/Cursor/Codex) detectada`
  );
  if (tools.length === 0) warnings++;

  // 5. Runners available in PATH
  const hasClaude = checkCommandAvailable('claude');
  const hasCodex = checkCommandAvailable('codex');
  console.log(
    `  ${pc.dim('•')} Runners no PATH: claude=${hasClaude ? pc.green('sim') : pc.dim('não')} · codex=${
      hasCodex ? pc.green('sim') : pc.dim('não')
    }`
  );

  // 6. Secret Guard scan on working tree
  if (hasGit) {
    const secrets = await scanWorkingTreeForSecrets(cwd);
    if (secrets.length === 0) {
      console.log(`  ${pc.green('✓')} Secret Guard: nenhum segredo exposto nas alterações locais`);
    } else {
      warnings += secrets.length;
      console.log(`  ${pc.red('✗')} Secret Guard encontrou ${secrets.length} alerta(s):`);
      for (const s of secrets) {
        console.log(`    ${pc.red('•')} ${s.file}: ${s.reason}`);
      }
    }
  }

  console.log(
    warnings === 0
      ? pc.green('\nTudo saudável! Projeto pronto para usar o Tech OS.\n')
      : pc.yellow(`\nDiagnóstico concluído com ${warnings} atenção(ões).\n`)
  );
}
