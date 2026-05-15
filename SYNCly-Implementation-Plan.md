# Syncly Implementation Plan

This document converts the project requirements into a practical build plan for the current codebase.

## 1) Delivery Phases

### Phase 1: Core MVP (Now)
Goal: Deliver a stable single-workspace productivity app with authentication, Kanban task flow, in-app notifications, and profile management.

Deliverables:
- Auth screens and session handling
- Task CRUD with Kanban drag-and-drop
- Task comments/activity
- Due-date and comment notifications (in-app)
- Responsive dashboard + settings profile

Exit criteria:
- User can sign in, manage tasks, track updates, and receive actionable notifications.
- App runs cleanly in desktop and mobile layouts.

### Phase 2: Collaboration + Realtime
Goal: Enable multi-user workspace collaboration using Supabase realtime.

Deliverables:
- Workspace creation and membership
- Task sharing by workspace
- Realtime task/comment/notification sync
- Activity log visibility per workspace

Exit criteria:
- Two users in one workspace see task and comment changes live.

### Phase 3: Productivity + Files + Analytics
Goal: Add productivity acceleration tools and richer data insights.

Deliverables:
- Pomodoro/focus timer module
- Focus session history
- Attachment upload/download via Supabase Storage
- Analytics dashboard backed by real data

Exit criteria:
- User can run focus sessions, attach files to tasks, and review productivity trends.

### Phase 4: Hardening + Release
Goal: Production quality and deployment.

Deliverables:
- Error handling, loading states, empty states
- Route protection and policy checks
- Performance tuning (bundle splitting, lazy pages)
- Deployment to Vercel + Supabase with environment configs

Exit criteria:
- Production deployment complete with stable UX and acceptable performance.

## 2) Requirement-to-Module Mapping

## Authentication System
Current:
- Pages exist: `src/pages/Login.jsx`, `src/pages/Signup.jsx`

Build/Refine:
- `src/contexts/AuthContext.jsx` (new)
- `src/lib/supabaseClient.js` (new)
- Route guards in `src/App.jsx`
- Password recovery flow page (new)

## Dashboard
Current:
- `src/pages/Dashboard.jsx`

Build/Refine:
- Connect dashboard cards to real task/activity data
- Add “recent activity” from task activity logs

## Task Management (Kanban)
Current:
- `src/pages/Tasks.jsx` with drag-and-drop and modal editing

Build/Refine:
- Persist by authenticated user/workspace
- Standardize task schema for Supabase
- Add reminder scheduling logic from due dates

## Workspace Collaboration
Current:
- `src/pages/Workspaces.jsx` exists (UI level)

Build/Refine:
- Workspace data model + membership model
- Invite flow and member roles
- Workspace-scoped task filtering

## Notification System
Current:
- `src/contexts/NotificationContext.jsx`
- `src/components/ui/NotificationsPanel.jsx`
- `src/components/layout/Navbar.jsx` badge + panel

Build/Refine:
- Supabase realtime-backed notifications
- Read/unread persisted per user
- Notification categories and filters

## File Management
Current:
- Not implemented

Build/Refine:
- `src/components/tasks/TaskAttachmentUploader.jsx` (new)
- Storage bucket integration via Supabase
- File metadata linked to tasks

## Productivity Tools
Current:
- Not implemented

Build/Refine:
- `src/pages/Focus.jsx` (new)
- `src/components/focus/PomodoroTimer.jsx` (new)
- Focus session storage + analytics integration

## Settings & Profile
Current:
- `src/pages/Settings.jsx`
- `src/components/ui/ProfileInfoModal.jsx`

Build/Refine:
- Profile sync with Supabase auth user/profile table
- Notification preferences panel backed by DB

## 3) Prioritized Backlog

Priority legend:
- P0: must-have for MVP
- P1: important next
- P2: enhancement

### P0 - Foundation + MVP
1. Add Supabase client setup and environment config (`.env`, client module).
2. Implement Auth context with session bootstrapping and route guards.
3. Move task data from localStorage to Supabase tables (or dual-write transition).
4. Add workspace foreign keys to tasks and activity logs.
5. Finish notification actions end-to-end with persistent read status.
6. Add robust task deep-links (`/tasks?taskId=`) and modal open behavior across refresh.
7. Add global error boundary and loading skeletons for key pages.

### P1 - Collaboration + Realtime
1. Implement workspace members and invite acceptance flow.
2. Add realtime subscriptions for tasks/activity/notifications.
3. Add task ownership and assignment rules.
4. Add notification types for mentions, assignment changes, and workspace events.

### P1 - File + Security
1. Implement task attachments (upload, list, remove).
2. Add file type and size validation.
3. Add Supabase Row Level Security policies for user/workspace isolation.

### P2 - Productivity + Analytics
1. Implement Pomodoro timer with session save.
2. Add analytics widgets based on completed tasks, overdue tasks, and focus minutes.
3. Build weekly/monthly trend charts and export-ready summaries.

## 4) Suggested Supabase Schema (Initial)

- `profiles`
  - `id` (uuid, PK, references auth.users)
  - `display_name`, `avatar_url`, `created_at`

- `workspaces`
  - `id` (uuid, PK)
  - `name`, `owner_id`, `created_at`

- `workspace_members`
  - `workspace_id`, `user_id`, `role`, `joined_at`

- `tasks`
  - `id` (uuid, PK)
  - `workspace_id`, `title`, `description`, `status`, `priority`, `assignee_id`, `due_date`, `created_by`, `created_at`, `updated_at`

- `task_comments`
  - `id` (uuid, PK)
  - `task_id`, `author_id`, `message`, `created_at`

- `activity_logs`
  - `id` (uuid, PK)
  - `workspace_id`, `task_id`, `actor_id`, `event_type`, `payload`, `created_at`

- `notifications`
  - `id` (uuid, PK)
  - `user_id`, `type`, `title`, `message`, `path`, `is_read`, `created_at`

## 5) Immediate Next Sprint (Recommended)

Sprint target: ship production-ready MVP data layer.

1. Supabase integration bootstrap (auth + DB client).
2. Replace localStorage task persistence with Supabase CRUD.
3. Persist comments/activity in DB and sync notifications from DB changes.
4. Add auth-guarded routes and workspace scoping.
5. QA pass: task flows, notification click-through, responsive behavior.

## 6) Definition of Done (MVP)

- Auth, tasks, comments, notifications, and profile data are user-scoped and persisted in Supabase.
- Notification click takes user directly to the relevant task context.
- Mobile and desktop layouts are usable for all core pages.
- Build succeeds and no critical console/runtime errors remain.
