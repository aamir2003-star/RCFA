# 🛡️ Conflict Resolver — RCFA

> **Requirement Conflict & Feasibility Analyzer**
> An AI-powered SaaS platform that detects, analyzes, and resolves conflicts between software project requirements — before a single line of production code is written.

---

## 🧠 Project Overview

**Conflict Resolver** is a collaborative web application that helps software teams catch requirement contradictions early — before they become expensive mid-sprint blockers.

### The Problem
In most software projects, stakeholders write requirements in isolation:
- Legal demands **AES-256 encryption** (increases processing overhead)
- Developer demands **sub-1-second load times** (needs minimal overhead)
- PM demands **10,000 concurrent users** (needs massive infrastructure)
- Finance caps **infrastructure budget at $500/month** (conflicts with scale)

These contradictions are never caught until the project is mid-flight — causing rework, delays, and budget overruns.

### The Solution — 5-Step Pipeline
```
1. INGEST     →  Upload requirements via CSV or manual entry
2. CLASSIFY   →  Auto-categorize: Functional / Performance / Security / Cost / Scalability
3. DETECT     →  Rule-based + Gemini AI semantic conflict detection
4. RESOLVE    →  Threaded discussion + weighted stakeholder voting
5. REPORT     →  PDF reports + BPMN diagrams for documentation
```

### Key Metrics
| Metric | Target |
|---|---|
| Conflict detection accuracy | ≥ 90% |
| Analysis time (50 requirements) | < 2 minutes |
| System uptime | 99% monthly |
| New-user time-to-first-conflict | ≤ 5 minutes |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | Component-based UI |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling + dark mode |
| shadcn/ui | Latest | Accessible pre-built components |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP API client |
| Socket.io-client | 4.x | Real-time activity feed |
| React Hook Form | 7.x | Form state management |
| Papa Parse | 5.x | CSV parsing on the client |
|zustand | latest | state management|

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express.js | 4.x | REST API framework |
| MongoDB Atlas | 7.x | Database (cloud-hosted) |
| Mongoose | 8.x | ODM for MongoDB |
| Socket.io | 4.x | Real-time events server |
| Google Gemini API | gemini-pro | AI semantic conflict analysis |
| JWT | jsonwebtoken | Authentication tokens |
| Passport.js | 0.7.x | Google OAuth 2.0 |
| bcrypt | 5.x | Password hashing |
| Multer | 1.x | CSV file upload handling |
| PDFKit | 0.15.x | PDF report generation |
| Zod | 3.x | Request validation |

---

## 📁 Repository Structure

```
conflict-resolver/
├── frontend/                   # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/             # Shared UI primitives (Button, Input, Badge…)
│   │   │   ├── layout/         # Sidebar, TopHeader, Breadcrumb, PageWrapper
│   │   │   ├── dashboard/      # ProjectCard, StatsBar
│   │   │   ├── requirements/   # RequirementTable, CSVUploader, TagInput…
│   │   │   ├── conflicts/      # ConflictCard, VotingPanel, DiscussionThread…
│   │   │   ├── timeline/       # TimelineEvent, TimelineFilter
│   │   │   └── team/           # TeamTable, InviteMemberModal, RoleMatrix
│   │   ├── pages/              # One file per screen (8 total)
│   │   ├── hooks/              # useAuth, useConflicts, useSocket…
│   │   ├── context/            # AuthContext, ThemeContext, SocketContext
│   │   ├── services/           # Axios API call wrappers per domain
│   │   ├── utils/              # csvParser, severityColors, formatDate…
│   │   ├── styles/             # globals.css
│   │   ├── router/             # AppRouter, ProtectedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/                    # Node.js + Express API
    ├── src/
    │   ├── config/             # db.js, passport.js, socket.js, gemini.js
    │   ├── models/             # Mongoose models (6 collections)
    │   ├── controllers/        # Route handler functions
    │   ├── routes/             # Express routers per domain
    │   ├── middleware/         # authenticate, authorize, errorHandler…
    │   ├── services/           # Business logic per domain
    │   ├── engine/             # 7-step conflict detection pipeline
    │   │   └── rules/          # One file per conflict rule type
    │   ├── sockets/            # Socket.io event handlers
    │   ├── jobs/               # Background tasks (scan, report gen)
    │   ├── utils/              # jwtHelper, pdfGenerator, apiResponse…
    │   ├── validations/        # Zod schemas per route
    │   ├── app.js              # Express app init
    │   └── server.js           # HTTP + Socket.io server
    ├── tests/
    ├── uploads/                # Temp CSV storage (gitignored)
    ├── .env.example
    ├── package.json
    └── Dockerfile
```

---

## 👥 Team & Roles

| Dev | Name | Side | Responsibility | Screens Owned |
|---|---|---|---|---|
| **Dev 1** | Dhruv mochi | Frontend | Auth flows + global layout system | Screen 1 — Auth Page |
| **Dev 2** | Pratik | Frontend | Project dashboard + workspace | Screen 2 — Dashboard, Screen 3 — Workspace |
| **Dev 3** | Ansh and also vaishnavi| Frontend | Conflict UI + requirement editor | Screen 4 — Editor, Screen 5 — Conflict Detection, Screen 7 — Resolution |
| **Dev 4** | Shubham | Frontend | Timeline + team management | Screen 6 — Activity Timeline, Screen 8 — Team Panel |
| **Dev 5** | Dhruv patel | Backend | Auth API + all CRUD API routes | All REST endpoints |
| **Dev 6** | Aamir | Backend | AI conflict engine + Gemini integration | Detection pipeline |
| **Dev 7** | Feneel| Backend | Real-time events + PDF report generation | Socket.io, Reports |

