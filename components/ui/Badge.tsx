import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2 focus:ring-[#57d1c4]/70 focus:ring-offset-2 focus:ring-offset-[#090b0f]",
  {
    variants: {
      variant: {
        default: "border border-white/10 bg-white/[0.04] text-[#eef2f7]",
        primary: "border border-transparent bg-[#57d1c4] text-[#081013]",
        secondary: "border border-transparent bg-white/[0.08] text-[#eef2f7]",
        queued: "border border-transparent bg-white/[0.08] text-[#c7ced8]",
        running: "border border-transparent bg-[#112423] text-[#57d1c4]",
        passed: "border border-transparent bg-[#16241c] text-[#7bf2b4]",
        failed: "border border-transparent bg-[#2a1719] text-[#f6a4a4]",
        warning: "border border-transparent bg-[#2b2413] text-[#f7d879]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
