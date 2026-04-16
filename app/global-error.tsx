'use client';

import Link from "next/link";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090b0f] text-white">
        <main className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="surface-panel max-w-2xl rounded-[2rem] p-8 sm:p-10">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#7b8794]">
              Global error
            </p>
            <h1 className="font-display mt-4 text-4xl text-white sm:text-5xl">
              The root shell needs a clean retry.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#9aa6b2]">
              Next.js requested a full-app fallback. Retrying should usually recover the dev session.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={reset} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Retry app
              </Button>
              <Link href="/">
                <Button variant="outline">Go home</Button>
              </Link>
            </div>

            <pre className="mt-8 overflow-x-auto rounded-[1.25rem] border border-white/8 bg-[#06080b] p-4 text-xs leading-6 text-[#9aa6b2]">
              <code>{error.message}</code>
            </pre>
          </div>
        </main>
      </body>
    </html>
  );
}
