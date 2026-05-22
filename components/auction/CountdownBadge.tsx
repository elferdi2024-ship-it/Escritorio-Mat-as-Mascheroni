// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/CountdownBadge.tsx
// @visual: ui-ux-pro-max - Badge de cuenta regresiva compacto, elegante y con soporte oklch para tarjetas de listado

'use client'

import React, { useEffect, useState } from 'react'
import { AUCTION_RULES } from '@/lib/auction/rules'
import { cn } from '@/lib/utils'

interface CountdownBadgeProps {
  closingTime: string
  status: 'active' | 'extended' | 'closed'
}

export function CountdownBadge({ closingTime, status }: CountdownBadgeProps) {
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (status === 'closed') {
    return (
      <span className="px-2 py-0.5 bg-[var(--color-earth-800)] text-[var(--color-cream)] text-[10px] font-display font-extrabold tracking-wider rounded-sm uppercase shadow-subtle border border-[var(--color-earth-950)]/20">
        Cerrado
      </span>
    )
  }

  const targetTime = new Date(closingTime).getTime()
  const secondsLeft = Math.max(0, Math.floor((targetTime - now) / 1000))

  if (secondsLeft === 0) {
    return (
      <span className="px-2 py-0.5 bg-[var(--color-earth-800)] text-[var(--color-cream)] text-[10px] font-display font-extrabold tracking-wider rounded-sm uppercase shadow-subtle border border-[var(--color-earth-950)]/20">
        Cerrado
      </span>
    )
  }

  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  const state = AUCTION_RULES.getCountdownState(secondsLeft)

  // Asignar colores oklch de marca estrictos
  let badgeClass = "bg-[var(--color-forest-500)] text-white shadow-subtle"
  let animationDotClass = "bg-white/70"

  if (status === 'extended') {
    badgeClass = "bg-[var(--color-forest-900)] text-white border border-[var(--color-wheat-400)] relative overflow-hidden"
    animationDotClass = "bg-[var(--color-wheat-400)] animate-ping"
  } else if (state === 'critical') {
    badgeClass = "bg-[var(--color-alert)] text-white shadow-glow-forest animate-[pulse_0.8s_infinite_alternate]"
    animationDotClass = "bg-white animate-ping"
  } else if (state === 'warning') {
    badgeClass = "bg-[var(--color-wheat-400)] text-[var(--color-earth-950)] shadow-glow-wheat animate-[pulse_1.5s_infinite_alternate]"
    animationDotClass = "bg-[var(--color-earth-950)]/70 animate-ping"
  }

  let formattedText = ''
  if (days > 0) {
    formattedText = `${days}d ${hours}h`
  } else if (hours > 0) {
    formattedText = `${hours}h ${minutes}m`
  } else {
    formattedText = `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <span 
      className={cn(
        "px-2.5 py-0.5 text-[10px] font-display font-bold rounded-sm tracking-wide flex items-center gap-1.5 tabular transition-premium",
        badgeClass
      )}
      role="status"
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full inline-block shrink-0",
        animationDotClass
      )} />
      {status === 'extended' ? `⚡ Prórroga: ${formattedText}` : formattedText}
    </span>
  )
}
