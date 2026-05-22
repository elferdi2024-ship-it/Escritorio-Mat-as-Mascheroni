// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/CountdownTimer.tsx
// @visual: ui-ux-pro-max - Cuenta regresiva ultra interactiva, accesible, con HSL/oklch semántico y micro-animaciones según el Design System

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { AUCTION_RULES } from '@/lib/auction/rules'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  closingTime: string
  baseClosingTime: string
  status: 'active' | 'extended' | 'closed'
  onExpire?: () => void
}

export function CountdownTimer({
  closingTime,
  baseClosingTime,
  status,
  onExpire
}: CountdownTimerProps) {
  const [now, setNow] = useState<number>(Date.now())
  const onExpireCalled = useRef(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const targetTime = new Date(closingTime).getTime()
  const secondsLeft = Math.max(0, Math.floor((targetTime - now) / 1000))

  useEffect(() => {
    if (secondsLeft === 0 && !onExpireCalled.current && status !== 'closed') {
      onExpireCalled.current = true
      if (onExpire) {
        onExpire()
      }
    }
    if (secondsLeft > 0) {
      onExpireCalled.current = false
    }
  }, [secondsLeft, onExpire, status])

  // Estado Cerrado
  if (status === 'closed' || secondsLeft === 0) {
    return (
      <div 
        className="w-full bg-[var(--color-earth-800)] text-[var(--color-cream)] text-center py-4 px-6 rounded-md font-display font-bold tracking-wider shadow-subtle flex items-center justify-center gap-2 border border-[var(--color-earth-950)]/20"
        role="timer"
        aria-live="polite"
      >
        <span>🏁</span> LOTE CERRADO
      </div>
    )
  }

  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  const state = AUCTION_RULES.getCountdownState(secondsLeft)
  const isExtended = status === 'extended'

  // Clases semánticas basadas en el brief estricto
  let bgClass = "bg-[var(--color-forest-500)] text-white"
  let labelText = "Tiempo restante"
  let animationClass = ""

  if (isExtended) {
    bgClass = "bg-[var(--color-forest-900)] text-white border-2 border-[var(--color-wheat-400)] relative overflow-hidden"
    labelText = "⚡ PRÓRROGA ACTIVA (+10 MIN)"
    animationClass = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shining_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
  } else if (state === 'critical') {
    bgClass = "bg-[var(--color-alert)] text-white shadow-glow-forest"
    labelText = "🔥 ÚLTIMO MINUTO"
    animationClass = "animate-[pulse_0.8s_infinite_alternate]"
  } else if (state === 'warning') {
    bgClass = "bg-[var(--color-wheat-400)] text-[var(--color-earth-950)] shadow-glow-wheat"
    labelText = "⚠️ Cerrando pronto"
    animationClass = "animate-[pulse_1.5s_infinite_alternate]"
  } else {
    // safe
    bgClass = "bg-[var(--color-forest-500)] text-white shadow-subtle"
    labelText = "Tiempo restante"
  }

  return (
    <div 
      className={cn(
        "rounded-lg p-5 transition-premium flex flex-col justify-center items-center text-center",
        bgClass,
        animationClass
      )}
      role="timer"
      aria-label={`Tiempo restante: ${days > 0 ? days + ' días, ' : ''}${hours} horas, ${minutes} minutos, ${seconds} segundos.`}
    >
      <div className="text-[10px] font-display font-extrabold tracking-widest uppercase mb-3 opacity-90">
        {labelText}
      </div>

      <div className="flex items-center justify-center gap-3 font-display font-black leading-none">
        {days > 0 && (
          <>
            <TimeBlock value={days} label="días" />
            <span className="text-3xl opacity-40 font-light mb-4">:</span>
          </>
        )}
        <TimeBlock value={hours} label="hrs" />
        <span className="text-3xl opacity-40 font-light mb-4">:</span>
        <TimeBlock value={minutes} label="min" />
        <span className="text-3xl opacity-40 font-light mb-4">:</span>
        <TimeBlock value={seconds} label="seg" highlight={state === 'critical'} />
      </div>
    </div>
  )
}

interface TimeBlockProps {
  value: number
  label: string
  highlight?: boolean
}

function TimeBlock({ value, label, highlight }: TimeBlockProps) {
  return (
    <div className="flex flex-col items-center min-w-[50px]">
      <div 
        className={cn(
          "text-3xl md:text-4xl font-display font-bold tabular tracking-tighter",
          highlight ? "text-[var(--color-wheat-200)]" : ""
        )}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[9px] font-sans font-bold tracking-widest uppercase opacity-75 mt-1.5">
        {label}
      </div>
    </div>
  )
}
