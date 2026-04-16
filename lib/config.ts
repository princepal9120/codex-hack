import fs from "node:fs";
import path from "node:path";

import type { TaskRecord } from "@/lib/task-types";

export interface CodexFlowConfig {
  repoPath: string;
  lintCommand: string;
  testCommand: string;
  maxFiles: number;
}

const DEFAULT_CONFIG: CodexFlowConfig = {
  repoPath: ".",
  lintCommand: "npm run lint",
  testCommand: "python3 -m unittest discover -s tests",
  maxFiles: 8,
};

export function getConfigPath() {
  return path.join(process.cwd(), "codexflow.config.json");
}

export function loadCodexFlowConfig(): CodexFlowConfig {
  const filePath = getConfigPath();

  if (!fs.existsSync(filePath)) {
    return DEFAULT_CONFIG;
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<CodexFlowConfig>;

  return {
    repoPath: parsed.repoPath ?? DEFAULT_CONFIG.repoPath,
    lintCommand: parsed.lintCommand ?? DEFAULT_CONFIG.lintCommand,
    testCommand: parsed.testCommand ?? DEFAULT_CONFIG.testCommand,
    maxFiles: parsed.maxFiles ?? DEFAULT_CONFIG.maxFiles,
  };
}

export function resolveTaskRepoPath(task: Pick<TaskRecord, "repoPath">, config: CodexFlowConfig) {
  const rawPath = task.repoPath || config.repoPath;
  return path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), rawPath);
}

export function resolveTaskCommands(task: Pick<TaskRecord, "lintCommand" | "testCommand">, config: CodexFlowConfig) {
  return {
    lintCommand: task.lintCommand || config.lintCommand,
    testCommand: task.testCommand || config.testCommand,
  };
}
