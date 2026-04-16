export type TaskStatus = "queued" | "running" | "passed" | "failed" | "needs_review";

export interface Task {
  id: string;
  title: string;
  prompt: string;
  status: TaskStatus;
  score: number;
  selectedFiles: { path: string; score: number }[];
  diff: string;
  lintStatus: "passed" | "failed" | "pending";
  testStatus: "passed" | "failed" | "pending";
  logs: string;
  updatedAt: string;
  repoPath?: string;
}

export const tasks: Task[] = [
  {
    id: "CF-12",
    title: "Standardize API error handling",
    prompt: "Normalize error payloads across handlers, keep existing status codes, and make review output easy to verify.",
    status: "running",
    score: 0,
    selectedFiles: [
      { path: "server/internal/handler/issue.go", score: 96 },
      { path: "server/internal/handler/comment.go", score: 92 },
      { path: "server/internal/http/errors.go", score: 88 },
    ],
    diff: `diff --git a/server/internal/handler/issue.go b/server/internal/handler/issue.go
@@ -21,7 +21,13 @@ func (h *IssueHandler) Create(w http.ResponseWriter, r *http.Request) {
-  writeJSON(w, http.StatusBadRequest, err)
+  writeError(w, http.StatusBadRequest, APIError{
+    Code: "invalid_issue_payload",
+    Message: err.Error(),
+    RequestID: requestid.FromContext(r.Context()),
+  })
 }

diff --git a/server/internal/http/errors.go b/server/internal/http/errors.go
@@ -1,0 +1,12 @@
+type APIError struct {
+  Code string \`json:"code"\`
+  Message string \`json:"message"\`
+  RequestID string \`json:"request_id"\`
+}`,
    lintStatus: "passed",
    testStatus: "pending",
    logs: "Analyzing handler patterns...\nUpdated 8 inconsistent responses.\nRunning focused tests for issue and comment handlers...",
    updatedAt: "6 min ago",
    repoPath: "server",
  },
  {
    id: "CF-18",
    title: "Create runtime onboarding handoff",
    prompt: "Build the first-run onboarding path for a newly connected machine, including CLI detection and verification steps.",
    status: "queued",
    score: 0,
    selectedFiles: [
      { path: "app/(auth)/onboarding/page.tsx", score: 94 },
      { path: "features/onboarding/onboarding-flow.tsx", score: 91 },
      { path: "platform/navigation/dashboard-nav.tsx", score: 81 },
    ],
    diff: "",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "Waiting for the next runtime slot...",
    updatedAt: "just now",
    repoPath: "apps/web",
  },
  {
    id: "CF-08",
    title: "Tighten board density on 13-inch laptops",
    prompt: "Refine the board shell so columns keep context visible without collapsing card legibility on smaller screens.",
    status: "passed",
    score: 94,
    selectedFiles: [
      { path: "features/dashboard/task-board.tsx", score: 97 },
      { path: "app/(dashboard)/layout.tsx", score: 89 },
    ],
    diff: `diff --git a/features/dashboard/task-board.tsx b/features/dashboard/task-board.tsx
@@ -40,7 +40,7 @@ export default function TaskBoard() {
-  <div className="grid gap-6 xl:grid-cols-5">
+  <div className="flex gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-5 xl:overflow-visible">`,
    lintStatus: "passed",
    testStatus: "passed",
    logs: "Build succeeded.\nNo layout regressions found in responsive snapshots.",
    updatedAt: "2 hours ago",
    repoPath: "apps/web",
  },
  {
    id: "CF-22",
    title: "Add OAuth refresh flow for GitHub sync",
    prompt: "Implement token refresh for repository sync jobs and surface invalid session errors in the activity stream.",
    status: "failed",
    score: 41,
    selectedFiles: [
      { path: "lib/github-auth.ts", score: 93 },
      { path: "features/dashboard/task-detail.tsx", score: 76 },
    ],
    diff: `diff --git a/lib/github-auth.ts b/lib/github-auth.ts
@@ -1,4 +1,12 @@
+export async function refreshGitHubToken(refreshToken: string) {
+  const response = await fetch("/api/github/refresh", {
+    method: "POST",
+    body: JSON.stringify({ refreshToken }),
+  });
+  return response.json();
+}`,
    lintStatus: "failed",
    testStatus: "failed",
    logs: "Refresh endpoint returned 401 in integration tests.\nExisting session keys are not rotated correctly.",
    updatedAt: "48 min ago",
    repoPath: "apps/web",
  },
  {
    id: "CF-27",
    title: "Publish runtime cost trend panel",
    prompt: "Expose runtime spend and token volume trends in the dashboard summary with a clean weekly view.",
    status: "needs_review",
    score: 83,
    selectedFiles: [
      { path: "features/dashboard/task-board.tsx", score: 95 },
      { path: "platform/navigation/dashboard-nav.tsx", score: 84 },
    ],
    diff: `diff --git a/features/dashboard/task-board.tsx b/features/dashboard/task-board.tsx
@@ -92,0 +93,8 @@
+const weeklyCost = [
+  { day: "Mon", value: 28 },
+  { day: "Tue", value: 46 },
+  { day: "Wed", value: 42 },
+];`,
    lintStatus: "passed",
    testStatus: "passed",
    logs: "Design QA complete. Waiting for final product review.",
    updatedAt: "12 min ago",
    repoPath: "apps/web",
  },
  {
    id: "CF-31",
    title: "Codify staging smoke test skill",
    prompt: "Turn the staging smoke test into a reusable skill with documentation, steps, and runtime prerequisites.",
    status: "queued",
    score: 0,
    selectedFiles: [
      { path: "skills/staging-smoke/SKILL.md", score: 98 },
      { path: "skills/staging-smoke/checks.ts", score: 88 },
    ],
    diff: "",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "Queued behind two active executions.",
    updatedAt: "just now",
    repoPath: "skills",
  },
];
