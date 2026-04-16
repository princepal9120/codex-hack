import { NextResponse } from "next/server";

import { getTaskTimeline } from "@/lib/server/task-store";

export const runtime = "nodejs";

interface TaskTimelineRouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: TaskTimelineRouteContext) {
  const payload = getTaskTimeline(params.id);

  if (!payload) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json(payload);
}
