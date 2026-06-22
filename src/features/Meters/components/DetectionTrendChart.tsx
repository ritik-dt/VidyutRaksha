import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { DETECTION_TREND_DATA } from '../data/meterChartData'

interface DetectionTrendChartProps {
  scopeName: string
  hitRate: number
  rising: boolean
}

/**
 * Matches prototype's "📈 Detection trend" card:
 * line chart with New flags (purple) + Confirmed (green dashed), legend dots in header.
 */
export function DetectionTrendChart({ scopeName, hitRate, rising }: DetectionTrendChartProps) {
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
          <LineChart data={DETECTION_TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="newFlags" stroke="var(--ai-purple)" strokeWidth={2} dot={{ r: 3 }} name="New flags" />
            <Line type="monotone" dataKey="confirmed" stroke="var(--green)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Confirmed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-2 rounded-[7px] p-[9px_11px] text-[10.5px] leading-[1.5] text-text-mid"
        style={{ background: 'rgba(40,167,69,0.05)', borderLeft: '3px solid var(--green)' }}
      >
        <strong style={{ color: 'var(--green)' }}>📊 Trend:</strong> Flag rate is{' '}
        <strong>{rising ? 'rising 12% MoM' : 'stable'}</strong>. Confirmation rate held steady at{' '}
        <strong>{hitRate}%</strong>. The model continues to learn from inspector feedback — false
        positives down 9pp YoY.
      </div>
    </div>
  )
}
