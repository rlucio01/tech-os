# Changelog

## [0.2.0] - 2026-11-27
### Adicionado
- **Segurança:** `Secret Guard` integrado ao `tech-os run` (bloqueia commit de `.env`, chaves privadas e tokens) e ao `tech-os doctor`.
- **Skill `tos-security`:** checklist de auditoria de segurança antes de fechar features ou PRs.
- **Design/UI:** Skill `tos-design` e template `.tech-os/_design.md` (opcional via `tech-os init --design`).
- **Comandos CLI:** `tech-os update` (atualiza skills e regras preservando `.tech-os/`), `tech-os doctor` e `tech-os new <slug>`.
- **Manutenção:** GitHub Actions CI (`.github/workflows/ci.yml`), exemplo vivo em `examples/001-exemplo-todo/` e testes automatizados para `init`, `update` e `secret-guard`.

## [0.1.0] - 2026-11-27
### Inicial
- CLI base (`init`, `status`, `run`, `guide`), 6 skills `tos-*`, 3 perfis de manifesto (`mvp`, `producao`, `estudo`) e guia visual HTML/PDF.
