import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

let database: DatabaseSync | null = null;

function getDatabasePath() {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, "codexflow.sqlite");
}

function initialize(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      status TEXT NOT NULL,
      repo_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      run_started_at TEXT,
      run_finished_at TEXT,
      score INTEGER NOT NULL DEFAULT 0,
      selected_files_json TEXT NOT NULL DEFAULT '[]',
      codex_output TEXT NOT NULL DEFAULT '',
      diff_output TEXT NOT NULL DEFAULT '',
      lint_status TEXT NOT NULL DEFAULT 'pending',
      test_status TEXT NOT NULL DEFAULT 'pending',
      logs TEXT NOT NULL DEFAULT '',
      error_message TEXT,
      lint_command TEXT,
      test_command TEXT
    );
  `);
}

export function getDb() {
  if (!database) {
    database = new DatabaseSync(getDatabasePath());
    initialize(database);
  }

  return database;
}
