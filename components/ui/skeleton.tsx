// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/skeleton.tsx
// @visual: ui-ux-pro-max - Componente Skeleton con animación shimmer premium de trigo y crema

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-premium rounded-xl", className)}
      {...props}
    />
  )
}

export { Skeleton }
