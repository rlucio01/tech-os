---
name: tos-security
description: Audita a feature ou o diff atual contra o baseline de segurança (segredos, validação de entrada, auth, PII em logs e dependências) antes de finalizar ou abrir PR.
---

# `tos-security` — Auditoria de Segurança

Você está executando a skill **`tos-security`** do **Tech OS**.
Seu objetivo é garantir que nenhuma vulnerabilidade óbvia ou vazamento de dados passe para produção.

## Quando usar
- Antes de concluir uma feature classificada como **`estrutural`**.
- Antes de abrir um Pull Request ou após implementar fluxos de autenticação, upload, pagamentos ou dados sensíveis.

## Checklist de Auditoria
1. **Segredos e Credenciais**:
   - Verifique se há tokens, senhas, chaves de API ou `.env` hardcoded no código, testes ou fixtures.
2. **Validação de Entrada**:
   - Todo input externo (body, query, params, webhooks, CLI args) está validado por schema/tipo antes de ser processado?
3. **Autenticação e Autorização**:
   - Novas rotas/ações exigem autenticação por padrão? Há risco de IDOR (usuário A acessando recurso do usuário B)?
4. **Logs e Dados Sensíveis (PII)**:
   - Senhas, tokens, CPFs, e-mails ou payloads completos estão sendo logados? Se sim, remova ou mascare.
5. **Dependências e Superfície de Ataque**:
   - Verifique se há `eval`, `exec` com input não sanitizado, SQL concatenado ou dependências suspeitas.

## Saída
- Liste **apenas** os achados reais com arquivo e linha, classificados por severidade (`CRÍTICO`, `ALTO`, `MÉDIO`).
- Se houver item `CRÍTICO` ou `ALTO`, proponha a correção cirúrgica e aguarde confirmação antes de editar.
- Se estiver tudo limpo, registre: *"Auditoria `tos-security` aprovada sem pendências críticas."*
