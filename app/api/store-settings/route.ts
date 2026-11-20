import { NextResponse } from 'next/server'
import { getStoreSettings } from '@/lib/store-settings'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json(getStoreSettings(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}
