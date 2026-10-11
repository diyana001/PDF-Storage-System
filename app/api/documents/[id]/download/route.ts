import { getDocument } from '@/lib/data'
import { buildSamplePdf } from '@/lib/pdf'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = getDocument(id)
  if (!doc) return new Response('Document not found', { status: 404 })

  return new Response(buildSamplePdf(doc), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${doc.id}.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
