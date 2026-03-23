import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model.ts'
import { DeleteTask, PostTask } from './support/helpers.ts'
import { TasksPage } from './support/pages/tasks/index.ts'
// import { faker } from '@faker-js/faker'

import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('Cadastro', () => {
    test('deve criar uma nova tarefa', async ({ page, request }) => {
        const Task = data.success as TaskModel
        
        await DeleteTask(request, Task.name)    
    
        await tasksPage.go()
        await tasksPage.create(Task)
        await tasksPage.shouldHaveText(Task.name)
    
    })
    
    test('Verificar se há duplicidade de tarefas', async ({ page, request }) => {
        const Task = data.duplicate as TaskModel
    
        await DeleteTask(request, Task.name)
        await PostTask(request, Task)
        
        await tasksPage.go()
        await tasksPage.create(Task)
        await tasksPage.alertTextExists('Task already exists!')
    
    })
    
    test('Verificar campo obrigatório', async ({ page }) => {
        const Task = data.required as TaskModel
    
        await tasksPage.go()
        await tasksPage.create(Task)
    
        const ValidationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(ValidationMessage).toEqual('This is a required field')
    
    })
})

test.describe('Atualização', () => {
    test('Verificar conclusão de uma tarefa', async ({ page, request }) => {
        const Task = data.update as TaskModel

        await DeleteTask(request, Task.name)
        await PostTask(request, Task)

        await tasksPage.go()
        await tasksPage.toggle(Task.name)
        await tasksPage.shouldBeDone(Task.name)

    })
})

test.describe('Exclusão', () => {
    test('Verificar a exclusão de uma tarefa', async ({ page, request }) => {
        const Task = data.delete as TaskModel

        await DeleteTask(request, Task.name)
        await PostTask(request, Task)

        await tasksPage.go()
        await tasksPage.remove(Task.name)
        await tasksPage.shouldNotExist(Task.name)

    })
})