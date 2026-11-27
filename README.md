# Tech OS

**Spec-Driven Development, Context Engineering & Autonomous Loop** para programar com IA com previsibilidade, código limpo e controle humano.

Compatível com **Antigravity**, **Claude Code**, **Cursor** e **Codex**.

> 📄 **Material para compartilhar:** Veja o guia visual completo em [docs/tech-os-guia.html](docs/tech-os-guia.html) ou baixe o PDF em [docs/tech-os-guia.pdf](docs/tech-os-guia.pdf).

---

## Por que o Tech OS existe?

Programar no modo *"vibe coding"* (pedir uma feature inteira e aceitar o código sem entender) funciona para protótipos rápidos, mas cobra um preço alto em projetos reais:
- Código heterogêneo, difícil de manter e cheio de abstrações desnecessárias.
- Modelos de IA perdem qualidade quando a janela de contexto ultrapassa ~50% (*dumb zone*).
- Mudanças silenciosas que quebram outras partes do sistema.

O **Tech OS** resolve isso combinando **4 pilares**:
1. **Contexto Persistente (`.tech-os/00-manifesto.md`)**: regras, stack, segurança e Definition of Done carregados em toda sessão.
2. **Spec-Driven Development (Skills `tos-*`)**: você pensa, investiga incógnitas e especifica *antes* de escrever código.
3. **Fatiamento (`[AUTO]` vs `[HUMANO]`)**: entregas quebradas em micro-tarefas testáveis.
4. **Execução em Contexto Limpo (`tech-os run`)**: cada fatia roda em uma sessão isolada da IA com apenas o contexto necessário + teste + commit atômico.

### Princípios Inegociáveis
- **IA sugere; engenheiro decide.** Decisões arquiteturais nunca são delegadas.
- **Pense antes de programar.** Exponha premissas e descubra incógnitas antes de codar.
- **Código mínimo que resolve o problema.** Combate ativo ao *overengineering*.
- **Mudanças cirúrgicas.** Altere apenas o que tem relação direta com o pedido.
- **Regra de Ouro:** *"Consigo explicar esta mudança sem abrir o chat?"* — se não, não faça commit.

---

## Instalação

Use direto via `npx` em qualquer projeto:
```bash
npx tech-os init
```

Ou instale globalmente:
```bash
npm install -g tech-os
```
*(Disponibiliza os comandos `tech-os` e o atalho `tos`.)*

---

## Comandos da CLI

### `tech-os init`
Inicializa o Tech OS no projeto atual. Pergunta quais ferramentas de IA você usa e qual perfil de rigor deseja para o manifesto.

**O que ele cria:**
- **Antigravity**: `.agents/skills/tos-*/SKILL.md` + `.agents/workflows/tos-*.md` (comandos `/tos-*`) + bloco no `AGENTS.md`
- **Claude Code**: `.claude/skills/tos-*/SKILL.md` + bloco no `CLAUDE.md`
- **Cursor**: `.cursor/rules/tech-os.mdc`
- **Codex / Outros**: `AGENTS.md`
- **Fundação do projeto**: `.tech-os/00-manifesto.md` e `.tech-os/_dominio.md`

**Flags disponíveis:**
- `-y, --yes` — Pula perguntas interativas e usa o padrão (`antigravity`, perfil `mvp`).
- `-t, --tools <lista>` — Ferramentas separadas por vírgula (`antigravity,claude,cursor,codex`).
- `-p, --profile <perfil>` — Perfil do manifesto:
  - `mvp`: pragmático, testes nos fluxos críticos.
  - `producao`: rigor alto, baseline de segurança, meta de cobertura >= 80%.
  - `estudo`: foco em clareza, aprendizado e explicação de trade-offs.
- `-d, --design` — Cria também `.tech-os/_design.md` para projetos com Frontend/UI.

**Exemplo:**
```bash
tech-os init --tools antigravity,cursor --profile producao --design
```

---

