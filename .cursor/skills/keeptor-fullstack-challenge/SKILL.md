---
name: keeptor-fullstack-challenge
description: Conduz o desenvolvimento do desafio técnico Fullstack Vue.js/PostgreSQL da Keeptor com foco máximo nos critérios de avaliação: padronização via design system sobre PrimeVue, modelagem PostgreSQL, processo/documentação, uso responsável de AI e entrega funcional. Use ao planejar, implementar, revisar, testar ou documentar qualquer parte do desafio.
---

# Keeptor Fullstack Challenge

## Objetivo

Atuar como um agente técnico sênior responsável por conduzir o desafio da Keeptor de forma incremental, explicável e alinhada ao README oficial.

O objetivo não é apenas "fazer funcionar". O resultado deve demonstrar:

1. Padronização de componentes e telas.
2. Boa modelagem PostgreSQL.
3. Processo de desenvolvimento documentado.
4. Uso criterioso de AI.
5. Entrega funcional, responsiva e acessível.

## Contexto obrigatório do desafio

Stack obrigatória:

- Vue 3.5
- Composition API
- `<script setup>`
- TypeScript 5.8
- PrimeVue 4.5
- Tailwind CSS 4.3
- PostgreSQL 15
- Docker
- Vite 7.3
- vue-router 4
- supabase-js 2

Não usar:

- Vue 2
- Options API
- jQuery
- Bootstrap
- Vuetify
- Element Plus
- Quasar
- outra biblioteca de componentes além do PrimeVue

Dependências opcionais devem ser adicionadas somente quando houver justificativa clara. Exemplos: Pinia, Zod/Valibot, TanStack Query, máscara, Storybook, Vitest e Playwright.

## Regra crítica: Design System

NUNCA importar componentes diretamente de `primevue/*` em páginas, views ou componentes de negócio.

Todo componente PrimeVue deve estar encapsulado em um componente próprio dentro de:

`frontend/src/design-system/`

Exemplo conceitual:

- `AppInput.vue` encapsula o input do PrimeVue.
- `AppSelect.vue` encapsula o select do PrimeVue.
- `AppDatePicker.vue` encapsula o date picker.
- `AppCurrencyInput.vue` encapsula entrada monetária.
- `AppSwitch.vue` encapsula booleano.
- `AppButton.vue` encapsula botão.
- `AppDataTable.vue` encapsula tabela.

Os nomes exatos devem ser decididos durante a implementação, considerando reutilização real.

### Contrato consistente

Os componentes do design system devem buscar consistência em:

- `v-model`
- `label`
- mensagens de erro
- estado de loading
- disabled
- acessibilidade
- props
- eventos
- slots
- aparência
- espaçamento

Antes de criar um novo componente, verificar se um componente existente pode ser estendido.

Não duplicar wrappers apenas para resolver uma necessidade de uma única tela.

## Escopo funcional

Implementar:

- cadastro de parceiros
- listagem de parceiros
- edição de parceiros
- formulário com:
  - razão social
  - nome fantasia
  - CNPJ
  - inscrição estadual opcional
  - telefone
  - e-mail
  - data de início do relacionamento
  - limite de crédito
  - ativo
  - CEP
  - UF
  - município
  - bairro
  - logradouro
  - número
  - complemento

A listagem pode ser simples, sem filtros e sem paginação server-side.

Priorizar qualidade do formulário e da modelagem.

## PostgreSQL

As alterações de banco devem ser feitas por migrations SQL em:

`backend/migrations/`

As migrations de parceiros devem começar em `0003_`.

Não criar tabelas manualmente apenas pelo Supabase Studio como solução de entrega.

As regras de negócio relevantes devem estar no PostgreSQL sempre que possível, usando:

- NOT NULL
- UNIQUE
- CHECK
- FOREIGN KEY
- índices
- tipos adequados
- defaults
- relacionamentos
- normalização apropriada

Pensar explicitamente sobre:

- unicidade do CNPJ
- relacionamento UF -> município
- valores monetários
- datas
- campos opcionais
- estado ativo/inativo
- concorrência
- integridade referencial

O desafio possui ambiguidades intencionais. Não perguntar ao avaliador sobre elas. Decidir, registrar em ADR e implementar.

Ambiguidades conhecidas:

- múltiplos endereços por parceiro
- unicidade de CNPJ
- parceiro estrangeiro sem CNPJ
- bairro como texto ou tabela
- reativação de parceiro
- diferença entre limite de crédito zero e nulo

## Documentação obrigatória

Manter documentação em `docs/`.

Criar, no mínimo:

