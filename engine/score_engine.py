from __future__ import annotations

from engine.ranker import RankedFile


def compute_score(diff_output: str, lint_status: str, test_status: str, ranked_files: list[RankedFile]) -> int:
    score = 0
    if diff_output.strip():
        score += 15
    if lint_status == 'passed':
        score += 30
    if test_status == 'passed':
        score += 40
    if ranked_files:
        score += 5
        strongest_match = min(ranked_files[0]['score'] // 4, 10)
        score += strongest_match
    return min(score, 100)
