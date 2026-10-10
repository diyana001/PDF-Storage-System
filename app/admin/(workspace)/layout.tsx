import { AdminLayoutShell } from '@/components/admin/admin-layout-shell'

export default function AdminWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>
}