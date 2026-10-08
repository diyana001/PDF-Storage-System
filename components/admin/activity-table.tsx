import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { activity, type ActivityEntry } from '@/lib/data'
import { cn } from '@/lib/utils'

const actionStyles: Record<ActivityEntry['action'], string> = {
  Uploaded: 'bg-success/10 text-success',
  Downloaded: 'bg-secondary text-primary',
  Updated: 'bg-amber-100 text-amber-800',
  Deleted: 'bg-destructive/10 text-destructive',
}

export function ActivityTable() {
  return (
    <section aria-labelledby="activity-heading" className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between p-5">
        <div>
          <h2 id="activity-heading" className="font-semibold">
            Recent activity
          </h2>
          <p className="text-sm text-muted-foreground">Uploads, downloads and edits across the library</p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="pl-5">User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Document</TableHead>
            <TableHead className="pr-5 text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activity.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="pl-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs font-semibold">{a.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{a.user}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', actionStyles[a.action])}>{a.action}</span>
              </TableCell>
              <TableCell className="max-w-72 truncate text-muted-foreground">{a.documentTitle}</TableCell>
              <TableCell className="pr-5 text-right text-muted-foreground">{a.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
