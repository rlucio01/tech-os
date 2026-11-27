import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runInit } from '../commands/init.js';
import { runUpdate } from '../commands/update.js';

describe('init & update', () => {
  it('preserves existing AGENTS.md content and .tech-os/00-manifesto.md on update', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tech-os-test-'));

    try {
      await fs.writeFile(path.join(tmpDir, 'AGENTS.md'), '# Meu Projeto\n\nRegras próprias.\n', 'utf-8');

      await runInit({ yes: true, tools: 'antigravity', profile: 'mvp', design: true }, tmpDir);

      const agentsAfterInit = await fs.readFile(path.join(tmpDir, 'AGENTS.md'), 'utf-8');
      assert.match(agentsAfterInit, /# Meu Projeto/);
      assert.match(agentsAfterInit, /<!-- tech-os:start -->/);

      // Customize manifesto to verify update does not overwrite it
      const manifestoPath = path.join(tmpDir, '.tech-os', '00-manifesto.md');
      await fs.writeFile(manifestoPath, '# Custom Manifesto\n', 'utf-8');

      // Check _design.md was created with shadcn/ui default
      const designContent = await fs.readFile(path.join(tmpDir, '.tech-os', '_design.md'), 'utf-8');
      assert.match(designContent, /shadcn\/ui/);
      assert.match(agentsAfterInit, /shadcn\/ui/);

      // Run update
      await runUpdate(tmpDir);

      const manifestoAfterUpdate = await fs.readFile(manifestoPath, 'utf-8');
      assert.equal(manifestoAfterUpdate, '# Custom Manifesto\n');

      // Check new v0.2.0 skills and v0.2.2 slash workflows were copied
      const secSkill = await fs.readFile(
        path.join(tmpDir, '.agents', 'skills', 'tos-security', 'SKILL.md'),
        'utf-8'
      );
      assert.match(secSkill, /tos-security/);

      const discoveryWorkflow = await fs.readFile(
        path.join(tmpDir, '.agents', 'workflows', 'tos-discovery.md'),
        'utf-8'
      );
      assert.match(discoveryWorkflow, /tos-discovery/);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});
