// filepath: d:/PROYECTOS/REMATE CAMPO/app/layout.tsx
// @optimization: seo-audit - Layout raíz con inyección dinámica multi-tenant de metadatos, HSL tokens, fuentes premium Outfit/Inter y ARIA-support

import React from 'react'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { getBrand } from '@/lib/branding'
import { BrandProvider } from '@/components/providers/BrandProvider'
import { BidderProvider } from '@/components/providers/BidderProvider'
import { Toaster } from '@/components/ui/toaster'
import LiveTicker from '@/components/layout/LiveTicker'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import '@/app/globals.css'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontDisplay = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
})

export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrand()
  return {
    title: {
      default: `${brand.name} · Remates Agrícolas Virtuales`,
      template: `%s | ${brand.shortName}`,
    },
    description: `Plataforma premium de subastas de maquinaria agrícola en Uruguay. Pujas transparentes en tiempo real respaldadas por ${brand.name}.`,
    icons: {
      icon: brand.favicon,
    },
    manifest: '/manifest.json',
    openGraph: {
      title: `${brand.name} · Subastas Agrícolas en Uruguay`,
      description: `Remates virtuales en vivo de tractores, cosechadoras y repuestos.`,
      locale: 'es_UY',
      type: 'website',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = getBrand()

  return (
    <html lang="es" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <head>
        {/* Inyección instantánea y libre de parpadeo de variables HSL de marca en el servidor */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-forest: ${brand.colors.forest};
            --color-forest-dark: ${brand.colors.forestDark};
            --color-wheat: ${brand.colors.wheat};
            --color-earth: ${brand.colors.earth};
            --color-cream: ${brand.colors.cream};
          }
        `}} />
      </head>
      <body className="min-h-screen bg-[var(--color-cream)] text-[var(--color-earth)] antialiased font-sans flex flex-col">
        <BrandProvider brand={brand}>
          <BidderProvider>
            {/* Ticker en tiempo real superior */}
            <LiveTicker />

            {/* Navbar Global Premium */}
            <Navbar />
            
            {/* Contenedor principal de página */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6" id="main-content">
              {children}
            </main>

            {/* Footer Global Semántico */}
            <Footer />

            {/* Toaster de notificaciones */}
            <Toaster />

            {/* Botón flotante de soporte por WhatsApp */}
            <WhatsAppButton />
          </BidderProvider>
        </BrandProvider>
      </body>
    </html>
  )
}
