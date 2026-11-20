import { createCategoryAction, createSubcategoryAction } from '@/app/admin/actions'
import { CategoryIconPicker } from '@/components/dashboard/category-icon-picker'
import { CategoryEditForm } from '@/components/dashboard/category-edit-form'
import { DeleteCategoryButton } from '@/components/dashboard/delete-category-button'
import { NamedIcon } from '@/components/shop/category-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Category } from '@/lib/data'

export function CategoryManager({ categories, productCategorySlugs }: { categories: Category[]; productCategorySlugs: string[] }) {
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add a category</CardTitle>
            <CardDescription>Create a top-level category for the storefront.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCategoryAction}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="category-name">Category name</FieldLabel>
                  <Input id="category-name" name="name" minLength={2} required placeholder="e.g. Cameras" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category-description">Description</FieldLabel>
                  <Input id="category-description" name="description" minLength={3} required placeholder="A short storefront description" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category-icon">Icon</FieldLabel>
                  <CategoryIconPicker />
                </Field>
                <Button type="submit" className="w-full">Add category</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <p className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          Preview mode: category changes stay in server memory and reset when the app restarts. No backend is connected.
        </p>
      </section>

      <section className="flex min-w-0 flex-col gap-4" aria-label="Category list">
        {categories.map((category) => (
          <Card key={category.slug}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <NamedIcon name={category.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription className="mt-1">{category.description}</CardDescription>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Badge variant="secondary">{category.subcategories.length} subcategories</Badge>
                <DeleteCategoryButton slug={category.slug} name={category.name} disabled={productCategorySlugs.includes(category.slug)} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <details className="rounded-lg border bg-muted/20 p-3">
                <summary className="cursor-pointer text-sm font-medium">Edit category</summary>
                <div className="mt-4"><CategoryEditForm category={category} /></div>
              </details>
              {category.subcategories.length ? (
                <ul className="flex flex-wrap gap-2">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.slug}>
                      <Badge variant="outline">{subcategory.name}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No subcategories yet.</p>
              )}
              <form action={createSubcategoryAction} className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end">
                <input type="hidden" name="categorySlug" value={category.slug} />
                <Field className="min-w-0 flex-1">
                  <FieldLabel htmlFor={`subcategory-${category.slug}`}>New subcategory</FieldLabel>
                  <Input id={`subcategory-${category.slug}`} name="name" minLength={2} required placeholder={`e.g. ${category.name} accessories`} />
                </Field>
                <Button type="submit" variant="outline">Add subcategory</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
