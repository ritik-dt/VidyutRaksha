import type { DetailPanelKey, PrepaidNonRechargeData } from '../types'

interface PrepaidNonRechargePanelProps {
  data: PrepaidNonRechargeData
  onOpenPanel: (key: DetailPanelKey) => void
}

/** 💳 Prepaid Non-Recharge Watch — total + trend + 4-row table + alert box. */
export function PrepaidNonRechargePanel({ data, onOpenPanel }: PrepaidNonRechargePanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        💳 Prepaid <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Non-Recharge</em> Watch
        <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.12em] py-[2px] px-[8px] rounded-[4px] bg-[var(--exec-brand-light)] text-[var(--exec-brand)]">RISK</span>
      </h3>

      <div className="flex items-baseline justify-between gap-[10px] mb-[8px] flex-wrap">
        <div>
          <div className="font-['Syne',_serif] text-[22px] font-bold text-[var(--exec-crimson)] max-[640px]:text-[20px] max-[480px]:text-[18px]">{data.totalText}</div>
          <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">{data.subtitle}</div>
        </div>
        <div className="text-right">
          <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] text-[var(--exec-crimson)] font-semibold">{data.trendPct}</div>
          <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">{data.vsText}</div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-[6px] px-[6px] max-[480px]:mx-0 max-[480px]:px-0">
        <table className="w-full border-collapse table-fixed min-w-[320px] [&_th]:font-['JetBrains_Mono',_ui-monospace,_monospace] [&_th]:text-[9px] [&_th]:tracking-[0.1em] [&_th]:uppercase [&_th]:text-[var(--exec-ink4)] [&_th]:py-[4px] [&_th]:px-[6px] [&_th]:border-b [&_th]:border-b-[var(--exec-border)] [&_th]:text-left [&_td]:py-[6px] [&_td]:px-[6px] [&_td]:border-b [&_td]:border-b-[var(--exec-border)] [&_td]:text-[11.5px] [&_td]:align-middle [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[var(--exec-surface2)]">
        <thead>
          <tr>
            <th>Bucket</th>
            <th>Consumers</th>
            <th className="w-[70px]">Share</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.buckets.map((b) => {
            const emphasisFirstCell = b.isEmphasis ? { color: 'var(--exec-crimson)', fontWeight: 600 } : undefined
            const subtleFirstCell = b.isSubtle ? { color: 'var(--exec-ink4)', fontSize: '10px' } : undefined
            const bucketFirstStyle = emphasisFirstCell || subtleFirstCell || { color: 'var(--exec-ink2)', fontWeight: 600 }
            const rowStyle = b.isSubtle ? { background: 'var(--exec-surface2)' } : undefined
            const trendColor = b.trend === 'worse' ? 'var(--exec-crimson)' : b.trend === 'better' ? 'var(--exec-jade)' : 'var(--exec-ink4)'
            return (
              <tr key={b.label} style={rowStyle}>
                <td style={bucketFirstStyle}>{b.label}</td>
                <td className="font-['JetBrains_Mono',_ui-monospace,_monospace] !text-[10.5px] font-semibold text-[var(--exec-crimson)]">{b.consumersText}</td>
                <td>
                  <div className="h-[5px] bg-[var(--exec-bg3)] rounded-[3px] overflow-hidden mb-[2px]">
                    <div className="h-full rounded-[3px] max-w-full bg-[linear-gradient(90deg,_var(--exec-crimson),_#F87171)]" style={{ width: `${b.sharePercent}%` }} />
                  </div>
                  <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] !text-[9px] text-[var(--exec-ink4)]">{b.sharePercent}%</div>
                </td>
                <td>
                  <span className="text-[9px] font-semibold" style={{ color: trendColor }}>{b.trendText}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>

      <div
        className="mt-[8px] py-[7px] px-[10px] bg-[var(--exec-crimson-bg)] border border-[var(--exec-crimson-border)] rounded-[7px] text-[10.5px] text-[var(--exec-crimson)] leading-[1.5] cursor-pointer hover:[filter:brightness(1.03)] hover:[transform:translateY(-1px)] max-[480px]:text-[10px]"
        onClick={() => onOpenPanel(data.alertPanelKey)}
        role="button"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: data.alertText }}
      />
    </section>
  )
}
