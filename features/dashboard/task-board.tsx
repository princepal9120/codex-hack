import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { tasks } from "@/features/dashboard/data";
import StatusPill from "@/features/dashboard/status-pill";

const workspaceStats = [
  { label: "Open issues", value: "18", note: "Human and agent work tracked together." },
  { label: "Active runtimes", value: "04", note: "Local and cloud compute in one panel." },
  { label: "Reusable skills", value: "12", note: "Shared playbooks ready for assignment." },
];

const runtimeCards = [
  { name: "MacBook Pro", state: "online", note: "arm64 / macOS 15.2" },
  { name: "Cloud runner", state: "online", note: "Anthropic / us-east" },
  { name: "Linux server", state: "offline", note: "awaiting reconnect" },
];

const skillRows = [
  { name: "Review PR", detail: "Style guide and regression checks" },
  { name: "Write tests", detail: "Unit and focused integration coverage" },
  { name: "Deploy staging", detail: "Run preflight and ship safely" },
];

export default function TaskBoard() {
  const activeTask = tasks[0];

  return (
    <div className="space-y-6">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#7b8794]">Workspace</p>
          <h1 className="font-display mt-4 text-4xl text-white sm:text-5xl">Dashboard</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#9aa6b2]">
            A calmer issue-and-runtime view inspired by Multica: one workspace for queue, execution,
            verification, onboarding, and reusable skills.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding">
            <Button variant="outline" className="gap-2">
              Start onboarding
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/tasks/${activeTask.id}`}>
            <Button>Inspect active task</Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {workspaceStats.map((stat) => (
          <div key={stat.label} className="surface-soft rounded-[1.7rem] p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[#7b8794]">{stat.label}</p>
            <p className="font-display mt-4 text-4xl text-white">{stat.value}</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#8d97a3]">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="product-frame rounded-[2rem] p-4 sm:p-5">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-4">
            <div className="flex flex-wrap gap-2">
              {["Issues", "Agents", "Skills", "Runtimes"].map((tab, index) => (
                <span
                  key={tab}
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    index === 0 ? "bg-white/[0.08] text-white" : "text-[#7b8794]"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <span className="font-mono-ui text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">
              live demo workspace
            </span>
          </div>

          <div className="grid gap-0 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="py-3 xl:pr-4">
              {tasks.map((task, index) => (
                <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                  <article
                    className={`rounded-[1.25rem] px-4 py-4 transition-all duration-300 hover:bg-white/[0.04] ${
                      index === 0 ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-mono-ui text-[0.64rem] uppercase tracking-[0.22em] text-[#6f7a86]">
                            {task.id}
                          </p>
                          <StatusPill status={task.status} />
                        </div>
                        <h2 className="mt-3 text-lg text-white">{task.title}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9aa6b2]">{task.prompt}</p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-[#8d97a3]">
                        <span>{task.selectedFiles.length} files</span>
                        <span>{task.updatedAt}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="border-t border-white/6 pt-5 xl:border-l xl:border-t-0 xl:pl-5">
              <div className="surface-soft rounded-[1.5rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">
                      Active issue
                    </p>
                    <h3 className="mt-3 text-xl text-white">{activeTask.title}</h3>
                  </div>
                  <StatusPill status={activeTask.status} />
                </div>

                <p className="mt-4 text-sm leading-7 text-[#9aa6b2]">{activeTask.prompt}</p>

                <div className="mt-5 grid gap-3">
                  {[
                    `Lint: ${activeTask.lintStatus}`,
                    `Tests: ${activeTask.testStatus}`,
                    `Repo: ${activeTask.repoPath || "apps/web"}`,
                  ].map((row) => (
                    <div
                      key={row}
                      className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-4 py-3 text-sm text-[#d8dde4]"
                    >
                      {row}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.2rem] border border-white/6 bg-[#0b0f14] p-4">
                  <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">
                    Recent activity
                  </p>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-[#cfd6de]">
                    <p>Assigned to Codex Operator and claimed automatically.</p>
                    <p>Focused test suite completed after handler updates.</p>
                    <p>Waiting on reviewer confirmation for status-code compatibility.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="surface-soft rounded-[1.8rem] p-5">
          <div className="flex items-end justify-between border-b border-white/6 pb-4">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Runtimes</p>
              <h2 className="mt-2 text-xl text-white">Connected compute</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.18em] text-[#7b8794]">7d / 30d / 90d</span>
          </div>

          <div className="mt-4 space-y-3">
            {runtimeCards.map((runtime) => (
              <div
                key={runtime.name}
                className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{runtime.name}</p>
                    <p className="mt-1 text-sm text-[#7b8794]">{runtime.note}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                      runtime.state === "online"
                        ? "bg-[#16241c] text-[#7bf2b4]"
                        : "bg-white/[0.06] text-[#9aa6b2]"
                    }`}
                  >
                    {runtime.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-soft rounded-[1.8rem] p-5">
            <div className="flex items-end justify-between border-b border-white/6 pb-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Skills</p>
                <h2 className="mt-2 text-xl text-white">Shared playbooks</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {skillRows.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] px-4 py-4"
                >
                  <p className="text-sm text-white">{skill.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[#8d97a3]">{skill.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-soft rounded-[1.8rem] p-5">
            <div className="flex items-end justify-between border-b border-white/6 pb-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">First hour</p>
                <h2 className="mt-2 text-xl text-white">Operator checklist</h2>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {[
                "Create the workspace and invite reviewers.",
                "Run setup and connect the local runtime.",
                "Attach one reusable skill to the first agent.",
                "Assign the first issue and watch the run stream.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <span className="font-mono-ui text-sm text-[#bdff64]">0{index + 1}</span>
                  <p className="text-sm leading-7 text-[#cfd6de]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
