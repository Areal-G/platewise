import { cookies } from 'next/headers'
import { DEMO_COOKIE } from '@/lib/demo'
import { createDemoClient } from './demo-client'

export async function createClient() {
  const cookieStore = await cookies()

  return createDemoClient({
    isSignedIn: () => cookieStore.get(DEMO_COOKIE)?.value === '1',
    signOut: () => cookieStore.delete(DEMO_COOKIE),
  })
}
