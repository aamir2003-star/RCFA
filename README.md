# 🧠 Conflict Resolver AI — RCFA v2

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

**Conflict Resolver AI** helps software teams catch requirement contradictions before they cause expensive mid-sprint rework. It uses Google Gemini to detect logical and semantic conflicts, then enables structured collaborative resolution with full audit trails.

### The Pipeline
```
1. CREATE    →  New project with AI-generated requirements from plain-text description
2. MODULE    →  Organize requirements into architectural modules, assign developers
3. DETECT    →  Rule-based + Gemini AI semantic conflict detection (n×(n-1)/2 pairs)
4. RESOLVE   →  3 AI resolution proposals with match %, threaded discussion, voting
5. REPORT    →  Analytics dashboard, PDF export, activity timeline audit log
```

### Role-Based Access
```
Project Manager  →  PM Dashboard, full project visibility, reports, team management
Developer        →  Developer Dashboard, assigned modules only, conflict resolution
BDE / Operations →  BDE Dashboard, cross-team project overview, analytics
Admin            →  All screens + billing + user management
```

---

## 🖥 12 Screens Reference

| # | Screen | File | Role | Purpose |
|---|---|---|---|---|
| 1 | **Authentication Page** | `authentication_page/` | All | Login with Google, GitHub, or email. "Joined by 10,000+ legal and HR professionals" social proof. |
| 2 | **PM Dashboard** | `project_manager_dashboard/` | Project Manager | Overview of all 8 active projects, conflict stats (128 requirements, 12 conflicts, 45 modules, 18 devs), Quick Actions, AI Insight banner. |
| 3 | **Developer Dashboard** | `developer_dashboard/` | Developer | Personal view — 12 assigned modules, 4 unresolved conflicts (2 critical), 8 open discussions, 85% requirements met. Module cards with conflict counts. |
| 4 | **BDE Dashboard** | `bde_dashboard/` | BDE / Ops | Cross-team project tracker — 42 total projects, 12 conflicts, 14 teams. Project progress bars per initiative. Storage usage gauge. |
| 5 | **Create Project Page** | `create_project_page/` | PM / Admin | Full-page project creation form. Live AI preview panel generates 3 requirement suggestions in real time as PM types the project overview. |
| 6 | **Module Management** | `module_management_page/` | PM / Architect | Drag-and-drop module cards (Authentication, Payment Gateway, Order Management, Admin Dashboard). Team member assignment panel. AI team suggestion banner. |
| 7 | **Requirement Editor** | `requirement_editor/` | Developer / BA | Full rich-text editor for REQ-102. Inline AI assistant panel with 3 active suggestions: ambiguity warning, missing edge case, security suggestion, conflict found alert. |
| 8 | **Conflict Detection Page** | `conflict_detection_page/` | All | Conflict #CONF-124 detail — REQ-08 (Scalability) vs REQ-14 (Data Retention). 3 AI proposals: Hybrid (98%), Compromise (82%), Aggressive Merge (45%). |
| 9 | **Conflict Resolution Discussion** | `conflict_resolution_discussion/` | All | Threaded discussion for #CONF-124 with 4 participants, code block in reply, PDF attachment support, AI progress summary (85% lean toward Alex's solution). |
| 10 | **Activity Timeline** | `activity_timeline/` | All | Real-time audit trail across multiple projects. Filter by: Conflicts, Requirements, Resolutions, Discussions. Per-project filter dropdown. |
| 11 | **Analytics Dashboard** | `analytics_dashboard/` | PM / Director | Project Health Overview — Requirement Clarity 94.2%, Project Readiness 82%, 12 Open Conflicts. Conflict trend chart (Mon–Sun), Conflicts by Type breakdown, Recent Resolutions. |
| 12 | **AI Requirement Generator** | `generated_screen/` | PM / Admin | AI-generated requirements from project description text. Shows 3 requirements (User Auth/SSO, Real-time Conflict Detection, Multi-currency Billing) with priority, module tag, and Approve/Pending status. |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | Component-based UI |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling + dark mode |
| shadcn/ui | Latest | Pre-built accessible components |
| React Router | 6.x | Client-side routing + role-based guards |
| Axios | 1.x | HTTP API client |
| Socket.io-client | 4.x | Real-time activity feed & conflict alerts |
| React Hook Form | 7.x | Form state management |
| @dnd-kit/core | 6.x | Drag-and-drop for Module Management page |
| Recharts | 2.x | Analytics dashboard charts |
| @tiptap/react | 2.x | Rich text editor in Requirement Editor |
| Papa Parse | 5.x | Client-side CSV parsing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express.js | 4.x | REST API framework |
| MongoDB Atlas | 7.x | Cloud document database |
| Mongoose | 8.x | MongoDB ODM |
| Socket.io | 4.x | Real-time event server |
| Google Gemini API | gemini-pro | AI conflict detection + requirement generation |
| JWT + Passport.js | — | Auth — email, Google OAuth, GitHub OAuth |
| bcrypt | 5.x | Password hashing |
| Multer | 1.x | File upload (CSV + PDF attachments) |
| PDFKit | 0.15.x | PDF report generation |
| Zod | 3.x | Request schema validation |
| node-cron | 3.x | Scheduled background jobs |

---

## 📁 Repository Structure

