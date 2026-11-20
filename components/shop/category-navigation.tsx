import Link from 'next/link'
import { ChevronDownIcon } from 'lucide-react'
import type { Category } from '@/lib/data'
import { NamedIcon } from './category-icon'

export function CategoryNavigation({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Product categories" className="hidden border-b bg-background shadow-sm lg:block">
      <ul className="container-shop flex items-center gap-1">
        {categories.map((category) => (
          <li key={category.slug} className="category-navigation-item relative">
            <Link
              href={`/category/${category.slug}`}
              aria-haspopup={category.subcategories.length > 0 ? 'true' : undefined}
              className="flex items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-medium text-foreground/80 hover:text-primary focus-visible:text-primary"
            >
              <NamedIcon name={category.icon} className="size-4" />
              {category.name}
              {category.subcategories.length > 0 && (
                <ChevronDownIcon className="category-navigation-chevron size-3 transition-transform" />
              )}
            </Link>
            {category.subcategories.length > 0 && (
              <ul
                aria-label={`${category.name} subcategories`}
                className="category-submenu absolute left-0 top-full z-50 hidden min-w-52 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg"
              >
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.slug}>
                    <Link
                      href={`/category/${category.slug}?subcategory=${subcategory.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
