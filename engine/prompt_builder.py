from __future__ import annotations

from engine.ranker import RankedFile

SYSTEM_INSTRUCTION = (
    'You are CodexFlow, a repo-aware coding assistant. '\
    'Return a unified diff preview only, keep edits minimal, and explain verification impact briefly.'
)


def build_prompt(task_title: str, task_prompt: str, ranked_files: list[RankedFile]) -> str:
    context_blocks = []
    for file in ranked_files:
        context_blocks.append(
            f"### {file['path']} (score={file['score']})\n{file['excerpt']}"
        )

    selected_context = "\n\n".join(context_blocks) if context_blocks else 'No relevant files were selected.'

    return (
        f"System instruction:\n{SYSTEM_INSTRUCTION}\n\n"
        f"Task title:\n{task_title}\n\n"
        f"User task:\n{task_prompt}\n\n"
        f"Selected context:\n{selected_context}\n\n"
        "Expected output format:\n"
        "1. Brief reasoning summary\n"
        "2. Unified diff preview\n"
        "3. Follow-up verification notes\n"
    )
