// filepath: d:/PROYECTOS/REMATE CAMPO/components/admin/DashboardClient.tsx
// @optimization: react-best-practices - Dashboard interactivo de administración con CRUD completo, rate limits y Server Actions

'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Clock, LogOut, FileText, BarChart3, X, Image as ImageIcon } from 'lucide-react'
import { logoutAdmin } from '@/app/actions/admin'
import { createLotAction, updateLotAction, deleteLotAction, extendLotAction } from '@/app/actions/admin-lots'
import { formatCurrency } from '@/lib/auction/rules'
import { useToast } from '../ui/use-toast'
import type { LotWithDetails } from '@/types'

interface DashboardClientProps {
  lots: LotWithDetails[]
}

export default function DashboardClient({ lots }: DashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Estados de modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLot, setEditingLot] = useState<LotWithDetails | null>(null)

  // Campos del formulario
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [album, setAlbum] = useState('1')
  const [imageUrl, setImageUrl] = useState('')
  const [baseClosingTime, setBaseClosingTime] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingLot(null)
    setTitle('')
    setDescription('')
    setStartingPrice('')
    setAlbum('1')
    setImageUrl('')
    setBaseClosingTime(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)) // Mañana por defecto
    setSortOrder('0')
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const handleOpenEdit = (lot: LotWithDetails) => {
    setEditingLot(lot)
    setTitle(lot.title)
    setDescription(lot.description || '')
    setStartingPrice(String(lot.starting_price))
    setAlbum(String(lot.album))
    setImageUrl(lot.image_urls?.[0] || '')
    setBaseClosingTime(new Date(lot.base_closing_time).toISOString().slice(0, 16))
    setSortOrder(String(lot.sort_order || 0))
    setIsModalOpen(true)
  }

  // Guardar (Crear o Editar)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title,
      description: description || undefined,
      startingPrice: Number(startingPrice),
      album: Number(album),
      imageUrls: [imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=600'],
      baseClosingTime: new Date(baseClosingTime).toISOString(),
      sortOrder: Number(sortOrder),
    }

    startTransition(async () => {
      let res
      if (editingLot) {
        res = await updateLotAction(editingLot.id, payload)
      } else {
        res = await createLotAction(payload)
      }

      if (res.ok) {
        toast({
          title: editingLot ? '📝 Lote modificado' : '🚜 Lote creado con éxito',
          description: `El lote "${title}" ha sido guardado correctamente en el sistema.`,
        })
        setIsModalOpen(false)
        router.refresh()
      } else {
        toast({
          title: '⚠️ Error al guardar',
          description: res.error,
          variant: 'destructive',
        })
      }
    })
  }

  // Eliminar Lote
  const handleDelete = (id: number, title: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar el lote "${title}"? Se borrarán permanentemente todas sus pujas asociadas.`)) {
      return
    }

    startTransition(async () => {
      const res = await deleteLotAction(id)
      if (res.ok) {
        toast({
          title: '🗑️ Lote eliminado',
          description: `El lote "${title}" fue eliminado del catálogo.`,
        })
        router.refresh()
      } else {
        toast({
          title: '⚠️ Error al eliminar',
          description: res.error,
          variant: 'destructive',
        })
      }
    })
  }

  // Extender 15 minutos
  const handleExtend = (id: number, title: string) => {
    startTransition(async () => {
      const res = await extendLotAction(id)
      if (res.ok) {
        toast({
          title: '⚡ Lote prorrogado',
          description: `Se agregaron 15 minutos de prórroga al lote "${title}".`,
        })
        router.refresh()
      } else {
        toast({
          title: '⚠️ Error al extender',
          description: res.error,
          variant: 'destructive',
        })
      }
    })
  }

  // Cerrar sesión
  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin()
      router.push('/admin/login')
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Barra superior del panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-[var(--color-earth)] tracking-tight">
            Panel de Control Físico
          </h1>
          <p className="text-neutral-500 font-sans text-xs mt-1">
            Gestión en tiempo real de lotes agrícolas, pujas del reglamento y tiempos de cierre.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-[var(--color-earth)] text-xs font-display font-bold rounded-xl transition-premium shadow-premium"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visualizar Analíticas</span>
          </Link>
          
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-dark)] text-xs font-display font-black rounded-xl transition-premium shadow-premium hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Lote</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 border border-neutral-200 text-neutral-600 text-xs font-display font-bold rounded-xl transition-premium"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Tabla / Tarjetas de Lotes */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase tracking-wider font-display font-bold text-neutral-400">
                <th className="py-4 px-5">ID / Lote</th>
                <th className="py-4 px-5">Título del Equipo</th>
                <th className="py-4 px-5">Álbum</th>
                <th className="py-4 px-5">Precio Partida</th>
                <th className="py-4 px-5">Precio Actual</th>
                <th className="py-4 px-5">Ofertas</th>
                <th className="py-4 px-5">Estado</th>
                <th className="py-4 px-5">Cierre Oficial (UTC-3)</th>
                <th className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-sans text-[var(--color-earth)]">
              {lots.map((lot) => {
                const currentPrice = lot.current_price || lot.starting_price
                return (
                  <tr key={lot.id} className="hover:bg-neutral-50/50 transition-colors duration-150">
                    <td className="py-4.5 px-5 font-bold">Lote {lot.id}</td>
                    <td className="py-4.5 px-5 font-display font-extrabold text-sm max-w-xs truncate">{lot.title}</td>
                    <td className="py-4.5 px-5 font-semibold text-neutral-500">Cat {lot.album}</td>
                    <td className="py-4.5 px-5 font-semibold">{formatCurrency(Number(lot.starting_price))}</td>
                    <td className="py-4.5 px-5 font-bold text-[var(--color-forest-dark)]">{formatCurrency(currentPrice)}</td>
                    <td className="py-4.5 px-5 font-semibold">{lot.bids_count || 0}</td>
                    <td className="py-4.5 px-5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase tracking-wide ${
                          lot.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : lot.status === 'extended'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {lot.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-5 text-neutral-500 font-medium whitespace-nowrap">
                      {new Date(lot.closing_time).toLocaleString('es-UY', {
                        timeZone: 'America/Montevideo',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-4.5 px-5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        {lot.status !== 'closed' && (
                          <button
                            onClick={() => handleExtend(lot.id, lot.title)}
                            disabled={isPending}
                            className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg border border-transparent hover:border-amber-200 transition-all"
                            title="Prorrogar 15 minutos manualmente"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(lot)}
                          disabled={isPending}
                          className="p-2 hover:bg-neutral-100 text-neutral-600 rounded-lg border border-transparent hover:border-neutral-200 transition-all"
                          title="Editar parámetros"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lot.id, lot.title)}
                          disabled={isPending}
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg border border-transparent hover:border-rose-200 transition-all"
                          title="Eliminar lote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {lots.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400">
                    No hay lotes ingresados en el remate actual.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CRUD (CREAR / EDITAR LOTE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--color-earth)]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-premium-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
              <h3 className="font-display font-black text-xl text-[var(--color-earth)]">
                {editingLot ? `Editar Lote #${editingLot.id}` : 'Crear Nuevo Lote Agrícola'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSave} className="p-6 flex-1 flex flex-col gap-4 font-sans text-xs">
              {/* Título */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display font-bold text-neutral-400 uppercase tracking-widest">
                  Título del Lote
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Tractor John Deere 6130J 4x4"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-display font-extrabold text-sm"
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display font-bold text-neutral-400 uppercase tracking-widest">
                  Ficha Técnica / Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles del motor, horas de uso, estado general, etc."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Precio Partida */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-bold text-neutral-400 uppercase tracking-widest">
                    Precio Partida (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="ej. 25000"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-semibold"
                  />
                </div>

                {/* Álbum */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-bold text-neutral-400 uppercase tracking-widest">
                    Álbum / Categoría
                  </label>
                  <select
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-semibold"
                  >
                    <option value="1">1. Cosechadoras & Tractores</option>
                    <option value="2">2. Implementos</option>
                    <option value="3">3. Herramientas de Taller</option>
                    <option value="4">4. Repuestos & Varios</option>
                  </select>
                </div>

                {/* Orden de Clasificación */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-bold text-neutral-400 uppercase tracking-widest">
                    Orden (sort)
                  </label>
                  <input
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    placeholder="ej. 1"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* URL de Imagen */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>URL de Imagen Destacada (Unsplash u otro CDN)</span>
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all"
                />
              </div>

              {/* Cierre base */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display font-bold text-neutral-400 uppercase tracking-widest">
                  Fecha y Hora de Cierre Base (Montevideo UTC-3)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={baseClosingTime}
                  onChange={(e) => setBaseClosingTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-semibold"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 font-display font-bold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-dark)] font-display font-black rounded-xl shadow-premium transition-all hover:scale-[1.01]"
                >
                  {isPending ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Guardar Lote</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
