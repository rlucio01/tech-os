# _design.md — Padrões Visuais do Projeto

> Lido pela skill `tos-design`. Já vem pré-configurado com o padrão **shadcn/ui** — altere apenas se o projeto adotar outro Design System.

## Stack de UI (Padrão: shadcn/ui)
- **Design System / Componentes:** `shadcn/ui` (https://ui.shadcn.com/) — componentes acessíveis, limpos e copiáveis
- **Styling:** `Tailwind CSS` (tokens semânticos: `background`, `foreground`, `primary`, `muted`, `destructive`, `border`)
- **Ícones:** `Lucide` (`lucide-react`)

## Identidade Visual
- **Tema:** Sistema / Light & Dark via variáveis CSS (`--background`, `--foreground`, etc.)
- **Tipografia:** Sans-serif moderna (`Inter` / `Geist`) + Mono para código (`JetBrains Mono`)
- **Espaçamento & Raio:** Escala padrão Tailwind, bordas consistentes (`rounded-md` / `rounded-lg`)

## Regras de UX
- Toda tela assíncrona deve tratar os 4 estados: `loading`, `empty`, `error` e `success`.
- Reutilizar componentes `shadcn/ui` existentes em `components/ui/` antes de criar novos.
- Garantir contraste adequado, labels em inputs e navegação por teclado (`Tab` / `Enter` / `Esc`).
