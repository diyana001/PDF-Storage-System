import Link from 'next/link'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  href = '/',
  className,
  inverted = false,
  suffix,
}: {
  href?: string
  className?: string
  inverted?: boolean
  suffix?: string
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}
      aria-label="PDFHub home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <FileText className="size-4.5" aria-hidden="true" />
      </span>
      <span className={cn('text-lg', inverted ? 'text-white' : 'text-foreground')}>
        PDF<span className="text-primary">Hub</span>
      </span>
      {suffix ? (
        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {suffix}
        </span>
      ) : null}
    </Link>
  )
}
