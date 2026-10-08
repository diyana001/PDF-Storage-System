'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const isSignup = mode === 'signup'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-muted-foreground">
          {isSignup ? 'Start downloading and saving documents in seconds.' : 'Sign in to access your library.'}
        </p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          router.push('/library')
        }}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {!isSignup ? (
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            ) : null}
          </div>
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
          {isSignup ? <p className="text-xs text-muted-foreground">At least 8 characters.</p> : null}
        </div>
        <Button type="submit" className="h-11 text-base">
          {isSignup ? 'Create account' : 'Sign in'}
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
