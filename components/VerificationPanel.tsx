import { type TaskRecord, type VerificationStatus } from "@/components/task-api";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface VerificationPanelProps {
  task: TaskRecord;
}

const getStatusIcon = (status: VerificationStatus) => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "pending":
      return <Clock className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusText = (status: VerificationStatus) => {
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Verification</h3>
      </div>
      <div className="divide-y divide-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(task.lintStatus)}
            <span className="text-sm font-medium text-gray-900">Lint</span>
          </div>
          <span className="text-xs text-gray-600">{getStatusText(task.lintStatus)}</span>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(task.testStatus)}
            <span className="text-sm font-medium text-gray-900">Tests</span>
          </div>
          <span className="text-xs text-gray-600">{getStatusText(task.testStatus)}</span>
        </div>
      </div>
      {task.verificationNotes ? (
        <div className="border-t border-blue-200 bg-blue-50 px-6 py-4 text-sm text-blue-900">
          {task.verificationNotes}
        </div>
      ) : null}
      {task.lintOutput ? (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-medium text-gray-900">Lint Output</p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-600 font-mono">
            {task.lintOutput}
          </pre>
        </div>
      ) : null}
      {task.testOutput ? (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-medium text-gray-900">Test Output</p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-600 font-mono">
            {task.testOutput}
          </pre>
        </div>
      ) : null}
      {task.logs ? (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-medium text-gray-900">Logs</p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-600 font-mono">
            {task.logs}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
