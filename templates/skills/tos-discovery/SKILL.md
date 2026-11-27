---
name: tos-discovery
description: Entrevista o desenvolvedor pergunta por pergunta para alinhar o problema, validar contra o codebase real e revelar incógnitas (Unknown Knowns e Unknown Unknowns) antes de codar. Produz .tech-os/<NNN>-<slug>/01-discovery.md.
---

# `tos-discovery` — Entender Antes de Codar

Você está executando a skill **`tos-discovery`** do **Tech OS**.
Seu objetivo é fechar a lacuna entre o **Mapa** (o pedido inicial) e o **Território** (o codebase real e suas restrições), descobrindo incógnitas quando ainda é barato corrigir a direção.

## Pré-requisito
- Leia `.tech-os/00-manifesto.md` e `.tech-os/_dominio.md` (se existirem).
- Se não existirem, avise o usuário e sugira rodar `tos-manifesto` primeiro (ou siga com os princípios padrão do Tech OS se ele preferir).

## Os 4 tipos de incógnitas que você deve mapear
1. **Known Knowns**: o que o usuário já trouxe no enunciado.
2. **Known Unknowns**: lacunas que ele sabe que precisa definir.
3. **Unknown Knowns**: contexto implícito ("ah, claro, cancelar também notifica o usuário").
4. **Unknown Unknowns** *(mais perigoso)*: cenários de borda, impactos em outros módulos, regras de negócio ocultas ou limitações técnicas do código atual.

## Como executar
1. **Leia o código relevante primeiro**: antes de bombardear o usuário com perguntas, explore os arquivos relacionados ao pedido para não perguntar o que o código já responde.
2. **Conduza uma entrevista enxuta, pergunta por pergunta** (ou em blocos curtos de 2–3 perguntas por vez):
   - Exponha ambiguidades e apresente interpretações possíveis.
   - Questione cenários de borda, permissões, erros esperados e o que fica **fora de escopo**.
   - Pare assim que o entendimento estiver sólido e sem ambiguidades críticas.
3. **Defina o `<NNN>-<slug>`** (ex.: `001-auth-jwt`, verificando a última pasta em `.tech-os/`).
4. **Gere `.tech-os/<NNN>-<slug>/01-discovery.md`** com:
   - `slug` e `escopo` (`feature`, `bug`, `refactor`, `express`)
   - **Problema**: descrição clara da dor ou necessidade
   - **Solução acordada**: o que será construído
   - **Decisões e Premissas**: escolhas feitas durante a entrevista
   - **Fora de escopo**: o que NÃO será feito agora

## Modo Express
Se a tarefa for pequena, puramente local e sem risco arquitetural, você pode perguntar ao usuário se ele quer pular `tos-blueprint` e ir direto para `tos-planejar`.

## Próximo passo
Ao salvar `01-discovery.md`, sugira: *"Discovery registrado em `.tech-os/<NNN>-<slug>/01-discovery.md`. Próximo passo: `tos-blueprint` (ou `tos-planejar` se for modo express)."*
