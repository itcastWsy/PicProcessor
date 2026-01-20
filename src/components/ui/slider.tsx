import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn(
          "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-slate-50",
          className
        )}
        ref={ref}
        value={value[0]}
        max={max}
        step={step}
        onChange={(e) => onValueChange([parseFloat(e.target.value)])}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
