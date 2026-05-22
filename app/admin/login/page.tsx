// filepath: d:/PROYECTOS/REMATE CAMPO/app/admin/login/page.tsx
// @optimization: ui-ux-pro-max - Login del administrador con estética premium, glassmorphism, Outfit display y feedback interactivo fluido

'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Lock, AlertCircle } from 'lucide-react'
import { loginAdmin } from '@/app/actions/admin'
import { useToast } from '@/components/ui/use-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user || !pass) {
      setError('Por favor complete todos los campos')
      return
    }

    startTransition(async () => {
      const res = await loginAdmin(user, pass)
      if (res.ok) {
        toast({
          title: '🔐 Autenticación exitosa',
          description: 'Bienvenido al panel físico de administración.',
        })
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Credenciales inválidas')
      }
    })
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-8 bg-white/70 backdrop-blur-md border border-[var(--color-glass-border)] p-8 md:p-10 rounded-3xl shadow-premium">
        
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3.5 bg-[var(--color-forest)]/10 text-[var(--color-forest)] rounded-full mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-[var(--color-earth)] tracking-tight">
            Acceso de Administrador
          </h1>
          <p className="text-neutral-500 font-sans text-sm max-w-xs">
            Ingresa tus credenciales para administrar lotes, pujas y visualizar analíticas de subasta.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Usuario */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="user-input" className="text-xs font-display font-bold text-neutral-400 uppercase tracking-widest">
              Usuario de gestión
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="user-input"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                disabled={isPending}
                placeholder="Nombre de usuario"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all text-sm font-sans"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password-input" className="text-xs font-display font-bold text-neutral-400 uppercase tracking-widest">
              Contraseña secreta
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="password-input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                disabled={isPending}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all text-sm font-sans"
              />
            </div>
          </div>

          {/* Botón CTA */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] disabled:bg-neutral-300 text-white font-display font-black text-xs uppercase tracking-widest rounded-xl transition-premium shadow-premium flex items-center justify-center"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Entrar al Panel</span>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
