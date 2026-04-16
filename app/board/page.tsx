'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import TaskColumn from "@/components/TaskColumn";
import { Button } from "@/components/ui/Button";
import { fetchTasks, formatTaskTimestamp, getConfidenceLabel, isTerminalStatus, type TaskRecord, type TaskSource } from "@/components/task-api";
import { AlertTriangle, Radar, RotateCcw } from "lucide-react";

const columns = [
  { status: "queued", title: "Queued" },
  { status: "running", title: "Running" },
  { status: "passed", title: "Passed" },
  { status: "failed", title: "Failed" },
  { status: "needs_review", title: "Needs Review" },
] as const;

export default function BoardPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [source, setSource] = useState<TaskSource>("api");
  const [message, setMessage] = useState<string | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async (background = false) => {
    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const result = await fetchTasks();
    setTasks(result.tasks);
    setSource(result.source);
    setMessage(result.message ?? null);
    setLastLoadedAt(new Date().toISOString());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (source !== "api" || tasks.every((task) => isTerminalStatus(task.status))) {
      return;
    }

    const interval = window.setInterval(() => {
      void loadTasks(true);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [loadTasks, source, tasks]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      running: tasks.filter((task) => task.status === "running").length,
      queued: tasks.filter((task) => task.status === "queued").length,
      attention: tasks.filter((task) => task.status === "failed" || task.status === "needs_review").length,
      passingRate:
        tasks.length > 0
          ? Math.round((tasks.filter((task) => task.status === "passed").length / tasks.length) * 100)
          : 0,
      avgFiles:
        tasks.length > 0
          ? Math.round(tasks.reduce((sum, task) => sum + task.selectedFiles.length, 0) / tasks.length)
          : 0,
    }),
    [tasks]
  );

  const attentionTasks = useMemo(
    () => tasks.filter((task) => task.status === "failed" || task.status === "needs_review").slice(0, 3),
    [tasks]
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600">
              Monitor CodexFlow runs, see which tasks are still executing, and inspect verification results.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lastLoadedAt ? (
              <p className="text-sm text-gray-500">Updated {formatTaskTimestamp(lastLoadedAt)}</p>
            ) : null}
            <Button variant="outline" size="sm" className="gap-2" onClick={() => void loadTasks(true)} disabled={refreshing}>
              <RotateCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {message}
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Tasks</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-700">Running Now</p>
            <p className="mt-3 text-3xl font-semibold text-blue-900">{stats.running}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Queued</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.queued}</p>
          </div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-green-700">Passing Rate</p>
            <p className="mt-3 text-3xl font-semibold text-green-900">{stats.passingRate}%</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Needs Attention</p>
            <p className="mt-3 text-3xl font-semibold text-amber-900">{stats.attention}</p>
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <Radar className="h-5 w-5 text-violet-600" />
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Context intelligence</h2>
                <p className="text-sm text-gray-600">Show why CodexFlow chose this repo slice before execution.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricTile label="Avg files / run" value={String(stats.avgFiles)} helper="Repo context breadth" />
              <MetricTile
                label="Top confidence"
                value={tasks[0] ? getConfidenceLabel(tasks[0].score) : "No runs"}
                helper="Based on score + verification"
              />
              <MetricTile label="Patch mode" value="Preview first" helper="No arbitrary auto-apply" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Operational attention queue</h2>
                <p className="text-sm text-gray-600">Failed runs and review-needed tasks surface here first.</p>
              </div>
            </div>
            {attentionTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-sm text-gray-500">
                No tasks currently need intervention.
              </div>
            ) : (
              <div className="space-y-3">
                {attentionTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      <span className="text-xs text-gray-500">{formatTaskTimestamp(task.updatedAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{task.contextSummary || task.prompt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center text-sm text-gray-500">
            Loading task pipeline…
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">No tasks yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a task from the navbar to run your first CodexFlow execution.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <TaskColumn key={column.status} status={column.status} title={column.title} tasks={tasks} />
            ))}
          </div>
        )}

        {source === "mock" ? (
          <p className="mt-4 text-xs text-gray-500">
            Demo fallback is active because the task API is unavailable in this branch snapshot.
          </p>
        ) : null}
      </div>
    </main>
  );
}

function MetricTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-3 text-lg font-semibold text-gray-900">{value}</p>
      <p className="mt-2 text-xs text-gray-500">{helper}</p>
    </div>
  );
}
