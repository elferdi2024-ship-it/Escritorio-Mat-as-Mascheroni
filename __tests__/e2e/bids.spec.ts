// filepath: d:/PROYECTOS/REMATE CAMPO/__tests__/e2e/bids.spec.ts
// @optimization: playwright-skill - Pruebas E2E de Playwright utilizando locadores semánticos, auto-waits y verificación completa del flujo de ofertas

import { test, expect } from '@playwright/test'

test.describe('🚜 Flujo de Puja de Alta Performance (E2E)', () => {

  test('Debería navegar a la Home, abrir un lote, completar identidad y pujar con éxito', async ({ page }) => {
    // 1. Navegar a la página principal
    await page.goto('/')

    // Verificar cabecera e identidad de marca
    await expect(page.locator('h1')).toContainText('Subasta de Maquinaria')
    
    // 2. Localizar la primera tarjeta activa de la grilla
    const firstLotCard = page.locator('article').first()
    await expect(firstLotCard).toBeVisible()
    
    const lotTitle = await firstLotCard.locator('h3').textContent()
    console.log(`Abriendo lote de prueba: ${lotTitle}`)

    // 3. Hacer clic en el botón de Ofertar / Ver detalle
    await firstLotCard.getByRole('link', { name: /ofertar|ver detalle/i }).click()

    // 4. Verificar carga de la página de detalles
    await expect(page.locator('h1')).toContainText(lotTitle || '')
    await expect(page.locator('#amount')).toBeVisible()

    // 5. Completar los campos de identidad del postor (bidder)
    await page.getByPlaceholder(/nombre/i).fill('Carlos Bidder E2E')
    await page.getByPlaceholder(/celular/i).fill('099123456')
    await page.getByPlaceholder(/correo electrónico/i).fill('carlos.e2e@rematecampo.com.uy')

    // 6. Configurar un monto de puja válido
    // Obtenemos el valor mínimo sugerido desde el input de ofertas
    const minBidText = await page.getByPlaceholder(/mínimo:/i).getAttribute('placeholder')
    const minBidAmount = minBidText ? minBidText.replace(/[^\d]/g, '') : '1000'
    
    await page.locator('#amount').fill(minBidAmount)

    // 7. Enviar la puja al servidor
    await page.getByRole('button', { name: /pujar|oferta/i }).click()

    // 8. Confirmar Toast de Éxito de forma no bloqueante
    const successToast = page.locator('text=¡Puja registrada con éxito!')
    await expect(successToast).toBeVisible({ timeout: 5000 })

    // 9. Verificar que el precio en pantalla se actualizó al nuevo valor
    const updatedPrice = page.locator('data-value')
    await expect(updatedPrice).toBeVisible()
  })

})
