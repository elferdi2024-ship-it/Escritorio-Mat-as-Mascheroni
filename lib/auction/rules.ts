// filepath: d:/PROYECTOS/REMATE CAMPO/lib/auction/rules.ts
// @optimization: react-best-practices - Reglas de negocio del remate (Single Source of Truth)

export const AUCTION_RULES = {
  // Incrementos según el precio de partida del lote
  getIncrement(startingPrice: number): number {
    if (startingPrice < 200) return 10
    if (startingPrice <= 5000) return 50
    return 100
  },

  // Calcular la próxima puja mínima válida
  getNextBid(currentPrice: number, startingPrice: number): number {
    if (currentPrice <= 0) return startingPrice
    if (currentPrice < startingPrice) return startingPrice
    return currentPrice + this.getIncrement(startingPrice)
  },

  // Generar opciones de pujas rápidas (+1, +3, +5 incrementos)
  getQuickBids(currentPrice: number, startingPrice: number): number[] {
    const inc = this.getIncrement(startingPrice)
    const base = currentPrice > 0 ? currentPrice : startingPrice
    // Si el precio actual es cero, las opciones son startingPrice, startingPrice + inc*2, startingPrice + inc*4
    if (currentPrice <= 0 || currentPrice < startingPrice) {
      return [startingPrice, startingPrice + inc * 2, startingPrice + inc * 4]
    }
    return [base + inc, base + inc * 3, base + inc * 5]
  },

  // Comisión según método de pago (12% efectivo / 19% Mercado Pago)
  getCommission(amount: number, method: 'cash' | 'mercadopago') {
    const rate = method === 'cash' ? 0.12 : 0.19
    const commission = amount * rate
    return {
      rate,
      commission: Math.round(commission * 100) / 100,
      total: Math.round((amount + commission) * 100) / 100
    }
  },

  // Umbral de urgencia en el tiempo restante (en segundos)
  getCountdownState(secondsLeft: number): 'safe' | 'warning' | 'critical' {
    if (secondsLeft > 600) return 'safe'       // > 10 min
    if (secondsLeft > 60) return 'warning'     // 1-10 min
    return 'critical'                          // < 1 min
  },

  // Verificar si la subasta está en la última hora crítica de cierre (19:00 - 20:00 del closing_time)
  isInLastHour(now: Date, closingTime: Date): boolean {
    // Si la fecha de cierre es hoy, la última hora del remate es entre las 19:00 y las 20:00 (UTC-3).
    // Para simplificar, es el período de 60 minutos previo a la hora de cierre oficial (20:00).
    const closingTimeMs = closingTime.getTime()
    const oneHourMs = 60 * 60 * 1000
    const startOfLastHourMs = closingTimeMs - oneHourMs
    const nowMs = now.getTime()
    return nowMs >= startOfLastHourMs && nowMs < closingTimeMs
  }
}

export const formatCurrency = (amount: number): string => {
  return 'US$ ' + new Intl.NumberFormat('es-UY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
