import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { THEFT_SIGNATURE_DATA } from '../data/meterChartData'

interface TheftSignaturesChartProps {
  scopeName: string
}

/**
 * Matches prototype's "🔍 Theft signatures" card:
 * donut chart (200px height canvas) + legend + AI insight strip.
 */
export function TheftSignaturesChart({ scopeName }: TheftSignaturesChartProps) {
  return (
    <div className="card mb-0">
      <div className="card-title mb-2 flex items-center justify-between">
        <span className="text-[14px] font-bold">🔍 Theft signatures · {scopeName}</span>
        <span className="text-[10.5px] text-text-dim">last 30 days</span>
      </div>

      <div className="relative flex h-[200px] items-center justify-center gap-3">
        <PieChart width={170} height={190}>
          <Pie
            data={THEFT_SIGNATURE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={78}
            paddingAngle={1}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {THEFT_SIGNATURE_DATA.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} />
        </PieChart>

        <div className="flex flex-col gap-1.5">
          {THEFT_SIGNATURE_DATA.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
              <span className="inline-block size-2.5 shrink-0 rounded-sm" style={{ background: d.color }} />
              <span className="text-text-mid">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-2 rounded-[7px] p-[9px_11px] text-[10.5px] leading-[1.5] text-text-mid"
        style={{ background: 'rgba(124,58,237,0.04)', borderLeft: '3px solid var(--ai-purple)' }}
      >
        <strong style={{ color: 'var(--ai-purple)' }}>✦ AI insight:</strong> Earth Loading dominates this
        scope (38% of flags) — points to physical bypass on industrial/commercial connections. Recommend
        prioritizing CT clamp inspections.
      </div>
    </div>
  )
}
