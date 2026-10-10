'use client'

import Form from 'next/form'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { DocThumbnail } from '@/components/doc-thumbnail'
import { documents } from '@/lib/data'
import { useMockAuth } from '@/lib/mock-auth'

const popular = ['Annual report', 'Lecture notes', 'Privacy policy', 'Onboarding']

export function Hero() {
  const { user, isReady } = useMockAuth()
  const stack = [documents[2], documents[0], documents[5]]
  const firstName = user?.name.split(' ')[0]

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.35) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to left, black, transparent 75%)',
        }}
        aria-hidden="true"
      />
      <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:p-12">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium text-primary-foreground/80">
            {!isReady ? 'Explore PDFHub' : user ? `Welcome back, ${firstName}` : 'Welcome to PDFHub'}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Every document you need, organized and one search away.
          </h1>
          <p className="max-w-xl leading-relaxed text-pretty text-primary-foreground/85">
            Browse over 1,200 reports, manuals, academic papers and forms. Preview instantly, read online,
            or download for offline use.
          </p>

          {isReady && !user ? (
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex h-11 items-center rounded-lg bg-white px-5 font-semibold text-primary transition-colors hover:bg-white/90">
                Create your account
              </Link>
              <Link href="/login" className="inline-flex h-11 items-center rounded-lg border border-white/50 px-5 font-semibold text-white transition-colors hover:bg-white/10">
                Sign in
              </Link>
            </div>
          ) : null}

          <Form action="/browse" className="flex w-full max-w-xl flex-col gap-2 rounded-xl bg-card p-2 shadow-lg sm:flex-row" role="search">
            <label htmlFor="hero-search" className="sr-only">
              Quick search
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Search by title, author or keyword"
                className="h-11 w-full rounded-lg bg-transparent pr-3 pl-10 text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Search
            </button>
          </Form>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-primary-foreground/75">Popular:</span>
            {popular.map((term) => (
              <Link
                key={term}
                href={`/browse?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-white/15 px-3 py-1 transition-colors hover:bg-white/25"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-80 w-full max-w-sm lg:block" aria-hidden="true">
          {stack.map((doc, i) => (
            <div
              key={doc.id}
              className="absolute top-1/2 left-1/2 w-52 overflow-hidden rounded-xl shadow-2xl"
              style={{
                transform: `translate(-50%, -50%) translateX(${(i - 1) * 70}px) rotate(${(i - 1) * 8}deg)`,
                zIndex: i === 1 ? 3 : 1,
              }}
            >
              <DocThumbnail doc={doc} size="lg" className="rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
