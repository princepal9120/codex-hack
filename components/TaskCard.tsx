import Link from "next/link";
import { Task } from "@/data/mockTasks";
import { Badge } from "@/components/ui/Badge";
import StatusBadge from "@/components/StatusBadge";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
              {task.title}
            </h3>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-4">
            {task.prompt}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
          </div>
          {task.status === "passed" || task.status === "failed" || task.status === "needs_review" ? (
            <Badge variant="primary" className="text-xs">
              {task.score}/100
            </Badge>
          ) : (
            <span className="text-xs text-gray-500">{task.updatedAt}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
