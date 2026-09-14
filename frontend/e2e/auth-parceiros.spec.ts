import { expect, test } from '@playwright/test'

const EMAIL = 'desafio@keeptor.com'
const SENHA = 'desafio123'

test.describe('Fluxo autenticado', () => {
  test('login e navegação até novo parceiro', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('E-mail').fill(EMAIL)
    await page.getByLabel('Senha').fill(SENHA)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('heading', { name: 'Parceiros' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Novo parceiro' })).toBeVisible()

    await page.getByRole('link', { name: 'Novo parceiro' }).click()

    await expect(page.getByRole('heading', { name: 'Novo parceiro' })).toBeVisible()
    await expect(page.getByLabel('Razão social')).toBeVisible()
    await expect(page.getByLabel('CNPJ')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Salvar parceiro' })).toBeVisible()
  })
})
