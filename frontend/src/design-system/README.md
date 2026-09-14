# `src/design-system/`

Wrappers sobre o PrimeVue 4. **Páginas importam apenas daqui** (`@/design-system` ou `@/design-system/...`).

Contrato completo: `docs/ADR-002-design-system.md`.

## O que vive aqui

Os seus wrappers sobre o PrimeVue, ou seja, os componentes que o resto da
aplicação consome. O nome, as props, os eventos, os slots, quanto cada wrapper
abrange e como você trata o estilo são decisões suas, e estão entre os pontos
avaliados.

## A regra

**Esta é a única pasta do `src/` onde importar `primevue/*` é permitido.**

Não depende de boa vontade: o ESLint (`no-restricted-imports` em
`eslint.config.ts`) barra qualquer import do PrimeVue fora daqui e de
`src/main.ts`. Rodar `npm run lint` em uma tela que importa PrimeVue direto
falha o build.

```
src/pages/ParceirosPage.vue   →  import ... from 'primevue/datatable'   ❌ lint falha
src/design-system/XTabela.vue →  import ... from 'primevue/datatable'   ✅ permitido
src/pages/ParceirosPage.vue   →  import XTabela from '@/design-system/XTabela.vue'  ✅
```

## Por que

É assim que a Keeptor trabalha em produção: telas não conhecem a biblioteca de
UI. Trocar ou atualizar o PrimeVue, padronizar espaçamento, aplicar identidade
visual e corrigir acessibilidade acontecem em um ponto só, em vez de espalhados
por dezenas de telas.

## Componentes (v1)

| Export | Uso |
|--------|-----|
| `AppInput` | Texto, e-mail |
| `AppMaskedInput` | CNPJ, telefone, CEP (`MASK_*` em `masks.ts`) |
| `AppDatePicker` | Data (pt-BR) |
| `AppCurrencyInput` | Real (BRL) |
| `AppSwitch` | Booleano (ex.: ativo) |
| `AppSelect` | UF, município |
| `AppButton` | Ações (`variant`: primary / secondary / danger) |
| `AppDataTable` | Listagem simples |
| `AppToastHost` | Montado em `App.vue` |
| `useAppToast()` | Feedback global (success / error / …) |

Campos compartilham props de `AppFieldProps`: `label`, `error`, `hint`, `disabled`, `loading`, `required`, `name`, `id`.
