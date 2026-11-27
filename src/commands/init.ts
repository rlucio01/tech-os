import fs from 'node:fs/promises';
import path from 'node:path';
import { checkbox, select } from '@inquirer/prompts';
import pc from 'picocolors';
import { getTechOsDir, getTemplatePath } from '../core/paths.js';

export type ToolTarget = 'antigravity' | 'claude' | 'cursor' | 'codex';
export type ManifestoProfile = 'mvp' | 'producao' | 'estudo';

export interface InitOptions {
  yes?: boolean;
  tools?: string;
  profile?: ManifestoProfile;
}

const START_MARKER = '<!-- tech-os:start -->';
const END_MARKER = '<!-- tech-os:end -->';

async function exists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copySkills(targetDir: string): Promise<number> {
  const skillsSrc = getTemplatePath('skills');
  const entries = await fs.readdir(skillsSrc, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const srcSkill = path.join(skillsSrc, entry.name, 'SKILL.md');
    const destDir = path.join(targetDir, entry.name);
    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(srcSkill, path.join(destDir, 'SKILL.md'));
    count++;
  }

  return count;
}

/**
 * Inserts or replaces the Tech OS block inside a markdown rule file (AGENTS.md / CLAUDE.md).
 */
async function upsertMarkedSection(filePath: string, coreContent: string): Promise<void> {
  const block = `${START_MARKER}\n${coreContent.trim()}\n${END_MARKER}`;

  if (!(await exists(filePath))) {
    await fs.writeFile(filePath, `${block}\n`, 'utf-8');
    return;
  }

  const existing = await fs.readFile(filePath, 'utf-8');
  const startIdx = existing.indexOf(START_MARKER);
  const endIdx = existing.indexOf(END_MARKER);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = existing.slice(0, startIdx);
    const after = existing.slice(endIdx + END_MARKER.length);
    await fs.writeFile(filePath, `${before}${block}${after}`, 'utf-8');
    return;
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  await fs.writeFile(filePath, `${existing}${separator}${block}\n`, 'utf-8');
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
  }

  const coreRules = await fs.readFile(getTemplatePath('rules', 'tech-os-core.md'), 'utf-8');
  const installedActions: string[] = [];

  if (tools.includes('antigravity') || tools.includes('codex')) {
    await upsertMarkedSection(path.join(cwd, 'AGENTS.md'), coreRules);
    installedActions.push('AGENTS.md');
  }

  if (tools.includes('antigravity')) {
    const count = await copySkills(path.join(cwd, '.agents', 'skills'));
    installedActions.push(`.agents/skills/ (${count} skills)`);
  }

  if (tools.includes('claude')) {
    await upsertMarkedSection(path.join(cwd, 'CLAUDE.md'), coreRules);
    const count = await copySkills(path.join(cwd, '.claude', 'skills'));
    installedActions.push(`CLAUDE.md + .claude/skills/ (${count} skills)`);
  }

  if (tools.includes('cursor')) {
    const cursorDir = path.join(cwd, '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });
    const cursorTemplate = await fs.readFile(getTemplatePath('rules', 'cursor-rule.mdc'), 'utf-8');
    await fs.writeFile(
      path.join(cursorDir, 'tech-os.mdc'),
      cursorTemplate.replace('{{CORE_RULES}}', coreRules.trim()),
      'utf-8'
    );
    installedActions.push('.cursor/rules/tech-os.mdc');
  }

  // Create .tech-os/ foundation if missing
  const techOsDir = getTechOsDir(cwd);
  await fs.mkdir(techOsDir, { recursive: true });

  const manifestoDest = path.join(techOsDir, '00-manifesto.md');
  if (!(await exists(manifestoDest))) {
    await fs.copyFile(getTemplatePath('profiles', `${profile}.md`), manifestoDest);
    installedActions.push(`.tech-os/00-manifesto.md (perfil: ${profile})`);
  }

  const dominioDest = path.join(techOsDir, '_dominio.md');
  if (!(await exists(dominioDest))) {
    await fs.copyFile(getTemplatePath('profiles', '_dominio.md'), dominioDest);
    installedActions.push('.tech-os/_dominio.md');
  }

  console.log(pc.green('✓ Tech OS configurado com sucesso!\n'));
  for (const item of installedActions) {
    console.log(`  ${pc.dim('•')} ${item}`);
  }

  console.log(pc.bold('\nPróximos passos:'));
  console.log(`  1. Ajuste a stack em ${pc.cyan('.tech-os/00-manifesto.md')} (ou rode a skill ${pc.cyan('tos-manifesto')})`);
  console.log(`  2. Na sua próxima feature, chame a skill ${pc.cyan('tos-discovery')} no seu agente`);
  console.log(`  3. Acompanhe o progresso com ${pc.cyan('tech-os status')}\n`);
}
