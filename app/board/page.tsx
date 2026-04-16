'use client';

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Columns,
  Filter,
  FolderKanban,
  Inbox,
  List,
  ListTodo,
  Monitor,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import CreateTaskModal from "@/components/CreateTaskModal";
import {
  fetchTasks,
  formatTaskTimestamp,
  getConfidenceLabel,
  getTaskIdentifier,
  getTaskStatusMeta,
  getVerificationMeta,
  type TaskRecord,
  type TaskStatus,
  type VerificationStatus,
} from "@/components/task-api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TASK_STATUSES: TaskStatus[] = ["queued", "running", "needs_review", "passed", "failed"];

type ScopeMode = "all" | "active" | "review";
type ViewMode = "board" | "list";
type SortField = "updated" | "score" | "title";
type SortDirection = "desc" | "asc";
type VerificationFilter = "all" | "healthy" | "attention";

const primaryNav: Array<{ label: string; icon: typeof Search; shortcut?: string }> = [
  { label: "Search", shortcut: "⌘K", icon: Search },
  { label: "New Task", shortcut: "C", icon: Plus },
  { label: "Inbox", icon: Inbox },
  { label: "My Tasks", icon: CircleDashed },
];

const workspaceNav: Array<{ label: string; icon: typeof ListTodo; active?: boolean }> = [
  { label: "Tasks", icon: ListTodo, active: true },
  { label: "Projects", icon: FolderKanban },
  { label: "Autopilot", icon: Bot },
  { label: "Agents", icon: Users },
];

const configureNav: Array<{ label: string; icon: typeof Monitor }> = [
  { label: "Runtimes", icon: Monitor },
  { label: "Skills", icon: Sparkles },
  { label: "Settings", icon: Settings },
];

const scopeOptions: Array<{ value: ScopeMode; label: string; description: string }> = [
  { value: "all", label: "All", description: "All tasks in the current workspace." },
  { value: "active", label: "Active", description: "Queued and running tasks still in motion." },
  { value: "review", label: "Review", description: "Tasks that need human attention or a retry." },
];

const sortOptions: Array<{ value: SortField; label: string }> = [
  { value: "updated", label: "Last updated" },
  { value: "score", label: "Confidence" },
  { value: "title", label: "Title" },
];

const verificationOptions: Array<{ value: VerificationFilter; label: string }> = [
  { value: "all", label: "All checks" },
  { value: "healthy", label: "Healthy only" },
  { value: "attention", label: "Needs attention" },
];

const statusDescription: Record<TaskStatus, string> = {
  queued: "Captured and waiting for execution.",
  running: "Scanning context and generating review artifacts.",
  needs_review: "Preview is ready, but a human still needs to trust it.",
  passed: "Verification cleared and the result looks ready.",
  failed: "Execution or verification failed before trust.",
};

