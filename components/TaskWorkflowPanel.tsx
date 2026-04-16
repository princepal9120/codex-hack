import { CheckCircle2, Clock3, Loader, XCircle } from "lucide-react";

import { type TaskRecord, type TaskStatus } from "@/components/task-api";

interface TaskWorkflowPanelProps {
  task: TaskRecord;
}

const stages: Array<{ key: TaskStatus; label: string; helper: string }> = [
  { key: "queued", label: "Queued", helper: "Task captured with repo path and verification commands." },
  { key: "running", label: "Running", helper: "Repository scan, prompt construction, diff preview, and verification in progress." },
  { key: "needs_review", label: "Needs review", helper: "Patch preview is available, but a human should inspect it before trust." },
  { key: "passed", label: "Passed", helper: "Verification cleared and the patch preview looks consistent." },
  { key: "failed", label: "Failed", helper: "Execution or verification failed; inspect logs and raw outputs." },
];

const stageOrder: Record<TaskStatus, number> = {
  queued: 0,
  running: 1,
  needs_review: 2,
  passed: 3,
  failed: 3,
};

function getStageState(taskStatus: TaskStatus, stageKey: TaskStatus) {
  const current = stageOrder[taskStatus];
  const stage = stageOrder[stageKey];

  if (taskStatus === "failed") {
    if (stageKey === "failed") {
      return "current";
    }
    return stage < current ? "complete" : "upcoming";
  }

  if (stageKey === taskStatus) {
    return "current";
  }

  return stage < current ? "complete" : "upcoming";
}

export default function TaskWorkflowPanel({ task }: TaskWorkflowPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Execution Workflow</h3>
      </div>
      <div className="space-y-4 px-6 py-5">
        {stages.map((stage) => {
          const state = getStageState(task.status, stage.key);
          const isCurrent = state === "current";
          const isComplete = state === "complete";
          const tone =
            stage.key === "failed" && isCurrent
              ? "border-red-200 bg-red-50"
              : isCurrent
                ? "border-blue-200 bg-blue-50"
                : isComplete
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50";

          return (
            <div key={stage.key} className={`rounded-2xl border px-4 py-4 ${tone}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {stage.key === "failed" && isCurrent ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : isCurrent ? (
                    <Loader className="h-5 w-5 animate-spin text-blue-600" />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock3 className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{stage.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{stage.helper}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
