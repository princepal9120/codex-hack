import { Task, TaskStatus } from "@/data/mockTasks";
import TaskCard from "@/components/TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

const emptyStateMessages: Record<TaskStatus, string> = {
  queued: "No queued tasks",
  running: "No active executions",
  passed: "No completed passing tasks yet",
  failed: "No failed tasks",
  needs_review: "No tasks waiting for review",
};

export default function TaskColumn({ status, title, tasks }: TaskColumnProps) {
  const columnTasks = tasks.filter(task => task.status === status);

  return (
    <div className="flex flex-col flex-1 min-w-[320px] max-h-[calc(100vh-200px)]">
      <div className="flex items-center gap-3 mb-4 px-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {columnTasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center">
            <p className="text-sm text-gray-500">{emptyStateMessages[status]}</p>
          </div>
        ) : (
          columnTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
