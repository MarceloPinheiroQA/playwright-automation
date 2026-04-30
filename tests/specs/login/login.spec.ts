import { expect, test } from '@playwright/test'
import { UserModel } from '../../models/user.model';
import { LoginPage } from '../../pages/login/index.ts';
// import { faker } from '@faker-js/faker'

import data from '../../fixtures/register.json'
import { createUser, ensureUserState } from '../../api/account.api';

let loginPage: LoginPage

test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page)
})

test.describe('Cadastro', () => {
    
    test('deve acessar a página login', async ({ page }) => {
        await loginPage.go('/login')
        await expect(page).toHaveURL(/\/login/)
        await expect(page.locator('h2', { hasText: 'New User Signup!' })).toBeVisible()
    })

    test.only('deve acessar a página de login e registrar', async ({ page, request }) => {
        const user = data.REGISTER as UserModel
        await ensureUserState(request, user, 'absent')
        await loginPage.go('/login')

        await loginPage.registerUI(user)
        await expect(page.locator('b', { hasText: 'Enter Account Information' })).toBeVisible()
        await loginPage.createUserUI(user)
        await page.click('[data-qa="create-account"]')
        await expect(page.locator('[data-qa="account-created"]')).toBeVisible()

    })
    
    test('deve criar um novo usuário via API', async ({ request }) => {
        const user = data.REGISTER as UserModel
        await ensureUserState(request, user, 'absent')
        const response = await createUser(request, user)
        expect(response.message).toContain('User created')
    })

    test('Realizer login via UI', async ({ page, request }) => {
        const user = data.REGISTER as UserModel
        await ensureUserState(request, user, 'present')
        await loginPage.go('/login')
        await loginPage.loginUI(user)
        await expect(page.locator('a', { hasText: 'Logged in as' })).toBeVisible()
    })
})