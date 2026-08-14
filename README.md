# Task Management System — Full Stack Developer Assessment

A modern, full-stack Task Management System built strictly following the Figma assessment design specifications. The application features complete task and project management, interactive list and kanban board views with drag-and-drop status changes, customizable themes with local persistence, real-time toast feedback, comprehensive search, filters, pagination, and a modular NestJS REST API backed by MongoDB.

---

## 1. Project Overview

The **Task Management System** provides teams with a centralized workspace to organize, track, and execute work efficiently across multiple projects and statuses.

### Key Capabilities:
- **Dual View Modes**: Switch seamlessly between a structured **List View** grouped by status and a dynamic 4-column **Board (Kanban) View**.
- **Interactive Task Controls**: Add, edit, delete, and modify task properties (status, priority, assignee, due date, labels) inline or through modal dialogs.
- **Drag-and-Drop Workflow**: Drag tasks between status columns on the Board view to update status in real time.
- **Search, Filter & Pagination**: Case-insensitive multi-field search (matching title, description, status, priority, project, labels, assignee, reporter, due date), multi-select dropdown filters, and accessible pagination.
- **Project Tracking**: Overview of active/planning/completed projects and dedicated Project Detail pages with associated tasks.
- **Guest Authentication & User Profile**: One-click "Continue as Guest" access, user profile, account settings, and logout flows.
- **Theme Customization**: Light/Dark appearance modes paired with 6 color accents (Amber, Blue, Pink, Rose, Emerald, Black), persisted in `localStorage`.
- **Toast Notifications**: Clean, non-intrusive notifications for user actions and error feedback powered by `react-toastify`.

---

## 2. Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, custom HSL design system tokens
- **Notifications**: `react-toastify`
- **Icons**: Accessible custom SVG icon components
- **State & Storage**: React hooks, `localStorage` for theme and accent persistence

### Backend
- **Framework**: NestJS 11, TypeScript
- **Database**: MongoDB via `@nestjs/mongoose` / `mongoose` (with `mongodb-memory-server` for zero-configuration local runs)
- **Validation**: `class-validator`, `class-transformer`, global NestJS `ValidationPipe`
- **Architecture**: Modular domain structure (`tasks`, `projects`, `subtasks`, `comments`, `labels`, `teams`, `users`, `workspaces`, `resources`)

---

## 3. Implemented Features

| Feature | Description |
|---|---|
| **Guest Login** | One-click instant workspace access via "Continue as Guest" on the Sign-In screen. |
| **Authentication Flow** | Form validation, sign-in, guest entry, and clean logout toast notifications. |
| **Responsive Layout** | Mobile-first responsive app shell with sidebar navigation, header, and smooth transitions. |
| **Theme & Color Modes** | Light & Dark modes + 6 accent themes (Amber, Blue, Pink, Rose, Emerald, Black) with hydration-safe `localStorage` persistence. |
| **4 Task Statuses** | Standardized workflow: **To Do**, **Doing**, **Completed**, and **On Hold**. |
| **Tasks List View** | Grouped by status with collapsible sections, interactive table cells, and floating action dropdowns. |
| **Tasks Board View** | 4-column Kanban layout with HTML5 drag-and-drop status transitions and column counters. |
| **Task CRUD** | Full Add Task modal, Edit Task modal, and Delete Task with confirmation. |
| **Task Detail View** | Comprehensive detail page with subtasks checklist, comments thread, attached resources, and activity update logs. |
| **Inline Task Editing** | Quick inline selectors for Status, Priority, Assignee, Due Date, and Labels in table rows and detail screens. |
| **Search Functionality** | Fast, case-insensitive search evaluating title, description, project, labels, members, reporter, due date, and status keywords. |
| **Multi-Select Filters** | Independent multi-select filters for Status, Priority, Members, Due Date Ranges, Teams, Labels, and Reporters. |
| **Pagination** | Figma-consistent pagination control with page size selector (`5`, `10`, `20`, `50`), page numbering, disabled boundary states, and zero layout shift. |
| **Projects Overview** | Project tracking table displaying status, lead, priority, deadline, and task counts. |
| **Project Detail Page** | Project metadata overview with linked tasks grouped by workflow status. |
| **Workspace Selector** | Workspace switching header component for multi-workspace navigation. |
| **Profile & Settings** | User profile page, account settings, and theme customization screens. |
| **Toast Notifications** | Toast feedback for task/project creation, edits, deletions, status changes, comments, and API error states with deduplication. |

---

## 4. Project Structure

