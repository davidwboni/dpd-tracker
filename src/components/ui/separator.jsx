import React from "react"

const Separator = React.forwardRef(({ className = "", orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={`shrink-0 bg-border ${
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
    } ${className}`}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }