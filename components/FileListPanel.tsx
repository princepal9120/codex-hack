import { Task } from "@/data/mockTasks";
import { Badge } from "@/components/ui/Badge";

interface FileListPanelProps {
  task: Task;
}

export default function FileListPanel({ task }: FileListPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Selected Files</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {task.selectedFiles.map((file) => (
          <div key={file.path} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <span className="text-sm font-mono text-gray-900">{file.path}</span>
            <Badge variant="primary" className="text-xs">
              {file.score}%
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
