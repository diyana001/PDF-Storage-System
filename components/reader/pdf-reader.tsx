'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Maximize,
  PanelLeft,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { buildReaderPages, PREVIEW_PAGE_LIMIT } from '@/lib/reader-content'
import type { PdfDocument } from '@/lib/data'
import { ReaderPageView, countMatches } from '@/components/reader/reader-page'
import { cn } from '@/lib/utils'

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2]
const BASE_WIDTH = 760

function ToolbarButton({
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4.5',
        className,
      )}
      {...props}
    />
  )
}

export function PdfReader({ doc }: { doc: PdfDocument }) {
  const pages = useMemo(() => buildReaderPages(doc), [doc])
  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [zoom, setZoom] = useState(1)
  const [showThumbs, setShowThumbs] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeMatch, setActiveMatch] = useState(0)

  const matchPages = useMemo(() => {
    const list: number[] = []
    for (const p of pages) {
      const n = countMatches(p, query)
      for (let i = 0; i < n; i++) list.push(p.number)
    }
    return list
  }, [pages, query])

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const n = Number((visible.target as HTMLElement).dataset.page)
          setCurrentPage(n)
          setPageInput(String(n))
        }
      },
      { root, threshold: [0.25, 0.5, 0.75] },
    )
    pageRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [pages, zoom])

  function goToPage(n: number) {
    const target = Math.min(Math.max(1, n), pages.length)
    pageRefs.current[target - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setCurrentPage(target)
    setPageInput(String(target))
  }

  function stepZoom(dir: 1 | -1) {
    const idx = ZOOM_STEPS.findIndex((z) => z >= zoom - 0.001)
    const next = ZOOM_STEPS[Math.min(Math.max(0, (idx === -1 ? 2 : idx) + dir), ZOOM_STEPS.length - 1)]
    setZoom(next)
  }

  function fitWidth() {
    const width = scrollRef.current?.clientWidth ?? BASE_WIDTH
    setZoom(Math.max(0.4, Math.min(2, (width - 48) / BASE_WIDTH)))
  }

  function jumpToMatch(index: number) {
    if (!matchPages.length) return
    const wrapped = (index + matchPages.length) % matchPages.length
    setActiveMatch(wrapped)
    goToPage(matchPages[wrapped])
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      jumpToMatch(e.shiftKey ? activeMatch - 1 : activeMatch + 1)
    }
    if (e.key === 'Escape') {
      setSearchOpen(false)
      setQuery('')
    }
  }

  let matchCursor = 0

  return (
    <div className="flex h-dvh flex-col bg-muted">
      <header className="flex h-14 shrink-0 items-center gap-2 bg-foreground px-2 text-white sm:px-3">
        <Link
          href={`/documents/${doc.id}`}
          className="flex size-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Back to document details"
        >
          <ArrowLeft className="size-4.5" aria-hidden="true" />
        </Link>
        <ToolbarButton
          label={showThumbs ? 'Hide page thumbnails' : 'Show page thumbnails'}
          onClick={() => setShowThumbs((s) => !s)}
          aria-pressed={showThumbs}
          className="hidden md:flex"
        >
          <PanelLeft />
        </ToolbarButton>
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{doc.title}</h1>

        <div className="flex items-center gap-0.5">
          <ToolbarButton label="Previous page" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
            <ChevronLeft />
          </ToolbarButton>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              goToPage(Number(pageInput) || 1)
            }}
            className="flex items-center gap-1.5 text-sm"
          >
            <label htmlFor="page-input" className="sr-only">
              Current page
            </label>
            <input
              id="page-input"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
              onBlur={() => setPageInput(String(currentPage))}
              className="h-8 w-10 rounded-md bg-white/10 text-center tabular-nums outline-none focus:ring-2 focus:ring-white/50"
            />
            <span className="whitespace-nowrap text-white/70 tabular-nums">/ {pages.length}</span>
          </form>
          <ToolbarButton label="Next page" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pages.length}>
            <ChevronRight />
          </ToolbarButton>
        </div>

        <div className="mx-1 hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />

        <div className="hidden items-center gap-0.5 sm:flex">
          <ToolbarButton label="Zoom out" onClick={() => stepZoom(-1)} disabled={zoom <= ZOOM_STEPS[0]}>
            <ZoomOut />
          </ToolbarButton>
          <span className="w-12 text-center text-sm tabular-nums" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <ToolbarButton label="Zoom in" onClick={() => stepZoom(1)} disabled={zoom >= ZOOM_STEPS.at(-1)!}>
            <ZoomIn />
          </ToolbarButton>
          <ToolbarButton label="Fit to width" onClick={fitWidth}>
            <Maximize />
          </ToolbarButton>
        </div>

        <div className="mx-1 hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />

        <ToolbarButton
          label="Search in document"
          onClick={() => setSearchOpen((s) => !s)}
          aria-pressed={searchOpen}
          className={cn(searchOpen && 'bg-white/15 text-white')}
        >
          <Search />
        </ToolbarButton>
        <a
          href={`/api/documents/${doc.id}/download`}
          download
          className="flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </header>

      {searchOpen ? (
        <div className="flex shrink-0 items-center gap-2 border-b bg-card px-3 py-2">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="reader-search" className="sr-only">
            Find in document
          </label>
          <input
            id="reader-search"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveMatch(0)
            }}
            onKeyDown={onSearchKey}
            placeholder="Find in document…"
            className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums" aria-live="polite">
            {query.trim() ? (matchPages.length ? `${activeMatch + 1} of ${matchPages.length}` : 'No matches') : ''}
          </span>
          <button
            type="button"
            onClick={() => jumpToMatch(activeMatch - 1)}
            disabled={!matchPages.length}
            aria-label="Previous match"
            className="flex size-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-40"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => jumpToMatch(activeMatch + 1)}
            disabled={!matchPages.length}
            aria-label="Next match"
            className="flex size-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-40"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false)
              setQuery('')
            }}
            aria-label="Close search"
            className="flex size-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {showThumbs ? (
          <nav aria-label="Pages" className="hidden w-40 shrink-0 overflow-y-auto border-r bg-card p-3 md:block">
            <ol className="flex flex-col gap-3">
              {pages.map((p) => (
                <li key={p.number}>
                  <button
                    type="button"
                    onClick={() => goToPage(p.number)}
                    aria-current={p.number === currentPage ? 'page' : undefined}
                    className={cn(
                      'flex w-full flex-col items-center gap-1.5 rounded-md p-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted',
                      p.number === currentPage && 'bg-secondary font-medium text-secondary-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'flex aspect-[8.5/11] w-full flex-col gap-1 rounded-sm border bg-card p-2 shadow-sm',
                        p.number === currentPage && 'ring-2 ring-primary',
                      )}
                      aria-hidden="true"
                    >
                      <span className="h-1 w-3/4 rounded bg-foreground/50" />
                      {[90, 100, 80, 95, 70].map((w, i) => (
                        <span key={i} className="h-0.5 rounded bg-border" style={{ width: `${w}%` }} />
                      ))}
                    </span>
                    Page {p.number}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div ref={scrollRef} className="min-w-0 flex-1 overflow-auto">
          <div className="flex min-w-max flex-col items-center gap-6 px-4 py-6 sm:px-6">
            {pages.map((p) => {
              const startIndex = matchCursor
              matchCursor += countMatches(p, query)
              return (
                <div
                  key={p.number}
                  ref={(el) => {
                    pageRefs.current[p.number - 1] = el
                  }}
                  data-page={p.number}
                  className="@container scroll-mt-6"
                  style={{
                    width: zoom <= 1 ? `min(${BASE_WIDTH * zoom}px, calc(100vw - 2rem))` : `${BASE_WIDTH * zoom}px`,
                  }}
                >
                  <ReaderPageView
                    page={p}
                    query={query}
                    matchStartIndex={startIndex}
                    activeMatch={activeMatch}
                  />
                </div>
              )
            })}
            {doc.pages > PREVIEW_PAGE_LIMIT ? (
              <div
                className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm"
                style={{ width: `min(${BASE_WIDTH * zoom}px, calc(100vw - 2rem))` }}
              >
                <p className="font-semibold">
                  {`You've reached the end of the online preview`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {`Showing ${PREVIEW_PAGE_LIMIT} of ${doc.pages} pages. Download the full PDF to keep reading offline.`}
                </p>
                <a
                  href={`/api/documents/${doc.id}/download`}
                  download
                  className="flex h-10 items-center gap-2 rounded-lg bg-success px-4 text-sm font-medium text-success-foreground hover:bg-success/90"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download full PDF
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
