'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { FolderPlus, Layers, Loader2, Plus, Workflow } from 'lucide-react';

import { createProject, fetchProjects, type ProjectRecord } from '@/components/project-api';
import Shell from '@/components/Shell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const initialForm = {
  name: '',
  repoPath: '.',
  description: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    let active = true;
    void fetchProjects()
      .then((nextProjects) => {
        if (!active) return;
        setProjects(nextProjects);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Failed to load projects.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    return {
      totalProjects: projects.length,
      totalTasks: projects.reduce((sum, project) => sum + project.taskCount, 0),
      openTasks: projects.reduce((sum, project) => sum + project.openTaskCount, 0),
    };
  }, [projects]);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateProject = async () => {
    if (!form.name.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const project = await createProject({
        name: form.name.trim(),
        repoPath: form.repoPath.trim() || '.',
        description: form.description.trim() || undefined,
      });
      setProjects((current) => [project, ...current]);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell>
      <header className="flex items-center justify-between gap-4 border-b border-border bg-background px-6 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Projects</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Create projects so issues, reports, and implementation tasks can be grouped cleanly in the kanban board.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleCreateProject} disabled={!form.name.trim() || isSubmitting}>
          <Plus className="h-4 w-4" />
          {isSubmitting ? 'Creating…' : 'New Project'}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Project setup</p>
            <h2 className="mt-2 text-xl font-bold text-foreground">Add a project to your CodexFlow workspace</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Projects let operators connect a repo target with the issues, reports, and implementation tasks they want to manage in the kanban board.
            </p>

            <div className="mt-6 space-y-5">
              <Field label="Project name" helper="Used everywhere in the board and detail surfaces.">
                <Input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Runtime reliability" />
              </Field>
              <Field label="Repository path" helper="Must stay inside the configured repository root.">
                <Input value={form.repoPath} onChange={(event) => updateField('repoPath', event.target.value)} placeholder="." />
              </Field>
              <Field label="Description" helper="Optional context for operators and reviewers.">
                <Textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Track issues, reports, and implementation work for runtime and sandbox reliability." />
              </Field>
            </div>

            {error ? (
              <div className="mt-5 rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <SummaryTile label="Projects" value={String(summary.totalProjects)} />
              <SummaryTile label="Board items" value={String(summary.totalTasks)} />
              <SummaryTile label="Open work" value={String(summary.openTasks)} />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Workspace map</p>
                <h2 className="mt-2 text-xl font-bold text-foreground">Project inventory</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Every project below can receive issue, task, and report work items from the shared create-work modal.</p>
              </div>
              <div className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {loading ? 'Loading…' : `${projects.length} projects`}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="flex h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading projects…
                </div>
              ) : projects.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 text-center">
                  <FolderPlus className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-4 text-base font-semibold text-foreground">No projects yet</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Create your first project to start grouping issues, reports, and implementation tasks inside the kanban board.</p>
                </div>
              ) : (
                projects.map((project) => <ProjectCard key={project.id} project={project} />)
              )}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}

function Field({ label, helper, children }: { label: string; helper: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{helper}</p>
      </div>
      {children}
    </label>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-muted px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article className="rounded-lg border border-border bg-muted/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{project.slug}</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{project.openTaskCount} open</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-foreground">{project.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description || 'No description yet. Create issues, reports, and tasks from the board modal.'}</p>
        </div>
        <div className="grid min-w-[180px] gap-2 sm:grid-cols-2">
          <Stat icon={<Workflow className="h-4 w-4" />} label="Items" value={String(project.taskCount)} />
          <Stat icon={<Layers className="h-4 w-4" />} label="Repo" value={project.repoPath} mono />
        </div>
      </div>
    </article>
  );
}

function Stat({ icon, label, value, mono = false }: { icon: ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card px-3 py-2.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className={`mt-2 text-sm font-semibold text-foreground ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
