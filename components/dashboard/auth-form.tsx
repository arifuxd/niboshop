'use client'

import Link from 'next/link'
import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const inputClassName = 'h-10 rounded-md border-border bg-background'

export function AuthForm({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'
  const title = isLogin ? 'Login' : isSignup ? 'Create your account' : 'Forgot password?'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('Authentication is not connected in this UI-only prototype, so nothing was submitted or saved.')
  }

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-muted/40 px-4 py-8">
      <section className="w-full max-w-[430px] overflow-hidden rounded-2xl border bg-card shadow-sm">
        <header className="border-b px-6 py-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? 'Welcome back to Niboshop.' : isSignup ? 'Sign up to manage orders and your profile.' : 'We’ll help you get back into your account.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
          {isLogin && (
            <>
              <Button type="button" variant="outline" className="h-11 w-full gap-2" onClick={() => setNotice('Google sign-in is not connected in this UI-only prototype.')}>
                <span aria-hidden="true" className="font-bold text-primary">G</span>Continue with Google
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />Or<span className="h-px flex-1 bg-border" /></div>
            </>
          )}
          {isSignup && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" name="name" autoComplete="name" placeholder="Your name" required className={inputClassName} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="identity">Email or phone number</Label>
            <Input
              id="identity"
              name="identity"
              type="text"
              inputMode="text"
              autoComplete="username"
              placeholder="Enter email or phone number"
              required
              className={inputClassName}
            />
          </div>
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  placeholder="Enter password"
                  minLength={8}
                  required
                  className={`${inputClassName} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-0 top-0 flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>
          )}
          {isLogin && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox name="remember" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
            </div>
          )}
          <Button type="submit" className="h-11 w-full text-base font-semibold">
            {isLogin ? 'Sign in' : isSignup ? 'Create account' : 'Send reset instructions'}
          </Button>
          {notice && <p role="status" className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">{notice}</p>}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? <>Don&apos;t have an account? <Link href="/signup" className="font-semibold text-primary hover:underline">Create account</Link></> : isSignup ? <>Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link></> : <>Remembered your password? <Link href="/login" className="font-semibold text-primary hover:underline">Back to login</Link></>}
          </p>
        </form>
      </section>
    </main>
  )
}
