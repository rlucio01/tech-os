import pc from 'picocolors';
import { detectInstalledTools, installToolsAndRules } from '../core/installer.js';

export async function runUpdate(cwd: string = process.cwd()): Promise<void> {
  console.log(pc.bold(pc.cyan('\n🔄 Tech OS — Atualizando Skills e Regras\n')));

  const tools = await detectInstalledTools(cwd);
  if (tools.length === 0) {
    console.log(pc.yellow('Nenhuma instalação do Tech OS detectada neste projeto.'));
    console.log(`Rode ${pc.cyan('tech-os init')} para inicializar.\n`);
    return;
  }

  const updated = await installToolsAndRules(tools, cwd);
  console.log(pc.green('✓ Skills e regras atualizadas sem alterar seu .tech-os/!\n'));
  for (const item of updated) {
    console.log(`  ${pc.dim('•')} ${item}`);
  }
  console.log('');
}
