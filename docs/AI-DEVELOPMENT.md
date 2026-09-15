# AI-DEVELOPMENT — Processo de desenvolvimento assistido por IA

Documento honesto sobre como a IA foi usada no desafio Keeptor.

## Ferramentas

| Ferramenta | Uso |
|------------|-----|
| **Cursor** (IDE + agente Composer) | Análise do repositório, documentação (`docs/`), implementação incremental do módulo parceiros |
| **Skill local** | `.cursor/skills/keeptor-fullstack-challenge/SKILL.md` — escopo, design system, migrations, commits, DoD |

**MCPs:** nenhum MCP externo foi necessário para este desafio (sem Datadog, Linear, etc.).

**Outras IAs em paralelo:** não utilizadas neste repositório.

## Configuração versionada (`.cursor/`)

- `skills/keeptor-fullstack-challenge/SKILL.md` — prioridades de avaliação (padronização 35%, modelagem 25%, processo 25%, funcional 15%), fluxo por fases, proibição de PrimeVue nas pages, migration `0003_`, documentação obrigatória.

**Secrets:** revisar `.env` e qualquer `.mcp.json` antes de push público; não commitar chaves.

## Contexto fornecido à IA

1. `README.md` (raiz) — requisitos, critérios, ambiguidades, entrega.
2. `frontend/README.md`, `backend/README.md` — scripts e ambiente.
3. Artefatos inspecionados: migrations `0001`/`0002`, router, login, ESLint, `docker-compose.yml`, `scripts/smoke.mjs`.
4. Skill keeptor-fullstack-challenge em cada sessão de implementação.
5. Documentos gerados/atualizados: PRD, PLAN, ADR-001/002/003, este arquivo.

## Ordem de desenvolvimento (planejada vs real)

| Etapa | Planejado (PLAN) | Real |
|-------|------------------|------|
| Baseline smoke 10/10 | Primeiro | ✅ |
| Docs antes de código | Sim | ✅ PRD, PLAN, ADRs |
| Migration `0003` | Após ADR-001 | ✅ + volume no compose |
| Design system | ADR-002 | ✅ wrappers + Storybook |
| Feature parceiros | Cadastro → edição → lista | ✅ listagem + create + edit (`PartnerForm` compartilhado) |
| Validações | Frontend + Postgres | ✅ Zod + `apiError` |
| UX | Responsivo + a11y | ✅ fases 10–11 |
| Testes | Opcional | ✅ `npm run check`, Vitest, Playwright E2E, Storybook |

## Onde a IA acertou de primeira

- Mapeamento Kong → GoTrue + PostgREST e guard de rota.
- Trava ESLint `no-restricted-imports` como eixo do design system.
- Inclusão da migration `0003` no `docker-compose.yml` (não só o arquivo SQL).
- Espelhar CHECK do Postgres no schema Zod.

## Onde foi necessário corrigir ou validar

- **Windows/PowerShell:** encadear comandos com `;` em vez de `&&`.
- **PrimeVue InputNumber (moeda):** substituído por máscara em centavos no `AppCurrencyInput`.
- **Storybook 10:** tags CSF precisam ser literais `['autodocs']`, não spread de constante.
- **Playwright:** binários do Chromium exigem `npm run playwright:install` após instalar `@playwright/test`.
- Decisões de negócio ambíguas documentadas em ADR/PRD — revisão humana antes de tratar como definitivo.

## Mudanças de direção

| Data | Mudança |
|------|---------|
| 2026-03-13 | Documentação e ADRs antes da migration e do frontend |
| 2026-03-14 | Create sem switch `ativo` (sempre `true`); ativo só na edição |
| 2026-03-14 | Formulário em página (modal discutido, não implementado) |

## Papel humano

- Revisar ADRs e o README de entrega; ajustar o que não refletir sua opinião.
- Commits incrementais e mensagens semânticas.
- Validar manualmente CRUD e `npm run smoke` antes de entregar.

## Histórico de atualizações

| Data | Alteração |
|------|-----------|
| 2026-03-13 | Versão inicial + documentos em `docs/` |
| 2026-03-14 | Migration `0003`, design system, feature parceiros |
| 2026-03-14 | Zod, responsividade, a11y |
| 2026-03-14 | Vitest, `npm run check`, Storybook, Playwright E2E |
| 2026-03-14 | Fase 13: README entrega, índice `docs/`, este arquivo consolidado |
