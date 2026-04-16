import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { tasks, type Task } from "@/features/dashboard/data";
import StatusPill from "@/features/dashboard/status-pill";

const verificationTone = {
  passed: {
    label: "Passed",
    className: "bg-[#16241c] text-[#7bf2b4]",
  },
  failed: {
    label: "Failed",
    className: "bg-[#2a1719] text-[#f6a4a4]",
  },
  pending: {
    label: "Pending",
    className: "bg-white/[0.06] text-[#c7ced8]",
  },
} as const;

function MetadataStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/6 pt-4">
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">{label}</p>
      <p className="mt-3 text-sm text-white">{value}</p>
    </div>
  );
}

function FileList({ task }: { task: Task }) {
  return (
    <section className="surface-soft rounded-[1.75rem] p-6">
      <div className="flex items-end justify-between border-b border-white/6 pb-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Context</p>
          <h2 className="mt-2 text-lg font-medium text-white">Selected files</h2>
        </div>
        <span className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[#7b8794]">
          {task.selectedFiles.length} files
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {task.selectedFiles.map((file) => (
          <div
            key={file.path}
            className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3"
          >
            <span className="font-mono-ui text-sm text-[#d8dde4]">{file.path}</span>
            <span className="rounded-full bg-[#bdff64] px-3 py-1 text-xs font-medium text-[#0a0d10]">
              {file.score}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScorePanel({ task }: { task: Task }) {
  const hasScore = task.score > 0;
  const tone =
    task.score >= 85
      ? "from-[#bdff64] to-[#7bf2b4]"
      : task.score >= 60
        ? "from-[#f7d879] to-[#bdff64]"
        : "from-[#f6a4a4] to-[#f7d879]";

  return (
    <section className="surface-panel rounded-[1.75rem] p-6">
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Review score</p>
      <div className="mt-5 flex items-end gap-3">
        <span className="font-display text-6xl text-white">{hasScore ? task.score : "--"}</span>
        <span className="pb-2 text-sm text-[#8d97a3]">/100</span>
      </div>

      <div className="mt-6 h-2 rounded-full bg-white/8">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${tone}`}
          style={{ width: `${hasScore ? task.score : 18}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-[#9aa6b2]">
        {task.status === "passed" && "Verification is complete and the task is ready to ship."}
        {task.status === "failed" && "The run needs a fix before it can re-enter the queue."}
        {task.status === "needs_review" && "Automated checks passed. Human review is the last gate."}
        {(task.status === "queued" || task.status === "running") &&
          "Scoring will appear once the execution reaches a reviewable state."}
      </p>
    </section>
  );
}

function DiffPanel({ diff }: { diff: string }) {
  return (
    <section className="surface-panel rounded-[1.75rem] p-6">
      <div className="flex items-end justify-between border-b border-white/6 pb-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Output</p>
          <h2 className="mt-2 text-lg font-medium text-white">Unified diff</h2>
        </div>
        <span className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[#7b8794]">
          preview
        </span>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-[1.25rem] border border-white/8 bg-[#06080b] p-5 text-xs leading-7 text-[#d8dde4]">
        <code>{diff || "No diff available for this task yet."}</code>
      </pre>
    </section>
  );
}

function VerificationPanel({ task }: { task: Task }) {
  const checks = [
    { label: "Lint", status: task.lintStatus },
    { label: "Tests", status: task.testStatus },
  ] as const;

  return (
    <section className="surface-soft rounded-[1.75rem] p-6">
      <div className="flex items-end justify-between border-b border-white/6 pb-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Verification</p>
          <h2 className="mt-2 text-lg font-medium text-white">Checks and logs</h2>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {checks.map((check) => {
          const tone = verificationTone[check.status];

          return (
            <div
              key={check.label}
              className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{check.label}</span>
                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${tone.className}`}>
                  {tone.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-[#06080b] p-5">
        <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Logs</p>
        <pre className="mt-3 whitespace-pre-wrap text-xs leading-7 text-[#cfd6de]">{task.logs}</pre>
      </div>
    </section>
  );
}

export default function TaskDetail({ id }: { id: string }) {
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <div className="surface-panel rounded-[2rem] p-8">
        <Link href="/board">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to board
          </Button>
        </Link>
        <div className="mt-10 max-w-xl">
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#7b8794]">Missing task</p>
          <h1 className="font-display mt-4 text-4xl text-white">No matching task</h1>
          <p className="mt-4 text-base leading-7 text-[#9aa6b2]">
            The requested task was not found in the current demo dataset.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="surface-panel rounded-[2rem] p-6 sm:p-8">
        <Link href="/board">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to board
          </Button>
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div>
            <p className="font-mono-ui text-[0.72rem] uppercase tracking-[0.3em] text-[#7b8794]">
              {task.id}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusPill status={task.status} />
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#8d97a3]">
                {task.updatedAt}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#8d97a3]">
                {task.repoPath || "apps/web"}
              </span>
            </div>
            <h1 className="font-display mt-6 text-4xl text-white sm:text-5xl">{task.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#9aa6b2]">{task.prompt}</p>
          </div>

          <div className="surface-quiet rounded-[1.5rem] p-5 lg:w-[300px]">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Task summary</p>
            <div className="mt-4 space-y-4">
              <MetadataStrip label="Selected files" value={`${task.selectedFiles.length} files`} />
              <MetadataStrip label="Lint status" value={verificationTone[task.lintStatus].label} />
              <MetadataStrip label="Test status" value={verificationTone[task.testStatus].label} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-6">
          <FileList task={task} />
          <ScorePanel task={task} />
        </div>
        <div className="space-y-6">
          <DiffPanel diff={task.diff} />
          <VerificationPanel task={task} />
        </div>
      </section>
    </div>
  );
}
