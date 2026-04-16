import { NextResponse } from "next/server";

import { loadCodexFlowConfig, validateCreateTaskInput } from "@/lib/config";
import { getProjectById } from "@/lib/server/project-store";
import { queueTaskExecution } from "@/lib/server/run-task";
import { createTask, listTasks } from "@/lib/server/task-store";
import type { CreateTaskInput, TaskKind } from "@/lib/task-types";

export const runtime = "nodejs";

function normalizeTaskKind(value: unknown): TaskKind | undefined {
  return value === "issue" || value === "report" || value === "task" ? value : undefined;
}

function normalizeInput(body: unknown): CreateTaskInput {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  return {
    title: typeof record.title === "string" ? record.title : "",
    prompt: typeof record.prompt === "string" ? record.prompt : "",
    projectId: typeof record.projectId === "string" ? record.projectId : undefined,
    taskKind: normalizeTaskKind(record.taskKind),
    repoPath: typeof record.repoPath === "string" ? record.repoPath : undefined,
    lintCommand: typeof record.lintCommand === "string" ? record.lintCommand : undefined,
    testCommand: typeof record.testCommand === "string" ? record.testCommand : undefined,
  };
}

export async function GET() {
  return NextResponse.json({ tasks: listTasks() });
}

export async function POST(request: Request) {
  const input = normalizeInput(await request.json());

  if (!input.title.trim() || !input.prompt.trim()) {
    return NextResponse.json({ error: "Title and prompt are required." }, { status: 400 });
  }

  if (input.projectId && !getProjectById(input.projectId)) {
    return NextResponse.json({ error: "Selected project was not found." }, { status: 400 });
  }

  const config = loadCodexFlowConfig();
  const validation = validateCreateTaskInput(input, config);

  if (validation.errors.length > 0) {
    return NextResponse.json({ error: validation.errors.join(" ") }, { status: 400 });
  }

  const task = createTask(validation.input);
  queueTaskExecution(task.id);
  return NextResponse.json({ task }, { status: 201 });
}
