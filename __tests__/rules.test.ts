// filepath: d:/PROYECTOS/REMATE CAMPO/__tests__/rules.test.ts
// @optimization: playwright-skill - Pruebas unitarias de Vitest para blindar incrementos de pujas, comisiones y reglas de negocio críticas

import { describe, it, expect } from 'vitest'
import { AUCTION_RULES } from '../lib/auction/rules'

describe('⚙️ Motor de Reglas del Remate (Uruguay)', () => {

  describe('1. Regla de Incrementos según Precio de Partida', () => {
    it('debe aplicar US$ 10 de incremento para precios de partida < US$ 200', () => {
      expect(AUCTION_RULES.getIncrement(150)).toBe(10)
      expect(AUCTION_RULES.getIncrement(50)).toBe(10)
    })

    it('debe aplicar US$ 50 de incremento para precios de partida entre US$ 200 y US$ 5.000', () => {
      expect(AUCTION_RULES.getIncrement(200)).toBe(50)
      expect(AUCTION_RULES.getIncrement(1200)).toBe(50)
      expect(AUCTION_RULES.getIncrement(5000)).toBe(50)
    })

    it('debe aplicar US$ 100 de incremento para precios de partida > US$ 5.000', () => {
      expect(AUCTION_RULES.getIncrement(5001)).toBe(100)
      expect(AUCTION_RULES.getIncrement(75000)).toBe(100)
    })
  })

  describe('2. Próxima Puja Mínima Válida', () => {
    it('debe retornar el precio de partida si no hay pujas previas (precio actual <= 0)', () => {
      expect(AUCTION_RULES.getNextBid(0, 48000)).toBe(48000)
    })

    it('debe acumular el incremento correspondiente al precio de partida sobre la puja líder', () => {
      // Precio de partida es 72000 (>5000 -> increment 100), precio actual es 72050
      expect(AUCTION_RULES.getNextBid(72050, 72000)).toBe(72150)
      
      // Precio de partida es 1500 (between 200-5000 -> increment 50), precio actual es 1600
      expect(AUCTION_RULES.getNextBid(1600, 1500)).toBe(1650)
    })
  })

  describe('3. Liquidación y Comisiones de Compra', () => {
    it('debe calcular 12% para pagos en efectivo o transferencia contado', () => {
      const { rate, commission, total } = AUCTION_RULES.getCommission(10000, 'cash')
      expect(rate).toBe(0.12)
      expect(commission).toBe(1200)
      expect(total).toBe(11200)
    })

    it('debe calcular 19% para pagos procesados con pasarela Mercado Pago', () => {
      const { rate, commission, total } = AUCTION_RULES.getCommission(10000, 'mercadopago')
      expect(rate).toBe(0.19)
      expect(commission).toBe(1900)
      expect(total).toBe(11900)
    })
  })

  describe('4. Urgencia de Cuenta Regresiva (HSL States)', () => {
    it('debe calificar como "safe" si queda más de 10 minutos', () => {
      expect(AUCTION_RULES.getCountdownState(601)).toBe('safe')
    })

    it('debe calificar como "warning" si quedan entre 1 y 10 minutos', () => {
      expect(AUCTION_RULES.getCountdownState(300)).toBe('warning')
      expect(AUCTION_RULES.getCountdownState(61)).toBe('warning')
    })

    it('debe calificar como "critical" si queda menos de 1 minuto', () => {
      expect(AUCTION_RULES.getCountdownState(59)).toBe('critical')
    })
  })

  describe('5. Regla de la Última Hora de Cierre', () => {
    it('debe identificar si la hora actual está dentro de la última hora crítica previo al cierre', () => {
      const closing = new Date('2026-05-22T20:00:00-03:00')
      
      const insideTime = new Date('2026-05-22T19:30:00-03:00')
      expect(AUCTION_RULES.isInLastHour(insideTime, closing)).toBe(true)

      const earlyTime = new Date('2026-05-22T18:30:00-03:00')
      expect(AUCTION_RULES.isInLastHour(earlyTime, closing)).toBe(false)
    })
  })

})
