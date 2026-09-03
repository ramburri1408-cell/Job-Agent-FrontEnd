'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'

interface Job {
  id: string; title: string; company: string; url: string
  fit_score: number; status: string; scraped_at: string; location: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [minScore, setMinScore] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    if (minScore) params.set('min_score', minScore)
    params.set('limit', '100')

    api<{ total: number; jobs: Job[] }>(`/api/jobs?${params}`)
      .then(data => { setJobs(data.jobs); setTotal(data.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, statusFilter, minScore])

  function scoreClass(score: number) {
    if (score >= 70) return 'score score-high'
    if (score >= 50) return 'score score-mid'
    return 'score score-low'
  }

  function statusBadge(status: string) {
    if (status === 'applied') return 'badge badge-applied'
    if (status === 'ai_ready') return 'badge badge-ready'
    if (status === 'new') return 'badge badge-new'
    return 'badge badge-rejected'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Jobs</h1>
        <p className="page-sub">{total} jobs found</p>
      </div>

      <div className="filters">
        <input
          className="filter-input"
          placeholder="Search title or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 250 }}
        />
        <select
          className="filter-input"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="ai_ready">AI Ready</option>
          <option value="applied">Applied</option>
          <option value="skipped_low_score">Skipped (low score)</option>
          <option value="skipped_duplicate">Skipped (duplicate)</option>
        </select>
        <input
          className="filter-input"
          placeholder="Min score..."
          value={minScore}
          onChange={e => setMinScore(e.target.value)}
          style={{ width: 100 }}
          type="number"
        />
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <span className={scoreClass(job.fit_score || 0)}>
                        {job.fit_score ?? '-'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/jobs/${job.id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.company}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{job.location || '-'}</td>
                    <td><span className={statusBadge(job.status)}>{job.status?.replace(/_/g, ' ')}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{job.scraped_at?.slice(0, 10) || '-'}</td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No jobs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
