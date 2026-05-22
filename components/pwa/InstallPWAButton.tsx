// filepath: d:/PROYECTOS/REMATE CAMPO/components/pwa/InstallPWAButton.tsx
// @optimization: ui-ux-pro-max - Banner PWA inteligente y adaptativo con soporte para iOS y Android y descarte local

'use client'

import React, { useEffect, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // 1. Detección de dispositivos iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    // 2. Detección de si ya está instalada o ejecutándose standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    // 3. Comprobar si el banner fue descartado previamente
    const dismissed = localStorage.getItem('pwa_dismissed')

    if (isStandalone || dismissed) return

    if (isIOSDevice) {
      setIsIOS(true)
      // Mostrar banner de iOS a los 5 segundos de navegación
      const timer = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(timer)
    }

    // 4. Capturar el evento 'beforeinstallprompt' nativo de Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Mostrar banner a los 5 segundos de navegación
      setTimeout(() => setShow(true), 5000)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('pwa_dismissed', '1')
  }

  if (!show) return null

  return (
    <div 
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-85 z-50 animate-in slide-in-from-bottom-5 duration-350 pointer-events-auto"
      role="alert"
      aria-live="polite"
    >
      <div className="glassmorphism border border-forest/20 shadow-premium-lg rounded-premium-lg p-4 relative overflow-hidden flex gap-3.5">
        {/* Glow de fondo decorativo */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-forest/5 rounded-full blur-xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={handleDismiss}
          aria-label="Cerrar sugerencia de instalación"
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full hover:bg-cream-dark/45 text-earth/50 hover:text-earth flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Icono de App */}
        <div className="w-12 h-12 rounded-premium-md bg-forest text-cream flex items-center justify-center shrink-0 shadow-premium">
          <Smartphone className="w-6 h-6" />
        </div>

        {/* Info y botón */}
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-display font-extrabold text-sm text-forest-dark uppercase tracking-wide">
            Instalá la App
          </h3>
          <p className="text-[11px] text-earth/75 leading-relaxed mt-1 font-sans font-medium">
            {isIOS
              ? 'Pujá al instante: Tocá compartir ↑ y seleccioná "Agregar a inicio".'
              : 'Recibí notificaciones de superación en vivo y seguí los remates en tiempo real.'}
          </p>
          
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-forest hover:bg-forest-dark text-cream font-display font-extrabold text-[10px] uppercase tracking-wider rounded-premium-sm shadow-premium transition-premium active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              Instalar Aplicación
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
