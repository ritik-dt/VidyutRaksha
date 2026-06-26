import { formatIndian } from '@/shared/utils/formatters'
import { fmtINR } from '@/features/Dashboard/adapter'
import type { CasesStats } from './types'

interface CasesKpiStripProps {
  stats: CasesStats
  activeFilter: string
  onChangeFilter: (filter: string) => void
}

type KpiItem = {
  label: string
  color: string
  filter: string
  value: (stats: CasesStats) => string
  sub: (stats: CasesStats) => string
  compact?: boolean
}

const KPI_ITEMS: KpiItem[] = [
  {
    label: 'Past SLA',
    color: 'var(--red)',
    filter: 'Past SLA',
    value: (stats: CasesStats) => formatIndian(stats.pastSla),
    sub: (stats: CasesStats) =>
      stats.active > 0 ? `${((stats.pastSla / stats.active) * 100).toFixed(1)}% of active` : 'no active cases',
  },
  {
    label: 'Open',
    color: '#0EA5E9',
    filter: 'Assigned',
    value: (stats: CasesStats) => formatIndian(stats.open),
    sub: () => 'awaiting inspection',
  },
  {
    label: 'In progress',
    color: 'var(--amber)',
    filter: 'In Progress',
    value: (stats: CasesStats) => formatIndian(stats.inProgress),
    sub: (stats: CasesStats) => `includes ${formatIndian(stats.escalated)} escalated`,
  },
  {
    label: 'Confirmed',
    color: 'var(--green)',
    filter: 'Confirmed Theft',
    value: (stats: CasesStats) => formatIndian(stats.confirmed),
    sub: () => 'cumulative this fiscal',
  },
  {
    label: 'Avg time-to-close',
    color: 'var(--navy-light)',
    filter: '',
    value: (stats: CasesStats) => `${stats.avgClose} d`,
    sub: (stats: CasesStats) => `target: 3.0 d ${stats.avgClose > 3 ? '⚠' : '✓'}`,
  },
  {
    label: 'Recovery',
    color: 'var(--ai-purple)',
    filter: '',
    value: (stats: CasesStats) => fmtINR(stats.recovery),
    sub: () => 'YTD · 62% realization',
    compact: true,
  },
]

export function CasesKpiStrip({ stats, activeFilter, onChangeFilter }: CasesKpiStripProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-3">
      {KPI_ITEMS.map((item) => {
        const isClickable = Boolean(item.filter)
        const isActive = activeFilter === item.filter

        return (
          <button
            key={item.label}
            type="button"
            onClick={isClickable ? () => onChangeFilter(item.filter) : undefined}
            className="relative min-w-[140px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:shadow-md disabled:cursor-default"
            disabled={!isClickable}
            style={{
              boxShadow: isClickable && isActive ? '0 0 0 1px rgba(14,165,233,0.14)' : undefined,
              opacity: isClickable ? 1 : 0.98,
            }}
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: item.color }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">
              {item.label}
            </div>
            <div
              className="font-mono font-extrabold"
              style={{
                color: item.color,
                fontSize: item.compact ? '18px' : '24px',
              }}
            >
              {item.value(stats)}
            </div>
            <div className="mt-0.5 text-[10px] text-text-mid">{item.sub(stats)}</div>
          </button>
        )
      })}
    </div>
  )
}
