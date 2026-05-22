// filepath: d:/PROYECTOS/REMATE CAMPO/lib/utils.ts
// @optimization: tailwind-patterns - Utilidad cn estándar de fusión de clases condicionales de Tailwind
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

