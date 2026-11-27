import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parsePlanContent, findNextUnblockedSlice } from '../core/plan-parser.js';

describe('plan-parser', () => {
  const samplePlan = `# Plano: 001-auth

- [x] F01 [AUTO] Criar schema de usuários | deps: - | us: US-1
- [ ] F02 [AUTO] Implementar serviço de login | deps: F01 | us: US-1
- [ ] F03 [HUMANO] Revisar tokens e expiração | deps: F02 | us: -
- [ ] F04 [AUTO] Criar rota POST /login + testes | deps: F03 | us: US-1
`;

  it('parses slices with status, mode, deps, and us', () => {
    const slices = parsePlanContent(samplePlan);
    assert.equal(slices.length, 4);
    assert.deepEqual(slices[0], {
      id: 'F01',
      status: 'done',
      mode: 'AUTO',
      title: 'Criar schema de usuários',
      deps: [],
      us: 'US-1',
      lineIndex: 2,
    });
    assert.deepEqual(slices[1].deps, ['F01']);
    assert.equal(slices[2].mode, 'HUMANO');
  });

  it('finds the next unblocked slice', () => {
    const slices = parsePlanContent(samplePlan);
    const next = findNextUnblockedSlice(slices);
    assert.equal(next?.id, 'F02');
  });

  it('returns null when remaining slices are blocked on unfinished deps', () => {
    const blockedPlan = `
- [ ] F01 [HUMANO] Aprovar contrato | deps: - | us: -
- [ ] F02 [AUTO] Implementar rota | deps: F01 | us: US-1
`;
    const slices = parsePlanContent(blockedPlan);
    const next = findNextUnblockedSlice(slices);
    assert.equal(next?.id, 'F01');
    assert.equal(next?.mode, 'HUMANO');
  });
});
