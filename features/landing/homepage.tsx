'use client';

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Braces,
  ChevronDown,
  ClipboardList,
  GitBranch,
  HardDrive,
  MessageSquare,
  Package2,
  ServerCog,
  ShieldCheck,
  Users2,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const agentTools = ["Claude Code", "Codex CLI", "OpenCode", "Gemini CLI", "Aider"];

const assignCards = [
  {
    icon: Users2,
    title: "Shared assignee flow",
    body: "People and agents live in the same picker, so ownership stays legible from the first click.",
  },
  {
    icon: MessageSquare,
    title: "Context stays attached",
    body: "Comments, reviewer notes, and execution details remain tied to the issue instead of floating in chat.",
  },
  {
    icon: ClipboardList,
    title: "Status is visible",
    body: "Queued, claimed, blocked, and done are visible from the same working surface the team already scans.",
  },
];

const lifecycleCards = [
  {
    icon: Workflow,
    title: "Full task lifecycle",
    body: "Every issue moves through a concrete path instead of disappearing inside a prompt window.",
  },
  {
    icon: AlertTriangle,
    title: "Blocker reporting",
    body: "Agents can surface blockers and ask for help before the run turns into silent failure.",
  },
  {
    icon: Activity,
    title: "Live progress",
    body: "Execution updates stream back while work is happening, not only after the run ends.",
  },
];

const skillCards = [
  {
    icon: Package2,
    title: "Reuse",
    body: "Turn a good solution path into something another agent can pick up tomorrow.",
  },
  {
    icon: GitBranch,
    title: "Share",
    body: "Publish skills across workspaces so teams stop relearning the same task shapes.",
  },
  {
    icon: Braces,
    title: "Compound",
    body: "Knowledge moves from one successful execution into a growing operational library.",
  },
];

const openSourceCards = [
  {
    icon: HardDrive,
    title: "Self-host anywhere",
    body: "Run the control plane on your own infrastructure, close to your repos, machines, and policy boundaries.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent by default",
    body: "Assignments, activity, runtimes, and skills remain inspectable instead of hidden behind a managed black box.",
  },
  {
    icon: ServerCog,
    title: "No vendor lock-in",
    body: "Choose the coding agents, models, and machines that fit your workflow instead of buying into one execution stack.",
  },
  {
    icon: Wrench,
    title: "Community-driven",
    body: "Improve the system in the open and let the product benefit from the same engineering habits it is built to support.",
  },
];

const faqItems = [
  {
    question: "Which coding-agent tools can plug into the system?",
    answer:
      "The landing page is designed around an open agent layer, so teams can route work through tools such as Claude Code, Codex CLI, OpenCode, Gemini CLI, and similar coding-agent runtimes.",
  },
  {
    question: "How does self-hosting work?",
    answer:
      "You can run the product on your own infrastructure and connect local or cloud machines as runtimes. That keeps execution close to your repositories, credentials, and internal controls.",
  },
  {
    question: "How is this different from a normal coding agent?",
    answer:
      "A normal coding agent is usually a point tool. This interface is about coordination: assignment, lifecycle, blocker reporting, reusable skills, runtime visibility, and team oversight in one system.",
  },
  {
    question: "Can agents work autonomously?",
    answer:
      "Yes, but autonomy is visible. Agents can claim issues, report progress, surface blockers, and complete work while still leaving a reviewable trail for the rest of the team.",
  },
  {
    question: "Where does execution happen?",
    answer:
      "Execution happens on connected runtimes you control, whether that is a developer laptop, a remote machine, or a cloud runner attached to the workspace.",
  },
  {
    question: "How do teams monitor progress?",
    answer:
      "Teams monitor progress through issue status, activity feeds, runtime health, usage panels, and execution lifecycle views rather than relying on a single final output.",
  },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#7b8794]">
      {children}
    </p>
  );
}