> **Note:** Dev 5's work is the critical path. Frontend developers should pull the OpenAPI spec from `develop` early and mock API responses locally while the real backend is being built.

---

## 🌿 Branch Strategy

### Core Branches (permanent, protected)

| Branch | Purpose | Who Merges |
|---|---|---|
| `main` | Production-ready code only. Never commit directly. | Team lead via PR |
| `develop` | Integration branch. All feature branches merge here first. | All via PR |
| `release/v1.0` | Staging branch cut from `develop` before deployment. Bug fixes only. | Team lead |
| `hotfix/<issue-id>` | Emergency production fixes. Merges into both `main` AND `develop`. | On-call dev |

### Feature Branches

#### Frontend — 4 Developers

| Branch | Owner | What It Contains |
|---|---|---|
| `feat/fe-auth` | Dev 1 | Login page, Google OAuth button, signup tab, forgot password flow, JWT storage in `useAuth` hook, `ProtectedRoute` component |
| `feat/fe-layout` | Dev 1 | `Sidebar.jsx`, `TopHeader.jsx`, `Breadcrumb.jsx`, `PageWrapper.jsx`, dark mode toggle via `ThemeContext`, responsive mobile header |
| `feat/fe-dashboard` | Dev 2 | `DashboardPage.jsx`, `ProjectCard.jsx`, `StatsBar.jsx`, create project modal, global search bar, project grid layout |
| `feat/fe-workspace` | Dev 2 | `WorkspacePage.jsx`, `RequirementTable.jsx`, `RequirementRow.jsx`, `FilterToolbar.jsx`, `CSVUploader.jsx`, pagination, conflict count badge in sidebar |
| `feat/fe-conflict-ui` | Dev 3 | `ConflictDetectionPage.jsx`, `ConflictResolutionPage.jsx`, `ConflictCard.jsx`, `AIResolutionBox.jsx`, `VotingPanel.jsx`, `DiscussionThread.jsx`, `CommentComposer.jsx`, `AuditTrail.jsx`, `ImpactList.jsx` |
| `feat/fe-req-editor` | Dev 3 | `RequirementEditorPage.jsx`, `TagInput.jsx`, `DependencyLinker.jsx`, `ConflictPreviewPanel.jsx` (live scan as user types), rich text toolbar |
| `feat/fe-timeline` | Dev 4 | `ActivityTimelinePage.jsx`, `TimelineEvent.jsx`, `TimelineFilter.jsx`, date-grouped feed, real-time Socket.io updates via `useActivityFeed` hook |
| `feat/fe-team-panel` | Dev 4 | `TeamManagementPage.jsx`, `TeamTable.jsx`, `MemberRow.jsx`, `InviteMemberModal.jsx`, `RolePermissionsMatrix.jsx`, status badges |

#### Backend — 3 Developers

