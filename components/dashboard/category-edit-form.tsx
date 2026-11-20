'use client'

import { updateCategoryAction } from '@/app/admin/actions'
import { CategoryIconPicker } from '@/components/dashboard/category-icon-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Category } from '@/lib/data'

export function CategoryEditForm({ category }: { category: Category }) {
  return (
    <Card>
      <CardHeader><CardTitle>Edit {category.name}</CardTitle></CardHeader>
      <CardContent>
        <form action={updateCategoryAction}>
          <input type="hidden" name="slug" value={category.slug} />
          <FieldGroup>
            <Field><FieldLabel htmlFor={`edit-name-${category.slug}`}>Category name</FieldLabel><Input id={`edit-name-${category.slug}`} name="name" defaultValue={category.name} minLength={2} required /></Field>
            <Field><FieldLabel htmlFor={`edit-description-${category.slug}`}>Description</FieldLabel><Input id={`edit-description-${category.slug}`} name="description" defaultValue={category.description} minLength={3} required /></Field>
            <Field><FieldLabel>Category icon</FieldLabel><CategoryIconPicker defaultValue={category.icon} /></Field>
            <Button type="submit" className="w-full">Save category</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
