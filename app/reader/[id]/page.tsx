import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PdfReader } from '@/components/reader/pdf-reader'
import { documents, getDocument } from '@/lib/data'

export function generateStaticParams() {
  return documents.map((d) => ({ id: d.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const doc = getDocument(id)
  return { title: doc ? `Reading: ${doc.title}` : 'Document not found' }
}

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = getDocument(id)
  if (!doc) notFound()
  return <PdfReader doc={doc} />
}
