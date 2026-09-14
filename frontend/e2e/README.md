# Testes E2E (Playwright)

**Primeira vez** (ou após atualizar `@playwright/test`), baixe o Chromium:

```bash
cd frontend
npm run playwright:install
```

```bash
# Na raiz: Docker + API (npm run smoke deve passar 10/10)
npm run up

cd frontend
npm run test:e2e
```

O Playwright sobe o Vite (`npm run dev`) automaticamente. O login usa o Supabase em `http://localhost:8000` — sem o backend, o fluxo falha no passo de autenticação.

Credencial demo: `desafio@keeptor.com` / `desafio123`.
