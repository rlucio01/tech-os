---
name: tos-contratos
description: Skill opcional para detalhar contratos técnicos (endpoints, schemas de dados, payloads, erros e requisitos de segurança) antes do fatiamento. Produz .tech-os/<NNN>-<slug>/03-contratos.md.
---

# `tos-contratos` — Contratos Técnicos (Opcional)

Você está executando a skill **`tos-contratos`** do **Tech OS**.
Use esta skill quando a feature envolver APIs, schemas de banco, integrações externas, eventos ou regras de segurança específicas.

## Pré-requisito
- Leia `.tech-os/00-manifesto.md` e `.tech-os/<NNN>-<slug>/02-blueprint.md`.

## Como executar
1. Especifique apenas o necessário para eliminar ambiguidade na implementação:
   - **Contratos de API / Interfaces**: método, rota/assinatura, autenticação, request/response schemas e códigos de erro (`400`, `401`, `404`, `409`, `422`).
   - **Schema / Modelo de Dados**: tabelas, colunas, tipos, índices ou migrações.
   - **Segurança & Dados Sensíveis**: validação de entrada, autorização, campos que NUNCA podem ir para logs.
2. **Gere `.tech-os/<NNN>-<slug>/03-contratos.md`** de forma objetiva e tabular/estruturada.

## Próximo passo
- Oriente o usuário a rodar **`tos-planejar`** para quebrar a entrega em fatias executáveis.
