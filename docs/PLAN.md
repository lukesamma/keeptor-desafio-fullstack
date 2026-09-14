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
| 6 | Listagem | ⬜ | Tabela + estados vazio/loading/erro |
| 7 | Cadastro | ⬜ | Formulário create + persistência |
| 8 | Edição | ⬜ | Load by id + update |
| 9 | Validações | ⬜ | Frontend + erros de constraint (CNPJ etc.) |
| 10 | Responsividade | ⬜ | Grid/form em mobile e desktop |
| 11 | Acessibilidade | ⬜ | Labels, `aria-*`, foco, alertas |
| 12 | Testes | ⬜ | Opcional: smoke manual + lint/build; Vitest se couber |
| 13 | Documentação | 🔄 | PRD, PLAN, ADRs, AI-DEVELOPMENT |
| 14 | Revisão final | ⬜ | README entrega, commits, smoke, checklist DoD |

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

- [ ] Tipos e função `listarParceiros()` via supabase-js.
- [ ] Página ou seção listagem com wrapper de tabela.
- [ ] Ação “Novo” e “Editar”; estado vazio com CTA.

## 7. Cadastro

- [ ] Rota ou modo `novo` (ex.: `/parceiros/novo`).
- [ ] Formulário com todos os campos do PRD.
- [ ] UF → carregar municípios filtrados (`uf_id`).
- [ ] Submit com loading e prevenção de duplo envio.

## 8. Edição

- [ ] Rota ou modo `editar/:id`.
- [ ] Carregar registro; preencher UF antes de municípios.
- [ ] Update via supabase-js; tratar `updated_at` se existir.

## 9. Validações

- [ ] Validação imediata no frontend (campos obrigatórios, e-mail, CNPJ, CEP).
- [ ] Mapear códigos PostgREST/Postgres (unique violation, check violation) para mensagens em português.
- [ ] Garantir que regras críticas não dependem só do client.

## 10. Responsividade

- [ ] Grid do formulário: 1 coluna em mobile, 2 em `sm`/`md` onde fizer sentido.
- [ ] Listagem: scroll horizontal na tabela se necessário.
- [ ] Alinhar espaçamento com `AppLayout` (max-width, padding).

## 11. Acessibilidade

- [ ] Labels associados a inputs (`for` / `id`).
- [ ] Erros com `role="alert"` ou `aria-describedby`.
- [ ] Foco visível nos controles do design system.
- [ ] Botões com texto claro (não só ícone).

## 12. Testes

- [ ] Mínimo: `npm run lint`, `typecheck`, `build`, `npm run smoke`.
- [ ] Opcional: Vitest em validadores puros; Playwright em fluxo login → cadastro (se tempo).

## 13. Documentação

- [x] PRD, PLAN, ADR-001, ADR-002, AI-DEVELOPMENT (rascunho inicial).
- [ ] Atualizar PLAN (status) e AI-DEVELOPMENT ao longo do desenvolvimento.
- [ ] README raiz: o que foi feito, fora do escopo, melhorias com mais tempo.

## 14. Revisão final

- [ ] Checklist Definition of Done da skill `.cursor/skills/keeptor-fullstack-challenge/`.
- [ ] Revisar `.cursor/` sem secrets.
- [ ] Commits semânticos ao longo do histórico (não um único commit).
- [ ] Passar smoke e login manual antes de entregar.

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

Registrar aqui qualquer desvio relevante antes de implementar.
