# Repository Guidelines

## Project Structure & Module Organization
CodexFlow combines a Next.js 14 App Router UI with a lightweight Python execution engine. App routes live in `app/` (`page.tsx`, `board/page.tsx`, `tasks/[id]/page.tsx`). Reusable React components live in `components/`, with base primitives in `components/ui/`. Shared TypeScript logic lives in `lib/`, including server-side task persistence in `lib/server/`. Python pipeline code lives in `engine/` (`repo_scanner.py`, `ranker.py`, `verifier.py`, `run_task.py`). Demo/task configuration is stored in `codexflow.config.json`, and Python tests live in `tests/`.

## Product Direction
- Build the intersection of **agent workflow** and **repo-aware context intelligence**.
- Keep the UI serious, technical, minimal, and proof-oriented.
- Preserve the hackathon-friendly scope: task board, task detail, retry/monitoring, prompt preview, diff preview, verification, and scoring.
- Do **not** turn the product into a broad collaboration suite (no chat/inbox/org-management expansion).
- Treat patch previews as review artifacts first; never present the system as auto-applying arbitrary repository changes.

## Build, Test, and Development Commands
- `npm install` — install frontend dependencies.
- `npm run dev` — start the UI locally at `http://localhost:3000`.
- `npm run lint` — run ESLint via `next/core-web-vitals`.
- `npm run build` — verify the production Next.js build.
- `npm start` — serve the production build.
- `python3 -m unittest discover -s tests` — run the Python engine test suite.

## Agent Workflow Notes
- Prefer the global Codex skill `$production-implementer` when the task asks for a one-shot, production-ready solution with concise architecture notes, key decisions, complete code, edge-case coverage, and sample tests.
- Keep responses implementation-first: minimize back-and-forth, avoid placeholders/TODOs, and deliver complete working code when the request is sufficiently specified.
- When using `$production-implementer`, preserve this repo's conventions and verification flow (`npm run lint`, `npm run build`, and `python3 -m unittest discover -s tests` when relevant).
- Surface the differentiator in product work: selected file rationale, prompt/context preview, diff preview, verification evidence, and confidence/score.
- Prefer extending existing routes/components over introducing new framework layers or infrastructure.

## Coding Style & Naming Conventions
Use TypeScript for UI code and keep strict types intact. Follow the existing style: 2-space indentation, semicolons, and `@/` imports for local TS modules. Name React components in PascalCase (`TaskColumn.tsx`), helpers in camelCase, and Next.js route files with framework conventions (`page.tsx`, `layout.tsx`). For Python, prefer small functions, explicit names, and standard-library-first solutions. Prefer Tailwind utilities over custom CSS and keep reusable UI patterns in `components/ui` or `lib/utils.ts`.

## Testing Guidelines
Before opening a PR, run `npm run lint`, `npm run build`, and `python3 -m unittest discover -s tests`. For UI changes, manually verify `/`, `/board`, and `/tasks/[id]`. Add future UI/unit tests near the feature as `*.test.ts(x)` or in a local `__tests__/` folder.

For execution-pipeline changes, also verify:
- create task → auto-run
- task detail polling while running
- retry flow
- selected-file rationale / prompt preview / verification outputs render without fallback errors

## Commit & Pull Request Guidelines
History is mostly short, imperative, and present tense; automation commits may use prefixes like `omx(team): ...`. Keep commit subjects concise and add Lore trailers when relevant, such as `Constraint:`, `Confidence:`, and `Tested:`. PRs should include a brief summary, linked issue if available, screenshots/GIFs for UI changes, and the exact verification commands you ran.

## Security & Configuration Tips
Do not commit secrets or machine-specific paths. Keep local overrides in `.env.local`, and update `codexflow.config.json` carefully because it controls repo path, lint, and test commands.
