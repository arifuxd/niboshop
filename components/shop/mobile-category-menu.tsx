'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon } from 'lucide-react'
import type { Category } from '@/lib/data'
import { NamedIcon } from './category-icon'

export function MobileCategoryMenu({ categories }: { categories: Category[] }) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  function toggleCategory(slug: string) {
    setExpandedCategories((current) => {
      const next = new Set(current)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <nav className="min-h-0 flex-1 overflow-y-auto p-2" aria-label="Categories">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.slug)
        const hasSubcategories = category.subcategories.length > 0

        return (
          <div key={category.slug}>
            <div className="flex items-center">
              <Link
                href={`/category/${category.slug}`}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
              >
                <NamedIcon name={category.icon} className="size-4 shrink-0 text-primary" />
                <span className="truncate">{category.name}</span>
              </Link>
              {hasSubcategories && (
                <button
                  type="button"
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} subcategories`}
                  aria-expanded={isExpanded}
                  onClick={() => toggleCategory(category.slug)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronDownIcon className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            {isExpanded && (
              <ul className="ml-7 flex flex-col border-l pl-3">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.slug}>
                    <Link
                      href={`/category/${category.slug}?subcategory=${subcategory.slug}`}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
