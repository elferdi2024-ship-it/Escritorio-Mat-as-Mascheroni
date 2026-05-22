// filepath: d:/PROYECTOS/REMATE CAMPO/lib/supabase/client.ts
// @optimization: typescript-expert - Cliente Supabase fuertemente tipado para el browser
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
