'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function ResumePage() {
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<any>('/api/resume').then(setResume).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading resume...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Resume</h1>
        <p className="page-sub">Master resume used for ATS tailoring</p>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Master Resume</div>
        {resume?.raw_text ? (
          <div className="resume-viewer">{resume.raw_text}</div>
        ) : resume ? (
          <div className="resume-viewer">
            {JSON.stringify(resume, null, 2)}
          </div>
        ) : (
          <div className="loading">No resume data found</div>
        )}
      </div>
    </div>
  )
}
