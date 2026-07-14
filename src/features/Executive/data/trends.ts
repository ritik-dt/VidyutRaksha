import type { TrendChart } from '../types'

/** 7-day trend cards with sparklines. Points are y-values in the SVG viewBox
 *  (higher number = further down = worse for loss/demand, so callers interpret
 *  contextually). Labels are per-day value strings shown under the sparkline. */
export const TRENDS: TrendChart[] = [
  {
    id: 't1',
    title: 'AT&C Loss Trend',
    valueText: '↓ −1.1pp',
    valueTone: 'jade',
    // Descending line = improving loss
    points: [22, 24, 27, 29, 31, 33, 35, 38],
    labels: ['21.6%', '21.4%', '21.3%', '21.1%', '20.9%', '20.8%', '20.6%', '20.5%'],
    finalTone: 'jade',
    color: '#EF4444',
    panelKey: 'atc',
  },
  {
    id: 't2',
    title: 'Peak Demand Trend',
    valueText: '↑ Seasonal',
    valueTone: 'amber',
    points: [42, 38, 40, 33, 28, 24, 20, 15],
    labels: ['17.6k', '17.8k', '17.9k', '18.0k', '18.1k', '18.2k', '18.3k', '18.4k'],
    finalTone: 'amber',
    color: '#D97706',
    panelKey: 'peak',
  },
  {
    id: 't3',
    title: 'Revenue Collection Trend',
    valueText: '↑ +1.6pp',
    valueTone: 'jade',
    points: [32, 29, 26, 23, 20, 17, 15, 12],
    labels: ['93.2%', '93.6%', '93.9%', '94.1%', '94.3%', '94.5%', '94.7%', '94.8%'],
    finalTone: 'jade',
    color: '#1B72E8',
    panelKey: 'revenue',
  },
]
