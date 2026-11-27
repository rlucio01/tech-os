import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import { fileExists } from '../core/installer.js';
import { getTechOsDir } from '../core/paths.js';

function sanitizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function runNewFeature(rawSlug: string, cwd: string = process.cwd()): Promise<void> {
  const slug = sanitizeSlug(rawSlug);
  if (!slug) {
    throw new Error('Informe um slug válido (ex: tech-os new auth-jwt).');
  }

  const techOsDir = getTechOsDir(cwd);
  await fs.mkdir(techOsDir, { recursive: true });

  const entries = await fs.readdir(techOsDir, { withFileTypes: true });
  let maxNum = 0;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const match = entry.name.match(/^(\d+)-/);
    if (match) {
      const num = Number.parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  const nextPrefix = String(maxNum + 1).padStart(3, '0');
  const folderName = `${nextPrefix}-${slug}`;
  const featureDir = path.join(techOsDir, folderName);

  if (await fileExists(featureDir)) {
    throw new Error(`A pasta .tech-os/${folderName} já existe.`);
  }

  await fs.mkdir(featureDir, { recursive: true });
  const discoveryPath = path.join(featureDir, '01-discovery.md');

  await fs.writeFile(
    discoveryPath,
    `# Discovery: ${folderName}\n\nslug: ${slug}\nescopo: feature\n\n## Problema\n_(descreva a dor ou necessidade)_\n\n## Solução Acordada\n_(preencher com a skill tos-discovery)_\n\n## Decisões e Premissas\n- \n\n## Fora de Escopo\n- \n`,
    'utf-8'
  );

  console.log(pc.green(`\n✓ Feature criada: .tech-os/${folderName}/`));
  console.log(`  Próximo passo: chame a skill ${pc.cyan('tos-discovery')} no seu agente.\n`);
}