| Branch | Owner | What It Contains |
|---|---|---|
| `feat/be-auth-api` | Dev 5 | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/google`, JWT refresh endpoint, password reset endpoint, `authenticate.js` middleware, `authorize.js` RBAC guard |
| `feat/be-projects-api` | Dev 5 | Projects CRUD, Requirements CRUD, CSV upload route (Multer), Votes routes, Team management routes, Comments routes — all with Zod validation and RBAC |
| `feat/be-conflict-engine` | Dev 6 | `conflictDetector.js` orchestrator, `requirementParser.js`, `requirementClassifier.js`, `pairGenerator.js`, `ruleEngine.js` + all 4 rule files, `severityScorer.js`, `feasibilityEstimator.js`, unit tests |
| `feat/be-gemini-integration` | Dev 6 | `gemini.js` config, `geminiAnalyzer.js` with prompt engineering, response parsing, retry logic (3 attempts, exponential backoff), confidence score extraction |
| `feat/be-socket-events` | Dev 7 | `socketHandler.js`, `conflictEvents.js` (new conflict detected), `activityEvents.js` (broadcast to project room), `voteEvents.js` (live tally updates), room management (join/leave project) |
| `feat/be-reports-api` | Dev 7 | `GET /api/v1/reports/:projectId` generate PDF, `pdfGenerator.js` (PDFKit), conflict summary layout, feasibility tables, activity log export as CSV |

#### Shared / Infrastructure

| Branch | Owner | What It Contains |
|---|---|---|
| `chore/db-schema` | Dev 5 | MongoDB Atlas cluster setup, all 6 Mongoose models with indexes, seed script with sample data (Project Alpha + 5 requirements + 2 conflicts) |
| `chore/ci-cd` | Team Lead | GitHub Actions workflow (lint → test → build → deploy), Dockerfile for backend, Vercel config for frontend, `.env.example` files |
| `test/unit-integration` | Dev 6 + Dev 7 | Jest config, conflict engine unit tests, Express route integration tests with supertest, mock Gemini API responses |

---

## ✅ What Needs to Be Done

### Frontend Tasks — 4 Developers

---

#### Dev 1 — Auth & Layout  `feat/fe-auth` `feat/fe-layout`

**feat/fe-auth**
- [ ] Build `AuthPage.jsx` matching the Stitch prototype (split-screen layout)
- [ ] Implement left branding panel (hidden on mobile)
- [ ] Build Login / Sign Up tab switcher (no page reload)
- [ ] Wire up `Google OAuth` button → redirect to `/api/v1/auth/google`
- [ ] Build email + password form with validation (React Hook Form + Zod)
- [ ] Add show/hide password toggle (eye icon)
- [ ] Implement "Remember me for 30 days" checkbox → long-lived refresh token
- [ ] Build "Forgot password?" flow (modal → API call → success state)
- [ ] Store JWT in `httpOnly` cookie (not localStorage)
- [ ] Create `useAuth` hook: `login()`, `logout()`, `register()`, `user` state
- [ ] Create `AuthContext` to wrap the whole app
- [ ] Build `ProtectedRoute` component — redirect to `/login` if unauthenticated
- [ ] Build Sign Up tab with name, email, password, confirm password fields
- [ ] Handle API error states (wrong password, duplicate email)
- [ ] Add mobile header (logo + "Need Help?" button, visible only below lg)

**feat/fe-layout**
- [ ] Build `Sidebar.jsx` — logo, nav links with icons, active state highlighting, conflict count badge, "Upgrade Now" CTA, user profile section at bottom
- [ ] Build `TopHeader.jsx` — search bar, notification bell with unread dot, user avatar
- [ ] Build `Breadcrumb.jsx` — dynamic path from React Router
- [ ] Build `PageWrapper.jsx` — consistent page padding and max-width
- [ ] Implement dark mode toggle → persist choice in `ThemeContext` → `localStorage`
- [ ] Ensure all layout components are fully responsive (mobile sidebar collapses to hamburger)
- [ ] Add notification dropdown (bell click → list of recent alerts)
- [ ] Create shared UI primitives: `Button`, `Input`, `Badge`, `Modal`, `Dropdown`, `Avatar`, `Tooltip`, `Tabs` in `src/components/ui/`

---

#### Dev 2 — Dashboard & Workspace  `feat/fe-dashboard` `feat/fe-workspace`

**feat/fe-dashboard**
- [ ] Build `DashboardPage.jsx` — full page layout with sidebar and header
- [ ] Build `ProjectCard.jsx` — name, description, stats (total/conflicts/resolved), team avatars, last-updated timestamp, 3-dot options menu
- [ ] Build `StatsBar.jsx` — summary numbers at top of dashboard
- [ ] Implement "New Project" modal — name, description, stakeholder invite fields
- [ ] Wire up `POST /api/v1/projects` to create project
- [ ] Wire up `GET /api/v1/projects` to fetch all user projects
- [ ] Implement global search bar — filter project cards in real time
- [ ] Add "Create New Project" CTA card at end of grid
- [ ] Handle empty state (no projects yet)
- [ ] Implement project card options menu — Edit, Archive, Delete with confirmation modal

**feat/fe-workspace**
- [ ] Build `WorkspacePage.jsx` — project detail page with sidebar showing conflict badge
- [ ] Build `RequirementTable.jsx` — sortable columns (Title, Priority, Status, Last Updated, Actions)
- [ ] Build `RequirementRow.jsx` — priority badge (HIGH/MEDIUM/LOW), status badge (CONFLICTED/IN PROGRESS/RESOLVED), action buttons
- [ ] Build `FilterToolbar.jsx` — Priority, Status, Assignee dropdowns + Clear Filters link + result count
- [ ] Build `CSVUploader.jsx` — drag-and-drop zone + browse button, Papa Parse client-side validation, preview before upload, progress indicator
- [ ] Wire up `POST /api/v1/requirements/upload` for CSV import
- [ ] Wire up `GET /api/v1/requirements?projectId=` for fetching requirements
- [ ] Wire up `DELETE /api/v1/requirements/:id`
- [ ] Implement pagination (12 per page, page number links)
- [ ] Add "Run Conflict Analysis" button → `POST /api/v1/conflicts/analyze/:projectId` → show loading state → redirect to Conflicts tab when done
- [ ] Listen to Socket.io `conflict:new` event — auto-update sidebar badge without page reload

---

#### Dev 3 — Conflict UI & Requirement Editor  `feat/fe-conflict-ui` `feat/fe-req-editor`

**feat/fe-conflict-ui**
- [ ] Build `ConflictDetectionPage.jsx` — list of all conflicts for a project with severity filter
- [ ] Build `ConflictCard.jsx` — conflict ID, type, severity score (color-coded), AI confidence %, "View Details" link
- [ ] Build `ConflictResolutionPage.jsx` — Conflict #124-style detail page
- [ ] Build side-by-side requirement comparison panel — Req A (with metadata + vote count) vs Req B
- [ ] Build `AIResolutionBox.jsx` — display AI proposal with reasoning text
- [ ] Wire up Accept, Edit Manually, Discuss in Thread action buttons
- [ ] Build `VotingPanel.jsx` — Support / Object buttons, live vote tally (8 supported · 0 opposed)
- [ ] Build `DiscussionThread.jsx` — threaded comments with author avatar, role, timestamp, upvote button
- [ ] Build `CommentComposer.jsx` — text area, attachment icon, @mention icon, emoji picker, Post Comment button
- [ ] Build `AuditTrail.jsx` — chronological log of all changes to the conflict
- [ ] Build Resolution Proposals tab — list of proposals with active vote state
- [ ] Wire up all APIs: `GET /api/v1/conflicts/:id`, `POST /api/v1/votes`, `POST /api/v1/comments`, `PATCH /api/v1/conflicts/:id/resolve`
- [ ] Build `ImpactList.jsx` — affected downstream modules with impact level badges
- [ ] Listen to Socket.io `vote:update` → live update tally without refresh

**feat/fe-req-editor**
- [ ] Build `RequirementEditorPage.jsx` — full editor form with back navigation
- [ ] Build title input, priority dropdown (Low / Medium / High / Critical)
- [ ] Build `TagInput.jsx` — chip-style tags, add new tag on Enter, remove via × button
- [ ] Build rich text description area — Bold, Italic, Bullet List, Link, Code toolbar buttons (use `@tiptap/react` or `react-quill`)
- [ ] Build `DependencyLinker.jsx` — search + select other requirements, show relationship (Blocks / Prerequisite), unlink button
- [ ] Build `ConflictPreviewPanel.jsx` — right-side panel that calls `POST /api/v1/requirements/preview-conflicts` as user types (debounced 800ms), shows warning if match found
- [ ] Show metadata section — Created by, Version, Complexity
- [ ] Wire up `POST /api/v1/requirements` (create) and `PUT /api/v1/requirements/:id` (update)
- [ ] Validate all fields before save — show inline errors
- [ ] Handle Cancel with unsaved changes warning modal

---

#### Dev 4 — Timeline & Team  `feat/fe-timeline` `feat/fe-team-panel`

**feat/fe-timeline**
- [ ] Build `ActivityTimelinePage.jsx` — full-page chronological feed
- [ ] Build `TimelineEvent.jsx` — user avatar, name, role, action type icon (check_circle / warning / edit / add), event description, timestamp, View Details + Comment links
- [ ] Build `TimelineFilter.jsx` — tab filters (All / Requirement Updates / Conflict Alerts / Resolution Actions) + date range dropdown
- [ ] Group events by date ("Today, Oct 24" / "Yesterday, Oct 23")
- [ ] Show inline "Resolve Now" + "Ignore" buttons on conflict alert events
- [ ] Wire up `GET /api/v1/timeline?projectId=&type=&from=&to=`
- [ ] Subscribe to Socket.io `activity:new` event — prepend new events in real time at the top of the feed
- [ ] Build "Add Note" modal — free-text note entry → `POST /api/v1/timeline/notes`
- [ ] Build "Export Log" button → download as CSV via `GET /api/v1/timeline/export`
- [ ] Handle "View Older Activity" load-more pagination

**feat/fe-team-panel**
- [ ] Build `TeamManagementPage.jsx` — full team management screen
- [ ] Build `TeamTable.jsx` — columns: Member (avatar + name + email), Role, Status, Projects count, Actions
- [ ] Build `MemberRow.jsx` — status indicator (Active green / Invited yellow / Inactive gray), 3-dot options menu
- [ ] Build `InviteMemberModal.jsx` — email input + role selector → `POST /api/v1/team/invite`
- [ ] Build `RolePermissionsMatrix.jsx` — Admin / Editor / Viewer permission cards with checkmark lists, "Create Custom Role" CTA
- [ ] Wire up `GET /api/v1/team?projectId=`, `PATCH /api/v1/team/:userId/role`, `DELETE /api/v1/team/:userId`
- [ ] Build search input — filter table by name, email, or role in real time
- [ ] Add Filter by Role and Sort dropdowns
- [ ] Show Collaboration Tip banner at bottom

---

### Backend Tasks — 3 Developers

---

#### Dev 5 — Auth API & CRUD Routes  `feat/be-auth-api` `feat/be-projects-api` `chore/db-schema`

**chore/db-schema** _(do this first — unblocks everyone)_
- [ ] Provision MongoDB Atlas M0 cluster (free tier for dev)
- [ ] Create `User` model — `id, name, email, role, passwordHash, oauthProvider, oauthId, createdAt, refreshToken`
- [ ] Create `Project` model — `id, name, description, createdBy, teamMembers[], status, createdAt, settings`
- [ ] Create `Requirement` model — `id, projectId, reqId, title, description, category, priority, stakeholder, tags[], dependencies[], version, status, createdBy, updatedAt`
- [ ] Create `Conflict` model — `id, projectId, reqA, reqB, conflictType, severityScore, aiConfidence, aiResolution, aiReasoning, status, detectedAt, resolvedAt, resolvedBy`
- [ ] Create `Vote` model — `id, conflictId, proposalId, userId, voteOption (support|object), weight, timestamp`
- [ ] Create `Report` model — `id, projectId, generatedBy, generatedAt, conflictCount, resolvedCount, downloadUrl, format`
- [ ] Create `Comment` model — `id, conflictId, userId, text, parentId (for threading), upvotes[], createdAt`
- [ ] Add indexes: `Requirements(projectId, status)`, `Conflicts(projectId, status, severityScore)`, `Users(email unique)`
- [ ] Write seed script (`npm run seed`) — creates 1 project, 5 requirements, 2 conflicts, 4 team members
- [ ] Export shared `.env.example` with all required keys

**feat/be-auth-api**
- [ ] `POST /api/v1/auth/register` — validate with Zod, hash password (bcrypt cost 12), create user, return JWT + refresh token
- [ ] `POST /api/v1/auth/login` — compare password, return JWT (15min) + refresh token (30 days)
- [ ] `POST /api/v1/auth/refresh` — validate refresh token, issue new JWT
- [ ] `POST /api/v1/auth/logout` — clear refresh token from DB
- [ ] `POST /api/v1/auth/forgot-password` — generate reset token, log to console (email service optional)
- [ ] `POST /api/v1/auth/reset-password` — validate token, hash new password
- [ ] `GET /api/v1/auth/google` — Passport.js Google OAuth redirect
- [ ] `GET /api/v1/auth/google/callback` — exchange code, upsert user, return JWT
- [ ] `GET /api/v1/auth/me` — return current user profile (protected)
- [ ] Build `authenticate.js` middleware — verify JWT, attach `req.user`
- [ ] Build `authorize.js` middleware — check `req.user.role` against allowed roles array, return 403 if unauthorized
- [ ] Build `validateRequest.js` middleware — Zod schema validation, return 422 with field errors
- [ ] Build `errorHandler.js` — catch-all error middleware, never expose stack traces in production
- [ ] Build `rateLimiter.js` — 100 requests per 15 minutes per IP (use `express-rate-limit`)
- [ ] Publish **Postman collection** to `docs/api-collection.json` ← other devs need this immediately

**feat/be-projects-api**
- [ ] `GET /api/v1/projects` — all projects for `req.user`, populate conflict counts
- [ ] `POST /api/v1/projects` — create project, add creator as Admin team member
- [ ] `GET /api/v1/projects/:id` — project detail with team members
- [ ] `PATCH /api/v1/projects/:id` — update name/description (Admin only)
- [ ] `DELETE /api/v1/projects/:id` — soft delete (Admin only)
- [ ] `GET /api/v1/requirements?projectId=` — paginated requirements (12/page), with filters (priority, status, category)
- [ ] `POST /api/v1/requirements` — create single requirement
- [ ] `POST /api/v1/requirements/upload` — Multer CSV upload → Papa Parse → bulk insert → return created count
- [ ] `GET /api/v1/requirements/:id` — single requirement with dependencies populated
- [ ] `PUT /api/v1/requirements/:id` — full update, log to Audit Trail
- [ ] `DELETE /api/v1/requirements/:id` — delete, check if involved in open conflict first
- [ ] `POST /api/v1/requirements/preview-conflicts` — lightweight check (rule-based only, no AI) for live editor preview — return matches within 500ms
- [ ] `GET /api/v1/conflicts?projectId=` — all conflicts with severity filter, sorted by score desc
- [ ] `GET /api/v1/conflicts/:id` — full conflict detail with both requirements populated
- [ ] `PATCH /api/v1/conflicts/:id/resolve` — mark as resolved, log resolver + timestamp
- [ ] `POST /api/v1/votes` — submit vote, compute weighted tally, emit `vote:update` socket event
- [ ] `GET /api/v1/comments?conflictId=` — threaded comments (parent + replies)
- [ ] `POST /api/v1/comments` — create comment or reply, emit `activity:new` socket event
- [ ] `GET /api/v1/team?projectId=` — all team members with roles
- [ ] `POST /api/v1/team/invite` — validate email, create pending member record, log invite
- [ ] `PATCH /api/v1/team/:userId/role` — change role (Admin only)
- [ ] `DELETE /api/v1/team/:userId` — remove member (Admin only)
- [ ] `GET /api/v1/timeline?projectId=&type=&from=&to=` — paginated, filterable activity log
- [ ] `POST /api/v1/timeline/notes` — add manual note entry
- [ ] `GET /api/v1/timeline/export` — return CSV download of activity log

---

#### Dev 6 — Conflict Engine & Gemini  `feat/be-conflict-engine` `feat/be-gemini-integration`

**feat/be-conflict-engine**
- [ ] Create `conflictDetector.js` — main orchestrator, accepts `projectId`, runs all 7 steps in sequence, saves results to `Conflicts` collection, emits `conflict:new` socket events
- [ ] `POST /api/v1/conflicts/analyze/:projectId` — trigger full analysis, return `{ jobId, estimatedTime }`, run detection async
- [ ] `GET /api/v1/conflicts/analyze/:projectId/status` — poll endpoint for analysis progress %

**Step 1 — Requirement Parser** (`requirementParser.js`)
- [ ] Fetch all requirements for `projectId` from MongoDB
- [ ] Validate all have required fields (id, description, priority, category)
- [ ] Normalize priority strings to enum values (HIGH/MEDIUM/LOW/CRITICAL)
- [ ] Return clean array ready for comparison

**Step 2 — Requirement Classifier** (`requirementClassifier.js`)
- [ ] For requirements without a category, auto-classify using keyword matching:
  - Security: encrypt, auth, password, token, GDPR, compliance, certificate, TLS
  - Performance: latency, speed, load time, ms, response time, throughput
  - Scalability: concurrent, users, nodes, replicas, horizontal, cluster
  - Cost: budget, price, $, billing, infrastructure cost, monthly
  - Functional: everything else
- [ ] Return requirements with `category` field guaranteed

**Step 3 — Pair Generator** (`pairGenerator.js`)
- [ ] Generate all unique pairs: `n × (n − 1) / 2`
- [ ] For 50 requirements → 1,225 pairs; for 100 → 4,950 pairs
- [ ] Return array of `[reqA, reqB]` tuples

**Step 4 — Rule Engine** (`ruleEngine.js` + `rules/`)
- [ ] Build rule registry in `rules/index.js` — loads all rule files dynamically
- [ ] `securityVsPerformance.js` — flags pairs where one is Security and one is Performance
- [ ] `costVsScalability.js` — flags pairs where one is Cost and one is Scalability
- [ ] `encryptionVsLatency.js` — keyword match: (encrypt OR AES OR TLS) AND (latency OR ms OR response)
- [ ] `eeaVsGlobalReplication.js` — keyword match: (EEA OR GDPR OR residency) AND (global OR replicate OR US-East OR mirror)
- [ ] Each rule returns `{ flagged: boolean, conflictType: string, ruleConfidence: number }`
- [ ] Rule-flagged pairs skip Gemini (cost saving) — mark as `source: 'rule'`
- [ ] Write unit tests for all 4 rules with edge cases

**Step 5 — Gemini Analyzer** (`geminiAnalyzer.js`)
- [ ] Accept batch of unflagged pairs (max 20 per API call to stay within rate limits)
- [ ] Build prompt (see Gemini Integration section below)
- [ ] Parse response — extract `conflictType`, `confidence`, `explanation`
- [ ] Return array of results with `source: 'ai'`

**Step 6 — Severity Scorer** (`severityScorer.js`)
- [ ] Formula: `Severity = PriorityWeight × ImpactFactor × StakeholderWeight`
- [ ] Priority weights: Critical=4, High=3, Medium=2, Low=1
- [ ] Impact factor: use higher priority of the two conflicting requirements
- [ ] Stakeholder weight: Legal/Security=1.5, PM/Architect=1.2, Developer=1.0
- [ ] Output score 1–10, rounded to 1 decimal
- [ ] Assign color band: Red (≥8), Orange (5–7.9), Yellow (3–4.9), Green (resolved)

**Step 7 — Feasibility Estimator** (`feasibilityEstimator.js`)
- [ ] Build lookup table for known conflict type impacts:
  - Security vs Performance → Timeline: +15%, Cost: +10%, Risk: High
  - Cost vs Scalability → Timeline: +20%, Cost: +35%, Risk: Critical
  - Encryption vs Latency → Timeline: +10%, Cost: +5%, Risk: Medium
  - EEA vs Global → Timeline: +25%, Cost: +20%, Risk: Critical
- [ ] For AI-detected conflicts: use conflict type to look up table, fallback to Medium risk
- [ ] Identify downstream affected modules based on requirement categories

**feat/be-gemini-integration**
- [ ] Set up `@google/generative-ai` SDK in `gemini.js`
- [ ] Build prompt template in `geminiAnalyzer.js`:
  ```
  You are a software requirements conflict analyzer.
  Analyze these two requirements for logical, semantic, or technical conflicts.

  Requirement A: {description_a}
  Requirement B: {description_b}

  Respond ONLY in JSON format:
  {
    "conflicted": true | false,
    "conflictType": "string (e.g. Security vs Performance)",
    "confidence": 0.0 to 1.0,
    "explanation": "one sentence"
  }
  ```
- [ ] Implement request batching — group pairs into batches of 20
- [ ] Implement retry logic — 3 attempts with exponential backoff (1s, 2s, 4s)
- [ ] Implement request queue — max 10 concurrent Gemini requests
- [ ] Parse and validate JSON response — handle malformed responses gracefully
- [ ] Log all Gemini calls with token usage for cost tracking
- [ ] Write mock Gemini responses for use in tests (no live API calls in CI)

---

#### Dev 7 — Real-time & Reports  `feat/be-socket-events` `feat/be-reports-api`

**feat/be-socket-events**
- [ ] Initialize Socket.io server in `server.js` alongside Express HTTP server
- [ ] Build `socketHandler.js` — handle connection/disconnection, join/leave project rooms
- [ ] Implement project rooms — `socket.join(`project:${projectId}`)` on authentication
- [ ] `conflictEvents.js` — emit `conflict:new` when detector finds a conflict → payload: `{ conflictId, type, severity, reqATitle, reqBTitle }`
- [ ] `activityEvents.js` — emit `activity:new` on any CRUD action → payload: `{ eventType, actorName, actorRole, description, timestamp }`
- [ ] `voteEvents.js` — emit `vote:update` when vote is submitted → payload: `{ conflictId, proposalId, support, oppose }`
- [ ] Authenticate socket connections using JWT — reject unauthenticated connections
- [ ] Handle `disconnect` — clean up room memberships
- [ ] Emit `analysis:progress` events during conflict detection (0%, 25%, 50%, 75%, 100%)
- [ ] Write integration tests for socket events using `socket.io-client` in test mode

**feat/be-reports-api**
- [ ] `POST /api/v1/reports/generate` — trigger PDF generation for a project (async job)
- [ ] `GET /api/v1/reports/:projectId` — list all reports for a project
- [ ] `GET /api/v1/reports/download/:reportId` — stream PDF file to client
- [ ] Build `pdfGenerator.js` using PDFKit:
  - Cover page: project name, generated date, generated by
  - Executive summary: total requirements, conflicts detected, resolved, open
  - Severity distribution section: counts by band (Red/Orange/Yellow/Green)
  - Conflict detail pages: Req A vs Req B, AI resolution, vote result, resolution status
  - Feasibility impact table: timeline %, cost %, risk level per conflict
  - Activity log summary: last 30 days of events
- [ ] Store generated PDF to `uploads/reports/` and save `downloadUrl` to Report model
- [ ] `GET /api/v1/timeline/export` — query all timeline events for project, stream as CSV (columns: Date, Actor, Role, Event Type, Description)
- [ ] Build `reportGeneratorJob.js` — background job that regenerates stale reports nightly

---

### Shared / Infrastructure Tasks

**chore/ci-cd** _(Team Lead)_
- [ ] Create `.github/workflows/frontend.yml` — on PR to `develop`: ESLint → Vitest → Vite build
- [ ] Create `.github/workflows/backend.yml` — on PR to `develop`: ESLint → Jest → Dockerfile build
- [ ] Add branch protection rules in GitHub: require 1 approval, no direct push to `main` or `develop`
- [ ] Configure Vercel project for frontend — auto-deploy `main` to production, `develop` to preview URL
- [ ] Write `Dockerfile` for backend — multi-stage build (node:20-alpine)
- [ ] Write `docker-compose.yml` — backend + mongo for local dev without Atlas
- [ ] Create `.env.example` for both `frontend/` and `backend/` with all required keys documented

**test/unit-integration** _(Dev 6 + Dev 7)_
- [ ] Configure Jest + supertest in backend
- [ ] Configure Vitest + React Testing Library in frontend
- [ ] Write conflict engine unit tests (all 4 rules, severity scorer, feasibility estimator)
- [ ] Write API route integration tests (auth, requirements, conflicts)
- [ ] Write socket event integration tests
- [ ] Achieve ≥ 70% code coverage on `src/engine/`
- [ ] Set up mock Gemini API responses in `tests/__mocks__/gemini.js`

---

## 🔄 Git Workflow

### Starting a New Task
```bash
# Always branch from the latest develop
git checkout develop
git pull origin develop
git checkout -b feat/fe-dashboard
```

### Daily Sync
```bash
# Keep your branch up to date with develop
git fetch origin
git rebase origin/develop
# Resolve any conflicts, then:
git push origin feat/fe-dashboard --force-with-lease
```

### Opening a Pull Request
1. Push your branch to GitHub
2. Open PR **from your branch → `develop`** (never directly to `main`)
3. Fill in the PR template (what changed, how to test, screenshots if UI)
4. Request review from a teammate on the same domain (frontend reviews frontend, backend reviews backend)
5. Address all review comments before merging
6. **Squash and merge** — keep `develop` history clean

### Commit Message Format (Conventional Commits)
```
feat: add conflict detection view with side-by-side comparison
fix: resolve vote tally not updating in real time
chore: add MongoDB indexes to requirements collection
test: add unit tests for ruleEngine securityVsPerformance rule
docs: update API reference with /conflicts/analyze endpoint
refactor: extract severity scoring into standalone module
```

### Hotfix Flow
```bash
# Cut from main (not develop)
git checkout main
git pull origin main
git checkout -b hotfix/fix-jwt-expiry-bug

