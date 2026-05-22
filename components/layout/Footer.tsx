// filepath: d:/PROYECTOS/REMATE CAMPO/components/layout/Footer.tsx
// @visual: ui-ux-pro-max - Pie de página (Footer) semántico con logotipo tractor SVG e identidad tipográfica Outfit/Inter

import React from 'react'
import Link from 'next/link'
import { FileText, Shield, Mail, Phone, MapPin, Award } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-earth-950)] text-[var(--color-cream)] border-t border-[var(--color-earth-800)] mt-12 py-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Columna 1: Logotipo e Identidad */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            {/* Isotipo Tractor SVG Premium */}
            <svg 
              className="w-8 h-8 text-[var(--color-wheat)] fill-current" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 15h-1.18c-.41-1.16-1.5-2-2.82-2s-2.41.84-2.82 2H9.5c-.32-.83-1.11-1.42-2.06-1.48L6.4 11.4c.57-.42.95-1.1.95-1.86v-.91c0-.46-.38-.83-.84-.83h-.84c-.46 0-.83.37-.83.83v.91c0 .76.38 1.44.95 1.86l-1.04 2.12c-.95.06-1.74.65-2.06 1.48h-.08v1h.14c.32.83 1.11 1.42 2.06 1.48H5c.41 1.16 1.5 2 2.82 2s2.41-.84 2.82-2h4.5c.41 1.16 1.5 2 2.82 2s2.41-.84 2.82-2H21v-3.5c0-1.38-1.12-2.5-2-2.5zM7.82 19c-.46 0-.83-.37-.83-.83 0-.46.37-.83.83-.83.46 0 .83.37.83.83 0 .46-.37.83-.83.83zm10-5c.46 0 .83.37.83.83s-.37.83-.83.83c-.46 0-.83-.37-.83-.83s.37-.83.83-.83zm0 5c-.46 0-.83-.37-.83-.83 0-.46.37-.83.83-.83.46 0 .83.37.83.83 0 .46-.37.83-.83.83z" />
            </svg>
            <span className="font-display font-black text-lg tracking-tight text-white">
              REMATE CAMPO
            </span>
          </Link>
          <p className="text-neutral-400 leading-relaxed max-w-xs text-[11px]">
            Plataforma virtual líder en subastas de maquinaria agrícola en Uruguay. Transparencia, seguridad y respaldo del escritorio rural.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm">
            Navegación
          </h4>
          <ul className="flex flex-col gap-2.5 text-neutral-300">
            <li>
              <Link href="/" className="hover:text-[var(--color-wheat)] transition-colors">
                Catálogo de Lotes
              </Link>
            </li>
            <li>
              <Link href="/ganadores" className="hover:text-[var(--color-wheat)] transition-colors flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Lotes Adjudicados</span>
              </Link>
            </li>
            <li>
              <Link href="/reglamento" className="hover:text-[var(--color-wheat)] transition-colors flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Reglamento Oficial</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Plazos y Garantías */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm">
            Reglas Clave
          </h4>
          <ul className="flex flex-col gap-2 text-neutral-400 leading-relaxed text-[11px]">
            <li>
              💵 <strong>Comisión:</strong> 12% Contado / 19% Mercado Pago.
            </li>
            <li>
              ⏱️ <strong>Liquidación:</strong> 24 horas hábiles para coordinar pago.
            </li>
            <li>
              🚜 <strong>Retiro:</strong> Plazo máximo de 7 días corridos del campo.
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto Escritorio */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm">
            Soporte & Escritorio
          </h4>
          <ul className="flex flex-col gap-2.5 text-neutral-300">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--color-wheat)] shrink-0" />
              <a href="tel:096125030" className="hover:text-white transition-colors">
                096 125 030
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--color-wheat)] shrink-0" />
              <a href="mailto:contacto@rematecampo.com.uy" className="hover:text-white transition-colors">
                contacto@rematecampo.com.uy
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-wheat)] shrink-0" />
              <span className="text-neutral-400 text-[11px]">
                Montevideo, Uruguay
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Franja de Derechos Reservados */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-[var(--color-earth-800)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
        <span>
          © {new Date().getFullYear()} Remate Campo S.A. Todos los derechos reservados.
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          <Shield className="w-3.5 h-3.5 text-neutral-600" />
          <Link href="/admin/login" className="hover:text-neutral-300 transition-colors font-bold uppercase tracking-wider">
            Acceso Administrador
          </Link>
        </div>
      </div>
    </footer>
  )
}
