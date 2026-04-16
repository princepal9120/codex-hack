# Using CodexFlow with Multica + Codex

This guide explains how to use **Multica** with **Codex** on **this project**. It is intentionally **docs-only**: no Multica-specific product code is added to CodexFlow.

## What you are setting up

You will:

1. install the `multica` CLI
2. make sure the `codex` CLI is available on your machine
3. connect your machine to Multica as a runtime
4. create a Codex-backed agent
5. assign CodexFlow tasks to that agent from Multica

Multica handles the issue/agent workflow. Codex runs locally on your machine against this repository.

## Prerequisites

- this repo checked out locally
- Node.js and npm available
- Codex CLI installed and working on your machine
- Multica CLI installed

Recommended quick verification:

```bash
codex --help
multica --help
```

## 1. Install Multica

Preferred install:

```bash
brew install multica-ai/tap/multica
```

Alternative install script:

```bash
curl -fsSL https://raw.githubusercontent.com/multica-ai/multica/main/scripts/install.sh | bash
```

If you are using Windows, use the PowerShell installer from the Multica docs.

## 2. Make sure Codex is available

Multica detects agent CLIs from your `PATH`. For Codex, the binary must be available as:

```bash
codex
```

Optional environment overrides supported by Multica:

```bash
export MULTICA_CODEX_PATH="$(which codex)"
export MULTICA_CODEX_MODEL="gpt-5.4"
```

Use these only if you need a custom binary path or default model.

## 3. Connect your machine to Multica

The fastest flow is:

```bash
multica setup
```

This configures authentication and starts the daemon.

You can also do it step by step:

```bash
multica login
multica daemon start
multica daemon status
```

The daemon is the local runtime that will execute Codex tasks on your machine.

## 4. Verify the runtime in Multica

Open the Multica web app and go to:

**Settings → Runtimes**

You should see your machine listed as an active runtime. Multica should detect `codex` as an available agent CLI.

If Codex is not detected:

- verify `codex` is on `PATH`
- restart the daemon
- check `multica daemon status`

## 5. Create a Codex agent for this repo

In Multica:

1. go to **Settings → Agents**
2. click **New Agent**
3. choose your connected runtime
4. choose provider = **Codex**
5. give the agent a clear name, for example:
   - `CodexFlow Engineer`
   - `CodexFlow UI Agent`
   - `CodexFlow Runtime Agent`

## 6. Point the work at this repository

Keep this repository available locally on the machine running the Multica daemon.

Recommended local preparation:

```bash
npm install
```

Useful repo-level verification commands for CodexFlow:

```bash
npm run lint
npm run build
python3 -m unittest discover -s tests
```

These are the commands you should reference in Multica issues so the Codex agent knows how to validate changes.

## 7. Why this repo already works well with Codex

This repository already includes `AGENTS.md` at the root. That helps Codex understand:

- project structure
- coding style
- test/build commands
- commit expectations

When Multica runs Codex against this repo, that guidance gives the agent better project-local context.

## 8. Create and assign issues in Multica

Create issues from the Multica board or CLI, then assign them to your Codex agent.

Good issue examples for this repo:

- “Polish the task detail verification panel for failed runs”
- “Improve board empty states and keep responsive layout intact”
- “Add docs for runtime configuration in CodexFlow”
- “Refactor task API normalization without breaking current UI behavior”

Each issue should include:

- clear goal
- affected area
- constraints
- verification commands

Example issue body for this project:

```md
Goal:
Improve the task detail page so failed runs are easier to inspect.

Constraints:
- do not break current task polling
- preserve existing styling direction
- keep diffs small and reviewable

Verification:
- npm run lint
- npm run build
- python3 -m unittest discover -s tests
```

## 9. Recommended workflow for CodexFlow in Multica

For this project, a reliable workflow is:

1. create a narrow issue in Multica
2. assign it to the Codex agent
3. let the agent run locally on your runtime
4. review the produced diff, logs, and verification output
5. create follow-up issues for additional slices

Keep issues scoped. This repo has both:

- a Next.js UI
- a Python execution engine

So issues are best when they target one lane at a time.

## 10. Suggested issue categories for this project

### Frontend issues

Use for:

- `app/`
- `components/`
- UI states
- task board / task detail polish

Suggested verification:

```bash
npm run lint
npm run build
```

### Runtime / engine issues

Use for:

- `engine/`
- `lib/server/`
- task execution behavior
- verification logic

Suggested verification:

```bash
npm run lint
npm run build
python3 -m unittest discover -s tests
```

### Docs-only issues

Use for:

- `README.md`
- `docs/`
- onboarding instructions

Suggested verification:

- manual doc review

## 11. Optional self-hosted setup

If you are using self-hosted Multica instead of Multica Cloud:

```bash
multica setup self-host
```

Or configure it manually with your server/app URLs before starting the daemon.

## 12. Useful Multica commands

```bash
multica setup
multica login
multica daemon start
multica daemon status
multica daemon logs -f
multica workspace list
multica agent list
multica issue list
```

## 13. Practical prompt style for this repo

When creating issues for Codex on CodexFlow, prefer wording like:

```md
Update the board page to improve empty-state clarity.

Requirements:
- preserve current data flow
- keep existing styling language
- avoid new dependencies
- verify with npm run lint and npm run build
```

Avoid vague issue bodies like:

- “make it better”
- “fix everything”
- “improve the app”

Codex performs better when the issue is concrete and verification is explicit.

## 14. Summary

To use Multica with Codex on this project:

1. install `multica`
2. ensure `codex` is on `PATH`
3. run `multica setup`
4. confirm your runtime appears in Multica
5. create a Codex agent
6. assign CodexFlow issues to that agent
7. review diffs and verification output using this repo's existing commands

This gives you a practical human + Codex workflow for CodexFlow without changing the app itself.
