import { useMemo } from 'react'
import type { ChartData, ChartOptions, ChartDataset } from '@/shared/types'
import { useTheme } from '@/shared/context/ThemeContext'
import { BaseChart } from './BaseChart'
import { applyChartConfig, createChartDefaults, getChartPalette } from '@/shared/utils/chartConfig'

export interface LineChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  ariaLabel: string
  description?: string
  height?: number | string
  className?: string
}

export function LineChart({
  data,
  options,
  ariaLabel,
  description,
  height,
  className,
}: LineChartProps) {
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
      datasets: data.datasets.map((dataset: ChartDataset<'line'>, index: number) => ({
        ...dataset,
        borderColor:
          dataset.borderColor ??
          [palette.blue, palette.cyan, palette.purple, palette.green][index % 4],
        backgroundColor:
          dataset.backgroundColor ??
          `${[palette.blue, palette.cyan, palette.purple, palette.green][index % 4]}33`,
      })),
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
