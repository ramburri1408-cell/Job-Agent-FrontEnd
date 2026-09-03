'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface AppSummary {
  id: string; title: string; company: string; fit_score: number; status: string; url: string
}

const COLUMNS = [
  { key: 'scraped',  label: 'Scraped',  color: 'var(--yellow)' },
  { key: 'scored',   label: 'Scored',   color: 'var(--blue)' },
  { key: 'applied',  label: 'Applied',  color: 'var(--green)' },
  { key: 'replied',  label: 'Replied',  color: 'var(--accent)' },
  { key: 'rejected', label: 'Rejected', color: 'var(--red)' },
]

export default function ApplicationsPage() {
  const [pipeline, setPipeline] = useState<Record<string, AppSummary[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<Record<string, AppSummary[]>>('/api/applications')
      .then(setPipeline)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading applications...</div>

  const scoreColor = (score: number) => {
    if (score >= 70) return 'var(--green)'
    if (score >= 50) return 'var(--yellow)'
    return 'var(--red)'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Application Pipeline</h1>
        <p className="page-sub">Track jobs through the agent pipeline</p>
      </div>

      <div className="kanban">
        {COLUMNS.map(col => {
          const items = pipeline[col.key] || []
          return (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-header">
                <span style={{ color: col.color }}>{col.label}</span>
                <span className="kanban-col-count">{items.length}</span>
              </div>
              {items.slice(0, 20).map(item => (
                <div key={item.id} className="kanban-card">
                  <div className="kanban-card-title">{item.title}</div>
                  <div className="kanban-card-company">{item.company}</div>
                  {item.fit_score != null && (
                    <div className="kanban-card-score" style={{ color: scoreColor(item.fit_score) }}>
                      Score: {item.fit_score}
                    </div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: 20 }}>
                  No jobs
                </div>
              )}
              {items.length > 20 && (
                <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: 8 }}>
                  +{items.length - 20} more
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
