# Blueprint: 001-exemplo-todo

## User Stories
- **US-1:** Como usuário, quero criar uma tarefa com título válido para organizar meu dia.
- **US-2:** Como usuário, quero marcar uma tarefa como concluída.

## Módulos
- `src/routes/todos.ts` `[novo]`
- `src/services/todo-service.ts` `[novo]`

## Classificação de Impacto
- **Impacto:** `local` (novo módulo isolado, sem alterar contratos existentes).

## Estratégia de Testes (DoD)
- Testes unitários de validação no `todo-service`.
- Teste de integração nas rotas `POST /todos` e `PATCH /todos/:id/done`.
