import { weeklyDownloads } from '@/lib/data'

export function DownloadsChart() {
  const max = Math.max(...weeklyDownloads.map((d) => d.value))
  const total = weeklyDownloads.reduce((n, d) => n + d.value, 0)

  return (
    <section aria-labelledby="downloads-heading" className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="downloads-heading" className="font-semibold">
            Downloads this week
          </h2>
          <p className="text-sm text-muted-foreground">Daily downloads across all documents</p>
        </div>
        <p className="text-right">
          <span className="block text-2xl font-bold tabular-nums">{total.toLocaleString('en-US')}</span>
          <span className="text-xs font-medium text-success">+12.4% vs last week</span>
        </p>
      </div>
      <ul className="flex h-56 items-end gap-3 sm:gap-5" aria-label="Daily downloads">
        {weeklyDownloads.map((d) => (
          <li key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">{d.value}</span>
            <div
              className="w-full max-w-12 rounded-t-md bg-primary transition-colors hover:bg-primary/80"
              style={{ height: `${(d.value / max) * 80}%` }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-muted-foreground">
              <span className="sr-only">{`${d.value} downloads on `}</span>
              {d.day}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
