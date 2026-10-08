import type { Metadata } from 'next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, members, type Member } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Users' }

const statusStyles: Record<Member['status'], string> = {
  Active: 'bg-success/10 text-success',
  Invited: 'bg-secondary text-primary',
  Suspended: 'bg-destructive/10 text-destructive',
}

export default function AdminUsersPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">{members.length} people have access to PDFHub.</p>
      </div>
      <section aria-label="Users" className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-5">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Downloads</TableHead>
              <TableHead className="pr-5">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs font-semibold">{m.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell>
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', statusStyles[m.status])}>{m.status}</span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{m.downloads}</TableCell>
                <TableCell className="pr-5 text-muted-foreground">{formatDate(m.joined)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
