// filepath: d:/PROYECTOS/REMATE CAMPO/lib/notifications/twilio.ts
// @optimization: typescript-expert - Módulo de envío de notificaciones de WhatsApp con Twilio y formateo de números

import twilio from 'twilio'

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export interface WhatsAppResponse {
  ok: boolean
  sid?: string
  error?: string
  dev?: boolean
}

export async function sendWhatsApp(to: string, body: string): Promise<WhatsAppResponse> {
  // Normalizar número telefónico: quitar espacios, signos y no-dígitos.
  // En Uruguay, el formato esperado es 59899XXXXXX (con código de país 598).
  // Si el teléfono ingresado ya empieza con el código de país o con un 0, lo corregimos.
  let cleanedNumber = to.replace(/\D/g, '')
  
  if (cleanedNumber.startsWith('0')) {
    cleanedNumber = '598' + cleanedNumber.slice(1)
  }
  
  if (!cleanedNumber.startsWith('598') && cleanedNumber.length === 9) {
    cleanedNumber = '598' + cleanedNumber
  }

  const phone = `whatsapp:+${cleanedNumber}`

  if (!client || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.log('[DEV WHATSAPP] Enviar a:', phone, 'Mensaje:', body)
    return { ok: true, dev: true }
  }

  try {
    const msg = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: phone,
      body: body.replace(/%0A/g, '\n').replace(/\*/g, '') // Twilio en Sandbox no permite Markdown crudo robusto en algunas plantillas
    })
    return { ok: true, sid: msg.sid }
  } catch (err: any) {
    console.error('Error de Twilio API:', err)
    return { ok: false, error: err.message || 'Error del servidor Twilio' }
  }
}
