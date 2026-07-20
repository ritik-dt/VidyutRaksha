import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/shared/context/ToastContext'
import type { DT } from '../types'
import { getDtConsumers, type DtConsumer } from '../logic/dtConsumerGen'

interface DtConsumerSectionProps {
  dt: DT
  onDrillConsumer: () => void
}

type Mode = 'top' | 'all'

/** Tariff pill colors — was `.consumer-tariff.t-lt1/t-lt2/t-lt6`. */
const tariffPillStyle = (
  t: DtConsumer['tariff'],
): { bg: string; color: string } => {
  if (t === 'LT-1')
    return { bg: 'rgba(40,167,69,0.12)', color: 'var(--green)' }
  if (t === 'LT-2')
    return { bg: 'rgba(23,162,184,0.12)', color: 'var(--teal, #17a2b8)' }
  return { bg: 'rgba(124,58,237,0.12)', color: 'var(--ai-purple)' }
}

/**
 * Consumer section shown inside the DT detail modal — matches prototype's
 * renderDtConsumerSection. Two modes: `top` (top 15 by load) and `all`
 * (all with search + anomaly filter).
 *
 * Mobile layout (≤480px) restructures the 7-column desktop grid
 * `[14px 1fr 56px 60px 60px 90px 24px]` into a 3-row 4-column grid:
 *   Row 1: [dot | name+id | tariff | ⚠]
 *   Row 2: [.  | avg kW              | peak kW             ]  (with "avg "/"peak " prefixes)
 *   Row 3: [.  | share bar (full width)                     ]
 * Header row is hidden on ≤480 (replaced by inline "avg "/"peak " labels).
 */
