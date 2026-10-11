import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export const metadata: Metadata = { title: 'Admin sign in' }

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return <AdminLoginForm redirectTo={next} />
}