# After fix:
# 1. PR → main  (deploy fix)
# 2. PR → develop  (keep branches in sync)
```

---

## ⚙️ Environment Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- MongoDB Atlas account (free M0 tier works)
- Google Cloud project (for OAuth credentials)
- Google AI Studio account (for Gemini API key)

### Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

**`frontend/.env.example`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**`backend/.env.example`**
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/conflict-resolver

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro

# Frontend URL (for CORS + OAuth redirect)
FRONTEND_URL=http://localhost:5173

# Reports
REPORTS_DIR=./uploads/reports
```

### Run With Docker (Local Dev)
```bash
# From project root
docker-compose up --build
```

---

## 📡 API Reference

> Full Postman collection: `docs/api-collection.json` (published by Dev 5 in Week 1)

### Base URL
```
Development:  http://localhost:5000/api/v1
Production:   https://api.conflictresolver.app/api/v1
```

### Authentication
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create new account |
| POST | `/auth/login` | Public | Login, get JWT |
| POST | `/auth/refresh` | Public | Refresh JWT |
| GET | `/auth/google` | Public | Google OAuth redirect |
| GET | `/auth/me` | Protected | Get current user |
| GET | `/projects` | Protected | List user's projects |
| POST | `/projects` | Protected | Create project |
| GET | `/projects/:id` | Protected | Project detail |
| GET | `/requirements?projectId=` | Protected | List requirements |
| POST | `/requirements` | Protected | Create requirement |
| POST | `/requirements/upload` | Protected | CSV bulk upload |
| POST | `/requirements/preview-conflicts` | Protected | Live conflict preview |
| POST | `/conflicts/analyze/:projectId` | Protected | Trigger AI analysis |
| GET | `/conflicts?projectId=` | Protected | List conflicts |
| GET | `/conflicts/:id` | Protected | Conflict detail |
| PATCH | `/conflicts/:id/resolve` | Editor+ | Mark resolved |
| POST | `/votes` | Protected | Submit vote |
| GET | `/comments?conflictId=` | Protected | Get discussion |
| POST | `/comments` | Protected | Post comment |
| GET | `/team?projectId=` | Protected | List team members |
| POST | `/team/invite` | Admin | Invite member |
| PATCH | `/team/:userId/role` | Admin | Change role |
| GET | `/timeline?projectId=` | Protected | Activity feed |
| GET | `/timeline/export` | Protected | Download CSV log |
| POST | `/reports/generate` | Editor+ | Generate PDF report |
| GET | `/reports/:projectId` | Protected | List reports |
| GET | `/reports/download/:reportId` | Protected | Download PDF |

