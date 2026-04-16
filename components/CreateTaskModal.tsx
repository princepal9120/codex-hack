'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createTask } from "@/components/task-api";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  title: "",
  prompt: "",
  repoPath: ".",
  lintCommand: "npm run lint",
  testCommand: "python3 -m unittest discover -s tests",
};

export default function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(
    () => form.title.trim().length > 0 && form.prompt.trim().length > 0,
    [form.prompt, form.title]
  );

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    setForm(initialForm);
    setError(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isSubmitting) {
      reset();
    }

    onOpenChange(nextOpen);
  };

  const handleCreate = async () => {
    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const task = await createTask({
        title: form.title.trim(),
        prompt: form.prompt.trim(),
        repoPath: form.repoPath.trim() || ".",
        lintCommand: form.lintCommand.trim() || undefined,
        testCommand: form.testCommand.trim() || undefined,
      });

      reset();
      onOpenChange(false);
      router.push(`/tasks/${task.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create task.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Queue a repo-aware CodexFlow run with lint and test verification.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-900" htmlFor="task-title">
              Title
            </label>
            <Input
              id="task-title"
              type="text"
              placeholder="e.g., Add dark mode toggle"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-900" htmlFor="task-prompt">
              Prompt
            </label>
            <textarea
              id="task-prompt"
              placeholder="Describe what you want Codex to implement..."
              value={form.prompt}
              onChange={(event) => updateField("prompt", event.target.value)}
              rows={5}
              className="min-h-[140px] rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-y"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-900" htmlFor="task-repo-path">
              Repository Path
            </label>
            <Input
              id="task-repo-path"
              type="text"
              placeholder="."
              value={form.repoPath}
              onChange={(event) => updateField("repoPath", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-900" htmlFor="task-lint-command">
                Lint Command
              </label>
              <Input
                id="task-lint-command"
                type="text"
                placeholder="npm run lint"
                value={form.lintCommand}
                onChange={(event) => updateField("lintCommand", event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-900" htmlFor="task-test-command">
                Test Command
              </label>
              <Input
                id="task-test-command"
                type="text"
                placeholder="npm test"
                value={form.testCommand}
                onChange={(event) => updateField("testCommand", event.target.value)}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            New tasks auto-run through the repo scanner, prompt builder, patch preview, and lint/test verification pipeline.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Creating…" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
