// filepath: d:/PROYECTOS/REMATE CAMPO/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bidders: {
        Row: {
          id: number
          cookie_sid: string
          name: string
          phone: string
          email: string
          created_at: string
        }
        Insert: {
          id?: number
          cookie_sid: string
          name: string
          phone: string
          email: string
          created_at?: string
        }
        Update: {
          id?: number
          cookie_sid?: string
          name?: string
          phone?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      lots: {
        Row: {
          id: number
          title: string
          description: string | null
          starting_price: number
          album: number
          image_urls: string[]
          base_closing_time: string
          closing_time: string
          status: 'active' | 'extended' | 'closed'
          winner_bid_id: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          starting_price: number
          album: number
          image_urls: string[]
          base_closing_time: string
          closing_time: string
          status?: 'active' | 'extended' | 'closed'
          winner_bid_id?: number | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          starting_price?: number
          album?: number
          image_urls?: string[]
          base_closing_time?: string
          closing_time?: string
          status?: 'active' | 'extended' | 'closed'
          winner_bid_id?: number | null
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lots_winner_bid_id_fkey"
            columns: ["winner_bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          }
        ]
      }
      bids: {
        Row: {
          id: number
          lot_id: number
          bidder_id: number
          amount: number
          created_at: string
        }
        Insert: {
          id?: number
          lot_id: number
          bidder_id: number
          amount: number
          created_at?: string
        }
        Update: {
          id?: number
          lot_id?: number
          bidder_id?: number
          amount?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "bidders"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: number
          lot_id: number
          bidder_id: number
          amount: number
          commission: number
          total: number
          method: 'cash' | 'mercadopago'
          status: 'pending' | 'completed' | 'failed'
          mp_preference_id: string | null
          created_at: string
        }
        Insert: {
          id?: number
          lot_id: number
          bidder_id: number
          amount: number
          commission: number
          total: number
          method: 'cash' | 'mercadopago'
          status?: 'pending' | 'completed' | 'failed'
          mp_preference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          lot_id?: number
          bidder_id?: number
          amount?: number
          commission?: number
          total?: number
          method?: 'cash' | 'mercadopago'
          status?: 'pending' | 'completed' | 'failed'
          mp_preference_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "bidders"
            referencedColumns: ["id"]
          }
        ]
      }
      notification_queue: {
        Row: {
          id: number
          lot_id: number | null
          bidder_id: number | null
          type: string
          status: 'pending' | 'sent' | 'failed'
          payload: Json
          created_at: string
        }
        Insert: {
          id?: number
          lot_id?: number | null
          bidder_id?: number | null
          type: string
          status?: 'pending' | 'sent' | 'failed'
          payload: Json
          created_at?: string
        }
        Update: {
          id?: number
          lot_id?: number | null
          bidder_id?: number | null
          type?: string
          status?: 'pending' | 'sent' | 'failed'
          payload?: Json
          created_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: number
          lot_id: number | null
          bidder_sid: string | null
          path: string
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          lot_id?: number | null
          bidder_sid?: string | null
          path: string
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          lot_id?: number | null
          bidder_sid?: string | null
          path?: string
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      place_bid: {
        Args: {
          p_lot_id: number
          p_amount: number
          p_cookie_sid: string
          p_name: string
          p_phone: string
          p_email: string
        }
        Returns: { ok: boolean; error: string | null; bid_id: number | null }
      }
      close_lot: {
        Args: {
          p_lot_id: number
        }
        Returns: boolean
      }
      get_bid_increment: {
        Args: {
          p_starting_price: number
        }
        Returns: number
      }
      search_lots: {
        Args: {
          p_query: string
          p_album?: number
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: number
          title: string
          description: string | null
          starting_price: number
          album: number
          image_urls: string[]
          base_closing_time: string
          closing_time: string
          status: 'active' | 'extended' | 'closed'
          winner_bid_id: number | null
          sort_order: number
          created_at: string
          current_price: number
          bids_count: number
        }[]
      }
      get_global_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_lots: number
          active_lots: number
          closed_lots: number
          total_bids: number
          total_bidders: number
          total_sales: number
        }
      }
      get_conversion_funnel: {
        Args: Record<PropertyKey, never>
        Returns: {
          step_name: string
          views_count: number
        }[]
      }
      refresh_lot_stats: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
