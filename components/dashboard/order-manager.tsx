'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { updateOrderStatusAction } from '@/app/admin/actions'
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
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect } from '@/components/ui/native-select'
import { Spinner } from '@/components/ui/spinner'
import type { OrderStatus } from '@/lib/data'

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const nextStep: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
}

export function OrderManager({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [selected, setSelected] = React.useState<OrderStatus>(status)
  const [pending, startTransition] = React.useTransition()

  const save = (next: OrderStatus) =>
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next)
      if (result.error) toast.error(result.error)
      else toast.success(result.success)
    })

  React.useEffect(() => setSelected(status), [status])

  const advance = nextStep[status]
  const closed = status === 'delivered' || status === 'cancelled'

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="order-status">Order status</FieldLabel>
        <NativeSelect
          id="order-status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as OrderStatus)}
          disabled={pending}
        >
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Button onClick={() => save(selected)} disabled={pending || selected === status}>
        {pending && <Spinner data-icon="inline-start" />}
        Update status
      </Button>
      {advance && (
        <Button variant="outline" onClick={() => save(advance)} disabled={pending}>
          Mark as {advance}
        </Button>
      )}
      {!closed && (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" disabled={pending} />}>
            Cancel order
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel order {orderId}?</AlertDialogTitle>
              <AlertDialogDescription>
                The order will be marked as cancelled. You can reopen it later by changing the status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep order</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => save('cancelled')}>
                Cancel order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
