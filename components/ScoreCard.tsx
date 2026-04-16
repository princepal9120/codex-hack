import { Task } from "@/data/mockTasks";

interface ScoreCardProps {
  task: Task;
}

export default function ScoreCard({ task }: ScoreCardProps) {
  if (task.score === 0 && (task.status === "queued" || task.status === "running")) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-600 mb-3">Score</p>
      <div className="flex items-center gap-3">
        <span className={`text-4xl font-bold ${getScoreColor(task.score)}`}>
          {task.score}
        </span>
        <span className="text-gray-600">/100</span>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        {task.status === "passed"
          ? "Task completed successfully"
          : task.status === "failed"
          ? "Task execution failed"
          : "Awaiting review"}
      </p>
    </div>
  );
}
