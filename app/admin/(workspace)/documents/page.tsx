import type { Metadata } from 'next'
import { DocumentsManager } from '@/components/admin/documents-manager'

export const metadata: Metadata = { title: 'Manage Documents' }

export default async function AdminDocumentsPage({ searchParams }: { searchParams: Promise<{ upload?: string }> }) {
  const { upload } = await searchParams
  return <DocumentsManager openUploadOnLoad={upload === '1'} />
}
