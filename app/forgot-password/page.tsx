import type { Metadata } from 'next'
import { AuthForm } from '@/components/dashboard/auth-form'

export const metadata: Metadata = { title: 'Forgot password | Niboshop' }

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />
}
