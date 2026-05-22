// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/button.tsx
// @visual: tailwind-patterns - Botón atómico premium con CVA y tokens oklch semánticos de marca

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-display font-black tracking-widest uppercase transition-premium shadow-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest)]/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-dark)] hover:-translate-y-0.5",
        secondary: "bg-white text-[var(--color-earth)] border border-neutral-200 hover:border-[var(--color-forest)] hover:bg-[var(--color-cream)]",
        outline: "bg-transparent text-[var(--color-earth)] border border-neutral-200 hover:bg-neutral-50",
        ghost: "bg-transparent text-neutral-600 hover:text-[var(--color-forest)] hover:bg-neutral-50 shadow-none active:scale-100",
        destructive: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 hover:-translate-y-0.5",
      },
      size: {
        default: "px-5 py-3",
        sm: "px-3.5 py-2 text-[10px]",
        lg: "px-7 py-4 text-sm",
        icon: "h-10 w-10 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
