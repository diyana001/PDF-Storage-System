import { cn } from '@/lib/utils'
import { getCategory, type PdfDocument } from '@/lib/data'
import { CategoryIcon, categoryTone, toneClasses } from '@/components/category-icon'

export function DocThumbnail({
  doc,
  size = 'md',
  className,
}: {
  doc: Pick<PdfDocument, 'title' | 'category' | 'author' | 'pages'>
  size?: 'xs' | 'md' | 'lg'
  className?: string
}) {
  const tone = toneClasses[categoryTone[doc.category]]

  if (size === 'xs') {
    return (
      <div
        className={cn(
          'relative flex h-12 w-9 shrink-0 flex-col overflow-hidden rounded-md border bg-card shadow-sm',
          className,
        )}
        aria-hidden="true"
      >
        <div className={cn('h-1.5 w-full', tone.solid)} />
        <div className="flex flex-1 flex-col gap-0.5 p-1">
          <div className="h-0.5 w-4/5 rounded bg-foreground/40" />
          <div className="h-0.5 w-full rounded bg-border" />
          <div className="h-0.5 w-full rounded bg-border" />
          <div className="h-0.5 w-2/3 rounded bg-border" />
        </div>
        <span className="absolute right-0.5 bottom-0.5 rounded-sm bg-destructive px-0.5 text-[6px] leading-tight font-bold text-white">
          PDF
        </span>
      </div>
    )
  }

  const large = size === 'lg'

  return (
    <div
      className={cn(
        'relative flex aspect-[4/3] items-center justify-center overflow-hidden',
        tone.soft,
        large && 'aspect-[3/4] rounded-xl',
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          'relative flex aspect-[3/4] flex-col overflow-hidden rounded-md bg-card shadow-md ring-1 ring-foreground/5',
          large ? 'w-3/4' : 'h-[82%] translate-y-[12%]',
        )}
      >
        <div className={cn('w-full', tone.solid, large ? 'h-3' : 'h-1.5')} />
        <div className={cn('flex flex-1 flex-col', large ? 'gap-3 p-6' : 'gap-1.5 p-3')}>
          <div className="flex items-center gap-1.5">
            <CategoryIcon slug={doc.category} className={cn(tone.text, large ? 'size-5' : 'size-3')} />
            <span
              className={cn(
                'font-semibold tracking-wide uppercase',
                tone.text,
                large ? 'text-xs' : 'text-[7px]',
              )}
            >
              {getCategory(doc.category).name}
            </span>
          </div>
          <p
            className={cn(
              'line-clamp-3 font-bold text-pretty text-foreground',
              large ? 'text-xl leading-snug' : 'text-[9px] leading-tight',
            )}
          >
            {doc.title}
          </p>
          <div className={cn('flex flex-col', large ? 'mt-2 gap-2' : 'mt-0.5 gap-1')}>
            {[100, 92, 96, 70, 88, 60].map((w, i) => (
              <div
                key={i}
                className={cn('rounded-full bg-border', large ? 'h-1.5' : 'h-[3px]')}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          {large ? (
            <p className="mt-auto text-xs text-muted-foreground">
              {doc.author} · {doc.pages} pages
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            'absolute rounded bg-destructive font-bold text-white',
            large ? 'right-3 bottom-3 px-1.5 py-0.5 text-xs' : 'right-1.5 bottom-1.5 px-1 text-[7px]',
          )}
        >
          PDF
        </span>
      </div>
    </div>
  )
}
