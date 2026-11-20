'use client'

import * as React from 'react'
import { ImagePlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'
import { saveStoreSettingsAction, type FormState } from '@/app/admin/actions'
import type { StoreSettings } from '@/lib/store-settings'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

const initialState: FormState = {}

export function StoreSettingsForm({ settings }: { settings: StoreSettings }) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [state, action, pending] = React.useActionState(saveStoreSettingsAction, initialState)
  const [logoUrl, setLogoUrl] = React.useState(settings.logoUrl)
  const [uploading, setUploading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      void mutate('/api/store-settings')
      router.refresh()
    }
  }, [state.success, router])

  async function uploadLogo(file?: File) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Choose a JPG, PNG, WebP, or AVIF image under 5 MB.')
      return
    }
    setUploading(true)
    try {
      const body = new FormData()
      body.set('file', file)
      const response = await fetch('/api/admin/store-logo', { method: 'POST', body })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Upload failed.')
      setLogoUrl(result.url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {state.error && <Alert variant="destructive"><AlertDescription>{state.error}</AlertDescription></Alert>}
      <input type="hidden" name="logoUrl" value={logoUrl} />
      <Card>
        <CardHeader>
          <CardTitle>Store identity</CardTitle>
          <CardDescription>Keep your customer-facing store details up to date.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel>Company logo</FieldLabel>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex min-h-16 min-w-40 items-center justify-center rounded-lg border bg-header p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Store logo preview" className="max-h-12 max-w-48 object-contain" />
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" aria-label="Choose company logo" onChange={(event) => void uploadLogo(event.target.files?.[0])} />
                  <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                    {uploading ? <Spinner data-icon="inline-start" /> : <ImagePlusIcon data-icon="inline-start" />}
                    {uploading ? 'Uploading…' : 'Upload logo'}
                  </Button>
                  <FieldDescription>Use a transparent, horizontal logo. JPG, PNG, WebP or AVIF; up to 5 MB.</FieldDescription>
                </div>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="address">Store address</FieldLabel>
              <Input id="address" name="address" defaultValue={settings.address} required maxLength={200} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="phone">Hotline</FieldLabel>
                <Input id="phone" name="phone" type="tel" defaultValue={settings.phone} required maxLength={30} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Support email</FieldLabel>
                <Input id="email" name="email" type="email" defaultValue={settings.email} required maxLength={254} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="hours">Support hours</FieldLabel>
              <Input id="hours" name="hours" defaultValue={settings.hours} required maxLength={100} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Delivery pricing</CardTitle>
          <CardDescription>Delivery rates are shown during checkout. Free-shipping threshold applies to cart subtotal.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="insideDhakaCharge">Inside Dhaka (৳)</FieldLabel>
                <Input id="insideDhakaCharge" name="insideDhakaCharge" type="number" min="0" step="1" defaultValue={settings.insideDhakaCharge} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="outsideDhakaCharge">Outside Dhaka (৳)</FieldLabel>
                <Input id="outsideDhakaCharge" name="outsideDhakaCharge" type="number" min="0" step="1" defaultValue={settings.outsideDhakaCharge} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="freeShippingThreshold">Free delivery over (৳)</FieldLabel>
                <Input id="freeShippingThreshold" name="freeShippingThreshold" type="number" min="0" step="1" defaultValue={settings.freeShippingThreshold} required />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending || uploading}>
          {pending && <Spinner data-icon="inline-start" />}
          Save store settings
        </Button>
      </div>
    </form>
  )
}