```text
Ag-assignment/
├── frontend/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with ThemeProvider & AppToastContainer
│   │   ├── globals.css           # Design tokens, theme variables & Toastify styles
│   │   ├── login/page.tsx        # Sign-in & Guest access page
│   │   ├── tasks/                # Tasks page & dynamic [taskId] detail page
│   │   ├── projects/             # Projects list & dynamic [projectId] detail page
│   │   ├── profile/page.tsx      # User profile page
│   │   └── settings/             # Settings, Theme, and Color preference pages
│   ├── components/
│   │   ├── auth/                 # Login & authentication components
│   │   ├── layout/               # AppShell, Sidebar, Header, WorkspaceSelector
│   │   ├── profile/              # User menu & profile components
│   │   ├── projects/             # Project tables, actions, and detail screens
│   │   ├── settings/             # Theme & color mode settings controls
│   │   ├── tasks/                # List table, Board view, Add/Edit dialogs, selectors
│   │   ├── theme/                # ThemeProvider & theme context
│   │   └── ui/                   # Button, Badge, Dropdown, Input, Pagination, ToastContainer
│   ├── constants/                # Navigation items, theme presets, user constants
│   ├── hooks/                    # useTasks, useProjects, useWorkspaces, useFloatingPosition
│   ├── lib/                      # Date helpers, task options, toast helper, class utilities
│   ├── services/                 # API client, taskService, projectService, commentService
│   └── types/                    # TypeScript interfaces & domain types
└── backend/
    ├── src/
    │   ├── common/               # DTOs, enums, base services
    │   ├── config/               # Application configuration
    │   ├── database/             # Mongoose schemas, seed data & memory server fallback
    │   ├── modules/              # Tasks, Projects, Comments, Labels, Teams, Users, Workspaces
    │   ├── app.module.ts         # Root NestJS module
    │   └── main.ts               # Application bootstrap
    ├── package.json
    └── .env.example
```

---

## 5. Running Locally

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+ or v10+)
- MongoDB (optional — an in-memory MongoDB instance is automatically used if local MongoDB is not running)

### Step 1: Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 2: Configure Environment Variables

**Backend (`backend/.env`):**
```env
APP_PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/ag_assignment
MONGODB_USE_MEMORY=false
```
*(If MongoDB is not running locally, set `MONGODB_USE_MEMORY=true` or leave default for automatic memory fallback).*

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Step 3: Start the Backend Server
```bash
cd backend
npm run start:dev
```
The NestJS API server will start on `http://localhost:4000` (all REST endpoints prefixed with `/api`).

### Step 4: Start the Frontend Application
```bash
cd frontend
npm run dev
```
The Next.js application will start on `http://localhost:3000`.

---

## 6. Verification Commands

### Frontend Validation
```bash
cd frontend
npm run lint          # Run ESLint check
npm run type-check    # Run TypeScript compiler check (tsc --noEmit)
npm run build         # Build production bundle with Next.js Turbopack
```

### Backend Validation
```bash
cd backend
npm run lint          # Run ESLint check
npm run type-check    # Run TypeScript compiler check (tsc --noEmit)
npm run build         # Build NestJS production output
```

---

## 7. Backend & API Overview

All backend endpoints are prefixed with `/api` and validated via class-validator DTOs:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET`, `POST` | `/api/tasks` | List tasks (with filter params) and create task |
| `GET`, `PATCH`, `DELETE` | `/api/tasks/:id` | Get task by ID, update properties, or delete task |
| `GET`, `POST` | `/api/projects` | List all projects and create project |
| `GET`, `PATCH`, `DELETE` | `/api/projects/:id` | Get project by ID, update project, or delete project |
| `GET`, `POST` | `/api/subtasks` | Retrieve and manage task subtasks |
| `GET`, `POST` | `/api/comments` | Retrieve and post task comments |
| `GET`, `POST` | `/api/labels` | Retrieve and create task labels |
| `GET`, `POST` | `/api/teams` | Team entity management |
| `GET`, `POST` | `/api/users` | User management |
| `GET`, `POST` | `/api/workspaces` | Workspace entity management |
| `GET`, `POST` | `/api/resources` | Task resource link attachments |
| `GET`, `POST` | `/api/task-updates` | Activity update logs |

---

## 8. Design & Figma Alignment

- The user interface was developed strictly against the provided Figma assessment specifications.
- **Intentional Deviations**: There are **no known intentional deviations**. Layout hierarchies, button shapes, typography scale, surface colors, status pill styles, spacing, avatar initials, dropdown menus, and dialogs match the Figma design brief.

---

## 9. Latest Validation Results

```text
Frontend:
✓ npm run lint         — Passed (0 errors, 0 warnings)
✓ npm run type-check   — Passed (0 errors)
✓ npm run build        — Passed (Next.js production build succeeded)

Backend:
✓ npm run lint         — Passed (0 errors, 0 warnings)
✓ npm run type-check   — Passed (0 errors)
✓ npm run build        — Passed (NestJS compilation succeeded)
```

---

## 10. Submission Information

- **GitHub Repository**: `[TO BE ADDED AFTER MANUAL PUSH]`
- **Live Demo URL**: `[TO BE ADDED AFTER DEPLOYMENT]`
- **Part 2 Submission**: `[TO BE ADDED]`

> **Note**: As specified in the assessment guidelines, the repository will remain public and the deployment active for at least 45 days after submission.

---

## 11. Part 2 — Product Understanding (Assessment Requirement)

Part 2 of the assessment requires a walkthrough (written document with screenshots OR a video walkthrough) analyzing the **AbleSpace Take Data screen from the Caseload tab**:

- **Workflow Explanation**: Clear description of the user workflow from a practitioner's perspective.
- **Identified UX/UI Improvements**: Actionable improvements for information architecture, visual clarity, and interaction flow.
- **Identified Functionality Improvements**: Suggested enhancements for efficiency, data collection reliability, and usability.

*Part 2 walkthrough artifact is to be submitted alongside Part 1.*
