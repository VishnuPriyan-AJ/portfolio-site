import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost"; size?: "default" | "sm" }
type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "default" | "outline" | "ghost"; size?: "default" | "sm" }

const styles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
const variants = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
}
const sizes = { default: "h-11 px-5", sm: "h-9 px-3" }

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return <button className={cn(styles, variants[variant], sizes[size], className)} {...props} />
}

export function ButtonLink({ className, variant = "default", size = "default", ...props }: ButtonLinkProps) {
  return <a className={cn(styles, variants[variant], sizes[size], className)} {...props} />
}
