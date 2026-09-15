# PRD — Cadastro de Parceiros (Desafio Keeptor)

## Objetivo

Entregar um módulo de **gestão de parceiros** (clientes, fornecedores ou representantes) dentro do boilerplate já fornecido: usuário autenticado consegue **listar**, **cadastrar** e **editar** parceiros com formulário completo, validação coerente no frontend e no PostgreSQL, e interface padronizada via design system próprio sobre PrimeVue.

O produto deste PRD é o escopo do desafio técnico, não um sistema Keeptor em produção. Prioridade: **qualidade de modelagem, padronização de UI e processo documentado** acima de funcionalidades extras.

## Escopo

### Dentro do escopo

- CRUD de parceiros (criar, listar, editar) na rota `/parceiros` (e sub-rotas ou fluxo equivalente definido no PLAN).
- Migration SQL `0003_*` em `backend/migrations/` com regras de negócio no banco.
- Design system em `frontend/src/design-system/` encapsulando PrimeVue; páginas sem import direto de `primevue/*`.
- Uso das tabelas de referência `uf` e `municipio` (IBGE) já existentes.
- Estados de UI: carregamento, erro, lista vazia, validação por campo.
- Documentação em `docs/` e configuração de AI versionada em `.cursor/`.
- Responsividade e acessibilidade básica (labels, foco, mensagens de erro, navegação por teclado onde aplicável).

### Usuários

| Perfil | Descrição | Necessidade |
|--------|-----------|-------------|
| **Usuário autenticado (demo)** | Operador interno logado via Supabase Auth (`desafio@keeptor.com` no ambiente local) | Manter cadastro de parceiros |
| **Avaliador técnico** | Revisa código, migrations, docs e histórico de commits | Entender decisões sem reunião de esclarecimento |

Não há perfis diferenciados (admin vs leitor). Qualquer sessão `authenticated` pode ler e gravar parceiros, conforme políticas RLS definidas na migration.

## Feature: Parceiros

### Visão geral

Uma área autenticada com:

1. **Listagem** — tabela simples com dados principais do parceiro; sem filtros avançados e sem paginação server-side.
2. **Cadastro** — formulário com todos os campos obrigatórios do enunciado.
3. **Edição** — mesmo formulário (ou componente compartilhado) carregando dados existentes.

Fluxo principal: listagem → novo parceiro → salvar → volta à listagem; listagem → editar → salvar → volta à listagem.

### Campos

| Campo | Obrigatório | Observação |
|-------|-------------|------------|
| Razão social | Sim | Texto |
| Nome fantasia | Sim | Texto |
| CNPJ | Sim | 14 dígitos; unicidade no sistema |
| Inscrição estadual | Não | Texto livre |
| Telefone | Sim | Armazenamento normalizado (apenas dígitos) |
| E-mail | Sim | Formato validado |
| Data de início do relacionamento | Sim | Data (sem hora) |
| Limite de crédito | Sim | Valor em reais; ver regra 0 vs vazio no ADR-001 |
| Ativo | Sim | Booleano (sim/não) |
| CEP | Sim | 8 dígitos |
| UF | Sim | Seleção; catálogo `uf` |
| Município | Sim | Seleção dependente da UF; FK `municipio` |
| Bairro | Sim | Texto livre (sem tabela de bairros) |
| Logradouro | Sim | Texto |
| Número | Sim | Texto (permite “S/N”) |
| Complemento | Não | Texto |

Metadados de auditoria (ex.: `created_at`, `updated_at`) fazem parte da modelagem técnica; não são campos do formulário.

### Regras de negócio

- **CNPJ único** em todo o sistema; tentativa duplicada (inclusive concorrente) deve falhar no banco e exibir mensagem compreensível na UI.
- **Parceiro estrangeiro sem CNPJ** não é suportado neste escopo (decisão documentada no ADR-001).
- **Um endereço por parceiro**; não há segundo endereço nem histórico de endereços.
- **Parceiro inativo** permanece no banco; pode ser **reativado** editando o flag `ativo`.
- **Município** deve pertencer à **UF** selecionada; inconsistência rejeitada na aplicação e, quando possível, no banco.
- **Limite de crédito** ≥ 0; campo vazio no formulário equivale a **0** (não a `NULL`).
- Regras críticas (unicidade, formato, FK, checks) devem existir no **PostgreSQL**, não apenas no frontend.

### Critérios de aceite

- [ ] Migration `0003_*` aplicada via fluxo oficial (`docker-compose` + `npm run reset` quando necessário) e stack passa em `npm run smoke`.
- [ ] Tabelas de parceiros com constraints, índices e permissões/RLS coerentes com o ADR-001.
- [ ] Usuário logado acessa listagem em `/parceiros` e vê parceiros cadastrados ou estado vazio.
- [ ] Usuário cadastra parceiro com todos os campos obrigatórios; sucesso redireciona ou atualiza listagem com feedback.
- [ ] Usuário edita parceiro existente; alterações persistem.
- [ ] CNPJ duplicado exibe erro amigável (origem: constraint unique).
- [ ] UF alterada recarrega opções de município; município inválido para a UF não é aceito.
- [ ] Nenhuma página importa `primevue/*` diretamente; `npm run lint` passa.
- [ ] `npm run build` e `npm run typecheck` passam no frontend.
- [ ] Documentação em `docs/` atualizada; README da raiz descreve entrega, lacunas e melhorias futuras.

### Fora do escopo

- Exclusão física de parceiros (hard delete).
- Múltiplos endereços por parceiro.
- Parceiros sem CNPJ / documento estrangeiro alternativo.
- Tabela ou catálogo de bairros.
- Filtros, busca avançada e paginação server-side na listagem.
- Importação em massa, anexos, histórico de alterações, workflow de aprovação.
- Perfis de acesso distintos ou multi-tenant.
- Integração ViaCEP ou serviços externos de endereço (pode ser melhoria futura).
- Storybook (opcional; só se couber no tempo sem prejudicar itens principais).
- Testes automatizados obrigatórios (opcionais; ver PLAN).

## Referências

- `README.md` na raiz do repositório (requisitos e critérios de avaliação).
- `docs/PLAN.md` — ordem de implementação.
- `docs/ADR-001-modelagem-parceiros.md` — decisões de banco.
- `docs/ADR-002-design-system.md` — decisões de UI.
