'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Github } from "lucide-react";
import { mockTasks } from "@/data/mockTasks";

export default function LandingPage() {
  const demoTask = mockTasks[2]; // The "passed" task

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Make Codex work on real codebases
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            CodexFlow turns coding tasks into an execution pipeline. It selects the right repo context, 
            runs Codex on the task, verifies the output with lint and tests, and tracks the result in a 
            simple board.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/board">
              <Button size="lg" className="gap-2">
                View Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="w-5 h-5" />
                View GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Coding agents often fail on real repos because they get the wrong context 
            and produce unverified output. CodexFlow solves this by building a structured 
            execution pipeline that ensures quality at every step.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                number: "1",
                title: "Create Task",
                description: "Define a coding task with context and requirements"
              },
              {
                number: "2",
                title: "Select Files",
                description: "AI identifies relevant repository files"
              },
              {
                number: "3",
                title: "Execute with Codex",
                description: "Run the AI model on the selected context"
              },
              {
                number: "4",
                title: "Verify Output",
                description: "Run lint checks and test suite"
              },
              {
                number: "5",
                title: "Review Result",
                description: "Inspect the diff and metrics in the board"
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold mx-auto mb-4 text-lg">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Sample Task Result</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Selected Files</p>
              <div className="space-y-2">
                {demoTask.selectedFiles.map((file) => (
                  <div key={file.path} className="text-xs text-gray-700 font-mono bg-white rounded-lg p-3 border border-gray-200">
                    {file.path}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Generated Diff Preview</p>
              <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-48 overflow-y-auto">
                <pre className="text-xs text-gray-700 font-mono">
                  {demoTask.diff.substring(0, 300)}...
                </pre>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Verification Status</p>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs font-medium text-green-700">✓ Lint Passed</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs font-medium text-green-700">✓ Tests Passed</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-violet-200">
                  <p className="text-2xl font-bold text-violet-600">92</p>
                  <p className="text-xs text-gray-600">Score</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/board" className="inline-block">
            <Button className="gap-2">
              Explore Full Board
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to try it?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start executing AI coding tasks with full visibility and verification.
          </p>
          <Link href="/board">
            <Button size="lg" className="gap-2">
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