---

## 🗄️ Database Schema

### Collections Overview

```
users           → Authentication & roles
projects        → Project metadata & team
requirements    → All requirements per project
conflicts       → Detected conflicts with AI scores
votes           → Stakeholder votes on proposals
reports         → Generated PDF reports
comments        → Discussion threads per conflict
```

### Key Relationships
```
User (1) ──────────── (many) Project          [createdBy]
Project (1) ─────────── (many) Requirement    [projectId]
Requirement (2) ───────── (1) Conflict        [reqA, reqB]
Conflict (1) ──────────── (many) Vote         [conflictId]
Conflict (1) ──────────── (many) Comment      [conflictId]
Project (1) ──────────── (many) Report        [projectId]
```

---

## 🤖 Conflict Detection Pipeline

```
Input: projectId
        │
        ▼
┌─────────────────────┐
│ 1. Parser           │  Fetch & validate all requirements from MongoDB
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 2. Classifier       │  Auto-categorize uncategorized requirements
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 3. Pair Generator   │  Create n×(n-1)/2 unique pairs
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 4. Rule Engine      │  Apply 4 deterministic rules (fast, no API cost)
└──────────┬──────────┘
     ┌─────┴─────┐
     ▼           ▼
  Flagged    Unflagged
  by rule    pairs
     │           │
     │           ▼
     │  ┌─────────────────┐
     │  │ 5. Gemini AI    │  Semantic analysis via API
     │  └────────┬────────┘
     └───────────┤
                 ▼
        ┌─────────────────┐
        │ 6. Severity     │  Priority × Impact × Stakeholder Weight → 1–10
        └────────┬────────┘
                 ▼
        ┌─────────────────┐
        │ 7. Feasibility  │  Timeline %, Cost %, Risk Level
        └────────┬────────┘
                 ▼
        Save to MongoDB → Emit socket events → Return results
```

