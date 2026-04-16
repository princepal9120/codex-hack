import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const steps = [
  {
    step: "01",
    title: "Create the workspace",
    detail: "Start with the team shell, invite reviewers, and define how tasks should move once an agent picks them up.",
  },
  {
    step: "02",
    title: "Connect a runtime",
    detail: "Install the CLI, verify the daemon heartbeat, and let the workspace detect local tooling automatically.",
  },
  {
    step: "03",
    title: "Shape the first agent",
    detail: "Give it a role, attach skills, and tune its default behavior before it enters the assignment picker.",
  },
  {
    step: "04",
    title: "Assign the first issue",
    detail: "Route one real task through the board and confirm that verification status, logs, and review gates all flow together.",
  },
];

export default function OnboardingFlow() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="lg:sticky lg:top-10 lg:h-fit">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#7b8794]">Onboarding</p>
            <span className="rounded-full border border-[#f3c87a]/30 bg-[#f3c87a]/10 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#f3c87a]">
              Concept demo
            </span>
          </div>
          <h1 className="font-display mt-4 text-balance text-5xl leading-[0.95] text-white sm:text-6xl">
            Bring the first runtime online without losing the plot.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#9aa6b2]">
            This concept walkthrough borrows the sharp, guided onboarding feel from Multica and adapts it to
            CodexFlow. It previews the intended setup journey, but it does not provision a real workspace or
            runtime yet.
          </p>

          <div className="mt-6 rounded-[1.6rem] border border-[#f3c87a]/20 bg-[#f3c87a]/8 p-4 text-sm leading-6 text-[#f6d79a]">
            Demo only: the steps, install command, and workspace settings below are illustrative product direction
            for the hackathon build, not a live onboarding flow.
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/board">
              <Button className="gap-2">
                Open board
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to landing</Button>
            </Link>
          </div>

          <div className="surface-soft mt-8 rounded-[1.8rem] p-5">
            <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">
              Quick install
            </p>
            <div className="mt-4 rounded-[1.25rem] border border-white/8 bg-[#06080b] px-4 py-4">
              <code className="font-mono-ui text-sm text-[#dce3eb]">codexflow setup --runtime local</code>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#9aa6b2]">
              Illustrative only — runtime discovery, CLI verification, and board linking are not wired from this
              page yet.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {steps.map((item) => (
            <article key={item.step} className="surface-soft rounded-[1.8rem] p-6">
              <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">
                {item.step}
              </p>
              <h2 className="mt-3 text-2xl text-white">{item.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#9aa6b2]">{item.detail}</p>
            </article>
          ))}

          <section className="surface-panel rounded-[2rem] p-6">
            <div className="grid gap-6 border-b border-white/6 pb-6 md:grid-cols-2">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Workspace</p>
                <h2 className="mt-3 text-xl text-white">First-run configuration</h2>
              </div>
              <p className="text-sm leading-7 text-[#9aa6b2]">
                This mock setup surface keeps the critical decisions visible: workspace name, machine identity,
                agent role, and the checks required before a task can exit review.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <Input defaultValue="CodexFlow workspace" />
                <Input defaultValue="macbook-pro.local" />
                <Input defaultValue="Agent operator" />
              </div>
              <div className="space-y-4">
                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Checks</p>
                  <div className="mt-4 space-y-3 text-sm text-[#d8dde4]">
                    <p>Lint required before review</p>
                    <p>Focused tests required before merge</p>
                    <p>Human approval required on `needs_review`</p>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7b8794]">Detected tooling</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Codex", "Node", "Git", "npm"].map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full bg-[#16241c] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#7bf2b4]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
