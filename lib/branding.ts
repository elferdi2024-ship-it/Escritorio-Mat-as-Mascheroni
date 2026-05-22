// filepath: d:/PROYECTOS/REMATE CAMPO/lib/branding.ts
// @optimization: tailwind-patterns - Configuración dinámica multi-tenant e inyección de tokens

export const BRANDS = {
  // Cliente 1: Remates del Sur
  'remates-del-sur': {
    name: 'Remates Agrícolas del Sur',
    shortName: 'RematesSur',
    phone: '099123456',
    whatsapp: '59899123456',
    email: 'contacto@rematessur.com.uy',
    colors: {
      forest: '#2d5016',
      forestDark: '#1e3a0f',
      wheat: '#e8b86d',
      earth: '#3a2f1f',
      cream: '#faf7f0',
    },
    logo: '/brands/remates-sur/logo.svg',
    favicon: '/brands/remates-sur/favicon.ico',
    domain: 'remates-del-sur.app',
  },

  // Cliente 2: Agro Subastas
  'agro-subastas': {
    name: 'Agro Subastas Uruguay',
    shortName: 'AgroSub',
    phone: '098765432',
    whatsapp: '59898765432',
    email: 'info@agrosub.com.uy',
    colors: {
      forest: '#1e40af',  // Azul en vez de verde
      forestDark: '#1e3a8a',
      wheat: '#fbbf24',
      earth: '#1f2937',
      cream: '#f9fafb',
    },
    logo: '/brands/agro-subastas/logo.svg',
    favicon: '/brands/agro-subastas/favicon.ico',
    domain: 'agrosubastas.app',
  },

  // Demo genérica (Remate Campo / Barrio.uy)
  'demo': {
    name: 'Remate Campo',
    shortName: 'RemateCampo',
    phone: '096125030',
    whatsapp: '59896125030',
    email: 'demo@rematecampo.com.uy',
    colors: {
      forest: '#2d5016',      // --color-forest
      forestDark: '#1e3a0f',  // --color-forest-dark
      wheat: '#e8b86d',       // --color-wheat
      earth: '#3a2f1f',       // --color-earth
      cream: '#faf7f0',       // --color-cream
    },
    logo: '/brands/demo/logo.svg',
    favicon: '/favicon.ico',
    domain: 'demo.remate-campo.app',
  },
} as const

export type BrandKey = keyof typeof BRANDS
export type BrandType = typeof BRANDS[BrandKey]

// Detectar brand según dominio o variable de entorno
export function getBrand(): BrandType {
  // 1. Override por env (para demos o servidor local)
  const envBrand = process.env.NEXT_PUBLIC_BRAND as BrandKey | undefined
  if (envBrand && BRANDS[envBrand]) return BRANDS[envBrand]

  // 2. Detección por hostname (sólo client-side)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    for (const [, brand] of Object.entries(BRANDS)) {
      if (host.includes(brand.domain)) return brand
    }
  }

  return BRANDS.demo
}
