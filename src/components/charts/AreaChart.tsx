import { useMemo } from 'react'
import type { ChartData, ChartOptions } from '@/types'
import { useTheme } from '@/context/ThemeContext'
import { BaseChart } from './BaseChart'
import { applyChartConfig, createChartDefaults, getChartPalette } from '@/utils/chartConfig'

export interface AreaChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  ariaLabel: string
  description?: string
  height?: number | string
  className?: string
}

export function AreaChart({
  data,
  options,
  ariaLabel,
  description,
  height,
  className,
}: AreaChartProps) {
  const { isDark } = useTheme()
  const palette = getChartPalette(isDark)

  const config = useMemo(() => {
    const defaults = createChartDefaults<'line'>(isDark)
    return {
      type: 'line' as const,
      data,
      options: applyChartConfig(defaults, {
        ...options,
        plugins: {
          ...defaults.plugins,
          ...options?.plugins,
        },
        scales: {
          ...defaults.scales,
          ...options?.scales,
        },
      }),
    }
  }, [data, isDark, options])

  const themedData = useMemo(() => {
    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => {
        const color =
          dataset.borderColor ??
          [palette.blue, palette.cyan, palette.purple, palette.green][index % 4]
        return {
          ...dataset,
          fill: dataset.fill ?? true,
          tension: dataset.tension ?? 0.35,
          borderColor: color,
          backgroundColor:
            dataset.backgroundColor ?? `${String(color)}20`,
          pointRadius: dataset.pointRadius ?? 0,
        }
      }),
    }
  }, [data, palette.blue, palette.cyan, palette.green, palette.purple])

  return (
    <BaseChart
      config={{ ...config, data: themedData }}
      ariaLabel={ariaLabel}
      description={description}
      height={height}
      className={className}
    />
  )
}
