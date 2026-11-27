# Tech OS

**Spec-Driven Development, Context Engineering & Autonomous Loop** para programar com IA com previsibilidade, qualidade e zero *vibe coding* descontrolado.

Compatível com **Antigravity**, **Claude Code**, **Cursor** e **Codex**.

---

## Instalação

Localmente (para testar ou desenvolver):
```bash
npm install
npm run build
npm link   # disponibiliza os comandos `tech-os` e `tos` globalmente na sua máquina
```

Ou via `npx` / Git quando publicar para seus amigos:
```bash
npx tech-os init
```

---

## Como usar em um projeto

1. **Inicialize o Tech OS na pasta do projeto:**
   ```bash
   tech-os init
   ```
   Escolha quais ferramentas você usa (Antigravity, Claude Code, Cursor, Codex) e o perfil (`mvp`, `producao`, `estudo`).

2. **Siga o fluxo de Skills no seu agente:**
   - `tos-manifesto` — ajusta `.tech-os/00-manifesto.md` e `_dominio.md` (1x por projeto)
   - `tos-discovery` — entrevista você para mapear incógnitas (`01-discovery.md`)
   - `tos-blueprint` — gera PRD técnico e classifica impacto (`02-blueprint.md`)
   - `tos-contratos` — *(opcional)* contratos de API, schemas e segurança (`03-contratos.md`)
   - `tos-planejar` — quebra em fatias `[AUTO]` e `[HUMANO]` (`04-plano.md`)
   - `tos-sync` — atualiza a spec **antes** do código quando um requisito muda

3. **Acompanhe ou execute em loop com contexto limpo:**
   ```bash
   tech-os status
   tech-os run 001-minha-feature --dry-run   # visualiza o prompt limpo
   tech-os run 001-minha-feature             # executa fatia por fatia + DoD + commit
   ```

4. **Para explicar a metodologia para alguém:**
   ```bash
   tech-os guide
   ```
