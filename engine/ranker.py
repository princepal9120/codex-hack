from __future__ import annotations

import re
from typing import TypedDict

from engine.repo_scanner import ScannedFile

WORD_PATTERN = re.compile(r"[a-zA-Z0-9_]+")


class RankedFile(TypedDict):
    path: str
    score: int
    excerpt: str


def tokenize(text: str) -> set[str]:
    return {match.group(0).lower() for match in WORD_PATTERN.finditer(text)}


def score_file(task_tokens: set[str], scanned_file: ScannedFile) -> int:
    path_tokens = tokenize(scanned_file['path'])
    excerpt_tokens = tokenize(scanned_file['excerpt'])

    path_overlap = len(task_tokens & path_tokens)
    excerpt_overlap = len(task_tokens & excerpt_tokens)

    score = path_overlap * 25 + excerpt_overlap * 8
    if scanned_file['path'].endswith(('.ts', '.tsx', '.py', '.js', '.json')):
        score += 4
    return score


def rank_files(task_prompt: str, scanned_files: list[ScannedFile], max_files: int) -> list[RankedFile]:
    task_tokens = tokenize(task_prompt)
    ranked: list[RankedFile] = []

    for scanned_file in scanned_files:
        score = score_file(task_tokens, scanned_file)
        if score <= 0:
            continue
        ranked.append({
            'path': scanned_file['path'],
            'score': score,
            'excerpt': scanned_file['excerpt'],
        })

    ranked.sort(key=lambda item: (-item['score'], item['path']))
    return ranked[:max_files]
