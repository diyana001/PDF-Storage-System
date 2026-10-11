import Link from 'next/link'

export function SignInTypeSwitch({ active }: { active: 'user' | 'admin' }) {
  return (
    <nav aria-label="Sign-in type" className="grid grid-cols-2 rounded-lg border bg-muted/50 p-1">
      <Link
        href="/login"
        aria-current={active === 'user' ? 'page' : undefined}
        className={`rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${active === 'user' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        User Sign In
      </Link>
      <Link
        href="/admin/login"
        aria-current={active === 'admin' ? 'page' : undefined}
        className={`rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${active === 'admin' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Admin Sign In
      </Link>
    </nav>
  )
}