// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/toaster.tsx
// @optimization: react-best-practices - Renderizador Toaster con soporte de animaciones fluidas

'use client'

import React from 'react'
import { useToast } from './use-toast'
import { Toast } from './toast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div 
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none"
      aria-live="assertive"
      aria-instant="true"
    >
      {toasts.map(t => (
        <div 
          key={t.id} 
          className="pointer-events-auto w-full transition-all duration-300 transform scale-100 hover:scale-[1.01] active:scale-[0.99] origin-bottom animate-in slide-in-from-bottom-5"
        >
          <Toast variant={t.variant} onClose={() => dismiss(t.id)}>
            {t.title && <div className="font-display font-bold tracking-tight mb-1 text-sm">{t.title}</div>}
            {t.description && <div className="text-xs leading-relaxed opacity-90">{t.description}</div>}
          </Toast>
        </div>
      ))}
    </div>
  )
}
