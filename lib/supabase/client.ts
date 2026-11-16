import { exitDemo, isDemoMode } from '@/lib/demo'
import { createDemoClient } from './demo-client'

// The portfolio demo has no backend: the guest demo cookie is the session and
// the data is the in-memory sample restaurant.
export function createClient() {
  return createDemoClient({ isSignedIn: isDemoMode, signOut: exitDemo })
}