```
conflict-resolver-ai/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/               # Button, Input, Badge, Modal, Dropdown, Avatar, Tabs, Tooltip
│       │   ├── layout/           # Sidebar, TopHeader, Breadcrumb, PageWrapper, RoleSidebar
│       │   ├── dashboard/        # StatCard, ProjectCard, QuickActions, AIInsightBanner
│       │   ├── modules/          # ModuleCard, DraggableModuleList, TeamAssignmentPanel
│       │   ├── requirements/     # RequirementTable, CSVUploader, TagInput, DependencyLinker
│       │   ├── ai-generator/     # AIRequirementCard, GeneratorPreviewPanel, ApprovalBadge
│       │   ├── conflicts/        # ConflictCard, ResolutionProposalCard, VotingPanel
│       │   ├── discussion/       # DiscussionThread, CommentComposer, ParticipantList, FileAttachment
│       │   ├── analytics/        # ConflictTrendChart, HealthMetricCard, ConflictTypeDonut
│       │   └── timeline/         # TimelineEvent, TimelineFilter, ProjectSelector
│       ├── pages/
│       │   ├── AuthPage.jsx                    # Screen 1
│       │   ├── PMDashboardPage.jsx             # Screen 2
│       │   ├── DeveloperDashboardPage.jsx      # Screen 3
│       │   ├── BDEDashboardPage.jsx            # Screen 4
│       │   ├── CreateProjectPage.jsx           # Screen 5
│       │   ├── ModuleManagementPage.jsx        # Screen 6
│       │   ├── RequirementEditorPage.jsx       # Screen 7
│       │   ├── ConflictDetectionPage.jsx       # Screen 8
│       │   ├── ConflictDiscussionPage.jsx      # Screen 9
│       │   ├── ActivityTimelinePage.jsx        # Screen 10
│       │   ├── AnalyticsDashboardPage.jsx      # Screen 11
│       │   └── AIGeneratorPage.jsx             # Screen 12
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useRole.js             # Role-based access helper
│       │   ├── useModules.js
│       │   ├── useConflicts.js
│       │   ├── useSocket.js
│       │   ├── useAIGenerator.js
│       │   └── useActivityFeed.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── ThemeContext.jsx
│       │   └── SocketContext.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── projectService.js
│       │   ├── moduleService.js
│       │   ├── requirementService.js
│       │   ├── conflictService.js
│       │   ├── discussionService.js
│       │   ├── analyticsService.js
│       │   ├── timelineService.js
│       │   └── reportService.js
│       ├── router/
│       │   ├── AppRouter.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── RoleRoute.jsx      # Role-gated route wrapper
│       ├── utils/
│       │   ├── roleHelpers.js
│       │   ├── severityColors.js
│       │   ├── formatDate.js
│       │   └── csvParser.js
│       └── styles/
│           └── globals.css
│
└── backend/
    └── src/
        ├── config/
        │   ├── db.js
        │   ├── passport.js        # Google + GitHub OAuth
        │   ├── socket.js
        │   └── gemini.js
        ├── models/
        │   ├── User.model.js
        │   ├── Project.model.js
        │   ├── Module.model.js    # NEW in v2
        │   ├── Requirement.model.js
        │   ├── Conflict.model.js
        │   ├── Vote.model.js
        │   ├── Comment.model.js
        │   ├── Attachment.model.js # NEW — discussion file uploads
        │   └── Report.model.js
        ├── controllers/
        ├── routes/
        ├── middleware/
        ├── services/
        ├── engine/
        │   ├── conflictDetector.js
        │   ├── requirementParser.js
        │   ├── requirementClassifier.js
        │   ├── pairGenerator.js
        │   ├── ruleEngine.js
        │   ├── geminiAnalyzer.js
        │   ├── requirementGenerator.js  # NEW — AI req generation
        │   ├── severityScorer.js
        │   ├── feasibilityEstimator.js
        │   └── rules/
        ├── sockets/
        ├── jobs/
        ├── utils/
        ├── validations/
        ├── app.js
        └── server.js
```

---

## 👥 Team & Role Assignments

### The Team

| Dev | Name | Side | Role Focus | Screens Owned |
|---|---|---|---|---|
| **Dev 1** | Shubham | Frontend | Auth + Global Layout + Role Routing | Screen 1 — Auth |
| **Dev 2** | Ansh | Frontend | All 3 Dashboards (PM, Developer, BDE) | Screens 2, 3, 4 |
| **Dev 3** | Pratik | Frontend | Create Project + Module Management + AI Generator | Screens 5, 6, 12 |
| **Dev 4** | Dhruv Mochi + Shubham | Frontend | Requirement Editor + Conflict UI + Discussion + Timeline + Analytics | Screens 7, 8, 9, 10, 11 |
| **Dev 5** | Dhruv Patel | Backend | Auth API + All CRUD Routes + DB Schema | All REST endpoints |
| **Dev 6** | Aamir | Backend | AI Conflict Engine + Gemini Integration + Requirement Generator | Detection + Gen pipeline |
| **Dev 7** | Feenel | Backend | Real-time Events + Analytics API + Reports + File Uploads | Socket.io, Analytics, Reports |

> ⚠️ **Critical Path:** **Dhruv Patel (Dev 5)** must complete `chore/db-schema` and publish the Postman collection by **end of Week 1**. All other developers are blocked until the API contracts are defined.

---

## 🌿 Branch Strategy

### Core Branches

| Branch | Purpose | Direct Push |
|---|---|---|
| `main` | Production only. Tag every release. | ❌ Never |
| `develop` | Integration. All features merge here. | ❌ Never |
| `release/v2.0` | Staging cut from develop. Bug fixes only. | Team Lead only |
| `hotfix/<issue-id>` | Emergency fix. Merge to main + develop. | On-call dev only |

### Frontend Branches

| Branch | Owner | Screens |
|---|---|---|
| `feat/fe-auth` | Shubham (Dev 1) | Screen 1 — Auth Page |
| `feat/fe-layout` | Shubham (Dev 1) | Sidebar, TopHeader, RoleRoute, ThemeContext |
| `feat/fe-pm-dashboard` | Ansh (Dev 2) | Screen 2 — Project Manager Dashboard |
| `feat/fe-dev-dashboard` | Ansh (Dev 2) | Screen 3 — Developer Dashboard |
| `feat/fe-bde-dashboard` | Ansh (Dev 2) | Screen 4 — BDE Dashboard |
| `feat/fe-create-project` | Pratik (Dev 3) | Screen 5 — Create Project Page |
| `feat/fe-modules` | Pratik (Dev 3) | Screen 6 — Module Management |
| `feat/fe-ai-generator` | Pratik (Dev 3) | Screen 12 — AI Requirement Generator |
| `feat/fe-req-editor` | Dhruv Mochi + Shubham (Dev 4) | Screen 7 — Requirement Editor |
| `feat/fe-conflict-ui` | Dhruv Mochi + Shubham (Dev 4) | Screen 8 — Conflict Detection Page |
| `feat/fe-discussion` | Dhruv Mochi + Shubham (Dev 4) | Screen 9 — Conflict Resolution Discussion |
| `feat/fe-timeline` | Dhruv Mochi + Shubham (Dev 4) | Screen 10 — Activity Timeline |
| `feat/fe-analytics` | Dhruv Mochi + Shubham (Dev 4) | Screen 11 — Analytics Dashboard |

### Backend Branches

| Branch | Owner | Scope |
|---|---|---|
| `chore/db-schema` | Dhruv Patel (Dev 5) | All 9 Mongoose models + indexes + seed script |
| `feat/be-auth-api` | Dhruv Patel (Dev 5) | Register, Login, Google OAuth, GitHub OAuth, JWT, RBAC |
| `feat/be-projects-api` | Dhruv Patel (Dev 5) | Projects, Requirements, Modules, Votes, Comments, Team CRUD |
| `feat/be-conflict-engine` | Aamir (Dev 6) | 7-step detection pipeline + all 4 rule files |
| `feat/be-gemini-integration` | Aamir (Dev 6) | Gemini client, semantic analysis, requirement generator |
| `feat/be-socket-events` | Feenel (Dev 7) | Socket.io server, conflict/activity/vote/module events |
| `feat/be-analytics-api` | Feenel (Dev 7) | Project health scores, conflict trend data, charts data |
| `feat/be-reports-api` | Feenel (Dev 7) | PDF generation, file upload (attachments), export routes |

### Shared Branches