export default function BoardPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [scope, setScope] = useState<ScopeMode>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [sortBy, setSortBy] = useState<SortField>("updated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>("all");
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
  const [showContextSummary, setShowContextSummary] = useState(true);
  const [showRepoMeta, setShowRepoMeta] = useState(true);
  const [showVerificationMeta, setShowVerificationMeta] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);

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

  const scopedTasks = useMemo(() => {
    switch (scope) {
      case "active":
        return tasks.filter((task) => task.status === "queued" || task.status === "running");
      case "review":
        return tasks.filter((task) => task.status === "needs_review" || task.status === "failed");
      default:
        return tasks;
    }
  }, [scope, tasks]);

  const filteredTasks = useMemo(() => {
    return scopedTasks.filter((task) => {
      if (statusFilters.length > 0 && !statusFilters.includes(task.status)) {
        return false;
      }

      if (verificationFilter === "healthy") {
        return task.lintStatus === "passed" && task.testStatus === "passed";
      }

      if (verificationFilter === "attention") {
        return (
          task.status === "failed" ||
          task.status === "needs_review" ||
          task.lintStatus === "failed" ||
          task.testStatus === "failed"
        );
      }

      return true;
    });
  }, [scopedTasks, statusFilters, verificationFilter]);

  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks].sort((left, right) => {
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }

      if (sortBy === "score") {
        return (left.score ?? -1) - (right.score ?? -1);
      }

      return getSortValue(left.updatedAt) - getSortValue(right.updatedAt);
    });

    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [filteredTasks, sortBy, sortDirection]);

  const visibleStatuses = useMemo(() => {
    if (statusFilters.length > 0) {
      return TASK_STATUSES.filter((status) => statusFilters.includes(status));
    }

    if (scope === "active") {
      return ["queued", "running"] satisfies TaskStatus[];
    }

    if (scope === "review") {
      return ["needs_review", "failed"] satisfies TaskStatus[];
    }

    return TASK_STATUSES;
  }, [scope, statusFilters]);

  const hiddenStatuses = useMemo(() => TASK_STATUSES.filter((status) => !visibleStatuses.includes(status)), [visibleStatuses]);

  const groupedTasks = useMemo(() => {
    return TASK_STATUSES.reduce<Record<TaskStatus, TaskRecord[]>>((groups, status) => {
      groups[status] = sortedTasks.filter((task) => task.status === status);
      return groups;
    }, {
      queued: [],
      running: [],
      needs_review: [],
      passed: [],
      failed: [],
    });
  }, [sortedTasks]);

  const scopeCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter((task) => task.status === "queued" || task.status === "running").length,
    review: tasks.filter((task) => task.status === "needs_review" || task.status === "failed").length,
  }), [tasks]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilters.length > 0) count += 1;
    if (verificationFilter !== "all") count += 1;
    return count;
  }, [statusFilters, verificationFilter]);

  return (
    <>
      <main className="board-shell min-h-screen text-[#f5f2ec]">
        <div className="flex min-h-screen">
          <aside className="hidden w-[268px] shrink-0 border-r border-white/8 px-4 py-4 lg:flex lg:flex-col">
            <div className="flex items-center justify-between gap-3 px-2 py-1">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold text-white/80">
                  CF
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-white/92">CodexFlow</p>
                  <p className="truncate text-xs text-white/34">review-first workspace</p>
                </div>
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

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/8 px-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-semibold text-white/75">
                CF
              </div>
              <span className="text-sm text-white/44">CodexFlow</span>
              <ChevronRight className="h-3 w-3 text-white/24" />
              <span className="text-sm font-medium text-white/88">Tasks</span>
            </div>

            <div className="border-b border-white/8 px-4 py-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {scopeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setScope(option.value)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs transition-colors",
                        scope === option.value ? "bg-white text-[#111113]" : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                      )}
                    >
                      {option.label}
                      <span className="ml-2 text-[10px] opacity-60">{scopeCounts[option.value]}</span>
                    </button>
                  ))}
                </div>

                <div className="relative flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFiltersOpen((open) => !open);
                      setDisplayOpen(false);
                    }}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 ? <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">{activeFilterCount}</Badge> : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDisplayOpen((open) => !open);
                      setFiltersOpen(false);
                    }}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Columns className="h-4 w-4" />
                    Display
                  </button>

                  <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.03] p-1">
                    <ViewToggleButton active={viewMode === "board"} onClick={() => setViewMode("board")} icon={<Columns className="h-4 w-4" />} label="Board" />
                    <ViewToggleButton active={viewMode === "list"} onClick={() => setViewMode("list")} icon={<List className="h-4 w-4" />} label="List" />
                  </div>

                  <Button size="sm" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    New Task
                  </Button>

                  {filtersOpen ? (
                    <FloatingPanel className="right-[142px] top-[calc(100%+0.75rem)] w-[320px]">
                      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/32">Filters</p>
                          <p className="mt-1 text-sm text-white/66">Narrow the task board like Multica’s issues controls.</p>
                        </div>
                        <button type="button" onClick={() => setFiltersOpen(false)} className="rounded-md p-1 text-white/36 hover:bg-white/[0.05] hover:text-white/80">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-5 px-4 py-4">
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/32">Verification</p>
                          <div className="flex flex-wrap gap-2">
                            {verificationOptions.map((option) => (
                              <ChipButton key={option.value} active={verificationFilter === option.value} onClick={() => setVerificationFilter(option.value)}>
                                {option.label}
                              </ChipButton>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/32">Statuses</p>
                            {statusFilters.length > 0 ? (
                              <button type="button" onClick={() => setStatusFilters([])} className="text-xs text-white/44 hover:text-white/82">
                                Reset
                              </button>
                            ) : null}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {TASK_STATUSES.map((status) => {
                              const meta = getTaskStatusMeta(status);
                              const checked = statusFilters.includes(status);
                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => setStatusFilters((current) => current.includes(status) ? current.filter((item) => item !== status) : [...current, status])}
                                  className={cn(
                                    "flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors",
                                    checked ? "border-white/20 bg-white/[0.08] text-white" : "border-white/8 bg-white/[0.03] text-white/56 hover:bg-white/[0.05] hover:text-white"
                                  )}
                                >
                                  <span>{meta.label}</span>
                                  {checked ? <Check className="h-4 w-4" /> : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </FloatingPanel>
                  ) : null}

                  {displayOpen ? (
                    <FloatingPanel className="right-[48px] top-[calc(100%+0.75rem)] w-[320px]">
                      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/32">Display</p>
                          <p className="mt-1 text-sm text-white/66">Tune sorting and which task metadata stays visible.</p>
                        </div>
                        <button type="button" onClick={() => setDisplayOpen(false)} className="rounded-md p-1 text-white/36 hover:bg-white/[0.05] hover:text-white/80">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-5 px-4 py-4">
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/32">Sort by</p>
                          <div className="space-y-2">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setSortBy(option.value)}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors",
                                  sortBy === option.value ? "border-white/20 bg-white/[0.08] text-white" : "border-white/8 bg-white/[0.03] text-white/56 hover:bg-white/[0.05] hover:text-white"
                                )}
                              >
                                <span>{option.label}</span>
                                {sortBy === option.value ? <Check className="h-4 w-4" /> : null}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/32">Direction</p>
                          <div className="flex gap-2">
                            <ChipButton active={sortDirection === "desc"} onClick={() => setSortDirection("desc")}>Newest first</ChipButton>
                            <ChipButton active={sortDirection === "asc"} onClick={() => setSortDirection("asc")}>Oldest first</ChipButton>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/32">Card properties</p>
                          <div className="space-y-2">
                            <ToggleRow label="Context summary" enabled={showContextSummary} onToggle={() => setShowContextSummary((value) => !value)} />
                            <ToggleRow label="Repo metadata" enabled={showRepoMeta} onToggle={() => setShowRepoMeta((value) => !value)} />
                            <ToggleRow label="Verification chips" enabled={showVerificationMeta} onToggle={() => setShowVerificationMeta((value) => !value)} />
                          </div>
                        </div>
                      </div>
                    </FloatingPanel>
                  ) : null}
                </div>
              </div>
            </div>

            {message ? (
              <div className="border-b border-[#49361d] bg-[#261f16] px-4 py-3 text-sm text-[#e6ca9f]">{message}</div>
            ) : null}

            {loading ? (
              <LoadingBoard />
            ) : sortedTasks.length === 0 ? (
              <EmptyBoardState onCreate={() => setIsCreateModalOpen(true)} scopeLabel={scopeOptions.find((option) => option.value === scope)?.label ?? "All"} />
            ) : viewMode === "board" ? (
              <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto p-4">
                {visibleStatuses.map((status) => (
                  <BoardColumn
                    key={status}
                    status={status}
                    tasks={groupedTasks[status]}
                    onCreate={() => setIsCreateModalOpen(true)}
                    showContextSummary={showContextSummary}
                    showRepoMeta={showRepoMeta}
                    showVerificationMeta={showVerificationMeta}
                  />
                ))}

                {hiddenStatuses.length > 0 ? (
                  <HiddenColumnsPanel hiddenStatuses={hiddenStatuses} onReveal={(status) => setStatusFilters((current) => [...current, status])} />
                ) : null}
              </div>
            ) : (
              <ListView
                visibleStatuses={visibleStatuses}
                groupedTasks={groupedTasks}
                onCreate={() => setIsCreateModalOpen(true)}
                showContextSummary={showContextSummary}
                showRepoMeta={showRepoMeta}
                showVerificationMeta={showVerificationMeta}
              />
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

function ViewToggleButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs transition-colors",
        active ? "bg-white text-[#111113]" : "text-white/48 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function FloatingPanel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("absolute z-20 rounded-[22px] border border-white/10 bg-[#18181b] shadow-[0_24px_80px_rgba(0,0,0,0.45)]", className)}>{children}</div>;
}

function ChipButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs transition-colors",
        active ? "bg-white text-[#111113]" : "border border-white/8 bg-white/[0.03] text-white/62 hover:bg-white/[0.05] hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/72 transition-colors hover:bg-white/[0.05] hover:text-white"
    >
      <span>{label}</span>
      <span className={cn("inline-flex h-6 w-11 items-center rounded-full border px-0.5 transition-colors", enabled ? "border-white/20 bg-white" : "border-white/10 bg-white/[0.04]") }>
        <span className={cn("h-4.5 w-4.5 rounded-full transition-transform", enabled ? "translate-x-5 bg-[#111113]" : "translate-x-0 bg-white/55")} />
      </span>
    </button>
  );
}

function LoadingBoard() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/8 px-4">
        <div className="h-5 w-5 rounded bg-white/8" />
        <div className="h-4 w-32 rounded bg-white/8" />
      </div>
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/8 px-4">
        <div className="h-5 w-28 rounded bg-white/8" />
        <div className="h-8 w-28 rounded-full bg-white/8" />
      </div>
      <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex min-w-[280px] flex-1 flex-col gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
            <div className="h-4 w-20 rounded bg-white/8" />
            <div className="h-24 rounded-[20px] bg-white/[0.05]" />
            <div className="h-24 rounded-[20px] bg-white/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyBoardState({ onCreate, scopeLabel }: { onCreate: () => void; scopeLabel: string }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-3 px-8 text-center">
      <ListTodo className="h-10 w-10 text-white/18" />
      <p className="text-sm uppercase tracking-[0.24em] text-white/28">{scopeLabel}</p>
      <h2 className="text-[30px] font-medium tracking-[-0.05em] text-white/72">No matching tasks</h2>
      <p className="max-w-md text-sm leading-7 text-white/42">
        Adjust the current filters or create a new task to start collecting prompt previews, patch artifacts, and verification evidence.
      </p>
      <Button onClick={onCreate} className="mt-2 gap-2">
        <Plus className="h-4 w-4" />
        Create Task
      </Button>
    </div>
  );
}

function BoardColumn({
  status,
  tasks,
  onCreate,
  showContextSummary,
  showRepoMeta,
  showVerificationMeta,
}: {
  status: TaskStatus;
  tasks: TaskRecord[];
  onCreate: () => void;
  showContextSummary: boolean;
  showRepoMeta: boolean;
  showVerificationMeta: boolean;
}) {
  const meta = getTaskStatusMeta(status);

  return (
    <section className="flex min-w-[290px] max-w-[320px] flex-1 flex-col rounded-[24px] border border-white/8 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={meta.variant}>{meta.label}</Badge>
            <span className="text-xs text-white/38">{tasks.length}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/38">{statusDescription[status]}</p>
        </div>
        <button type="button" onClick={onCreate} className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskBoardCard
              key={task.id}
              task={task}
              showContextSummary={showContextSummary}
              showRepoMeta={showRepoMeta}
              showVerificationMeta={showVerificationMeta}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[20px] border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/34">
            No tasks in {meta.label.toLowerCase()}.
          </div>
        )}
      </div>
    </section>
  );
}

