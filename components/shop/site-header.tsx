import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AccountAccess } from './account-access'
import { LocalizedText } from '@/components/localized-text'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getCategories } from '@/lib/data'
import { MobileCategoryMenu } from './mobile-category-menu'
import { siteConfig } from '@/lib/site-config'
import { CartButton } from './cart-sheet'
import { CategoryNavigation } from './category-navigation'
import { Logo } from './logo'
import { SearchBox } from './search-box'

export async function SiteHeader() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="hidden bg-primary text-xs text-primary-foreground md:block">
        <div className="container-shop flex h-8 items-center justify-between">
          <p>{siteConfig.topBar.map((item, index) => (
            <span key={item}>{index > 0 && <span aria-hidden="true">  •  </span>}<LocalizedText text={item} /></span>
          ))}</p>
          <p>
            <LocalizedText text="Hotline:" />{' '}
            <a href={`tel:${siteConfig.contact.phone}`} className="font-medium">
              {siteConfig.contact.phone}
            </a>
          </p>
        </div>
      </div>

      <div className="bg-header text-header-foreground">
        <div className="container-shop flex min-h-[84px] items-center gap-2 py-2.5 md:gap-6">
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
                <SheetTitle><LocalizedText text="Menu" /></SheetTitle>
                <SheetDescription className="sr-only">Browse categories</SheetDescription>
              </SheetHeader>
              <MobileCategoryMenu categories={categories} />
              <div className="mx-4 mt-2 mb-6 border-t pt-3">
                <div className="flex items-center justify-between rounded-lg bg-header px-3 py-2 text-header-foreground">
                  <span className="whitespace-nowrap text-sm font-medium">
                    <LocalizedText text="Language" />
                  </span>
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo />

          <SearchBox className="hidden flex-1 md:block md:max-w-2xl" />

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden md:block">
              <LanguageSwitcher className="shrink-0" />
            </div>
            <AccountAccess />
            <CartButton />
          </div>
        </div>
        <div className="container-shop pb-3 md:hidden">
          <SearchBox />
        </div>
      </div>

      <CategoryNavigation categories={categories} />
    </header>
  )
}
