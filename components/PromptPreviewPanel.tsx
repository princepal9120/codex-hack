import { type TaskRecord } from "@/components/task-api";

interface PromptPreviewPanelProps {
  task: TaskRecord;
}

export default function PromptPreviewPanel({ task }: PromptPreviewPanelProps) {
  if (!task.promptPreview) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Prompt & Context Preview</h3>
      </div>
      <div className="border-b border-gray-200 bg-violet-50 px-6 py-4 text-sm text-violet-900">
        <p className="font-medium">Why these files were selected</p>
        <p className="mt-1 text-violet-900/80">
          {task.contextSummary || "CodexFlow assembled a repo-aware context bundle for this run."}
        </p>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words bg-gray-50 p-6 text-xs leading-relaxed text-gray-700 font-mono">
        <code>{task.promptPreview}</code>
      </pre>
    </div>
  );
}
