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

const tariffClass = (t: DtConsumer['tariff']): string => {
  if (t === 'LT-1') return 'consumer-tariff t-lt1'
  if (t === 'LT-2') return 'consumer-tariff t-lt2'
  return 'consumer-tariff t-lt6'
}

/** Consumer section shown inside the DT detail modal — matches prototype's renderDtConsumerSection. */
export function DtConsumerSection({ dt, onDrillConsumer }: DtConsumerSectionProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('top')
  const [search, setSearch] = useState('')
  const [anomalyOnly, setAnomalyOnly] = useState(false)

  // Consumer list — regenerated when DT or mode changes
  const cdata = useMemo(() => getDtConsumers(dt, mode), [dt, mode])
  const allConsumers = cdata.consumers

  // Apply search + anomaly filter
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
    // Route to the full consumer detail page; pass the clicked name so the page
    // shows the actual name the user clicked (not a hard-coded demo name).
    setTimeout(
      () => navigate(`/consumers/${encodeURIComponent(c.id)}?name=${encodeURIComponent(c.name)}`),
      60,
    )
  }

  return (
    <div className="dt-consumer-section">
      <div className="dt-consumer-header">
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
            Consumers under {dt.id}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 2 }}>{subText}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ai-purple)' }}>
            {cdata.totalShare}%
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            {mode === 'top' ? 'top 15' : 'all'} share
          </div>
        </div>
      </div>

      {/* AI banner — only in 'top' mode */}
      {mode === 'top' && (
        totalAnomalies > 0 ? (
          <div className="dt-consumer-banner">
            <strong>✦ AI: {totalAnomalies} anomal{totalAnomalies === 1 ? 'y' : 'ies'} detected.</strong>{' '}
            {dt.loss > 15 && (
              <>
                Combined with this DT&apos;s{' '}
                <strong style={{ color: 'var(--red)' }}>{dt.loss.toFixed(1)}% loss</strong>, these are strong theft
                candidates.{' '}
              </>
            )}
            Hover the ⚠ icon for AI reasoning. Click any consumer to drill into their full profile.
          </div>
        ) : (
          <div
            className="dt-consumer-banner"
            style={{ background: 'rgba(40,167,69,.04)', borderLeftColor: 'var(--green)' }}
          >
            <strong>✦ AI: No theft signals detected</strong> in top consumers. Top 15 account for{' '}
            {cdata.totalShare}% of DT load — distribution looks normal for this consumer mix.
          </div>
        )
      )}

      {/* 'all' mode controls: search + anomaly toggle + back button */}
      {mode === 'all' && (
        <div className="dt-consumer-section-controls" style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID, or tariff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 28px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 11.5,
                fontFamily: 'inherit',
                background: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setAnomalyOnly((v) => !v)}
            style={{
              padding: '7px 12px',
              background: anomalyOnly ? 'rgba(220,53,69,.1)' : 'transparent',
              color: anomalyOnly ? 'var(--red)' : 'var(--text-mid)',
              border: '1px solid ' + (anomalyOnly ? 'rgba(220,53,69,.3)' : 'var(--border)'),
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            ⚠ Anomalies{anomalyOnly ? ' ✓' : ''} ({totalAnomalies})
          </button>
          <button
            type="button"
            onClick={switchToTop}
            style={{
              padding: '7px 12px',
              background: 'transparent',
              color: 'var(--text-mid)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ← Show top 15
          </button>
        </div>
      )}

      {/* Consumer list */}
      {visible.length > 0 ? (
        <>
          <div className="consumer-table-head">
            <span />
            <span>Consumer</span>
            <span style={{ textAlign: 'center' }}>Tariff</span>
            <span style={{ textAlign: 'right' }}>kW avg</span>
            <span style={{ textAlign: 'right' }}>kW peak</span>
            <span style={{ textAlign: 'right' }}>% of DT load</span>
            <span />
          </div>
          <div className={mode === 'all' ? 'dt-consumer-list-scroll' : undefined}>
            {visible.map((c) => (
              <div
                key={c.id}
                className={'dt-consumer-row' + (c.anomaly ? ' dt-consumer-row-anomaly' : '')}
                onClick={() => drillIntoConsumer(c)}
              >
                <span className={'consumer-anomaly-dot ' + (c.anomaly ? 'is-flagged' : 'is-clean')} />
                <div style={{ overflow: 'hidden' }}>
                  <div className="consumer-name">{c.name}</div>
                  <div className="consumer-id">
                    {c.id} · sanctioned {c.sanctioned} kW
                  </div>
                </div>
                <span className={tariffClass(c.tariff)}>{c.tariff}</span>
                <span className="consumer-num">{c.avgKw}</span>
                <span className="consumer-num" style={{ color: c.peakKw > c.sanctioned * 1.2 ? 'var(--red)' : 'var(--text-mid)' }}>
                  {c.peakKw}
                </span>
                <div className="consumer-share">
                  <div className="consumer-share-bar">
                    <div className="consumer-share-fill" style={{ width: Math.min(100, c.sharePct * 8) + '%' }} />
                  </div>
                  <span className="consumer-share-text">{c.sharePct}%</span>
                </div>
                {c.anomaly ? (
                  <span
                    className="consumer-anomaly-tooltip"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⚠
                    <div className="consumer-tooltip-body">
                      <strong style={{ color: 'var(--red)' }}>AI flag:</strong> {c.anomaly}
                    </div>
                  </span>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
          {mode === 'all' && (
            <div
              style={{
                fontSize: 10,
                color: 'var(--text-dim)',
                textAlign: 'center',
                padding: '8px 0',
                borderTop: '1px dashed var(--border-light)',
                marginTop: 4,
              }}
            >
              Showing {visible.length} of {dt.consumers} consumers
              {search || anomalyOnly ? ' (filtered)' : ''} · {visibleAnomalies} anomal
              {visibleAnomalies === 1 ? 'y' : 'ies'}
            </div>
          )}
        </>
      ) : (
        // Empty state
        <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>🔍</div>
          <div style={{ fontWeight: 700, color: 'var(--text-mid)', fontSize: 13 }}>No matches</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            Try different search terms or clear the anomaly filter.
          </div>
        </div>
      )}

      {/* Footer action row */}
      {mode === 'top' ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
            style={{
              flex: 1,
              padding: '7px 10px',
              background: 'rgba(124,58,237,.08)',
              color: 'var(--ai-purple)',
              border: '1px solid rgba(124,58,237,.25)',
              borderRadius: 5,
              fontSize: 10.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✦ Audit top 15 for theft
          </button>
          <button
            type="button"
            onClick={switchToAll}
            style={{
              flex: 1,
              padding: '7px 10px',
              background: 'transparent',
              color: 'var(--text-mid)',
              border: '1px solid var(--border)',
              borderRadius: 5,
              fontSize: 10.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Show all {dt.consumers} consumers →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
            style={{
              flex: 1,
              padding: '7px 10px',
              background: 'rgba(124,58,237,.08)',
              color: 'var(--ai-purple)',
              border: '1px solid rgba(124,58,237,.25)',
              borderRadius: 5,
              fontSize: 10.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
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
            style={{
              flex: 1,
              padding: '7px 10px',
              background: 'transparent',
              color: 'var(--text-mid)',
              border: '1px solid var(--border)',
              borderRadius: 5,
              fontSize: 10.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📥 Export CSV
          </button>
        </div>
      )}
    </div>
  )
}
