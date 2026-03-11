# RCFA

1. Frontend Engineer – Core UI – Pratik and Dhruv
Responsible for building the main user interface.
Responsibilities:-
Layout
Navigation
Project dashboard
Project creation UI
Requirement list UI
Technologies
React
Tailwind
shadcn/ui
Pages
Login page
Dashboard
Project page
Requirement list page
Output
 Frontend skeleton that other frontend members can plug into.

---------------------------------------------------------------------------------------------

2. Frontend Engineer – Visualization & Interaction – Ansh and Vaishnavi
Responsible for advanced UI components.
Responsibilities:-
Conflict graph visualization
Voting UI
Charts and analytics
Interactive UI component
Technologies
React Flow
Chart libraries
Socket.io client
Features
Conflict relationship graph
Severity visualization
Voting interface
Live updates



------------------------------------------------------------------------------------------

3.  Backend Engineer — Core System & Authentication
This person builds the foundation of the backend. Everything else depends on this.
Responsibilities
Server setup
Express server configuration
Global middleware
Error handling
Authentication
User registration
Login system
Password hashing
JWT authentication
User management
Role-based access control
User profiles
Project management
Create project
Update project
Delete project
Assign stakeholders

Collections handled
Users
 Projects
Main APIs
POST /auth/register
POST /auth/login
GET /users/profile

POST /projects
GET /projects
GET /projects/:id
PUT /projects/:id
DELETE /projects/:id

--------------------------------------------------------------------------------------

4.Backend Engineer — Requirement Processing & Data Management
This person manages all requirement-related operations.
Responsibilities
CSV Upload System
Upload CSV file
Parse requirements
Requirement CRUD
Create requirement
Edit requirement
Delete requirement

Requirement classification
 Automatically categorize requirements into:
Functional
Performance
Security
Cost
Scalability
Validation
Check duplicate requirements
Validate CSV format

Collections handled
Requirements
Main APIs
POST /requirements/upload
POST /requirements
GET /requirements/project/:projectId
PUT /requirements/:id
DELETE /requirements/:id
Libraries
Example tools this developer may use:
multer (file upload)
csv-parser
This module feeds data into the conflict detection engine.

-------------------------------------------------------------------------------

5.Backend Engineer — Conflict Detection, AI & Voting System
This is the core intelligence of the project.
This person builds the main algorithm and AI integration.
Responsibilities
Conflict Detection Engine
Pairwise comparison algorithm
If there are n requirements, comparisons are calculated using:
n(n-1)/2
Example
 50 requirements → 1225 comparisons
Rule-based conflict detection.
Example rules:
Security vs Performance
 Cost vs Scalability
 Encryption vs Latency

AI Integration (Gemini)
Send requirement pairs to Gemini API.
Example:
Input
Requirement A: AES-256 encryption
Requirement B: Dashboard must load in <1 second
AI output:
Conflict Type: Security vs Performance
Confidence: 91%
Explanation: Encryption increases processing overhead.

Severity Calculation
Severity formula:
Severity = Priority × Impact × Stakeholder Weight
This score helps decide which conflicts are most critical.

Voting System
Stakeholders vote on resolutions.
Responsibilities
Vote creation
Vote counting
Weighted voting
Optional real-time updates with Socket.io.

Collections handled
Conflicts
 Votes
 Reports

APIs
POST /conflicts/analyze
GET /conflicts/project/:projectId

POST /votes
GET /votes/conflict/:id

POST /reports/generate
GET /reports/project/:id







