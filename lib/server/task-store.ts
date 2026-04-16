import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";
import type {
  CreateTaskInput,
  SelectedFile,
  TaskEvent,
  TaskFailureSignal,
  TaskRecord,
  TaskStatus,
} from "@/lib/task-types";

interface TaskRow {
  id: string;
  title: string;
  prompt: string;
  status: TaskStatus;
  repo_path: string;
  created_at: string;
  updated_at: string;
  run_started_at: string | null;
  run_finished_at: string | null;
  score: number;
  selected_files_json: string;
  prompt_preview: string;
  context_summary: string;
  execution_mode: string;
  codex_output: string;
  diff_output: string;
  patch_summary: string;
  lint_status: TaskRecord["lintStatus"];
  test_status: TaskRecord["testStatus"];
  lint_output: string;
  test_output: string;
  verification_notes: string;
  logs: string;
  error_message: string | null;
  lint_command: string | null;
  test_command: string | null;
  timeline_json: string;
  failure_signal_json: string | null;
}

function createTimelineEvent(
  input: Omit<TaskEvent, "id"> & { id?: string }
): TaskEvent {
  return {
    id: input.id ?? randomUUID(),
    phase: input.phase,
    kind: input.kind,
    level: input.level,
    title: input.title,
    detail: input.detail,
    createdAt: input.createdAt,
    metadata: input.metadata,
  };
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeTimeline(value: unknown): TaskEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title : "Task update";
    const detail =
      (typeof record.detail === "string" && record.detail) ||
      (typeof record.message === "string" && record.message) ||
      "No additional detail captured.";
    const createdAt =
      (typeof record.createdAt === "string" && record.createdAt) ||
      (typeof record.created_at === "string" && record.created_at) ||
      new Date(0).toISOString();

    return [
      createTimelineEvent({
        id: typeof record.id === "string" ? record.id : undefined,
        phase:
          record.phase === "task" ||
          record.phase === "context" ||
          record.phase === "execution" ||
          record.phase === "verification"
            ? record.phase
            : "execution",
        kind:
          record.kind === "task_created" ||
          record.kind === "task_requeued" ||
          record.kind === "run_started" ||
          record.kind === "context_selected" ||
          record.kind === "patch_generated" ||
          record.kind === "verification_completed" ||
          record.kind === "run_completed" ||
          record.kind === "run_failed"
            ? record.kind
            : "run_completed",
        level:
          record.level === "info" ||
          record.level === "success" ||
          record.level === "warning" ||
          record.level === "error"
            ? record.level
            : "info",
        title,
        detail,
        createdAt,
        metadata:
          record.metadata && typeof record.metadata === "object"
            ? (record.metadata as TaskEvent["metadata"])
            : undefined,
      }),
    ];
  });
}

function normalizeFailureSignal(value: unknown): TaskFailureSignal | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const category =
    record.category === "verification" ||
    record.category === "execution" ||
    record.category === "empty_patch" ||
    record.category === "unknown"
      ? record.category
      : null;

  if (!category) {
    return null;
  }

  return {
    category,
    summary: typeof record.summary === "string" ? record.summary : "Task failed",
    detail: typeof record.detail === "string" ? record.detail : "No failure detail captured.",
    detectedAt:
      (typeof record.detectedAt === "string" && record.detectedAt) ||
      (typeof record.detected_at === "string" && record.detected_at) ||
      new Date(0).toISOString(),
  };
}

function appendTaskEvent(task: TaskRecord, event: TaskEvent) {
  return [...task.timeline, event];
}

