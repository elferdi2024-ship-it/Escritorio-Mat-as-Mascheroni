// filepath: d:/PROYECTOS/REMATE CAMPO/components/analytics/RecentActivity.tsx
// @visual: ui-ux-pro-max - Registro interactivo de últimas pujas en tiempo real con transiciones animadas y flip-styling

import React from 'react'
import { Gavel, Clock, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { formatCurrency } from '@/lib/auction/rules'

interface ActivityItem {
  id: number
  lotId: number
  lotTitle: string
  bidderName: string
  amount: number
  createdAt: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card hoverable={false}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Gavel className="w-4 h-4 text-[var(--color-forest)] animate-pulse" />
          <CardTitle className="text-sm uppercase tracking-wider">Actividad en Tiempo Real</CardTitle>
        </div>
        <span className="text-[9px] text-neutral-400 font-sans uppercase font-bold tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-wheat)] animate-spin" />
          <span>Monitoreo Vivo</span>
        </span>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-100 max-h-[350px] overflow-y-auto">
          {activities.map((act) => (
            <div 
              key={act.id} 
              className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors duration-150 animate-fade-in"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-400 font-sans">
                  Lote {act.lotId} · <b className="text-[var(--color-earth-800)] font-extrabold">{act.lotTitle}</b>
                </span>
                <span className="text-xs font-sans font-bold text-neutral-700">
                  {act.bidderName}
                </span>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-display font-black text-[var(--color-forest-dark)] tabular">
                  {formatCurrency(act.amount)}
                </span>
                <span className="text-[9px] text-neutral-400 font-sans flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-300" />
                  <span>
                    {new Date(act.createdAt).toLocaleTimeString('es-UY', {
                      timeZone: 'America/Montevideo',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </span>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="py-8 text-center text-neutral-400 font-sans text-xs">
              Sin pujas registradas en los últimos minutos.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
