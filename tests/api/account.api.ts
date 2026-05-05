import { APIRequestContext, expect } from '@playwright/test'
import config from '../../playwright.config'
import { CreateUserParams, AccountApiResponse } from '../models/general.api.model'

const baseURL = (config.use as { baseURL?: string })?.baseURL ?? process.env.BASE_API ?? ''

export async function deleteUser(request: APIRequestContext, email: string, password: string) {
    const response = await request.delete(`${baseURL}/api/deleteAccount`, {
        form: { email, password },
    })
    return (await response.json()) as AccountApiResponse
}

export async function createUser(request: APIRequestContext, user: CreateUserParams) {
    const response = await request.post(`${baseURL}/api/createAccount`, {
        form: { ...user },
    })

    const body = (await response.json()) as AccountApiResponse
    expect(body.responseCode).toBe(201)
    return body
}