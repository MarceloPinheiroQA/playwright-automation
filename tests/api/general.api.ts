import { APIRequestContext, expect } from '@playwright/test'
import config from '../../playwright.config'
import { BrandsListResponse } from '../models/general.api.model'

const baseURL = (config.use as { baseURL?: string })?.baseURL ?? process.env.BASE_API ?? ''

export async function VerifyBrandsList(request: APIRequestContext) {
    const response = await request.get(`${baseURL}/api/brandsList`, {
    })
}

export async function VerifyAllBrandsAvailable(request: APIRequestContext) {
    const response = await request.get(`${baseURL}/api/brandsList`)
    expect(response.ok()).toBeTruthy()
    const body = (await response.json()) as BrandsListResponse
    expect(body.responseCode).toBe(200)
    expect(Array.isArray(body.brands)).toBeTruthy()
    return body
}



export async function CompareSpecificBrand(request: APIRequestContext) {
    const response = await request.get(`${baseURL}/api/brandsList`, {
    })
}