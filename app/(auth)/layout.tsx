import { FileText, Download, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/logo'

const points = [
  { icon: FileText, text: 'Over 1,200 curated documents across 6 categories' },
  { icon: Download, text: 'Download originals in one click, no watermarks' },
  { icon: ShieldCheck, text: 'Save favorites and keep a history of your files' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</main>
      </div>
      <aside className="relative hidden flex-col justify-end overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
        />
        <div className="relative flex flex-col gap-8">
          <h2 className="text-3xl leading-tight font-bold text-balance">Your trusted library for professional documents.</h2>
          <ul className="flex flex-col gap-4">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <p.icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="text-primary-foreground/90">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
