import type { Metadata } from 'next'
import { PendingSubmissions } from '@/components/admin/pending-submissions'

export const metadata: Metadata = { title: 'Pending Submissions' }

export default function PendingSubmissionsPage() {
  return <PendingSubmissions />
}
