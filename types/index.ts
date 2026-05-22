// filepath: d:/PROYECTOS/REMATE CAMPO/types/index.ts
export type LotStatus = 'active' | 'extended' | 'closed'

export interface Lot {
  id: number
  title: string
  description: string | null
  starting_price: number
  album: number
  image_urls: string[]
  base_closing_time: string
  closing_time: string
  status: LotStatus
  winner_bid_id: number | null
  sort_order: number
  created_at: string
  current_price?: number
  bids_count?: number
}

export interface Bid {
  id: number
  lot_id: number
  bidder_id: number
  bidder_name: string
  amount: number
  created_at: string
}

export interface Bidder {
  cookie_sid: string
  name: string
  phone: string
  email: string
}

export interface LotWithDetails extends Lot {
  current_price: number
  bids_count: number
}