| Branch | Owner | Scope |
|---|---|---|
| `chore/ci-cd` | Team Lead | GitHub Actions, Dockerfile, Vercel config |
| `test/unit-integration` | Aamir + Feenel (Dev 6 + Dev 7) | Jest, Vitest, supertest, socket test, coverage |

---

## ✅ Developer Task Lists

---

### 👤 Dev 1 — Shubham — Auth & Global Layout
**Branches:** `feat/fe-auth` · `feat/fe-layout`

#### `feat/fe-auth` — Screen 1: Authentication Page
- [ ] Build `AuthPage.jsx` — split-screen layout matching Stitch prototype
- [ ] Left panel: "Mastering Harmony through Intelligent Resolution" branding, "10,000+ legal and HR professionals" social proof strip
- [ ] Build Login / Create Account tab switcher (no reload)
- [ ] **Google OAuth** button → redirect to `/api/v1/auth/google`
- [ ] **GitHub OAuth** button → redirect to `/api/v1/auth/github` *(new in v2)*
- [ ] Email + password form (React Hook Form + Zod validation)
- [ ] Password show/hide toggle
- [ ] "Remember me for 30 days" checkbox
- [ ] "Forgot password?" link → modal → API call → success state
- [ ] Create Account tab — name, email, password, confirm password, role selector (PM / Developer / BDE)
- [ ] Store JWT in `httpOnly` cookie (never localStorage)
- [ ] Build `useAuth` hook — `login()`, `logout()`, `register()`, `user`, `role`
- [ ] Build `AuthContext` wrapping entire app
- [ ] Handle all error states — wrong password, duplicate email, OAuth failure
- [ ] Fully responsive — mobile stacks form on top, hides branding panel

#### `feat/fe-layout` — Shared Layout System
- [ ] Build `RoleSidebar.jsx` — renders different nav items depending on `user.role`:
  - PM: Dashboard, Projects, Requirements, Conflicts, Team, AI Credits badge
  - Developer: Dashboard, My Modules, Conflicts, Discussions, Settings
  - BDE: Dashboard, Projects, Teams, Analytics, Settings, Storage gauge
  - Admin: all nav items
- [ ] Build `TopHeader.jsx` — search, notification bell with unread dot, user avatar + name + role
- [ ] Build `Breadcrumb.jsx` — dynamic path from React Router
- [ ] Build `PageWrapper.jsx` — consistent page padding, max-width container
- [ ] Build `RoleRoute.jsx` — role-based route guard, redirects unauthorized users to their correct dashboard
- [ ] Implement dark mode toggle → `ThemeContext` → `localStorage`
- [ ] Mobile responsive — sidebar collapses to hamburger below lg breakpoint
- [ ] Build shared UI primitives in `src/components/ui/`:
  - `Button.jsx` — variants: primary, secondary, ghost, danger
  - `Input.jsx` — with label, error state, helper text
  - `Badge.jsx` — variants: red, orange, amber, green, blue, gray
  - `Modal.jsx` — accessible, focus-trapped, backdrop click closes
  - `Dropdown.jsx` — click-away closes, keyboard navigable
  - `Avatar.jsx` — circular, with fallback initials
  - `Tooltip.jsx`
  - `Tabs.jsx`
  - `StatCard.jsx` — metric + trend indicator (used across all 3 dashboards)

---

### 👤 Dev 2 — Ansh — All Three Dashboards
**Branches:** `feat/fe-pm-dashboard` · `feat/fe-dev-dashboard` · `feat/fe-bde-dashboard`

#### `feat/fe-pm-dashboard` — Screen 2: Project Manager Dashboard
- [ ] Build `PMDashboardPage.jsx`
- [ ] Top stat row using `StatCard`: Requirements Created (+12%), Conflicts Detected (-5%), Modules Created (+8%), Developers Assigned (+2%) — each with trend arrow and % change
- [ ] Build `ProjectCard.jsx` — project icon, name, status badge (On Track / At Risk), last updated, conflict count, progress bar, "+N" team indicator
- [ ] Active Projects list — 3 sample cards: FinTech Core Revamp (75%), E-Commerce AI Chatbot (32%), HealthTech Data Pipeline (90%)
- [ ] "View All" link to full projects page
- [ ] Quick Actions panel — Generate Requirements (AI), Create Modules, Invite Team Members — each as a nav card with chevron
- [ ] AI Insight Banner — `AIInsightBanner.jsx` — shows Gemini suggestion with "Apply Suggestion" CTA
- [ ] AI Credits gauge — "650 / 1000 requests used" (progress bar in sidebar)
- [ ] Wire up `GET /api/v1/dashboard/pm` for all stats
- [ ] Wire up `GET /api/v1/projects?role=pm` for project list
- [ ] Download Export Report button → `GET /api/v1/reports/generate`
- [ ] New Project button → navigate to `/projects/create`

#### `feat/fe-dev-dashboard` — Screen 3: Developer Dashboard
- [ ] Build `DeveloperDashboardPage.jsx`
- [ ] Welcome message: "You have 4 unresolved conflicts requiring immediate attention today."
- [ ] Stat row: Modules Assigned (12, +2 this week), Pending Conflicts (4, 2 critical), Open Discussions (8, 3 waiting for you), Requirements Met (85%)
- [ ] "My Modules" section with module cards showing: project name, status badge (In Progress / Blocked), requirement count, conflict count, thread count, "Update Progress" + "Add Comment" + "Bug Report" action buttons
- [ ] Active Conflicts mini-table — Priority (CRITICAL / HIGH badge), Conflict Title, Module name, Resolve button
- [ ] Recent Activity feed — completed requirement, commented on conflict, new conflict alert, status update — each with icon + timestamp
- [ ] Bottom AI banner: "AI has suggested 3 solutions for your critical conflicts in Billing V2. Review Suggestions"
- [ ] Wire up `GET /api/v1/dashboard/developer` for personalized stats
- [ ] Wire up `GET /api/v1/modules?assignedTo=me`
- [ ] Wire up `GET /api/v1/conflicts?assignedTo=me&status=open`
- [ ] Subscribe to Socket.io `conflict:new` → auto-increment conflict badge

#### `feat/fe-bde-dashboard` — Screen 4: BDE Dashboard
- [ ] Build `BDEDashboardPage.jsx`
- [ ] Top stat row: Total Projects (42, +5.2%), Conflicts Detected (12, +3 today), Active Teams (14, Stable), Overall Progress (78%)
- [ ] Storage usage bar — "64% of 100GB used" in sidebar
- [ ] "Active Projects: Real-time status of cross-team resource allocations" section
- [ ] Project rows with: icon, project name, conflict count badge, description, "+N" team indicator, progress bar %, status
- [ ] Sample projects: Core API Infrastructure (64%), v2.0 UI Redesign (92%), Data Encryption Module (15%), Billing System Integration (45%), AI Content Generator (33%)
- [ ] "Add Project" card at end of list
- [ ] Wire up `GET /api/v1/dashboard/bde` for cross-team stats
- [ ] Wire up `GET /api/v1/projects?view=all` for full project list

