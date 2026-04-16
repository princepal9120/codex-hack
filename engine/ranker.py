from __future__ import annotations

import re
from typing import TypedDict

from engine.repo_scanner import ScannedFile

WORD_PATTERN = re.compile(r"[a-zA-Z0-9_]+")
STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "be",
    "build",
    "by",
    "for",
    "from",
    "in",
    "into",
    "it",
    "of",
    "on",
    "or",
    "run",
    "the",
    "this",
    "to",
    "with",
}


class RankedFile(TypedDict):
    path: str
    score: int
    excerpt: str
    rationale: str
    matched_terms: list[str]


def tokenize(text: str) -> set[str]:
    return {
        token
        for token in (match.group(0).lower() for match in WORD_PATTERN.finditer(text))
        if token not in STOP_WORDS and len(token) > 1
    }


def score_file(task_tokens: set[str], scanned_file: ScannedFile) -> tuple[int, list[str], list[str]]:
    path_tokens = tokenize(scanned_file['path'])
    excerpt_tokens = tokenize(scanned_file['excerpt'])

    path_matches = sorted(task_tokens & path_tokens)
    excerpt_matches = sorted(task_tokens & excerpt_tokens)

    path_overlap = len(path_matches)
    excerpt_overlap = len(excerpt_matches)

    score = path_overlap * 25 + excerpt_overlap * 8
    if scanned_file['path'].endswith(('.ts', '.tsx', '.py', '.js', '.json')):
        score += 4
    return score, path_matches, excerpt_matches


def build_rationale(path_matches: list[str], excerpt_matches: list[str]) -> str:
    reasons: list[str] = []

    if path_matches:
        reasons.append(f"path matched {', '.join(path_matches[:3])}")
    if excerpt_matches:
        reasons.append(f"code context matched {', '.join(excerpt_matches[:4])}")

    if not reasons:
        return 'Selected as a weak lexical match to the task prompt.'

    return 'Selected because ' + ' and '.join(reasons) + '.'


def rank_files(task_prompt: str, scanned_files: list[ScannedFile], max_files: int) -> list[RankedFile]:
    task_tokens = tokenize(task_prompt)
    ranked: list[RankedFile] = []

    for scanned_file in scanned_files:
        score, path_matches, excerpt_matches = score_file(task_tokens, scanned_file)
        if score <= 0:
            continue
        matched_terms = sorted(dict.fromkeys(path_matches + excerpt_matches))
        ranked.append({
            'path': scanned_file['path'],
            'score': score,
            'excerpt': scanned_file['excerpt'],
            'rationale': build_rationale(path_matches, excerpt_matches),
            'matched_terms': matched_terms,
        })

    ranked.sort(key=lambda item: (-item['score'], item['path']))
    return ranked[:max_files]
