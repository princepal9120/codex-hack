# Frontend ↔ Backend Connectivity Reference

_Last reviewed: 2026-04-16_

This note captures how the live CodexFlow frontend currently talks to the task backend, which routes are user-facing, and which gaps still need follow-up. It is intended as the single reference for landing, board, task detail, create, retry, run, and timeline behavior.

## Live surface map

### Landing (`app/page.tsx`)
- Calls `fetchTasks()` from `components/task-api.ts` on mount.
- Reads the live `/api/tasks` collection and derives:
  - summary counts
  - the featured task preview
  - the landing-page “connected to live pipeline” footer state
- Current refresh contract: **one fetch on mount only**.
- Implication: the landing page can go stale while a task is running unless the page is revisited or refreshed.

### Board (`app/board/page.tsx`)
- Calls `fetchTasks()` on mount and renders the live task collection.
- Uses the list payload as the source of truth for:
  - kanban columns
  - list ordering
  - selected-task summary in the board shell
- Current refresh contract: **one fetch on mount only**.
- Implication: create/retry/status updates are live-backed at load time, but the page does not currently repoll after mount.

### Task detail (`features/dashboard/task-detail.tsx`)
- Calls `fetchTask(id)` against `/api/tasks/[id]`.
- Polls every **3 seconds** while the task is non-terminal.
- Exposes an operator refresh button for an immediate re-fetch.
- Uses `retryTask(id)` to requeue completed work through `/api/tasks/[id]/retry`.
- This is currently the strongest live contract in the app.

## API contract summary

### `GET /api/tasks`
Primary collection endpoint.

Used by:
- landing page
- board page

Expected payload:
- task collection used for list/status/count rendering
- enough metadata for previews and high-level board cards

### `POST /api/tasks`
Create-and-queue entry point for new tasks.

Used by:
- `components/CreateTaskModal.tsx`

Behavior:
- validates repo path and verification commands through `lib/config.ts`
- persists the task
- immediately queues execution

### `GET /api/tasks/[id]`
Primary detail endpoint.

Used by:
- dedicated task detail route

Behavior:
- returns the normalized task record, including timeline, verification, diff, logs, and failure metadata

### `POST /api/tasks/[id]/retry`
Preferred user-facing requeue endpoint for completed tasks.

Used by:
- `features/dashboard/task-detail.tsx`

Behavior:
- resets the task for retry
- requeues execution
- returns the refreshed task

### `POST /api/tasks/[id]/run`
Internal/manual run endpoint.

Current status:
- implemented server-side
- **not wired to any current frontend control**

Behavior:
- only accepts tasks already in `queued` or `running`
- rejects completed tasks and instructs callers to use retry instead

Documentation decision:
- treat this as an **internal control surface** until a product-level “run now” action is intentionally exposed in the UI

### `POST /api/tasks/[id]`
Legacy compatibility path that currently behaves like retry.

Current status:
- implemented in `app/api/tasks/[id]/route.ts`
- not used by the frontend

Documentation decision:
- prefer `/api/tasks/[id]/retry` for all user-facing retry behavior
- treat `POST /api/tasks/[id]` as compatibility behavior, not the primary contract

### Timeline
Timeline data is returned as part of the task detail payload and is rendered by `TaskTimelinePanel`.

Primary consumer:
- task detail route

Data path:
- Python engine emits execution history
- `lib/server/run-task.ts` normalizes/merges it into persisted task timeline data
- `components/task-api.ts` normalizes timeline events for the UI

## Data-normalization boundary

`components/task-api.ts` is the frontend normalization boundary.

It is responsible for:
- mapping API payloads into `TaskRecord`
- normalizing task status and verification status
- normalizing timeline and failure-signal payloads
- preserving a mock fallback shape if API calls fail

Rule of thumb:
- if the backend schema changes, update normalization here before spreading schema assumptions across page components

## Current connectivity gaps

1. **Landing freshness gap**
   - Landing only loads once on mount.
   - Counts and featured-task state can drift while work is running.

2. **Board freshness gap**
   - Board only loads once on mount.
   - New tasks, retries, and status changes are not automatically reflected after initial page load.

3. **Board detail fidelity gap**
   - Board-selected task state is derived from the collection payload rather than a dedicated `fetchTask()` hydration path.
   - This is fine for lightweight previews, but it is weaker than the dedicated task-detail contract for deep fields such as timeline, prompt preview, verification details, or long logs.

4. **Run/retry contract ambiguity**
   - `/run`, `/retry`, and `POST /api/tasks/[id]` all exist.
   - The frontend only uses create + retry today.
   - Product documentation should keep `/run` internal unless a clear manual-run UX is introduced.

5. **No scripted end-to-end smoke flow yet**
   - Verification evidence currently depends on lint/build/unit tests plus manual HTTP/task lifecycle checks.
   - A dedicated scripted create → detail → timeline → retry smoke path would reduce regression risk.

## Preferred operator flow

For the current MVP, the intended user-facing flow is:

1. Create a task with `POST /api/tasks`
2. Watch status on the board or open task detail
3. Inspect prompt preview, diff, verification output, and timeline on `/tasks/[id]`
4. Retry completed work with `POST /api/tasks/[id]/retry`
5. Treat `/api/tasks/[id]/run` as internal until a UI control is deliberately added

## Verification checklist

Use this checklist after frontend/backend connectivity changes:

```bash
npm run lint
npm run build
python3 -m unittest discover -s tests
```

Then verify live routes manually or with curl:

- `GET /`
- `GET /board`
- `GET /api/tasks`
- `GET /tasks/:id`
- `GET /api/tasks/:id`
- `GET /api/tasks/:id/timeline`
- `POST /api/tasks`
- `POST /api/tasks/:id/retry`

## Notes for future modifiers

- Do not document `/run` as a normal user action unless a visible frontend affordance exists.
- If the board begins showing deep task detail, prefer hydrating selected-task state through `fetchTask()` instead of relying only on the collection payload.
- Keep refresh behavior explicit. Polling and manual-refresh controls should be deliberate, not accidental side effects.
