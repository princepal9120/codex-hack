export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  updatedAt: string;
  language: string | null;
  private: boolean;
}

export interface GitHubAuthStatus {
  configured: boolean;
  connected: boolean;
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

function normalizeRepository(raw: unknown): GitHubRepository {
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    id: typeof record.id === 'number' ? record.id : Number(record.id ?? 0),
    name: typeof record.name === 'string' ? record.name : 'unknown-repository',
    fullName:
      typeof record.fullName === 'string'
        ? record.fullName
        : typeof record.full_name === 'string'
          ? record.full_name
          : typeof record.name === 'string'
            ? record.name
            : 'unknown-repository',
    description: typeof record.description === 'string' ? record.description : null,
    updatedAt:
      typeof record.updatedAt === 'string'
        ? record.updatedAt
        : typeof record.updated_at === 'string'
          ? record.updated_at
          : new Date().toISOString(),
    language: typeof record.language === 'string' ? record.language : null,
    private: Boolean(record.private),
  };
}

export function connectGitHub() {
  if (typeof window === 'undefined') {
    throw new Error('GitHub sign-in can only start in the browser.');
  }

  window.location.assign('/api/github/auth/start');
}

export async function fetchGitHubAuthStatus(): Promise<GitHubAuthStatus> {
  const payload = await fetchJson('/api/github/auth/session');
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};

  return {
    configured: Boolean(record.configured),
    connected: Boolean(record.connected),
  };
}

export async function disconnectGitHub() {
  await fetchJson('/api/github/auth/session', { method: 'DELETE' });
}

export async function fetchRepositories(): Promise<GitHubRepository[]> {
  const payload = await fetchJson('/api/github/repositories');
  const repositories = payload && typeof payload === 'object' && Array.isArray((payload as Record<string, unknown>).repositories)
    ? ((payload as Record<string, unknown>).repositories as unknown[])
    : [];

  return repositories.map(normalizeRepository);
}
