from __future__ import annotations

import json
import os
import textwrap
import urllib.error
import urllib.request

from engine.ranker import RankedFile


def build_mock_diff(task_title: str, ranked_files: list[RankedFile]) -> str:
    target = ranked_files[0]['path'] if ranked_files else 'README.md'
    safe_title = task_title.replace("'", "")
    return textwrap.dedent(
        f"""\
        diff --git a/{target} b/{target}
        @@
        +# CodexFlow preview
        +# Proposed task: {safe_title}
        +# Review before applying.
        """
    ).strip()


def call_openai(prompt: str) -> str:
    api_key = os.getenv('OPENAI_API_KEY')
    model = os.getenv('CODEXFLOW_OPENAI_MODEL', 'gpt-5.4-mini')
    if not api_key:
        raise RuntimeError('OPENAI_API_KEY is not set')

    payload = {
        'model': model,
        'input': prompt,
    }
    request = urllib.request.Request(
        'https://api.openai.com/v1/responses',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    with urllib.request.urlopen(request, timeout=60) as response:
        body = json.loads(response.read().decode('utf-8'))

    return body.get('output_text', '').strip()


def generate_patch(task_title: str, prompt: str, ranked_files: list[RankedFile]) -> dict[str, str]:
    execution_mode = os.getenv('CODEXFLOW_EXECUTION_MODE', 'mock').lower()
    patch_summary = (
        f"Patch preview targets {ranked_files[0]['path']} first."
        if ranked_files
        else 'Patch preview fell back to README.md because no relevant files were ranked.'
    )

    if execution_mode != 'openai':
        diff = build_mock_diff(task_title, ranked_files)
        return {
            'mode': 'mock',
            'codex_output': 'Mock Codex execution used. Set CODEXFLOW_EXECUTION_MODE=openai and OPENAI_API_KEY to enable live model calls.',
            'diff_output': diff,
            'patch_summary': patch_summary,
        }

    try:
        output = call_openai(prompt)
        return {
            'mode': 'openai',
            'codex_output': output or 'OpenAI response returned no text.',
            'diff_output': output or build_mock_diff(task_title, ranked_files),
            'patch_summary': patch_summary,
        }
    except (RuntimeError, urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as error:
        diff = build_mock_diff(task_title, ranked_files)
        return {
            'mode': 'mock-fallback',
            'codex_output': f'Fell back to mock execution after OpenAI call failed: {error}',
            'diff_output': diff,
            'patch_summary': patch_summary,
        }
