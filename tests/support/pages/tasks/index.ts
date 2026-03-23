import { expect, Page, Locator } from "@playwright/test"
import { TaskModel } from "../../fixtures/task.model.ts"

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator
    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator ('input[class*=InputNewTask]')
    }

    async go() {
        await this.page.goto('http://localhost:8080')
    }

    async create(Task: TaskModel) {
        await this.inputTaskName.fill(Task.name)
        await this.page.click('css=button >> text=Create')
    }

    async shouldHaveText(TaskName: string) {
        const Target = this.page.locator(`css=.task-item p >> text=${TaskName}`)
        await expect(Target).toBeVisible()
    }

    async alertTextExists(text: string) {
        const Target = this.page.locator('.swal2-html-container')
        await expect(Target).toHaveText(text)
    }

    async toggle(TaskName: string) {
        const Target = this.page.locator(`xpath=//p[text()="${TaskName}"]/..//button[contains(@class, "Toggle")]`)
        await Target.click()
    }

    async remove(TaskName: string) {
        const Target = this.page.locator(`xpath=//p[text()="${TaskName}"]/..//button[contains(@class, "Delete")]`)
        await Target.click()
    }

    async shouldBeDone (TaskName: string) {
        const Target = this.page.getByText(TaskName)
        await expect(Target).toHaveCSS('text-decoration-line','line-through')
    }

    async shouldNotExist(TaskName: string) {
        const Target = this.page.locator(`css=.task-item p >> text=${TaskName}`)
        await expect(Target).not.toBeVisible()
    }
    
}