'use client'

import * as React from 'react'
import { Trash2Icon } from 'lucide-react'
import { deleteCategoryAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function DeleteCategoryButton({ slug, name, disabled }: { slug: string; name: string; disabled: boolean }) {
  const [pending, startTransition] = React.useTransition()
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button type="button" variant="ghost" size="icon" disabled={pending || disabled} aria-label={`Delete ${name}`} title={disabled ? 'Remove products from this category before deleting it' : 'Delete category'} /> }>
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>This permanently removes the category and its subcategories. Products in this category must be moved or deleted first.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={pending} onClick={() => startTransition(async () => { await deleteCategoryAction(slug) })}>Delete category</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
