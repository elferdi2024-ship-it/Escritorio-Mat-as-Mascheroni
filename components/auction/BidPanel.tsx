// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/BidPanel.tsx
// @optimization: react-best-practices - Panel interactivo compatible con React 18, con retroalimentación sonora sintética y estados controlados de carga
'use client'

import React, { useState, useEffect } from 'react'
import { Gavel, User, Phone, Mail, Sparkles, TrendingUp, Info } from 'lucide-react'
import { useBidder } from '../providers/BidderProvider'
import { placeBidAction } from '@/app/actions/bids'
import { AUCTION_RULES, formatCurrency } from '@/lib/auction/rules'
import { playBidSound } from '@/lib/sounds'
import { useToast } from '../ui/use-toast'
import { cn } from '@/lib/utils'

interface BidPanelProps {
  lotId: number
  startingPrice: number
  currentPrice: number
  status: 'active' | 'extended' | 'closed'
  highestBidderName?: string | null
}

export default function BidPanel({ lotId, startingPrice, currentPrice, status, highestBidderName }: BidPanelProps) {
  const { bidder, setBidder, isLoaded } = useBidder()
  const { toast } = useToast()
  
  const [isPending, setIsPending] = useState(false)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [localPrice, setLocalPrice] = useState(currentPrice)
  const [formError, setFormError] = useState<string | null>(null)
  const [localLeader, setLocalLeader] = useState<string | null>(highestBidderName || null)

  // Sincronizar el precio actual local y el líder actual cuando cambie por Realtime
  useEffect(() => {
    setLocalPrice(currentPrice)
  }, [currentPrice])

  useEffect(() => {
    setLocalLeader(highestBidderName || null)
  }, [highestBidderName])

  const triggerConfetti = () => {
    if (typeof window === 'undefined') return
    const colors = ['#d4af37', '#2e7d32', '#8b5a2b', '#10b981', '#f59e0b']
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div')
      confetti.style.position = 'fixed'
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.top = '100vh'
      confetti.style.width = `${Math.random() * 10 + 5}px`
      confetti.style.height = `${Math.random() * 10 + 5}px`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)] || '#d4af37'
      confetti.style.zIndex = '9999'
      confetti.style.borderRadius = '2px'
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`
      confetti.style.transition = 'transform 2s ease-out, top 2s ease-out, opacity 2s ease-out'
      document.body.appendChild(confetti)

      setTimeout(() => {
        confetti.style.top = `${Math.random() * 30 + 20}vh`
        confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 80 - 40}px)`
        confetti.style.opacity = '0'
      }, 50)

      setTimeout(() => {
        confetti.remove()
      }, 2100)
    }
  }

  const increment = AUCTION_RULES.getIncrement(startingPrice)
  const minNextBid = AUCTION_RULES.getNextBid(localPrice, startingPrice)
  const quickBidOptions = AUCTION_RULES.getQuickBids(localPrice, startingPrice)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const amount = Number(formData.get('amount'))

    // Validaciones básicas de cliente
    if (!name || name.trim().length < 2) {
      setFormError('Por favor, introduce tu nombre completo.')
      setIsPending(false)
      return
    }
    if (!phone || phone.trim().length < 8) {
      setFormError('Por favor, introduce un teléfono de contacto válido.')
      setIsPending(false)
      return
    }
    if (!email || !email.includes('@')) {
      setFormError('Por favor, introduce un correo electrónico válido.')
      setIsPending(false)
      return
    }
    if (!amount || amount < minNextBid) {
      setFormError(`La puja mínima requerida es ${formatCurrency(minNextBid)}`)
      setIsPending(false)
      return
    }

    // Actualizar localStorage del bidder
    setBidder({ name, phone, email })

    // Estado optimista: actualizar precio local e iniciar sonido
    const previousPrice = localPrice
    setLocalPrice(amount)
    playBidSound()

    try {
      const res = await placeBidAction(lotId, amount, name, phone, email)

      if (res.ok) {
        toast({
          title: '⚡ ¡Puja registrada con éxito!',
          description: `Tu oferta por ${formatCurrency(amount)} ha sido colocada. Eres el nuevo líder.`,
        })
        setCustomAmount('')
        triggerConfetti()
        setLocalLeader(name)
      } else {
        // Revertir optimismo
        setLocalPrice(previousPrice)
        toast({
          title: '⚠️ Error al ofertar',
          description: res.error,
          variant: 'destructive',
        })
        setFormError(res.error || 'Ocurrió un error inesperado al colocar la puja.')
      }
    } catch (err: any) {
      setLocalPrice(previousPrice)
      setFormError(err.message || 'Error de red al conectar con el servidor.')
    } finally {
      setIsPending(false)
    }
  }

  if (status === 'closed') {
    return (
      <div className="bg-neutral-100 rounded-2xl border border-neutral-200 p-6 text-center shadow-inner-premium">
        <Info className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
        <h4 className="font-display font-bold text-lg text-neutral-700">Subasta Finalizada</h4>
        <p className="text-neutral-500 font-sans text-sm mt-1.5 leading-relaxed">
          Este lote ha cerrado oficialmente. Ya no se aceptan nuevas ofertas ni prórrogas.
        </p>
      </div>
    )
  }

  const isBiddingDisabled = isPending || !isLoaded
  const isMeLeader = isLoaded && bidder.name !== '' && localLeader === bidder.name

  return (
    <div 
      className={cn(
        "backdrop-blur-md rounded-2xl border transition-all duration-500 shadow-premium p-6 flex flex-col gap-6 sticky top-6",
        isMeLeader 
          ? "border-amber-400 bg-gradient-to-br from-amber-50/10 to-white/95 shadow-[0_0_30px_rgba(212,175,55,0.22)]"
          : "bg-white/60 border-[var(--color-glass-border)]"
      )}
    >
      {/* Indicador de Líder Actual */}
      {isMeLeader && (
        <div className="w-full bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 flex items-center gap-2.5 shadow-subtle animate-[scaleUp_0.25s_var(--ease-spring)]">
          <span className="text-xl">👑</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-display font-extrabold text-amber-700 uppercase tracking-widest leading-none">Vas Ganando</span>
            <span className="text-[10px] text-amber-900 font-semibold mt-1">¡Sos la oferta más alta de este lote!</span>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg font-display font-extrabold text-[var(--color-earth)] flex items-center gap-2">
          <Gavel className="w-5 h-5 text-[var(--color-forest)] animate-pulse" />
          <span>Ofertar en este Lote</span>
        </h3>
        <p className="text-xs text-neutral-500 mt-1 font-sans">
          Ingresa tus datos y tu oferta. La comisión es de 12% contado o 19% con Mercado Pago.
        </p>
      </div>

      {/* Visualización del Precio */}
      <div className="bg-[var(--color-cream)]/80 rounded-xl p-4 flex flex-col gap-1 border border-neutral-100 shadow-inner-premium">
        <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Precio Actual en Pantalla</span>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-display font-black text-[var(--color-earth)] tracking-tight">
            {formatCurrency(localPrice)}
          </span>
          <span className="text-xs text-[var(--color-forest)] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Mínima: {formatCurrency(minNextBid)}</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Formulario de Identidad Bidder */}
        <div className="flex flex-col gap-3.5 border-b border-neutral-100 pb-5">
          <h4 className="text-xs font-display font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Tus Datos de Identidad</span>
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Nombre */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                name="name"
                defaultValue={bidder.name || ''}
                required
                placeholder="Nombre y Apellido"
                disabled={isBiddingDisabled}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-sans"
              />
            </div>

            {/* Teléfono */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="tel"
                name="phone"
                defaultValue={bidder.phone || ''}
                required
                placeholder="Celular (ej: 099123456)"
                disabled={isBiddingDisabled}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-sans"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                name="email"
                defaultValue={bidder.email || ''}
                required
                placeholder="Correo Electrónico"
                disabled={isBiddingDisabled}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-sans"
              />
            </div>
          </div>
        </div>

        {/* Lógica de Puja Rápida */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-display font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-wheat)]" />
            <span>Pujas Rápidas del Reglamento</span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {quickBidOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                disabled={isBiddingDisabled}
                onClick={() => setCustomAmount(String(opt))}
                className="py-2.5 bg-white text-[var(--color-earth)] border border-neutral-200 rounded-xl font-display font-bold text-xs hover:border-[var(--color-forest)] hover:bg-[var(--color-cream)] hover:shadow-premium transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <span className="text-[9px] text-[var(--color-forest)] font-extrabold uppercase font-sans">
                  +{i === 0 ? '1' : i === 1 ? '3' : '5'} Inc
                </span>
                <span className="text-xs font-black">{opt.toLocaleString('es-UY')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Puja personalizada */}
        <div className="flex flex-col gap-2">
          <label htmlFor="amount" className="text-xs font-display font-bold text-neutral-400 uppercase tracking-widest">
            Monto de puja (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              min={minNextBid}
              step={increment}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              required
              placeholder={`Mínimo: ${minNextBid}`}
              disabled={isBiddingDisabled}
              className="w-full pl-8 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all font-display font-extrabold"
            />
          </div>
        </div>

        {/* Feedback de error si lo hay */}
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed font-sans animate-fade-in">
            {formError}
          </div>
        )}

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={isBiddingDisabled}
          className={cn(
            "w-full py-4 text-white font-display font-black text-sm tracking-widest uppercase rounded-xl transition-premium shadow-premium flex items-center justify-center gap-2 cursor-pointer",
            isBiddingDisabled
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              : "bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] hover:-translate-y-0.5"
          )}
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Gavel className="w-4 h-4 text-[var(--color-wheat)]" />
              <span>Realizar Oferta Oficial</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
