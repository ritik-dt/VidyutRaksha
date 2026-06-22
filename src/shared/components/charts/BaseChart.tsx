import { useEffect, useId, useMemo, useRef } from 'react'
import Chart from 'chart.js/auto'
import type { ChartConfiguration, ChartType } from 'chart.js'
import { useTheme } from '@/shared/context/ThemeContext'
import { cn } from '@/shared/components/ui'

export interface BaseChartProps<TType extends ChartType> {
  config: ChartConfiguration<TType>
  ariaLabel: string
  description?: string
  className?: string
  height?: number | string
  onChartReady?: (chart: Chart<TType>) => void
}

export function BaseChart<TType extends ChartType>({
  config,
  ariaLabel,
  description,
  className,
  height = 280,
  onChartReady,
}: BaseChartProps<TType>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart<TType> | null>(null)
  const { isDark } = useTheme()
  const descriptionId = useId()

  const chartConfig = useMemo(() => config, [config, isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    chartRef.current?.destroy()
    const instance = new Chart(context, chartConfig)
    chartRef.current = instance
    onChartReady?.(instance)

    return () => {
      instance.destroy()
      if (chartRef.current === instance) {
        chartRef.current = null
      }
    }
  }, [chartConfig, onChartReady, isDark])

  return (
    <div
      className={cn('relative min-h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full', className)}
      style={{ height }}
      aria-label={ariaLabel}
      aria-describedby={description ? descriptionId : undefined}
      role="img"
    >
      {description ? (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      ) : null}
      <canvas ref={canvasRef} />
    </div>
  )
}
