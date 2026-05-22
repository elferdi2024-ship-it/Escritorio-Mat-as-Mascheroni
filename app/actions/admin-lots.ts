// filepath: d:/PROYECTOS/REMATE CAMPO/app/actions/admin-lots.ts
// @optimization: typescript-expert - Server Actions CRUD para control físico de lotes con verificación HMAC unificada

'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { verifyAdminAuth } from './admin'
import { z } from 'zod'

const lotCrudSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').trim(),
  description: z.string().optional(),
  startingPrice: z.number().nonnegative('El precio de partida debe ser positivo'),
  album: z.number().int().min(1).max(4),
  imageUrls: z.array(z.string().url('Debe ser una URL válida')),
  baseClosingTime: z.string().datetime(),
  sortOrder: z.number().int().default(0),
})

export interface LotCrudResponse {
  ok: boolean
  error?: string
}

/**
 * Dar de alta un nuevo lote agrícola
 */
export async function createLotAction(formData: any): Promise<LotCrudResponse> {
  const isAuthed = await verifyAdminAuth()
  if (!isAuthed) return { ok: false, error: 'No autorizado: Sesión de administrador no válida' }

  const validated = lotCrudSchema.safeParse(formData)
  if (!validated.success) {
    return { ok: false, error: validated.error.errors.map((e) => e.message).join(', ') }
  }

  const { title, description, startingPrice, album, imageUrls, baseClosingTime, sortOrder } = validated.data
  const supabase = createServerSupabase()

  const { error } = await (supabase.from('lots') as any).insert({
    title,
    description,
    starting_price: startingPrice,
    album,
    image_urls: imageUrls,
    base_closing_time: baseClosingTime,
    closing_time: baseClosingTime, // Al inicio, coincide con el base
    status: 'active',
    sort_order: sortOrder,
  })

  if (error) {
    console.error('Error insertando lote:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/')
  return { ok: true }
}

/**
 * Modificar un lote existente
 */
export async function updateLotAction(id: number, formData: any): Promise<LotCrudResponse> {
  const isAuthed = await verifyAdminAuth()
  if (!isAuthed) return { ok: false, error: 'No autorizado: Sesión de administrador no válida' }

  const validated = lotCrudSchema.safeParse(formData)
  if (!validated.success) {
    return { ok: false, error: validated.error.errors.map((e) => e.message).join(', ') }
  }

  const { title, description, startingPrice, album, imageUrls, baseClosingTime, sortOrder } = validated.data
  const supabase = createServerSupabase()

  // Comprobar estado previo del lote
  const { data: lot } = await (supabase.from('lots') as any).select('status').eq('id', id).single()
  if (!lot) return { ok: false, error: 'Lote no encontrado' }

  const { error } = await (supabase.from('lots') as any)
    .update({
      title,
      description,
      starting_price: startingPrice,
      album,
      image_urls: imageUrls,
      base_closing_time: baseClosingTime,
      closing_time: lot.status === 'active' ? baseClosingTime : undefined, // Sólo actualiza closing si no está extendido
      sort_order: sortOrder,
    })
    .eq('id', id)

  if (error) {
    console.error('Error modificando lote:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/lote/${id}`)
  return { ok: true }
}

/**
 * Eliminar un lote (cascades on delete cascade bids automáticamente en BD)
 */
export async function deleteLotAction(id: number): Promise<LotCrudResponse> {
  const isAuthed = await verifyAdminAuth()
  if (!isAuthed) return { ok: false, error: 'No autorizado: Sesión de administrador no válida' }

  const supabase = createServerSupabase()
  const { error } = await (supabase.from('lots') as any).delete().eq('id', id)

  if (error) {
    console.error('Error eliminando lote:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/')
  return { ok: true }
}

/**
 * Extender manualmente el tiempo de cierre de un lote (15 min adicionales)
 */
export async function extendLotAction(id: number): Promise<LotCrudResponse> {
  const isAuthed = await verifyAdminAuth()
  if (!isAuthed) return { ok: false, error: 'No autorizado: Sesión de administrador no válida' }

  const supabase = createServerSupabase()
  
  // Buscar lote
  const { data: lot } = await (supabase.from('lots') as any).select('closing_time').eq('id', id).single()
  if (!lot) return { ok: false, error: 'Lote no encontrado' }

  const currentClosing = new Date(lot.closing_time)
  const newClosing = new Date(currentClosing.getTime() + 15 * 60 * 1000) // +15 min

  const { error } = await (supabase.from('lots') as any)
    .update({
      closing_time: newClosing.toISOString(),
      status: 'extended',
    })
    .eq('id', id)

  if (error) {
    console.error('Error extendiendo lote:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/lote/${id}`)
  return { ok: true }
}
