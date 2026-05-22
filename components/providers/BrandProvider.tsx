// filepath: d:/PROYECTOS/REMATE CAMPO/components/providers/BrandProvider.tsx
// @optimization: react-best-practices - Brand Context Provider para inyectar marca multi-tenant

'use client'

import React, { createContext, useContext } from 'react'
import type { BrandType } from '@/lib/branding'

const BrandContext = createContext<BrandType | null>(null)

interface BrandProviderProps {
  brand: BrandType
  children: React.ReactNode
}

export function BrandProvider({ brand, children }: BrandProviderProps) {
  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand debe usarse dentro de un BrandProvider')
  }
  return context
}
