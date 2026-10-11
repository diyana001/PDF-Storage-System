import type { Metadata } from 'next'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { MetricCards } from '@/components/admin/metric-cards'
import { DownloadsChart } from '@/components/admin/downloads-chart'
import { ActivityTable } from '@/components/admin/activity-table'
import { TopDocuments } from '@/components/admin/top-documents'
import { adminUser } from '@/lib/data'

export const metadata: Metadata = { title: 'Overview' }

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back, {adminUser.name.split(' ')[0]}. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link href="/admin/documents?upload=1" className={buttonVariants({ className: 'h-10 gap-2 px-4' })}>
          <Upload aria-hidden="true" />
          Upload New PDF
        </Link>
      </div>
      <MetricCards />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <DownloadsChart />
        <TopDocuments />
      </div>
      <ActivityTable />
    </div>
  )
}
