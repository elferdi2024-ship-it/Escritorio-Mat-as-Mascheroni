// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/WinnerBanner.tsx
// @optimization: ui-ux-pro-max - Banner de ganador y adjudicación premium con confetti y pasarela Mercado Pago integrada

'use client'

import React, { useEffect, useState } from 'react'
import type { Lot, Bid } from '@/types'
import { AUCTION_RULES, formatCurrency } from '@/lib/auction/rules'
import { PartyPopper, Phone, CalendarCheck, CreditCard } from 'lucide-react'
import { redirectToCheckout } from '@/app/actions/checkout'
import { cn } from '@/lib/utils'
import { playWinSound } from '@/lib/sounds'

interface WinnerBannerProps {
  lot: Lot
  winnerBid?: Bid | null
  currentBidderSid?: string | null
}

export function WinnerBanner({ lot, winnerBid, currentBidderSid }: WinnerBannerProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Determinar si el postor actual de esta sesión es el ganador legítimo
  const isWinnerMe = winnerBid && currentBidderSid && winnerBid.created_at && winnerBid.bidder_name 
    // Compararemos por el alias guardado localmente o por la sesión (el bidder_sid descifrado del server)
    // El server nos pasará el currentBidderSid que validó de la cookie bidder_sid

  useEffect(() => {
    if (winnerBid) {
      setShowConfetti(true)
      playWinSound()
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [winnerBid])

  if (!winnerBid) {
    return (
      <div className="mb-6 p-5 bg-cream-dark/20 border border-glass-border rounded-premium-lg text-earth/60 font-sans font-medium text-center text-sm">
        🔒 Este lote ha cerrado oficialmente sin registrar ofertas.
      </div>
    )
  }

  const cash = AUCTION_RULES.getCommission(winnerBid.amount, 'cash')
  const mp = AUCTION_RULES.getCommission(winnerBid.amount, 'mercadopago')

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    setIsRedirecting(true);
    try {
      await redirectToCheckout(lot.id);
    } catch (err: any) {
      // Si el error es de redirección nativa de Next.js (NEXT_REDIRECT), se propaga normalmente.
      if (err.digest?.startsWith('NEXT_REDIRECT') || err.message?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      console.error('Error al iniciar Mercado Pago:', err);
      alert(err.message || 'Error al iniciar checkout');
      setIsRedirecting(false);
    }
  }

  return (
    <div className="mb-6 relative overflow-hidden rounded-premium-lg bg-gradient-to-br from-forest-dark via-forest to-forest-dark text-cream p-6 md:p-8 shadow-premium-lg border border-forest-dark/30 transition-premium">
      {/* Confetti con Emojis Animados */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 0.7}s`,
                animationDuration: `${1.2 + Math.random() * 1.5}s`,
                opacity: 0.85
              }}
            >
              {['🎉', '🎊', '✨', '🏆', '🚜', '🌾'][Math.floor(Math.random() * 6)]}
            </span>
          ))}
        </div>
      )}

      {/* Título Principal */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-wheat flex items-center justify-center shrink-0 shadow-premium-lg border-2 border-cream/20 animate-pulse-ring">
          <PartyPopper className="w-8 h-8 text-earth" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block text-[9px] tracking-widest uppercase font-extrabold bg-wheat/20 text-wheat border border-wheat/30 px-3 py-1 rounded-full mb-2">
            🏆 Lote Adjudicado
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black leading-tight">
            ¡Lote Adjudicado con Éxito!
          </h2>
          <p className="text-cream/80 text-sm mt-1">
            Líder Ganador: <b className="text-wheat font-bold">{winnerBid.bidder_name}</b> · Oferta Final:{' '}
            <b className="text-wheat font-extrabold">{formatCurrency(winnerBid.amount)}</b>
          </p>
        </div>
      </div>

      {/* Desglose de Comisiones */}
      <div className="relative z-10 mt-6 grid md:grid-cols-2 gap-4">
        <CommissionCard
          label="💵 Pago Contado (Transferencia)"
          rate="12%"
          total={cash.total}
          commission={cash.commission}
          highlight
        />
        <CommissionCard
          label="💳 Mercado Pago (Tarjetas)"
          rate="19%"
          total={mp.total}
          commission={mp.commission}
        />
      </div>

      {/* Botones de Acción */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
        <form onSubmit={handleCheckoutSubmit}>
          <button 
            type="submit"
            disabled={isRedirecting}
            className={cn(
              "flex items-center gap-2 px-5 py-3 bg-[#009EE3] hover:bg-[#0089C7] text-white font-display font-extrabold rounded-premium-md shadow-premium transition-premium text-sm",
              isRedirecting ? "opacity-50 cursor-not-allowed" : "active:scale-95"
            )}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            {isRedirecting ? 'Procesando checkout...' : 'Pagar con Mercado Pago (19%)'}
          </button>
        </form>

        <a
          href={`https://wa.me/59896125030?text=${encodeURIComponent(
            `¡Hola! Gané el lote #${lot.id} (${lot.title}) en el remate de maquinaria agrícola por un monto final de ${formatCurrency(winnerBid.amount)}. Deseo coordinar la facturación y entrega.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba56] text-white font-display font-extrabold rounded-premium-md shadow-premium transition-premium active:scale-95 text-sm"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" />
          Coordinar Pago por WhatsApp
        </a>

        <a
          href="tel:096125030"
          className="flex items-center gap-2 px-5 py-3 bg-transparent hover:bg-cream/10 text-cream border border-cream/20 font-display font-bold rounded-premium-md transition-premium text-sm"
        >
          <Phone className="w-4 h-4 shrink-0" />
          Llamar al Escritorio
        </a>
      </div>

      {/* Plazos de Retiro */}
      <p className="relative z-10 mt-5 text-[11px] text-cream/70 flex items-start gap-1.5 justify-center md:justify-start font-medium leading-relaxed">
        <span>⚠️</span>
        <span>
          Recuerda: Dispones de <b>24 horas</b> para comunicarte con el escritorio y coordinar el pago, y <b>7 días corridos</b> para realizar el retiro de la maquinaria del campo.
        </span>
      </p>
    </div>
  )
}

interface CommissionCardProps {
  label: string
  rate: string
  total: number
  commission: number
  highlight?: boolean
}

function CommissionCard({ label, rate, total, commission, highlight }: CommissionCardProps) {
  return (
    <div 
      className={cn(
        "p-4 rounded-premium-md transition-premium flex flex-col justify-between shadow-inner-premium",
        highlight 
          ? "bg-wheat/15 border border-wheat/30" 
          : "bg-cream/10 border border-cream/5"
      )}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="opacity-90 font-bold">{label}</span>
        <span className="font-extrabold px-2 py-0.5 rounded-full bg-cream/10 text-wheat text-[10px]">
          Comisión {rate}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-cream/10 pt-2">
        <span className="text-xs opacity-75 font-sans font-medium">Total Facturado:</span>
        <span className="font-display text-2xl font-black text-wheat tracking-tight tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>
      <div className="text-[10px] opacity-65 text-right font-sans font-semibold mt-1">
        (Monto base + comisiones: {formatCurrency(commission)})
      </div>
    </div>
  )
}
