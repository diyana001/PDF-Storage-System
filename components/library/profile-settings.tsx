'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useMockAuth } from '@/lib/mock-auth'

const preferences = [
  { id: 'new-uploads', label: 'New uploads in categories I follow', defaultChecked: true },
  { id: 'weekly-digest', label: 'Weekly trending documents digest', defaultChecked: true },
  { id: 'product-news', label: 'PDFHub product announcements', defaultChecked: false },
]

export function ProfileSettings() {
  const { user, updateProfile } = useMockAuth()
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  const [organization, setOrganization] = useState(user?.organization ?? '')

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setOrganization(user.organization)
  }, [user])

  if (!user) return null

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setMessage('')
        const formData = new FormData(e.currentTarget)
        updateProfile({
          name: String(formData.get('name') ?? '').trim(),
          organization: String(formData.get('organization') ?? '').trim(),
        })
        setSavedAt(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }))
      }}
      className="flex flex-col gap-6"
    >
      <fieldset className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm">
        <legend className="sr-only">Personal details</legend>
        <h2 className="font-semibold">Personal details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" value={user.email} autoComplete="email" readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" name="organization" value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="e.g. Northwind Group" autoComplete="organization" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={user.role} disabled />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <legend className="sr-only">Email notifications</legend>
        <h2 className="font-semibold">Email notifications</h2>
        {preferences.map((p) => (
          <label key={p.id} className="flex cursor-pointer items-center gap-3 text-sm">
            <Checkbox name={p.id} defaultChecked={p.defaultChecked} />
            {p.label}
          </label>
        ))}
      </fieldset>

      <div className="flex items-center justify-end gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message ? <span role="alert" className="text-destructive">{message}</span> : null}
          {savedAt ? (
            <span className="flex items-center gap-1.5 text-success">
              <Check className="size-4" aria-hidden="true" />
              Saved at {savedAt}
            </span>
          ) : null}
        </p>
        <Button type="button" variant="outline" onClick={() => { setName(user.name); setOrganization(user.organization); setSavedAt(null); setMessage('') }}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
}