export function DtConsumerSection({
  dt,
  onDrillConsumer,
}: DtConsumerSectionProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('top')
  const [search, setSearch] = useState('')
  const [anomalyOnly, setAnomalyOnly] = useState(false)

  const cdata = useMemo(() => getDtConsumers(dt, mode), [dt, mode])
  const allConsumers = cdata.consumers

  const visible = useMemo(() => {
    let list = allConsumers
    const s = search.trim().toLowerCase()
    if (s) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.id.toLowerCase().includes(s) ||
          c.tariff.toLowerCase().includes(s),
      )
    }
    if (anomalyOnly) list = list.filter((c) => c.anomaly)
    return list
  }, [allConsumers, search, anomalyOnly])

  const totalAnomalies = allConsumers.filter((c) => c.anomaly).length
  const visibleAnomalies = visible.filter((c) => c.anomaly).length
  const subText =
    mode === 'top'
      ? `Top 15 of ${dt.consumers} · sorted by load contribution`
      : `All ${dt.consumers} consumers under this DT · sorted by load contribution`

  const switchToAll = () => {
    setMode('all')
    setSearch('')
    setAnomalyOnly(false)
  }
  const switchToTop = () => {
    setMode('top')
    setSearch('')
    setAnomalyOnly(false)
  }

  const drillIntoConsumer = (c: DtConsumer) => {
    onDrillConsumer()
    setTimeout(
      () =>
        navigate(
          `/consumers/${encodeURIComponent(c.id)}?name=${encodeURIComponent(c.name)}`,
        ),
      60,
    )
  }

  // Grid template — used at 2 spots (header + row).
  const desktopGridCols = '14px 1fr 56px 60px 60px 90px 24px'

  return (
    <div className="mt-[18px] pt-[14px] border-t border-[var(--border-light)]">
      {/* Header row — dt-consumer-header */}
      <div className="flex justify-between items-start mb-[10px] gap-[10px]">
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-[var(--text)] break-words">
            Consumers under {dt.id}
          </div>
          <div className="text-[10.5px] text-[var(--text-dim)] mt-[2px] break-words">
            {subText}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[14px] font-bold text-[var(--ai-purple)]">
            {cdata.totalShare}%
          </div>
          <div className="text-[9.5px] text-[var(--text-dim)] uppercase tracking-[0.5px] whitespace-nowrap">
            {mode === 'top' ? 'top 15' : 'all'} share
          </div>
        </div>
      </div>

      {/* AI banner — only in 'top' mode (was dt-consumer-banner) */}
      {mode === 'top' &&
        (totalAnomalies > 0 ? (
          <div
            className="py-[10px] px-[12px] rounded-[6px] mb-[12px] text-[11.5px] leading-[1.5] text-[var(--text)] break-words border-l-[3px] border-l-[var(--ai-purple)]"
            style={{
              background:
                'linear-gradient(95deg, var(--ai-purple-light) 0%, rgba(255,255,255,0.5) 70%)',
            }}
          >
            <strong>
              ✦ AI: {totalAnomalies} anomal
              {totalAnomalies === 1 ? 'y' : 'ies'} detected.
            </strong>{' '}
            {dt.loss > 15 && (
              <>
                Combined with this DT&apos;s{' '}
                <strong style={{ color: 'var(--red)' }}>
                  {dt.loss.toFixed(1)}% loss
                </strong>
                , these are strong theft candidates.{' '}
              </>
            )}
            Hover the ⚠ icon for AI reasoning. Click any consumer to drill into
            their full profile.
          </div>
        ) : (
          <div className="py-[10px] px-[12px] rounded-[6px] mb-[12px] text-[11.5px] leading-[1.5] text-[var(--text)] break-words border-l-[3px] border-l-[var(--green)] bg-[rgba(40,167,69,0.04)]">
            <strong>✦ AI: No theft signals detected</strong> in top consumers.
            Top 15 account for {cdata.totalShare}% of DT load — distribution
            looks normal for this consumer mix.
          </div>
        ))}

      {/* 'all' mode controls (was dt-consumer-section-controls) */}
      {mode === 'all' && (
        <div className="flex gap-[8px] mb-[10px] items-center flex-wrap max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:[&>*]:!w-full">
          <div className="relative flex-1 min-w-[180px] max-[480px]:min-w-0">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID, or tariff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-[7px] pr-[10px] pl-[28px] border border-[var(--border)] rounded-[6px] text-[11.5px] font-sans bg-[var(--bg)] text-[var(--text)] outline-none focus:border-[var(--ai-purple)]"
            />
          </div>
          <button
            type="button"
            onClick={() => setAnomalyOnly((v) => !v)}
            className="py-[7px] px-[12px] rounded-[6px] text-[11px] font-bold cursor-pointer whitespace-nowrap flex items-center gap-[5px] border"
            style={{
              background: anomalyOnly
                ? 'rgba(220,53,69,.1)'
                : 'transparent',
              color: anomalyOnly ? 'var(--red)' : 'var(--text-mid)',
              borderColor: anomalyOnly
                ? 'rgba(220,53,69,.3)'
                : 'var(--border)',
            }}
          >
            ⚠ Anomalies{anomalyOnly ? ' ✓' : ''} ({totalAnomalies})
          </button>
          <button
            type="button"
            onClick={switchToTop}
            className="py-[7px] px-[12px] bg-transparent text-[var(--text-mid)] border border-[var(--border)] rounded-[6px] text-[11px] font-semibold cursor-pointer whitespace-nowrap"
          >
            ← Show top 15
          </button>
        </div>
      )}

      {/* Consumer list */}
      {visible.length > 0 ? (
        <>
          {/* Header row — hidden at ≤480 */}
          <div
            className="grid gap-[8px] py-[6px] px-[4px] border-b border-[var(--border)] text-[9.5px] text-[var(--text-dim)] uppercase tracking-[0.5px] font-bold mb-[2px] max-[480px]:hidden"
            style={{ gridTemplateColumns: desktopGridCols }}
          >
            <span />
            <span>Consumer</span>
            <span className="text-center">Tariff</span>
            <span className="text-right">kW avg</span>
            <span className="text-right">kW peak</span>
            <span className="text-right">% of DT load</span>
            <span />
          </div>
          <div
            className={
              mode === 'all'
                ? 'max-h-[50vh] overflow-y-auto -mx-[4px] px-[4px] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--border)] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[var(--text-dim)]'
                : undefined
            }
          >
            {visible.map((c) => {
              const pill = tariffPillStyle(c.tariff)
              return (
                <div
                  key={c.id}
                  onClick={() => drillIntoConsumer(c)}
                  className={
                    'grid gap-[8px] items-center py-[8px] px-[4px] border-b border-[var(--border-light)] text-[11.5px] cursor-pointer transition-colors duration-[120ms] hover:bg-[var(--bg)] last-of-type:border-b-0 ' +
                    (c.anomaly
                      ? 'bg-[rgba(220,53,69,0.025)] hover:bg-[rgba(220,53,69,0.05)] '
                      : '') +
                    // Mobile layout: 3-row grid at ≤480
                    'max-[480px]:!grid-cols-[12px_minmax(0,1fr)_auto_auto] max-[480px]:!gap-x-[8px] max-[480px]:!gap-y-[5px] max-[480px]:!py-[10px] max-[480px]:!px-[6px] max-[480px]:text-[11px]'
                  }
                  style={{ gridTemplateColumns: desktopGridCols }}
                >
                  {/* Col 1 — anomaly dot */}
                  <span
                    className={
                      'w-[8px] h-[8px] rounded-full ' +
                      (c.anomaly
                        ? 'shadow-[0_0_0_3px_rgba(220,53,69,0.15)]'
                        : 'opacity-40') +
                      ' max-[480px]:[grid-area:1/1]'
                    }
                    style={{
                      background: c.anomaly ? 'var(--red)' : 'var(--green)',
                    }}
                  />
                  {/* Col 2 — name + id */}
                  <div className="overflow-hidden min-w-0 max-[480px]:[grid-area:1/2]">
                    <div className="font-semibold text-[var(--text)] overflow-hidden text-ellipsis whitespace-nowrap">
                      {c.name}
                    </div>
                    <div className="font-mono text-[9.5px] text-[var(--text-dim)] mt-px">
                      {c.id} · sanctioned {c.sanctioned} kW
                    </div>
                  </div>
                  {/* Col 3 — tariff pill */}
                  <span
                    className="inline-block py-[2px] px-[7px] rounded-[10px] text-[9.5px] font-bold text-center max-[480px]:[grid-area:1/3] max-[480px]:justify-self-end"
                    style={{ background: pill.bg, color: pill.color }}
                  >
                    {c.tariff}
                  </span>
                  {/* Col 4 — kW avg */}
                  <span
                    className={
                      'font-mono text-[11px] text-[var(--text-mid)] text-right ' +
                      "max-[480px]:[grid-area:2/2] max-[480px]:text-left max-[480px]:text-[10.5px] max-[480px]:before:content-['avg_'] max-[480px]:before:text-[var(--text-dim)] max-[480px]:before:font-normal"
                    }
                  >
                    {c.avgKw}
                  </span>
                  {/* Col 5 — kW peak */}
                  <span
                    className={
                      'font-mono text-[11px] text-right ' +
                      "max-[480px]:[grid-area:2/3/auto/5] max-[480px]:text-left max-[480px]:justify-self-start max-[480px]:pl-[12px] max-[480px]:text-[10.5px] max-[480px]:before:content-['peak_'] max-[480px]:before:text-[var(--text-dim)] max-[480px]:before:font-normal"
                    }
                    style={{
                      color:
                        c.peakKw > c.sanctioned * 1.2
                          ? 'var(--red)'
                          : 'var(--text-mid)',
                    }}
                  >
                    {c.peakKw}
                  </span>
                  {/* Col 6 — share bar + text */}
                  <div className="flex items-center gap-[4px] max-[480px]:[grid-area:3/2/auto/5]">
                    <div className="flex-1 min-w-[30px] h-[5px] bg-[var(--border)] rounded-[3px] overflow-hidden">
                      <div
                        className="h-full bg-[var(--ai-purple)] rounded-[3px]"
                        style={{ width: Math.min(100, c.sharePct * 8) + '%' }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[var(--text)] min-w-[34px] text-right">
                      {c.sharePct}%
                    </span>
                  </div>
                  {/* Col 7 — anomaly tooltip */}
                  {c.anomaly ? (
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="relative inline-block cursor-help text-[var(--red)] font-bold group max-[480px]:[grid-area:1/4] max-[480px]:justify-self-center"
                    >
                      ⚠
                      <div className="hidden group-hover:block absolute right-0 top-full mt-[6px] bg-[var(--card)] border border-[var(--red)] rounded-[6px] py-[8px] px-[10px] text-[10.5px] text-[var(--text)] w-[240px] z-[99998] shadow-[0_8px_24px_rgba(10,25,50,0.18)] font-normal leading-[1.5] text-left max-[480px]:w-[min(240px,100vw-60px)] max-[480px]:right-[4px]">
                        <strong style={{ color: 'var(--red)' }}>
                          AI flag:
                        </strong>{' '}
                        {c.anomaly}
                      </div>
                    </span>
                  ) : (
                    <span className="max-[480px]:hidden" />
                  )}
                </div>
              )
            })}
          </div>
          {mode === 'all' && (
            <div className="text-[10px] text-[var(--text-dim)] text-center py-[8px] border-t border-dashed border-[var(--border-light)] mt-[4px]">
              Showing {visible.length} of {dt.consumers} consumers
              {search || anomalyOnly ? ' (filtered)' : ''} · {visibleAnomalies}{' '}
              anomal{visibleAnomalies === 1 ? 'y' : 'ies'}
            </div>
          )}
        </>
      ) : (
        <div className="py-[32px] px-[20px] text-center text-[var(--text-dim)]">
          <div className="text-[28px] mb-[8px] opacity-40">🔍</div>
          <div className="font-bold text-[var(--text-mid)] text-[13px]">
            No matches
          </div>
          <div className="text-[11px] mt-[4px]">
            Try different search terms or clear the anomaly filter.
          </div>
        </div>
      )}

      {/* Footer action row */}
      {mode === 'top' ? (
        <div className="flex gap-[8px] mt-[12px]">
          <button
            type="button"
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Bulk audit triggered',
                message: `AI scanning top 15 consumers under ${dt.id} for theft signals. ${totalAnomalies} flagged for priority review. Results in ~30 min.`,
                duration: 5000,
              })
            }
            className="flex-1 py-[7px] px-[10px] rounded-[5px] text-[10.5px] font-bold cursor-pointer bg-[rgba(124,58,237,0.08)] text-[var(--ai-purple)] border border-[rgba(124,58,237,0.25)]"
          >
            ✦ Audit top 15 for theft
          </button>
          <button
            type="button"
            onClick={switchToAll}
            className="flex-1 py-[7px] px-[10px] rounded-[5px] text-[10.5px] font-semibold cursor-pointer bg-transparent text-[var(--text-mid)] border border-[var(--border)]"
          >
            Show all {dt.consumers} consumers →
          </button>
        </div>
      ) : (
        <div className="flex gap-[8px] mt-[12px]">
          <button
            type="button"
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Bulk audit triggered',
                message: `AI scanning ${visible.length} consumers (${visibleAnomalies} anomalies) under ${dt.id} for theft signals. Results in ~45 min.`,
                duration: 5000,
              })
            }
            className="flex-1 py-[7px] px-[10px] rounded-[5px] text-[10.5px] font-bold cursor-pointer bg-[rgba(124,58,237,0.08)] text-[var(--ai-purple)] border border-[rgba(124,58,237,0.25)]"
          >
            ✦ Audit {visible.length} consumer{visible.length === 1 ? '' : 's'}
          </button>
          <button
            type="button"
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Export started',
                message: `Exporting ${visible.length} consumer records as CSV. Download will start shortly.`,
                duration: 3500,
              })
            }
            className="flex-1 py-[7px] px-[10px] rounded-[5px] text-[10.5px] font-semibold cursor-pointer bg-transparent text-[var(--text-mid)] border border-[var(--border)]"
          >
            📥 Export CSV
          </button>
        </div>
      )}
    </div>
  )
}
