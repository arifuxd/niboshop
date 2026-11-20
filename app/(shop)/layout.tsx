import { CartSheet } from '@/components/shop/cart-sheet'
import { SiteFooter } from '@/components/shop/site-footer'
import { SiteHeader } from '@/components/shop/site-header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartSheet />
    </div>
  )
}
