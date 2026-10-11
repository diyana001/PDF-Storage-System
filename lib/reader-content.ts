import { getCategory, type PdfDocument } from '@/lib/data'

export const PREVIEW_PAGE_LIMIT = 10

const sectionTitles = [
  'Introduction',
  'Background and Scope',
  'Methodology',
  'Key Findings',
  'Detailed Analysis',
  'Implementation Guidelines',
  'Risks and Considerations',
  'Recommendations',
  'Conclusion',
]

const paragraphs = [
  'This section establishes the context for the material that follows. It outlines the objectives, the intended audience and the principal questions this document sets out to answer, so that readers can quickly orient themselves before moving into the detail.',
  'Data was collected from multiple sources over the reporting period and validated against internal records. Where figures differ from previous editions, the variance is noted alongside the reason for the change, ensuring that comparisons remain meaningful over time.',
  'Stakeholders were consulted throughout the drafting process. Their feedback shaped both the structure of the document and the emphasis placed on particular topics, with special attention given to clarity, accessibility and practical application.',
  'The results indicate a consistent trend across the majority of measured indicators. Performance improved in most areas, while a small number of metrics remained flat. These exceptions are examined in greater depth in the analysis that follows.',
  'Readers should treat the guidance in this section as a baseline rather than an exhaustive specification. Local requirements, regulatory obligations and organisational policies may introduce additional steps that are not covered here.',
  'A summary table is provided at the end of each chapter to help readers locate the most relevant information. Cross references point to related sections, appendices and external resources where further detail is available.',
]

export type ReaderPage = {
  number: number
  heading: string
  kicker: string
  body: string[]
  isCover: boolean
}

export function buildReaderPages(doc: PdfDocument): ReaderPage[] {
  const total = Math.min(doc.pages, PREVIEW_PAGE_LIMIT)
  const categoryName = getCategory(doc.category).name

  return Array.from({ length: total }, (_, i) => {
    if (i === 0) {
      return {
        number: 1,
        heading: doc.title,
        kicker: `${categoryName} · ${doc.author}`,
        body: [doc.description],
        isCover: true,
      }
    }
    const section = sectionTitles[(i - 1) % sectionTitles.length]
    return {
      number: i + 1,
      heading: `${i}. ${section}`,
      kicker: doc.title,
      body: [0, 1, 2].map((k) => paragraphs[(i + k) % paragraphs.length]),
      isCover: false,
    }
  })
}
