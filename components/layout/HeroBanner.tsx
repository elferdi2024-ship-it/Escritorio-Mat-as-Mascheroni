// filepath: d:/PROYECTOS/REMATE CAMPO/components/layout/HeroBanner.tsx
// @visual: ui-ux-pro-max - Header editorial agrícola premium de 90vh con imagen de fondo, gradiente y tipografía Outfit masiva

'use client'

import React from 'react'
import Link from 'next/link'
import { Gavel, FileText } from 'lucide-react'
import { getBrand } from '@/lib/branding'

export default function HeroBanner() {
  const brand = getBrand()

  return (
    <section 
      className="relative overflow-hidden min-h-[80vh] md:min-h-[90vh] flex flex-col justify-end text-white rounded-xl p-6 md:p-12 mb-8 shadow-card"
      style={{
        backgroundImage: 'linear-gradient(to top, oklch(0.20 0.08 130 / 0.95) 20%, oklch(0.20 0.08 130 / 0.50) 60%, transparent 100%), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
      }}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl flex flex-col gap-6 w-full">
        {/* Tag Superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-wheat-400)]/15 border border-[var(--color-wheat-400)]/30 rounded-full text-[var(--color-wheat-400)] text-xs font-semibold tracking-widest uppercase max-w-max backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-wheat-400)] animate-ping" />
          <span>🟢 EN VIVO · Remate #59 · 47 pujadores activos</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight leading-[1.02] text-[var(--color-cream)]">
          Gran Remate Virtual <br />
          <span className="text-[var(--color-wheat-400)]">Agrícola #59</span>
        </h1>

        {/* Descripción Editorial */}
        <p className="text-neutral-200 text-base md:text-xl leading-relaxed max-w-2xl font-sans font-medium">
          Acceda a la plataforma líder en remates de maquinaria pesada y equipos agrícolas en Uruguay. 
          Pujas transparentes en tiempo real respaldadas por {brand.name}.
        </p>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap gap-4 mt-2">
          <Link
            href="#lotes"
            className="flex items-center gap-2.5 px-8 py-4 bg-[var(--color-wheat-400)] text-[var(--color-earth-950)] hover:bg-[var(--color-wheat-200)] font-display font-extrabold rounded-md shadow-glow-wheat transition-premium hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Gavel className="w-5 h-5" />
            <span>Ver lotes disponibles →</span>
          </Link>
          <Link
            href="/reglamento"
            className="flex items-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/15 text-[var(--color-cream)] border border-white/20 hover:border-white/30 font-display font-bold rounded-md backdrop-blur-md transition-premium active:scale-[0.98]"
          >
            <FileText className="w-5 h-5" />
            <span>📜 Reglamento</span>
          </Link>
        </div>

        {/* Grid de Stats Integrados */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-6 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-3xl md:text-5xl font-display font-bold text-[var(--color-wheat-400)] tracking-tight tabular">20</span>
            <span className="text-[9px] md:text-xs text-neutral-300 uppercase tracking-widest font-bold">Lotes</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl md:text-5xl font-display font-bold text-[var(--color-wheat-400)] tracking-tight tabular">47</span>
            <span className="text-[9px] md:text-xs text-neutral-300 uppercase tracking-widest font-bold">Pujadores</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl md:text-5xl font-display font-bold text-[var(--color-wheat-400)] tracking-tight tabular">US$ 185K</span>
            <span className="text-[9px] md:text-xs text-neutral-300 uppercase tracking-widest font-bold">en pujas</span>
          </div>
        </div>
      </div>
    </section>
  )
}
