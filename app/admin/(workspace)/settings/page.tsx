import type { Metadata } from 'next'
import { AdminSettingsForm } from '@/components/admin/admin-settings-form'

export const metadata: Metadata = { title: 'Settings' }

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure how the public library behaves.</p>
      </div>
      <AdminSettingsForm />
    </div>
  )
}