- `docs/PRD.md`
- `docs/PLAN.md`
- `docs/ADR-001-modelagem-parceiros.md`
- `docs/ADR-002-design-system.md`
- `docs/AI-DEVELOPMENT.md`

Adicionar specs adicionais se ajudarem a explicar o trabalho.

### PLAN

O plano deve dividir o trabalho por feature e ordem de implementação.

Exemplo:

1. entendimento e inspeção do projeto
2. decisão de modelagem
3. migration
4. design system
5. camada de dados
6. tela de listagem
7. formulário de criação
8. edição
9. validações
10. acessibilidade/responsividade
11. testes/verificações
12. documentação final

Atualizar o plano quando o caminho mudar.

### ADR

Toda decisão arquitetural relevante deve registrar:

- contexto
- decisão
- alternativas consideradas
- consequências
- motivo

Não registrar decisões triviais.

## Uso de AI

O agente deve agir como copiloto técnico, não como gerador cego de código.

Antes de implementar uma feature:

1. inspecionar os arquivos relevantes;
2. identificar padrões existentes;
3. verificar scripts disponíveis;
4. verificar migrations existentes;
5. verificar contratos/API existentes;
6. verificar componentes reutilizáveis;
7. registrar decisões importantes;
8. somente então implementar.

Nunca reescrever grandes áreas sem necessidade.

Preferir mudanças pequenas e verificáveis.

Se uma abordagem estiver incerta, explicar a hipótese no documento de processo.

O código final deve ser compreensível pelo desenvolvedor que o entregará.

## Fluxo de implementação

### Fase 0 — Baseline

Antes de alterar código:

- executar `npm run setup`
- executar `npm run up`
- executar `npm run smoke`
- confirmar `10/10 OK`
- instalar frontend com `cd frontend && npm install`
- executar `npm run dev`
- validar login manualmente

Se o smoke test falhar, diagnosticar ambiente antes de alterar código da feature.

### Fase 1 — Reconhecimento

Inspecionar:

- `package.json`
- `frontend/package.json`
- `frontend/src`
- `frontend/src/pages`
- `frontend/src/design-system`
- `backend/migrations`
- configuração Supabase
- rotas
- autenticação
- scripts

Não assumir a arquitetura sem verificar o repositório.

### Fase 2 — Banco

Criar a migration `0003_...`.

Antes de finalizar:

- conferir foreign keys
- conferir índices
- conferir constraints
- conferir tipos
- conferir nullability
- conferir unicidade
- conferir valores monetários
- conferir datas
- pensar em concorrência

### Fase 3 — Design System

Mapear os controles necessários ao formulário.

Criar wrappers somente quando necessários.

As páginas não podem conhecer detalhes de PrimeVue.

Se trocar PrimeVue por outra biblioteca, a maior parte das páginas deve permanecer intacta.

Registrar no ADR quantos arquivos aproximadamente seriam afetados por uma troca de biblioteca e por quê.

### Fase 4 — Feature

Implementar verticalmente:

1. modelo
2. acesso a dados
3. componente
4. tela
5. validação
6. feedback
7. loading
8. erro
9. vazio
10. acessibilidade
11. responsividade

Evitar construir toda a infraestrutura antes de entregar uma parte funcional.

### Fase 5 — Verificação

Depois de cada bloco relevante:

- lint
- typecheck, se existir
- build
- testes, se existirem
- smoke test quando alterações de infraestrutura/banco afetarem o ambiente
- inspeção manual da funcionalidade

Não afirmar que algo foi validado sem executar a verificação correspondente.

## Regras de qualidade de UI

Manter consistência entre telas:

- espaçamento
- grid
- alinhamento
- labels
- mensagens de erro
- loading
- botões
- estados vazios
- foco
- navegação por teclado
- responsividade

Priorizar interface limpa e consistente em vez de efeitos visuais desnecessários.

## Formulário

O formulário é a parte de maior valor funcional.

Garantir:

- validação no frontend para feedback imediato
- regras críticas também no PostgreSQL
- CNPJ tratado de forma consistente
- telefone tratado de forma consistente
- limite de crédito como valor monetário
- data válida
- UF carregada corretamente
- município dependente da UF
- estados loading/error/empty
- mensagens de erro próximas do campo
- acessibilidade
- prevenção de envio duplicado

Não confiar apenas na validação frontend.

## Concorrência

Sempre considerar que duas pessoas podem tentar cadastrar o mesmo CNPJ simultaneamente.

A proteção de unicidade deve existir no banco.

Tratamento de erro de constraint deve produzir uma resposta compreensível na interface.

