from __future__ import annotations

import json
import sys

from engine.codex_client import generate_patch
from engine.prompt_builder import build_prompt
from engine.ranker import rank_files
from engine.repo_scanner import scan_repository
from engine.score_engine import compute_score
from engine.verifier import verify


def derive_status(diff_output: str, lint_status: str, test_status: str) -> str:
    if lint_status == 'failed' or test_status == 'failed':
        return 'failed'
    if diff_output.strip() and lint_status == 'passed' and test_status == 'passed':
        return 'passed'
    if diff_output.strip():
        return 'needs_review'
    return 'failed'


def main() -> int:
    payload = json.loads(sys.stdin.read())
    task = payload['task']
    repo_path = payload['repoPath']
    lint_command = payload['lintCommand']
    test_command = payload['testCommand']
    max_files = payload['maxFiles']

    scanned_files = scan_repository(repo_path)
    ranked_files = rank_files(task['prompt'], scanned_files, max_files)
    prompt_bundle = build_prompt(task['title'], task['prompt'], ranked_files)
    codex_result = generate_patch(task['title'], prompt_bundle['prompt'], ranked_files)
    verification = verify(repo_path, lint_command, test_command)
    score = compute_score(codex_result['diff_output'], verification['lint_status'], verification['test_status'], ranked_files)
    status = derive_status(codex_result['diff_output'], verification['lint_status'], verification['test_status'])
    verification_notes = (
        f"Lint: {verification['lint_status']}. Tests: {verification['test_status']}. "
        "Patch preview is informational only and must be reviewed before any real code changes are applied."
    )

    logs = [
        f"Scanned {len(scanned_files)} files.",
        f"Selected {len(ranked_files)} files for prompt context.",
        f"Execution mode: {codex_result['mode']}",
        "--- CONTEXT SUMMARY ---",
        prompt_bundle['context_summary'],
        "--- LINT OUTPUT ---",
        verification['lint_output'] or 'No lint output.',
        "--- TEST OUTPUT ---",
        verification['test_output'] or 'No test output.',
    ]

    result = {
        'status': status,
        'score': score,
        'selectedFiles': [
            {
                'path': file['path'],
                'score': file['score'],
                'excerpt': file['excerpt'],
                'rationale': file['rationale'],
                'matchedTerms': file['matched_terms'],
            }
            for file in ranked_files
        ],
        'promptPreview': prompt_bundle['prompt'],
        'contextSummary': prompt_bundle['context_summary'],
        'executionMode': codex_result['mode'],
        'codexOutput': codex_result['codex_output'],
        'diffOutput': codex_result['diff_output'],
        'patchSummary': codex_result['patch_summary'],
        'lintStatus': verification['lint_status'],
        'testStatus': verification['test_status'],
        'lintOutput': verification['lint_output'],
        'testOutput': verification['test_output'],
        'verificationNotes': verification_notes,
        'logs': '\n'.join(logs),
        'errorMessage': None if status != 'failed' else 'Verification failed or no usable diff was generated.',
    }

    sys.stdout.write(json.dumps(result))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
