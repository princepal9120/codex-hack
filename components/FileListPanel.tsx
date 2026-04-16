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
            <div key={file.path} className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50">
              <span className="break-all text-sm font-mono text-gray-900">{file.path}</span>
              {file.score !== null ? (
                <Badge variant="primary" className="shrink-0 text-xs">
                  {file.score}%
                </Badge>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
