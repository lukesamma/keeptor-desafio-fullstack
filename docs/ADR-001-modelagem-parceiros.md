# ADR-001 — Modelagem de parceiros

## Status

**Aceito** — 2026-03-13

## Contexto

O desafio exige cadastro de parceiros com dados cadastrais, contato, crédito, status e endereço, usando as tabelas IBGE `uf` e `municipio` já existentes. O enunciado deixa ambiguidades intencionais; esta ADR registra as decisões para implementação na migration `0003_*`.

Restrições:

- PostgreSQL 15, migrations em `backend/migrations/`, numeração a partir de `0003_`.
- Acesso via PostgREST/supabase-js com JWT `authenticated`.
- Regras críticas no banco (não só no frontend).

## Decisão

### Entidade e relacionamentos

Uma única tabela **`public.parceiro`** concentra dados cadastrais, contato, crédito, status e **endereço** (colunas de endereço na mesma linha).

```
uf (existente)
  ↑
  │ (referência lógica + validação)
  │
municipio (existente) ←── municipio_id (FK)
  │
parceiro (nova)
```

- **`parceiro.municipio_id`** → `municipio(id)` **NOT NULL** (FK).
- **UF no formulário** não é coluna redundante obrigatória: a UF é inferida por `municipio.uf_id`. Para validação na UI, o usuário escolhe UF primeiro e depois município; no persistir, grava-se apenas `municipio_id`.
- **Alternativa rejeitada:** tabela `parceiro_endereco` 1:1 — aumenta join na listagem sem benefício no escopo atual (um endereço fixo). Se no futuro houver múltiplos endereços, extrair endereço para tabela própria com migração de dados.

### CNPJ

| Aspecto | Decisão |
|---------|---------|
| Obrigatoriedade | `NOT NULL` — parceiro sem CNPJ (estrangeiro) **fora do escopo** |
| Unicidade | `UNIQUE` em todo o sistema |
| Armazenamento | `char(14)` apenas dígitos (normalizado na aplicação antes do insert/update) |
| Validação | `CHECK (cnpj ~ '^[0-9]{14}$')` — dígitos verificadores validados no frontend; opcionalmente função SQL futura |
| Concorrência | Unicidade garantida pelo índice unique; segunda transação recebe erro `23505` |

**Motivo:** o domínio é empresas brasileiras; simplifica constraints e formulário. Estrangeiro exigiria outro identificador e fluxo não pedido.

### Endereço

| Campo | Tipo / regra |
|-------|----------------|
| `cep` | `char(8)` NOT NULL, `CHECK` 8 dígitos |
| `bairro` | `text` NOT NULL — **texto livre** (sem FK para tabela de bairros) |
| `logradouro` | `text` NOT NULL |
| `numero` | `text` NOT NULL (aceita “S/N”) |
| `complemento` | `text` NULL |

**Motivo:** IBGE não fornece bairros; criar catálogo seria escopo inventado.

### UF e município

- Persistência: somente **`municipio_id`** (FK).
- UI: select de UF → query `municipio` com `uf_id = :uf` (PostgREST).
- Integridade: FK `municipio_id` já garante município existente; a aplicação garante que o município pertence à UF escolhida antes do submit (evita troca de UF com município antigo selecionado).

**Alternativa considerada:** coluna `uf_id` redundante em `parceiro` com `CHECK` contra `municipio` — rejeitada para evitar duas fontes de verdade; trigger de consistência só se surgir necessidade real.

### Limite de crédito

- Tipo: `numeric(15, 2) NOT NULL DEFAULT 0`
- Regra: `CHECK (limite_credito >= 0)`
- **Zero vs em branco:** campo vazio no formulário → **0**; não usamos `NULL` para “não informado”.

**Motivo:** evita três estados (null / zero / positivo) sem regra de negócio clara no enunciado; zero comunica “sem limite concedido” de forma explícita no relatório e na listagem.

### Ativo

- Tipo: `boolean NOT NULL DEFAULT true`
- **Desativação:** `ativo = false` — registro permanece.
- **Reativação:** permitida via edição (`ativo = true`).

Não há exclusão física no escopo.

### Demais campos cadastrais

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| `id` | `uuid` PK | `gen_random_uuid()` default |
| `razao_social` | `text` | NOT NULL, `length(trim(...)) > 0` via CHECK ou validação app |
| `nome_fantasia` | `text` | NOT NULL |
| `inscricao_estadual` | `text` | NULL |
| `telefone` | `varchar(11)` ou `text` | NOT NULL; armazenar só dígitos, CHECK tamanho mínimo (ex. 10–11) |
| `email` | `text` | NOT NULL; CHECK básico de formato ou confiar em app + citext futuro |
| `data_inicio_relacionamento` | `date` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()`; atualizar via trigger ou app |

### Índices

| Índice | Coluna(s) | Motivo |
|--------|-----------|--------|
| PK | `id` | Identificação |
| Unique | `cnpj` | Unicidade + lookup na edição |
| FK (implícito) | `municipio_id` | Postgres não indexa FK automaticamente em todos os casos — **criar** `parceiro_municipio_id_idx` para joins e filtros futuros |
| Opcional | `ativo` | Listagem simples pode filtrar ativos no futuro; índice parcial `(ativo) WHERE ativo` só se necessário — **não obrigatório** na v1 |

Listagem sem paginação server-side: índice em `created_at DESC` é opcional para ordenação estável.

### Constraints resumidas

- FK `municipio_id` → `municipio(id)`
- UNIQUE `cnpj`
- CHECK CNPJ, CEP, telefone, `limite_credito >= 0`
- NOT NULL nos campos obrigatórios do PRD

### Permissões e RLS

- `GRANT` adequado para `anon` / `authenticated` / `service_role` conforme padrão das migrations geo.
- **RLS habilitado** em `parceiro` com políticas para role `authenticated`:
  - `SELECT`, `INSERT`, `UPDATE` permitidos para usuários autenticados (ambiente demo single-tenant).
- `anon` sem acesso a `parceiro` (dados de negócio não públicos).

**Motivo:** alinha com comentário da `0001_geo` (“nas SUAS tabelas, avalie RLS”); PostgREST respeita RLS com JWT.

### Trigger `updated_at` (recomendado)

Função `set_updated_at()` + trigger `BEFORE UPDATE` em `parceiro` para manter `updated_at` sem depender só do client.

## Alternativas consideradas

| Tema | Alternativa | Por que não |
|------|-------------|-------------|
| Endereço | Tabela `parceiro_endereco` 1:N | Escopo pede um endereço; YAGNI |
| CNPJ | UNIQUE parcial / soft delete | Sem delete no escopo; unique simples |
| Crédito | `NULL` = não definido | Ambíguo para usuário e relatório |
| Bairro | Tabela `bairro` | Sem seed; custo alto sem valor |
| UF | Coluna `uf_id` em `parceiro` | Redundante com `municipio.uf_id` |

## Consequências

- Listagem e formulário usam uma tabela; queries simples.
- Troca de UF no formulário deve limpar ou revalidar município no frontend.
- Parceiros internacionais exigiriam nova ADR e colunas opcionais de documento.
- Migration `0003` deve ser registrada no `docker-compose.yml`; ambiente existente precisa `npm run reset`.

## Implementação

- Arquivo: `backend/migrations/0003_parceiros.sql` (nome a confirmar na implementação).
- Após merge da migration: reset local, smoke, testes manuais de insert duplicado de CNPJ.