---

### 👤 Dev 3 — Pratik — Create Project + Modules + AI Generator
**Branches:** `feat/fe-create-project` · `feat/fe-modules` · `feat/fe-ai-generator`

#### `feat/fe-create-project` — Screen 5: Create Project Page
- [ ] Build `CreateProjectPage.jsx` — full dedicated page (not a modal)
- [ ] Left form panel:
  - Project Name (text input)
  - Client Name (text input)
  - Project Overview (textarea — triggers AI preview on change)
  - Expected Timeline (date picker)
  - Budget ($) (number input)
  - Assign Project Manager (select — Sarah Jenkins, Michael Chen, Robert Taylor)
  - "Generate Project" button with `auto_awesome` AI icon → submit + trigger AI gen
  - Cancel button
- [ ] Right `AIPreviewPanel.jsx` — real-time requirement suggestions as PM types:
  - Debounce 800ms on textarea keystroke → call `POST /api/v1/ai/preview-requirements`
  - Show 3 requirement cards with priority badge, title, description
  - "psychology — Start typing to see AI suggestions" empty state
  - AI Tip banner at bottom: "Adding a detailed budget helps predict resource bottlenecks"
- [ ] Wire up `POST /api/v1/projects` — send form data + AI-suggested requirements
- [ ] Navigate to Module Management page after successful creation

#### `feat/fe-modules` — Screen 6: Module Management
- [ ] Build `ModuleManagementPage.jsx`
- [ ] Build `DraggableModuleList.jsx` using `@dnd-kit/core` — drag_indicator handle on each card
- [ ] Filter tabs: All / In Progress / Completed
- [ ] Build `ModuleCard.jsx`:
  - Drag handle (drag_indicator icon)
  - Module name + description
  - Owner avatar + name
  - Requirements count badge
  - Status badge (In Progress / Pending / Completed / Draft)
  - Edit button (pencil icon)
  - "lock" icon for locked/protected modules
- [ ] Sample modules: Authentication (Sarah Chen, 12 reqs, In Progress), Payment Gateway (James Wilson, 8 reqs, Pending), Order Management (Maya Rao, 24 reqs, Completed), Admin Dashboard (Unassigned, 15 reqs, Draft)
- [ ] Right panel `TeamAssignmentPanel.jsx`:
  - "X Online — Available for Assignment" header
  - Team member list with drag_handle indicators and availability status (Busy shown)
  - AI Suggestion banner: "Based on skills, Elena Garcia is best suited for Admin Dashboard. Apply Suggestion"
- [ ] "Create New Module" button → slide-in form (name, description, assign dev)
- [ ] Wire up `GET /api/v1/modules?projectId=`, `POST /api/v1/modules`, `PATCH /api/v1/modules/:id`, `PATCH /api/v1/modules/reorder`
- [ ] Wire up `PATCH /api/v1/modules/:id/assign` for team member assignment
- [ ] Persist drag-and-drop order via `PATCH /api/v1/modules/reorder`

#### `feat/fe-ai-generator` — Screen 12: AI Requirement Generator
- [ ] Build `AIGeneratorPage.jsx`
- [ ] Left project info panel:
  - Project name + client name
  - Original description read-only text box
  - Creation date, Requirements Base count, Sections count
- [ ] "Generate Detailed Requirements" button → call `POST /api/v1/ai/generate-requirements`
- [ ] Loading state — "AI is analyzing your project..." skeleton cards
- [ ] Build `AIRequirementCard.jsx` for each generated requirement:
  - Title + description paragraph
  - Priority badge (High / Medium / Low)
  - Module tag + Domain tag (Security, Frontend, AI Engine, Finance)
  - Status badge: "Pending Approval" (amber) or "Approved" (green)
  - Approve button (if pending) → `PATCH /api/v1/requirements/:id/approve`
- [ ] Sample outputs: User Auth & SSO (High, Security, Backend), Real-time Conflict Detection (Medium, AI Engine), Multi-currency Billing Dashboard (Low, Frontend, Finance)
- [ ] Bulk "Approve All" button
- [ ] "Regenerate" button → re-call AI with same description
- [ ] Wire up `POST /api/v1/ai/generate-requirements` with `{ projectId }`

---

### 👤 Dev 4 — Dhruv Mochi + Shubham — Requirement Editor + Conflict Suite + Timeline + Analytics
**Branches:** `feat/fe-req-editor` · `feat/fe-conflict-ui` · `feat/fe-discussion` · `feat/fe-timeline` · `feat/fe-analytics`

#### `feat/fe-req-editor` — Screen 7: Requirement Editor
- [ ] Build `RequirementEditorPage.jsx` — split layout: editor left, AI assistant right
- [ ] Top breadcrumb: Projects > Alpha System > REQ-102
- [ ] Status badge: "In Review", version display, more_horiz options menu
- [ ] Sidebar quick-fields:
  - Priority selector (High / Medium / Low / Critical dropdown)
  - Module selector (lock Authentication dropdown)
  - Dependencies (link REQ-089 chip)
  - Tags (Security chip + add button)
- [ ] Rich text editor using `@tiptap/react` with toolbar: Bold, Italic, Bullet List, Link, Image, Code
- [ ] Pre-filled content for REQ-102 (MFA requirement) as default state
- [ ] Left sidebar navigation: Overview, Editor (active), AI Analysis, Version History, Project Settings
- [ ] Right `AIAssistantPanel.jsx` — "smart_toy AI Assistant" header with badge count (3 suggestions):
  - ⚠️ **Ambiguity Warning** — "account should be locked automatically" is ambiguous (soft vs hard lock) + "Refine Language" button
  - 🔍 **Missing Edge Case** — "What if session expires during MFA entry?" + "Add to Requirement" button
  - 🔒 **Security Suggestion** — "Add rate limiting to MFA endpoint" + "Apply Recommendation" button
  - ❌ **Conflict Found** — "Conflicts with REQ-042 which states sessions should never expire on trusted IPs"
- [ ] "Generate Test Cases" quick action button
- [ ] "Summarize for Stakeholders" quick action button
- [ ] Wire up `GET /api/v1/requirements/:id`, `PUT /api/v1/requirements/:id`
- [ ] Wire up `POST /api/v1/ai/analyze-requirement` for AI assistant suggestions (debounced 1000ms)
- [ ] "Save Changes" button with unsaved changes indicator in header

