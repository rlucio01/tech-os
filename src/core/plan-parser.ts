import fs from 'node:fs/promises';

export type SliceStatus = 'pending' | 'in_progress' | 'done';
export type SliceMode = 'AUTO' | 'HUMANO';

export interface PlanSlice {
  id: string;
  status: SliceStatus;
  mode: SliceMode;
  title: string;
  deps: string[];
  us: string;
  lineIndex: number;
}

const SLICE_REGEX =
  /^\s*-\s+\[([ x~])\]\s+(F\d+)\s+\[(AUTO|HUMANO)\]\s+(.+?)(?:\s+\|\s+deps:\s*([^|]+?))?(?:\s+\|\s+us:\s*(.+?))?\s*$/;

function charToStatus(ch: string): SliceStatus {
  if (ch === 'x') return 'done';
  if (ch === '~') return 'in_progress';
  return 'pending';
}

export function statusToChar(status: SliceStatus): string {
  if (status === 'done') return 'x';
  if (status === 'in_progress') return '~';
  return ' ';
}

function parseDeps(raw?: string): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed === '-' || trimmed === '—' || trimmed === '') return [];
  return trimmed
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);
}

/**
 * Parses the markdown content of `04-plano.md` into structured slices.
 */
export function parsePlanContent(content: string): PlanSlice[] {
  const lines = content.split(/\r?\n/);
  const slices: PlanSlice[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(SLICE_REGEX);
    if (!match) continue;

    const [, statusChar, id, mode, title, rawDeps, rawUs] = match;
    slices.push({
      id,
      status: charToStatus(statusChar),
      mode: mode as SliceMode,
      title: title.trim(),
      deps: parseDeps(rawDeps),
      us: rawUs ? rawUs.trim() : '-',
      lineIndex: i,
    });
  }

  return slices;
}

/**
 * Reads and parses a `04-plano.md` file from disk.
 */
export async function readPlanFile(filePath: string): Promise<PlanSlice[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  return parsePlanContent(content);
}

/**
 * Finds the next unblocked slice (pending or in_progress) whose dependencies are all `done`.
 */
export function findNextUnblockedSlice(slices: PlanSlice[]): PlanSlice | null {
  const doneIds = new Set(slices.filter((s) => s.status === 'done').map((s) => s.id));

  for (const slice of slices) {
    if (slice.status === 'done') continue;
    const allDepsDone = slice.deps.every((dep) => doneIds.has(dep));
    if (allDepsDone) {
      return slice;
    }
  }

  return null;
}

/**
 * Updates the status checkbox of a given slice ID in `04-plano.md`.
 */
export async function updateSliceStatus(
  filePath: string,
  sliceId: string,
  newStatus: SliceStatus
): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);
  const targetChar = statusToChar(newStatus);

  let updated = false;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(SLICE_REGEX);
    if (match && match[2] === sliceId) {
      lines[i] = lines[i].replace(/^(\s*-\s+\[)[ x~](\])/, `$1${targetChar}$2`);
      updated = true;
      break;
    }
  }

  if (!updated) {
    throw new Error(`Fatia ${sliceId} não encontrada em ${filePath}`);
  }

  await fs.writeFile(filePath, lines.join(eol), 'utf-8');
}
