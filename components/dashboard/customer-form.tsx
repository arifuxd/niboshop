'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  createCustomerAction,
  updateCustomerAction,
  type FormState,
} from '@/app/admin/actions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import type { Customer } from '@/lib/data'
import { cn } from '@/lib/utils'

const initial: FormState = {}

export function CustomerForm({ customer }: { customer?: Customer }) {
  const boundAction = customer ? updateCustomerAction.bind(null, customer.id) : createCustomerAction
  const [state, action, pending] = React.useActionState(boundAction, initial)
  const err = state.fieldErrors ?? {}

  React.useEffect(() => {
    if (state.success) toast.success(state.success)
  }, [state])

  return (
    <form action={action}>
      <FieldGroup>
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <Field data-invalid={!!err.name}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" name="name" defaultValue={customer?.name} aria-invalid={!!err.name} />
          {err.name && <FieldError>{err.name}</FieldError>}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!err.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" defaultValue={customer?.email} aria-invalid={!!err.email} />
            {err.email && <FieldError>{err.email}</FieldError>}
          </Field>
          <Field data-invalid={!!err.phone}>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" name="phone" type="tel" defaultValue={customer?.phone} aria-invalid={!!err.phone} />
            {err.phone && <FieldError>{err.phone}</FieldError>}
          </Field>
        </div>
        <Field data-invalid={!!err.city}>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" name="city" defaultValue={customer?.city} aria-invalid={!!err.city} />
          {err.city && <FieldError>{err.city}</FieldError>}
        </Field>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            {customer ? 'Save changes' : 'Add customer'}
          </Button>
          {!customer && (
            <Link href="/admin/customers" className={cn(buttonVariants({ variant: 'outline' }))}>
              Cancel
            </Link>
          )}
        </div>
      </FieldGroup>
    </form>
  )
}
