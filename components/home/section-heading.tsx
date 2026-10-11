import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  id,
  title,
  description,
  href,
  linkLabel,
}: {
  id: string
  title: string
  description?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}
