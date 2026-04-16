import { Task } from "@/data/mockTasks";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface VerificationPanelProps {
  task: Task;
}

const getStatusIcon = (status: "passed" | "failed" | "pending") => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "failed":
      return <XCircle className="w-5 h-5 text-red-600" />;
    case "pending":
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusText = (status: "passed" | "failed" | "pending") => {
  switch (status) {
    case "passed":
      return "Passed";
    case "failed":
      return "Failed";
    case "pending":
      return "Pending";
  }
};

export default function VerificationPanel({ task }: VerificationPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Verification</h3>
      </div>
      <div className="divide-y divide-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(task.lintStatus)}
            <span className="text-sm font-medium text-gray-900">Lint</span>
          </div>
          <span className="text-xs text-gray-600">{getStatusText(task.lintStatus)}</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(task.testStatus)}
            <span className="text-sm font-medium text-gray-900">Tests</span>
          </div>
          <span className="text-xs text-gray-600">{getStatusText(task.testStatus)}</span>
        </div>
      </div>
      {task.logs && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-900 mb-2">Logs</p>
          <pre className="text-xs text-gray-600 font-mono overflow-x-auto">
            {task.logs}
          </pre>
        </div>
      )}
    </div>
  );
}
