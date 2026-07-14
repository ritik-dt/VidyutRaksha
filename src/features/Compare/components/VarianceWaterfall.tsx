import { VARIANCE_WATERFALL } from '../data/peerData'
import type { WaterfallComponent } from '../types'

const W = 720
const H = 280
const PAD = { top: 30, right: 20, bottom: 60, left: 50 }
const INNER_W = W - PAD.left - PAD.right
const INNER_H = H - PAD.top - PAD.bottom
const MIN_Y = 16
const MAX_Y = 26

/** Map a % value to a Y pixel within the chart. */
function yScale(v: number): number {
  return PAD.top + INNER_H * (1 - (v - MIN_Y) / (MAX_Y - MIN_Y))
}

interface BarPart {
  x: number
  y: number
  height: number
  color: string
  labelValue: string
  labelColor: string
  connector?: { x1: number; x2: number; y: number }
  detail?: string
  centerX: number
  labelText: { line1: string; line2: string }
}

/** Compute all bar geometry in a single walk-through — matches prototype's SVG code. */
function computeParts(): BarPart[] {
  const barW = (INNER_W / VARIANCE_WATERFALL.length) * 0.62
  const xStep = INNER_W / VARIANCE_WATERFALL.length
  const yBase = PAD.top + INNER_H

  let runningValue = 0
  let runningTop = 0
  const parts: BarPart[] = []

  VARIANCE_WATERFALL.forEach((c, i) => {
    const cx = PAD.left + xStep * i + xStep * 0.19
    const words = c.label.split(' ')
    const mid = Math.ceil(words.length / 2)
    const labelText = {
      line1: words.slice(0, mid).join(' '),
      line2: words.slice(mid).join(' '),
    }

    if (c.type === 'start') {
      const barTop = yScale(c.value!)
      parts.push({
        x: cx,
        y: barTop,
        height: yBase - barTop,
        color: c.color,
        labelValue: `${c.value}%`,
        labelColor: c.color,
        centerX: cx + barW / 2,
        labelText,
        detail: c.detail,
      })
      runningValue = c.value!
      runningTop = barTop
    } else if (c.type === 'add') {
      const newVal = runningValue + c.delta!
      const newTop = yScale(newVal)
      const yA = Math.min(runningTop, newTop)
      const yB = Math.max(runningTop, newTop)
      const prevCx = PAD.left + xStep * (i - 1) + xStep * 0.19 + barW
      const deltaTxt = (c.delta! > 0 ? '+' : '') + c.delta!.toFixed(1) + 'pp'
      parts.push({
        x: cx,
        y: yA,
        height: Math.max(2, yB - yA),
        color: c.color,
        labelValue: deltaTxt,
        labelColor: c.color,
        connector: { x1: prevCx, x2: cx, y: runningTop },
        centerX: cx + barW / 2,
        labelText,
        detail: c.detail,
      })
      runningValue = newVal
      runningTop = newTop
    } else {
      // end
      const barTop = yScale(c.value!)
      const prevCx = PAD.left + xStep * (i - 1) + xStep * 0.19 + barW
      parts.push({
        x: cx,
        y: barTop,
        height: yBase - barTop,
        color: c.color,
        labelValue: `${c.value}%`,
        labelColor: c.color,
        connector: { x1: prevCx, x2: cx, y: runningTop },
        centerX: cx + barW / 2,
        labelText,
        detail: c.detail,
      })
    }
  })

  return parts.map((p) => ({ ...p, x: p.x, height: p.height, barW } as unknown as BarPart))
}

// helper: expose barW for the JSX rects
const BAR_W = (INNER_W / VARIANCE_WATERFALL.length) * 0.62

/** SVG waterfall — port of the prototype's renderVarianceWaterfall (screenshot 3). */
export function VarianceWaterfall() {
  const parts = computeParts()

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg border"
      style={{
        width: '100%',
        maxWidth: W,
        height: H,
        background: 'linear-gradient(180deg,#fff 0%,var(--bg) 100%)',
        borderColor: 'var(--border-light)',
      }}
    >
      {/* Y grid + labels */}
      {(function () {
        const lines: React.ReactElement[] = []
        for (let v = MIN_Y; v <= MAX_Y; v += 2) {
          const y = yScale(v)
          lines.push(
            <line
              key={`g${v}`}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="var(--border-light)"
              strokeWidth={1}
              strokeDasharray="2,3"
            />,
          )
          lines.push(
            <text
              key={`t${v}`}
              x={PAD.left - 6}
              y={y + 3}
              textAnchor="end"
              fontSize={10}
              fontFamily="ui-monospace,monospace"
              fill="var(--text-dim)"
            >
              {v}%
            </text>,
          )
        }
        return lines
      })()}

      {/* Bars + connectors + labels */}
      {parts.map((p, i) => {
        const cItem = VARIANCE_WATERFALL[i]
        const yLabel = PAD.top + INNER_H + 18
        return (
          <g key={i}>
            {p.connector && (
              <line
                x1={p.connector.x1}
                y1={p.connector.y}
                x2={p.connector.x2}
                y2={p.connector.y}
                stroke="var(--text-dim)"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            )}
            <rect
              x={p.x}
              y={p.y}
              width={BAR_W}
              height={p.height}
              fill={p.color}
              rx={2}
              opacity={cItem.type === 'add' ? 0.95 : 0.9}
            />
            <text
              x={p.centerX}
              y={p.y - 8}
              textAnchor="middle"
              fontSize={cItem.type === 'add' ? 11 : 12}
              fontWeight={700}
              fill={p.labelColor}
            >
              {p.labelValue}
            </text>
            <text
              x={p.centerX}
              y={yLabel}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="var(--text)"
            >
              {p.labelText.line1}
            </text>
            {p.labelText.line2 && (
              <text
                x={p.centerX}
                y={yLabel + 12}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="var(--text)"
              >
                {p.labelText.line2}
              </text>
            )}
            {p.detail && (
              <text
                x={p.centerX}
                y={yLabel + 25}
                textAnchor="middle"
                fontSize={8.5}
                fill="var(--text-dim)"
              >
                {p.detail.length > 50 ? p.detail.slice(0, 50) + '…' : p.detail}
              </text>
            )}
          </g>
        )
      })}

      {/* Title (top center) */}
      <text
        x={W / 2}
        y={PAD.top - 10}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="var(--text-dim)"
      >
        AT&amp;C loss decomposition · 18.2% → 24.8% · gap = 6.6pp
      </text>
    </svg>
  )
}

/** Named export for the waterfall's raw data (used in captions). */
export { VARIANCE_WATERFALL }
export type { WaterfallComponent }
