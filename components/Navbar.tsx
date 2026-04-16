'use client';

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import CreateTaskModal from "@/components/CreateTaskModal";

export default function Navbar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="font-semibold text-gray-900">CodexFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/board" className="text-sm text-gray-600 hover:text-gray-900">
              Board
            </Link>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>
        </div>
      </nav>
      <CreateTaskModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}
