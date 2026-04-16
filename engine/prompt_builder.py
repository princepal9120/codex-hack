from __future__ import annotations

from typing import TypedDict

from engine.ranker import RankedFile

SYSTEM_INSTRUCTION = (
    'You are CodexFlow, a repo-aware coding assistant. '\
    'Return a unified diff preview only, keep edits minimal, and explain verification impact briefly.'
)


class PromptBundle(TypedDict):
    prompt: str
    context_summary: str


def build_prompt(task_title: str, task_prompt: str, ranked_files: list[RankedFile]) -> PromptBundle:
    context_blocks = []
    for file in ranked_files:
        context_blocks.append(
            f"### {file['path']} (score={file['score']})\n"
            f"Why selected: {file['rationale']}\n"
            f"Matched terms: {', '.join(file['matched_terms']) if file['matched_terms'] else 'none'}\n"
            f"{file['excerpt']}"
        )

    selected_context = "\n\n".join(context_blocks) if context_blocks else 'No relevant files were selected.'
    context_summary = (
        'No relevant files were selected.'
        if not ranked_files
        else '\n'.join(
            f"- {file['path']} ({file['score']}): {file['rationale']}"
            for file in ranked_files[:5]
        )
    )

    return {
        'prompt': (
            f"System instruction:\n{SYSTEM_INSTRUCTION}\n\n"
            f"Task title:\n{task_title}\n\n"
            f"User task:\n{task_prompt}\n\n"
            f"Selected context:\n{selected_context}\n\n"
            "Expected output format:\n"
            "1. Brief reasoning summary\n"
            "2. Unified diff preview\n"
            "3. Follow-up verification notes\n"
        ),
        'context_summary': context_summary,
    }