#### `feat/fe-conflict-ui` — Screen 8: Conflict Detection Page
- [ ] Build `ConflictDetectionPage.jsx` — full conflict detail for #CONF-124
- [ ] Header: "Conflict #CONF-124 · Critical · High Impact"
- [ ] Subtitle: "Detected between REQ-08: System Scalability and REQ-14: Data Retention Policy"
- [ ] Action buttons: Start Discussion, Edit, Resolve Conflict
- [ ] Side-by-side requirement panels:
  - REQ-08 (Architecture Team) — scalability spec content, version badge (v2.4)
  - REQ-14 (Compliance Team) — GDPR/CCPA data retention spec, version badge (v1.1)
- [ ] AI Logic panel: "The conflict arises from the **retention duration mismatch**. REQ-08 mandates 36 months active memory, REQ-14 mandates cold storage after 90 days." (bold keyword)
- [ ] Build `ResolutionProposalCard.jsx` — 3 proposals with match % badges:
  - ⚡ Recommended (98%) — Hybrid Log Management
  - 🤝 Compromise (82%) — Extended Production Buffer
  - 🔀 Aggressive Merge (45%) — On-Demand Retrieval
  - Each with "Apply Suggestion" button
- [ ] Helpful Tools sidebar: View History, Invite Stakeholder, "+2 Requirement owners notified" info banner
- [ ] "Dismiss Conflict" + "Finalize Resolution" bottom action buttons
- [ ] Wire up `GET /api/v1/conflicts/:id`, `PATCH /api/v1/conflicts/:id/resolve`
- [ ] Wire up `POST /api/v1/conflicts/:id/apply-resolution`

#### `feat/fe-discussion` — Screen 9: Conflict Resolution Discussion
- [ ] Build `ConflictDiscussionPage.jsx` — full discussion view for #CONF-124
- [ ] Header: conflict title "Data Retention Mismatch: User Privacy vs. Compliance", OPEN badge, created date, "Mark as Resolved" button
- [ ] Build `DiscussionThread.jsx` — chronological comments:
  - Author avatar + name + timestamp
  - Comment body with markdown rendering (code blocks, bold)
  - Alex's reply includes a JSON code block (retain as code block, not plain text)
  - "Proposed Solution" highlight box inside Alex's reply
  - 👍 8 / 👎 0 reaction buttons + "Approve this solution" CTA
  - Reply button per comment
- [ ] Build `FileAttachment.jsx` — Jamie's PDF attachment: "Auditor_Guidelines_v4.pdf · 1.2MB · PDF Document" with download button
- [ ] Build `CommentComposer.jsx` — rich text toolbar (Bold, Italic, Link, Code, @mention, attach_file), Comment button
- [ ] Right sidebar `ParticipantList.jsx` — 4 participants (Sarah Chen Legal Lead, Alex Rivera Sr. Engineer, Jamie Smith Product Manager) + "Invite Others" button
- [ ] Conflicting Requirements panel — REQ-802 and REQ-415 links
- [ ] `AIProgressSummary.jsx` — "85% of participants lean towards Alex's masking solution. Potential blockers: Needs final approval from Compliance Officer. Resolution Probability: 75%"
- [ ] Wire up `GET /api/v1/discussions/:conflictId`, `POST /api/v1/comments`, `POST /api/v1/comments/:id/react`
- [ ] Wire up `POST /api/v1/attachments` (Multer for PDF upload)
- [ ] Subscribe to Socket.io `comment:new` → live append new comments

#### `feat/fe-timeline` — Screen 10: Activity Timeline
- [ ] Build `ActivityTimelinePage.jsx` — multi-project audit trail
- [ ] Left filter sidebar:
  - Search input: "Search Trail"
  - Event type checkboxes: Conflicts (warning icon), Requirements (description icon), Resolutions (check_circle icon), Discussions (forum icon)
  - Projects filter dropdown: All Projects / Lunar Explorer V2 / E-Commerce Migration / Core Security Patch
  - "Export Audit Log" button
- [ ] Main feed: "System Activity — Real-time audit trail of all project modifications and AI resolutions"
- [ ] Date separator: "Today" / "Yesterday" group headers
- [ ] Build `TimelineEvent.jsx` — icon (warning / add_task / chat_bubble / check_circle / person_add / link), actor name, action description, timestamp, project tag
- [ ] Sample events: AI conflict detected, Marcus created REQ-942, Sarah commented, AI resolved #C-118, David assigned module
- [ ] "View Older Activities" load-more button
- [ ] Wire up `GET /api/v1/timeline?projectId=&type=&from=&to=`
- [ ] Subscribe to Socket.io `activity:new` → prepend new events live

#### `feat/fe-analytics` — Screen 11: Analytics Dashboard
- [ ] Build `AnalyticsDashboardPage.jsx`
- [ ] Header: "Project Health Overview — Real-time performance metrics and conflict analysis for Phoenix 2.0"
- [ ] Date range selector ("Last 30 Days") + Download Export Report button
- [ ] Top metric cards using `HealthMetricCard.jsx`:
  - Requirement Clarity: 94.2%, +5.2% vs last week (description icon)
  - Project Readiness: 82%, +2.1% vs last week (rocket_launch icon)
  - Open Conflicts: 12, -14% vs last week (warning icon)
- [ ] Build `ConflictTrendChart.jsx` using Recharts — line chart, Detected vs Resolved, Mon–Sun X-axis, 0–100 Y-axis
- [ ] Build `ConflictTypeDonut.jsx` — Technical Architecture 45%, Business Logic 32%, Compliance & Security 23% (donut/pie chart)
- [ ] Critical Alert banner: "2 Logic conflicts detected in Auth Module" with priority_high icon
- [ ] Development Progress section — Core Engine (Completed), UI Components (In Progress), API Integration (In Progress) — progress bars
- [ ] "View Roadmap" link button
- [ ] Recent Conflict Resolutions list — resolved items with timestamp and resolver name
- [ ] Wire up `GET /api/v1/analytics/:projectId?period=30d`

---

### 👤 Dev 5 — Dhruv Patel — Auth API + All CRUD Routes + DB Schema
**Branches:** `chore/db-schema` · `feat/be-auth-api` · `feat/be-projects-api`

