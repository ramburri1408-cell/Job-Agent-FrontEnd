'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Stats {
  total_jobs: number
  by_status: Record<string, number>
  unique_companies: number
  avg_fit_score: number
  max_fit_score: number
  total_emails_sent: number
  total_api_cost: number
  total_api_calls: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<Stats>('/api/stats').then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (!stats) return <div className="loading">Failed to load stats</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Your autonomous job search agent at a glance</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Jobs Scraped" value={stats.total_jobs} />
        <StatCard label="Unique Companies" value={stats.unique_companies} />
        <StatCard label="Avg Fit Score" value={stats.avg_fit_score} sub={`Best: ${stats.max_fit_score}`} />
        <StatCard label="Emails Sent" value={stats.total_emails_sent} />
        <StatCard label="API Cost" value={`$${stats.total_api_cost}`} sub={`${stats.total_api_calls} calls`} />
        <StatCard label="Applied" value={stats.by_status?.applied ?? 0} color="var(--green)" />
        <StatCard label="AI Ready" value={stats.by_status?.ai_ready ?? 0} color="var(--blue)" />
        <StatCard label="Skipped" value={
          (stats.by_status?.skipped_low_score ?? 0) +
          (stats.by_status?.skipped_duplicate ?? 0) +
          (stats.by_status?.skipped_irrelevant ?? 0)
        } color="var(--red)" />
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Status Breakdown</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(stats.by_status).map(([status, count]) => (
            <div key={status} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '8px 14px',
              fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-muted)' }}>{status.replace(/_/g, ' ')}</span>
              <span style={{ marginLeft: 8, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="card">
      <div className="card-title">{label}</div>
      <div className="card-value" style={{ color: color || 'var(--text-primary)' }}>{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  )
}
