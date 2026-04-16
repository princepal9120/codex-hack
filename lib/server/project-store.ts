import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";
import type { CreateProjectInput, ProjectRecord } from "@/lib/task-types";

interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  repo_path: string;
  description: string;
  created_at: string;
  updated_at: string;
  task_count?: number;
  open_task_count?: number;
  last_activity_at?: string | null;
}

const seedProjects: Array<Omit<ProjectRecord, "taskCount" | "openTaskCount" | "lastActivityAt">> = [
  {
    id: randomUUID(),
    name: "Engineering",
    slug: "engineering",
    repoPath: ".",
    description: "Default workspace for repo-aware issues, implementation tasks, and operator reports.",
    createdAt: new Date("2026-04-15T09:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-04-15T09:00:00.000Z").toISOString(),
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "project";
}

function rowToProject(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    repoPath: row.repo_path,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    taskCount: Number(row.task_count ?? 0),
    openTaskCount: Number(row.open_task_count ?? 0),
    lastActivityAt: row.last_activity_at ?? null,
  };
}

function insertProject(project: Omit<ProjectRecord, "taskCount" | "openTaskCount" | "lastActivityAt">) {
  getDb().prepare(`
    INSERT INTO projects (
      id, name, slug, repo_path, description, created_at, updated_at
    ) VALUES (
      :id, :name, :slug, :repo_path, :description, :created_at, :updated_at
    )
  `).run({
    id: project.id,
    name: project.name,
    slug: project.slug,
    repo_path: project.repoPath,
    description: project.description,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  });
}

export function ensureSeedProjects() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number }).count;

  if (count > 0) {
    return;
  }

  for (const project of seedProjects) {
    insertProject(project);
  }
}

export function listProjects() {
  ensureSeedProjects();
  const rows = getDb().prepare(`
    SELECT
      p.*,
      COUNT(t.id) AS task_count,
      SUM(CASE WHEN t.status IN ('queued', 'running') THEN 1 ELSE 0 END) AS open_task_count,
      MAX(t.updated_at) AS last_activity_at
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    GROUP BY p.id
    ORDER BY COALESCE(MAX(t.updated_at), p.updated_at) DESC, p.name ASC
  `).all() as ProjectRow[];

  return rows.map(rowToProject);
}

export function getProjectById(id: string) {
  ensureSeedProjects();
  const row = getDb().prepare(`
    SELECT
      p.*,
      COUNT(t.id) AS task_count,
      SUM(CASE WHEN t.status IN ('queued', 'running') THEN 1 ELSE 0 END) AS open_task_count,
      MAX(t.updated_at) AS last_activity_at
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
  `).get(id) as ProjectRow | undefined;

  return row ? rowToProject(row) : null;
}

export function getDefaultProject() {
  return listProjects()[0] ?? null;
}

export function createProject(input: CreateProjectInput) {
  ensureSeedProjects();
  const now = new Date().toISOString();
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let index = 2;

  while (getDb().prepare("SELECT id FROM projects WHERE slug = ?").get(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  const project = {
    id: randomUUID(),
    name: input.name.trim(),
    slug,
    repoPath: input.repoPath?.trim() || ".",
    description: input.description?.trim() || "",
    createdAt: now,
    updatedAt: now,
  };

  insertProject(project);

  return {
    ...project,
    taskCount: 0,
    openTaskCount: 0,
    lastActivityAt: null,
  } as ProjectRecord;
}
