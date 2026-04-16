'use client';

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, SearchCode, ShieldCheck, Sparkles, Workflow } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import SurfaceCard from "@/components/SurfaceCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchTasks, formatTaskTimestamp, getConfidenceLabel, type TaskRecord, type TaskSource } from "@/components/task-api";

export default function LandingPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [source, setSource] = useState<TaskSource>("api");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const result = await fetchTasks();
      if (!active) return;
      setTasks(result.tasks);
      setSource(result.source);
      setMessage(result.message ?? null);
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      passed: tasks.filter((task) => task.status === "passed").length,
      running: tasks.filter((task) => task.status === "running").length,
      reviewed: tasks.filter((task) => task.status === "needs_review").length,
    }),
    [tasks]
  );

  const featuredTask = useMemo(
    () => tasks.find((task) => task.diff || task.selectedFiles.length > 0) ?? tasks[0] ?? null,
    [tasks]
  );

  const secondaryHref = featuredTask ? `/tasks/${featuredTask.id}` : "/board";
  const secondaryLabel = featuredTask ? "Inspect a task run" : "See issue flow";

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 pb-16">
      <PageHeader
        eyebrow="Context-aware agent onboarding"
        title="Stop cold-starting coding agents on every issue."
        description="CodexFlow builds issue-specific repo context before an agent writes code, then lets teams review the selected files, patch preview, verification results, and change trail in one clear UI."
        badge={source === "api" ? "Review-first AI coding" : "API unavailable"}
        actions={
          <>
            <Link href="/board">
              <Button className="gap-2">
                Open live board
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={secondaryHref}>
              <Button variant="outline" className="gap-2">
                {secondaryLabel}
              </Button>
            </Link>
          </>
        }
        meta={[
          { label: "Tracked issues", value: loading ? "Loading…" : String(summary.total) },
          { label: "Running", value: String(summary.running) },
          { label: "Passed", value: String(summary.passed) },
          { label: "Needs review", value: String(summary.reviewed) },
        ]}
      />

      {message ? <div className="mt-6 rounded-[22px] border border-[#ead7b9] bg-[#fff6e8] px-4 py-3 text-sm text-[#9a6a22]">{message}</div> : null}

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SurfaceCard
          eyebrow="How it works"
          title="From issue creation to reviewable execution"
          description="Instead of letting the agent start blind, CodexFlow prepares the issue with repo-aware context and keeps the entire run visible."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StepCard icon={<Workflow className="h-5 w-5 text-[#0f766e]" />} title="Capture issue" description="Create a task with the request, repo scope, and safe verification commands." />
            <StepCard icon={<SearchCode className="h-5 w-5 text-[#0f766e]" />} title="Build context" description="Scan the repo, rank the most relevant files, and explain why they were selected." />
            <StepCard icon={<Sparkles className="h-5 w-5 text-[#0f766e]" />} title="Generate patch" description="Turn the agent output into a patch preview before anyone trusts the change." />
            <StepCard icon={<ShieldCheck className="h-5 w-5 text-[#0f766e]" />} title="Verify and track" description="Run verification, preserve logs, and track the issue through the full lifecycle." />
          </div>
        </SurfaceCard>

        <SurfaceCard
          eyebrow="Track the run"
          title="One task record tells the whole story"
          description="The board, task detail view, prompt preview, patch preview, and verification evidence all come from the same issue record."
        >
          {loading ? (
            <div className="rounded-[22px] border border-dashed border-[#e5ddd2] bg-white/70 px-5 py-14 text-center text-sm text-[#7e7569]">
              Loading recent task activity…
            </div>
          ) : featuredTask ? (
            <div className="rounded-[24px] border border-[#e7ded2] bg-white p-5 shadow-[0_12px_28px_rgba(31,24,18,0.05)]">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{featuredTask.status.replace("_", " ")}</Badge>
                <span className="text-xs text-[#867d72]">Updated {formatTaskTimestamp(featuredTask.updatedAt)}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#1f1c17]">{featuredTask.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6f675d]">{featuredTask.contextSummary || featuredTask.prompt}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SignalTile label="Selected files" value={String(featuredTask.selectedFiles.length)} helper="Issue-specific context bundle" />
                <SignalTile label="Confidence" value={getConfidenceLabel(featuredTask.score)} helper={featuredTask.score !== null ? `${featuredTask.score}/100 score` : "Awaiting score"} />
              </div>
              <div className="mt-5">
                <Link href={`/tasks/${featuredTask.id}`}>
                  <Button variant="outline" className="gap-2">
                    Inspect task detail
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#e5ddd2] bg-white/70 px-5 py-14 text-center text-sm text-[#7e7569]">
              No tasks yet. Create one from the navigation bar to start the pipeline.
            </div>
          )}
        </SurfaceCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <SurfaceCard eyebrow="The real bottleneck" title="The problem isn’t generation. It’s context." description="Coding agents often start every issue without enough repo awareness, which leads to weaker patches and slower review.">
          <p className="text-sm leading-6 text-[#6f675d]">
            CodexFlow makes issue onboarding context-aware from the start by surfacing which files matter, why they matter, and what the agent saw before it wrote code.
          </p>
        </SurfaceCard>
        <SurfaceCard eyebrow="Why it’s different" title="A context and review layer for coding agents" description="CodexFlow focuses on the missing parts of agent execution: onboarding context and visible evidence.">
          <p className="text-sm leading-6 text-[#6f675d]">
            Every run exposes the selected files, prompt context, patch preview, and raw diff so reviewers can audit the execution instead of trusting a black-box response.
          </p>
        </SurfaceCard>
        <SurfaceCard eyebrow="Track every change" title="A review-first UI for agent-generated work" description="Teams can follow queued, running, review, passed, and failed states without losing visibility once the agent starts working.">
          <p className="text-sm leading-6 text-[#6f675d]">
            Verification output, execution logs, and timeline events stay attached to the task so the resulting change is visible, reviewable, and easy to track through the UI.
          </p>
        </SurfaceCard>
      </section>
    </main>
  );
}

function StepCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-[22px] border border-[#e8dfd3] bg-white px-4 py-4 shadow-[0_8px_22px_rgba(31,24,18,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf8f6]">{icon}</div>
      <h3 className="mt-4 text-base font-semibold text-[#1f1c17]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6f675d]">{description}</p>
    </div>
  );
}

function SignalTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[20px] border border-[#ece4d8] bg-[#faf6f0] px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b8378]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#1f1c17]">{value}</p>
      <p className="mt-1 text-xs text-[#857d72]">{helper}</p>
    </div>
  );
}
