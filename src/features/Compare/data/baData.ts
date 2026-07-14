/** May 2025 deployment marker index in the 27-month series. */
export const DEPLOY_INDEX = 16

/** Before/After chart — 27 monthly AT&C loss % values (Jan 2024 → Mar 2026). */
export const BA_CHART = {
  labels: [
    'Jan24', 'Feb', 'Mar', 'Apr', 'May24', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'Jan25', 'Feb', 'Mar', 'Apr', '★ May25', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'Jan26', 'Feb', 'Mar',
  ],
  values: [
    25.2, 25.1, 24.9, 24.8, 24.8, 24.7, 24.5, 24.3, 24.1, 23.8, 23.6, 23.4,
    23.2, 23.0, 22.8, 22.6, 22.5, 22.1, 21.8, 21.5, 21.2, 21.0, 20.8, 20.6,
    20.5, 20.4, 20.5,
  ],
}

/** Before card metrics (pre-May 2025). */
export const BEFORE_METRICS: Array<{ label: string; value: string }> = [
  { label: 'AT&C loss',        value: '24.8%'          },
  { label: 'Hit rate',         value: '~28%'           },
  { label: 'Time-to-detect',   value: '60 days'        },
  { label: 'Monthly recovery', value: '~76,600 kWh'    },
  { label: 'Inspections',      value: 'Manual, tip-based' },
  { label: 'False positives',  value: '~70%'           },
]

/** After card metrics (post-May 2025). */
export const AFTER_METRICS: Array<{ label: string; value: string }> = [
  { label: 'AT&C loss',        value: '20.5% ↓ 4.3pp'         },
  { label: 'Hit rate',         value: '57% ↑ 2.0x'            },
  { label: 'Time-to-detect',   value: '4 hours ↓ 360x'        },
  { label: 'Monthly recovery', value: '~1,51,600 kWh ↑ 2x'    },
  { label: 'Inspections',      value: 'AI-guided, data-driven' },
  { label: 'False positives',  value: '~43% ↓ 27pp'           },
]

/** ROI stat row at the bottom of the tab (5 metrics). */
export const ROI_STATS: Array<{ label: string; value: string; color: string }> = [
  { label: 'Platform cost (annual)', value: '₹18L',      color: 'var(--text-dim)' },
  { label: 'Revenue recovered',      value: '₹1.42 Cr',  color: 'var(--green)' },
  { label: 'Net benefit',            value: '₹1.32 Cr',  color: 'var(--green)' },
  { label: 'ROI',                    value: '7.9x',      color: 'var(--ai-purple)' },
  { label: 'Payback period',         value: '< 1 month', color: 'var(--teal, #17a2b8)' },
]
