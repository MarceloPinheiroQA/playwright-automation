import { expect, test } from '@playwright/test'
import { LoginPage } from '../../pages/login/index.ts';
import { createUserFactory } from '../../fixtures/login/user.ts';
import { createUser, deleteUser } from '../../api/account.api';
import { CreateUserParams } from '../../models/general.api.model';

let loginPage: LoginPage
let user: CreateUserParams

test.beforeEach(async ({ page }) => {
    // 1. Gera um usuário novo e único para evitar colisões no paralelismo
    user = createUserFactory()
    loginPage = new LoginPage(page)
})

test.afterEach(async ({ request }) => {
    // 2. Cleanup: Deleta o usuário criado logo após o fim do teste
    await deleteUser(request, user.email, user.password)
})

test.describe('Signup and Login Flow', () => {

    test('Verify login page access and signup a new user', async ({ page }) => {
        await loginPage.go('/login')
        await loginPage.registerUI(user)
            
        await expect(page).toHaveURL(/\/signup$/)
        await expect(
            page.locator('h2.title.text-center', { hasText: 'Enter Account Information' }),
        ).toBeVisible()
            
        await loginPage.createUserUI(user)
        await page.click('[data-qa="create-account"]')
        await expect(page.locator('[data-qa="account-created"]')).toBeVisible()
    })

    test('Verify login through UI', async ({ page, request }) => {
        // Setup: Cria o usuário via API para testar apenas o login na UI
        await createUser(request, user)
            
        await loginPage.go('/login')
        await loginPage.loginUI(user)

        await expect(page.locator('a', { hasText: ' Logout' })).toBeVisible()
    })
})