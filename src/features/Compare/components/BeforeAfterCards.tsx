import { AFTER_METRICS, BEFORE_METRICS } from '../data/baData'

/**
 * Two side-by-side metric cards — Before (red-tinted) and After (green-tinted).
 * Direct port from the prototype's `grid-2` layout under the Before/After tab.
 */
export function BeforeAfterCards() {
  return (
    <div className="grid-2 mb-3.5 gap-3.5">
      <div className="min-w-0">
        <MetricCard
          heading="Before (Pre-May 2025)"
          headingColor="var(--red)"
          background="var(--red-light)"
          borderColor="var(--red)"
          metrics={BEFORE_METRICS}
          valueColor="var(--red)"
        />
      </div>
      <div className="min-w-0">
        <MetricCard
          heading="After (Post-May 2025)"
          headingColor="var(--green)"
          background="rgba(40,167,69,.08)"
          borderColor="var(--green)"
          metrics={AFTER_METRICS}
          valueColor="var(--green)"
        />
      </div>
    </div>
  )
}

interface MetricCardProps {
  heading: string
  headingColor: string
  background: string
  borderColor: string
  metrics: Array<{ label: string; value: string }>
  valueColor: string
}

function MetricCard({
  heading,
  headingColor,
  background,
  borderColor,
  metrics,
  valueColor,
}: MetricCardProps) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background,
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      <div
        className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: headingColor }}
      >
        {heading}
      </div>
      <div className="text-[13px]" style={{ lineHeight: 2.2 }}>
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="flex justify-between"
            style={{
              borderBottom: i < metrics.length - 1 ? '1px solid rgba(0,0,0,.05)' : undefined,
              paddingBottom: i < metrics.length - 1 ? 4 : 0,
            }}
          >
            <span>{m.label}</span>
            <strong style={{ color: valueColor }}>{m.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
