'use client';

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  FolderKanban,
  Inbox,
  Monitor,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";

import CreateTaskModal from "@/components/CreateTaskModal";
import {
  fetchTasks,
  formatTaskTimestamp,
  getConfidenceLabel,
  getTaskIdentifier,
  getTaskStatusMeta,
  type TaskRecord,
} from "@/components/task-api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Search", shortcut: "⌘K", icon: Search },
  { label: "New Task", shortcut: "C", icon: Plus },
  { label: "Inbox", icon: Inbox },
  { label: "My Tasks", icon: CircleDashed },
];

const workspaceNav = [
  { label: "Board", icon: FolderKanban, active: true },
  { label: "Projects", icon: Workflow },
  { label: "Autopilot", icon: Bot },
  { label: "Agents", icon: Users },
];

const configureNav = [
  { label: "Runtimes", icon: Monitor },
  { label: "Skills", icon: Sparkles },
  { label: "Settings", icon: Settings },
];

export default function BoardPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const result = await fetchTasks();
      if (!active) {
        return;
      }

      setTasks(result.tasks);
      setMessage(result.message ?? null);
      setLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
  }, []);


  const sortedTasks = useMemo(() => {
    return [...tasks]
      .map((task, index) => ({ task, index }))
      .sort((left, right) => {
        const delta = getSortValue(right.task.updatedAt) - getSortValue(left.task.updatedAt);
        if (delta !== 0) {
          return delta;
        }

        return left.index - right.index;
      })
      .map(({ task }) => task);
  }, [tasks]);

  const selectedTask = useMemo(
    () => sortedTasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, sortedTasks]
  );

  return (
    <>
      <main className="board-shell min-h-screen text-[#f5f2ec]">
        <div className="grid min-h-screen lg:h-screen lg:grid-cols-[252px_320px_minmax(0,1fr)]">
          <aside className="flex flex-col border-b border-white/6 px-4 py-4 lg:border-b-0 lg:border-r lg:border-r-white/8">
            <div className="flex items-center justify-between gap-3 px-2 py-1">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold text-white/80">
                  P
                </div>
                <p className="truncate text-[15px] font-medium text-white/92">prince</p>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/80"
                aria-label="Toggle workspace menu"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {primaryNav.map(({ label, shortcut, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={label === "New Task" ? () => setIsCreateModalOpen(true) : undefined}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] text-white/58 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </span>
                  {shortcut ? (
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-white/34">
                      {shortcut}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <SidebarGroup title="Workspace">
              {workspaceNav.map(({ label, icon: Icon, active }) => (
                <SidebarItem key={label} label={label} icon={<Icon className="h-4 w-4" />} active={active} />
              ))}
            </SidebarGroup>

            <SidebarGroup title="Configure">
              {configureNav.map(({ label, icon: Icon }) => (
                <SidebarItem key={label} label={label} icon={<Icon className="h-4 w-4" />} />
              ))}
            </SidebarGroup>

            <div className="mt-auto border-t border-white/8 px-3 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ece24b] text-xs font-semibold text-[#171612]">
                  P
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-white/90">prince pal</p>
                  <p className="truncate text-sm text-white/42">pal265354@gmail.com</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-[420px] flex-col border-b border-white/6 lg:border-b-0 lg:border-r lg:border-r-white/8">
            <div className="border-b border-white/8 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-[24px] font-medium tracking-[-0.04em] text-white">Tasks</h1>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="rounded-md p-2 text-white/52 transition-colors hover:bg-white/[0.05] hover:text-white"
                  aria-label="Create task"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {message ? (
              <div className="border-b border-[#49361d] bg-[#261f16] px-5 py-3 text-sm text-[#e6ca9f]">{message}</div>
            ) : null}

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {loading ? (
                <ListPlaceholder label="Loading task board…" />
              ) : sortedTasks.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center">
                  <Sparkles className="h-10 w-10 text-white/16" />
                  <h2 className="mt-6 text-[30px] font-medium tracking-[-0.05em] text-white/70">No workspace tasks yet</h2>
                  <p className="mt-3 max-w-[260px] text-sm leading-6 text-white/42">
                    Start a task to rank repo context, build the prompt preview, and collect verification evidence.
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-6 h-10 bg-white text-[#121214] shadow-none hover:translate-y-0 hover:bg-white/92"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              ) : (
                <div>
                  {sortedTasks.map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      selected={selectedTaskId === task.id}
                      onSelect={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="flex min-h-[520px] flex-col">
            {selectedTask ? (
              <>
                <div className="border-b border-white/8 px-7 py-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <MetaPill label={getTaskIdentifier(selectedTask.id)} />
                        <StatusBadge task={selectedTask} />
                        <MetaPill label={`Updated ${formatTaskTimestamp(selectedTask.updatedAt)}`} />
                      </div>
                      <h2 className="mt-5 text-[32px] font-medium tracking-[-0.05em] text-white">
                        {selectedTask.title}
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/46">
                        {selectedTask.contextSummary || selectedTask.prompt}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/58">
                      {getConfidenceLabel(selectedTask.score)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="grid border-b border-white/6 xl:grid-cols-[1.05fr_0.95fr] xl:divide-x xl:divide-white/6">
                    <DetailSection title="Prompt preview" eyebrow="Context">
                      <p className="text-sm leading-7 text-white/72">
                        {selectedTask.promptPreview || selectedTask.prompt}
                      </p>
                    </DetailSection>
                    <DetailSection title="Verification status" eyebrow="Checks">
                      <div className="grid gap-3">
                        <VerificationRow label="Lint" status={selectedTask.lintStatus} />
                        <VerificationRow label="Tests" status={selectedTask.testStatus} />
                        <VerificationRow
                          label="Confidence"
                          status={getConfidenceStatus(selectedTask.score)}
                          value={selectedTask.score !== null ? `${selectedTask.score}/100` : "Pending"}
                        />
                      </div>
                    </DetailSection>
                  </div>

                  <div className="grid border-b border-white/6 xl:grid-cols-[1.05fr_0.95fr] xl:divide-x xl:divide-white/6">
                    <DetailSection title="Selected files" eyebrow="Repo context">
                      <div className="space-y-3">
                        {selectedTask.selectedFiles.length > 0 ? (
                          selectedTask.selectedFiles.slice(0, 6).map((file) => (
                            <div key={file.path} className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3.5">
                              <div className="flex items-center justify-between gap-4">
                                <p className="truncate font-mono text-sm text-white/80">{file.path}</p>
                                <span className="text-xs text-white/36">{file.score ?? "—"}</span>
                              </div>
                              {file.rationale ? (
                                <p className="mt-2 text-sm leading-6 text-white/44">{file.rationale}</p>
                              ) : null}
                            </div>
                          ))
                        ) : (
                          <EmptyInline label="No selected files captured yet." />
                        )}
                      </div>
                    </DetailSection>
                    <DetailSection title="Run notes" eyebrow="Execution">
                      <div className="space-y-4">
                        <KeyValueRow label="Execution mode" value={selectedTask.executionMode || "Task run"} />
                        <KeyValueRow label="Repository" value={selectedTask.repoPath || "."} mono />
                        <KeyValueRow label="Prompt confidence" value={getConfidenceLabel(selectedTask.score)} />
                        {selectedTask.failureSignal ? (
                          <div className="rounded-2xl border border-[#533033] bg-[#211417] px-4 py-3 text-sm text-[#f1b5b5]">
                            <p className="font-medium text-[#ffd2d2]">{selectedTask.failureSignal.summary}</p>
                            <p className="mt-2 leading-6 text-[#d9aaaa]">{selectedTask.failureSignal.detail}</p>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-7 text-white/50">
                            {selectedTask.verificationNotes || selectedTask.logs || "No execution notes captured yet."}
                          </p>
                        )}
                      </div>
                    </DetailSection>
                  </div>

                  <div className="grid xl:grid-cols-[1.12fr_0.88fr] xl:divide-x xl:divide-white/6">
                    <DetailSection title="Patch preview" eyebrow="Diff">
                      <pre className="overflow-x-auto rounded-[24px] border border-white/8 bg-black/20 p-5 font-mono text-[12px] leading-6 text-[#c1c7d0]">
                        {getPatchPreview(selectedTask)}
                      </pre>
                    </DetailSection>
                    <DetailSection title="Verification evidence" eyebrow="Logs">
                      <div className="space-y-4">
                        <LogBlock title="Lint output" body={selectedTask.lintOutput} />
                        <LogBlock title="Test output" body={selectedTask.testOutput} />
                        <LogBlock title="Execution log" body={selectedTask.logs} />
                      </div>
                    </DetailSection>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-8">
                <div className="max-w-md text-center">
                  <Sparkles className="mx-auto h-12 w-12 text-white/16" />
                  <h2 className="mt-6 text-[34px] font-medium tracking-[-0.05em] text-white/70">
                    Select a task to view details
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/42">
                    Review repo context, prompt previews, patch output, and verification evidence from one focused pane.
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-7 h-10 bg-white text-[#121214] shadow-none hover:translate-y-0 hover:bg-white/92"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <CreateTaskModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  );
}

function SidebarGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-7">
      <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.2em] text-white/28">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({ label, icon, active = false }: { label: string; icon: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors",
        active ? "bg-white/[0.07] text-white" : "text-white/58 hover:bg-white/[0.05] hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function TaskListItem({
  task,
  selected,
  onSelect,
}: {
  task: TaskRecord;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full border-b border-white/6 px-4 py-4 text-left transition-colors last:border-b-0",
        selected ? "bg-white/[0.06]" : "hover:bg-white/[0.035]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/26">{getTaskIdentifier(task.id)}</p>
            <StatusBadge task={task} />
          </div>
          <h2 className="mt-3 text-[15px] font-medium text-white/88">{task.title}</h2>
        </div>
        <span className="text-xs text-white/32">{formatTaskTimestamp(task.updatedAt)}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/42">{task.contextSummary || task.prompt}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/30">
        <span>{task.selectedFiles.length} files</span>
        <span>{task.repoPath || "."}</span>
      </div>
    </button>
  );
}

function StatusBadge({ task }: { task: TaskRecord }) {
  const meta = getTaskStatusMeta(task.status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        task.status === "passed" && "bg-[#183424] text-[#7fe1a1]",
        task.status === "running" && "bg-[#342a14] text-[#f4cb67]",
        task.status === "failed" && "bg-[#371b1e] text-[#ff8c8c]",
        task.status === "needs_review" && "bg-[#241d35] text-[#b8a0ff]",
        task.status === "queued" && "bg-white/8 text-white/52"
      )}
    >
      {meta.label}
    </span>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-white/48">
      {label}
    </span>
  );
}

function DetailSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="px-7 py-7">
      <p className="text-[11px] uppercase tracking-[0.22em] text-white/26">{eyebrow}</p>
      <h3 className="mt-2 text-lg font-medium text-white/90">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function VerificationRow({
  label,
  status,
  value,
}: {
  label: string;
  status: "passed" | "failed" | "pending";
  value?: string;
}) {
  const Icon = status === "passed" ? CheckCircle2 : status === "failed" ? XCircle : CircleDashed;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3.5">
      <span className="text-sm text-white/54">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-2 text-sm",
          status === "passed" && "text-[#86deaa]",
          status === "failed" && "text-[#f19898]",
          status === "pending" && "text-white/42"
        )}
      >
        <Icon className="h-4 w-4" />
        {value ?? (status === "passed" ? "Passed" : status === "failed" ? "Failed" : "Pending")}
      </span>
    </div>
  );
}

function KeyValueRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3.5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/28">{label}</p>
      <p className={cn("mt-2 text-sm text-white/78", mono && "font-mono")}>{value}</p>
    </div>
  );
}

function EmptyInline({ label }: { label: string }) {
  return <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/40">{label}</p>;
}

function LogBlock({ title, body }: { title: string; body?: string | null }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/26">{title}</p>
      <pre className="mt-3 whitespace-pre-wrap font-mono text-[12px] leading-6 text-[#c1c7d0]">
        {body?.trim() || "No output captured."}
      </pre>
    </div>
  );
}

function ListPlaceholder({ label }: { label: string }) {
  return (
    <div className="space-y-1 px-2 py-2">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse border-b border-white/6 px-4 py-5 last:border-b-0">
          <div className="h-3 w-20 rounded-full bg-white/8" />
          <div className="mt-3 h-4 w-3/4 rounded-full bg-white/8" />
          <div className="mt-4 h-3 w-full rounded-full bg-white/6" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-white/6" />
        </div>
      ))}
      <p className="pt-4 text-center text-sm text-white/34">{label}</p>
    </div>
  );
}

function getPatchPreview(task: TaskRecord) {
  if (!task.diff) {
    return task.patchSummary || "Patch preview will appear here once the task generates a diff artifact.";
  }

  return task.diff.split("\n").slice(0, 26).join("\n");
}

function getConfidenceStatus(score: number | null): "passed" | "failed" | "pending" {
  if (score === null) {
    return "pending";
  }

  return score >= 70 ? "passed" : "failed";
}

function getSortValue(value?: string | null) {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}
