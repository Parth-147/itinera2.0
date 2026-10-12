import { createClient } from '@supabase/supabase-js'

/**
 * Reusable Supabase Client for ITINERA 2.0
 * ─────────────────────────────────────────────────────────────────────
 * Reads public credentials from Vite environment variables (.env.local):
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_PUBLISHABLE_KEY
 *
 * NOTE: Never expose service-role key or any backend secret in client code.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabasePublishableKey.includes('placeholder')
)

if (!isSupabaseConfigured) {
  const missing: string[] = []
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!supabasePublishableKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY')

  console.error(
    `[ITINERA Supabase] Missing or incomplete configuration.\n` +
    `Missing variable(s): ${missing.length > 0 ? missing.join(', ') : 'valid credentials'}.\n` +
    `Please verify apps/web/.env.local contains valid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.`
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
