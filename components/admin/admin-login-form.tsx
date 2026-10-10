'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEMO_ADMIN, useMockAuth } from '@/lib/mock-auth'
import { SignInTypeSwitch } from '@/components/auth/sign-in-type-switch'

export function AdminLoginForm({ redirectTo = '/admin' }: { redirectTo?: string }) {
  const router = useRouter()
  const { signInAdmin } = useMockAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const safeRedirect = redirectTo.startsWith('/admin') && redirectTo !== '/admin/login' ? redirectTo : '/admin'

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    const authError = signInAdmin(email, password, remember)
    if (authError) {
      setError(authError)
      setPending(false)
      return
    }
    router.replace(safeRedirect)
    router.refresh()
  }

  function fillDemoAccount() {
    setEmail(DEMO_ADMIN.email)
    setPassword(DEMO_ADMIN.password)
    setError('')
  }

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]">
      <section className="flex min-h-dvh flex-col px-6 py-7 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="PDFHub public portal">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold">PDFHub <span className="font-normal text-muted-foreground">/ Admin</span></span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Public portal
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">
          <SignInTypeSwitch active="admin" />
          <div className="mb-8 flex size-12 items-center justify-center rounded-xl border bg-card text-primary shadow-sm">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <p className="mb-2 text-sm font-semibold text-primary">ADMINISTRATION</p>
          <h1 className="text-3xl font-bold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-2 text-muted-foreground">Manage your document library, members, and publishing settings.</p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-email">Work email</Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="admin@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 bg-card"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">Password</Label>
                <button
                  type="button"
                  onClick={() => setError('Password recovery is not connected in this frontend preview. Use the demo account below.')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-11 bg-card pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-2 flex size-8 items-center justify-center self-center rounded-md text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
              <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(checked === true)} />
              Keep me signed in on this device
            </label>

            {error ? <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">{error}</p> : null}

            <Button type="submit" disabled={pending} className="h-11 text-sm font-semibold">
              {pending ? 'Opening workspace…' : 'Sign in to admin'}
            </Button>
          </form>

          <div className="mt-6 border-t pt-5">
            <Button type="button" variant="outline" onClick={fillDemoAccount} className="h-10 w-full">
              Use demo admin account
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Frontend preview only. Demo credentials are filled locally.</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t pt-4 text-xs text-muted-foreground">
          <span>© 2026 PDFHub</span>
          <span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5" aria-hidden="true" /> Protected admin access</span>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#102b31] text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="absolute inset-0 opacity-25" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(90deg, rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative flex items-center gap-2 text-sm text-white/65"><span className="size-2 rounded-full bg-emerald-400" /> PDFHub CONTROL CENTER</div>
        <div className="relative max-w-lg">
          <p className="mb-4 text-sm font-medium text-emerald-300">ONE PLACE. FULL OVERSIGHT.</p>
          <h2 className="text-4xl font-semibold leading-tight xl:text-5xl">Keep your document library in good order.</h2>
          <p className="mt-5 max-w-md leading-7 text-white/65">Review activity, curate the catalog, and keep member access organized from a dedicated workspace.</p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/55">LIBRARY STATUS</p>
              <p className="mt-2 text-xl font-semibold">All systems ready</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/55">WORKSPACE</p>
              <p className="mt-2 text-xl font-semibold">PDFHub Admin</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-white/45">Administrator access is separate from your reader account.</p>
      </aside>
    </main>
  )
}