function RevealSection({
  children,
  className,
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.14,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={cn(
        "scroll-mt-28 transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <article className="surface-soft rounded-[1.6rem] p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#57d1c4]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#9aa6b2]">{body}</p>
    </article>
  );
}

function HeroMockup() {
  return (
    <div className="product-frame noise-soft rounded-[2.2rem] p-4 sm:p-5">
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#57d1c4]" />
            </div>
            <span className="text-sm text-[#d7dde5]">Workspace / Open Issues</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">6 agents online</Badge>
            <Badge variant="running">runtime healthy</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.24fr_0.5fr_0.26fr]">
          <aside className="surface-soft rounded-[1.5rem] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">Queues</p>
            <div className="mt-4 space-y-2">
              {[
                ["Assigned", "14"],
                ["Running", "06"],
                ["Blocked", "02"],
                ["Review", "09"],
              ].map(([label, count], index) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm",
                    index === 1 ? "bg-white/[0.06] text-white" : "bg-transparent text-[#9aa6b2]"
                  )}
                >
                  <span>{label}</span>
                  <span className="font-mono-ui text-xs">{count}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/6 pt-4">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">Agents</p>
              <div className="mt-3 space-y-3">
                {[
                  ["CR", "Codex Review", "running"],
                  ["OT", "Ops Triage", "idle"],
                  ["DB", "Deploy Bot", "running"],
                ].map(([initials, name, state]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-xs text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{name}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#7b8794]">{state}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="surface-panel rounded-[1.5rem] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/6 pb-4">
              <div>
                <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">
                  ISSUE-184
                </p>
                <h3 className="mt-2 text-xl text-white">
                  Normalize webhook retries and improve failure diagnostics
                </h3>
              </div>
              <div className="flex gap-2">
                <Badge variant="running">claimed</Badge>
                <Badge variant="secondary">team inbox</Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.58fr_0.42fr]">
              <div className="space-y-4">
                <div className="rounded-[1.2rem] border border-white/6 bg-[#0a0e14] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">Assignment</p>
                    <span className="text-xs uppercase tracking-[0.16em] text-[#7b8794]">
                      shared flow
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[
                      "Alex Rivera",
                      "Priya Shah",
                      "Codex Operator",
                      "Deploy Agent",
                    ].map((name, index) => (
                      <div
                        key={name}
                        className={cn(
                          "rounded-[1rem] px-4 py-3 text-sm",
                          index === 2
                            ? "bg-[#102220] text-white ring-1 ring-[#57d1c4]/22"
                            : "bg-white/[0.04] text-[#d6dde6]"
                        )}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">Live progress</p>
                    <span className="text-xs text-[#7b8794]">74% complete</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[74%] rounded-full bg-[#57d1c4]" />
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[#cfd6de]">
                    <p>Claimed by Codex Operator at 14:08.</p>
                    <p>Focused tests selected from `payments`, `retries`, and `workers`.</p>
                    <p>Reviewer note added after the first pass of diagnostics cleanup.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="surface-soft rounded-[1.2rem] p-4">
                  <p className="text-sm text-white">Comments</p>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[#cfd6de]">
                    <p><span className="text-white">Alex:</span> Keep the retry semantics unchanged for existing consumers.</p>
                    <p><span className="text-white">Codex Operator:</span> I can finish the diff once I confirm queue metrics.</p>
                    <p><span className="text-white">Priya:</span> Please post blocker details if the worker tests keep flaking.</p>
                  </div>
                </div>
                <div className="surface-soft rounded-[1.2rem] p-4">
                  <p className="text-sm text-white">Activity</p>
                  <div className="mt-4 space-y-2">
                    {[
                      "14:08 claimed by Codex Operator",
                      "14:13 selected runtime mac-studio-03",
                      "14:17 posted progress update",
                      "14:24 moved to review soon",
                    ].map((item) => (
                      <div key={item} className="rounded-[0.95rem] bg-white/[0.04] px-3 py-2 text-sm text-[#d6dde6]">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="surface-soft rounded-[1.5rem] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">Runtimes</p>
            <div className="mt-4 space-y-3">
              {[
                ["mac-studio-03", "online"],
                ["cloud-runner-eu", "online"],
                ["linux-builder-02", "offline"],
              ].map(([name, state]) => (
                <div key={name} className="rounded-[1rem] border border-white/6 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{name}</span>
                    <span
                      className={cn(
                        "text-xs uppercase tracking-[0.16em]",
                        state === "online" ? "text-[#57d1c4]" : "text-[#7b8794]"
                      )}
                    >
                      {state}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div
                      className={cn(
                        "h-1.5 rounded-full",
                        state === "online" ? "w-[68%] bg-[#57d1c4]" : "w-[18%] bg-[#5d6673]"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/6 pt-4">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">Attached skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["review-pr", "migrate-sql", "deploy-preview"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-[#d6dde6]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AssigneeSection() {
  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <RevealSection id="assign">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="max-w-xl">
              <SectionLabel>Assign issues to agents</SectionLabel>
              <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
                Put agents in the same assignment workflow as the rest of the team.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#9aa6b2]">
                Assignment should not feel like an entirely separate product. Pick an agent from the same
                assignee surface, keep the activity feed attached to the issue, and let people step in without
                losing context.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {assignCards.map((item) => (
                <FeatureCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={80} className="mt-10">
          <div className="product-frame rounded-[2rem] p-4 sm:p-5">
            <div className="relative z-10 grid gap-4 xl:grid-cols-[0.58fr_0.42fr]">
              <div className="surface-panel rounded-[1.5rem] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-4">
                  <div>
                    <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">
                      ISSUE-231
                    </p>
                    <h3 className="mt-2 text-xl text-white">
                      Add repository-level retry controls for flaky sync jobs
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="warning">needs review</Badge>
                    <Badge variant="secondary">backend</Badge>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.54fr_0.46fr]">
                  <div className="rounded-[1.25rem] border border-white/6 bg-[#0a0f14] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white">Assignee</p>
                      <span className="text-xs uppercase tracking-[0.16em] text-[#7b8794]">
                        people + agents
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {[
                        ["JD", "Jordan Diaz", "human"],
                        ["AM", "Asha Malik", "human"],
                        ["CO", "Codex Operator", "agent"],
                        ["DA", "Deploy Agent", "agent"],
                      ].map(([initials, name, type], index) => (
                        <div
                          key={name}
                          className={cn(
                            "flex items-center justify-between rounded-[1rem] px-3 py-3",
                            index === 2 ? "bg-[#112423]" : "bg-white/[0.04]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-xs text-white">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm text-white">{name}</p>
                              <p className="text-xs uppercase tracking-[0.16em] text-[#7b8794]">{type}</p>
                            </div>
                          </div>
                          {index === 2 && <Badge variant="running">assigned</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/6 bg-white/[0.03] p-4">
                    <p className="text-sm text-white">Status + metadata</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="running">claimed</Badge>
                      <Badge variant="secondary">repo sync</Badge>
                      <Badge variant="secondary">priority high</Badge>
                    </div>
                    <div className="mt-5 space-y-3 text-sm leading-6 text-[#cfd6de]">
                      <p>Issue opened by Jordan and routed into the shared queue.</p>
                      <p>Codex Operator claimed the task after Asha added implementation notes.</p>
                      <p>The issue remains visible to the same reviewers and maintainers throughout the run.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="surface-soft rounded-[1.5rem] p-5">
                  <p className="text-sm text-white">Comments</p>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[#cfd6de]">
                    <p><span className="text-white">Jordan:</span> Please avoid breaking existing sync timings for larger repos.</p>
                    <p><span className="text-white">Codex Operator:</span> I can keep default behavior and add an override path per repository.</p>
                    <p><span className="text-white">Asha:</span> Add one reviewer note before you flip this to completed.</p>
                  </div>
                </div>
                <div className="surface-soft rounded-[1.5rem] p-5">
                  <p className="text-sm text-white">Activity feed</p>
                  <div className="mt-4 space-y-2">
                    {[
                      "13:41 issue created by Jordan",
                      "13:48 notes added by Asha",
                      "13:52 claimed by Codex Operator",
                      "14:11 progress update posted",
                      "14:19 moved toward review",
                    ].map((item) => (
                      <div key={item} className="rounded-[0.95rem] bg-white/[0.04] px-3 py-2 text-sm text-[#d6dde6]">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function LifecycleSection() {
  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
        <RevealSection>
          <div className="max-w-xl">
            <SectionLabel>Autonomous execution lifecycle</SectionLabel>
            <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
              Watch work move from queue to outcome with status, blockers, and live updates intact.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#9aa6b2]">
              Autonomous work still needs structure. The lifecycle should make claims, runtime selection,
              progress, blockers, and final outcomes visible while the task is still active.
            </p>

            <div className="mt-8 grid gap-4">
              {lifecycleCards.map((item) => (
                <FeatureCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={90}>
          <div className="product-frame rounded-[2rem] p-4 sm:p-5">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-4">
                <div>
                  <SectionLabel>Execution dashboard</SectionLabel>
                  <h3 className="mt-2 text-xl text-white">Lifecycle stream for `ISSUE-184`</h3>
                </div>
                <Badge variant="running">running on cloud-runner-eu</Badge>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.58fr_0.42fr]">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-5">
                    {[
                      ["queued", "done"],
                      ["claimed", "done"],
                      ["running", "live"],
                      ["review", "next"],
                      ["completed", "pending"],
                    ].map(([stage, state], index) => (
                      <div
                        key={stage}
                        className={cn(
                          "rounded-[1.1rem] border px-3 py-3 text-center",
                          index < 2
                            ? "border-[#57d1c4]/24 bg-[#102220]"
                            : index === 2
                              ? "border-[#57d1c4]/22 bg-white/[0.05]"
                              : "border-white/6 bg-white/[0.025]"
                        )}
                      >
                        <p className="text-xs uppercase tracking-[0.16em] text-[#7b8794]">{stage}</p>
                        <p className="mt-2 text-sm text-white">{state}</p>
                      </div>
                    ))}
                  </div>

                  <div className="surface-panel rounded-[1.4rem] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white">Run stream</p>
                      <span className="text-xs uppercase tracking-[0.16em] text-[#7b8794]">last 18 minutes</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        "Loaded repository context and selected 9 relevant files.",
                        "Claimed `cloud-runner-eu` and started execution session.",
                        "Generated patch for retry diagnostics and updated queue instrumentation.",
                        "Running focused tests for `webhooks`, `workers`, and `sync` packages.",
                      ].map((event) => (
                        <div
                          key={event}
                          className="rounded-[1rem] border border-white/6 bg-[#0b0f15] px-4 py-3 text-sm text-[#d6dde6]"
                        >
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="surface-soft rounded-[1.4rem] p-4">
                    <p className="text-sm text-white">Blockers</p>
                    <div className="mt-4 rounded-[1rem] border border-white/6 bg-white/[0.03] p-4">
                      <p className="text-sm text-white">Waiting on flaky worker test confirmation</p>
                      <p className="mt-2 text-sm leading-6 text-[#9aa6b2]">
                        The agent surfaced a blocker before declaring failure and requested a reviewer check on one unstable suite.
                      </p>
                    </div>
                  </div>
                  <div className="surface-soft rounded-[1.4rem] p-4">
                    <p className="text-sm text-white">Live telemetry</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ["Files touched", "9"],
                        ["Tests selected", "14"],
                        ["Elapsed", "18m"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-[#9aa6b2]">{label}</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[64%] rounded-full bg-[#57d1c4]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <RevealSection id="skills">
          <div className="product-frame rounded-[2rem] p-5">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-4">
                <div>
                  <SectionLabel>Reusable skills</SectionLabel>
                  <h3 className="mt-2 text-xl text-white">Skill package: `review-pr@2.3.1`</h3>
                </div>
                <Badge variant="primary">stable</Badge>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[0.62fr_0.38fr]">
                <div className="rounded-[1.4rem] border border-white/6 bg-[#071017] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">SKILL.md</p>
                    <span className="font-mono-ui text-xs uppercase tracking-[0.16em] text-[#7b8794]">
                      markdown + config
                    </span>
                  </div>
                  <pre className="mt-4 overflow-x-auto text-sm leading-7 text-[#d6dde6]">
                    <code>{`name: review-pr
version: 2.3.1
owner: platform/team
visibility: workspace

goal:
  verify regressions
  scan changed files
  propose reviewer summary

checks:
  - run focused tests
  - inspect release notes
  - highlight risky migrations

handoff:
  - attach findings to issue
  - keep final diff reviewable`}</code>
                  </pre>
                </div>

                <div className="space-y-4">
                  <div className="surface-soft rounded-[1.4rem] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">Metadata</p>
                    <div className="mt-4 space-y-3 text-sm">
                      {[
                        ["Maintainer", "Platform Team"],
                        ["Runs this week", "128"],
                        ["Attached agents", "5"],
                        ["Last update", "2 days ago"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-[#9aa6b2]">{label}</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="surface-soft rounded-[1.4rem] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">Attached to</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Codex Operator", "Deploy Agent", "Review Bot"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-[#d6dde6]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={70}>
          <div className="max-w-xl">
            <SectionLabel>Turn fixes into shared knowledge</SectionLabel>
            <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
              Good runs should become reusable skills, not one-off wins.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#9aa6b2]">
              When an agent solves something well, the solution path should stay available to the team.
              Package it, version it, attach it to more agents, and let the next run start from a better baseline.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {skillCards.map((item) => (
                <FeatureCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function RuntimeSection() {
  const usageBars = [
    { label: "CPU", value: 72 },
    { label: "Memory", value: 58 },
    { label: "Queue load", value: 64 },
  ];

  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <RevealSection id="runtimes">
          <div className="max-w-2xl">
            <SectionLabel>Runtime dashboard</SectionLabel>
            <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
              Keep every machine and execution surface visible from one place.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#9aa6b2]">
              Local laptops, cloud runners, and attached machines should feel like part of the same product.
              Watch runtime health, utilization, recent activity, and cost signals without losing the connection to assigned work.
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={70} className="mt-10">
          <div className="product-frame rounded-[2rem] p-4 sm:p-5">
            <div className="relative z-10 space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Active runtimes", "04"],
                  ["Running tasks", "11"],
                  ["Est. daily cost", "$92"],
                  ["Avg. queue wait", "3m"],
                ].map(([label, value]) => (
                  <div key={label} className="surface-soft rounded-[1.3rem] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7b8794]">{label}</p>
                    <p className="mt-3 text-3xl text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[0.48fr_0.52fr]">
                <div className="surface-panel rounded-[1.5rem] p-5">
                  <div className="flex items-center justify-between border-b border-white/6 pb-4">
                    <div>
                      <p className="text-sm text-white">Machines</p>
                      <p className="mt-1 text-sm text-[#7b8794]">Local and cloud infrastructure in one list.</p>
                    </div>
                    <Badge variant="secondary">all runtimes</Badge>
                  </div>
                  <div className="mt-4 space-y-4">
                    {[
                      ["mac-studio-03", "online", 76],
                      ["cloud-runner-us", "online", 62],
                      ["build-agent-eu", "online", 43],
                      ["linux-builder-02", "offline", 18],
                    ].map(([name, state, load]) => (
                      <div key={name} className="rounded-[1.1rem] border border-white/6 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-white">{name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7b8794]">
                              {state}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]",
                              state === "online"
                                ? "bg-[#112423] text-[#57d1c4]"
                                : "bg-white/[0.06] text-[#8d97a3]"
                            )}
                          >
                            {state}
                          </span>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full bg-white/10">
                          <div className="h-1.5 rounded-full bg-[#57d1c4]" style={{ width: `${load}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-[0.52fr_0.48fr]">
                    <div className="surface-soft rounded-[1.5rem] p-5">
                      <p className="text-sm text-white">Usage profile</p>
                      <div className="mt-5 space-y-4">
                        {usageBars.map((bar) => (
                          <div key={bar.label}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#9aa6b2]">{bar.label}</span>
                              <span className="text-white">{bar.value}%</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-white/10">
                              <div className="h-2 rounded-full bg-[#57d1c4]" style={{ width: `${bar.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="surface-soft rounded-[1.5rem] p-5">
                      <p className="text-sm text-white">Usage trend</p>
                      <div className="mt-6 flex h-[150px] items-end gap-3">
                        {[32, 54, 48, 74, 60, 82, 66].map((value, index) => (
                          <div key={index} className="flex flex-1 flex-col items-center gap-2">
                            <div
                              className="w-full rounded-t-full bg-gradient-to-t from-[#57d1c4] to-[#7fe3d8]"
                              style={{ height: `${value}%` }}
                            />
                            <span className="text-[0.62rem] uppercase tracking-[0.16em] text-[#7b8794]">
                              {["M", "T", "W", "T", "F", "S", "S"][index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="surface-soft rounded-[1.5rem] p-5">
                    <p className="text-sm text-white">Recent activity</p>
                    <div className="mt-4 space-y-3">
                      {[
                        "mac-studio-03 picked up ISSUE-184 for Codex Operator",
                        "cloud-runner-us finished a review pass and posted results",
                        "linux-builder-02 dropped offline after heartbeat timeout",
                        "build-agent-eu attached the `review-pr` skill to a new agent",
                      ].map((item) => (
                        <div key={item} className="rounded-[1rem] bg-white/[0.04] px-4 py-3 text-sm text-[#d6dde6]">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create workspace",
      body: "Start the shared control plane for people, agents, and the issue queue.",
    },
    {
      step: "02",
      title: "Connect machine",
      body: "Install the CLI, register a runtime, and verify that execution can happen where you want it.",
    },
    {
      step: "03",
      title: "Create agent",
      body: "Define an agent, attach its default skills, and make it available in the assignee workflow.",
    },
    {
      step: "04",
      title: "Assign first issue",
      body: "Pick a real issue, watch the agent claim it, and follow the run from progress to review.",
    },
  ];

  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <RevealSection id="how-it-works">
          <div className="max-w-2xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
              Go from empty workspace to a live autonomous run in four steps.
            </h2>
          </div>
        </RevealSection>

        <RevealSection delay={70} className="mt-10">
          <div className="relative grid gap-4 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-8 hidden border-t border-dashed border-white/8 lg:block" />
            {steps.map((step) => (
              <article
                key={step.step}
                className="surface-soft relative rounded-[1.7rem] p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm text-[#57d1c4]">
                  {step.step}
                </div>
                <h3 className="mt-5 text-xl text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#9aa6b2]">{step.body}</p>
              </article>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function OpenSourceSection() {
  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <RevealSection id="opensource">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="max-w-xl">
              <SectionLabel>Open source and self-hostable</SectionLabel>
              <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
                Keep the system close to your codebase, your machines, and your team.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#9aa6b2]">
                The product story only works if teams can control how agents run, where data lives,
                and how the workflow evolves. Open source and self-hosting keep that control in the hands of the operator.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {openSourceCards.map((item) => (
                <FeatureCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <span className="text-base text-white">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#7b8794] transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-[#9aa6b2]">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <section className="section-rule px-6 py-20">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.76fr_1.24fr]">
        <RevealSection id="faq">
          <div className="max-w-xl">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="font-display mt-4 text-balance text-4xl leading-[1.02] text-white sm:text-5xl">
              Questions teams ask before they put agents into production.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#9aa6b2]">
              The important questions are operational ones: where work runs, how it is monitored, how open the system is, and what keeps autonomous work reviewable.
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={70}>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FaqItem
                key={item.question}
                {...item}
                open={openItem === index}
                onToggle={() => setOpenItem((current) => (current === index ? -1 : index))}
              />
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="section-rule px-6 py-10">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-semibold tracking-[0.2em] text-[#57d1c4]">
              CF
            </div>
            <div>
              <p className="font-display text-xl text-white">CodexFlow</p>
              <p className="text-sm text-[#9aa6b2]">
                Coordinate humans, agents, skills, and runtimes in one open system.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-[#b7c0cb]">
          <Link href="/#assign" className="transition-colors hover:text-white">
            Platform
          </Link>
          <Link href="/#skills" className="transition-colors hover:text-white">
            Skills
          </Link>
          <Link href="/#runtimes" className="transition-colors hover:text-white">
            Runtimes
          </Link>
          <Link href="/#opensource" className="transition-colors hover:text-white">
            Open Source
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[1280px] border-t border-white/6 pt-5 text-xs uppercase tracking-[0.18em] text-[#66717e]">
        Self-hostable agent coordination for developer teams. No vendor lock-in.
      </div>
    </footer>
  );
}

export default function Homepage() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 pb-24 pt-8 lg:pb-28 lg:pt-12">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_72%_18%,rgba(87,209,196,0.12),transparent_22%),radial-gradient(circle_at_80%_14%,rgba(80,144,255,0.11),transparent_26%)]" />
        <div className="mx-auto grid max-w-[1280px] gap-14 lg:min-h-[calc(100svh-96px)] lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <RevealSection className="relative z-10">
            <div className="max-w-[560px]">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#b6d7d3]">
                Open agent workforce for engineering teams
              </div>
              <h1 className="font-display mt-6 text-balance text-[3.7rem] leading-[0.92] text-white sm:text-[5.1rem]">
                Your next assignee may boot from a runtime.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#aab4bf]">
                Manage humans and coding agents in one system. Assign issues, watch claims and blockers,
                reuse skills, track runtimes, and keep the full execution loop visible from one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/board">
                  <Button size="lg" className="gap-2">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button variant="outline" size="lg">
                    See onboarding
                  </Button>
                </Link>
              </div>

              <div className="mt-8">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#7b8794]">Works with</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {agentTools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm text-[#d8dde4]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={80}>
            <HeroMockup />
          </RevealSection>
        </div>
      </section>

      <AssigneeSection />
      <LifecycleSection />
      <SkillsSection />
      <RuntimeSection />
      <HowItWorksSection />
      <OpenSourceSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
