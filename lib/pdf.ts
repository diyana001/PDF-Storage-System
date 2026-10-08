import { getCategory, type PdfDocument } from '@/lib/data'

function escapePdfText(text: string) {
  return text.replace(/[^\x20-\x7E]/g, '-').replace(/([\\()])/g, '\\$1')
}

function wrap(text: string, max = 80) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if ((line + ' ' + word).trim().length > max) {
      lines.push(line)
      line = word
    } else {
      line = (line + ' ' + word).trim()
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Builds a small, valid single-page PDF summarising the document. */
export function buildSamplePdf(doc: PdfDocument) {
  const body = [
    `BT /F1 22 Tf 72 720 Td (${escapePdfText(doc.title)}) Tj ET`,
    `BT /F1 11 Tf 72 696 Td (${escapePdfText(`${getCategory(doc.category).name}  |  ${doc.author}  |  ${doc.pages} pages`)}) Tj ET`,
    ...wrap(doc.description).map(
      (l, i) => `BT /F1 12 Tf 72 ${660 - i * 18} Td (${escapePdfText(l)}) Tj ET`,
    ),
    `BT /F1 9 Tf 72 72 Td (Downloaded from PDFHub) Tj ET`,
  ].join('\n')

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${body.length} >>\nstream\n${body}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((obj, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return pdf
}
