import { BarChart3, BookOpen, ClipboardList, GraduationCap, Landmark, Scale } from 'lucide-react'
import type { CategorySlug } from '@/lib/data'

const icons = {
  reports: BarChart3,
  manuals: BookOpen,
  academic: GraduationCap,
  forms: ClipboardList,
  legal: Scale,
  finance: Landmark,
} satisfies Record<CategorySlug, typeof BarChart3>

export const categoryTone: Record<CategorySlug, 'blue' | 'emerald' | 'slate'> = {
  reports: 'blue',
  manuals: 'slate',
  academic: 'blue',
  forms: 'emerald',
  legal: 'slate',
  finance: 'emerald',
}

export const toneClasses = {
  blue: { soft: 'bg-secondary', text: 'text-primary', solid: 'bg-primary' },
  emerald: { soft: 'bg-success/10', text: 'text-success', solid: 'bg-success' },
  slate: { soft: 'bg-muted', text: 'text-foreground', solid: 'bg-foreground' },
} as const

export function CategoryIcon({ slug, className }: { slug: CategorySlug; className?: string }) {
  const Icon = icons[slug]
  return <Icon className={className} aria-hidden="true" />
}
