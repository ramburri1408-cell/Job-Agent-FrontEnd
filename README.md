# Job Agent Dashboard

Frontend portal for the [Autonomous Job Search Agent](https://github.com/ramburri1408-cell/job-agent). View scraped jobs, track applications through the pipeline, inspect ATS-tailored resumes, and monitor agent run costs.

## Pages

**Dashboard** - Overview stats: total jobs scraped, average fit score, API cost, emails sent, status breakdown

**Jobs** - Filterable table of all scraped jobs with fit score badges. Search by title or company, filter by status or minimum score. Click any job for full detail including job description, gap analysis, ATS-tailored resume, and email draft

**Applications** - Kanban board tracking jobs through the pipeline: Scraped → Scored → Applied → Replied → Rejected

**Resume** - View the master resume used for ATS tailoring

**Runs** - Agent execution history with cost breakdown by stage and by day. See which stages are most expensive and which fail most often

## Setup

```bash
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Run:
```bash
npm run dev
```

Open http://localhost:3000

## Requires

The [Job Agent Backend API](https://github.com/ramburri1408-cell/job-agent) running and serving data. The dashboard reads from the agent's data files through the API layer.

```bash
# Start the backend first
cd job-agent-api/backend
set AGENT_DATA_PATH=path/to/job-agent/data
uvicorn app.main:app --reload --port 8001
```

## Stack

- Next.js 14 (App Router)
- TypeScript
- CSS (no framework, custom dark theme)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard overview
│   ├── layout.tsx            # App shell with sidebar
│   ├── globals.css           # Dark theme design system
│   ├── jobs/
│   │   ├── page.tsx          # Jobs table with filters
│   │   └── [id]/page.tsx     # Single job detail + ATS resume
│   ├── applications/
│   │   └── page.tsx          # Kanban pipeline board
│   ├── resume/
│   │   └── page.tsx          # Master resume viewer
│   └── runs/
│       └── page.tsx          # Run history + cost tracking
├── components/
│   └── Sidebar.tsx           # Navigation sidebar
└── lib/
    └── api.ts                # API client helper
```

## API Endpoints Consumed

| Endpoint | Page |
|----------|------|
| GET /api/stats | Dashboard |
| GET /api/jobs | Jobs list |
| GET /api/jobs/:id | Job detail |
| GET /api/applications | Kanban board |
| GET /api/resume | Resume viewer |
| GET /api/runs | Run history |
| GET /api/runs/cost | Cost breakdown |
