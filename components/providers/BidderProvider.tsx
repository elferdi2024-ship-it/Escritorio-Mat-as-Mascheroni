// filepath: d:/PROYECTOS/REMATE CAMPO/components/providers/BidderProvider.tsx
// @optimization: react-best-practices - Gestión e hidratación segura de identidad local de postores (bidders)

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface Bidder {
  name: string
  phone: string
  email: string
}

interface BidderContextProps {
  bidder: Bidder
  setBidder: (bidder: Bidder) => void
  isLoaded: boolean
}

const BidderCtx = createContext<BidderContextProps | null>(null)

export function BidderProvider({ children }: { children: React.ReactNode }) {
  const [bidder, setBidderState] = useState<Bidder>({ name: '', phone: '', email: '' })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bidder_identity')
      if (stored) {
        setBidderState(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Error al leer bidder_identity desde localStorage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const setBidder = (newBidder: Bidder) => {
    setBidderState(newBidder)
    try {
      localStorage.setItem('bidder_identity', JSON.stringify(newBidder))
    } catch (e) {
      console.error('Error al guardar bidder_identity en localStorage', e)
    }
  }

  return (
    <BidderCtx.Provider value={{ bidder, setBidder, isLoaded }}>
      {children}
    </BidderCtx.Provider>
  )
}

export const useBidder = () => {
  const ctx = useContext(BidderCtx)
  if (!ctx) {
    throw new Error('useBidder debe usarse dentro de un BidderProvider')
  }
  return ctx
}
