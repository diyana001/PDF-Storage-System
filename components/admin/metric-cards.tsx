import { Download, FileText, HardDrive, TrendingUp, Users } from 'lucide-react'
import { categories } from '@/lib/data'

const totalDocs = categories.reduce((n, c) => n + c.count, 0)

const metrics = [
  { label: 'Total Documents', value: totalDocs.toLocaleString('en-US'), change: '+38 this week', icon: FileText, tone: 'bg-secondary text-primary' },
  { label: 'Total Users', value: '8,492', change: '+124 this week', icon: Users, tone: 'bg-success/10 text-success' },
  { label: 'Total Downloads', value: '214.6K', change: '+12.4% vs last week', icon: Download, tone: 'bg-secondary text-primary' },
  { label: 'Storage Used', value: '68.2 GB', change: 'of 100 GB', icon: HardDrive, tone: 'bg-success/10 text-success', progress: 68 },
]

export function MetricCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <li key={m.label} className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
            <span className={`flex size-9 items-center justify-center rounded-lg ${m.tone}`}>
              <m.icon className="size-4.5" aria-hidden="true" />
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight tabular-nums">{m.value}</p>
          {m.progress !== undefined ? (
            <div className="flex flex-col gap-1.5">
              <div
                className="h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={m.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Storage used"
              >
                <div className="h-full rounded-full bg-success" style={{ width: `${m.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{m.change}</p>
            </div>
          ) : (
            <p className="flex items-center gap-1 text-xs font-medium text-success">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              {m.change}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
