import { useMemo } from 'react'
import type { ChartData, ChartOptions } from '@/types'
import { useTheme } from '@/context/ThemeContext'
import { BaseChart } from './BaseChart'
import { applyChartConfig, createArcDefaults, getChartPalette } from '@/utils/chartConfig'

export interface DoughnutChartProps {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
  ariaLabel: string
  description?: string
  height?: number | string
  className?: string
}

export function DoughnutChart({
  data,
  options,
  ariaLabel,
  description,
  height,
  className,
}: DoughnutChartProps) {
  const { isDark } = useTheme()
  const palette = getChartPalette(isDark)

  const config = useMemo(() => {
    const defaults = createArcDefaults<'doughnut'>(isDark)
    return {
      type: 'doughnut' as const,
      data,
      options: applyChartConfig(defaults, options),
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
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor ?? colors,
        borderColor: dataset.borderColor ?? palette.card,
      })),
    }
  }, [data, palette.amber, palette.blue, palette.card, palette.cyan, palette.green, palette.purple, palette.red])

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
