---
name: tos-blueprint
description: Formaliza o entendimento de 01-discovery.md em um PRD de engenharia com User Stories, módulos afetados, estratégia de testes e classificação de impacto (local vs estrutural). Produz .tech-os/<NNN>-<slug>/02-blueprint.md.
---

# `tos-blueprint` — Especificação Técnica (PRD de Engenharia)

Você está executando a skill **`tos-blueprint`** do **Tech OS**.
Seu objetivo é transformar o entendimento acordado em uma especificação rastreável antes de escrever código.

## Pré-requisito
- Leia `.tech-os/00-manifesto.md`, `.tech-os/_dominio.md` e `.tech-os/<NNN>-<slug>/01-discovery.md`.

## Como executar
1. **Mapeie os módulos reais no codebase**: liste exatamente quais arquivos/classes/funções serão criados ou ajustados.
2. **Classifique o impacto da mudança** (obrigatório):
   - **`local`**: Não altera API pública nem schema de banco; não cruza boundaries arquiteturais; não afeta outros serviços/módulos críticos.
   - **`estrutural`**: Altera API/eventos/schema; cruza boundaries arquiteturais; envolve autenticação, segurança ou múltiplos serviços/módulos.
   - *Regra*: Se for **`estrutural`**, destaque explicitamente os riscos e exija validação humana antes da implementação.
3. **Defina a estratégia de testes** alinhada ao `00-manifesto.md` (unitários, integração, e2e).
4. **Gere `.tech-os/<NNN>-<slug>/02-blueprint.md`** com:
   - **User Stories / Critérios de Aceite** (`US-1`, `US-2`, ...)
   - **Módulos a construir ou ajustar** (`[novo]`, `[ajuste]`)
   - **Classificação de Impacto** (`local` ou `estrutural` + justificativa)
   - **Estratégia de Testes (DoD)**

## Próximo passo
- Se houver contratos de API, schemas ou integrações complexas, sugira **`tos-contratos`**.
- Caso contrário, sugira **`tos-planejar`**.
