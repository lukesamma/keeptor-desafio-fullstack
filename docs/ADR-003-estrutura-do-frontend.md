# ADR-003 — Estrutura do Frontend

## Status

**Aceito** — 2026-03-14

## Contexto

O projeto possui componentes de Design System baseados em PrimeVue
e funcionalidades específicas do domínio de parceiros.

Rotas, autenticação e client Supabase já existem no boilerplate (`router/`,
`lib/supabase.ts`, `pages/LoginPage.vue`). O desafio exige CRUD de parceiros
sem importar PrimeVue fora de `design-system/`. É necessário definir onde
vivem regras de negócio, acesso a dados e composição de telas para as
próximas fases do PLAN.

## Decisão

Adotar uma estrutura híbrida baseada em:

- Design System para componentes visuais reutilizáveis;
- Feature-based architecture para regras de negócio;
- camadas compartilhadas para infraestrutura transversal.

Tudo sob `frontend/src/`, sem duplicar o que o boilerplate já resolve
(`router/`, `layouts/`, `lib/supabase.ts` permanecem no lugar atual).

## Estrutura

```
frontend/src/
├── design-system/     # Wrappers PrimeVue; contrato App* (ADR-002)
├── features/          # Domínio por feature (ex.: parceiros: form, list, validação)
├── pages/             # Rotas finas: orquestram features + navegação
├── services/          # Acesso a dados (Supabase/PostgREST), sem UI
├── composables/       # Estado e lógica reutilizável entre features (ex.: geo UF/município)
├── types/             # Tipos TS compartilhados (DTOs, erros de API)
└── utils/             # Funções puras (CNPJ, máscaras, formatação)
```

### Responsabilidade por pasta

| Pasta | Contém | Não contém |
|-------|--------|------------|
| `design-system/` | `AppInput`, `AppSelect`, toast, tabela | Regras de parceiro, chamadas Supabase |
| `features/` | Componentes e fluxos do domínio (`features/partners/…`) | Import `primevue/*` |
| `pages/` | `ParceirosPage.vue`, rotas de lista/novo/editar | Lógica de validação extensa inline |
| `services/` | `partnersService.ts`, mapeamento de erros Postgres | Componentes Vue |
| `composables/` | `useUfMunicipio`, `usePartnerForm` se compartilhado | Wrappers de UI |
| `types/` | `Partner`, `PartnerFormModel` | Implementação |
| `utils/` | `onlyDigits`, validadores puros | Dependência de Vue |

## Consequências

### Positivas

- menor acoplamento entre domínio e UI;
- componentes PrimeVue isolados;
- maior facilidade para adicionar novas features;
- melhor localização do código;
- facilidade para substituir PrimeVue.

### Negativas

- maior quantidade de diretórios;
- exige disciplina para decidir onde cada código pertence.

## Alternativas consideradas

### Estrutura por tipo

```
components/
services/
composables/
pages/
```

Não escolhida porque tende a concentrar componentes de diferentes
domínios nas mesmas pastas conforme o projeto cresce.

### Feature-first completa

Cada feature possuiria sua própria infraestrutura.

Não escolhida neste momento por ser desnecessariamente complexa
para o tamanho atual do desafio.

## Referências

- `docs/ADR-002-design-system.md` — camada visual e contrato dos wrappers.
- `docs/PLAN.md` — fases 6–8 (listagem, cadastro, edição).
