import { useMemo, useState, Fragment } from 'react'
import { PieChart, Pie, Cell, Tooltip, Sector } from 'recharts'
import { getTheftSignatureData, getTheftSignatureInsight } from '../data/meterChartData'

interface TheftSignaturesChartProps {
  scopeId: string
  scopeName: string
}

/** Renders **bold** markdown-style segments as <strong>, plain text otherwise. */
function renderBold(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>
  )
}

/** Pops the hovered slice outward by 6px, matching the prototype's Chart.js hoverOffset: 6. */
function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

/**
 * Matches prototype's "🔍 Theft signatures" card:
 * donut chart + legend + AI insight strip. Data is deterministically seeded
 * by scopeId (same algorithm as the original HTML prototype). Also replicates
 * Chart.js's default doughnut legend behaviors which the prototype relied on:
 *  - clicking a legend item hides that slice (donut redistributes) + strikes
 *    the legend label through
 *  - hovering a slice "pops" it outward by 6px, reverting on mouse-leave
 */
export function TheftSignaturesChart({ scopeId, scopeName }: TheftSignaturesChartProps) {
  const data = useMemo(() => getTheftSignatureData(scopeId), [scopeId])
  const insight = useMemo(() => getTheftSignatureInsight(data), [data])

  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const visibleData = useMemo(() => data.filter((d) => !hidden.has(d.name)), [data, hidden])

  function toggleHidden(name: string) {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
    setActiveIndex(undefined)
  }

  return (
    <div className="card mb-0">
      <div className="card-title mb-2 flex items-center justify-between">
        <span className="text-[14px] font-bold">🔍 Theft signatures · {scopeName}</span>
        <span className="text-[10.5px] text-text-dim">last 30 days</span>
      </div>

      <div className="relative flex h-[200px] items-center justify-center gap-3">
        <PieChart width={170} height={190}>
          <Pie
            data={visibleData}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={78}
            paddingAngle={1}
            dataKey="value"
            nameKey="name"
            stroke="none"
            isAnimationActive={false}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {visibleData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} />
        </PieChart>

        <div className="flex flex-col gap-1.5">
          {data.map((d) => {
            const isHidden = hidden.has(d.name)
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => toggleHidden(d.name)}
                className="flex items-center gap-1.5 text-[11px] transition-opacity"
                style={{ opacity: isHidden ? 0.45 : 1, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <span className="inline-block size-2.5 shrink-0 rounded-sm" style={{ background: d.color }} />
                <span className="text-text-mid" style={{ textDecoration: isHidden ? 'line-through' : 'none' }}>
                  {d.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="mt-2 rounded-[7px] p-[9px_11px] text-[10.5px] leading-[1.5] text-text-mid"
        style={{ background: 'rgba(124,58,237,0.04)', borderLeft: '3px solid var(--ai-purple)' }}
      >
        <strong style={{ color: 'var(--ai-purple)' }}>✦ AI insight:</strong> {renderBold(insight)}
      </div>
    </div>
  )
}
