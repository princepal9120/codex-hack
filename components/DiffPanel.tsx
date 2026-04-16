interface DiffPanelProps {
  diff: string;
}

export default function DiffPanel({ diff }: DiffPanelProps) {
  if (!diff) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm text-gray-500">No diff has been captured yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Code Diff</h3>
      </div>
      <pre className="overflow-x-auto bg-gray-50 p-6 text-xs leading-relaxed text-gray-700 font-mono">
        <code>{diff}</code>
      </pre>
    </div>
  );
}
