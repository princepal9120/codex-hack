# CodexFlow

Make Codex work on real codebases. CodexFlow turns coding tasks into an execution pipeline with full visibility and verification.

## Overview

CodexFlow is a clean, technical interface for AI coding task execution that makes the entire process visible, understandable, and demoable. It selects the right repo context, runs Codex on coding tasks, verifies output with lint and tests, and tracks results in a beautiful task board.

## Design Philosophy

- **Show execution clearly** - Every step is visible
- **Show proof, not hype** - Results are verified with real tests
- **Keep layouts structured** - Clean and readable at all times
- **Emphasize statuses, diffs, and logs** - Focus on what matters
- **No clutter** - Minimal but powerful UI

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide Icons** - Icon library

## Features

### Landing Page
- Clear value proposition
- Visual explanation of how it works
- Sample task execution preview
- Call-to-action buttons

### Task Board
- 5-column Kanban view: Queued, Running, Passed, Failed, Needs Review
- Task cards with essential info
- Status badges with color coding
- Score display for completed tasks
- Empty state messages

### Task Detail View
- Full task information and prompt
- Selected files panel with relevance scores
- Code diff viewer
- Verification status (lint, tests)
- Execution logs
- Task metadata

### Create Task Modal
- Intuitive form with fields for:
  - Task title
  - Task prompt
  - Repository path
  - Optional lint command
  - Optional test command

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navbar
│   ├── globals.css        # Global styles
│   ├── page.tsx           # Landing page
│   ├── board/
│   │   └── page.tsx       # Task board page
│   └── tasks/[id]/
│       └── page.tsx       # Task detail page
├── components/
│   ├── ui/                # Base UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Dialog.tsx
│   │   └── Input.tsx
│   ├── Navbar.tsx         # App shell navbar
│   ├── TaskCard.tsx       # Individual task card
│   ├── TaskColumn.tsx     # Board column
│   ├── CreateTaskModal.tsx # Task creation dialog
│   ├── FileListPanel.tsx  # Selected files display
│   ├── DiffPanel.tsx      # Code diff viewer
│   ├── VerificationPanel.tsx # Lint/test status
│   ├── ScoreCard.tsx      # Score display
│   └── StatusBadge.tsx    # Status badge component
├── lib/
│   └── utils.ts           # Utility functions
├── data/
│   └── mockTasks.ts       # Mock task data
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Color Scheme

- **Primary**: Violet 600 (#7c3aed)
- **Background**: White
- **Surface**: Gray 50 (#f9fafb)
- **Border**: Gray 200 (#e5e7eb)
- **Text**: Gray 900 (#111827)
- **Muted**: Gray 600 (#4b5563)
- **Success**: Green 600 (#16a34a)
- **Warning**: Amber 500 (#f59e0b)
- **Danger**: Red 600 (#dc2626)

## Status Badge Variants

- **Queued**: Gray
- **Running**: Blue
- **Passed**: Green
- **Failed**: Red
- **Needs Review**: Amber

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. Create components in `/components`
2. Use the Button, Badge, Dialog, and Input UI components
3. Add mock data to `/data/mockTasks.ts`
4. Create pages in `/app` following Next.js conventions

## Mock Data

The application comes with pre-configured mock tasks demonstrating:
- Different task statuses (queued, running, passed, failed, needs_review)
- Various score levels
- File selections with relevance scores
- Sample code diffs
- Lint and test verification results
- Execution logs

## Future Enhancements

- Animated transitions with Framer Motion
- Live running indicators
- Collapsible logs
- Syntax-highlighted code diffs
- Keyboard shortcuts
- Real backend integration
- Dark mode support
- Full project management features

## Design Notes

The UI is intentionally minimal and focused on proof over hype. Every element serves a purpose:
- Cards are large and scannable
- Status is immediately visible
- Verification results are clear and unambiguous
- Logs and diffs are properly formatted
- No gradients or unnecessary visual flourishes

This design ensures judges and stakeholders immediately recognize this as a serious execution system, not just a prompt wrapper.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
