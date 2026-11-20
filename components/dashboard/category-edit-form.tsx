'use client'

import * as React from 'react'
import { PencilIcon, XIcon } from 'lucide-react'
import { updateCategoryAction } from '@/app/admin/actions'
import { CategoryIconPicker } from '@/components/dashboard/category-icon-picker'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Category } from '@/lib/data'

export function CategoryEditForm({ category }: { category: Category }) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  return (
    <>
      <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${category.name}`} title="Edit category" onClick={() => dialogRef.current?.showModal()}>
        <PencilIcon />
      </Button>
      <dialog ref={dialogRef} aria-labelledby={`edit-title-${category.slug}`} className="max-h-[90dvh] w-[min(38rem,calc(100%-2rem))] overflow-y-auto rounded-xl border bg-card p-5 text-card-foreground shadow-xl backdrop:bg-black/50">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={`edit-title-${category.slug}`} className="text-lg font-semibold">Edit {category.name}</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="Close edit category" onClick={() => dialogRef.current?.close()}><XIcon /></Button>
        </div>
        <form action={updateCategoryAction}>
          <input type="hidden" name="slug" value={category.slug} />
          <FieldGroup>
            <Field><FieldLabel htmlFor={`edit-name-${category.slug}`}>Category name</FieldLabel><Input id={`edit-name-${category.slug}`} name="name" defaultValue={category.name} minLength={2} required /></Field>
            <Field><FieldLabel htmlFor={`edit-description-${category.slug}`}>Description</FieldLabel><Input id={`edit-description-${category.slug}`} name="description" defaultValue={category.description} minLength={3} required /></Field>
            <Field><FieldLabel>Category icon</FieldLabel><CategoryIconPicker defaultValue={category.icon} /></Field>
            <Button type="submit" className="w-full">Save category</Button>
          </FieldGroup>
        </form>
      </dialog>
    </>
  )
}
