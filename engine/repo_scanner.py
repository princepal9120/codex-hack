from __future__ import annotations

from pathlib import Path
from typing import TypedDict

IGNORED_DIRECTORIES = {
    '.git',
    '.next',
    '.omx',
    '__pycache__',
    'build',
    'dist',
    'node_modules',
    'venv',
}

MAX_FILE_SIZE_BYTES = 200_000
BINARY_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip', '.gz', '.tar', '.mp4', '.mov', '.sqlite'
}


class ScannedFile(TypedDict):
    path: str
    excerpt: str


def should_skip(path: Path) -> bool:
    if any(part in IGNORED_DIRECTORIES for part in path.parts):
        return True
    if path.suffix.lower() in BINARY_EXTENSIONS:
        return True
    if not path.is_file():
        return True
    try:
        if path.stat().st_size > MAX_FILE_SIZE_BYTES:
            return True
    except OSError:
        return True
    return False


def build_excerpt(contents: str, limit: int = 1800) -> str:
    collapsed = contents.strip()
    if len(collapsed) <= limit:
        return collapsed
    return collapsed[:limit] + "\n..."


def scan_repository(repo_path: str) -> list[ScannedFile]:
    root = Path(repo_path).resolve()
    scanned: list[ScannedFile] = []

    for file_path in root.rglob('*'):
        if should_skip(file_path):
            continue
        try:
            contents = file_path.read_text(encoding='utf-8')
        except (OSError, UnicodeDecodeError):
            continue
        scanned.append({
            'path': str(file_path.relative_to(root)),
            'excerpt': build_excerpt(contents),
        })

    return scanned
