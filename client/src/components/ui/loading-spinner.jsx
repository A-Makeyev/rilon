import * as React from "react"
import { cn } from "@/lib/utils"

const spinnerVariants = "w-5 h-5 border-4 border-t-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"

const LoadingSpinner = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return <div ref={ref} className={cn(spinnerVariants, className)} {...rest} />
})

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner }
