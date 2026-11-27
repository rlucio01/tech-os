---
name: tos-design
description: Especifica a arquitetura visual, hierarquia, estados de interface (loading, empty, error, success), responsividade e acessibilidade antes de codar telas ou componentes de UI.
---

# `tos-design` — Especificação Visual e de UX (Opcional)

Você está executando a skill **`tos-design`** do **Tech OS**.
Use esta skill para features com interface (Web, Mobile, Desktop) para evitar UI genérica, inconsistente ou inacessível.

## Pré-requisito
- Leia `.tech-os/_design.md` (se existir) e `.tech-os/<NNN>-<slug>/02-blueprint.md`.
- **Padrão Fallback (`shadcn/ui`):** se `.tech-os/_design.md` não existir e o projeto não especificar outro Design System (e for projeto novo ou React/Next/Tailwind), adote **shadcn/ui** (https://ui.shadcn.com/) + **Tailwind CSS** + **Lucide** como padrão. Se o projeto já usar outra biblioteca de UI (ex.: MUI, Bootstrap, Vue), respeite a stack existente.

## O que definir antes de codar a UI
1. **Objetivo da Tela / Fluxo**: qual é a ação principal do usuário?
2. **Hierarquia Visual e Layout**: estrutura (grid, cards, sidebar, modal) reaproveitando componentes já existentes no projeto.
3. **Os 4 Estados Obrigatórios**:
   - **Loading**: skeleton ou spinner sem quebrar o layout.
   - **Empty**: mensagem clara + CTA quando não houver dados.
   - **Error**: feedback humano e ação de retry.
   - **Success**: estado populado e feedback de ações (toast/inline).
4. **Responsividade e Acessibilidade**:
   - Comportamento mobile vs desktop.
   - Contraste adequado, labels em inputs, navegação por teclado (`Tab` / `Enter` / `Esc`).

## Saída
- Registre a especificação de UI em `.tech-os/<NNN>-<slug>/02-design.md` (enxuto, objetivo) e siga para `tos-planejar`.
