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

/**
 * ⏱ TIME MODE bar — Real-Time / Month-wise toggle + month chips + live-clock tag.
 * Faithful to prototype's .time-mode-bar.
 */
export function TimeModeBar({ mode, activeMonth, onSetRealtime, onSetMonthly }: TimeModeBarProps) {
  const now = useLiveClock()
  const isRealtime = mode === 'realtime'

  return (
    <div className="flex items-center gap-[10px] flex-wrap bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[10px] py-[7px] px-[14px] mb-[12px] shadow-[var(--exec-shadow-xs)] max-[640px]:gap-[8px] max-[640px]:py-[6px] max-[640px]:px-[10px]">
      <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] tracking-[0.14em] text-[var(--exec-ink4)] uppercase whitespace-nowrap pr-[10px] border-r border-r-[var(--exec-border2)] max-[480px]:text-[9px] max-[480px]:pr-[6px]">
        ⏱ TIME MODE
      </span>
      <div className="flex gap-[3px] flex-wrap">
        <button
          type="button"
          className={`inline-flex items-center gap-[5px] text-[12px] font-medium cursor-pointer py-[4px] px-[12px] rounded-[7px] border transition-[all_0.18s] select-none whitespace-nowrap max-[480px]:text-[11px] max-[480px]:px-[9px] ${
            isRealtime
              ? 'bg-[var(--exec-brand)] text-white border-[var(--exec-brand)] shadow-[0_2px_8px_rgba(27,114,232,0.25)]'
              : 'bg-transparent text-[var(--exec-ink3)] border-transparent hover:bg-[var(--exec-bg3)] hover:text-[var(--exec-ink)]'
          }`}
          onClick={onSetRealtime}
        >
          🔴 Real-Time
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-[5px] text-[12px] font-medium cursor-pointer py-[4px] px-[12px] rounded-[7px] border transition-[all_0.18s] select-none whitespace-nowrap max-[480px]:text-[11px] max-[480px]:px-[9px] ${
            !isRealtime
              ? 'bg-[var(--exec-brand)] text-white border-[var(--exec-brand)] shadow-[0_2px_8px_rgba(27,114,232,0.25)]'
              : 'bg-transparent text-[var(--exec-ink3)] border-transparent hover:bg-[var(--exec-bg3)] hover:text-[var(--exec-ink)]'
          }`}
          onClick={() => onSetMonthly(activeMonth ?? MONTHS[0])}
        >
          📅 Month-wise
        </button>
      </div>
      {!isRealtime && (
        <>
          <div className="w-px h-[20px] bg-[var(--exec-border2)] max-[640px]:hidden" />
          <div className="flex gap-[3px] flex-wrap max-[640px]:basis-full">
            {MONTHS.map((m) => (
              <button
                type="button"
                key={m}
                className={`font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] py-[3px] px-[9px] rounded-[5px] border cursor-pointer transition-[all_0.15s] whitespace-nowrap max-[480px]:text-[9px] max-[480px]:px-[7px] ${
                  activeMonth === m
                    ? 'bg-[var(--exec-brand-light)] text-[var(--exec-brand)] border-[rgba(27,114,232,0.25)] font-semibold'
                    : 'bg-transparent text-[var(--exec-ink4)] border-[var(--exec-border2)] hover:border-[var(--exec-brand)] hover:text-[var(--exec-brand)]'
                }`}
                onClick={() => onSetMonthly(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="ml-auto font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] text-[var(--exec-ink4)] whitespace-nowrap max-[640px]:ml-0 max-[640px]:basis-full max-[640px]:text-center max-[480px]:text-[9px]">
        {isRealtime
          ? `Live · ${formatClock(now)} · ${formatShortDate(now)}`
          : `Showing: ${activeMonth ?? MONTHS[0]} data`}
      </div>
    </div>
  )
}