### Severity Score Formula
```
Severity = PriorityWeight × ImpactFactor × StakeholderWeight

PriorityWeight:   Critical=4, High=3, Medium=2, Low=1
StakeholderWeight: Legal/Security=1.5, PM/Architect=1.2, Dev=1.0
Output: clamp(result, 1, 10)
```

---

## 🚀 Running the Project

### Development (both servers)
```bash
# Terminal 1 — Backend
cd backend && npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev
# Runs on http://localhost:5173

# Seed database with sample data
cd backend && npm run seed
```

### Run Tests
```bash
# Backend tests
cd backend && npm test
cd backend && npm run test:coverage

# Frontend tests
cd frontend && npm test
```

### Production Build
```bash
# Frontend
cd frontend && npm run build
# Output: frontend/dist/

# Backend
cd backend && npm start
```

---

## ✔️ Definition of Done

A task is complete and ready for PR when **all** of the following are true:

- [ ] Feature works as described in this README
- [ ] Matches the Stitch prototype design (correct colors, layout, components)
- [ ] No TypeScript / ESLint errors
- [ ] API endpoints return correct HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)
- [ ] All form inputs have validation and show error messages
- [ ] Dark mode works correctly on all new screens/components
- [ ] Mobile responsive at 375px, 768px, 1280px breakpoints
- [ ] Unit or integration tests written for non-trivial logic
- [ ] No `console.log` statements left in production code
- [ ] PR description filled out with: what changed, how to test, screenshots (UI changes)
- [ ] At least 1 peer review approval before merge

