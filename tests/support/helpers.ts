import { expect, APIRequestContext } from "@playwright/test"
import { TaskModel } from "../fixtures/task.model.ts"

const BASE_API = process.env.BASE_API

export async function DeleteTask(request: APIRequestContext, TaskName: string) {
    await request.delete(`${BASE_API}/helper/tasks/${TaskName}`)
}

export async function PostTask(request: APIRequestContext, Task: TaskModel) {
    const NewTask = await request.post(`${BASE_API}/tasks/`, {data: Task})
    expect(NewTask.ok()).toBeTruthy()
}