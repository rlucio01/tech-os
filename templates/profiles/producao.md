# 00-manifesto.md — Perfil: Produção

## Princípios Inegociáveis
- **IA sugere; engenheiro decide.** Decisões arquiteturais nunca são delegadas.
- **Código mínimo que resolve o problema.** Sem overengineering ou abstrações para uso único.
- **Mudanças cirúrgicas.** Altere apenas o necessário para a tarefa atual.
- **Regra de Ouro:** *"Consigo explicar esta mudança sem abrir o chat?"* — se não, não faça commit.

## Stack & Convenções
- **Linguagem / Runtime:** _(preencher, ex: TypeScript / Node.js 22)_
- **Framework:** _(preencher)_
- **Banco de Dados:** _(preencher)_
- **Comando de Verificação (DoD):** `npm test`

## Baseline de Segurança
- **Sem segredos hardcoded:** Nunca coloque tokens, senhas ou chaves no código, testes ou fixtures.
- **Validação de entrada:** Todo input externo validado por schema antes de processar.
- **Logs limpos:** Nunca logar PII, tokens ou dados sensíveis.
- **Auth por padrão:** Rotas/operações protegidas por padrão; exceções devem ser explicitadas na spec.

## Definition of Done (DoD)
- Testes unitários (meta >= 80% na lógica crítica) e testes de integração para mudanças estruturais.
- Mudanças estruturais exigem validação humana antes do código.