---

## 📐 Contributing Guidelines

### Code Style
- **Frontend:** Follow the ESLint + Prettier config in `frontend/.eslintrc.cjs`
- **Backend:** Follow the ESLint config in `backend/.eslintrc.js`
- Components use **PascalCase** (`ProjectCard.jsx`)
- Hooks, utils, services use **camelCase** (`useConflicts.js`, `conflictService.js`)
- API routes use **kebab-case** (`/conflict-detection`)
- Database field names use **camelCase** (`createdBy`, `projectId`)

### PR Checklist
```markdown
## What changed
<!-- Brief description of the feature or fix -->

## How to test
<!-- Step-by-step instructions to verify the change -->

## Screenshots
<!-- Required for any UI changes -->

## Checklist
- [ ] Matches Stitch prototype design
- [ ] Dark mode tested
- [ ] Mobile responsive tested
- [ ] No console.log in production code
- [ ] Tests written and passing
```

### Getting Help
- **Blocked by missing API?** → Check `docs/api-collection.json` for mock responses, or message Dev 5
- **Design question?** → Refer to `stitch_authentication_page/` folder for the prototype HTML
- **Merge conflict?** → Rebase on `develop` and resolve — never use `git merge develop`
- **Emergency production bug?** → Create `hotfix/<issue>` from `main`, tag the team lead

---

## 📅 Milestone Timeline

| Milestone | Target Date | Key Deliverable |
|---|---|---|
| M1 — Foundation | End of Week 2 | Auth working, DB schema live, layout components done, Postman collection published |
| M2 — Core Features | End of Week 4 | Dashboard, workspace, requirement CRUD, CSV upload, rule-based conflicts working |
| M3 — AI & Realtime | End of Week 6 | Gemini integration live, full conflict UI, voting & discussion, Socket.io feed |
| M4 — Polish & Launch | End of Week 8 | Timeline, team panel, PDF reports, tests, CI/CD, production deploy |

---

<div align="center">

**Conflict Resolver — RCFA** · Version 1.0 · Built with React, Node.js, MongoDB & Google Gemini

</div>
<!-- update by feneel -->