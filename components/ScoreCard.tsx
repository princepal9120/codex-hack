import { type TaskRecord } from "@/components/task-api";

interface ScoreCardProps {
  task: TaskRecord;
}

export default function ScoreCard({ task }: ScoreCardProps) {
  if (task.score === null && (task.status === "queued" || task.status === "running")) {
    return null;
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-3 text-sm font-medium text-gray-600">Score</p>
      <div className="flex items-end gap-3">
        <span className={`text-4xl font-bold ${getScoreColor(task.score)}`}>
          {task.score ?? "—"}
        </span>
        <span className="pb-1 text-gray-600">/100</span>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {task.status === "passed"
          ? "Task completed successfully."
          : task.status === "failed"
            ? "Task execution failed verification."
            : task.status === "needs_review"
              ? "Task is awaiting human review."
              : "CodexFlow is still working through the pipeline."}
      </p>
    </div>
  );
}
