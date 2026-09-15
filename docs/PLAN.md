# PLAN — Implementação do desafio Keeptor

Plano incremental por feature, alinhado aos pesos de avaliação: **padronização (35%)**, **modelagem (25%)**, **processo (25%)**, **entrega funcional (15%)**.

Status legend: `⬜` pendente · `🔄` em andamento · `✅` concluído

| # | Fase | Status | Entregável principal |
|---|------|--------|----------------------|
| 1 | Setup e baseline | ✅ | Ambiente `10/10` smoke; `.env` coerente |
| 2 | Análise da arquitetura | ✅ | Análise no chat + este PLAN/PRD |
| 3 | Modelagem do banco | ✅ | ADR-001 aprovado (documento) |
| 4 | Migration | ✅ | `0003_*.sql` + volume no `docker-compose.yml` |
| 5 | Design System | ✅ | Wrappers em `design-system/` + ADR-002 |
| 6 | Listagem | ✅ | Tabela + estados vazio/loading/erro |
| 7 | Cadastro | ✅ | Formulário create + persistência |
| 8 | Edição | ✅ | Load by id + update |
| 9 | Validações | ✅ | Zod no frontend + erros de constraint (CNPJ etc.) |
| 10 | Responsividade | ✅ | Grid/form em mobile e desktop |
| 11 | Acessibilidade | ✅ | Labels, `aria-*`, foco, alertas |
| 12 | Testes | ✅ | `npm run check` + Vitest; smoke separado |
| 13 | Documentação | ✅ | README entrega + índice `docs/` + AI-DEVELOPMENT |
| 14 | Revisão final | ✅ | `docs/REVISAO-FINAL.md`, check + smoke 10/10 |

---

## 1. Setup e baseline

- [x] `npm run setup` (`.env` raiz e frontend derivado).
- [x] `npm run up` e `npm run smoke` → **10/10 OK**.
- [x] `cd frontend && npm install`, `npm run dev` (validação manual de login).
- [ ] Repetir smoke após cada alteração que afete Docker/migrations.

## 2. Análise da arquitetura

- [x] Mapear stack: Kong → GoTrue + PostgREST → Postgres.
- [x] Mapear frontend: router guard, `ParceirosPage` vazia, design system vazio, ESLint trava PrimeVue.
- [x] Registrar riscos: migrations só no primeiro boot; montar `0003` no compose.

## 3. Modelagem do banco

- [x] Decidir ambiguidades (CNPJ, endereço, crédito, ativo, bairro) → **ADR-001**.
- [ ] Revisar ADR-001 após primeira migration (ajustar se necessário).

## 4. Migration

- [x] Criar `backend/migrations/0003_parceiros.sql` (nome final conforme ADR-001).
- [x] Adicionar bind de volume em `backend/docker-compose.yml` (padrão `0001`/`0002`).
- [x] `npm run reset` + `npm run smoke` (10/10).
- [x] Validar constraints no psql (insert OK; CNPJ duplicado → `parceiro_cnpj_unico`).

## 5. Design System

- [x] Definir contrato comum (props/eventos) → **ADR-002** + `fieldTypes.ts`.
- [x] Implementar wrappers na ordem de dependência do formulário:
  - `AppInput`, `AppMaskedInput`, `AppDatePicker`, `AppCurrencyInput`, `AppSwitch`, `AppSelect`, `AppButton`, `useAppToast` + `AppToastHost`, `AppDataTable`.
- [x] `npm run lint` / `typecheck` / `build` OK.
- [x] Documentar contrato em `design-system/README.md` e ADR-002.

## 6. Listagem

- [x] Tipos e função `listarParceiros()` via supabase-js.
- [x] Página ou seção listagem com wrapper de tabela (`features/partners/PartnerList.vue`).
- [x] Ação “Novo” e “Editar”; estado vazio com CTA (rotas `parceiros-novo` / `parceiros-editar`).

## 7. Cadastro

