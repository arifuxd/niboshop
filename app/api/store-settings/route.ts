import { NextResponse } from 'next/server'
import { api } from '@/lib/api'
export const dynamic = 'force-dynamic'
export async function GET() {
  try { return NextResponse.json(await api('/settings'), { headers: { 'Cache-Control': 'no-store' } }) }
  catch { return NextResponse.json({ logoUrl: '/images/logo.webp', address: 'Dhaka, Bangladesh', phone: '+8801953-417354', email: 'support@niboshop.com', hours: 'Sat – Thu, 10:00 AM – 9:00 PM', insideDhakaCharge: 60, outsideDhakaCharge: 120, freeShippingThreshold: 5000 }, { headers: { 'Cache-Control': 'no-store' } }) }
}
