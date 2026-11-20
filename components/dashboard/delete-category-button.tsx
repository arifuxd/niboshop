'use client'

import * as React from 'react'
import { Trash2Icon } from 'lucide-react'
import { deleteCategoryAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'

export function DeleteCategoryButton({ slug, name, disabled }: { slug: string; name: string; disabled: boolean }) {
  const [pending, startTransition] = React.useTransition()
  return (
    <Button type="button" variant="ghost" size="icon" disabled={pending || disabled} aria-label={`Delete ${name}`} title={disabled ? 'Remove products from this category before deleting it' : 'Delete category'} onClick={() => {
      if (!window.confirm(`Delete ${name}? This also removes its subcategories.`)) return
      startTransition(async () => { await deleteCategoryAction(slug) })
    }}>
      <Trash2Icon />
    </Button>
  )
}
