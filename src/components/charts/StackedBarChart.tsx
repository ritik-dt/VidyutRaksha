import { useMemo } from 'react'
import type { ChartData, ChartOptions } from '@/types'
import { useTheme } from '@/context/ThemeContext'
import { BaseChart } from './BaseChart'
import { applyChartConfig, createChartDefaults, getChartPalette } from '@/utils/chartConfig'

export interface StackedBarChartProps {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  ariaLabel: string
  description?: string
  height?: number | string
  className?: string
}

export function StackedBarChart({
  data,
  options,
  ariaLabel,
  description,
  height,
  className,
}: StackedBarChartProps) {
  const { isDark } = useTheme()
  const palette = getChartPalette(isDark)

  const config = useMemo(() => {
    const defaults = createChartDefaults<'bar'>(isDark)
    return {
      type: 'bar' as const,
      data,
      options: applyChartConfig(defaults, {
        ...options,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
          ...options?.scales,
        },
        plugins: {
          ...defaults.plugins,
          ...options?.plugins,
        },
      }),
    }
  }, [data, isDark, options])

  const themedData = useMemo(() => {
    const colors = [
      palette.blue,
      palette.cyan,
      palette.purple,
      palette.green,
      palette.amber,
      palette.red,
    ]

    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor ?? colors[index % colors.length],
        borderColor: dataset.borderColor ?? colors[index % colors.length],
      })),
    }
  }, [data, palette.amber, palette.blue, palette.cyan, palette.green, palette.purple, palette.red])

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
