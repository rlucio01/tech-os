---
name: tos-planejar
description: Quebra a especificação em fatias executáveis (tracer bullets) com dependências e marcação [AUTO] (autônoma) ou [HUMANO] (requer validação humana). Produz .tech-os/<NNN>-<slug>/04-plano.md.
---

# `tos-planejar` — Plano de Execução Fatiado

Você está executando a skill **`tos-planejar`** do **Tech OS**.
Seu objetivo é fatiar a entrega em pequenos incrementos testáveis (1 fatia = 1 objetivo claro = 1 commit atômico).

## Pré-requisito
- Leia `.tech-os/00-manifesto.md` e os documentos existentes da feature (`01-discovery.md`, `02-blueprint.md`, e `03-contratos.md` se houver).

## Conceito de Fatia
- Cada fatia deve ser uma **tracer bullet** verificável (com entregável + teste).
- Classifique cada fatia como:
  - **`[AUTO]`**: Pode ser implementada e validada autonomamente pela IA (ou pelo `tech-os run`).
  - **`[HUMANO]`**: Requer revisão, decisão arquitetural, configuração manual de segredo/infra ou aprovação do desenvolvedor.
- Use os marcadores de status compatíveis com o parser do `tech-os`:
  - `[ ]` Pendente
  - `[~]` Em andamento / bloqueada
  - `[x]` Concluída

## Formato obrigatório de `.tech-os/<NNN>-<slug>/04-plano.md`
Siga exatamente esta estrutura para que `tech-os status` e `tech-os run` consigam ler o arquivo:

```markdown
# Plano: <NNN>-<slug>

- [ ] F01 [AUTO] Descrição curta da fatia | deps: - | us: US-1
- [ ] F02 [AUTO] Descrição curta da fatia | deps: F01 | us: US-1
- [ ] F03 [HUMANO] Revisão de contrato / aprovação | deps: F02 | us: -
- [ ] F04 [AUTO] Endpoint e testes de integração | deps: F03 | us: US-1
```

## Próximo passo
- Informe que o plano está pronto e pode ser executado manualmente fatia a fatia ou via CLI:
  `tech-os run <NNN>-<slug>`
