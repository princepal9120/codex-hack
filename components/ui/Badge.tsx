import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-gray-200 bg-white text-gray-900",
        primary:
          "border border-transparent bg-violet-600 text-white hover:bg-violet-700",
        secondary:
          "border border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        queued:
          "border border-transparent bg-gray-100 text-gray-700",
        running:
          "border border-transparent bg-blue-100 text-blue-700",
        passed:
          "border border-transparent bg-green-100 text-green-700",
        failed:
          "border border-transparent bg-red-100 text-red-700",
        warning:
          "border border-transparent bg-amber-100 text-amber-700",
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
