'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const ACCOUNTS_KEY = 'pdfhub-mock-accounts-v1'
const SESSION_KEY = 'pdfhub-mock-session-v1'
const GOOGLE_DEMO_EMAIL = 'taylor.morgan@gmail.com'

export type MockUser = {
  id: string
  name: string
  email: string
  initials: string
  role: 'Member'
  joined: string
  organization: string
}

type MockAccount = {
  user: MockUser
  salt: string
  passwordHash: string
}

type MockAuthValue = {
  user: MockUser | null
  isReady: boolean
  signUp: (name: string, email: string, password: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signInWithGoogle: () => void
  signOut: () => void
  updateProfile: (profile: Pick<MockUser, 'name' | 'organization'>) => void
}

const MockAuthContext = createContext<MockAuthValue | null>(null)

function readAccounts(): MockAccount[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY)
    const accounts: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(accounts) ? accounts as MockAccount[] : []
  } catch {
    return []
  }
}

function makeInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function createMockUser(name: string, email: string): MockUser {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    initials: makeInitials(name),
    role: 'Member',
    joined: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
    organization: '',
  }
}

function createSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 },
    key,
    256,
  )
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function saveAccounts(accounts: MockAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const activeId = localStorage.getItem(SESSION_KEY)
    const activeAccount = readAccounts().find((account) => account.user.id === activeId)
    setUser(activeAccount?.user ?? null)
    setIsReady(true)
  }, [])

  async function signUp(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const accounts = readAccounts()
    if (accounts.some((account) => account.user.email === normalizedEmail)) {
      return 'An account with this email already exists. Sign in instead.'
    }

    const user = createMockUser(name, normalizedEmail)
    const salt = createSalt()
    const account = { user, salt, passwordHash: await hashPassword(password, salt) }
    saveAccounts([...accounts, account])
    localStorage.setItem(SESSION_KEY, user.id)
    setUser(user)
    return null
  }

  async function signIn(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const account = readAccounts().find((item) => item.user.email === normalizedEmail)
    if (!account || !account.passwordHash) return 'No mock account matches those sign-in details.'

    const passwordHash = await hashPassword(password, account.salt)
    if (passwordHash !== account.passwordHash) return 'No mock account matches those sign-in details.'

    localStorage.setItem(SESSION_KEY, account.user.id)
    setUser(account.user)
    return null
  }

  function signInWithGoogle() {
    const accounts = readAccounts()
    const existing = accounts.find((account) => account.user.email === GOOGLE_DEMO_EMAIL)
    const account = existing ?? {
      user: createMockUser('Taylor Morgan', GOOGLE_DEMO_EMAIL),
      salt: '',
      passwordHash: '',
    }

    if (!existing) saveAccounts([...accounts, account])
    localStorage.setItem(SESSION_KEY, account.user.id)
    setUser(account.user)
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  function updateProfile(profile: Pick<MockUser, 'name' | 'organization'>) {
    if (!user) return
    const updatedUser = {
      ...user,
      name: profile.name.trim(),
      initials: makeInitials(profile.name),
      organization: profile.organization.trim(),
    }
    saveAccounts(readAccounts().map((account) => account.user.id === user.id ? { ...account, user: updatedUser } : account))
    setUser(updatedUser)
  }

  return (
    <MockAuthContext.Provider value={{ user, isReady, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (!context) throw new Error('useMockAuth must be used inside MockAuthProvider.')
  return context
}