### `tech-os update`
Atualiza as skills (`tos-*`) e os blocos de regras (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/tech-os.mdc`) para a versão mais recente do Tech OS **sem sobrescrever** `.tech-os/00-manifesto.md`, `_dominio.md`, `_design.md` ou suas specs.

---

### `tech-os new <slug>`
Cria automaticamente a próxima pasta numerada da feature em `.tech-os/<NNN>-<slug>/` com um `01-discovery.md` inicial.

---

### `tech-os doctor`
Faz um diagnóstico de saúde do projeto: verifica se há Git inicializado, se o `.gitignore` protege `.env`, se `.tech-os/00-manifesto.md` existe, quais runners (`claude`, `codex`) estão no PATH e roda o **Secret Guard** nas alterações locais.

---

### `tech-os status`
Faz uma leitura da pasta `.tech-os/` e exibe um painel no terminal com:
- Status da fundação (`00-manifesto.md` e `_dominio.md`).
- Todas as features iniciadas e quais fases já foram concluídas (`discovery`, `blueprint`, `contratos`, `plano`).
- Quantas fatias foram concluídas (`X/Y`) e qual é a **próxima fatia desbloqueada** (`[AUTO]` ou `[HUMANO]`).

---

### `tech-os run <feature> [maxIterations]`
O orquestrador autônomo em **contexto limpo**. Ele lê `.tech-os/<feature>/04-plano.md` e executa uma fatia por iteração:
1. Seleciona a próxima fatia `[ ]` cujas dependências (`deps`) já estejam `[x]`.
2. Se a fatia for `[HUMANO]`, pausa e avisa o que precisa da sua validação antes de continuar.
3. Se for `[AUTO]`, monta um prompt enxuto contendo **apenas**: `00-manifesto.md`, `_dominio.md`, `02-blueprint.md`, `03-contratos.md` (se existir) e a fatia atual.
4. Chama o agente CLI configurado, roda o comando de verificação (DoD) e, se passar, marca `[x]` e faz `git commit -m "feat(<ID>): <descrição>"`.

**Flags disponíveis:**
- `-r, --runner <runner>` — CLI usada para executar a fatia: `claude` (padrão), `codex` ou `custom`.
- `--cmd <comando>` — Comando customizado quando `--runner custom` (recebe o prompt via `stdin`).
- `--test-cmd <comando>` — Sobrescreve o comando de verificação (DoD) definido no `00-manifesto.md`.
- `--dry-run` — Apenas imprime o prompt em contexto limpo no terminal sem executar o agente.
- `--no-commit` — Não cria commit git automático ao concluir a fatia.

**Exemplos:**
```bash
# Visualizar exatamente o prompt que seria enviado para a IA
tech-os run 001-auth-jwt --dry-run

# Rodar até 5 fatias usando Claude Code
tech-os run 001-auth-jwt 5

# Rodar usando um comando customizado e sem commit automático
tech-os run 001-auth-jwt --runner custom --cmd "meu-agente" --no-commit
```

---

### `tech-os guide`
Exibe no terminal um resumo didático da metodologia (por que usar, os 4 tipos de incógnitas, regra de ouro, fluxo das 6 skills e comandos). Ideal para apresentar o framework para amigos ou colegas.

---

## Fluxo das Skills (`tos-*`)

No chat do seu agente (Antigravity, Claude Code, Cursor), você aciona as skills digitando **`/tos-...`** (no Antigravity/Claude Code) ou pedindo em linguagem natural (ex.: *"Use a skill `tos-discovery`"*):

| Ordem | Skill | Arquivo gerado | Objetivo |
| :--- | :--- | :--- | :--- |
| **0** | **`tos-manifesto`** | `.tech-os/00-manifesto.md`<br>`.tech-os/_dominio.md` | Define stack, segurança, DoD e vocabulário do projeto. Roda **1x por projeto**. |
| **1** | **`tos-discovery`** | `01-discovery.md` | Entrevista você pergunta por pergunta para revelar **Unknown Knowns** e **Unknown Unknowns** antes de codar. |
| **2** | **`tos-blueprint`** | `02-blueprint.md` | Formaliza o PRD técnico com User Stories, módulos afetados, testes e classificação de impacto (**`local`** vs **`estrutural`**). |
| **2.5** | **`tos-design`** | `02-design.md` *(opcional)* | Define hierarquia visual, estados (`loading`, `empty`, `error`, `success`), responsividade e acessibilidade. Usa **shadcn/ui** como padrão se nenhum design system for especificado. |
| **3** | **`tos-contratos`** | `03-contratos.md` *(opcional)* | Detalha rotas de API, schemas de dados, códigos de erro e regras de segurança. |
| **4** | **`tos-planejar`** | `04-plano.md` | Quebra a entrega em fatias executáveis (`F01`, `F02`...) com dependências e marcação `[AUTO]` ou `[HUMANO]`. |
| **5** | **`tos-security`** | *(auditoria)* | Audita segredos, validação de input, auth, PII em logs e dependências antes de fechar PR/feature. |
| **6** | **`tos-sync`** | *(atualiza os `.md`)* | Atualiza a especificação **antes** do código quando um requisito muda no meio do caminho (evita *spec drift*). |

---

## Estrutura de Arquivos no Projeto

```text
seu-projeto/
├── AGENTS.md                   # Regras permanentes (Antigravity / Codex)
├── CLAUDE.md                   # Regras permanentes (Claude Code, opcional)
├── .agents/skills/tos-*/       # Skills instaladas para o Antigravity
├── .cursor/rules/tech-os.mdc   # Regras instaladas para o Cursor (opcional)
└── .tech-os/
    ├── 00-manifesto.md         # Lei do projeto (stack, segurança, DoD)
    ├── _dominio.md             # Glossário de negócio
    ├── _design.md              # Padrões visuais e de UI (padrão: shadcn/ui, opcional)
    └── 001-minha-feature/
        ├── 01-discovery.md     # Entendimento e decisões
        ├── 02-blueprint.md     # PRD de engenharia e impacto
        ├── 03-contratos.md     # Contratos técnicos (opcional)
        └── 04-plano.md         # Fatias [AUTO] e [HUMANO]
```

---

## E em projetos que já estão em produção?

**Sim — o Tech OS foi pensado para adoção incremental sem quebrar o que já funciona:**

1. **Zero impacto no código atual:** rodar `npx tech-os init` apenas cria `.tech-os/` e as regras (`AGENTS.md` / `.agents/skills/`). Nenhum arquivo da sua aplicação é alterado.
2. **Mapeamento do padrão existente (`tos-manifesto`):** ao rodar `tos-manifesto`, a IA inspeciona o repositório atual (stack, pastas, testes, linter) e documenta as regras reais em `00-manifesto.md` e `_dominio.md` — evitando que futuras mudanças inventem padrões diferentes.
3. **Padronização daqui para frente:** novas features e correções passam a seguir `tos-discovery` → `tos-blueprint` (com trava para mudanças **`estruturais`**) → `tos-security` → `tos-planejar`.
4. **Mudanças cirúrgicas:** a regra de *"não refatorar o que não está quebrado"* protege sistemas em produção contra alterações gigantes e arriscadas.
5. **Segurança imediata:** `tech-os doctor` e o `Secret Guard` já protegem o repositório contra vazamento de `.env` e credenciais desde o primeiro dia.

---

## Licença

MIT
