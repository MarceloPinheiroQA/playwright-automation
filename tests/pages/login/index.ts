import { Page, Locator } from "@playwright/test"
import config from '../../../playwright.config'
import { UserModel } from '../../models/user.model';
import { expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page
    readonly inputEmail: Locator
    readonly inputPassword: Locator
    readonly buttonLogin: Locator
    constructor(page: Page) {
        this.page = page
        this.inputEmail = page.locator ('input[data-qa="login-email"]')
        this.inputPassword = page.locator ('input[data-qa="login-password"]')
        this.buttonLogin = page.locator ('button[data-qa="login-button"]')
    }

    async go(url: string) {
        const baseURL = (config.use as { baseURL?: string })?.baseURL
        const finalUrl = baseURL ? new URL(url, baseURL).toString() : url
        await this.page.goto(finalUrl)
    }

    async createUserUI(user: UserModel) {
        await this.page.locator('input[value="Mr"]').check()

        await expect(this.page.locator('[data-qa="name"]')).toHaveValue(user.name)
        await expect(this.page.locator('[data-qa="email"]')).toHaveValue(user.email)
       
        await this.page.locator('[data-qa="password"]').fill(user.password)

        await this.page.locator('[data-qa="days"]').selectOption({ value: user.birth_date })
        await this.page.locator('[data-qa="months"]').selectOption({ label: user.birth_month })
        await this.page.locator('[data-qa="years"]').selectOption({ value: user.birth_year })

        await this.page.locator('[data-qa="first_name"]').fill(user.firstname)
        await this.page.locator('[data-qa="last_name"]').fill(user.lastname)
        await this.page.locator('[data-qa="company"]').fill(user.company)
        await this.page.locator('[data-qa="address"]').fill(user.address1)
        await this.page.locator('[data-qa="country"]').selectOption({ value: user.country })
        await this.page.locator('[data-qa="state"]').fill(user.state)
        await this.page.locator('[data-qa="city"]').fill(user.city)
        await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode)
        await this.page.locator('[data-qa="mobile_number"]').fill(user.mobile_number)
    }
    async registerUI(user: UserModel) {
        await this.page.locator('[data-qa="signup-name"]').fill(user.name)
        await this.page.locator('[data-qa="signup-email"]').fill(user.email)
        await this.page.click('[data-qa="signup-button"]')
    }
    async loginUI(user: UserModel) {
        await this.page.locator('[data-qa="login-email"]').fill(user.email)
        await this.page.locator('[data-qa="login-password"]').fill(user.password)
        await this.page.click('[data-qa="login-button"]')
    }
}