// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/ImageGallery.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  imageUrls: string[]
  title: string
}

export default function ImageGallery({ imageUrls, title }: ImageGalleryProps) {
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : ['/lote-59/lote-59.jpeg']
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())
  const lightboxRef = useRef<HTMLDivElement>(null)

  const handleImageError = useCallback((index: number) => {
    setImgErrors(prev => new Set(prev).add(index))
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!isLightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    lightboxRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, goNext, goPrev])

  const renderImage = (url: string, index: number, className: string, alt: string) => {
    if (imgErrors.has(index)) {
      return (
        <div className={cn("flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400", className)}>
          <ZoomIn className="w-8 h-8 opacity-30" />
        </div>
      )
    }
    return (
      <img
        src={url}
        alt={alt}
        loading={index === 0 ? 'eager' : 'lazy'}
        onError={() => handleImageError(index)}
        className={className}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen Principal */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
        {renderImage(
          images[activeIndex] ?? '',
          activeIndex,
          "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]",
          `${title} - Vista ${activeIndex + 1}`
        )}

        {/* Botón Pantalla Completa */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true) }}
          className="absolute right-4 bottom-4 p-2.5 bg-white/80 hover:bg-white text-[var(--color-earth)] rounded-xl shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
          aria-label="Ver pantalla completa"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Contador de fotos */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-semibold rounded-lg">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Flechas de navegación en principal */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--color-earth)]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-[var(--color-earth)]" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((url, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200",
                  isActive
                    ? "border-[var(--color-forest)] shadow-[0_0_0_1px_var(--color-forest)] scale-[0.97]"
                    : "border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100"
                )}
              >
                {renderImage(
                  url,
                  index,
                  "absolute inset-0 w-full h-full object-cover",
                  `${title} miniatura ${index + 1}`
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          ref={lightboxRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de imágenes de ${title}`}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5" onClick={e => e.stopPropagation()}>
            <h4 className="font-display font-bold text-lg text-white/90 truncate max-w-[70%]">{title}</h4>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm font-mono">{activeIndex + 1} / {images.length}</span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                aria-label="Cerrar galería"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Area */}
          <div className="relative flex-1 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            {images.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10 hover:scale-110"
                aria-label="Anterior imagen"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative max-w-5xl w-full max-h-[75vh] flex items-center justify-center">
              {renderImage(
                images[activeIndex] ?? '',
                activeIndex,
                "max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl",
                `${title} - Detalle ${activeIndex + 1}`
              )}
            </div>

            {images.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10 hover:scale-110"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail strip in lightbox */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 px-6 py-4 border-t border-white/5" onClick={e => e.stopPropagation()}>
              {images.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-14 h-10 rounded-md overflow-hidden border-2 transition-all",
                    index === activeIndex
                      ? "border-[var(--color-wheat)] opacity-100"
                      : "border-transparent opacity-40 hover:opacity-80"
                  )}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
