'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [repoPath, setRepoPath] = useState("");
  const [lintCommand, setLintCommand] = useState("");
  const [testCommand, setTestCommand] = useState("");

  const handleCreate = () => {
    // In a real app, this would create a task
    console.log({ title, prompt, repoPath, lintCommand, testCommand });
    onOpenChange(false);
    // Reset form
    setTitle("");
    setPrompt("");
    setRepoPath("");
    setLintCommand("");
    setTestCommand("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Define a coding task for CodexFlow to execute
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-900">Title</label>
            <input
              type="text"
              placeholder="e.g., Add dark mode toggle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-900">Prompt</label>
            <textarea
              placeholder="Describe what you want the AI to code..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-900">Repository Path</label>
            <input
              type="text"
              placeholder="e.g., /path/to/repo"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-900">Lint Command (optional)</label>
              <input
                type="text"
                placeholder="e.g., npm run lint"
                value={lintCommand}
                onChange={(e) => setLintCommand(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-900">Test Command (optional)</label>
              <input
                type="text"
                placeholder="e.g., npm test"
                value={testCommand}
                onChange={(e) => setTestCommand(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
