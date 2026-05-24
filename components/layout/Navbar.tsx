// filepath: d:/PROYECTOS/REMATE CAMPO/components/layout/Navbar.tsx
// @visual: ui-ux-pro-max - Navbar sticky con glass blur interactivo en scroll y panel de identidad premium del postor

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useBidder } from '@/components/providers/BidderProvider'
import { User, Gavel, FileText, Award, X, Settings, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getMuted, setMuted } from '@/lib/sounds'

export default function Navbar() {
  const pathname = usePathname()
  const { bidder, setBidder, isLoaded } = useBidder()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpenIdentityModal, setIsOpenIdentityModal] = useState(false)
  
  // Datos temporales para el modal de edición
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  
  // Audio state
  const [muted, setMutedState] = useState(true)

  useEffect(() => {
    setMutedState(getMuted())
  }, [])

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    setMutedState(nextMuted)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Inicializar formulario al abrir modal
  const openModal = () => {
    setName(bidder.name)
    setPhone(bidder.phone)
    setEmail(bidder.email)
    setIsOpenIdentityModal(true)
  }

  const saveIdentity = (e: React.FormEvent) => {
    e.preventDefault()
    setBidder({ name, phone, email })
    setIsOpenIdentityModal(false)
  }

  const navLinks = [
    { href: '/', label: 'Catálogo', icon: Gavel },
    { href: '/ganadores', label: 'Ganadores', icon: Award },
    { href: '/reglamento', label: 'Reglamento', icon: FileText },
  ]

  const hasIdentity = isLoaded && bidder.name !== ''

  return (
    <>
      <header 
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
          isScrolled 
            ? "glassmorphism shadow-soft py-3" 
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Isotipo + Logotipo Editorial */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-md bg-[var(--color-forest-500)] flex items-center justify-center text-white shadow-glow-forest group-hover:scale-105 transition-premium duration-300">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 16c0-1.1-.9-2-2-2h-3v-2h3c2.2 0 4-1.8 4-4s-1.8-4-4-4h-4v10h-2v-3c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-1h2v3h6v-3h2c1.1 0 2 .9 2 2h2zm-12 0H4v-3h3v3zM15 6h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2V6z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-black leading-none text-[var(--color-earth-950)] uppercase tracking-tight">
                Remates <span className="text-[var(--color-forest-500)]">Campo</span>
              </span>
              <span className="text-[9px] font-sans font-bold tracking-widest text-neutral-400 uppercase leading-none mt-0.5">
                EDITORIAL RURAL
              </span>
            </div>
          </Link>

          {/* Menú de Navegación Central */}
          <nav className="hidden md:flex items-center gap-1 bg-white/40 p-1 rounded-full border border-neutral-200/55 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all duration-200",
                    isActive 
                      ? "bg-[var(--color-forest-500)] text-white shadow-glow-forest" 
                      : "text-[var(--color-earth-800)] hover:bg-neutral-100 hover:text-[var(--color-forest-500)]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Acciones de Lado Derecho (Usuario / Identidad / Sonido) */}
          <div className="flex items-center gap-2">
            {/* Botón de Sonido */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-500 hover:text-[var(--color-forest-500)] shadow-subtle transition-all duration-300 active:scale-[0.97]"
              title={muted ? "Activar Sonido" : "Silenciar Sonido"}
              aria-label={muted ? "Activar Sonido de Subasta" : "Silenciar Sonido de Subasta"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-[var(--color-forest-500)]" />
              )}
            </button>

            <button
              onClick={openModal}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all duration-300 border active:scale-[0.97]",
                hasIdentity 
                  ? "bg-[var(--color-wheat-50)] text-[var(--color-earth-950)] border-[var(--color-wheat-200)] hover:bg-[var(--color-wheat-200)]" 
                  : "bg-white hover:bg-neutral-50 text-[var(--color-earth-800)] border-neutral-200 shadow-subtle"
              )}
            >
              <User className="w-3.5 h-3.5 text-[var(--color-forest-500)]" />
              <span className="max-w-[120px] truncate">
                {hasIdentity ? bidder.name : 'Ingresar Perfil'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Identidad Premium (Glassmorphic Focus Trap Modal) */}
      {isOpenIdentityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpenIdentityModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-card border border-neutral-150 p-6 z-10 animate-[scaleUp_0.25s_var(--ease-spring)]">
            <button 
              onClick={() => setIsOpenIdentityModal(false)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 border-b border-neutral-100 pb-3">
              <Settings className="w-5 h-5 text-[var(--color-forest-500)]" />
              <h3 className="text-lg font-display font-bold text-[var(--color-earth-950)] uppercase tracking-wider">Identidad de Ofertas</h3>
            </div>

            <form onSubmit={saveIdentity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-widest">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Martín Giménez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded border border-neutral-200 focus:border-[var(--color-forest-500)] outline-none text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-widest">Celular (Uruguay)</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ej: 099 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded border border-neutral-200 focus:border-[var(--color-forest-500)] outline-none text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-widest">Email de Contacto</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ej: martin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded border border-neutral-200 focus:border-[var(--color-forest-500)] outline-none text-sm transition-all"
                />
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setIsOpenIdentityModal(false)}
                  className="flex-1 py-3 px-4 bg-neutral-50 hover:bg-neutral-100 text-xs font-display font-extrabold rounded text-[var(--color-earth-950)] border border-neutral-200 transition-premium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[var(--color-forest-500)] hover:bg-[var(--color-forest-700)] text-xs font-display font-extrabold rounded text-white shadow-glow-forest transition-premium"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
