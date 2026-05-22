// filepath: d:/PROYECTOS/REMATE CAMPO/components/analytics/StatsGrid.tsx
// @visual: ui-ux-pro-max - StatsGrid premium con tarjetas de métricas detalladas e íconos interactivos de Lucide-React

import React from 'react'
import { Eye, Users, Gavel, Target, Percent, DollarSign } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { formatCurrency } from '@/lib/auction/rules'

interface StatsGridProps {
  totalViews: number
  uniqueVisitors: number
  totalBids: number
  activeBidders: number
  conversionRate: number
  revenuePotential: number
}

export function StatsGrid({
  totalViews,
  uniqueVisitors,
  totalBids,
  activeBidders,
  conversionRate,
  revenuePotential,
}: StatsGridProps) {
  const metrics = [
    {
      title: "Vistas Totales",
      value: totalViews,
      desc: "Tráfico acumulado de lotes",
      icon: Eye,
      color: "text-blue-600 bg-blue-50/50 border-blue-100",
    },
    {
      title: "Espectadores Únicos",
      value: uniqueVisitors,
      desc: "Navegadores identificados",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50/50 border-indigo-100",
    },
    {
      title: "Pujas Registradas",
      value: totalBids,
      desc: "Participación en subasta",
      icon: Gavel,
      color: "text-[var(--color-forest-dark)] bg-emerald-50/50 border-emerald-100",
    },
    {
      title: "Postores Activos",
      value: activeBidders,
      desc: "Bidders con ofertas firmes",
      icon: Target,
      color: "text-amber-600 bg-amber-50/50 border-amber-100",
    },
    {
      title: "Conversión de Remate",
      value: `${conversionRate}%`,
      desc: "Lotes con ofertas",
      icon: Percent,
      color: "text-[var(--color-forest-dark)] bg-emerald-50/50 border-emerald-100",
    },
    {
      title: "Volumen Pujado",
      value: formatCurrency(revenuePotential),
      desc: "Suma de ofertas máximas",
      icon: DollarSign,
      color: "text-[var(--color-forest-dark)] bg-emerald-50/50 border-emerald-100",
      colspan: "col-span-2 lg:col-span-1",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <Card 
            key={idx} 
            className={m.colspan || ""}
            hoverable={true}
          >
            <CardContent className="p-5 flex flex-col gap-2">
              <div className={`p-2.5 rounded-xl border w-max ${m.color}`}>
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <div className="flex flex-col gap-0.5 mt-2">
                <span className="text-[9px] text-neutral-400 font-sans uppercase font-bold tracking-wider">
                  {m.title}
                </span>
                <span className="text-xl md:text-2xl font-display font-black text-[var(--color-earth)] tracking-tight tabular">
                  {m.value}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                {m.desc}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
