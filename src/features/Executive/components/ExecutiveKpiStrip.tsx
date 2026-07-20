import type { DetailPanelKey, ExecutiveKpi, KpiStatus } from '../types'

interface ExecutiveKpiStripProps {
  kpis: ExecutiveKpi[]
  onOpenPanel: (key: DetailPanelKey) => void
}

function statusColor(status: KpiStatus): string {
  switch (status) {
    case 'good': return 'var(--exec-jade)'
    case 'warn': return 'var(--exec-amber)'
    case 'bad':  return 'var(--exec-crimson)'
    default:     return 'var(--exec-brand)'
  }
}

function statusBorderColor(status: KpiStatus): string {
  switch (status) {
    case 'good': return 'var(--exec-jade-border)'
    case 'warn': return 'var(--exec-amber-border)'
    case 'bad':  return 'var(--exec-crimson-border)'
    default:     return 'var(--exec-border)'
  }
}

/**
 * KPI strip — 8 tiles.
 *   Desktop (>1400px): all 8 in one row (flex, 1 row).
 *   Laptop  (1024-1400px): 4-col grid, wraps to 2 rows.
 *   Tablet  (640-1024px):  3-col grid.
 *   Mobile  (<640px):      2-col grid.
 *   Tiny    (<380px):      1-col.
 * Each tile has left accent stripe, label, big value (Syne font), target/subtitle,
 * RAG emoji (absolute top-right), U/R breakdown chips.
 */
export function ExecutiveKpiStrip({ kpis, onOpenPanel }: ExecutiveKpiStripProps) {
  return (
    <div className="grid gap-[8px] mb-[14px] grid-cols-8 max-[1400px]:grid-cols-4 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-2 max-[380px]:grid-cols-1 max-[640px]:gap-[6px]">
      {kpis.map((k) => (
        <div
          key={k.id}
          className="relative overflow-hidden bg-[var(--exec-surface)] border-[1.5px] rounded-[10px] py-[10px] px-[14px] min-w-0 cursor-pointer transition-[all_0.18s] shadow-[var(--exec-shadow-xs)] hover:[transform:translateY(-2px)] hover:shadow-[var(--exec-shadow-md)] max-[1200px]:py-[9px] max-[1200px]:px-[12px] max-[640px]:py-[9px] max-[640px]:px-[10px] max-[480px]:py-[8px] max-[480px]:px-[9px]"
          style={{
            borderColor: 'var(--exec-border)',
            borderLeftColor: statusBorderColor(k.status),
            borderLeftWidth: '3px',
          }}
          onClick={() => onOpenPanel(k.panelKey)}
          role="button"
          tabIndex={0}
        >
          {/* Accent stripe (was .kpi-tile::before with width:5px override) */}
          <span
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-[5px]"
            style={{ background: statusColor(k.status) }}
          />
          <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)] tracking-[0.12em] uppercase mb-[4px] pr-[16px] break-words max-[480px]:text-[8.5px]">
            {k.label}
          </div>
          <div
            className="font-['Syne',_serif] text-[22px] font-bold tracking-[-0.02em] leading-none mb-[4px] break-words max-[1400px]:text-[20px] max-[640px]:text-[19px] max-[480px]:text-[17px]"
            style={{ color: statusColor(k.status) }}
          >
            {k.value}
          </div>
          <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink5)] break-words max-[480px]:text-[8.5px]">
            {k.unitOrTarget}
          </div>
          <div className="absolute top-[10px] right-[10px] text-[10px]">{k.ragEmoji}</div>
          <div className="flex gap-[5px] mt-[7px] font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] text-[var(--exec-ink4)] flex-wrap max-[480px]:text-[9px] max-[480px]:gap-[4px]">
            <span className="py-[2px] px-[7px] rounded-[4px] bg-[#E5E9EE] border border-[#CBD5E0] max-[480px]:px-[5px]">
              U<strong className="font-bold ml-[3px] text-[10px] font-['JetBrains_Mono',_ui-monospace,_monospace] max-[480px]:text-[9.5px]" style={{ color: statusColor(k.status) }}>{k.urban}</strong>
            </span>
            <span className="py-[2px] px-[7px] rounded-[4px] bg-[#E5E9EE] border border-[#CBD5E0] max-[480px]:px-[5px]">
              R<strong className="font-bold ml-[3px] text-[10px] font-['JetBrains_Mono',_ui-monospace,_monospace] max-[480px]:text-[9.5px]" style={{ color: statusColor(k.status) }}>{k.rural}</strong>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
