---
name: tos-design
description: Especifica a arquitetura visual, hierarquia, estados de interface (loading, empty, error, success), responsividade e acessibilidade antes de codar telas ou componentes de UI.
---

# `tos-design` — Especificação Visual e de UX (Opcional)

Você está executando a skill **`tos-design`** do **Tech OS**.
Use esta skill para features com interface (Web, Mobile, Desktop) para evitar UI genérica, inconsistente ou inacessível.

## Pré-requisito
- Leia `.tech-os/_design.md` (se existir) e `.tech-os/<NNN>-<slug>/02-blueprint.md`.
- Se `.tech-os/_design.md` ainda não existir e o projeto tiver frontend, sugira criar um com paleta, tipografia e stack de UI.

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
