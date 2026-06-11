import { useMemo } from 'react'
import type { ChartData, ChartOptions } from '@/types'
import { useTheme } from '@/context/ThemeContext'
import { BaseChart } from './BaseChart'
import { applyChartConfig, createChartDefaults, getChartPalette } from '@/utils/chartConfig'

export interface BarChartProps {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  ariaLabel: string
  description?: string
  height?: number | string
  className?: string
}

export function BarChart({
  data,
  options,
  ariaLabel,
  description,
  height,
  className,
}: BarChartProps) {
  const { isDark } = useTheme()
  const palette = getChartPalette(isDark)

  const config = useMemo(() => {
    const defaults = createChartDefaults<'bar'>(isDark)
    return {
      type: 'bar' as const,
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
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor:
          dataset.backgroundColor ??
          [palette.blue, palette.cyan, palette.purple, palette.green, palette.amber][
            index % 5
          ],
        borderColor:
          dataset.borderColor ??
          [palette.blue, palette.cyan, palette.purple, palette.green, palette.amber][
            index % 5
          ],
      })),
    }
  }, [data, palette.amber, palette.blue, palette.cyan, palette.green, palette.purple])

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
