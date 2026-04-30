import { APIRequestContext, expect } from '@playwright/test'
import config from '../../playwright.config'

const baseURL = (config.use as { baseURL?: string })?.baseURL ?? process.env.BASE_API ?? ''

type CreateUserParams = {
    name: string
    email: string
    password: string
    title: string
    birth_date: string
    birth_month: string
    birth_year: string
    firstname: string
    lastname: string
    company: string
    address1: string
    address2: string
    country: string
    zipcode: string
    state: string
    city: string
    mobile_number: string
}

type AccountApiResponse = {
    responseCode: number
    message: string
}

type DesiredUserState = 'present' | 'absent'

type EnsureUserStateResult = {
    existsBefore: boolean
    existsAfter: boolean
    action: 'created' | 'deleted' | 'none'
    verifyResponse: AccountApiResponse
}

export async function verifyLogin(request: APIRequestContext, email: string, password: string) {
    const response = await request.post(`${baseURL}/api/verifyLogin`, {
        form: {
            email,
            password,
        },
    })

    expect(response.ok()).toBeTruthy()
    const body = (await response.json()) as AccountApiResponse

    return body
}

export async function userExists(request: APIRequestContext, email: string, password: string) {
    const body = await verifyLogin(request, email, password)
    return body.responseCode === 200 && body.message.includes('User exists')
}

export async function deleteUser(request: APIRequestContext, email: string, password: string) {
    const response = await request.delete(`${baseURL}/api/deleteAccount`, {
        form: {
            email,
            password,
        },
    })

    expect(response.ok()).toBeTruthy()
    const body = (await response.json()) as AccountApiResponse
    // Idempotent cleanup for test setup:
    // 200 -> account deleted, 404 -> account was already absent.
    expect([200, 404]).toContain(body.responseCode)
    if (body.responseCode === 200) {
        expect(body.message).toContain('Account deleted')
    }

    return body
}

export async function createUser(request: APIRequestContext, user: CreateUserParams) {
    const response = await request.post(`${baseURL}/api/createAccount`, {
        form: {
            name: user.name,
            email: user.email,
            password: user.password,
            title: user.title,
            birth_date: user.birth_date,
            birth_month: user.birth_month,
            birth_year: user.birth_year,
            firstname: user.firstname,
            lastname: user.lastname,
            company: user.company,
            address1: user.address1,
            address2: user.address2,
            country: user.country,
            zipcode: user.zipcode,
            state: user.state,
            city: user.city,
            mobile_number: user.mobile_number,
        },
    })

    expect(response.ok()).toBeTruthy()
    const body = (await response.json()) as AccountApiResponse
    expect(body.responseCode).toBe(201)
    expect(body.message).toContain('User created')

    return body
}

export async function ensureUserState(
    request: APIRequestContext,
    user: CreateUserParams,
    desiredState: DesiredUserState,
): Promise<EnsureUserStateResult> {
    const verifyResponse = await verifyLogin(request, user.email, user.password)
    const existsBefore = verifyResponse.responseCode === 200 && verifyResponse.message.includes('User exists')

    if (desiredState === 'absent' && existsBefore) {
        await deleteUser(request, user.email, user.password)
        return {
            existsBefore,
            existsAfter: false,
            action: 'deleted',
            verifyResponse,
        }
    }

    if (desiredState === 'present' && !existsBefore) {
        await createUser(request, user)
        return {
            existsBefore,
            existsAfter: true,
            action: 'created',
            verifyResponse,
        }
    }

    return {
        existsBefore,
        existsAfter: existsBefore,
        action: 'none',
        verifyResponse,
    }
}
