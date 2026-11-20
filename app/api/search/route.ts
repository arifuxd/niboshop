import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/data'

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q') ?? ''
  const results = await searchProducts(q, 6)
  return NextResponse.json(
    results.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      image: p.image,
      price: p.price,
      comparePrice: p.comparePrice,
    })),
  )
}