function TaskBoardCard({
  task,
  showContextSummary,
  showRepoMeta,
  showVerificationMeta,
}: {
  task: TaskRecord;
  showContextSummary: boolean;
  showRepoMeta: boolean;
  showVerificationMeta: boolean;
}) {
  const lint = getVerificationMeta(task.lintStatus);
  const tests = getVerificationMeta(task.testStatus);

  return (
    <Link href={`/tasks/${task.id}`} className="group block rounded-[20px] border border-white/8 bg-[#131316] px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-white/16 hover:bg-[#17171b]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/24">{getTaskIdentifier(task.id)}</p>
          <h3 className="mt-3 text-[15px] font-medium text-white/90 transition-colors group-hover:text-white">{task.title}</h3>
        </div>
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] text-white/42">{task.score ?? "—"}</span>
      </div>

      {showContextSummary ? (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/46">{task.contextSummary || task.prompt}</p>
      ) : null}

      {showVerificationMeta ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <MiniMetaChip label={`Lint ${lint.label}`} tone={task.lintStatus} />
          <MiniMetaChip label={`Tests ${tests.label}`} tone={task.testStatus} />
        </div>
      ) : null}

      {showRepoMeta ? (
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/32">
          <span>{task.selectedFiles.length} files</span>
          <span className="truncate">{task.repoPath || "."}</span>
          <span>{formatTaskTimestamp(task.updatedAt)}</span>
        </div>
      ) : null}
    </Link>
  );
}

