// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/use-toast.ts
// @optimization: react-best-practices - Hook useToast para el estado global reactivo de toasts

'use client'

import { useEffect, useState } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success'

export interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type Listener = (toasts: ToastMessage[]) => void

let toasts: ToastMessage[] = []
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach(l => l([...toasts]))
}

export function useToast() {
  const [state, setState] = useState<ToastMessage[]>([])

  useEffect(() => {
    const listener: Listener = setState
    listeners.add(listener)
    setState([...toasts])
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    toasts: state,
    toast: (msg: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9)
      const duration = msg.duration ?? 4500
      toasts = [...toasts, { ...msg, id }]
      emit()

      setTimeout(() => {
        toasts = toasts.filter(t => t.id !== id)
        emit()
      }, duration)

      return {
        id,
        dismiss: () => {
          toasts = toasts.filter(t => t.id !== id)
          emit()
        }
      }
    },
    dismiss: (id: string) => {
      toasts = toasts.filter(t => t.id !== id)
      emit()
    }
  }
}
