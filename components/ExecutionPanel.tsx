import { formatTaskTimestamp, getFailureClassificationLabel, type TaskRecord } from "@/components/task-api";

interface ExecutionPanelProps {
  task: TaskRecord;
}

export default function ExecutionPanel({ task }: ExecutionPanelProps) {
  const hasExecutionOutput = Boolean(
    task.codexOutput ||
      task.errorMessage ||
      task.runStartedAt ||
      task.runFinishedAt ||
      task.executionMode ||
      task.contextSummary ||
      task.statusSummary
  );

  if (!hasExecutionOutput) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Execution Output</h3>
      </div>

      <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Created</p>
          <p className="mt-1 text-sm text-gray-900">{formatTaskTimestamp(task.createdAt ?? task.updatedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Run Started</p>
          <p className="mt-1 text-sm text-gray-900">{task.runStartedAt ? formatTaskTimestamp(task.runStartedAt) : "Not started yet"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Run Finished</p>
          <p className="mt-1 text-sm text-gray-900">{task.runFinishedAt ? formatTaskTimestamp(task.runFinishedAt) : "Still running"}</p>
        </div>
      </div>

      <div className="grid gap-4 border-t border-gray-200 px-6 py-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Execution mode</p>
          <p className="mt-1 text-sm text-gray-900">{task.executionMode || "Unknown"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Current status</p>
          <p className="mt-1 text-sm text-gray-900">{task.statusSummary || "Execution details are still loading."}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Context summary</p>
        <p className="mt-1 text-sm text-gray-900">{task.contextSummary || "No context summary captured yet."}</p>
      </div>

      {task.failureSignal ? (
        <div className="border-t border-red-200 bg-red-50 px-6 py-4 text-sm text-red-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-700">
              {getFailureClassificationLabel(task.failureSignal.classification)}
            </span>
            <p className="font-medium">{task.failureSignal.summary}</p>
          </div>
          {task.failureSignal.detail ? <p className="mt-2 text-red-700/90">{task.failureSignal.detail}</p> : null}
          {task.failureSignal.action ? <p className="mt-2 text-xs text-red-700/80">Next step: {task.failureSignal.action}</p> : null}
        </div>
      ) : task.errorMessage ? (
        <div className="border-t border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{task.errorMessage}</div>
      ) : null}

      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-medium text-gray-900">Codex / Engine Summary</p>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs text-gray-600">
          {task.codexOutput || "No execution summary has been captured yet."}
        </pre>
      </div>
    </div>
  );
}
