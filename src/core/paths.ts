import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves the root directory of the installed `tech-os` package
 * (works both from `src/` during development and `dist/` when built).
 */
export function getPackageRoot(): string {
  return path.resolve(__dirname, '..', '..');
}

/**
 * Resolves a path inside the package's `templates/` directory.
 */
export function getTemplatePath(...segments: string[]): string {
  return path.join(getPackageRoot(), 'templates', ...segments);
}

/**
 * Resolves the `.tech-os` directory in the target project workspace.
 */
export function getTechOsDir(cwd: string = process.cwd()): string {
  return path.join(cwd, '.tech-os');
}
