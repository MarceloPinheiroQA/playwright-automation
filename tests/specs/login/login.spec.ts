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

test.describe('Signup and login', () => {
    
    test('Verify the login page is available', async ({ page }) => {
        await loginPage.go('/login')
        await expect(page).toHaveURL(/\/login/)
        await expect(page.locator('h2', { hasText: 'New User Signup!' })).toBeVisible()
    })

    test('Verify login page access and signup a new user', async ({ page, request }) => {
        const user = data.REGISTER as UserModel
        await ensureUserState(request, user, 'absent')
        await loginPage.go('/login')

        await loginPage.registerUI(user)
        await expect(page.locator('b', { hasText: 'Enter Account Information' })).toBeVisible()
        await loginPage.createUserUI(user)
        await page.click('[data-qa="create-account"]')
        await expect(page.locator('[data-qa="account-created"]')).toBeVisible()

    })
    
    test('Verify user creation through API', async ({ request }) => {
        const user = data.REGISTER as UserModel
        await ensureUserState(request, user, 'absent')
        const response = await createUser(request, user)
        expect(response.message).toContain('User created')
    })

    test('Verify login through UI', async ({ page, request }) => {
        const user = data.REGISTER as UserModel
        await ensureUserState(request, user, 'present')
        await loginPage.go('/login')
        await loginPage.loginUI(user)
    })
})