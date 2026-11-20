'use client'

import * as React from 'react'
import { ArrowDownIcon, ArrowUpIcon, GripVerticalIcon, ImagePlusIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { createProductAction, updateProductAction, type FormState } from '@/app/admin/actions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ProductDescriptionEditor } from '@/components/dashboard/product-description-editor'
import { Spinner } from '@/components/ui/spinner'
import type { Category, Product } from '@/lib/data'
import { cn } from '@/lib/utils'

const initial: FormState = {}
const maxImages = 6
const maxImageSize = 5 * 1024 * 1024
const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

type GalleryImage = { id: string; src: string; name: string }

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const boundUpdateAction = product ? updateProductAction.bind(null, product.id) : null
  const [state, action, pending] = React.useActionState(boundUpdateAction ?? createProductAction, initial)
  const [images, setImages] = React.useState<GalleryImage[]>(() => product?.images.map((src, index) => ({ id: `${index}-${src}`, src, name: `Product photo ${index + 1}` })) ?? [])
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState('')
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [categorySlug, setCategorySlug] = React.useState(product?.categorySlug ?? '')
  const [subcategorySlug, setSubcategorySlug] = React.useState(product?.subcategorySlug ?? '')
  const formRef = React.useRef<HTMLFormElement>(null)
  const submittedFields = React.useRef<Record<string, { value?: string; checked?: boolean }>>({})
  const selectedCategory = categories.find((category) => category.slug === categorySlug)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const err = state.fieldErrors ?? {}

  React.useEffect(() => {
    if (!Object.keys(state.fieldErrors ?? {}).length) return
    const form = formRef.current
    if (!form) return

    for (const [name, saved] of Object.entries(submittedFields.current)) {
      const field = Array.from(form.elements).find((element) => 'name' in element && element.name === name)
      if (field instanceof HTMLInputElement && saved.checked !== undefined) field.checked = saved.checked
      else if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && saved.value !== undefined) field.value = saved.value
    }
  }, [state])

  function preserveSubmittedFields(event: React.FormEvent<HTMLFormElement>) {
    const fields: Record<string, { value?: string; checked?: boolean }> = {}
    for (const element of Array.from(event.currentTarget.elements)) {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) continue
      if (!element.name || element.type === 'hidden' || element.type === 'file') continue
      fields[element.name] = element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)
        ? { checked: element.checked }
        : { value: element.value }
    }
    submittedFields.current = fields
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    const files = Array.from(fileList)
    if (images.length + files.length > maxImages) {
      setUploadError(`Add up to ${maxImages} images per product.`)
      return
    }
    const invalid = files.find((file) => !acceptedImageTypes.includes(file.type) || file.size > maxImageSize)
    if (invalid) {
      setUploadError('Use JPG, PNG, WebP, or AVIF images up to 5 MB each.')
      return
    }

    setUploadError('')
    setUploading(true)
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const body = new FormData()
        body.set('file', file)
        const response = await fetch('/api/admin/product-images', { method: 'POST', body })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Image upload failed.')
        return { id: crypto.randomUUID(), src: result.url as string, name: file.name }
      }))
      setImages((current) => [...current, ...uploaded])
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function moveImage(from: number, to: number) {
    setImages((current) => {
      if (to < 0 || to >= current.length) return current
      const reordered = [...current]
      const [moved] = reordered.splice(from, 1)
      reordered.splice(to, 0, moved)
      return reordered
    })
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={preserveSubmittedFields}
      onReset={(event) => event.preventDefault()}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="flex min-w-0 flex-col gap-6">
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{product ? 'Edit product details' : 'Basic information'}</CardTitle>
            <CardDescription>Shown on the product card and product page.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!err.name}>
                <FieldLabel htmlFor="name">Product name</FieldLabel>
                <Input id="name" name="name" defaultValue={product?.name} aria-invalid={!!err.name} placeholder="e.g. Nova X Pro 5G 256GB" />
                {err.name && <FieldError>{err.name}</FieldError>}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!err.brand}>
                  <FieldLabel htmlFor="brand">Brand</FieldLabel>
                  <Input id="brand" name="brand" defaultValue={product?.brand} aria-invalid={!!err.brand} placeholder="e.g. Nova" />
                  {err.brand && <FieldError>{err.brand}</FieldError>}
                </Field>
                <Field data-invalid={!!err.categorySlug}>
                  <FieldLabel htmlFor="categorySlug">Category</FieldLabel>
                  <NativeSelect
                    id="categorySlug"
                    name="categorySlug"
                    value={categorySlug}
                    onChange={(event) => {
                      setCategorySlug(event.target.value)
                      setSubcategorySlug('')
                    }}
                    aria-invalid={!!err.categorySlug}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </NativeSelect>
                  {err.categorySlug && <FieldError>{err.categorySlug}</FieldError>}
                </Field>
              </div>
              {selectedCategory?.subcategories.length ? (
                <Field data-invalid={!!err.subcategorySlug}>
                  <FieldLabel htmlFor="subcategorySlug">Subcategory</FieldLabel>
                  <NativeSelect
                    id="subcategorySlug"
                    name="subcategorySlug"
                    value={subcategorySlug}
                    onChange={(event) => setSubcategorySlug(event.target.value)}
                    aria-invalid={!!err.subcategorySlug}
                  >
                    <option value="">No subcategory</option>
                    {selectedCategory.subcategories.map((subcategory) => (
                      <option key={subcategory.slug} value={subcategory.slug}>
                        {subcategory.name}
                      </option>
                    ))}
                  </NativeSelect>
                  {err.subcategorySlug && <FieldError>{err.subcategorySlug}</FieldError>}
                  <FieldDescription>Choose a more specific product category.</FieldDescription>
                </Field>
              ) : null}
              <Field data-invalid={!!err.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <ProductDescriptionEditor name="description" defaultValue={product?.description ?? ''} invalid={!!err.description} />
                <FieldDescription>Use the toolbar to format the product details shown to customers.</FieldDescription>
                {err.description && <FieldError>{err.description}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="highlights">Key highlights</FieldLabel>
                <Textarea id="highlights" name="highlights" defaultValue={product?.highlights.join('\n')} rows={4} placeholder={'One highlight per line'} />
                <FieldDescription>Each line becomes a bullet on the product page.</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing and stock</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field data-invalid={!!err.price}>
                  <FieldLabel htmlFor="price">Sale price (৳)</FieldLabel>
                  <Input id="price" name="price" defaultValue={product?.price} type="number" min={1} step="1" inputMode="numeric" aria-invalid={!!err.price} />
                  {err.price && <FieldError>{err.price}</FieldError>}
                </Field>
                <Field data-invalid={!!err.comparePrice}>
                  <FieldLabel htmlFor="comparePrice">Regular price (৳)</FieldLabel>
                  <Input
                    id="comparePrice"
                    name="comparePrice"
                    defaultValue={product?.comparePrice}
                    type="number"
                    min={1}
                    step="1"
                    inputMode="numeric"
                    aria-invalid={!!err.comparePrice}
                  />
                  {err.comparePrice ? (
                    <FieldError>{err.comparePrice}</FieldError>
                  ) : (
                    <FieldDescription>Optional. Shown struck through.</FieldDescription>
                  )}
                </Field>
                <Field data-invalid={!!err.stock}>
                  <FieldLabel htmlFor="stock">Stock</FieldLabel>
                  <Input id="stock" name="stock" type="number" min={0} step="1" defaultValue={product?.stock ?? 10} inputMode="numeric" aria-invalid={!!err.stock} />
                  {err.stock && <FieldError>{err.stock}</FieldError>}
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product gallery</CardTitle>
            <CardDescription>Upload up to 6 product photos. The first image is the main image.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <input type="hidden" name="image" value={images[0]?.src ?? ''} />
            <input type="hidden" name="images" value={JSON.stringify(images.map(({ src }) => src))} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              aria-label="Choose product photos"
              onChange={(event) => void uploadFiles(event.target.files)}
            />
            <Button type="button" variant="outline" className="w-full" disabled={uploading || images.length >= maxImages} onClick={() => fileInputRef.current?.click()}>
              <ImagePlusIcon data-icon="inline-start" />
              {uploading ? 'Uploading…' : 'Upload photos'}
            </Button>
            {uploadError && <p role="alert" className="text-sm text-destructive">{uploadError}</p>}
            {err.image && <p role="alert" className="text-sm text-destructive">{err.image}</p>}
            {images.length > 0 ? (
              <ol className="grid grid-cols-2 gap-3">
                {images.map((item, index) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedId(item.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      const from = images.findIndex((image) => image.id === draggedId)
                      if (from >= 0) moveImage(from, index)
                      setDraggedId(null)
                    }}
                    onDragEnd={() => setDraggedId(null)}
                    className={cn('group relative overflow-hidden rounded-lg border bg-muted', draggedId === item.id && 'opacity-50')}
                  >
                    <div className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt={item.name} className="size-full object-cover" />
                    </div>
                    {index === 0 && <span className="absolute left-2 top-2 rounded-md bg-primary-gradient px-2 py-1 text-xs font-medium text-primary-foreground">Main image</span>}
                    <div className="flex items-center justify-between gap-1 p-1.5">
                      <span className="flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground" title={item.name}>
                        <GripVerticalIcon className="size-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <div className="flex shrink-0 items-center">
                        <Button type="button" size="icon" variant="ghost" aria-label={`Move ${item.name} earlier`} disabled={index === 0} onClick={() => moveImage(index, index - 1)}>
                          <ArrowUpIcon />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Move ${item.name} later`} disabled={index === images.length - 1} onClick={() => moveImage(index, index + 1)}>
                          <ArrowDownIcon />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${item.name}`} onClick={() => setImages((current) => current.filter((image) => image.id !== item.id))}>
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void uploadFiles(event.dataTransfer.files) }} className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 text-center text-sm text-muted-foreground hover:bg-muted/60">
                <ImagePlusIcon aria-hidden="true" />
                <span>Drop photos here or click to browse</span>
                <span className="text-xs">JPG, PNG, WebP, or AVIF · up to 5 MB each</span>
              </button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field orientation="horizontal">
                <Switch id="isNew" name="isNew" defaultChecked={product?.isNew} />
                <FieldLabel htmlFor="isNew">Show in New Arrivals</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Switch id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured} />
                <FieldLabel htmlFor="isFeatured">Show in Featured</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Switch id="freeShipping" name="freeShipping" defaultChecked={product?.freeShipping} />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="freeShipping">Free shipping</FieldLabel>
                  <FieldDescription>Waive delivery when the cart contains only free-shipping products.</FieldDescription>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" size="lg" className="flex-1" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            {product ? 'Save changes' : 'Publish product'}
          </Button>
          <Link href="/admin/products" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Cancel
          </Link>
        </div>
      </div>
    </form>
  )
}
