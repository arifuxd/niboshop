'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { deleteCustomerAction, setCustomerStatusAction } from '@/app/admin/actions'
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
import type { Customer } from '@/lib/data'

export function CustomerActions({ customer }: { customer: Customer }) {
  const [pending, startTransition] = React.useTransition()
  const blocked = customer.status === 'blocked'

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setCustomerStatusAction(customer.id, blocked ? 'active' : 'blocked')
            toast.success(blocked ? 'Customer unblocked.' : 'Customer blocked.')
          })
        }
      >
        {blocked ? 'Unblock customer' : 'Block customer'}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" disabled={pending} />}>
          Delete customer
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {customer.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the customer from your list. Their past orders stay in the order history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => startTransition(() => deleteCustomerAction(customer.id))}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
