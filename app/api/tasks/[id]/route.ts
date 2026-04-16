import { NextResponse } from "next/server";

import { queueTaskExecution } from "@/lib/server/run-task";
import { getTaskById, resetTaskForRetry } from "@/lib/server/task-store";

export const runtime = "nodejs";

interface TaskRouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: TaskRouteContext) {
  const task = getTaskById(params.id);

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function POST(_request: Request, { params }: TaskRouteContext) {
  const current = getTaskById(params.id);

  if (!current) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (current.status !== "passed" && current.status !== "failed" && current.status !== "needs_review") {
    return NextResponse.json(
      { error: "Only completed tasks can be retried from this endpoint. Use /run for queued tasks." },
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
