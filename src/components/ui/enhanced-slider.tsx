
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

type Mark = {
  value: number;
  label: React.ReactNode;
}

interface EnhancedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  marks?: Mark[];
}

const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(({ className, marks = [], ...props }, ref) => {
  // Calculate where each mark should be positioned
  const getMarkPosition = (mark: Mark) => {
    const { min = 0, max = 100 } = props;
    return ((mark.value - min) / (max - min)) * 100;
  };

  return (
    <div className="relative pt-1 pb-8">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-500 bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 transition-transform" />
      </SliderPrimitive.Root>
      
      {/* Render marks */}
      {marks.length > 0 && (
        <div className="absolute left-0 right-0 top-4 h-8">
          {marks.map((mark, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${getMarkPosition(mark)}%` }}
            >
              <div className="w-px h-2 bg-gray-400 mx-auto mt-1"></div>
              <div className="text-xs text-gray-500 mt-1">{mark.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

EnhancedSlider.displayName = "EnhancedSlider"

export { EnhancedSlider }
