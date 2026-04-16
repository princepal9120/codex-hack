'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Landing", prefix: "/" },
  { href: "/board", label: "Board", prefix: "/board" },
  { href: "/onboarding", label: "Onboarding", prefix: "/onboarding" },
];

const machineStats = [
  { label: "Agents online", value: "04" },
  { label: "Queued runs", value: "06" },
  { label: "Checks passing", value: "92%" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  const isActive = (prefix: string) => {
    if (prefix === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(prefix);
  };

  return (
    <aside className="surface-soft flex w-full flex-col rounded-[2rem] p-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[260px]">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-sm font-semibold tracking-[0.22em] text-[#bdff64]">
          CF
        </div>
        <div>
          <p className="font-display text-lg text-white">CodexFlow</p>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#7b8794]">
            workspace
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-2 lg:flex-1">
        {navItems.map((item) => {
          const active = isActive(item.prefix);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                active
                  ? "bg-white/[0.06] text-white"
                  : "text-[#9aa6b2] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    active ? "bg-[#bdff64]" : "bg-white/20"
                  }`}
                />
                {item.label}
              </span>
              <span className="font-mono-ui text-[0.68rem] uppercase tracking-[0.22em] text-[#71808f]">
                {item.label.slice(0, 2)}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="surface-panel mt-6 rounded-[1.5rem] p-4">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#7b8794]">
          Workspace health
        </p>
        <div className="mt-4 space-y-3">
          {machineStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between border-b border-white/6 pb-3 last:border-b-0 last:pb-0"
            >
              <span className="text-sm text-[#9aa6b2]">{stat.label}</span>
              <span className="font-mono-ui text-sm text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
