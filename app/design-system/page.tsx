import type { Metadata } from 'next'
import { Logo } from '@/components/shop/logo'
import { Price } from '@/components/shop/price'
import { ProductCard } from '@/components/shop/product-card'
import { StarRating } from '@/components/shop/star-rating'
import { StatusBadge } from '@/components/dashboard/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getFeaturedProducts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Niboshop design tokens and reusable components.',
}

const colorTokens = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'muted',
  'accent',
  'header',
  'footer',
  'sale',
  'success',
  'star',
  'destructive',
  'border',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
]

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default async function DesignSystemPage() {
  const [product] = await getFeaturedProducts()

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-3">
        <Logo />
        <h1 className="text-3xl font-bold text-balance">Design System</h1>
        <p className="max-w-2xl text-muted-foreground text-pretty">
          Every color, radius and font is a token in <code>app/globals.css</code>. Change a token
          there and the storefront and both dashboards update together. See <code>AGENTS.md</code>{' '}
          for the rules when adding pages.
        </p>
      </header>

      <Section title="Colors" description="Semantic tokens only. Never use raw color values.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {colorTokens.map((token) => (
            <div key={token} className="flex flex-col gap-2">
              <div
                className="h-14 rounded-lg border"
                style={{ background: `var(--${token})` }}
                aria-hidden="true"
              />
              <code className="text-xs text-muted-foreground">--{token}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" description="Geist Sans for English, Noto Sans Bengali for Bangla, and Geist Mono for code.">
        <Card>
          <CardContent className="flex flex-col gap-2">
            <p className="text-4xl font-bold">Heading 1 — 4xl bold</p>
            <p className="text-2xl font-semibold">Heading 2 — 2xl semibold</p>
            <p className="text-lg font-medium">Heading 3 — lg medium</p>
            <p>Body — base regular</p>
            <p className="text-sm text-muted-foreground">Caption — sm muted</p>
            <code className="font-mono text-sm">Mono — Geist Mono</code>
          </CardContent>
        </Card>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Add to cart</Button>
          <Button variant="outline">Buy now</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badges and status">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          {statuses.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </Section>

      <Section title="Commerce primitives">
        <div className="flex flex-wrap items-center gap-8">
          <Price price={product.price} comparePrice={product.comparePrice} />
          <StarRating rating={product.rating} />
        </div>
      </Section>

      <Section title="Form controls">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Used across checkout and profile forms.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Full name" aria-label="Full name" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Product card" description="Add to cart (filled) and Buy now (outlined).">
        <div className="max-w-xs">
          <ProductCard product={product} />
        </div>
      </Section>
    </main>
  )
}
