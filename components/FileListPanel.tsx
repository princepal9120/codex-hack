import { type TaskRecord } from "@/components/task-api";
import { Badge } from "@/components/ui/Badge";

interface FileListPanelProps {
  task: TaskRecord;
}

export default function FileListPanel({ task }: FileListPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Selected Files</h3>
      </div>
      {task.selectedFiles.length === 0 ? (
        <div className="px-6 py-8 text-sm text-gray-500">No file selection has been recorded yet.</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {task.selectedFiles.map((file) => (
            <div key={file.path} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between gap-3">
                <span className="break-all text-sm font-mono text-gray-900">{file.path}</span>
                {file.score !== null ? (
                  <Badge variant="primary" className="shrink-0 text-xs">
                    {file.score}%
                  </Badge>
                ) : null}
              </div>
              {file.rationale ? (
                <p className="mt-2 text-sm text-gray-600">{file.rationale}</p>
              ) : null}
              {file.matchedTerms && file.matchedTerms.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {file.matchedTerms.map((term) => (
                    <span key={`${file.path}-${term}`} className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">
                      {term}
                    </span>
                  ))}
                </div>
              ) : null}
              {file.excerpt ? (
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-50 p-3 text-xs text-gray-600 font-mono">
                  {file.excerpt}
                </pre>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
