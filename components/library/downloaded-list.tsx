import { DocListItem } from '@/components/doc-list-item'
import { formatDate, type PdfDocument } from '@/lib/data'

const downloadedOn = ['2026-10-07', '2026-10-05', '2026-10-02', '2026-09-26', '2026-09-19']

export function DownloadedList({ docs }: { docs: PdfDocument[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {docs.map((doc, i) => (
        <li key={doc.id}>
          <DocListItem doc={doc} meta={`Downloaded ${formatDate(downloadedOn[i] ?? doc.uploadedAt)}`} />
        </li>
      ))}
    </ul>
  )
}
