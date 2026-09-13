# ADR-002 — Design System (camada sobre PrimeVue)

## Status

**Aceito** — 2026-03-13

## Contexto

O desafio pesa **35% em padronização**. O boilerplate:

- Registra PrimeVue em `src/main.ts` (preset Aura, `ToastService`, `cssLayer` com Tailwind).
- Proíbe import de `primevue/*` fora de `src/design-system/` e `main.ts` (ESLint `no-restricted-imports`).
- Deixa `design-system/` vazio e `ParceirosPage.vue` sem UI de negócio.
- Implementa login com HTML nativo + Tailwind **de propósito** (não é referência obrigatória para parceiros).

Objetivo: telas de parceiros consumirem apenas componentes **App\*** (ou nomenclatura equivalente) estáveis, independentes da biblioteca de UI.

## Decisão

### Arquitetura em camadas

Fluxo **obrigatório** de dependência (de baixo para cima):

```
┌─────────────────────────────────────────┐
│  Pages (ParceirosPage, formulários…)     │  ← sem primevue/*
├─────────────────────────────────────────┤
│  Application components (opcional)       │  ← ex.: PartnerForm, PartnerTable
│  composição de campos + layout de tela   │     ainda sem primevue/*
├─────────────────────────────────────────┤
│  Design System (`src/design-system/`)    │  ← único lugar com primevue/*
├─────────────────────────────────────────┤
│  PrimeVue 4 + @primeuix/themes           │
└─────────────────────────────────────────┘
```

Fluxo **proibido**:

```
Pages → import primevue/*   ❌
```

`main.ts` continua apenas com bootstrap (`PrimeVue`, tema, serviços globais como Toast).

### Princípios

1. **Um wrapper por primitiva de UI** reutilizada (Input, Select, Button…), não um wrapper por tela.
2. **Contrato comum** entre campos de formulário sempre que possível.
3. **Estilo:** Tailwind para layout de página; PrimeVue para aparência dos controles; tokens Aura via tema global.
4. **Acessibilidade:** label, id, `aria-invalid`, `aria-describedby` para erros — implementados nos wrappers, não repetidos em cada página.
5. **Extensão antes de duplicação:** novo tipo de campo só ganha componente novo se não couber em um existente com props.

### Contrato comum (campos de formulário)

Props e eventos alvo para componentes de entrada (`AppInput`, `AppSelect`, `AppDatePicker`, `AppCurrencyInput`, `AppMaskedInput`, `AppSwitch`):

| Prop / evento | Tipo | Padrão | Propósito |
|---------------|------|--------|-----------|
| `modelValue` | conforme tipo | — | `v-model` |
| `update:modelValue` | evento | — | `v-model` |
| `label` | `string` | `undefined` | Texto visível do campo |
| `name` | `string` | `undefined` | `name` HTML / testes |
| `id` | `string` | auto se omitido | Associação label + a11y |
| `error` | `string` | `undefined` | Mensagem abaixo do campo |
| `hint` | `string` | `undefined` | Ajuda opcional |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | Select/async (ex. municípios) |
| `required` | `boolean` | `false` | Indicador visual + `aria-required` |

Botões (`AppButton`):

| Prop | Padrão |
|------|--------|
| `label` ou slot default | — |
| `variant` | `primary` \| `secondary` \| `danger` |
| `loading` | `false` |
| `disabled` | `false` |
| `type` | `button` |

Tabela (`AppDataTable`): props para `value`, `columns` (ou slots), `loading`, estado vazio via slot ou prop `emptyMessage`.

**Desvios documentados:** se um componente não suportar `hint` ou `loading` na v1, registrar no README da entrega com motivo.

### Mapa inicial de componentes (formulário parceiros)

| Necessidade do PRD | Componente DS (nome provisório) | Base PrimeVue |
|--------------------|---------------------------------|---------------|
| Texto simples | `AppInput` | `InputText` |
| E-mail | `AppInput` `type="email"` | `InputText` |
| CNPJ, telefone, CEP | `AppMaskedInput` | `InputMask` ou InputText + máscara |
| Data início | `AppDatePicker` | `DatePicker` |
| Limite crédito | `AppCurrencyInput` | `InputNumber` |
| Ativo | `AppSwitch` | `ToggleSwitch` |
| UF / município | `AppSelect` | `Select` |
| Ações | `AppButton` | `Button` |
| Listagem | `AppDataTable` | `DataTable` |
| Feedback global | `useToast` / wrapper fino | `Toast` via `ToastService` |

Nomes finais podem ajustar na implementação; o importante é **um único ponto** de import PrimeVue por primitiva.

### Componentes de aplicação (opcional)

Pasta sugerida: `frontend/src/components/partners/` (ou `features/partners/`):

- `PartnerForm.vue` — grid do formulário, usa só design system.
- `PartnerList.vue` — tabela + estados.

**Pages** ficam finas: rota, fetch inicial, navegação, composição de `PartnerForm` / `PartnerList`.

### Troca de biblioteca de UI — impacto estimado

Pergunta do README: *se trocássemos PrimeVue por outra biblioteca, quantos arquivos mudariam?*

| Camada | Arquivos afetados (estimativa v1) | Motivo |
|--------|-----------------------------------|--------|
| `design-system/**` | ~8–12 arquivos | Reimplementar wrappers |
| `main.ts` | 1 | Registro do plugin/tema |
| `eslint.config.ts` | 1 | Ajustar `no-restricted-imports` |
| Pages + app components | **0** (ideal) | Só importam `@/design-system/*` |
| `LoginPage.vue` | 0 na troca PrimeVue | Já não usa PrimeVue |

Total estimado: **~10–14 arquivos**, não dezenas de telas. Esse é o benefício da regra.

## Alternativas consideradas

| Alternativa | Motivo de rejeição |
|-------------|-------------------|
| PrimeVue direto nas pages | Viola enunciado e ESLint; acoplamento total |
| Copiar classes Tailwind do login em cada campo | Duplica a11y e erro; mata padronização |
| Um único `AppField` genérico com `type` enum gigante | Difícil de manter; wrappers por tipo são mais claros |
| Storybook obrigatório | Opcional; documentar contrato em tabela no README/ADR |

## Consequências

- Desenvolvimento começa pelos wrappers usados no cadastro (vertical slice).
- `npm run lint` é gate: qualquer import errado falha CI local.
- Login pode permanecer nativo; parceiros **devem** usar design system.
- Toast pode ser chamado via composable em `design-system` para não importar PrimeVue nas pages.

## Implementação

Ordem sugerida (ver `docs/PLAN.md`):

1. `AppButton`, `AppInput` (validar contrato).
2. `AppSelect` (UF/município).
3. `AppMaskedInput`, `AppDatePicker`, `AppCurrencyInput`, `AppSwitch`.
4. `AppDataTable` + empty/loading.
5. `PartnerForm` / listagem.

Atualizar este ADR com tabela final de props quando os componentes existirem.
