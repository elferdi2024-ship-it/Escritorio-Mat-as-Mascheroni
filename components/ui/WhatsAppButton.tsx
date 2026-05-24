// filepath: d:/PROYECTOS/REMATE CAMPO/components/ui/WhatsAppButton.tsx
// @visual: ui-ux-pro-max - Botón flotante premium de WhatsApp con tooltip interactivo y ondas de animación en pulso

'use client'

import React from 'react'

export function WhatsAppButton() {
  const whatsappNumber = '59896125030' // Formato internacional para Uruguay 096 125 030
  const message = encodeURIComponent('Hola Remate Campo, tengo una consulta sobre las subastas en curso.')
  const url = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-[0_4px_24px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-108 active:scale-95 group"
      aria-label="Contactar soporte por WhatsApp"
      title="Contactar soporte por WhatsApp"
    >
      {/* Ondas pulsantes de urgencia/atención premium */}
      <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75 group-hover:hidden" />
      
      {/* Icono SVG de WhatsApp limpio y estilizado */}
      <svg
        className="w-7 h-7 fill-current transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.488 4.96 1.49 5.432-.003 9.85-4.42 9.853-9.853.002-2.632-1.02-5.105-2.877-6.965C16.666 1.965 14.193.943 11.562.943c-5.437 0-9.854 4.417-9.857 9.852-.001 1.76.5 3.424 1.448 4.88l-1.004 3.665 3.753-.984zM17.43 14.3c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.827 1.04-1.012 1.25-.186.213-.372.24-.69.08-3.136-1.564-4.57-2.617-5.413-4.06-.222-.383-.024-.59.173-.788.177-.177.372-.43.56-.64.186-.213.247-.37.372-.613.12-.24.06-.453-.03-.613-.09-.16-.724-1.748-.99-2.39-.26-.62-.52-.53-.72-.54-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.12 1.3 3.32c.16.2 2.27 3.47 5.5 4.87 2.68 1.16 3.23.93 3.8.88.58-.05 1.89-.77 2.15-1.52.26-.75.26-1.39.19-1.52-.07-.14-.29-.22-.61-.38z" />
      </svg>
      
      {/* Tooltip Premium */}
      <span className="absolute right-16 scale-0 transition-all rounded bg-[var(--color-earth-950)] p-2 text-xs font-display font-bold text-white group-hover:scale-100 shadow-premium whitespace-nowrap">
        ¿Necesitas ayuda? Chatea con soporte 🚜
      </span>
    </a>
  )
}
