import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked)
    }
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
