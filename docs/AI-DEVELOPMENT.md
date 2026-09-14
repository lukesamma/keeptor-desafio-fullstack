# AI-DEVELOPMENT — Processo de desenvolvimento assistido por IA

Documento honesto sobre como a IA foi usada no desafio Keeptor. Atualizar conforme o trabalho avança.

## Ferramentas

| Ferramenta | Uso |
|------------|-----|
| **Cursor** (IDE + agente) | Análise do repositório, criação de documentação inicial, implementação planejada do desafio |
| **Skill local** | `.cursor/skills/keeptor-fullstack-challenge/SKILL.md` — regras de escopo, design system, migrations, commits, DoD |

Não foram usados, até este ponto:

- MCPs externos (Datadog, Linear, etc.)
- Claude Code / Copilot em paralelo ao Cursor para este repo

Se isso mudar, registrar abaixo na seção **Histórico**.

## Configuração versionada (`.cursor/`)

- `skills/keeptor-fullstack-challenge/SKILL.md` — copiloto sênior: prioridades de avaliação (padronização 35%, modelagem 25%, processo 25%, funcional 15%), fluxo incremental, proibição de PrimeVue nas pages, migrations `0003_`, documentação obrigatória.

**Secrets:** antes de push público, revisar que `.env`, tokens MCP e chaves não entram no git. Placeholders vazios em configs de MCP se existirem.

## Contexto fornecido à IA

1. `README.md` (raiz) — requisitos, critérios, ambiguidades, entrega.
2. `frontend/README.md` e `backend/README.md` — scripts e travas.
3. Arquivos inspecionados na fase de reconhecimento: `package.json`, migrations `0001`/`0002`, router, login, `ParceirosPage`, `eslint.config.ts`, `docker-compose.yml`, `scripts/smoke.mjs`.
4. Skill keeptor-fullstack-challenge (instruções de processo).
5. Pedido do desenvolvedor para **não implementar código** na primeira etapa; depois, criar estrutura de `docs/` com PRD, PLAN, ADRs e este arquivo.

## Ordem de desenvolvimento (planejada vs real)

| Etapa | Planejado | Real |
|-------|-----------|------|
| Baseline (`smoke` 10/10) | Primeiro | ✅ Executado — 10/10 OK |
| Análise sem alterar código | Sim | ✅ Relatório de arquitetura no chat |
| Documentação (`docs/`) | Antes da migration | ✅ PRD, PLAN, ADR-001, ADR-002, AI-DEVELOPMENT |
| Migration `0003` | Após ADR-001 | ✅ `0003_parceiros.sql` + reset + smoke |
| Design system | Após ADR-002 | ✅ wrappers + lint/build |
| Feature parceiros | Vertical (cadastro → edição → lista) | ✅ Listagem, form, edição, Zod |
| Testes | `npm run check` + smoke + E2E | ✅ Vitest; Playwright (`test:e2e`); Storybook em `design-system/stories` |

## Onde a IA acertou de primeira

- Mapeamento da stack Supabase enxuta (Kong, GoTrue, PostgREST) e do fluxo de auth no router.
- Identificação da trava ESLint e da pasta `design-system` vazia como núcleo da avaliação.
- Verificação de ambiente via `npm run smoke` e scripts do frontend (`lint`, `build`).
- Necessidade de **montar nova migration no `docker-compose.yml`** além de criar o arquivo SQL.

## Onde foi necessário corrigir ou validar

- Comandos shell no Windows: usar `;` em vez de `&&` no PowerShell em alguns ambientes.
- Decisões de negócio ambíguas **não** devem ser perguntadas ao avaliador — ficam nos ADRs (responsabilidade humana revisar e concordar antes de codar).

## Mudanças de direção

| Data | Mudança |
|------|---------|
| 2026-03-13 | Escopo documental explícito antes de qualquer `0003` ou componente Vue |

## Papel humano

O desenvolvedor deve:

- Revisar ADRs (modelagem e design system) e ajustar se discordar.
- Executar commits incrementais com mensagens semânticas.
- Explicar decisões na entrevista técnica (código e docs precisam ser **dele**, não só da IA).
- Validar manualmente login, CRUD e responsividade antes da entrega.

## Histórico de atualizações

| Data | Alteração |
|------|-----------|
| 2026-03-13 | Versão inicial após análise do repo e criação dos documentos em `docs/` |
| 2026-03-14 | Migration `0003_parceiros.sql`, volume no compose, reset e smoke 10/10 |
| 2026-03-14 | Fase 5: design system (`App*` + `useAppToast`, `AppToastHost` em `App.vue`) |
| 2026-03-14 | Fase 12: `npm run check`, Vitest (`cnpj`, validação, `apiError`) |

---

*Atualizar este arquivo ao concluir migration, design system, telas e revisão final.*
