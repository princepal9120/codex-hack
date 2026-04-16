import { NextResponse } from "next/server";

import { loadCodexFlowConfig, resolveRepoPathWithinConfig } from "@/lib/config";
import { createProject, listProjects } from "@/lib/server/project-store";
import { ensureSeedTasks } from "@/lib/server/task-store";
import type { CreateProjectInput } from "@/lib/task-types";

export const runtime = "nodejs";

function normalizeInput(body: unknown): CreateProjectInput {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  return {
    name: typeof record.name === "string" ? record.name : "",
    repoPath: typeof record.repoPath === "string" ? record.repoPath : undefined,
    description: typeof record.description === "string" ? record.description : undefined,
  };
}

export async function GET() {
  ensureSeedTasks();
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const input = normalizeInput(await request.json());

  if (!input.name.trim()) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  const config = loadCodexFlowConfig();
  if (!resolveRepoPathWithinConfig(input.repoPath, config)) {
    return NextResponse.json({ error: "Project repository path must stay inside the configured repository root." }, { status: 400 });
  }

  const project = createProject({
    name: input.name,
    repoPath: input.repoPath,
    description: input.description,
  });

  return NextResponse.json({ project }, { status: 201 });
}
