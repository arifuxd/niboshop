import Link from 'next/link'
import { MenuIcon, UserIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getCategories } from '@/lib/data'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { CartButton } from './cart-sheet'
import { NamedIcon } from './category-icon'
import { Logo } from './logo'
import { SearchBox } from './search-box'

export async function SiteHeader() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="hidden bg-primary text-xs text-primary-foreground md:block">
        <div className="container-shop flex h-8 items-center justify-between">
          <p>{siteConfig.topBar.join('  •  ')}</p>
          <p>
            Hotline:{' '}
            <a href={`tel:${siteConfig.contact.phone}`} className="font-medium">
              {siteConfig.contact.phone}
            </a>
          </p>
        </div>
      </div>

      <div className="bg-header text-header-foreground">
        <div className="container-shop flex h-16 items-center gap-3 md:gap-6">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-header-foreground hover:bg-white/10 hover:text-header-foreground lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-0 p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle>{siteConfig.name}</SheetTitle>
                <SheetDescription className="sr-only">Browse categories</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col p-2" aria-label="Categories">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
                  >
                    <NamedIcon name={c.icon} className="size-4 text-primary" />
                    {c.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Logo />

          <SearchBox className="hidden flex-1 md:block md:max-w-2xl" />

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/account"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'gap-2 text-header-foreground hover:bg-white/10 hover:text-header-foreground',
              )}
            >
              <UserIcon data-icon="inline-start" />
              <span className="hidden sm:inline">Account</span>
            </Link>
            <CartButton />
          </div>
        </div>
        <div className="container-shop pb-3 md:hidden">
          <SearchBox />
        </div>
      </div>

      <nav
        aria-label="Product categories"
        className="hidden border-b bg-background shadow-sm lg:block"
      >
        <ul className="container-shop flex items-center gap-1 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="flex items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-medium text-foreground/80 hover:text-primary"
              >
                <NamedIcon name={c.icon} className="size-4" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