function MiniMetaChip({ label, tone }: { label: string; tone: VerificationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]",
        tone === "passed" && "bg-[#173122] text-[#8fe0ad]",
        tone === "failed" && "bg-[#361b1e] text-[#f1a2a2]",
        tone === "pending" && "bg-white/[0.06] text-white/50"
      )}
    >
      {label}
    </span>
  );
}

function HiddenColumnsPanel({ hiddenStatuses, onReveal }: { hiddenStatuses: TaskStatus[]; onReveal: (status: TaskStatus) => void }) {
  return (
    <aside className="w-[228px] shrink-0 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/28">Hidden columns</p>
      <div className="mt-4 space-y-2">
        {hiddenStatuses.map((status) => {
          const meta = getTaskStatusMeta(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() => onReveal(status)}
              className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/62 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <span>{meta.label}</span>
              <Plus className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ListView({
  visibleStatuses,
  groupedTasks,
  onCreate,
  showContextSummary,
  showRepoMeta,
  showVerificationMeta,
}: {
  visibleStatuses: TaskStatus[];
  groupedTasks: Record<TaskStatus, TaskRecord[]>;
  onCreate: () => void;
  showContextSummary: boolean;
  showRepoMeta: boolean;
  showVerificationMeta: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <div className="space-y-4">
        {visibleStatuses.map((status) => (
          <ListSection
            key={status}
            status={status}
            tasks={groupedTasks[status]}
            onCreate={onCreate}
            showContextSummary={showContextSummary}
            showRepoMeta={showRepoMeta}
            showVerificationMeta={showVerificationMeta}
          />
        ))}
      </div>
    </div>
  );
}

function ListSection({
  status,
  tasks,
  onCreate,
  showContextSummary,
  showRepoMeta,
  showVerificationMeta,
}: {
  status: TaskStatus;
  tasks: TaskRecord[];
  onCreate: () => void;
  showContextSummary: boolean;
  showRepoMeta: boolean;
  showVerificationMeta: boolean;
}) {
  const meta = getTaskStatusMeta(status);

  return (
    <section className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
        <div className="flex items-center gap-3">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          <span className="text-sm text-white/48">{tasks.length}</span>
        </div>
        <button type="button" onClick={onCreate} className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {tasks.length > 0 ? (
        <div>
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block border-b border-white/6 px-4 py-4 transition-colors last:border-b-0 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/24">{getTaskIdentifier(task.id)}</p>
                    {showVerificationMeta ? <MiniMetaChip label={task.lintStatus} tone={task.lintStatus} /> : null}
                    {showVerificationMeta ? <MiniMetaChip label={task.testStatus} tone={task.testStatus} /> : null}
                  </div>
                  <h3 className="mt-2 text-[15px] font-medium text-white/90">{task.title}</h3>
                  {showContextSummary ? (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/46">{task.contextSummary || task.prompt}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3 text-xs text-white/34">
                  <span>{getConfidenceLabel(task.score)}</span>
                  {showRepoMeta ? <span>{task.selectedFiles.length} files</span> : null}
                  {showRepoMeta ? <span>{task.repoPath || "."}</span> : null}
                  <span>{formatTaskTimestamp(task.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-4 py-8 text-sm text-white/34">No tasks in this section.</div>
      )}
    </section>
  );
}

function getSortValue(value?: string | null) {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}
