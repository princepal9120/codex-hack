'use client';

import { mockTasks } from "@/data/mockTasks";
import TaskColumn from "@/components/TaskColumn";

export default function BoardPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Board</h1>
          <p className="text-gray-600">Track AI coding task execution across all stages</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          <TaskColumn
            status="queued"
            title="Queued"
            tasks={mockTasks}
          />
          <TaskColumn
            status="running"
            title="Running"
            tasks={mockTasks}
          />
          <TaskColumn
            status="passed"
            title="Passed"
            tasks={mockTasks}
          />
          <TaskColumn
            status="failed"
            title="Failed"
            tasks={mockTasks}
          />
          <TaskColumn
            status="needs_review"
            title="Needs Review"
            tasks={mockTasks}
          />
        </div>
      </div>
    </main>
  );
}