- [x] Rota ou modo `novo` (`/parceiros/novo` → `PartnerForm.vue`).
- [x] Formulário com todos os campos do PRD.
- [x] UF → carregar municípios filtrados (`geoService` + `useUfMunicipio`).
- [x] Submit com loading e prevenção de duplo envio (`criarParceiro`).

## 8. Edição

- [x] Rota `/parceiros/:id/editar` + `PartnerForm` modo `edit`.
- [x] Carregar registro; UF antes de municípios (`carregarMunicipios` após `uf_id`).
- [x] `atualizarParceiro` via supabase-js; `updated_at` no trigger do Postgres.

## 9. Validações

- [x] Zod em `schemas/partnerFormSchema.ts`; blur/submit no `PartnerForm`.
- [x] `apiError.ts`: `23505` / `23514` + nomes de constraint → mensagens em português e campo.
- [x] Regras críticas no Postgres (`0003_parceiros.sql`); Zod espelha para UX.

## 10. Responsividade

- [x] Grid do formulário: `grid-cols-1` + `sm:grid-cols-2`; botões `fluid` no mobile.
- [x] `AppDataTable` com `overflow-x-auto` e `min-w` para scroll horizontal.
- [x] `AppLayout` e features com `w-full`, `max-w-6xl`, `px-4 sm:px-6`.

## 11. Acessibilidade

- [x] `AppFieldLayout`: `label` + `for`/`id`; obrigatório com `sr-only`.
- [x] Erros `role="alert"` + `aria-describedby` / `aria-invalid` nos wrappers.
- [x] Foco visível em `style.css` (controles PrimeVue) e links da listagem.
- [x] Botões e ações com texto explícito (ex.: “Editar parceiro”).

## 12. Testes

- [x] `npm run check` na raiz: lint, typecheck, `vitest run`, build do frontend.
- [x] Vitest: `cnpj`, `partnerValidation`, `apiError` (`frontend/src/**/*.test.ts`).
- [x] `npm run smoke` (10 passos) — ambiente Docker; rodar antes de entregar.
- [x] Storybook (`src/design-system/stories/`, `npm run storybook`).
- [x] Playwright E2E: login → listagem → novo parceiro (`frontend/e2e/`, requer `npm run up` + smoke).

## 13. Documentação

- [x] PRD, PLAN, ADR-001, ADR-002, ADR-003, AI-DEVELOPMENT.
- [x] PLAN com status por fase; AI-DEVELOPMENT com histórico até testes/Storybook.
- [x] README raiz: seção **Implementação (entrega)** (feito, fora do escopo, próximos passos).
- [x] `docs/README.md` como índice dos artefatos.

## 14. Revisão final

- [x] DoD da skill — checklist em [`docs/REVISAO-FINAL.md`](REVISAO-FINAL.md).
- [x] `.cursor/` — só `skills/keeptor-fullstack-challenge/SKILL.md`; sem MCP/tokens.
- [x] Commits semânticos na branch `feat/partners` (11+ commits após baseline).
- [x] `npm run check` + `npm run smoke` 10/10 (2026-03-14); login manual descrito em REVISAO-FINAL.

---

## Ordem de ataque (resumo)

```
ADR/docs → migration → design system (mínimo para form) → cadastro vertical
→ edição → listagem → validações/UX → docs/README final
```

Se o tempo apertar, cortar na ordem: testes automatizados → Storybook → polish visual → migração do login para design system.

## Mudanças de plano

| Data | Mudança | Motivo |
|------|---------|--------|
| 2026-03-13 | Criação do PLAN | Baseline do desafio após análise do repositório |
| 2026-03-14 | Fases 6–12 | CRUD parceiros, Zod, a11y/responsivo, Vitest/Storybook/Playwright |
| 2026-03-14 | Fase 13 | README de entrega + índice `docs/` + AI-DEVELOPMENT atualizado |
| 2026-03-14 | Fase 14 | `REVISAO-FINAL.md`, DoD + check + smoke 10/10 |

Registrar aqui qualquer desvio relevante antes de implementar.
