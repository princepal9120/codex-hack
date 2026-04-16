import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-[-0.02em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57d1c4]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0f] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#57d1c4] text-[#081013] shadow-[0_14px_34px_rgba(87,209,196,0.18)] hover:-translate-y-0.5 hover:bg-[#6bddcf] hover:shadow-[0_20px_48px_rgba(87,209,196,0.22)]",
        destructive: "bg-[#e56a6a] text-white hover:-translate-y-0.5 hover:bg-[#ef7b7b]",
        outline:
          "border border-white/10 bg-[#141922]/72 text-[#eef2f7] hover:border-[#57d1c4]/28 hover:bg-[#181f28]",
        secondary:
          "bg-[#151920] text-[#eef2f7] hover:-translate-y-0.5 hover:bg-[#1a2028]",
        ghost: "text-[#c7ced8] hover:bg-white/[0.06] hover:text-white",
        link: "text-[#57d1c4] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
