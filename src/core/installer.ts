import fs from 'node:fs/promises';
import path from 'node:path';
import { getTemplatePath } from './paths.js';

export type ToolTarget = 'antigravity' | 'claude' | 'cursor' | 'codex';

const START_MARKER = '<!-- tech-os:start -->';
const END_MARKER = '<!-- tech-os:end -->';

export async function fileExists(targetPath: string): Promise<boolean> {
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

function extractDescription(skillContent: string, skillName: string): string {
  const match = skillContent.match(/^description:\s*(.+)$/m);
  return match ? match[1].trim() : `Executa a skill ${skillName} do Tech OS`;
}

async function copyWorkflows(targetDir: string): Promise<number> {
  const skillsSrc = getTemplatePath('skills');
  const entries = await fs.readdir(skillsSrc, { withFileTypes: true });
  await fs.mkdir(targetDir, { recursive: true });
  let count = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillContent = await fs.readFile(path.join(skillsSrc, entry.name, 'SKILL.md'), 'utf-8');
    const description = extractDescription(skillContent, entry.name);
    const workflowContent = `---\ndescription: ${description}\n---\n\nLeia e siga rigorosamente as instruções da skill \`${entry.name}\` em \`.agents/skills/${entry.name}/SKILL.md\`.\n`;
    await fs.writeFile(path.join(targetDir, `${entry.name}.md`), workflowContent, 'utf-8');
    count++;
  }

  return count;
}

/**
 * Inserts or replaces the Tech OS block inside a markdown rule file (AGENTS.md / CLAUDE.md).
 */
export async function upsertMarkedSection(filePath: string, coreContent: string): Promise<void> {
  const block = `${START_MARKER}\n${coreContent.trim()}\n${END_MARKER}`;

  if (!(await fileExists(filePath))) {
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

/**
 * Detects which AI tool integrations are already present in the workspace.
 */
export async function detectInstalledTools(cwd: string): Promise<ToolTarget[]> {
  const detected: ToolTarget[] = [];

  if (await fileExists(path.join(cwd, '.agents', 'skills'))) {
    detected.push('antigravity');
  } else if (await fileExists(path.join(cwd, 'AGENTS.md'))) {
    detected.push('codex');
  }

  if (
    (await fileExists(path.join(cwd, '.claude', 'skills'))) ||
    (await fileExists(path.join(cwd, 'CLAUDE.md')))
  ) {
    detected.push('claude');
  }

  if (await fileExists(path.join(cwd, '.cursor', 'rules', 'tech-os.mdc'))) {
    detected.push('cursor');
  }

  return detected;
}

/**
 * Installs or updates skills and permanent rule files for the chosen AI tools.
 */
export async function installToolsAndRules(tools: ToolTarget[], cwd: string): Promise<string[]> {
  const coreRules = await fs.readFile(getTemplatePath('rules', 'tech-os-core.md'), 'utf-8');
  const actions: string[] = [];

  if (tools.includes('antigravity') || tools.includes('codex')) {
    await upsertMarkedSection(path.join(cwd, 'AGENTS.md'), coreRules);
    actions.push('AGENTS.md');
  }

  if (tools.includes('antigravity')) {
    const count = await copySkills(path.join(cwd, '.agents', 'skills'));
    actions.push(`.agents/skills/ (${count} skills)`);
    const wfCount = await copyWorkflows(path.join(cwd, '.agents', 'workflows'));
    actions.push(`.agents/workflows/ (${wfCount} comandos /)`);
  }

  if (tools.includes('claude')) {
    await upsertMarkedSection(path.join(cwd, 'CLAUDE.md'), coreRules);
    const count = await copySkills(path.join(cwd, '.claude', 'skills'));
    actions.push(`CLAUDE.md + .claude/skills/ (${count} skills)`);
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
    actions.push('.cursor/rules/tech-os.mdc');
  }

  return actions;
}
