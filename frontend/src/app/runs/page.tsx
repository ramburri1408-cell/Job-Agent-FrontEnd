'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Run {
  started_at: string; ended_at: string
  total_calls: number; total_cost: number
  stages: Record<string, number>; success: number; failed: number
}

interface CostData {
  by_stage: Record<string, number>
  by_day: Record<string, number>
  total: number
}

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([])
  const [costs, setCosts] = useState<CostData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api<{ runs: Run[] }>('/api/runs').then(d => setRuns(d.runs)),
      api<CostData>('/api/runs/cost').then(setCosts),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading run history...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Run History</h1>
        <p className="page-sub">Agent execution logs and cost tracking</p>
      </div>

      {costs && (
        <div className="stats-grid">
          <div className="card">
            <div className="card-title">Total Cost</div>
            <div className="card-value">${costs.total}</div>
          </div>
          <div className="card">
            <div className="card-title">Total Runs</div>
            <div className="card-value">{runs.length}</div>
          </div>
          <div className="card">
            <div className="card-title">Most Expensive Stage</div>
            <div className="card-value" style={{ fontSize: 16 }}>
              {Object.entries(costs.by_stage)[0]?.[0]?.replace(/_/g, ' ') || '-'}
            </div>
            <div className="card-sub">
              ${Object.entries(costs.by_stage)[0]?.[1] || 0}
            </div>
          </div>
        </div>
      )}

      {costs?.by_stage && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Cost by Stage</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(costs.by_stage).map(([stage, cost]) => (
              <div key={stage} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '8px 14px',
                fontSize: 13,
              }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{stage.replace(/_/g, ' ')}</div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  ${cost}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Recent Runs</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Started</th>
                <th>API Calls</th>
                <th>Success</th>
                <th>Failed</th>
                <th>Cost</th>
                <th>Stages</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    {run.started_at?.slice(0, 19).replace('T', ' ') || '-'}
                  </td>
                  <td>{run.total_calls}</td>
                  <td style={{ color: 'var(--green)' }}>{run.success}</td>
                  <td style={{ color: run.failed > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{run.failed}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${run.total_cost}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {Object.entries(run.stages).map(([s, c]) => `${s}:${c}`).join(', ')}
                  </td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No runs recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
