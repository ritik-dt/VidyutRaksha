import { useMemo } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getDetectionTrendData } from '../data/meterChartData'

interface DetectionTrendChartProps {
  scopeName: string
  flagged?: number
  hitRate: number
  rising: boolean
}

// Marker colors keyed by series so the tooltip square always matches the line
// (an Area's payload color is its translucent fill, not the stroke).
const SERIES_COLORS: Record<string, string> = {
  newFlags: 'var(--ai-purple)',
  confirmed: 'var(--green)',
}

interface TrendTooltipEntry {
  name?: string
  value?: number
  dataKey?: string | number
}

/**
 * Custom tooltip matching the prototype's Chart.js default: dark rounded box,
 * white month title, one colored-square row per series with comma-formatted
 * values ("New flags: 1,234" / "Confirmed: 712").
 */
function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TrendTooltipEntry[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      className="rounded-md px-2.5 py-2 text-[11px] leading-tight shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
      style={{ background: 'rgba(0,0,0,0.8)', color: '#fff' }}
    >
      <div className="mb-1 font-semibold">{label}</div>
      {payload.map((entry) => {
        const key = String(entry.dataKey ?? entry.name ?? '')
        return (
          <div key={key} className="flex items-center gap-1.5 py-px">
            <span
              className="inline-block size-2.5 rounded-[2px]"
              style={{ background: SERIES_COLORS[key] ?? 'var(--text-dim)' }}
            />
            <span>
              {entry.name}:{' '}
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString('en-IN')
                : entry.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Matches prototype's "📈 Detection trend" card:
 * "New flags" is a filled purple area (Chart.js: fill:true, rgba(124,58,237,0.08)),
 * "Confirmed" is a dashed green line with no fill. Horizontal grid lines only
 * (rgba(0,0,0,0.05)), no vertical grid — same as the prototype's scales config.
 * Series is scaled off the scope's flagged count so it changes with hierarchy.
 */
export function DetectionTrendChart({ scopeName, flagged, hitRate, rising }: DetectionTrendChartProps) {
  const data = useMemo(() => getDetectionTrendData(flagged), [flagged])
  return (
    <div className="card mb-0">
      <div className="card-title mb-2 flex items-center justify-between">
        <span className="text-[14px] font-bold">📈 Detection trend · {scopeName}</span>
        <div className="flex gap-2 text-[10px] text-text-dim">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full" style={{ background: 'var(--ai-purple)' }} />
            New flags
          </span>
          <span className="ml-2 flex items-center gap-1">
            <span className="inline-block size-2 rounded-full" style={{ background: 'var(--green)' }} />
            Confirmed
          </span>
        </div>
      </div>

      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
            <Tooltip
              content={<TrendTooltip />}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="newFlags"
              name="New flags"
              stroke="var(--ai-purple)"
              strokeWidth={2.5}
              fill="rgba(124,58,237,0.08)"
              dot={{ r: 3, fill: 'var(--ai-purple)', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="confirmed"
              name="Confirmed"
              stroke="var(--green)"
              strokeWidth={2.5}
              strokeDasharray="4 3"
              dot={{ r: 3, fill: 'var(--green)', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-2 rounded-[7px] p-[9px_11px] text-[10.5px] leading-[1.5] text-text-mid"
        style={{ background: 'rgba(40,167,69,0.05)', borderLeft: '3px solid var(--green)' }}
      >
        <strong style={{ color: 'var(--green)' }}>📊 Trend:</strong> Flag rate is{' '}
        <strong>{rising ? 'rising 12% MoM' : 'stable'}</strong>. Confirmation rate held steady at{' '}
        <strong>{hitRate.toFixed(1)}%</strong>. The model continues to learn from inspector feedback — false
        positives down 9pp YoY.
      </div>
    </div>
  )
}