const seedTasks: Array<Omit<TaskRecord, "id">> = [
  {
    title: "Add rate limiting to login endpoint",
    prompt: "Add rate limiting to login endpoint and verify the implementation with lint/tests.",
    status: "needs_review",
    repoPath: ".",
    createdAt: new Date("2026-04-15T10:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-04-15T10:02:00.000Z").toISOString(),
    runStartedAt: new Date("2026-04-15T10:00:30.000Z").toISOString(),
    runFinishedAt: new Date("2026-04-15T10:02:00.000Z").toISOString(),
    score: 58,
    selectedFiles: [
      {
        path: "app/api/auth/login/route.ts",
        score: 94,
        rationale: "Login route path matches the request directly and contains the auth flow entrypoint.",
        matchedTerms: ["login", "endpoint"],
      },
      {
        path: "lib/auth/rate-limit.ts",
        score: 88,
        rationale: "Rate limit helper aligns with the change request and likely holds shared enforcement logic.",
        matchedTerms: ["rate", "limit"],
      },
    ],
    promptPreview: "System instruction...\nTask title: Add rate limiting to login endpoint\nSelected context: login route + rate-limit helper",
    contextSummary: "CodexFlow selected the auth route plus the shared rate-limit helper because both path names and code excerpts matched the prompt.",
    executionMode: "mock",
    codexOutput: "Mock execution completed without a live OpenAI key. Review the diff before applying it.",
    diffOutput: "diff --git a/app/api/auth/login/route.ts b/app/api/auth/login/route.ts\n@@\n+// Add request throttling before credential validation\n",
    patchSummary: "Add request throttling before login credential validation.",
    lintStatus: "pending",
    testStatus: "pending",
    lintOutput: "Lint was not executed for the seed demo task.",
    testOutput: "Tests were not executed for the seed demo task.",
    verificationNotes: "Patch preview generated, but verification is still pending human review.",
    logs: "Queued sample task for the board demo.",
    errorMessage: null,
    lintCommand: null,
    testCommand: null,
    timeline: [
      createTimelineEvent({
        phase: "task",
        kind: "task_created",
        level: "info",
        title: "Task created",
        detail: "Request captured with repo path and verification commands.",
        createdAt: new Date("2026-04-15T10:00:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "execution",
        kind: "run_started",
        level: "info",
        title: "Run started",
        detail: "CodexFlow started a preview-first execution for the task.",
        createdAt: new Date("2026-04-15T10:00:30.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "context",
        kind: "context_selected",
        level: "success",
        title: "Context selected",
        detail: "Ranked 2 files for prompt context before patch generation.",
        createdAt: new Date("2026-04-15T10:01:00.000Z").toISOString(),
        metadata: { selectedFiles: 2 },
      }),
      createTimelineEvent({
        phase: "execution",
        kind: "patch_generated",
        level: "success",
        title: "Patch preview ready",
        detail: "A diff preview was produced and is ready for human review.",
        createdAt: new Date("2026-04-15T10:01:30.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "verification",
        kind: "verification_completed",
        level: "warning",
        title: "Verification pending",
        detail: "Lint and tests were not run for this sample task.",
        createdAt: new Date("2026-04-15T10:02:00.000Z").toISOString(),
      }),
    ],
    failureSignal: null,
  },
  {
    title: "Fix flaky task detail loading state",
    prompt: "Stabilize the task detail loading state so repeated refreshes do not flash stale data.",
    status: "passed",
    repoPath: ".",
    createdAt: new Date("2026-04-14T12:15:00.000Z").toISOString(),
    updatedAt: new Date("2026-04-14T12:18:00.000Z").toISOString(),
    runStartedAt: new Date("2026-04-14T12:15:30.000Z").toISOString(),
    runFinishedAt: new Date("2026-04-14T12:18:00.000Z").toISOString(),
    score: 92,
    selectedFiles: [
      {
        path: "app/tasks/[id]/page.tsx",
        score: 97,
        rationale: "The task detail route contains the loading-state logic called out in the prompt.",
        matchedTerms: ["task", "detail", "loading"],
      },
      {
        path: "components/VerificationPanel.tsx",
        score: 82,
        rationale: "Verification UI is adjacent to the stale-data bug and helps validate post-refresh behavior.",
        matchedTerms: ["refresh", "verification"],
      },
    ],
    promptPreview: "System instruction...\nTask title: Fix flaky task detail loading state\nSelected context: task detail page + verification panel",
    contextSummary: "The route page was ranked highest because it contains the loading state; the verification panel was included for adjacent refresh behavior.",
    executionMode: "mock",
    codexOutput: "Generated a small patch and verification passed.",
    diffOutput: "diff --git a/app/tasks/[id]/page.tsx b/app/tasks/[id]/page.tsx\n@@\n-const task = staleCache[id];\n+const task = await fetchFreshTask(id);\n",
    patchSummary: "Switch task detail reads from stale cache to a fresh fetch path.",
    lintStatus: "passed",
    testStatus: "passed",
    lintOutput: "✓ No ESLint warnings or errors",
    testOutput: "✓ UI regression checks passed",
    verificationNotes: "Verification cleared both lint and tests, so the run landed in passed.",
    logs: "✓ Lint passed\n✓ Tests passed\n✓ Patch preview generated",
    errorMessage: null,
    lintCommand: null,
    testCommand: null,
    timeline: [
      createTimelineEvent({
        phase: "task",
        kind: "task_created",
        level: "info",
        title: "Task created",
        detail: "Task queued for execution with verification commands.",
        createdAt: new Date("2026-04-14T12:15:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "execution",
        kind: "run_started",
        level: "info",
        title: "Run started",
        detail: "CodexFlow began scanning the repository before prompt construction.",
        createdAt: new Date("2026-04-14T12:15:30.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "context",
        kind: "context_selected",
        level: "success",
        title: "Context selected",
        detail: "The task detail page and verification panel ranked highest for the prompt.",
        createdAt: new Date("2026-04-14T12:16:00.000Z").toISOString(),
        metadata: { selectedFiles: 2 },
      }),
      createTimelineEvent({
        phase: "execution",
        kind: "patch_generated",
        level: "success",
        title: "Patch preview ready",
        detail: "A targeted diff was produced for inspection before trust.",
        createdAt: new Date("2026-04-14T12:16:45.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "verification",
        kind: "verification_completed",
        level: "success",
        title: "Verification passed",
        detail: "Lint and tests both passed for the generated preview.",
        createdAt: new Date("2026-04-14T12:18:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "task",
        kind: "run_completed",
        level: "success",
        title: "Run completed",
        detail: "The task completed successfully with a verified patch preview.",
        createdAt: new Date("2026-04-14T12:18:00.000Z").toISOString(),
      }),
    ],
    failureSignal: null,
  },
  {
    title: "Refactor repo scanner ignore rules",
    prompt: "Refactor the repo scanner ignore rules to avoid indexing large build outputs.",
    status: "failed",
    repoPath: ".",
    createdAt: new Date("2026-04-13T08:30:00.000Z").toISOString(),
    updatedAt: new Date("2026-04-13T08:36:00.000Z").toISOString(),
    runStartedAt: new Date("2026-04-13T08:31:00.000Z").toISOString(),
    runFinishedAt: new Date("2026-04-13T08:36:00.000Z").toISOString(),
    score: 34,
    selectedFiles: [
      {
        path: "engine/repo_scanner.py",
        score: 96,
        rationale: "The scanner implementation directly controls ignore rules and was the highest lexical match.",
        matchedTerms: ["scanner", "ignore"],
      },
      {
        path: "codexflow.config.json",
        score: 75,
        rationale: "Repo-level config may define scanning limits and ignore-adjacent behavior.",
        matchedTerms: ["config"],
      },
    ],
    promptPreview: "System instruction...\nTask title: Refactor repo scanner ignore rules\nSelected context: scanner module + repo config",
    contextSummary: "CodexFlow prioritized the scanner module and config because both likely influence indexing and ignored outputs.",
    executionMode: "mock",
    codexOutput: "Attempted scanner update, but verification failed.",
    diffOutput: "diff --git a/engine/repo_scanner.py b/engine/repo_scanner.py\n@@\n+IGNORED_DIRECTORIES.add('coverage')\n",
    patchSummary: "Add coverage to ignored directories before repository indexing.",
    lintStatus: "failed",
    testStatus: "failed",
    lintOutput: "engine/repo_scanner.py: import resolution failed",
    testOutput: "Repo scanner regression suite failed with missing import paths.",
    verificationNotes: "The patch preview exists, but verification failed and the task requires investigation.",
    logs: "Command failed: scanner hit a missing import during verification.",
    errorMessage: "Verification failed during sample seed generation.",
    lintCommand: null,
    testCommand: null,
    timeline: [
      createTimelineEvent({
        phase: "task",
        kind: "task_created",
        level: "info",
        title: "Task created",
        detail: "Task queued for execution with scanner-focused verification.",
        createdAt: new Date("2026-04-13T08:30:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "execution",
        kind: "run_started",
        level: "info",
        title: "Run started",
        detail: "CodexFlow started scanning repository files.",
        createdAt: new Date("2026-04-13T08:31:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "context",
        kind: "context_selected",
        level: "success",
        title: "Context selected",
        detail: "The repo scanner implementation and config were selected for prompt context.",
        createdAt: new Date("2026-04-13T08:32:00.000Z").toISOString(),
        metadata: { selectedFiles: 2 },
      }),
      createTimelineEvent({
        phase: "execution",
        kind: "patch_generated",
        level: "warning",
        title: "Patch preview ready",
        detail: "A patch preview was generated, but verification still needed to run.",
        createdAt: new Date("2026-04-13T08:33:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "verification",
        kind: "verification_completed",
        level: "error",
        title: "Verification failed",
        detail: "Lint and tests both failed after preview generation.",
        createdAt: new Date("2026-04-13T08:36:00.000Z").toISOString(),
      }),
      createTimelineEvent({
        phase: "task",
        kind: "run_failed",
        level: "error",
        title: "Run failed",
        detail: "The task ended in a failed state and needs investigation.",
        createdAt: new Date("2026-04-13T08:36:00.000Z").toISOString(),
      }),
    ],
    failureSignal: {
      category: "verification",
      summary: "Verification failed after patch generation",
      detail: "The generated preview existed, but lint and test checks both failed for the scanner update.",
      detectedAt: new Date("2026-04-13T08:36:00.000Z").toISOString(),
    },
  },
];

function rowToTask(row: TaskRow): TaskRecord {
  return {
    id: row.id,
    title: row.title,
    prompt: row.prompt,
    status: row.status,
    repoPath: row.repo_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    runStartedAt: row.run_started_at,
    runFinishedAt: row.run_finished_at,
    score: row.score,
    selectedFiles: parseJson(row.selected_files_json, []) as SelectedFile[],
    promptPreview: row.prompt_preview,
    contextSummary: row.context_summary,
    executionMode: row.execution_mode,
    codexOutput: row.codex_output,
    diffOutput: row.diff_output,
    patchSummary: row.patch_summary,
    lintStatus: row.lint_status,
    testStatus: row.test_status,
    lintOutput: row.lint_output,
    testOutput: row.test_output,
    verificationNotes: row.verification_notes,
    logs: row.logs,
    errorMessage: row.error_message,
    lintCommand: row.lint_command,
    testCommand: row.test_command,
    timeline: normalizeTimeline(parseJson(row.timeline_json, [])),
    failureSignal: normalizeFailureSignal(parseJson(row.failure_signal_json, null)),
  };
}

function taskToParams(task: TaskRecord) {
  return {
    id: task.id,
    title: task.title,
    prompt: task.prompt,
    status: task.status,
    repo_path: task.repoPath,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    run_started_at: task.runStartedAt,
    run_finished_at: task.runFinishedAt,
    score: task.score,
    selected_files_json: JSON.stringify(task.selectedFiles),
    prompt_preview: task.promptPreview,
    context_summary: task.contextSummary,
    execution_mode: task.executionMode,
    codex_output: task.codexOutput,
    diff_output: task.diffOutput,
    patch_summary: task.patchSummary,
    lint_status: task.lintStatus,
    test_status: task.testStatus,
    lint_output: task.lintOutput,
    test_output: task.testOutput,
    verification_notes: task.verificationNotes,
    logs: task.logs,
    error_message: task.errorMessage,
    lint_command: task.lintCommand,
    test_command: task.testCommand,
    timeline_json: JSON.stringify(task.timeline),
    failure_signal_json: task.failureSignal ? JSON.stringify(task.failureSignal) : null,
  };
}

export function ensureSeedTasks() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number }).count;

  if (count > 0) {
    return;
  }

  const insert = db.prepare(`
    INSERT INTO tasks (
      id, title, prompt, status, repo_path, created_at, updated_at, run_started_at, run_finished_at,
      score, selected_files_json, prompt_preview, context_summary, execution_mode, codex_output, diff_output, patch_summary,
      lint_status, test_status, lint_output, test_output, verification_notes, logs,
      error_message, lint_command, test_command, timeline_json, failure_signal_json
    ) VALUES (
      :id, :title, :prompt, :status, :repo_path, :created_at, :updated_at, :run_started_at, :run_finished_at,
      :score, :selected_files_json, :prompt_preview, :context_summary, :execution_mode, :codex_output, :diff_output, :patch_summary,
      :lint_status, :test_status, :lint_output, :test_output, :verification_notes, :logs,
      :error_message, :lint_command, :test_command, :timeline_json, :failure_signal_json
    )
  `);

  for (const task of seedTasks) {
    insert.run(taskToParams({ ...task, id: randomUUID() }));
  }
}

export function listTasks() {
  ensureSeedTasks();
  const db = getDb();
  const rows = db.prepare("SELECT * FROM tasks ORDER BY updated_at DESC").all() as TaskRow[];
  return rows.map(rowToTask);
}

export function getTaskById(id: string) {
  ensureSeedTasks();
  const db = getDb();
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as TaskRow | undefined;
  return row ? rowToTask(row) : null;
}

export function createTask(input: CreateTaskInput) {
  const db = getDb();
  const now = new Date().toISOString();
  const task: TaskRecord = {
    id: randomUUID(),
    title: input.title.trim(),
    prompt: input.prompt.trim(),
    status: "queued",
    repoPath: input.repoPath?.trim() || ".",
    createdAt: now,
    updatedAt: now,
    runStartedAt: null,
    runFinishedAt: null,
    score: 0,
    selectedFiles: [],
    promptPreview: "",
    contextSummary: "",
    executionMode: "",
    codexOutput: "",
    diffOutput: "",
    patchSummary: "",
    lintStatus: "pending",
    testStatus: "pending",
    lintOutput: "",
    testOutput: "",
    verificationNotes: "Patch preview first. No repository changes are auto-applied.",
    logs: "Task created and waiting to run. Patch previews are generated before any human review.",
    errorMessage: null,
    lintCommand: input.lintCommand?.trim() || null,
    testCommand: input.testCommand?.trim() || null,
    timeline: [
      createTimelineEvent({
        phase: "task",
        kind: "task_created",
        level: "info",
        title: "Task created",
        detail: "Task captured and queued for preview-first execution.",
        createdAt: now,
        metadata: {
          hasLintCommand: Boolean(input.lintCommand?.trim()),
          hasTestCommand: Boolean(input.testCommand?.trim()),
        },
      }),
    ],
    failureSignal: null,
  };

  db.prepare(`
    INSERT INTO tasks (
      id, title, prompt, status, repo_path, created_at, updated_at, run_started_at, run_finished_at,
      score, selected_files_json, prompt_preview, context_summary, execution_mode, codex_output, diff_output, patch_summary,
      lint_status, test_status, lint_output, test_output, verification_notes, logs,
      error_message, lint_command, test_command, timeline_json, failure_signal_json
    ) VALUES (
      :id, :title, :prompt, :status, :repo_path, :created_at, :updated_at, :run_started_at, :run_finished_at,
      :score, :selected_files_json, :prompt_preview, :context_summary, :execution_mode, :codex_output, :diff_output, :patch_summary,
      :lint_status, :test_status, :lint_output, :test_output, :verification_notes, :logs,
      :error_message, :lint_command, :test_command, :timeline_json, :failure_signal_json
    )
  `).run(taskToParams(task));

  return task;
}

export function updateTask(id: string, updates: Partial<TaskRecord>) {
  const current = getTaskById(id);

  if (!current) {
    return null;
  }

  const next: TaskRecord = {
    ...current,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  getDb().prepare(`
    UPDATE tasks SET
      title = :title,
      prompt = :prompt,
      status = :status,
      repo_path = :repo_path,
      created_at = :created_at,
      updated_at = :updated_at,
      run_started_at = :run_started_at,
      run_finished_at = :run_finished_at,
      score = :score,
      selected_files_json = :selected_files_json,
      prompt_preview = :prompt_preview,
      context_summary = :context_summary,
      execution_mode = :execution_mode,
      codex_output = :codex_output,
      diff_output = :diff_output,
      patch_summary = :patch_summary,
      lint_status = :lint_status,
      test_status = :test_status,
      lint_output = :lint_output,
      test_output = :test_output,
      verification_notes = :verification_notes,
      logs = :logs,
      error_message = :error_message,
      lint_command = :lint_command,
      test_command = :test_command,
      timeline_json = :timeline_json,
      failure_signal_json = :failure_signal_json
    WHERE id = :id
  `).run(taskToParams(next));

  return next;
}

export function resetTaskForRetry(id: string) {
  const current = getTaskById(id);

  if (!current) {
    return null;
  }

  return updateTask(id, {
    status: "queued",
    score: 0,
    selectedFiles: [],
    promptPreview: "",
    contextSummary: "",
    executionMode: "",
    codexOutput: "",
    diffOutput: "",
    patchSummary: "",
    lintStatus: "pending",
    testStatus: "pending",
    lintOutput: "",
    testOutput: "",
    verificationNotes: "Task re-queued. A fresh patch preview will be generated before trust.",
    logs: "Task queued for retry. CodexFlow will rescan the repository and generate a fresh patch preview.",
    errorMessage: null,
    runStartedAt: null,
    runFinishedAt: null,
    timeline: appendTaskEvent(
      current,
      createTimelineEvent({
        phase: "task",
        kind: "task_requeued",
        level: "info",
        title: "Task re-queued",
        detail: "A fresh preview-first run was requested.",
        createdAt: new Date().toISOString(),
      })
    ),
    failureSignal: null,
  });
}

export function getTaskTimeline(id: string) {
  const task = getTaskById(id);

  if (!task) {
    return null;
  }

  return {
    taskId: task.id,
    status: task.status,
    timeline: task.timeline,
    failureSignal: task.failureSignal,
  };
}
