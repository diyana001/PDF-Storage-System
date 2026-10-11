'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const toggles = [
  { id: 'public-browse', label: 'Allow guests to browse the catalog', defaultChecked: true },
  { id: 'guest-download', label: 'Allow guests to download without an account', defaultChecked: false },
  { id: 'moderation', label: 'Require review before new uploads go live', defaultChecked: true },
]

export function AdminSettingsForm() {
  const [saved, setSaved] = useState(false)

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        setSaved(true)
      }}
      onChange={() => setSaved(false)}
    >
      <fieldset className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm">
        <legend className="sr-only">General</legend>
        <h2 className="font-semibold">General</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="site-name">Library name</Label>
          <Input id="site-name" name="siteName" defaultValue="PDFHub" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="max-size">Max upload size (MB)</Label>
          <Input id="max-size" name="maxSize" type="number" min={1} max={500} defaultValue={50} className="w-32" />
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <legend className="sr-only">Access</legend>
        <h2 className="font-semibold">Access</h2>
        {toggles.map((t) => (
          <label key={t.id} className="flex cursor-pointer items-center gap-3 text-sm">
            <Checkbox name={t.id} defaultChecked={t.defaultChecked} />
            {t.label}
          </label>
        ))}
      </fieldset>
      <div className="flex items-center justify-end gap-3">
        <p aria-live="polite" className="text-sm">
          {saved ? (
            <span className="flex items-center gap-1.5 text-success">
              <Check className="size-4" aria-hidden="true" /> Settings saved
            </span>
          ) : null}
        </p>
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  )
}
