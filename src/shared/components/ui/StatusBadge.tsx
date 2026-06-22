import { cn } from './cn'

export type MeterStatus = 'New' | 'Assigned' | 'Inspected' | 'Confirmed Theft' | 'False Positive' | 'Escalated' | 'In Progress' | 'Closed'

interface StatusBadgeProps {
  status: string
  className?: string
}

const STATUS_MAP: Record<string, { bg: string; color: string; border: string }> = {
  'New':             { bg: 'rgba(27,114,232,0.1)',   color: '#1b72e8',    border: 'rgba(27,114,232,0.25)' },
  'Assigned':        { bg: 'rgba(245,158,11,0.1)',   color: '#d97706',    border: 'rgba(245,158,11,0.3)' },
  'In Progress':     { bg: 'rgba(245,158,11,0.1)',   color: '#d97706',    border: 'rgba(245,158,11,0.3)' },
  'Inspected':       { bg: 'rgba(245,158,11,0.1)',   color: '#d97706',    border: 'rgba(245,158,11,0.3)' },
  'Confirmed Theft': { bg: 'rgba(239,68,68,0.1)',    color: '#ef4444',    border: 'rgba(239,68,68,0.3)' },
  'False Positive':  { bg: 'rgba(107,114,128,0.1)', color: '#6b7280',    border: 'rgba(107,114,128,0.3)' },
  'Escalated':       { bg: 'rgba(239,68,68,0.1)',    color: '#ef4444',    border: 'rgba(239,68,68,0.3)' },
  'Closed':          { bg: 'rgba(34,197,94,0.1)',    color: '#22c55e',    border: 'rgba(34,197,94,0.3)' },
  'Past SLA':        { bg: 'rgba(239,68,68,0.1)',    color: '#ef4444',    border: 'rgba(239,68,68,0.3)' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = STATUS_MAP[status] ?? { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', border: 'rgba(107,114,128,0.25)' }
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-[10px] border px-2 py-[3px] text-[10px] font-semibold',
        className,
      )}
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {status}
    </span>
  )
}

export function getRiskColor(risk: number): string {
  return risk >= 80 ? 'var(--red)' : risk >= 60 ? 'var(--amber)' : 'var(--green)'
}

export function RiskBadge({ risk, conf }: { risk: number; conf?: number }) {
  const color = getRiskColor(risk)
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex size-[34px] shrink-0 items-center justify-center rounded-lg border-2 font-mono text-[11px] font-extrabold"
        style={{ background: `${color}18`, borderColor: color, color }}
      >
        {risk}
      </div>
      {conf != null && (
        <div className="text-[9.5px] text-text-dim">
          {conf}%<br />conf
        </div>
      )}
    </div>
  )
}
