from __future__ import annotations

import os
import shlex
import subprocess
from typing import TypedDict


class VerificationResult(TypedDict):
    status: str
    output: str


class VerifierSummary(TypedDict):
    lint_status: str
    lint_output: str
    test_status: str
    test_output: str


def run_command(command: str, repo_path: str) -> VerificationResult:
    if not command:
        return {'status': 'pending', 'output': 'No command configured.'}

    try:
        completed = subprocess.run(
            shlex.split(command),
            cwd=repo_path,
            env={
                **os.environ,
                'PATH': f"/Users/prince/.nvm/versions/node/v24.13.0/bin:{os.environ.get('PATH', '')}",
            },
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except FileNotFoundError as error:
        return {'status': 'failed', 'output': f'Command not found: {error}'}
    except subprocess.TimeoutExpired:
        return {'status': 'failed', 'output': f'Command timed out after 120s: {command}'}

    output = (completed.stdout + '\n' + completed.stderr).strip()
    status = 'passed' if completed.returncode == 0 else 'failed'
    return {'status': status, 'output': output or f'{command} exited with code {completed.returncode}'}


def verify(repo_path: str, lint_command: str, test_command: str) -> VerifierSummary:
    lint_result = run_command(lint_command, repo_path)
    test_result = run_command(test_command, repo_path)
    return {
        'lint_status': lint_result['status'],
        'lint_output': lint_result['output'],
        'test_status': test_result['status'],
        'test_output': test_result['output'],
    }
