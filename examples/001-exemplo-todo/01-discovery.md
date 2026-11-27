# Discovery: 001-exemplo-todo

slug: exemplo-todo
escopo: feature

## Problema
Usuários precisam criar e concluir tarefas rapidamente sem recarregar a página.

## Solução Acordada
Endpoint `POST /todos` e `PATCH /todos/:id/done` com validação de título não vazio e persistência em SQLite.

## Decisões e Premissas
- Título máximo de 120 caracteres.
- Sem autenticação nesta fase (app local).

## Fora de Escopo
- Compartilhamento entre usuários e anexos.
