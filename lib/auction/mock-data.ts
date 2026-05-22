// filepath: d:/PROYECTOS/REMATE CAMPO/lib/auction/mock-data.ts
import type { LotWithDetails } from '@/types'

const v_base_closing = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días en el futuro
const v_base_closing_past = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día en el pasado

export const MOCK_LOTS: any[] = [
  // ÁLBUM 1 — Tractores y maquinaria pesada
  {
    id: 1,
    title: 'Tractor John Deere 6130J 4x4',
    description: 'Año 2018 · 4.200 hs · Motor 6.8L · Transmisión PowrQuad · Cabina A/A · Neumáticos al 70%.',
    starting_price: 48000,
    album: 1,
    image_urls: [
      '/lote-59/1-lote-59.jpeg',
      '/lote-59/2-lote-59.jpeg',
      '/lote-59/lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 1
  },
  {
    id: 2,
    title: 'Cosechadora CASE IH 2388 Axial-Flow',
    description: 'Año 2012 · 2.850 hs motor · Plataforma 24 pies · Monitor AFS Pro 600.',
    starting_price: 72000,
    album: 1,
    image_urls: [
      '/lote-59/2-lote-59.jpeg',
      '/lote-59/3-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 2
  },
  {
    id: 3,
    title: 'Tractor Massey Ferguson 4275',
    description: 'Año 2015 · 3.100 hs · 75 HP · Tracción simple · Ideal tambo.',
    starting_price: 22000,
    album: 1,
    image_urls: [
      '/lote-59/3-lote-59.jpeg',
      '/lote-59/4-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 3
  },
  {
    id: 4,
    title: 'Pulverizador Jacto Uniport 3000',
    description: 'Tanque 3.000L · Barra 24m · GPS Trimble · 1.800 hs.',
    starting_price: 38500,
    album: 1,
    image_urls: [
      '/lote-59/4-lote-59.jpeg',
      '/lote-59/5-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 4
  },
  {
    id: 5,
    title: 'Sembradora Marchesan MDP 13 líneas',
    description: 'Para soja/trigo/maíz · Tolva 2.500kg · Monitor de siembra.',
    starting_price: 8500,
    album: 1,
    image_urls: [
      '/lote-59/5-lote-59.jpeg',
      '/lote-59/6-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 5
  },

  // ÁLBUM 2 — Implementos
  {
    id: 6,
    title: 'Arado Kvernerland 5 rejas',
    description: 'Semi-portado · 5 cuerpos · Rejas nuevas al 80%.',
    starting_price: 4200,
    album: 2,
    image_urls: [
      '/lote-59/6-lote-59.jpeg',
      '/lote-59/7-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 1
  },
  {
    id: 7,
    title: 'Rotocultivador Tatu 2.50m',
    description: 'TDF 540 rpm · Cuchillas nuevas.',
    starting_price: 3800,
    album: 2,
    image_urls: [
      '/lote-59/7-lote-59.jpeg',
      '/lote-59/8-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 2
  },
  {
    id: 8,
    title: 'Rastra Tandem 32 discos',
    description: 'Diámetro 26" · Rodamientos SKF nuevos.',
    starting_price: 2100,
    album: 2,
    image_urls: [
      '/lote-59/8-lote-59.jpeg',
      '/lote-59/9-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 3
  },
  {
    id: 9,
    title: 'Acoplado forrajero 12T',
    description: 'Doble eje · Frenos neumáticos.',
    starting_price: 5800,
    album: 2,
    image_urls: [
      '/lote-59/9-lote-59.jpeg',
      '/lote-59/10-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 4
  },
  {
    id: 10,
    title: 'Pala cargadora frontal Tractobel',
    description: 'Balde 1.2m³ · Altura 3.2m.',
    starting_price: 4500,
    album: 2,
    image_urls: [
      '/lote-59/10-lote-59.jpeg',
      '/lote-59/1-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 5
  },

  // ÁLBUM 3 — Herramientas de taller
  {
    id: 11,
    title: 'Soldadora Lincoln SA-200',
    description: 'Motor diésel Perkins · 200A.',
    starting_price: 3200,
    album: 3,
    image_urls: [
      '/lote-59/1-lote-59.jpeg',
      '/lote-59/3-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 1
  },
  {
    id: 12,
    title: 'Generador diésel 15 KVA',
    description: 'Motor Deutz · Alternador Stamford · Cabinado.',
    starting_price: 5500,
    album: 3,
    image_urls: [
      '/lote-59/2-lote-59.jpeg',
      '/lote-59/4-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 2
  },
  {
    id: 13,
    title: 'Compresor Schulz 10HP',
    description: 'Tanque 350L · 14 bar.',
    starting_price: 1800,
    album: 3,
    image_urls: [
      '/lote-59/3-lote-59.jpeg',
      '/lote-59/5-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 3
  },
  {
    id: 14,
    title: 'Set herramientas Stanley 180 piezas',
    description: 'Valija completa · Seminuevo.',
    starting_price: 280,
    album: 3,
    image_urls: [
      '/lote-59/4-lote-59.jpeg',
      '/lote-59/6-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 4
  },
  {
    id: 15,
    title: 'Taladro de banco Einhell 16"',
    description: '750W · 12 velocidades.',
    starting_price: 650,
    album: 3,
    image_urls: [
      '/lote-59/5-lote-59.jpeg',
      '/lote-59/7-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 5
  },

  // ÁLBUM 4 — Repuestos y varios (Cerrados para testear ganadores)
  {
    id: 16,
    title: 'Neumáticos Goodyear 18.4-38 (par)',
    description: 'R1 al 60%.',
    starting_price: 1400,
    album: 4,
    image_urls: [
      '/lote-59/6-lote-59.jpeg',
      '/lote-59/8-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing_past,
    closing_time: v_base_closing_past,
    status: 'closed',
    winner_bid_id: 101,
    sort_order: 1
  },
  {
    id: 17,
    title: 'Tanque combustible 5.000L',
    description: 'Doble pared · Bomba manual.',
    starting_price: 1200,
    album: 4,
    image_urls: [
      '/lote-59/7-lote-59.jpeg',
      '/lote-59/9-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing_past,
    closing_time: v_base_closing_past,
    status: 'closed',
    winner_bid_id: 102,
    sort_order: 2
  },
  {
    id: 18,
    title: 'Bomba sumergible Franklin 7.5HP',
    description: '18m³/h · 120m elevación.',
    starting_price: 850,
    album: 4,
    image_urls: [
      '/lote-59/8-lote-59.jpeg',
      '/lote-59/10-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 3
  },
  {
    id: 19,
    title: 'Repuestos John Deere (lote)',
    description: 'Filtros, correas, juntas · Modelos 6130J/6150J.',
    starting_price: 450,
    album: 4,
    image_urls: [
      '/lote-59/9-lote-59.jpeg',
      '/lote-59/1-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 4
  },
  {
    id: 20,
    title: 'Manguera hidráulica 100m R2 1/2"',
    description: 'Nueva en rollo · 275 bar.',
    starting_price: 180,
    album: 4,
    image_urls: [
      '/lote-59/10-lote-59.jpeg',
      '/lote-59/2-lote-59.jpeg'
    ],
    base_closing_time: v_base_closing,
    closing_time: v_base_closing,
    status: 'active',
    sort_order: 5
  }
]

export const MOCK_BIDS: any[] = [
  // Pujas para Tractor John Deere (lot_id: 1)
  { id: 1, lot_id: 1, bidder_name: 'Martin G.', amount: 48000, created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { id: 2, lot_id: 1, bidder_name: 'Carlos R.', amount: 48100, created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
  { id: 3, lot_id: 1, bidder_name: 'Martin G.', amount: 48200, created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: 4, lot_id: 1, bidder_name: 'Estancia La Agrícola', amount: 48300, created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
  
  // Pujas para Massey Ferguson (lot_id: 3)
  { id: 5, lot_id: 3, bidder_name: 'Luis M.', amount: 22000, created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
  { id: 6, lot_id: 3, bidder_name: 'Tambos del Sur', amount: 22200, created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },

  // Pujas Ganadoras para Lotes Cerrados
  { id: 101, lot_id: 16, bidder_name: 'Martín G.', amount: 1550, created_at: v_base_closing_past },
  { id: 102, lot_id: 17, bidder_name: 'AgroServicios Flores', amount: 1300, created_at: v_base_closing_past }
]

export function getMockLotDetails(lotId: number): any | null {
  const lot = MOCK_LOTS.find((l) => l.id === lotId)
  if (!lot) return null

  const bids = MOCK_BIDS.filter((b) => b.lot_id === lotId).sort((a, b) => b.amount - a.amount)
  const currentPrice = bids[0] ? bids[0].amount : lot.starting_price
  const bidsCount = bids.length

  return {
    ...lot,
    current_price: currentPrice,
    bids_count: bidsCount,
    bids
  }
}



