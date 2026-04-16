import { Badge } from "@/components/ui/Badge";
import type { TaskStatus } from "@/features/dashboard/data";

const statusMap: Record<
  TaskStatus,
  { label: string; variant: "queued" | "running" | "passed" | "failed" | "warning" }
> = {
  queued: { label: "Queued", variant: "queued" },
  running: { label: "Running", variant: "running" },
  passed: { label: "Passed", variant: "passed" },
  failed: { label: "Failed", variant: "failed" },
  needs_review: { label: "Needs review", variant: "warning" },
};

export default function StatusPill({ status }: { status: TaskStatus }) {
  const tone = statusMap[status];

  return <Badge variant={tone.variant}>{tone.label}</Badge>;
}