#### `chore/db-schema` *(Dhruv Patel — do first, unblocks everyone)*
- [ ] Provision MongoDB Atlas M0 cluster
- [ ] `User` model — `id, name, email, role (pm|developer|bde|admin), passwordHash, oauthProvider, oauthId, createdAt, refreshToken, aiCreditsUsed, aiCreditsLimit`
- [ ] `Project` model — `id, name, clientName, description, budget, timeline, status, createdBy, teamMembers[], progress, createdAt`
- [ ] `Module` model — `id, projectId, name, description, ownerId, requirements[], status (in-progress|pending|completed|draft), sortOrder, createdAt`
- [ ] `Requirement` model — `id, projectId, moduleId, reqId, title, description, category, priority, stakeholder, tags[], dependencies[], version, status, approvalStatus (pending|approved), source (manual|ai), createdBy, updatedAt`
- [ ] `Conflict` model — `id, projectId, reqA, reqB, conflictType, severityScore, aiConfidence, proposals[], status, detectedAt, resolvedAt, resolvedBy, resolutionApplied`
- [ ] `Vote` model — `id, conflictId, proposalId, userId, voteOption, weight, timestamp`
- [ ] `Comment` model — `id, conflictId, userId, body, parentId, attachments[], reactions[], createdAt`
- [ ] `Attachment` model — `id, commentId, filename, fileSize, mimeType, storagePath, uploadedBy, createdAt`
- [ ] `Report` model — `id, projectId, generatedBy, generatedAt, conflictCount, resolvedCount, downloadUrl, format`
- [ ] Add indexes: `Requirements(projectId, moduleId, status)`, `Conflicts(projectId, status, severityScore)`, `Modules(projectId, sortOrder)`, `Users(email unique)`
- [ ] Seed script (`npm run seed`) — 1 PM user, 2 developer users, 1 BDE user, 2 projects, 5 modules, 10 requirements, 3 conflicts
- [ ] Publish `docs/api-collection.json` Postman collection ← **Dhruv Patel to deliver by end of Week 1 — Shubham, Ansh, Pratik, and Dhruv Mochi are all blocked until this is done**

#### `feat/be-auth-api`
- [ ] `POST /api/v1/auth/register` — Zod validation, bcrypt hash (cost 12), role assignment, return JWT + refresh
- [ ] `POST /api/v1/auth/login` — verify password, return JWT (15min) + refresh token (30d)
- [ ] `POST /api/v1/auth/refresh` — rotate refresh token, issue new JWT
- [ ] `POST /api/v1/auth/logout` — invalidate refresh token
- [ ] `POST /api/v1/auth/forgot-password` + `POST /api/v1/auth/reset-password`
- [ ] `GET /api/v1/auth/google` + `GET /api/v1/auth/google/callback` — Passport.js Google OAuth
- [ ] `GET /api/v1/auth/github` + `GET /api/v1/auth/github/callback` — Passport.js GitHub OAuth *(new in v2)*
- [ ] `GET /api/v1/auth/me` — return user profile with role and AI credits
- [ ] Build `authenticate.js` — verify JWT, attach `req.user`
- [ ] Build `authorize.js` — RBAC guard, accept `allowedRoles[]` array, return 403 if unauthorized
- [ ] Build `validateRequest.js` — Zod schema validation middleware
- [ ] Build `errorHandler.js` — never expose stack traces in production
- [ ] Build `rateLimiter.js` — 100 req/15min per IP

#### `feat/be-projects-api`
- [ ] `GET /api/v1/dashboard/pm` — PM stats: req count, conflict count, module count, dev count, recent projects
- [ ] `GET /api/v1/dashboard/developer` — Dev stats: assigned modules, open conflicts (with critical count), discussions, requirements met %
- [ ] `GET /api/v1/dashboard/bde` — BDE stats: total projects, conflicts today, team count, overall progress, storage usage
- [ ] Projects CRUD: `GET`, `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] `GET /api/v1/modules?projectId=` — list modules with requirements count
- [ ] `POST /api/v1/modules` — create module
- [ ] `PATCH /api/v1/modules/:id` — update module
- [ ] `PATCH /api/v1/modules/reorder` — update sortOrder for drag-and-drop
- [ ] `PATCH /api/v1/modules/:id/assign` — assign team member to module
- [ ] Requirements CRUD (all from v1) + `PATCH /:id/approve` for AI-generated req approval
- [ ] `POST /api/v1/requirements/upload` — Multer CSV, bulk insert
- [ ] Conflicts routes: list, get, resolve, apply-resolution
- [ ] Votes, Comments, Team routes (all from v1)
- [ ] `GET /api/v1/timeline?projectId=&type=&from=&to=` — paginated, filterable
- [ ] `GET /api/v1/timeline/export` — CSV download

---

### 👤 Dev 6 — Aamir — AI Conflict Engine + Gemini + Requirement Generator
**Branches:** `feat/be-conflict-engine` · `feat/be-gemini-integration`

#### `feat/be-conflict-engine` — 7-Step Detection Pipeline
- [ ] `conflictDetector.js` — orchestrator: accepts `projectId`, runs all 7 steps async, saves to Conflicts collection, emits Socket.io events
- [ ] `POST /api/v1/conflicts/analyze/:projectId` — trigger async analysis, return `{ jobId, estimatedTime }`
- [ ] `GET /api/v1/conflicts/analyze/status/:jobId` — poll progress (0–100%)
- [ ] **Step 1** `requirementParser.js` — fetch, validate, normalize all requirements
- [ ] **Step 2** `requirementClassifier.js` — auto-classify uncategorized requirements by keyword matching
- [ ] **Step 3** `pairGenerator.js` — generate n×(n−1)/2 unique pairs
- [ ] **Step 4** `ruleEngine.js` — rule registry + all 4 rule files:
  - `securityVsPerformance.js`
  - `costVsScalability.js`
  - `encryptionVsLatency.js`
  - `eeaVsGlobalReplication.js` (EEA, GDPR, data residency vs global, mirror, replicate)
- [ ] **Step 5** `geminiAnalyzer.js` — batch AI analysis (see Gemini branch)
- [ ] **Step 6** `severityScorer.js` — `Severity = PriorityWeight × ImpactFactor × StakeholderWeight`, output 1–10
- [ ] **Step 7** `feasibilityEstimator.js` — timeline %, cost %, risk level lookup table per conflict type
- [ ] Unit tests for all 4 rules + severity scorer with edge cases
- [ ] Mock Gemini responses in `tests/__mocks__/gemini.js`

#### `feat/be-gemini-integration` — Gemini AI Client + Requirement Generator
**Conflict Analysis Prompt:**
```
You are a software requirements conflict analyzer.
Analyze these two requirements for logical, semantic, or technical conflicts.

Requirement A (ID: {id}, Category: {category}): {description}
Requirement B (ID: {id}, Category: {category}): {description}

