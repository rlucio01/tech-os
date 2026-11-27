# 00-manifesto.md — Perfil: MVP Rápido

## Princípios Inegociáveis
- **IA sugere; engenheiro decide.** Você continua no controle da arquitetura.
- **Código mínimo que resolve o problema.** Priorize simplicidade e velocidade sem gerar código ilegível.
- **Mudanças cirúrgicas.** Não refatore o que não faz parte do pedido.
- **Regra de Ouro:** *"Consigo explicar esta mudança sem abrir o chat?"*

## Stack & Convenções
- **Linguagem / Runtime:** _(preencher)_
- **Framework:** _(preencher)_
- **Comando de Verificação (DoD):** `npm test`

## Baseline de Segurança
- Sem segredos hardcoded no código (use `.env`).
- Validação básica nos endpoints/formulários principais.
- Nunca expor dados sensíveis em logs.

## Definition of Done (DoD)
- Testes nos fluxos críticos (happy path + principal cenário de erro).
- Build e typecheck passando sem erros antes de commitar.
