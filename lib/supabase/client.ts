import { createBrowserClient } from '@supabase/ssr'
import { isDemoMode } from '@/lib/demo'
import { createDemoClient } from './demo-client'
import { requireSupabaseEnv } from '@/lib/env'

export function createClient() {
  // Guest demo: serve read-only sample data instead of the real database
  if (isDemoMode()) {
    return createDemoClient() as unknown as ReturnType<typeof createBrowserClient>
  }

  const { url, anonKey } = requireSupabaseEnv()
  return createBrowserClient(url, anonKey)
}
