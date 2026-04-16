import Link from "next/link";
import { type TaskRecord, formatTaskTimestamp, getConfidenceLabel } from "@/components/task-api";
import { Badge } from "@/components/ui/Badge";
import StatusBadge from "@/components/StatusBadge";

interface TaskCardProps {
  task: TaskRecord;
}

export default function TaskCard({ task }: TaskCardProps) {
  const isScored = task.score !== null && (task.status === "passed" || task.status === "failed" || task.status === "needs_review");

  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md">
        <div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="flex-1 text-sm font-semibold leading-tight text-gray-900">{task.title}</h3>
          </div>
          <p className="mb-4 line-clamp-3 text-xs text-gray-600">{task.prompt}</p>
          {task.repoPath ? (
            <p className="mb-4 text-[11px] uppercase tracking-wide text-gray-400">Repo: {task.repoPath}</p>
          ) : null}
          {task.contextSummary ? (
            <p className="mb-4 line-clamp-3 text-xs text-gray-500">{task.contextSummary}</p>
          ) : null}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <StatusBadge status={task.status} />
            <span className="text-xs text-gray-500">{formatTaskTimestamp(task.updatedAt)}</span>
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <span>{task.selectedFiles.length} files</span>
            <span>•</span>
            <span>Lint {task.lintStatus}</span>
            <span>•</span>
            <span>Tests {task.testStatus}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
            <span>{getConfidenceLabel(task.score)}</span>
            {isScored ? (
              <Badge variant="primary" className="text-xs">
                {task.score}/100
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
