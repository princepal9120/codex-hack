import { type TaskRecord, type TaskStatus } from "@/components/task-api";
import TaskCard from "@/components/TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: TaskRecord[];
}

const emptyStateMessages: Record<TaskStatus, string> = {
  queued: "No queued tasks",
  running: "No active executions",
  passed: "No completed passing tasks yet",
  failed: "No failed tasks",
  needs_review: "No tasks waiting for review",
};

export default function TaskColumn({ status, title, tasks }: TaskColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="flex min-w-[320px] flex-1 flex-col max-h-[calc(100vh-220px)]">
      <div className="mb-4 flex items-center gap-3 px-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {columnTasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
            <p className="px-6 text-sm text-gray-500">{emptyStateMessages[status]}</p>
          </div>
        ) : (
          columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
