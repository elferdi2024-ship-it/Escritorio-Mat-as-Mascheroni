// filepath: d:/PROYECTOS/REMATE CAMPO/lib/mercadopago/client.ts
// @optimization: typescript-expert - Cliente de Mercado Pago formalizado con SDK v2 y tipos estrictos

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Inicializar la configuración de Mercado Pago con el token del servidor
const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'fallback_mp_access_token_for_compilation',
  options: { timeout: 5000 },
})

export const preferenceClient = new Preference(mpConfig)
export const paymentClient = new Payment(mpConfig)

export const MP_COMMISSION_RATE = 0.19 // 19% de comisión para pagos por Mercado Pago
export const CASH_COMMISSION_RATE = 0.12 // 12% de comisión para pago contado