Respond ONLY in valid JSON:
{
  "conflicted": true | false,
  "conflictType": "e.g. Scalability vs Compliance",
  "confidence": 0.0–1.0,
  "explanation": "one sentence"
}
```

**Tasks:**
- [ ] Set up `@google/generative-ai` SDK in `gemini.js`
- [ ] `geminiAnalyzer.js` — batch pairs (max 20/call), implement retry (3 attempts, exp backoff 1s/2s/4s), parse + validate JSON response
- [ ] Request queue — max 10 concurrent Gemini calls
- [ ] Log all calls with token usage for AI credit tracking → update `user.aiCreditsUsed`
- [ ] `requirementGenerator.js` — **new in v2**:
  - `POST /api/v1/ai/generate-requirements` — accepts `{ projectId, description }`
  - Prompt: "Based on this project description, generate 5–10 structured software requirements. For each, provide: title, description, priority (high/medium/low), category, module tag. Return as JSON array."
  - Save generated requirements with `source: 'ai'` and `approvalStatus: 'pending'`
  - Return requirements for AI Generator screen
- [ ] `POST /api/v1/ai/preview-requirements` — lightweight version for Create Project live preview (returns 3 suggestions, no DB save)
- [ ] `POST /api/v1/ai/analyze-requirement` — single requirement analysis for Requirement Editor AI assistant:
  - Return: ambiguity warnings, missing edge cases, security suggestions, conflicts with existing requirements
- [ ] Write mock responses for all 3 Gemini endpoints for use in tests

---

### 👤 Dev 7 — Feenel — Real-time + Analytics API + Reports + File Uploads
**Branches:** `feat/be-socket-events` · `feat/be-analytics-api` · `feat/be-reports-api`

#### `feat/be-socket-events`
- [ ] Initialize Socket.io in `server.js` alongside Express
- [ ] `socketHandler.js` — JWT authentication on connect, join project rooms (`project:${projectId}`)
- [ ] `conflictEvents.js` — emit `conflict:new` → `{ conflictId, type, severity, reqATitle, reqBTitle, projectId }`
- [ ] `activityEvents.js` — emit `activity:new` on any CRUD action → `{ eventType, actorName, actorRole, description, timestamp, projectId }`
- [ ] `voteEvents.js` — emit `vote:update` → `{ conflictId, proposalId, support, oppose }`
- [ ] `commentEvents.js` — emit `comment:new` → `{ conflictId, commentId, authorName, body, timestamp }` *(new in v2)*
- [ ] `moduleEvents.js` — emit `module:updated` → `{ moduleId, status, assignee }` *(new in v2)*
- [ ] Emit `analysis:progress` during conflict detection (0%, 25%, 50%, 75%, 100%)
- [ ] Handle disconnect — clean up room memberships
- [ ] Integration tests using `socket.io-client` in test mode

#### `feat/be-analytics-api` *(new in v2)*
- [ ] `GET /api/v1/analytics/:projectId?period=30d` — return all metrics:
  - `requirementClarity` — % of requirements with no ambiguity flags from AI
  - `projectReadiness` — % of requirements in approved/completed state
  - `openConflicts` — count with % change vs previous period
  - `conflictTrends` — daily detected vs resolved counts for chart (last 7 days)
  - `conflictsByType` — breakdown by type (Technical Architecture, Business Logic, Compliance)
  - `developmentProgress` — per-module completion %
  - `recentResolutions` — last 5 resolved conflicts with resolver + timestamp
- [ ] `GET /api/v1/analytics/summary` — cross-project summary for BDE dashboard
- [ ] Aggregate queries using MongoDB aggregation pipeline (not in-app loops)
- [ ] Cache analytics responses for 5 minutes (use in-memory cache, e.g. `node-cache`)

#### `feat/be-reports-api`
- [ ] `POST /api/v1/reports/generate` — async PDF generation job, return `{ reportId }`
- [ ] `GET /api/v1/reports/:projectId` — list reports
- [ ] `GET /api/v1/reports/download/:reportId` — stream PDF
- [ ] `pdfGenerator.js` with PDFKit:
  - Cover: project name, client, date, generated by
  - Executive summary: req count, conflict count, readiness score
  - Conflict detail pages: side-by-side reqs, AI proposal, resolution status, vote tally
  - Feasibility impact table
  - Activity log (last 30 days)
- [ ] `POST /api/v1/attachments` — Multer upload for PDF attachments in discussions:
  - Validate: PDF/PNG/JPG only, max 10MB
  - Save to `uploads/attachments/` directory
  - Save metadata to `Attachment` model
  - Return `{ attachmentId, filename, downloadUrl }`
- [ ] `GET /api/v1/attachments/:id` — stream file to client
- [ ] `GET /api/v1/timeline/export` — stream CSV of activity log
- [ ] `reportGeneratorJob.js` — nightly cron job to flag stale reports

---

## 🔄 Git Workflow

### Starting a Feature
```bash
# Always branch from latest develop
git checkout develop
git pull origin develop
git checkout -b feat/fe-pm-dashboard
```

### Stay in Sync Daily
```bash
git fetch origin
git rebase origin/develop
# Resolve conflicts, then:
git push origin feat/fe-pm-dashboard --force-with-lease
```

### Commit Message Format (Conventional Commits)
```
feat: add PM dashboard with stat cards and AI insight banner
feat: add module drag-and-drop reordering with @dnd-kit
fix: resolve comment thread not updating in real time
chore: add Module mongoose model with sortOrder index
test: add unit tests for requirementGenerator Gemini prompt
refactor: extract ResolutionProposalCard into shared component
docs: update API reference with analytics endpoints
```

### Opening a Pull Request
1. Push branch → GitHub
2. Open PR: `your-branch` → `develop` (never directly to `main`)
3. Fill PR template — what changed, how to test, screenshots for any UI change
4. Tag a reviewer from the same domain (FE reviews FE, BE reviews BE)
5. All CI checks must pass (lint + test + build)
6. **Squash and merge** to keep `develop` history clean

### Hotfix
```bash
git checkout main && git pull
git checkout -b hotfix/fix-gemini-timeout
# Fix → PR to main → PR to develop
```

---

## ⚙️ Environment Setup

### Prerequisites
- Node.js 20.x, npm 10.x
- MongoDB Atlas account (free M0 tier)
- Google Cloud project (OAuth credentials)
- GitHub OAuth App (Settings → Developer settings → OAuth Apps)
- Google AI Studio account (Gemini API key)

### Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5173
```

**`frontend/.env.example`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
```

### Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5000
```

**`backend/.env.example`**
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/conflict-resolver-ai

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro
GEMINI_MAX_CONCURRENT=10

# Frontend
FRONTEND_URL=http://localhost:5173

# Storage
UPLOADS_DIR=./uploads
REPORTS_DIR=./uploads/reports
ATTACHMENTS_DIR=./uploads/attachments
MAX_ATTACHMENT_SIZE_MB=10
```

### Run With Docker
```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# MongoDB:  localhost:27017
```

### Seed Database
```bash
cd backend && npm run seed
# Creates: 4 users (PM, 2 devs, BDE), 2 projects, 5 modules, 10 requirements, 3 conflicts
```

---

## 📡 API Reference

> Full Postman collection: `docs/api-collection.json` (published by Dev 5, Week 1)

**Base URL:** `http://localhost:5000/api/v1`

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register with role selection |
| POST | `/auth/login` | Public | Login, receive JWT |
| POST | `/auth/refresh` | Public | Rotate JWT |
| GET | `/auth/google` | Public | Google OAuth flow |
| GET | `/auth/github` | Public | GitHub OAuth flow *(new)* |
| GET | `/auth/me` | Bearer | Current user + AI credits |

