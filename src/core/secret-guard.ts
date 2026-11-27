import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface SecretFinding {
  file: string;
  reason: string;
}

const SENSITIVE_FILE_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /(^|\/)\.env($|\.(?!example|sample|template))/i, reason: 'Arquivo .env não deve ser commitado' },
  { pattern: /\.(pem|key|p12|pfx)$/i, reason: 'Arquivo de chave privada detectado' },
  { pattern: /(^|\/)(id_rsa|id_ed25519)$/i, reason: 'Chave SSH privada detectada' },
  { pattern: /(^|\/)credentials\.json$/i, reason: 'Arquivo credentials.json detectado' },
];

const SECRET_CONTENT_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, reason: 'Chave privada inline detectada' },
  { pattern: /\bAKIA[0-9A-Z]{16}\b/, reason: 'Possível AWS Access Key ID (AKIA...)' },
  { pattern: /\bgh[po]_[A-Za-z0-9]{30,}\b/, reason: 'Possível token GitHub (ghp_/gho_)' },
  { pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/, reason: 'Possível API key (sk-...)' },
  { pattern: /\bAIza[0-9A-Za-z_-]{35}\b/, reason: 'Possível Google API key (AIza...)' },
];

export function findSensitiveFileNames(files: string[]): SecretFinding[] {
  const findings: SecretFinding[] = [];
  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');
    for (const rule of SENSITIVE_FILE_PATTERNS) {
      if (rule.pattern.test(normalized)) {
        findings.push({ file: normalized, reason: rule.reason });
        break;
      }
    }
  }
  return findings;
}

export function findSecretPatterns(file: string, content: string): SecretFinding[] {
  const findings: SecretFinding[] = [];
  for (const rule of SECRET_CONTENT_PATTERNS) {
    if (rule.pattern.test(content)) {
      findings.push({ file, reason: rule.reason });
    }
  }
  return findings;
}

/**
 * Scans modified/untracked git files in the workspace for sensitive filenames or inline secret patterns.
 */
export async function scanWorkingTreeForSecrets(cwd: string = process.cwd()): Promise<SecretFinding[]> {
  const res = spawnSync('git', ['status', '--porcelain'], { cwd, encoding: 'utf-8' });
  if (res.status !== 0 || !res.stdout) return [];

  const changedFiles = res.stdout
    .split(/\r?\n/)
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map((entry) => {
      const arrowIdx = entry.indexOf(' -> ');
      return arrowIdx !== -1 ? entry.slice(arrowIdx + 4) : entry;
    });

  const findings: SecretFinding[] = [...findSensitiveFileNames(changedFiles)];

  for (const relPath of changedFiles) {
    const fullPath = path.join(cwd, relPath);
    try {
      const stat = await fs.stat(fullPath);
      if (!stat.isFile() || stat.size > 512 * 1024) continue;
      const content = await fs.readFile(fullPath, 'utf-8');
      findings.push(...findSecretPatterns(relPath, content));
    } catch {
      // Ignore deleted or unreadable files
    }
  }

  return findings;
}
