import type { Metadata } from 'next'
import { UploadPage } from '@/components/upload-page'

export const metadata: Metadata = { title: 'Upload a document' }

export default function UploadDocumentPage() {
  return <UploadPage />
}
