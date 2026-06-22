import { useMemo } from 'react'
import type { ChartData } from '@/shared/types'
import type { TrendData } from '@/shared/types'
import { useTheme } from '@/shared/context/ThemeContext'
import { BaseChart } from './BaseChart'
import { applyChartConfig, createChartDefaults, getChartPalette } from '@/shared/utils/chartConfig'

export interface KpiTrendChartProps {
  data: TrendData[]
  ariaLabel: string
  description?: string
  height?: number | string
  className?: string
  showPoints?: boolean
}

export function KpiTrendChart({
  data,
  ariaLabel,
  description,
  height = 120,
  className,
  showPoints = false,
}: KpiTrendChartProps) {
  const { isDark } = useTheme()
  const palette = getChartPalette(isDark)

  const chartData = useMemo<ChartData<'line'>>(
    () => ({
      labels: data.map((entry) => entry.label),
      datasets: [
        {
          label: 'Trend',
          data: data.map((entry) => entry.value),
          borderColor: palette.blue,
          backgroundColor: `${palette.blue}22`,
          fill: true,
          tension: 0.4,
          pointRadius: showPoints ? 3 : 0,
          pointHoverRadius: 4,
        },
      ],
    }),
    [data, palette.blue, showPoints],
  )

  const config = useMemo(() => {
    const defaults = createChartDefaults<'line'>(isDark)
    return {
      type: 'line' as const,
      data: chartData,
      options: applyChartConfig(defaults, {
        plugins: {
          ...(defaults.plugins ?? {}),
          legend: {
            display: false,
          },
          tooltip: {
            ...(defaults.plugins?.tooltip ?? {}),
            enabled: true,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      }),
    }
  }, [chartData, isDark])

  return (
    <BaseChart
      config={config}
      ariaLabel={ariaLabel}
      description={description}
      height={height}
      className={className}
    />
  )
}
