from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from engine.ranker import rank_files
from engine.repo_scanner import scan_repository
from engine.score_engine import compute_score


class RepoScannerTests(unittest.TestCase):
    def test_scanner_ignores_node_modules(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / 'src').mkdir()
            (root / 'node_modules').mkdir()
            (root / 'src' / 'feature.ts').write_text('export const feature = true;\n', encoding='utf-8')
            (root / 'node_modules' / 'ignored.js').write_text('console.log("ignore");\n', encoding='utf-8')

            scanned = scan_repository(temp_dir)
            paths = {item['path'] for item in scanned}

            self.assertIn('src/feature.ts', paths)
            self.assertNotIn('node_modules/ignored.js', paths)


class RankerTests(unittest.TestCase):
    def test_ranker_prefers_path_overlap(self) -> None:
        scanned_files = [
            {'path': 'app/api/login.ts', 'excerpt': 'login endpoint code'},
            {'path': 'components/navbar.tsx', 'excerpt': 'top navigation'},
        ]

        ranked = rank_files('add login rate limiting', scanned_files, max_files=2)

        self.assertEqual(ranked[0]['path'], 'app/api/login.ts')
        self.assertGreater(ranked[0]['score'], ranked[1]['score'])
        self.assertIn('login', ranked[0]['matched_terms'])
        self.assertTrue(ranked[0]['rationale'])


class ScoreEngineTests(unittest.TestCase):
    def test_score_engine_matches_mvp_weights(self) -> None:
        ranked_files = [{'path': 'app/api/login.ts', 'score': 90, 'excerpt': '...'}]
        score = compute_score('diff --git a/file b/file', 'passed', 'passed', ranked_files)
        self.assertEqual(score, 100)


if __name__ == '__main__':
    unittest.main()
