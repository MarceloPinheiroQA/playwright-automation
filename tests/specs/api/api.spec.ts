import { APIRequestContext, expect, test } from '@playwright/test'
import { VerifyAllBrandsAvailable, VerifyBrandsList, CompareSpecificBrand } from '../../api/general.api'
import all_brands from '../../fixtures/api/all_brands.json'


test.describe('API', () => {
    test('Verify API is available', async ({ request }) => {
        await VerifyBrandsList(request)
    })

    test('Verify if all brands are available', async ({ request }) => {
        const brands = await VerifyAllBrandsAvailable(request)
        expect(brands.responseCode).toBe(200)
        expect(brands.brands).toEqual(all_brands.brands)
    })

    test('Verify if brand "Biba" is available', async ({ request }) => {
        const brands = await VerifyAllBrandsAvailable(request)
        expect(brands.responseCode).toBe(200)
        const brandExists = brands.brands.some(b => b.brand === 'Biba')
        expect(brandExists).toBeTruthy()
    })

    test('Verify if ID 13 is available', async ({ request }) => {
        const brands = await VerifyAllBrandsAvailable(request)
        expect(brands.responseCode).toBe(200)
        const idExists = brands.brands.some(b => b.id === 13)
        expect(idExists).toBeTruthy()
    })
})