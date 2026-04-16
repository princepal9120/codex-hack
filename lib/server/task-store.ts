import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";
import type { CreateTaskInput, SelectedFile, TaskRecord, TaskStatus } from "@/lib/task-types";

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
  codex_output: string;
  diff_output: string;
  lint_status: TaskRecord["lintStatus"];
  test_status: TaskRecord["testStatus"];
  logs: string;
  error_message: string | null;
  lint_command: string | null;
  test_command: string | null;
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
      { path: "app/api/auth/login/route.ts", score: 94 },
      { path: "lib/auth/rate-limit.ts", score: 88 }
    ],
    codexOutput: "Mock execution completed without a live OpenAI key. Review the diff before applying it.",
    diffOutput: "diff --git a/app/api/auth/login/route.ts b/app/api/auth/login/route.ts\n@@\n+// Add request throttling before credential validation\n",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "Queued sample task for the board demo.",
    errorMessage: null,
    lintCommand: null,
    testCommand: null
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
      { path: "app/tasks/[id]/page.tsx", score: 97 },
      { path: "components/VerificationPanel.tsx", score: 82 }
    ],
    codexOutput: "Generated a small patch and verification passed.",
    diffOutput: "diff --git a/app/tasks/[id]/page.tsx b/app/tasks/[id]/page.tsx\n@@\n-const task = staleCache[id];\n+const task = await fetchFreshTask(id);\n",
    lintStatus: "passed",
    testStatus: "passed",
    logs: "✓ Lint passed\n✓ Tests passed\n✓ Patch preview generated",
    errorMessage: null,
    lintCommand: null,
    testCommand: null
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
      { path: "engine/repo_scanner.py", score: 96 },
      { path: "codexflow.config.json", score: 75 }
    ],
    codexOutput: "Attempted scanner update, but verification failed.",
    diffOutput: "diff --git a/engine/repo_scanner.py b/engine/repo_scanner.py\n@@\n+IGNORED_DIRECTORIES.add('coverage')\n",
    lintStatus: "failed",
    testStatus: "failed",
    logs: "Command failed: scanner hit a missing import during verification.",
    errorMessage: "Verification failed during sample seed generation.",
    lintCommand: null,
    testCommand: null
  }
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
    selectedFiles: JSON.parse(row.selected_files_json) as SelectedFile[],
    codexOutput: row.codex_output,
    diffOutput: row.diff_output,
    lintStatus: row.lint_status,
    testStatus: row.test_status,
    logs: row.logs,
    errorMessage: row.error_message,
    lintCommand: row.lint_command,
    testCommand: row.test_command,
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
    codex_output: task.codexOutput,
    diff_output: task.diffOutput,
    lint_status: task.lintStatus,
    test_status: task.testStatus,
    logs: task.logs,
    error_message: task.errorMessage,
    lint_command: task.lintCommand,
    test_command: task.testCommand,
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
      score, selected_files_json, codex_output, diff_output, lint_status, test_status, logs,
      error_message, lint_command, test_command
    ) VALUES (
      :id, :title, :prompt, :status, :repo_path, :created_at, :updated_at, :run_started_at, :run_finished_at,
      :score, :selected_files_json, :codex_output, :diff_output, :lint_status, :test_status, :logs,
      :error_message, :lint_command, :test_command
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
    codexOutput: "",
    diffOutput: "",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "Task created and waiting to run.",
    errorMessage: null,
    lintCommand: input.lintCommand?.trim() || null,
    testCommand: input.testCommand?.trim() || null,
  };

  db.prepare(`
    INSERT INTO tasks (
      id, title, prompt, status, repo_path, created_at, updated_at, run_started_at, run_finished_at,
      score, selected_files_json, codex_output, diff_output, lint_status, test_status, logs,
      error_message, lint_command, test_command
    ) VALUES (
      :id, :title, :prompt, :status, :repo_path, :created_at, :updated_at, :run_started_at, :run_finished_at,
      :score, :selected_files_json, :codex_output, :diff_output, :lint_status, :test_status, :logs,
      :error_message, :lint_command, :test_command
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
      codex_output = :codex_output,
      diff_output = :diff_output,
      lint_status = :lint_status,
      test_status = :test_status,
      logs = :logs,
      error_message = :error_message,
      lint_command = :lint_command,
      test_command = :test_command
    WHERE id = :id
  `).run(taskToParams(next));

  return next;
}

export function resetTaskForRetry(id: string) {
  return updateTask(id, {
    status: "queued",
    score: 0,
    selectedFiles: [],
    codexOutput: "",
    diffOutput: "",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "Task queued for retry.",
    errorMessage: null,
    runStartedAt: null,
    runFinishedAt: null,
  });
}