## Commits

Commits pequenos e semânticos.

Exemplos:

- `docs: define escopo e plano do desafio`
- `docs: registra decisão de modelagem de parceiros`
- `feat(db): cria estrutura de parceiros`
- `feat(design-system): adiciona campo de texto padronizado`
- `feat(partners): adiciona listagem`
- `feat(partners): adiciona cadastro e edição`
- `fix(partners): trata conflito de cnpj`
- `docs: registra processo de desenvolvimento com ai`

Não fazer um único commit gigante no final.

## Antes de cada commit

Verificar:

- código compila
- lint passa
- arquivos temporários não estão sendo commitados
- secrets não estão presentes
- `.env` não foi incluído
- tokens/MCP keys foram removidos
- documentação corresponde ao estado atual

## AI setup

A configuração usada no desafio deve ser versionada em:

`.cursor/`

Se houver MCP ou configuração com tokens:

- remover secrets
- usar valores vazios
- ou documentar placeholders

Criar/atualizar `docs/AI-DEVELOPMENT.md` com:

- ferramentas AI utilizadas
- onde cada ferramenta foi utilizada
- MCPs utilizados ou declaração de que nenhum foi usado
- skills/agents/rules/commands criados
- documentação fornecida como contexto
- ordem de desenvolvimento
- mudanças de direção
- onde a AI acertou
- onde foi necessário corrigir a AI

A documentação deve ser honesta e técnica.

## Critérios de avaliação

Prioridade de esforço:

1. Padronização — 35%
2. Modelagem de banco — 25%
3. Processo — 25%
4. Entrega funcional — 15%

Não sacrificar os três primeiros critérios tentando adicionar funcionalidades extras.

## Estratégia de escopo

Se houver pouco tempo:

1. banco correto
2. design system consistente
3. cadastro funcionando
4. edição funcionando
5. listagem funcionando
6. validações
7. documentação
8. testes opcionais

Não adicionar features não solicitadas antes de completar o escopo principal.

Se algo ficar de fora:

- registrar no README
- explicar o motivo
- explicar o que seria feito com mais tempo

## Regra de explicabilidade

Qualquer decisão relevante deve ser algo que o desenvolvedor consiga explicar em uma conversa técnica.

Antes de propor uma solução complexa, perguntar:

- isso é necessário para o escopo?
- consigo justificar a decisão?
- aumenta a qualidade mensurável?
- aumenta o risco?
- há uma solução mais simples?

Preferir simplicidade deliberada.

## Comandos de referência

Backend:

```bash
npm run setup
npm run up
npm run smoke
npm run reset
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Antes da entrega:

```bash
npm run smoke
```

E executar os scripts de qualidade disponíveis no `package.json`.

## Organização arquitetural

Adotar arquitetura orientada a features combinada com Design System.

- `design-system/`: componentes visuais reutilizáveis e wrappers PrimeVue.
- `features/`: regras e componentes específicos de cada domínio.
- `pages/`: composição de páginas e integração com router.
- `services/`: infraestrutura compartilhada.
- `composables/`: lógica transversal reutilizável.
- `types/`: tipos compartilhados.
- `utils/`: funções utilitárias sem conhecimento de domínio.

Antes de criar um novo arquivo, determinar se ele:
1. pertence ao Design System;
2. pertence a uma feature específica;
3. é infraestrutura compartilhada.

Não criar abstrações antecipadamente apenas por organização.

## Definition of Done

O desafio só deve ser considerado concluído quando:

- [ ] parceiros podem ser cadastrados
- [ ] parceiros podem ser listados
- [ ] parceiros podem ser editados
- [ ] todos os campos obrigatórios estão contemplados
- [ ] validações estão implementadas
- [ ] regras críticas estão protegidas no PostgreSQL
- [ ] migration `0003_` ou posteriores estão corretas
- [ ] nenhum componente PrimeVue é importado diretamente nas telas
- [ ] design system está documentado
- [ ] estados de erro/loading/vazio existem
- [ ] interface é responsiva
- [ ] acessibilidade básica foi considerada
- [ ] lint/build/typecheck disponíveis passam
- [ ] documentação em `docs/` está atualizada
- [ ] README final informa o que foi feito
- [ ] README informa o que ficou de fora
- [ ] README informa o que seria melhorado com mais tempo
- [ ] `.cursor/` está versionado
- [ ] `docs/AI-DEVELOPMENT.md` está atualizado
- [ ] não existem secrets no repositório
- [ ] histórico possui commits coerentes
- [ ] solução foi revisada para ser explicável em entrevista técnica
