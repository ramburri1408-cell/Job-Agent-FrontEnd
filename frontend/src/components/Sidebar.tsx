'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',              label: 'Dashboard',    icon: '📊' },
  { href: '/jobs',          label: 'Jobs',         icon: '💼' },
  { href: '/applications',  label: 'Applications', icon: '📋' },
  { href: '/resume',        label: 'Resume',       icon: '📄' },
  { href: '/runs',          label: 'Runs',         icon: '🔄' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav style={{
      width: 220,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '0 20px 20px',
        borderBottom: '1px solid var(--border)',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          Job Agent
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Autonomous AI Pipeline
        </div>
      </div>

      {NAV.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              background: active ? 'rgba(99,102,241,0.05)' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <span>{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
