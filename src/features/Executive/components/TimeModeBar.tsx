import { formatClock, formatShortDate } from '../logic/formatting'
import { useLiveClock } from '../hooks/useLiveClock'
import type { TimeMode } from '../types'

interface TimeModeBarProps {
  mode: TimeMode['mode']
  activeMonth?: string
  onSetRealtime: () => void
  onSetMonthly: (month?: string) => void
}

const MONTHS = ["Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26", "Apr'26"] as const

export function TimeModeBar({ mode, activeMonth, onSetRealtime, onSetMonthly }: TimeModeBarProps) {
  const now = useLiveClock()
  const isRealtime = mode === 'realtime'

  return (
    <div className="exec-time-mode-bar">
      <span className="exec-time-mode-label">⏱ TIME MODE</span>
      <div className="exec-time-mode-opts">
        <button
          type="button"
          className={`exec-time-mode-opt${isRealtime ? ' exec-active' : ''}`}
          onClick={onSetRealtime}
        >
          🔴 Real-Time
        </button>
        <button
          type="button"
          className={`exec-time-mode-opt${!isRealtime ? ' exec-active' : ''}`}
          onClick={() => onSetMonthly(activeMonth ?? MONTHS[0])}
        >
          📅 Month-wise
        </button>
      </div>
      {!isRealtime && (
        <div className="exec-time-mode-months">
          {MONTHS.map((m) => (
            <button
              type="button"
              key={m}
              className={`exec-month-chip${activeMonth === m ? ' exec-active' : ''}`}
              onClick={() => onSetMonthly(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}
      <div className="exec-time-mode-tag">
        {isRealtime
          ? `Live · ${formatClock(now)} · ${formatShortDate(now)}`
          : `Showing: ${activeMonth ?? MONTHS[0]} data`}
      </div>
    </div>
  )
}
