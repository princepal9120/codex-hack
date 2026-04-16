export type TaskStatus = "queued" | "running" | "passed" | "failed" | "needs_review";

export interface Task {
  id: string;
  title: string;
  prompt: string;
  status: TaskStatus;
  score: number;
  selectedFiles: { path: string; score: number }[];
  diff: string;
  lintStatus: "passed" | "failed" | "pending";
  testStatus: "passed" | "failed" | "pending";
  logs: string;
  updatedAt: string;
  repoPath?: string;
}

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Add dark mode toggle",
    prompt: "Add a dark mode toggle button to the navbar that switches the theme",
    status: "running",
    score: 0,
    selectedFiles: [
      { path: "components/Navbar.tsx", score: 95 },
      { path: "app/globals.css", score: 87 },
    ],
    diff: `diff --git a/components/Navbar.tsx b/components/Navbar.tsx
@@ -1,10 +1,15 @@
 'use client';
 
 import Link from "next/link";
 import { Plus } from "lucide-react";
 import { Button } from "@/components/ui/Button";
 import { useState } from "react";
+import { Moon, Sun } from "lucide-react";
 import CreateTaskModal from "@/components/CreateTaskModal";
 
 export default function Navbar() {
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
+  const [isDark, setIsDark] = useState(false);`,
    lintStatus: "passed",
    testStatus: "pending",
    logs: "Compilation successful. Running lint checks...",
    updatedAt: "2 hours ago",
    repoPath: ".",
  },
  {
    id: "2",
    title: "Create Login page",
    prompt: "Build a login page with email and password fields using shadcn/ui components",
    status: "queued",
    score: 0,
    selectedFiles: [
      { path: "components/ui/Input.tsx", score: 92 },
      { path: "app/auth/page.tsx", score: 88 },
    ],
    diff: "",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "Waiting in queue...",
    updatedAt: "Just now",
    repoPath: ".",
  },
  {
    id: "3",
    title: "Fix responsive layout",
    prompt: "Make the task board responsive for mobile and tablet devices",
    status: "passed",
    score: 92,
    selectedFiles: [
      { path: "app/board/page.tsx", score: 96 },
      { path: "components/TaskCard.tsx", score: 89 },
    ],
    diff: `diff --git a/app/board/page.tsx b/app/board/page.tsx
@@ -15,7 +15,7 @@
     <div className="max-w-6xl mx-auto px-6 py-8">
       <div className="mb-8">
-        <h1 className="text-4xl font-bold text-gray-900">Task Board</h1>
+        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Task Board</h1>`,
    lintStatus: "passed",
    testStatus: "passed",
    logs: "✓ All tests passed\n✓ No lint errors\n✓ Build succeeded",
    updatedAt: "3 hours ago",
    repoPath: ".",
  },
  {
    id: "4",
    title: "Add API authentication",
    prompt: "Implement JWT token handling for API requests with refresh token logic",
    status: "failed",
    score: 34,
    selectedFiles: [
      { path: "lib/api.ts", score: 91 },
      { path: "lib/auth.ts", score: 85 },
    ],
    diff: `diff --git a/lib/api.ts b/lib/api.ts
@@ -1,3 +1,15 @@
+export const getToken = () => localStorage.getItem('token');
+export const setToken = (token: string) => localStorage.setItem('token', token);
+
+export const apiCall = async (url: string, options = {}) => {
+  const token = getToken();
+  const headers = {
+    'Authorization': \`Bearer \${token}\`,
+    ...options.headers,
+  };
+  return fetch(url, { ...options, headers });
+};`,
    lintStatus: "failed",
    testStatus: "failed",
    logs: "Error: Token validation failed in test_auth.ts:45\nTest suite failed with 3 failures",
    updatedAt: "5 hours ago",
    repoPath: ".",
  },
  {
    id: "5",
    title: "Optimize image loading",
    prompt: "Implement lazy loading and image optimization for better performance",
    status: "needs_review",
    score: 78,
    selectedFiles: [
      { path: "components/ImageGallery.tsx", score: 94 },
      { path: "app/globals.css", score: 72 },
    ],
    diff: `diff --git a/components/ImageGallery.tsx b/components/ImageGallery.tsx
@@ -1,5 +1,7 @@
 import Image from "next/image";
+import { lazy, Suspense } from "react";
 
 export default function ImageGallery({ images }: { images: string[] }) {
   return (
-    <div>{images.map(img => <img src={img} />)}</div>
+    <div>{images.map(img => <Image src={img} alt="" loading="lazy" />)}</div>`,
    lintStatus: "passed",
    testStatus: "passed",
    logs: "All checks passed. Waiting for manual review.",
    updatedAt: "1 hour ago",
    repoPath: ".",
  },
  {
    id: "6",
    title: "Setup environment variables",
    prompt: "Configure .env.local file and add validation for required environment variables",
    status: "queued",
    score: 0,
    selectedFiles: [
      { path: ".env.example", score: 98 },
      { path: "lib/env.ts", score: 91 },
    ],
    diff: "",
    lintStatus: "pending",
    testStatus: "pending",
    logs: "In queue. Estimated wait: 2 tasks ahead",
    updatedAt: "Just now",
    repoPath: ".",
  },
];
