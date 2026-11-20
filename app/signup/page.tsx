import type { Metadata } from 'next'
import { AuthForm } from '@/components/dashboard/auth-form'

export const metadata: Metadata = { title: 'Create account | Niboshop' }

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
