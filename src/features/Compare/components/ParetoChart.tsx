import type { ParetoEnriched } from '../data/paretoData'

const W = 760
const H = 320
const PAD = { top: 30, right: 60, bottom: 90, left: 56 }
const INNER_W = W - PAD.left - PAD.right
const INNER_H = H - PAD.top - PAD.bottom
const MAX_Y_LEFT = 25   // share %
const MAX_Y_RIGHT = 100 // cumulative %

interface ParetoChartProps {
  enriched: ParetoEnriched[]
  vitalCount: number
  vitalShare: number
}

/**
 * Pareto SVG chart — direct port of prototype's SVG generator.
 * Left Y-axis: share % (0-25% in 5% steps).
 * Right Y-axis: cumulative % (0-100% in 25% steps, ai-purple).
 * 80% dashed threshold line (ai-purple).
 * Bars sorted by share desc: first 3 red, next 3 amber (vital few), rest dim.
 * Cumulative polyline in ai-purple with white-stroked circles.
 * Red-tinted vital-few zone with header text.
 */
export function ParetoChart({ enriched, vitalCount, vitalShare }: ParetoChartProps) {
  const barWidth = (INNER_W / enriched.length) * 0.7
  const barStep = INNER_W / enriched.length

  const yGridLeft: React.ReactElement[] = []
  for (let v = 0; v <= MAX_Y_LEFT; v += 5) {
    const y = PAD.top + INNER_H * (1 - v / MAX_Y_LEFT)
    yGridLeft.push(
      <g key={`gl${v}`}>
        <line
          x1={PAD.left}
          y1={y}
          x2={W - PAD.right}
          y2={y}
          stroke="var(--border-light)"
          strokeWidth={1}
          strokeDasharray="2,3"
        />
        <text
          x={PAD.left - 6}
          y={y + 3}
          textAnchor="end"
          fontSize={10}
          fontFamily="ui-monospace,monospace"
          fill="var(--text-dim)"
        >
          {v}%
        </text>
      </g>,
    )
  }

  const yGridRight: React.ReactElement[] = []
  for (let v = 0; v <= MAX_Y_RIGHT; v += 25) {
    const y = PAD.top + INNER_H * (1 - v / MAX_Y_RIGHT)
    yGridRight.push(
      <text
        key={`gr${v}`}
        x={W - PAD.right + 8}
        y={y + 3}
        fontSize={10}
        fontFamily="ui-monospace,monospace"
        fill="var(--ai-purple)"
      >
        {v}%
      </text>,
    )
  }

  const y80 = PAD.top + INNER_H * (1 - 80 / MAX_Y_RIGHT)

  const bars = enriched.map((item, i) => {
    const x = PAD.left + barStep * i + barStep * 0.15
    const barH = INNER_H * (item.share / MAX_Y_LEFT)
    const y = PAD.top + INNER_H - barH
    const isVital = item.isVital
    const barColor = isVital ? (i < 3 ? '#DC3545' : '#E6921E') : 'var(--text-dim)'
    const labelX = x + barWidth / 2
    const labelY = PAD.top + INNER_H + 14
    const shortName = item.name.length > 14 ? item.name.substring(0, 13) + '…' : item.name

    return (
      <g key={item.name}>
        <rect
          x={x}
          y={y}
          width={barWidth}
          height={barH}
          fill={barColor}
          rx={2}
          opacity={isVital ? 0.92 : 0.5}
        />
        {item.share > 1.5 && (
          <text
            x={x + barWidth / 2}
            y={y - 4}
            textAnchor="middle"
            fontSize={9.5}
            fontWeight={700}
            fill={barColor}
          >
            {item.share.toFixed(1)}%
          </text>
        )}
        <text
          x={labelX}
          y={labelY}
          textAnchor="end"
          fontSize={9.5}
          fill="var(--text)"
          transform={`rotate(-35 ${labelX} ${labelY})`}
          fontWeight={isVital ? 600 : 400}
        >
          {shortName}
        </text>
      </g>
    )
  })

  const linePoints = enriched
    .map((item, i) => {
      const x = PAD.left + barStep * i + barStep * 0.5
      const y = PAD.top + INNER_H * (1 - item.cumulative / MAX_Y_RIGHT)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const linePoints_circles = enriched.map((item, i) => {
    const x = PAD.left + barStep * i + barStep * 0.5
    const y = PAD.top + INNER_H * (1 - item.cumulative / MAX_Y_RIGHT)
    return (
      <circle
        key={`c${item.name}`}
        cx={x}
        cy={y}
        r={3.5}
        fill="var(--ai-purple)"
        stroke="#fff"
        strokeWidth={1.5}
      />
    )
  })

  const vitalEndX = PAD.left + barStep * vitalCount

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        maxWidth: W,
        height: H,
        background: 'linear-gradient(180deg,#fff 0%,var(--bg) 100%)',
        borderRadius: 8,
        border: '1px solid var(--border-light)',
      }}
    >
      {yGridLeft}
      {yGridRight}

      {/* 80% reference line */}
      <line
        x1={PAD.left}
        y1={y80}
        x2={W - PAD.right}
        y2={y80}
        stroke="var(--ai-purple)"
        strokeWidth={1.2}
        strokeDasharray="6,4"
        opacity={0.6}
      />
      <text
        x={W - PAD.right - 3}
        y={y80 - 4}
        textAnchor="end"
        fontSize={9.5}
        fontWeight={700}
        fill="var(--ai-purple)"
      >
        80% threshold
      </text>

      {/* Bars */}
      {bars}

      {/* Cumulative line + circles */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="var(--ai-purple)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {linePoints_circles}

      {/* Vital-few highlight zone */}
      <rect
        x={PAD.left}
        y={PAD.top}
        width={vitalEndX - PAD.left}
        height={INNER_H}
        fill="rgba(220,53,69,0.04)"
        pointerEvents="none"
      />
      <text
        x={PAD.left + (vitalEndX - PAD.left) / 2}
        y={PAD.top + 12}
        textAnchor="middle"
        fontSize={10.5}
        fontWeight={700}
        fill="var(--red)"
      >
        VITAL FEW · {vitalCount} DTRs · {vitalShare.toFixed(1)}% of loss
      </text>

      {/* Legend */}
      <rect x={PAD.left} y={H - 15} width={10} height={10} fill="#DC3545" />
      <text x={PAD.left + 14} y={H - 7} fontSize={10} fill="var(--text)">
        Vital few (top)
      </text>
      <rect
        x={PAD.left + 110}
        y={H - 15}
        width={10}
        height={10}
        fill="var(--text-dim)"
        opacity={0.5}
      />
      <text x={PAD.left + 124} y={H - 7} fontSize={10} fill="var(--text)">
        Trivial many
      </text>
      <line
        x1={PAD.left + 220}
        y1={H - 10}
        x2={PAD.left + 240}
        y2={H - 10}
        stroke="var(--ai-purple)"
        strokeWidth={2.5}
      />
      <text x={PAD.left + 244} y={H - 7} fontSize={10} fill="var(--text)">
        Cumulative %
      </text>
    </svg>
  )
}
