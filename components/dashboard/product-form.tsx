'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createProductAction, type FormState } from '@/app/admin/actions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import type { Category } from '@/lib/data'
import { cn } from '@/lib/utils'

type ImageChoice = { src: string; label: string }

const initial: FormState = {}

export function ProductForm({
  categories,
  imageChoices,
}: {
  categories: Category[]
  imageChoices: ImageChoice[]
}) {
  const [state, action, pending] = React.useActionState(createProductAction, initial)
  const [image, setImage] = React.useState(imageChoices[0]?.src ?? '')
  const err = state.fieldErrors ?? {}

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex min-w-0 flex-col gap-6">
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardDescription>Shown on the product card and product page.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!err.name}>
                <FieldLabel htmlFor="name">Product name</FieldLabel>
                <Input id="name" name="name" aria-invalid={!!err.name} placeholder="e.g. Nova X Pro 5G 256GB" />
                {err.name && <FieldError>{err.name}</FieldError>}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!err.brand}>
                  <FieldLabel htmlFor="brand">Brand</FieldLabel>
                  <Input id="brand" name="brand" aria-invalid={!!err.brand} placeholder="e.g. Nova" />
                  {err.brand && <FieldError>{err.brand}</FieldError>}
                </Field>
                <Field data-invalid={!!err.categorySlug}>
                  <FieldLabel htmlFor="categorySlug">Category</FieldLabel>
                  <NativeSelect id="categorySlug" name="categorySlug" defaultValue="" aria-invalid={!!err.categorySlug}>
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
              <Field data-invalid={!!err.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  aria-invalid={!!err.description}
                  placeholder="Describe the product for customers."
                />
                {err.description && <FieldError>{err.description}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="highlights">Key highlights</FieldLabel>
                <Textarea id="highlights" name="highlights" rows={4} placeholder={'One highlight per line'} />
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
                  <Input id="price" name="price" type="number" min={1} step="1" inputMode="numeric" aria-invalid={!!err.price} />
                  {err.price && <FieldError>{err.price}</FieldError>}
                </Field>
                <Field data-invalid={!!err.comparePrice}>
                  <FieldLabel htmlFor="comparePrice">Regular price (৳)</FieldLabel>
                  <Input
                    id="comparePrice"
                    name="comparePrice"
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
                  <Input id="stock" name="stock" type="number" min={0} step="1" defaultValue={10} inputMode="numeric" aria-invalid={!!err.stock} />
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
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {image.startsWith('/') ? (
                  <Image src={image} alt="Selected product image preview" fill sizes="320px" className="object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="Selected product image preview" className="size-full object-cover" />
                )}
              </div>
              <Field>
                <FieldLabel htmlFor="image-choice">Library image</FieldLabel>
                <NativeSelect id="image-choice" value={imageChoices.some((c) => c.src === image) ? image : ''} onChange={(e) => e.target.value && setImage(e.target.value)}>
                  <option value="">Custom URL</option>
                  {imageChoices.map((c) => (
                    <option key={c.src} value={c.src}>
                      {c.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field data-invalid={!!err.image}>
                <FieldLabel htmlFor="image">Image path or URL</FieldLabel>
                <Input id="image" name="image" value={image} onChange={(e) => setImage(e.target.value)} aria-invalid={!!err.image} />
                {err.image && <FieldError>{err.image}</FieldError>}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field orientation="horizontal">
                <Switch id="isNew" name="isNew" />
                <FieldLabel htmlFor="isNew">Show in New Arrivals</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Switch id="isFeatured" name="isFeatured" />
                <FieldLabel htmlFor="isFeatured">Show in Featured</FieldLabel>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" size="lg" className="flex-1" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            Publish product
          </Button>
          <Link href="/admin/products" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Cancel
          </Link>
        </div>
      </div>
    </form>
  )
}
