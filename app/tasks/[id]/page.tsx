'use client';

import { mockTasks } from "@/data/mockTasks";
import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/StatusBadge";
import FileListPanel from "@/components/FileListPanel";
import DiffPanel from "@/components/DiffPanel";
import VerificationPanel from "@/components/VerificationPanel";
import ScoreCard from "@/components/ScoreCard";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  const task = mockTasks.find(t => t.id === params.id);

  if (!task) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/board">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Board
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Task not found</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/board">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <p className="text-gray-600">{task.prompt}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            <Button variant="outline" size="sm" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            <FileListPanel task={task} />
            <ScoreCard task={task} />
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            <DiffPanel diff={task.diff} />
            <VerificationPanel task={task} />
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
              <p className="text-sm font-semibold text-gray-900">{task.status}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Repository</p>
              <p className="text-sm font-mono text-gray-900">{task.repoPath || "."}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900">{task.updatedAt}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Task ID</p>
              <p className="text-sm font-mono text-gray-900">{task.id}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
