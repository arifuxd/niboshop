'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const inputClassName = 'h-10 rounded-md border-border bg-background'
type AuthMode = 'login' | 'signup' | 'forgot' | 'otp'

export function AuthForm({
  mode,
  onClose,
}: {
  mode: 'login' | 'signup' | 'forgot'
  onClose?: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])
  const [activeMode, setActiveMode] = useState<AuthMode>(mode)
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const router = useRouter()
  const { t } = useLanguage()
  const isLogin = activeMode === 'login'
  const isSignup = activeMode === 'signup'
  const isOtp = activeMode === 'otp'

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  useEffect(() => {
    if (isOtp) otpRefs.current[0]?.focus()
  }, [isOtp])

  function closeDialog() {
    if (onClose) onClose()
    else router.push('/')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    if (isSignup) {
      const form = new FormData(event.currentTarget)
      if (form.get('password') !== form.get('confirm-password')) {
        setNotice(t('Your passwords do not match. Please check and try again.'))
        return
      }
      const email = String(form.get('identity') || '')
      try { const result = await fetch('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: form.get('name'), email, password: form.get('password') }) }).then(async r => { if(!r.ok) throw new Error(await r.text()); return r.json() }); setNotice('Account created successfully.'); window.dispatchEvent(new Event('niboshop-auth-change')); router.push('/account') } catch (e) { setNotice(e instanceof Error ? 'Registration failed. Check your email and password.' : 'Registration failed.') }
      return
    }
    if (isOtp) {
      if (otp.some((digit) => !digit)) {
        setNotice(t('Enter all 6 digits to continue.'))
        return
      }
      setNotice(t('Code verification is not connected in this UI-only prototype.'))
      return
    }
    if (activeMode === 'forgot') { setNotice(t('Password reset is unavailable because email delivery is not configured.')); return }
    const form = new FormData(event.currentTarget)
    try { const result = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: form.get('identity'), password: form.get('password') }) }).then(async r => { if(!r.ok) throw new Error(await r.text()); return r.json() }); window.dispatchEvent(new Event('niboshop-auth-change')); router.push(result.user.role === 'admin' ? '/admin' : '/account') } catch { setNotice('Could not sign in. Check your email and password.') }
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setOtp((current) => current.map((item, i) => i === index ? digit : item))
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
    if (event.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpPaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - index)
    if (!digits) return
    event.preventDefault()
    setOtp((current) => current.map((digit, i) => i >= index && i < index + digits.length ? digits[i - index] : digit))
    otpRefs.current[Math.min(index + digits.length, 5)]?.focus()
  }

  function changeMode(nextMode: AuthMode) {
    setActiveMode(nextMode)
    setNotice('')
  }

  const title = isOtp
    ? 'Verify your account'
    : isSignup
      ? 'Create your account'
      : activeMode === 'forgot'
        ? 'Forgot password?'
        : 'Welcome back to Niboshop'

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-title"
      onCancel={(event) => { event.preventDefault(); closeDialog() }}
      onClick={(event) => { if (event.target === event.currentTarget) closeDialog() }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[440px] overflow-y-auto rounded-2xl border-0 bg-transparent p-0 text-foreground shadow-none backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <section className="relative w-full overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <button type="button" onClick={closeDialog} aria-label={t('Close')} className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <XIcon className="size-4" />
        </button>
        {isOtp && (
          <button type="button" onClick={() => changeMode('signup')} className="absolute left-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label={t('Back')}>
            <ArrowLeftIcon className="size-4" />
          </button>
        )}
        <header className="border-b px-6 pb-5 pt-8 text-center">
          <h1 id="auth-title" className="text-2xl font-semibold tracking-tight">{t(title)}</h1>
          {isLogin && <p className="mt-2 text-sm text-muted-foreground">{t('Sign in to continue to your account.')}</p>}
          {isOtp && <p className="mt-2 text-sm text-muted-foreground">{t('Enter the 6-digit code sent to your email or phone.')}</p>}
          {activeMode === 'forgot' && <p className="mt-2 text-sm text-muted-foreground">{t('We’ll help you get back into your account.')}</p>}
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
          {isOtp ? (
            <>
              <div className="flex justify-center gap-2 sm:gap-3" aria-label={t('Six-digit verification code')}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { otpRefs.current[index] = element }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    aria-label={t(`Digit ${index + 1}`)}
                    value={digit}
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={(event) => handleOtpPaste(index, event)}
                    maxLength={1}
                    required
                    className="size-11 rounded-lg border border-input bg-background text-center text-lg font-semibold outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring sm:size-12"
                  />
                ))}
              </div>
              <Button type="submit" className="h-11 w-full text-base font-semibold">{t('Verify code')}</Button>
              <button type="button" onClick={() => setNotice(t('A new code cannot be sent until authentication is connected.'))} className="text-sm font-medium text-primary hover:underline">{t('Resend code')}</button>
            </>
          ) : (
            <>
              {isSignup && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="full-name">{t('Full name')}</Label>
                  <Input id="full-name" name="name" autoComplete="name" placeholder={t('Your name')} required className={inputClassName} />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="identity">{t('Email address')}</Label>
                <Input id="identity" name="identity" type="email" autoComplete="username" placeholder={t('Enter email address')} required className={inputClassName} />
              </div>
              {activeMode !== 'forgot' && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">{t('Password')}</Label>
                    <div className="relative">
                      <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder={t('Enter password')} minLength={8} required className={`${inputClassName} pr-11`} />
                      <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-0 top-0 flex size-10 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={t(showPassword ? 'Hide password' : 'Show password')}>
                        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                      </button>
                    </div>
                  </div>
                  {isSignup && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirm-password">{t('Confirm password')}</Label>
                      <Input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" placeholder={t('Re-enter password')} minLength={8} required className={inputClassName} />
                    </div>
                  )}
                </>
              )}
              {isLogin && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground"><Checkbox name="remember" />{t('Remember me')}</label>
                  <button type="button" onClick={() => changeMode('forgot')} className="text-sm font-medium text-primary hover:underline">{t('Forgot password?')}</button>
                </div>
              )}
              <Button type="submit" className="h-11 w-full text-base font-semibold">
                {isLogin ? t('Sign in') : isSignup ? t('Create account') : t('Send reset instructions')}
              </Button>
            </>
          )}
          {notice && <p role="status" className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">{notice}</p>}
          {!isOtp && <p className="text-center text-sm text-muted-foreground">
            {isLogin ? <>{t('Don’t have an account?')} <button type="button" onClick={() => changeMode('signup')} className="font-semibold text-primary hover:underline">{t('Create account')}</button></> : isSignup ? <>{t('Already have an account?')} <button type="button" onClick={() => changeMode('login')} className="font-semibold text-primary hover:underline">{t('Sign in')}</button></> : <>Remembered your password? <button type="button" onClick={() => changeMode('login')} className="font-semibold text-primary hover:underline">{t('Back to login')}</button></>}
          </p>}
        </form>
      </section>
    </dialog>
  )
}
