'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PasswordUpdateCard() {
  const [notice, setNotice] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('Authentication is not connected in this UI-only prototype, so your password was not changed.')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Choose a strong password you do not use elsewhere.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input id="current-password" type="password" autoComplete="current-password" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" autoComplete="new-password" minLength={8} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Update password</Button>
            {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
