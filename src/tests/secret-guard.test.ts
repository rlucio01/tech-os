import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findSecretPatterns, findSensitiveFileNames } from '../core/secret-guard.js';

describe('secret-guard', () => {
  it('detects sensitive filenames like .env and .pem', () => {
    const findings = findSensitiveFileNames([
      'src/index.ts',
      '.env',
      '.env.production',
      '.env.example',
      'certs/server.pem',
    ]);
    assert.equal(findings.length, 3);
    assert.deepEqual(
      findings.map((f) => f.file),
      ['.env', '.env.production', 'certs/server.pem']
    );
  });

  it('detects common inline API keys and private keys', () => {
    const awsDummy = 'AKIA' + '1234567890ABCDEF';
    const ghDummy = 'ghp_' + '1234567890abcdefghijklmnopqrstuvwxyz';
    const findings = findSecretPatterns(
      'src/config.ts',
      `const key = "${awsDummy}";\nconst gh = "${ghDummy}";`
    );
    assert.equal(findings.length, 2);
  });

  it('returns empty for clean code', () => {
    const findings = findSecretPatterns('src/app.ts', 'export const PORT = process.env.PORT ?? 3000;');
    assert.equal(findings.length, 0);
  });
});
