import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/data'

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim()
  if (q.length < 3) return NextResponse.json([])
  if (q.length > 120) return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 })

  try {
    const results = await searchProducts(q, 6)
    return NextResponse.json(results.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      comparePrice: product.comparePrice,
    })))
  } catch {
    return NextResponse.json({ error: 'Product search is temporarily unavailable.' }, { status: 502 })
  }
}
