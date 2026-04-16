interface DiffPanelProps {
  diff: string;
}

export default function DiffPanel({ diff }: DiffPanelProps) {
  if (!diff) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex items-center justify-center h-64">
        <p className="text-sm text-gray-500">No diff available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Code Diff</h3>
      </div>
      <pre className="p-6 overflow-x-auto bg-gray-50 text-xs text-gray-700 font-mono leading-relaxed">
        <code>{diff}</code>
      </pre>
    </div>
  );
}
