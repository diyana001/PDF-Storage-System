import type { ReaderPage } from '@/lib/reader-content'

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function pageText(page: ReaderPage) {
  return [page.heading, ...page.body]
}

export function countMatches(page: ReaderPage, query: string) {
  const q = query.trim()
  if (!q) return 0
  const re = new RegExp(escapeRegExp(q), 'gi')
  return pageText(page).reduce((n, t) => n + (t.match(re)?.length ?? 0), 0)
}

export function ReaderPageView({
  page,
  query,
  matchStartIndex,
  activeMatch,
}: {
  page: ReaderPage
  query: string
  matchStartIndex: number
  activeMatch: number
}) {
  const q = query.trim()
  const re = q ? new RegExp(`(${escapeRegExp(q)})`, 'gi') : null
  let cursor = matchStartIndex

  function highlight(text: string) {
    if (!re) return text
    return text.split(re).map((part, i) => {
      if (i % 2 === 0) return part
      const isActive = cursor === activeMatch
      cursor++
      return (
        <mark
          key={i}
          className={isActive ? 'rounded-sm bg-primary px-0.5 text-primary-foreground' : 'rounded-sm bg-yellow-200 px-0.5 text-foreground'}
        >
          {part}
        </mark>
      )
    })
  }

  return (
    <article
      aria-label={`Page ${page.number}`}
      className="relative flex aspect-[8.5/11] w-full flex-col bg-white p-[8cqi] text-[1.9cqi] leading-relaxed text-foreground shadow-md"
    >
      {page.isCover ? (
        <div className="flex h-full flex-col">
          <div className="h-[1.2cqi] w-[18cqi] rounded-full bg-primary" />
          <p className="mt-[16cqi] text-[1.8cqi] font-semibold tracking-widest text-primary uppercase">{page.kicker}</p>
          <h2 className="mt-[3cqi] text-[5.2cqi] leading-tight font-bold text-balance">{highlight(page.heading)}</h2>
          <p className="mt-[5cqi] max-w-[80%] text-[2.2cqi] text-muted-foreground">{highlight(page.body[0])}</p>
          <div className="mt-auto flex items-end justify-between border-t pt-[3cqi] text-[1.6cqi] text-muted-foreground">
            <span>PDFHub Document Library</span>
            <span>2026 Edition</span>
          </div>
        </div>
      ) : (
        <>
          <p className="truncate border-b pb-[2cqi] text-[1.5cqi] text-muted-foreground">{page.kicker}</p>
          <h2 className="mt-[5cqi] text-[3.2cqi] font-bold">{highlight(page.heading)}</h2>
          <div className="mt-[3cqi] flex flex-col gap-[2.5cqi]">
            {page.body.map((para, i) => (
              <p key={i} className="text-pretty">
                {highlight(para)}
              </p>
            ))}
          </div>
          <div className="mt-[4cqi] grid grid-cols-3 gap-[2cqi]" aria-hidden="true">
            {[62, 84, 45].map((h, i) => (
              <div key={i} className="flex aspect-[4/3] items-end rounded bg-muted p-[1.5cqi]">
                <div className="w-full rounded-sm bg-primary/70" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </>
      )}
      <span className="absolute right-[8cqi] bottom-[4cqi] text-[1.5cqi] text-muted-foreground tabular-nums">
        {page.number}
      </span>
    </article>
  )
}
