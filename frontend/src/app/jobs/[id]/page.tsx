'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useParams } from 'next/navigation'

export default function JobDetailPage() {
  const params = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      api<any>(`/api/jobs/${params.id}`)
        .then(setJob)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [params.id])

  if (loading) return <div className="loading">Loading job details...</div>
  if (!job) return <div className="loading">Job not found</div>

  const scoreColor = (job.fit_score || 0) >= 70 ? 'var(--green)' : (job.fit_score || 0) >= 50 ? 'var(--yellow)' : 'var(--red)'

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{job.title}</h1>
        <p className="page-sub">{job.company} {job.location ? `- ${job.location}` : ''}</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card">
          <div className="card-title">Fit Score</div>
          <div className="card-value" style={{ color: scoreColor }}>{job.fit_score ?? '-'}</div>
        </div>
        <div className="card">
          <div className="card-title">Status</div>
          <div className="card-value" style={{ fontSize: 18 }}>{(job.status || '').replace(/_/g, ' ')}</div>
        </div>
        <div className="card">
          <div className="card-title">Source</div>
          <div className="card-value" style={{ fontSize: 18 }}>{job.source || '-'}</div>
        </div>
        <div className="card">
          <div className="card-title">Scraped</div>
          <div className="card-value" style={{ fontSize: 16 }}>{job.scraped_at?.slice(0, 10) || '-'}</div>
        </div>
      </div>

      {job.url && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Job URL</div>
          <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: 14, wordBreak: 'break-all' }}>{job.url}</a>
        </div>
      )}

      {job.description && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Job Description</div>
          <div className="resume-viewer">{job.description}</div>
        </div>
      )}

      {job.gap_analysis && Object.keys(job.gap_analysis).length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Gap Analysis</div>
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            {Object.entries(job.gap_analysis).map(([key, val]: [string, any]) => (
              <div key={key} style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>{key}:</span>
                <span>{typeof val === 'string' ? val : JSON.stringify(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {job.tailored_resume && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>ATS Tailored Resume</div>
          <div className="resume-viewer">{job.tailored_resume}</div>
        </div>
      )}

      {job.email_draft && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 8 }}>Email Draft</div>
          <div className="resume-viewer">{job.email_draft}</div>
        </div>
      )}
    </div>
  )
}
