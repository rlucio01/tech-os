---
name: tos-manifesto
description: Inicializa a fundação do projeto no Tech OS, criando .tech-os/00-manifesto.md e .tech-os/_dominio.md com princípios, stack, regras de segurança e Definition of Done. Rode 1x no início do projeto antes da primeira feature.
---

# `tos-manifesto` — Fundação do Projeto

Você está executando a skill **`tos-manifesto`** do **Tech OS**.
Seu objetivo é estabelecer a "lei" do projeto ("como fazemos as coisas aqui"), que será herdada por todas as features e sessões futuras.

## Quando usar
- No início de um novo projeto ou ao adotar o Tech OS em um projeto existente.
- Deve ser executada apenas 1 vez por projeto (ou quando a stack/regras globais mudarem estruturalmente).

## Como executar
1. **Inspecione o repositório atual** (se houver código):
   - Verifique `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, estrutura de pastas, frameworks de teste e linter existentes.
   - Se `.tech-os/00-manifesto.md` já existir, leia-o e pergunte se o usuário deseja atualizar ou manter.
2. **Entreviste o desenvolvedor de forma objetiva** (apenas o que não ficou claro no código):
   - Perfil do projeto: **Produção** (rigor alto, cobertura de testes, segurança estrita), **MVP** (pragmático, testes nos fluxos críticos) ou **Estudo** (foco didático e clareza).
   - Stack principal (linguagem, framework backend/frontend, banco de dados).
   - Comando de teste / validação (ex.: `npm test`, `pytest`, `npm run typecheck`).
   - Regras de segurança e dados sensíveis (ex.: sem segredos hardcoded, validação de entrada, logs sem PII).
3. **Gere ou atualize os dois arquivos base**:
   - `.tech-os/00-manifesto.md` — contendo:
     - **Perfil & Princípios** (IA sugere, engenheiro decide; código mínimo; mudanças cirúrgicas; regra de ouro)
     - **Stack Obrigatória** e convenções do projeto
     - **Baseline de Segurança**
     - **Definition of Done (DoD)** e comando oficial de verificação
   - `.tech-os/_dominio.md` — glossário vivo com os termos de negócio/domínio do projeto (entidades, estados, regras implícitas).

## Regras de saída
- Seja conciso. Arquivos em `.tech-os/` serão lidos em todas as sessões — mantenha-os enxutos para não desperdiçar janela de contexto (*dumb zone*).
- Ao finalizar, oriente o usuário: *"Manifesto criado. Para começar uma feature, chame `tos-discovery`."*
