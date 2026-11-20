import type { Metadata } from 'next'
import { AuthForm } from '@/components/dashboard/auth-form'

export const metadata: Metadata = { title: 'Login | Niboshop' }

export default function LoginPage() {
  return <AuthForm mode="login" />
}
