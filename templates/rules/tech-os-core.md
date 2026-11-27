# Tech OS — Contexto & Regras Permanentes

Este projeto utiliza o **Tech OS** (Spec-Driven Development + Context Engineering).

## Contexto Base do Projeto
Sempre que iniciar uma tarefa, consulte (se existirem):
- `.tech-os/00-manifesto.md` — regras, stack, segurança e DoD do projeto
- `.tech-os/_dominio.md` — vocabulário e regras de negócio
- `.tech-os/_design.md` — padrões visuais e de UI (se houver frontend)

## Princípios Inegociáveis
1. **IA sugere; engenheiro decide.** Nunca tome decisões arquiteturais silenciosas.
2. **Pense antes de programar.** Declare premissas e pergunte quando houver ambiguidade.
3. **Código mínimo que resolve o problema.** Sem overengineering ou abstrações especulativas.
4. **Mudanças cirúrgicas.** Altere apenas o que tem relação direta com o pedido.
5. **Regra de Ouro:** O desenvolvedor precisa conseguir explicar a mudança sem abrir o chat.

## Padrão de Design (Fallback Inteligente)
Se a tarefa envolver Frontend/UI e **nenhum Design System estiver especificado** (nem em `.tech-os/_design.md`, nem no pedido):
- Para projetos novos ou stacks React/Next.js/Tailwind: adote o padrão **shadcn/ui** (`https://ui.shadcn.com/`) com **Tailwind CSS** e ícones **Lucide**, tratando os 4 estados (`loading`, `empty`, `error`, `success`).
- Se o codebase já utilizar outra biblioteca de UI (ex.: Material UI, Bootstrap, Chakra, Vue/Angular), respeite o padrão já existente no projeto.

## Classificação de Impacto
Antes de implementar qualquer mudança:
- **`local`**: não altera API/schema nem cruza fronteiras arquiteturais.
- **`estrutural`**: altera API/eventos/schema, autenticação ou múltiplos módulos -> **peça validação humana antes de codar**.

## Fluxo de Skills Disponíveis
- `tos-manifesto` — cria `00-manifesto.md` e `_dominio.md` (1x por projeto)
- `tos-discovery` — entrevista para mapear incógnitas (`01-discovery.md`)
- `tos-blueprint` — PRD técnico e impacto (`02-blueprint.md`)
- `tos-design` — especificação visual e estados de UI (`02-design.md`, opcional)
- `tos-contratos` — contratos de API/schema/segurança (`03-contratos.md`, opcional)
- `tos-planejar` — plano fatiado `[AUTO]` / `[HUMANO]` (`04-plano.md`)
- `tos-security` — auditoria de segurança antes de fechar PR/feature
- `tos-sync` — atualiza a spec antes do código quando um requisito muda