### Dashboard Endpoints *(new in v2)*
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/pm` | PM only | PM stats + active projects |
| GET | `/dashboard/developer` | Dev only | Dev's modules + conflicts |
| GET | `/dashboard/bde` | BDE only | Cross-team overview |

### Project & Module Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/projects` | Bearer | List user's projects |
| POST | `/projects` | Bearer | Create project |
| GET | `/modules?projectId=` | Bearer | List modules |
| POST | `/modules` | Bearer | Create module |
| PATCH | `/modules/reorder` | Bearer | Update drag-and-drop order |
| PATCH | `/modules/:id/assign` | PM only | Assign developer |

### Requirements & AI Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/requirements/upload` | Bearer | CSV bulk upload |
| PATCH | `/requirements/:id/approve` | PM only | Approve AI-generated req |
| POST | `/ai/generate-requirements` | PM only | Full AI req generation |
| POST | `/ai/preview-requirements` | Bearer | Live preview (no DB save) |
| POST | `/ai/analyze-requirement` | Bearer | Single req AI analysis |

### Conflict Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/conflicts/analyze/:projectId` | Bearer | Trigger full AI analysis |
| GET | `/conflicts/analyze/status/:jobId` | Bearer | Poll analysis progress |
| GET | `/conflicts/:id` | Bearer | Conflict detail with proposals |
| POST | `/conflicts/:id/apply-resolution` | Editor+ | Apply chosen proposal |

### Analytics & Reports *(new in v2)*
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/analytics/:projectId?period=30d` | Bearer | All health metrics |
| GET | `/analytics/summary` | BDE only | Cross-project summary |
| POST | `/attachments` | Bearer | Upload file attachment |
| GET | `/attachments/:id` | Bearer | Download attachment |

---

## 🗄️ Database Schema

### Collections (9 total, 2 new in v2)

```
users            → Auth, roles, AI credit tracking
projects         → Project metadata (+ clientName, budget in v2)
modules          → NEW — architectural modules with sortOrder
requirements     → Requirements (+ moduleId, approvalStatus, source in v2)
conflicts        → Detected conflicts with AI proposals array
votes            → Stakeholder votes
comments         → Threaded discussion (+ attachments[] in v2)
attachments      → NEW — uploaded file metadata
reports          → Generated PDF reports
```

### Key Relationships
```
User (1) ──────────── (many) Project
Project (1) ─────────── (many) Module
Module (1) ──────────── (many) Requirement
Requirement (2) ───────── (1) Conflict
Conflict (1) ──────────── (3) ResolutionProposal (embedded in Conflict)
Conflict (1) ──────────── (many) Comment
Comment (1) ──────────── (many) Attachment
```

---

## 🤖 Conflict Detection Pipeline

```
POST /conflicts/analyze/:projectId
        │
        ▼
┌─────────────────────────┐
│ 1. Requirement Parser   │  Fetch all requirements from MongoDB, validate fields
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 2. Classifier           │  Auto-categorize by keyword matching
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 3. Pair Generator       │  n×(n-1)/2 unique pairs
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 4. Rule Engine          │  4 deterministic rules (fast, no API cost)
└──────────┬──────────────┘
     ┌─────┴──────┐
     ▼            ▼
  Flagged      Unflagged
  by rule      pairs
     │            │
     │            ▼
     │   ┌─────────────────┐
     │   │ 5. Gemini AI    │  Semantic analysis — batch 20 pairs/call
     │   └────────┬────────┘
     └────────────┤
                  ▼
        ┌─────────────────────┐
        │ 6. Severity Scorer  │  Priority × Impact × Stakeholder Weight → 1–10
        └──────────┬──────────┘
                   ▼
        ┌─────────────────────┐
        │ 7. Feasibility Est. │  Timeline %, Cost %, Risk Level
        └──────────┬──────────┘
                   ▼
        Save to MongoDB
        Emit Socket.io events (conflict:new, analysis:progress)
        Update AI Credits usage
```

---

## 🚀 Running the Project

```bash
# Both servers (two terminals)
cd backend  && npm run dev   # http://localhost:5000
cd frontend && npm run dev   # http://localhost:5173

# Tests
cd backend  && npm test && npm run test:coverage
cd frontend && npm test

# Seed database
cd backend && npm run seed

# Production build
cd frontend && npm run build   # Output: frontend/dist/
cd backend  && npm start
```

---

## ✔️ Definition of Done

A branch is ready for PR when all of the following are true:

- [ ] Feature matches the Stitch v2 prototype design exactly
- [ ] All role-based access rules enforced (correct users see correct screens/data)
- [ ] No ESLint errors on `npm run lint`
- [ ] All new API endpoints return correct HTTP status codes
- [ ] Form validation shows inline errors, never silent failures
- [ ] Dark mode tested on all new components
- [ ] Mobile responsive at 375px, 768px, 1280px
- [ ] Socket.io events fire correctly for real-time features
- [ ] Unit or integration tests written for all non-trivial logic
- [ ] No `console.log()` left in production code
- [ ] PR template fully completed with screenshots for UI changes
- [ ] At least 1 peer review approval received

---

## 📐 Contributing Guidelines

### Code Style
- Components → **PascalCase** (`PMDashboardPage.jsx`, `ModuleCard.jsx`)
- Hooks, services, utils → **camelCase** (`useModules.js`, `moduleService.js`)
- API routes → **kebab-case** (`/ai/generate-requirements`)
- DB fields → **camelCase** (`approvalStatus`, `sortOrder`)
- Follow ESLint config in both `frontend/` and `backend/`

### Getting Help
| Situation | Action |
|---|---|
| Blocked waiting for API endpoint | Check `docs/api-collection.json` for mock, message Dev 5 |
| Design question on a screen | Open corresponding HTML file from `stitch_authentication_page 3/` |
| Merge conflict | `git rebase origin/develop` — never `git merge develop` |
| Emergency production bug | `hotfix/<id>` from `main`, tag team lead immediately |
| Gemini API question | Check `feat/be-gemini-integration` docs, message Dev 6 |

---

## 📅 Milestones

| Milestone | Week | Deliverable |
|---|---|---|
| M1 — Foundation | Week 2 | Auth live (Google + GitHub), DB schema + seed done, layout + role routing done, Postman collection published |
| M2 — Dashboards | Week 4 | All 3 role dashboards done, Create Project page + AI preview live, Module management with drag-and-drop |
| M3 — Core Intelligence | Week 6 | Requirement Editor with AI assistant, Conflict Detection with 3 proposals, Discussion with file attachments, AI Requirement Generator |
| M4 — Real-time & Analytics | Week 7 | Socket.io events live, Analytics dashboard with charts, Activity Timeline |
| M5 — Reports & Launch | Week 8 | PDF reports, full CI/CD, security audit, production deploy |

---

<div align="center">

**Conflict Resolver AI** · v2.0 · 12 Screens · 7 Developers · React + Node.js + MongoDB + Gemini AI

</div>
