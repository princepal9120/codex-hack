import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { type TaskStatus } from "@/components/task-api";

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { label: string; variant: NonNullable<BadgeProps["variant"]> }> = {
  queued: { label: "Queued", variant: "queued" },
  running: { label: "Running", variant: "running" },
  passed: { label: "Passed", variant: "passed" },
  failed: { label: "Failed", variant: "failed" },
  needs_review: { label: "Needs Review", variant: "warning" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
