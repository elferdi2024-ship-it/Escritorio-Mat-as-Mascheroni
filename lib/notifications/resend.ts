// filepath: d:/PROYECTOS/REMATE CAMPO/lib/notifications/resend.ts
// @optimization: typescript-expert - Módulo de envío de correos electrónicos con Resend e inyección de remitente por marca

import { Resend } from 'resend'
import { getBrand } from '@/lib/branding'

const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback')

export interface EmailResponse {
  ok: boolean
  id?: string
  error?: string
  dev?: boolean
}

export async function sendEmail(to: string, subject: string, body: string): Promise<EmailResponse> {
  const brand = getBrand()
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_fallback') {
    console.log(`[DEV EMAIL] (${brand.name}):`, { to, subject, body })
    return { ok: true, dev: true }
  }

  // Extraer el dominio del remitente basado en la marca (o usar el default si es demo)
  const fromDomain = brand.domain || 'rematecampo.com.uy'
  const fromEmail = `${brand.shortName} <no-reply@${fromDomain}>`

  try {
    const res = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      text: body,
      // Si la marca es demo, Mercado Pago o Resend en Sandbox sólo permite enviar a correos verificados
      // Resend Free Tier permite enviar a cualquier persona si tienes un dominio propio verificado.
    })

    if (res.error) {
      console.error('Error de Resend API:', res.error)
      return { ok: false, error: res.error.message }
    }

    return { ok: true, id: res.data?.id }
  } catch (err: any) {
    console.error('Excepción al enviar email con Resend:', err)
    return { ok: false, error: err.message || 'Excepción del servidor de correo' }
  }
}
