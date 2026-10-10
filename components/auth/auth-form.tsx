'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMockAuth } from '@/lib/mock-auth'
import { SignInTypeSwitch } from '@/components/auth/sign-in-type-switch'

export function AuthForm({ mode, redirectTo = '/' }: { mode: 'login' | 'signup'; redirectTo?: string }) {
  const router = useRouter()
  const { signUp, signIn, signInWithGoogle } = useMockAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const isSignup = mode === 'signup'
  const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.includes('\\') ? redirectTo : '/'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    setPending(true)
    try {
      let authError: string | null
      if (isSignup) {
        const name = String(form.get('name') ?? '').trim()
        authError = await signUp(name, email, password)
      } else {
        authError = await signIn(email, password)
      }

      if (authError) {
        setError(authError)
        return
      }
      router.replace(safeRedirect)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not complete that request. Please try again.')
    } finally {
      setPending(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    setNotice('')
    setPending(true)
    try {
      signInWithGoogle()
      router.replace(safeRedirect)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Google demo sign-in failed. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {!isSignup ? <SignInTypeSwitch active="user" /> : null}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-muted-foreground">
          {isSignup ? 'Start downloading and saving documents in seconds.' : 'Sign in to access your library.'}
        </p>
      </div>
      <Button type="button" variant="outline" className="h-11" onClick={handleGoogleSignIn} disabled={pending}>
        {isSignup ? 'Sign up with Google' : 'Continue with Google'}
      </Button>
      <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span>OR USE EMAIL</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        {isSignup ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" autoComplete="name" required className="h-11" />
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={8}
              required
              className="h-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {isSignup ? <p className="text-xs text-muted-foreground">Use at least 8 characters.</p> : null}
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        {notice ? <p role="status" className="text-sm text-success">{notice}</p> : null}
        <Button type="submit" className="h-11 text-base" disabled={pending}>
          {pending ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <Link href={isSignup ? '/login' : '/signup'} className="font-medium text-primary hover:underline">
          {isSignup ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </div>
  )
}
