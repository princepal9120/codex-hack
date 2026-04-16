import { NextResponse } from "next/server";

import { queueTaskExecution } from "@/lib/server/run-task";
import { getTaskById, resetTaskForRetry } from "@/lib/server/task-store";

export const runtime = "nodejs";

interface TaskRetryRouteContext {
  params: {
    id: string;
  };
}

export async function POST(_request: Request, { params }: TaskRetryRouteContext) {
  const current = getTaskById(params.id);

  if (!current) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (current.status !== "passed" && current.status !== "failed" && current.status !== "needs_review") {
    return NextResponse.json(
      { error: "Only completed tasks can be retried. Use the run endpoint to start queued tasks." },
      { status: 409 }
    );
  }

  const task = resetTaskForRetry(params.id);

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  queueTaskExecution(task.id);

  return NextResponse.json({ task });
}
