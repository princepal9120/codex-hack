export interface ProjectRecord {
  id: string;
  name: string;
  slug: string;
  repoPath: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  openTaskCount: number;
  lastActivityAt: string | null;
}

export interface CreateProjectInput {
  name: string;
  repoPath?: string;
  description?: string;
}

class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

async function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      (typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' && payload.error) ||
      (typeof payload === 'object' && payload && 'message' in payload && typeof payload.message === 'string' && payload.message) ||
      `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return payload;
}

function normalizeProject(raw: unknown): ProjectRecord {
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    id: String(record.id ?? ''),
    name: typeof record.name === 'string' ? record.name : 'Untitled project',
    slug: typeof record.slug === 'string' ? record.slug : 'project',
    repoPath: typeof record.repoPath === 'string' ? record.repoPath : typeof record.repo_path === 'string' ? record.repo_path : '.',
    description: typeof record.description === 'string' ? record.description : '',
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : typeof record.created_at === 'string' ? record.created_at : new Date().toISOString(),
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : typeof record.updated_at === 'string' ? record.updated_at : new Date().toISOString(),
    taskCount: typeof record.taskCount === 'number' ? record.taskCount : typeof record.task_count === 'number' ? record.task_count : 0,
    openTaskCount: typeof record.openTaskCount === 'number' ? record.openTaskCount : typeof record.open_task_count === 'number' ? record.open_task_count : 0,
    lastActivityAt:
      typeof record.lastActivityAt === 'string'
        ? record.lastActivityAt
        : typeof record.last_activity_at === 'string'
          ? record.last_activity_at
          : null,
  };
}

export async function fetchProjects() {
  const payload = await fetchJson('/api/projects');
  const projects = payload && typeof payload === 'object' && Array.isArray((payload as Record<string, unknown>).projects)
    ? ((payload as Record<string, unknown>).projects as unknown[])
    : [];

  return projects.map(normalizeProject);
}

export async function createProject(input: CreateProjectInput) {
  const payload = await fetchJson('/api/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  const project = payload && typeof payload === 'object' ? (payload as Record<string, unknown>).project : null;
  return normalizeProject(project);
}
