// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/toast.tsx
// @optimization: ui-ux-pro-max - Componente Toast premium con glassmorphism sutil y HSL semántico

'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-premium-md p-4 pr-10 shadow-premium border transition-all duration-300 glassmorphism',
  {
    variants: {
      variant: {
        default: 'border-glass-border bg-glass-bg text-earth',
        destructive: 'border-alert-critical/30 bg-alert-critical/10 text-alert-critical',
        success: 'border-forest/30 bg-forest/10 text-forest-dark',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  onClose?: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, onClose, children, ...props }, ref) => {
    const icon = {
      default: <Info className="h-5 w-5 text-forest/75 shrink-0" />,
      destructive: <AlertTriangle className="h-5 w-5 text-alert-critical shrink-0 animate-bounce" />,
      success: <CheckCircle className="h-5 w-5 text-forest shrink-0" />
    }[variant || 'default']

    return (
      <div 
        ref={ref} 
        className={cn(toastVariants({ variant }), className)} 
        {...props}
        role="alert"
      >
        <div className="flex items-start gap-3 flex-1">
          {icon}
          <div className="text-sm font-medium leading-normal flex-1">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar notificación"
            className="absolute right-3 top-3 rounded-full p-1 text-earth/50 hover:text-earth hover:bg-earth/5 transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'
