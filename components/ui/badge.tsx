// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/badge.tsx
// @visual: tailwind-patterns - Componente Badge premium con CVA y oklch semánticos para estados del remate

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-display font-extrabold uppercase tracking-wide border transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-earth-800)] text-[var(--color-cream)]",
        success:
          "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        warning:
          "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        alert:
          "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
        outline:
          "text-[var(--color-earth)] border-neutral-200 hover:bg-neutral-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
