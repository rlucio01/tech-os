import fs from 'node:fs/promises';
import path from 'node:path';
import { checkbox, confirm, select } from '@inquirer/prompts';
import pc from 'picocolors';
import { fileExists, installToolsAndRules, ToolTarget } from '../core/installer.js';
import { getTechOsDir, getTemplatePath } from '../core/paths.js';

export type ManifestoProfile = 'mvp' | 'producao' | 'estudo';

export interface InitOptions {
  yes?: boolean;
  tools?: string;
  profile?: ManifestoProfile;
  design?: boolean;
}

function parseToolsFlag(raw?: string): ToolTarget[] | null {
  if (!raw) return null;
  const valid = new Set<ToolTarget>(['antigravity', 'claude', 'cursor', 'codex']);
  const parsed = raw
    .split(',')
    .map((t) => t.trim().toLowerCase() as ToolTarget)
    .filter((t) => valid.has(t));
  return parsed.length > 0 ? parsed : null;
}

export async function runInit(options: InitOptions, cwd: string = process.cwd()): Promise<void> {
  console.log(pc.bold(pc.cyan('\n⚡ Tech OS — Inicialização do Projeto\n')));

  let tools: ToolTarget[] = parseToolsFlag(options.tools) ?? [];
  let profile: ManifestoProfile = options.profile ?? 'mvp';
  let includeDesign = Boolean(options.design);

  if (options.yes) {
    if (tools.length === 0) tools = ['antigravity'];
  } else {
    if (tools.length === 0) {
      tools = await checkbox<ToolTarget>({
        message: 'Quais ferramentas de IA você (ou seu time) usa neste projeto?',
        choices: [
          { name: 'Antigravity (.agents/skills + AGENTS.md)', value: 'antigravity', checked: true },
          { name: 'Claude Code (.claude/skills + CLAUDE.md)', value: 'claude' },
          { name: 'Cursor (.cursor/rules/tech-os.mdc)', value: 'cursor' },
          { name: 'Codex / Outros (AGENTS.md)', value: 'codex' },
        ],
        required: true,
      });
    }

    if (!options.profile) {
      profile = await select<ManifestoProfile>({
        message: 'Qual perfil de rigor para o .tech-os/00-manifesto.md?',
        choices: [
          { name: 'MVP Rápido — pragmático, testes nos fluxos críticos', value: 'mvp' },
          { name: 'Produção — rigor alto, baseline de segurança, testes >= 80%', value: 'producao' },
          { name: 'Estudo & Protótipo — foco em clareza e aprendizado', value: 'estudo' },
        ],
        default: 'mvp',
      });
    }

    if (options.design === undefined) {
      includeDesign = await confirm({
        message: 'O projeto tem Frontend/UI e você quer criar .tech-os/_design.md?',
        default: false,
      });
    }
  }

  const installedActions = await installToolsAndRules(tools, cwd);

  // Create .tech-os/ foundation if missing
  const techOsDir = getTechOsDir(cwd);
  await fs.mkdir(techOsDir, { recursive: true });

  const manifestoDest = path.join(techOsDir, '00-manifesto.md');
  if (!(await fileExists(manifestoDest))) {
    await fs.copyFile(getTemplatePath('profiles', `${profile}.md`), manifestoDest);
    installedActions.push(`.tech-os/00-manifesto.md (perfil: ${profile})`);
  }

  const dominioDest = path.join(techOsDir, '_dominio.md');
  if (!(await fileExists(dominioDest))) {
    await fs.copyFile(getTemplatePath('profiles', '_dominio.md'), dominioDest);
    installedActions.push('.tech-os/_dominio.md');
  }

  if (includeDesign) {
    const designDest = path.join(techOsDir, '_design.md');
    if (!(await fileExists(designDest))) {
      await fs.copyFile(getTemplatePath('profiles', '_design.md'), designDest);
      installedActions.push('.tech-os/_design.md');
    }
  }

  console.log(pc.green('✓ Tech OS configurado com sucesso!\n'));
  for (const item of installedActions) {
    console.log(`  ${pc.dim('•')} ${item}`);
  }

  console.log(pc.bold('\nPróximos passos:'));
  console.log(`  1. Ajuste a stack em ${pc.cyan('.tech-os/00-manifesto.md')} (ou rode a skill ${pc.cyan('tos-manifesto')})`);
  console.log(`  2. Na sua próxima feature, chame a skill ${pc.cyan('tos-discovery')} no seu agente`);
  console.log(`  3. Valide o ambiente com ${pc.cyan('tech-os doctor')} e acompanhe com ${pc.cyan('tech-os status')}\n`);
}
