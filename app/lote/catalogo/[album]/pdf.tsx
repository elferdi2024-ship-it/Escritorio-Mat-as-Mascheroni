// filepath: d:/PROYECTOS/REMATE CAMPO/app/lote/catalogo/[album]/pdf.tsx
// @optimization: web-performance-optimization - Documento PDF para renderizado server-side compatible con streaming

import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { Lot } from '@/types'
import { formatCurrency } from '@/lib/auction/rules'

// Registrar tipografía Inter para una presentación impecable en el PDF
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.ttf', fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: { 
    padding: 35, 
    fontFamily: 'Inter', 
    fontSize: 10,
    backgroundColor: '#faf7f0' // --color-cream
  },
  header: { 
    marginBottom: 20, 
    borderBottomWidth: 2, 
    borderBottomColor: '#2d5016', // --color-forest
    borderBottomStyle: 'solid',
    paddingBottom: 10 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 700, 
    color: '#2d5016' 
  },
  subtitle: { 
    fontSize: 11, 
    color: '#3a2f1f', // --color-earth
    marginTop: 4,
    opacity: 0.8
  },
  lotCard: {
    marginBottom: 15, 
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e8b86d', // --color-wheat
    borderStyle: 'solid',
    borderRadius: 6, 
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  image: { 
    width: 140, 
    height: 105, 
    backgroundColor: '#f0ebd8' 
  },
  info: { 
    flex: 1, 
    padding: 12,
    justifyContent: 'space-between'
  },
  lotTitle: { 
    fontSize: 13, 
    fontWeight: 700, 
    color: '#1e3a0f', 
    marginBottom: 4 
  },
  lotId: { 
    fontSize: 9, 
    color: '#2d5016', 
    fontWeight: 700,
    letterSpacing: 1
  },
  description: { 
    fontSize: 9, 
    color: '#3a2f1f', 
    lineHeight: 1.4, 
    marginBottom: 6,
    opacity: 0.9
  },
  priceBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0ebd8',
    borderTopStyle: 'solid',
    paddingTop: 8
  },
  priceLabel: { 
    fontSize: 7, 
    color: '#3a2f1f',
    opacity: 0.7,
    fontWeight: 700
  },
  priceValue: { 
    fontSize: 13, 
    fontWeight: 700, 
    color: '#2d5016' 
  },
  footer: {
    position: 'absolute', 
    bottom: 20, 
    left: 35, 
    right: 35,
    fontSize: 8, 
    color: '#3a2f1f', 
    textAlign: 'center',
    opacity: 0.6,
    borderTopWidth: 1,
    borderTopColor: '#f0ebd8',
    borderTopStyle: 'solid',
    paddingTop: 8
  },
})

interface CatalogoPDFProps {
  lots: Lot[]
  album: number
  brandName: string
  brandPhone: string
  brandEmail: string
}

export function CatalogoPDF({ lots, album, brandName, brandPhone, brandEmail }: CatalogoPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{brandName} — Catálogo Digital</Text>
          <Text style={styles.subtitle}>
            Álbum de Maquinaria {album}/4 · {lots.length} Lotes Disponibles · Horario de Cierre: 20:00 hrs (America/Montevideo)
          </Text>
        </View>

        {lots.map((lot, idx) => (
          <View key={lot.id} style={styles.lotCard} break={idx > 0 && idx % 4 === 0}>
            {lot.image_urls[0] ? (
              <Image src={lot.image_urls[0]} style={styles.image} />
            ) : (
              <View style={styles.image} />
            )}
            <View style={styles.info}>
              <View>
                <Text style={styles.lotId}>LOTE #{lot.id}</Text>
                <Text style={styles.lotTitle}>{lot.title}</Text>
                <Text style={styles.description}>
                  {lot.description || 'Sin descripción técnica disponible.'}
                </Text>
              </View>
              <View style={styles.priceBox}>
                <View>
                  <Text style={styles.priceLabel}>PRECIO DE PARTIDA</Text>
                  <Text style={styles.priceValue}>{formatCurrency(lot.starting_price)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.priceLabel}>PUJA MÍNIMA SUGERIDA</Text>
                  <Text style={[styles.priceValue, { fontSize: 11 }]}>
                    {formatCurrency(lot.starting_price + (lot.starting_price < 200 ? 10 : lot.starting_price <= 5000 ? 50 : 100))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages} · Coordinación y dudas: ${brandPhone} · ${brandEmail}`
        )} fixed />
      </Page>
    </Document>
  )
}
