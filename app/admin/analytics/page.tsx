// filepath: d:/PROYECTOS/REMATE CAMPO/app/admin/analytics/page.tsx
// @optimization: nextjs-best-practices - Dashboard de analíticas como Server Component (RSC) ejecutando queries concurrentes vía Promise.all y estructura visual premium

import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Gavel, Users, DollarSign, Target, Percent, TrendingUp } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/app/actions/admin'
import { formatCurrency } from '@/lib/auction/rules'

export const revalidate = 0 // Disable caching for accurate reports

interface GlobalStats {
  total_views: number
  unique_visitors: number
  total_bids: number
  active_bidders: number
  revenue_potential: number
  conversion_rate: number
}

interface ConversionFunnel {
  lot_views: number
  unique_viewers: number
  bidders: number
  total_bids: number
  won_lots: number
}

interface LotStatRow {
  lot_id: number
  title: string
  album: number
  starting_price: number
  status: string
  total_views: number
  total_bids: number
  unique_bidders: number
  highest_bid: number | null
  converted: number
}

export default async function AdminAnalyticsPage() {
  // 1. Verificar autenticación del servidor
  const isAuthed = await verifyAdminAuth()
  if (!isAuthed) {
    redirect('/admin/login')
  }

  const supabase = createServerSupabase()

  // 2. Refrescar la vista materializada de analíticas para reportes frescos
  await (supabase.rpc as any)('refresh_lot_stats').catch((e: any) => {
    console.error('Error al refrescar lot_stats:', e)
  })

  // 3. Ejecutar consultas concurrentes usando Promise.all para optimizar latencia
  const [statsRes, funnelRes, lotStatsRes] = await Promise.all([
    supabase.rpc('get_global_stats'),
    supabase.rpc('get_conversion_funnel'),
    supabase.from('lot_stats').select('*').order('total_views', { ascending: false }),
  ])

  if (statsRes.error || funnelRes.error || lotStatsRes.error) {
    console.error('Error en consultas de analíticas:', {
      stats: statsRes.error,
      funnel: funnelRes.error,
      lots: lotStatsRes.error,
    })
    throw new Error('Error al cargar reporte de analíticas')
  }

  const globalStats = statsRes.data as unknown as GlobalStats
  const funnel = funnelRes.data as unknown as ConversionFunnel
  const lotStats = lotStatsRes.data as unknown as LotStatRow[]

  return (
    <div className="flex flex-col gap-6 py-4" id="analytics-page-container">
      {/* Barra superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-[var(--color-earth)] tracking-tight">
            Analíticas de Negocio
          </h1>
          <p className="text-neutral-500 font-sans text-xs mt-1">
            Estadísticas globales, embudo de conversión y rendimiento comercial del remate.
          </p>
        </div>

        <div>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-[var(--color-earth)] text-xs font-display font-bold rounded-xl transition-premium shadow-premium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Clave */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Vistas */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-premium flex flex-col gap-1.5">
          <Eye className="w-5 h-5 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Vistas (7d)</span>
          <span className="text-2xl font-display font-black text-[var(--color-earth)]">{globalStats.total_views}</span>
        </div>

        {/* Visitantes Únicos */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-premium flex flex-col gap-1.5">
          <Users className="w-5 h-5 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Visitantes</span>
          <span className="text-2xl font-display font-black text-[var(--color-earth)]">{globalStats.unique_visitors}</span>
        </div>

        {/* Ofertas */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-premium flex flex-col gap-1.5">
          <Gavel className="w-5 h-5 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Pujas totales</span>
          <span className="text-2xl font-display font-black text-[var(--color-earth)]">{globalStats.total_bids}</span>
        </div>

        {/* Postores activos */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-premium flex flex-col gap-1.5">
          <Target className="w-5 h-5 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Postores</span>
          <span className="text-2xl font-display font-black text-[var(--color-earth)]">{globalStats.active_bidders}</span>
        </div>

        {/* Conversión global */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-premium flex flex-col gap-1.5">
          <Percent className="w-5 h-5 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Conversión</span>
          <span className="text-2xl font-display font-black text-[var(--color-forest-dark)]">{globalStats.conversion_rate}%</span>
        </div>

        {/* Recaudación potencial */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-premium flex flex-col gap-1.5 col-span-2 lg:col-span-1">
          <DollarSign className="w-5 h-5 text-neutral-400" />
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Volumen Pujado</span>
          <span className="text-xl font-display font-black text-[var(--color-forest-dark)] truncate">
            {formatCurrency(globalStats.revenue_potential)}
          </span>
        </div>
      </div>

      {/* Embudo de Conversión */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium">
        <h3 className="text-base font-display font-bold text-[var(--color-earth)] mb-6 uppercase tracking-wider">
          Embudo de Conversión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Paso 1 */}
          <div className="bg-[var(--color-cream)]/50 rounded-xl p-4 border border-neutral-100 flex flex-col items-center text-center">
            <span className="text-2xl font-display font-black text-[var(--color-earth)]">{funnel.lot_views}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-1">Vistas Lote</span>
            <span className="text-[9px] text-neutral-400 font-sans mt-0.5">Volumen bruto de visitas</span>
          </div>

          {/* Paso 2 */}
          <div className="bg-[var(--color-cream)]/70 rounded-xl p-4 border border-neutral-100 flex flex-col items-center text-center">
            <span className="text-2xl font-display font-black text-[var(--color-earth)]">{funnel.unique_viewers}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-1">Espectadores</span>
            <span className="text-[9px] text-neutral-500 font-bold mt-0.5">
              {funnel.lot_views > 0 ? `${Math.round(100.0 * funnel.unique_viewers / funnel.lot_views)}%` : '0%'} ret.
            </span>
          </div>

          {/* Paso 3 */}
          <div className="bg-[var(--color-cream)]/90 rounded-xl p-4 border border-neutral-100 flex flex-col items-center text-center">
            <span className="text-2xl font-display font-black text-[var(--color-earth)]">{funnel.bidders}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-1">Postores</span>
            <span className="text-[9px] text-emerald-600 font-bold mt-0.5">
              {funnel.unique_viewers > 0 ? `${Math.round(100.0 * funnel.bidders / funnel.unique_viewers)}%` : '0%'} conv.
            </span>
          </div>

          {/* Paso 4 */}
          <div className="bg-[var(--color-wheat)]/10 rounded-xl p-4 border border-[var(--color-wheat)]/30 flex flex-col items-center text-center">
            <span className="text-2xl font-display font-black text-[var(--color-earth)]">{funnel.total_bids}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-1">Pujas</span>
            <span className="text-[9px] text-neutral-500 font-sans mt-0.5">Promedio {(funnel.total_bids / (funnel.bidders || 1)).toFixed(1)} p/postor</span>
          </div>

          {/* Paso 5 */}
          <div className="bg-[var(--color-forest)]/10 rounded-xl p-4 border border-[var(--color-forest)]/30 flex flex-col items-center text-center">
            <span className="text-2xl font-display font-black text-[var(--color-forest-dark)]">{funnel.won_lots}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mt-1">Adjudicados</span>
            <span className="text-[9px] text-[var(--color-forest)] font-bold mt-0.5">Cierres exitosos</span>
          </div>
        </div>
      </div>

      {/* Rendimiento de Lotes Individuales */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-premium overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-display font-bold text-[var(--color-earth)] uppercase tracking-wider">
            Rendimiento Comercial de Lotes
          </h3>
          <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Ordenado por vistas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase tracking-wider font-display font-bold text-neutral-400">
                <th className="py-4 px-5">ID Lote</th>
                <th className="py-4 px-5">Equipo Agrícola</th>
                <th className="py-4 px-5">Vistas Lote</th>
                <th className="py-4 px-5">Pujas totales</th>
                <th className="py-4 px-5">Postores únicos</th>
                <th className="py-4 px-5">Oferta más alta</th>
                <th className="py-4 px-5">Tasa de Oferta (Bid/Views)</th>
                <th className="py-4 px-5">Adjudicado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-sans text-[var(--color-earth)]">
              {lotStats.map((lot) => {
                const bidViewsRate = lot.total_views > 0 ? (100.0 * lot.total_bids) / lot.total_views : 0
                return (
                  <tr key={lot.lot_id} className="hover:bg-neutral-50/50 transition-colors duration-150">
                    <td className="py-4 px-5 font-bold">Lote {lot.lot_id}</td>
                    <td className="py-4 px-5 font-display font-extrabold text-sm">{lot.title}</td>
                    <td className="py-4 px-5 font-semibold text-neutral-600 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{lot.total_views}</span>
                    </td>
                    <td className="py-4 px-5 font-semibold text-neutral-600">{lot.total_bids}</td>
                    <td className="py-4 px-5 font-semibold text-neutral-600">{lot.unique_bidders}</td>
                    <td className="py-4 px-5 font-bold text-[var(--color-forest-dark)]">
                      {lot.highest_bid ? formatCurrency(lot.highest_bid) : 'Sin pujas'}
                    </td>
                    <td className="py-4 px-5 font-semibold text-neutral-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-neutral-400" />
                        <span>{bidViewsRate.toFixed(1)}%</span>
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase ${
                          lot.converted === 1
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-neutral-50 text-neutral-400 border border-neutral-100'
                        }`}
                      >
                        {lot.converted === 1 ? 'Sí' : 'No'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
