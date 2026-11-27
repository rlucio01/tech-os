---
name: tos-sync
description: Atualiza a especificação ANTES de alterar o código quando um requisito muda durante ou após a implementação, evitando drift entre spec e código.
---

# `tos-sync` — Evolução Controlada (Anti-Drift)

Você está executando a skill **`tos-sync`** do **Tech OS**.
**Regra de Ouro:** Nunca altere o código para atender a uma mudança de requisito sem atualizar a spec primeiro.

## Quando usar
- Um requisito mudou, surgiu uma regra nova ou foi descoberta uma restrição em produção que invalida parte da spec atual.

## Como executar
1. **Leia os artefatos da feature** em `.tech-os/<NNN>-<slug>/` (`01-discovery.md`, `02-blueprint.md`, `03-contratos.md`, `04-plano.md`).
2. **Identifique o impacto da mudança**:
   - Quais User Stories, contratos ou fatias do plano são afetados?
   - A classificação de impacto mudou de `local` para `estrutural`?
3. **Atualize os documentos afetados**:
   - Adicione um bloco `## Revisão YYYY-MM-DD` explicando o motivo da mudança e as seções afetadas.
   - Atualize o conteúdo das seções afetadas (não deixe contradição entre o texto antigo e a revisão).
   - Se necessário, adicione ou reabra fatias em `04-plano.md`.
4. **Só então** prossiga para a implementação ou chame `tech-os run`.
