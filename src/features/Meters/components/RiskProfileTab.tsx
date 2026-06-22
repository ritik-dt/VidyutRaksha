import type { SuspMeter } from '@/features/Meters/data/meters'
import { getRiskTrendData, getRiskDriversData, getConsumerTimeline } from '../data/meterChartData'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts'

interface RiskProfileTabProps {
  meter: SuspMeter
}

const DRIVER_COLORS = ['var(--red)', 'var(--amber)', '#10B981', '#7C3AED', '#0EA5E9', '#6B7280']

export function RiskProfileTab({ meter }: RiskProfileTabProps) {
  const trendData = getRiskTrendData(meter.id)
  const driversData = getRiskDriversData(meter.id)
  const timeline = getConsumerTimeline()

  return (
    <div>
      {/* Risk trend + Drivers */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-title mb-1 text-[13px] font-bold">Risk score — 12 month trend</div>
          <div className="mb-3 text-[10.5px] text-text-dim">
            Risk score over last 12 months — pattern started around Nov'25
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <Tooltip />
              <ReferenceLine y={70} stroke="rgba(124,58,237,0.4)" strokeDasharray="5 3"
                label={{ value: 'Risk threshold', position: 'insideLeft', fontSize: 9, fill: 'var(--ai-purple)' }} />
              <Line type="monotone" dataKey="risk" stroke="var(--red)" strokeWidth={2.5}
                dot={{ r: 3, fill: 'var(--red)' }} name="Risk score" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 rounded-lg p-2.5 text-[11px]"
            style={{ background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.15)' }}>
            <strong style={{ color: 'var(--red)' }}>✦ AI: </strong>
            Risk score jumped from <strong>22 to 78 between Oct–Nov 2025</strong> — a 3-month ramp
            that strongly suggests theft was installed around that time. Before Oct, this meter had been
            stable at low risk for 18+ months.
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-1 text-[13px] font-bold">Risk drivers — rule breakdown</div>
          <div className="mb-3 text-[10.5px] text-text-dim">
            What's contributing to the risk score — rule-wise breakdown
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={driversData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 45]} unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis type="category" dataKey="signal" tick={{ fontSize: 10, fill: 'var(--text-mid)' }} width={140} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="pct" radius={[0, 3, 3, 0]}>
                {driversData.map((_, i) => (
                  <Cell key={i} fill={DRIVER_COLORS[i % DRIVER_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 rounded-lg p-2.5 text-[11px]"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <strong style={{ color: 'var(--ai-purple)' }}>✦ AI: </strong>
            The biggest driver ({driversData[0].pct}%) is the{' '}
            <strong>{driversData[0].signal}</strong>. {driversData[1].signal} ({driversData[1].pct}%)
            and {driversData[2].signal} ({driversData[2].pct}%) corroborate the signal.
          </div>
        </div>
      </div>

      {/* Consumer timeline */}
      <div className="card">
        <div className="card-title mb-4 text-[13px] font-bold">
          Consumer timeline — all events in chronological order
        </div>
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {timeline.map((evt, i) => (
              <div key={i} className="relative flex items-start gap-4 pl-10">
                <div
                  className="absolute left-0 flex size-10 items-center justify-center rounded-full border-2 border-white bg-card shadow-sm"
                  style={{ background: `${evt.color}20`, borderColor: evt.color }}
                >
                  <div className="size-2.5 rounded-full" style={{ background: evt.color }} />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-bold text-text">{evt.label}</span>
                    <span className="shrink-0 text-[10.5px] text-text-dim">{evt.date}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-mid">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
