// filepath: d:/PROYECTOS/REMATE CAMPO/app/lote/catalogo/[album]/route.tsx
// @optimization: web-performance-optimization - Endpoint para compilar y transmitir catálogos en PDF server-side sin sobrecargar el bundle del cliente

import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { CatalogoPDF } from './pdf'
import { createServerSupabase } from '@/lib/supabase/server'
import { getBrand } from '@/lib/branding'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { album: string } }
) {
  try {
    const album = Number(params.album)
    if (![1, 2, 3, 4].includes(album)) {
      return NextResponse.json({ error: 'Álbum no válido' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    
    // Obtener lotes del álbum de forma rápida
    const { data: lots, error } = await (supabase.from('lots') as any)
      .select('*')
      .eq('album', album)
      .order('sort_order')

    if (error) {
      console.error('Error de base de datos en catálogo PDF:', error)
      return NextResponse.json({ error: 'Error de servidor' }, { status: 500 })
    }

    const brand = getBrand()

    // Renderizar a Buffer binario en el servidor
    const buffer = await renderToBuffer(
      <CatalogoPDF 
        lots={lots || []} 
        album={album}
        brandName={brand.name}
        brandPhone={brand.phone}
        brandEmail={brand.email}
      />
    )

    // Devolver el stream PDF
    return new NextResponse(buffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="catalogo-remate-album-${album}.pdf"`,
        'Cache-Control': 'public, max-age=600, s-maxage=600' // Cachear en CDN
      }
    })
  } catch (error: any) {
    console.error('Excepción al generar catálogo PDF:', error)
    return NextResponse.json({ error: error.message || 'Excepción interna' }, { status: 500 })
  }
}
