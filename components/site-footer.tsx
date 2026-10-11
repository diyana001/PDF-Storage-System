'use client'

import { useState } from 'react'
import Link from 'next/link'

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.8v-7.6h-2.8m1.4-4.5a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  )
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  )
}

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="mt-16 bg-[#1f2429] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: EgoTECH & Info */}
          <div className="lg:col-span-5">
            <h3 className="text-xl font-bold tracking-tight text-white">EgoTECH</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
              Operated by EGOTECHWORLD (PVT) LTD. We are a registered IT company based in Sri Lanka,
              dedicated to providing fast-track full-stack web development courses and empowering software engineers globally.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/browse?q=Remote+Jobs" className="text-gray-400 transition-colors hover:text-white">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/browse?q=Internships" className="text-gray-400 transition-colors hover:text-white">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/browse?q=Source+Code" className="text-gray-400 transition-colors hover:text-white">
                  Source Code
                </Link>
              </li>
              <li>
                <Link href="/browse?q=Courses" className="text-gray-400 transition-colors hover:text-white">
                  Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-semibold text-white">Legal & Support</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Updated */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-semibold text-white">Stay Updated</h4>
            <p className="mt-4 text-sm text-gray-400">
              Subscribe for the latest tech jobs and career resources.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                aria-label="Email address"
                className="h-10 w-full min-w-0 rounded border border-gray-700/80 bg-[#161a1f] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded bg-[#f59e0b] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#d97706] active:bg-[#b45309]"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Divider line */}
        <div className="mt-12 border-t border-gray-800" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">
            © 2026 EGOTECHWORLD (PVT) LTD. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-white"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="transition-colors hover:text-white"
            >
              <YouTubeIcon className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-white"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
