/**
 * Shared Chart.js styling constants — a direct port of the prototype's global
 * `chartOpts` object. Use these across all Analytics + Appeals + future charts
 * so every chart in the app has the same axis color, grid, font, tooltip, and
 * legend look-and-feel.
 */
export const CHART_AXIS_COLOR = '#8B95A5'
export const CHART_GRID_COLOR = '#EDF2F7'
export const CHART_FONT = { size: 10, family: 'IBM Plex Sans' } as const

export const CHART_TOOLTIP = {
  backgroundColor: '#fff',
  titleColor: '#1A1A2E',
  bodyColor: '#4A5568',
  borderColor: '#E2E8F0',
  borderWidth: 1,
  padding: 8,
  cornerRadius: 8,
  titleFont: { size: 11, family: 'IBM Plex Sans' } as const,
  bodyFont: { size: 11, family: 'IBM Plex Sans' } as const,
}

export const CHART_LEGEND_LABELS = {
  usePointStyle: true,
  padding: 10,
  font: CHART_FONT,
  color: CHART_AXIS_COLOR,
}
