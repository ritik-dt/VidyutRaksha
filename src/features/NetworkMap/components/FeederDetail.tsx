import { useToast } from '@/shared/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { formatIndian } from '@/shared/utils/formatters'
import type { DT, EnrichedFeeder, NavContext } from '../types'

interface FeederDetailProps {
  feeder: EnrichedFeeder
  allDts: DT[]
  onSelect: (ctx: NavContext) => void
  onClose: () => void
}

/** Feeder detail panel — direct port of prototype's showFeederDetail(). */
export function FeederDetail({ feeder, allDts, onSelect, onClose }: FeederDetailProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()

  const dts = allDts.filter((d) => d.feeder === feeder.id)
  const totalCons = dts.reduce((s, d) => s + (d.meters || 0), 0)
  const totalFlagged = dts.reduce((s, d) => s + (d.flagged || 0), 0)
  const totalCritical = dts.reduce((s, d) => s + (d.critical || 0), 0)
  const avgLoss = dts.length > 0 ? (dts.reduce((s, d) => s + d.loss, 0) / dts.length).toFixed(1) : '0.0'
  const avgLoad = dts.length > 0 ? Math.round(dts.reduce((s, d) => s + d.load, 0) / dts.length) : 0
  const highLoss = dts.filter((d) => d.loss > 20)
  const flagRate = totalCons > 0 ? ((totalFlagged / totalCons) * 100).toFixed(1) : '0.0'
  const estRevenue = totalCritical * 15000 + (totalFlagged - totalCritical) * 8000
  const sortedDts = dts.slice().sort((a, b) => (b.flagged || 0) - (a.flagged || 0))

  const avgLossColor = Number(avgLoss) > 18 ? 'var(--red)' : 'var(--amber)'
  const avgLoadColor = avgLoad > 85 ? 'var(--red)' : avgLoad > 70 ? 'var(--amber)' : 'var(--green)'

  return (
    <>
      <div className="map-detail-header">
        <div className="map-detail-title">⚡ {feeder.id} Feeder — {feeder.area}</div>
        <button type="button" className="map-detail-close" onClick={onClose}>✕</button>
      </div>

      <div className="map-detail-body">
        <div className="map-breadcrumb">
          <span className="map-bc-item" onClick={onClose}>🗺️ Map</span>
          <span className="map-bc-sep">›</span>
          <span className="map-bc-current">⚡ {feeder.id}</span>
        </div>

        {/* Headline strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          <div style={{ padding: '8px 6px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--ai-purple)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>DTRs</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ai-purple)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>{dts.length}</div>
          </div>
          <div style={{ padding: '8px 6px', background: 'rgba(0,123,255,0.06)', border: '1px solid rgba(0,123,255,0.2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--id-text, #0284c7)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>Consumers</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--id-text, #0284c7)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>{formatIndian(totalCons)}</div>
          </div>
          <div style={{ padding: '8px 6px', background: 'rgba(230,146,30,0.06)', border: '1px solid rgba(230,146,30,0.2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>Flagged</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>{formatIndian(totalFlagged)}</div>
            <div style={{ fontSize: 8.5, color: 'var(--text-dim)', marginTop: 1 }}>{flagRate}%</div>
          </div>
          <div style={{ padding: '8px 6px', background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--red)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>Critical</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>{totalCritical}</div>
          </div>
        </div>

        {/* AI feeder analysis */}
        <div className="map-detail-ai">
          <strong>✦ AI feeder analysis:</strong>{' '}
          {highLoss.length > 0 ? (
            <>
              ⚠ This feeder has <strong>{highLoss.length} high-loss DTR{highLoss.length > 1 ? 's' : ''} (&gt;20%)</strong>{' '}
              downstream — {highLoss.map((d) => d.id).join(', ')}. Concentrated losses suggest localized theft patterns.{' '}
            </>
          ) : (
            <>✓ All DTRs under this feeder are within acceptable loss range. </>
          )}
          <strong>{formatIndian(totalFlagged)} flagged consumers</strong> across{' '}
          <strong>{formatIndian(totalCons)} total</strong> · estimated{' '}
          <strong>₹{(estRevenue / 100000).toFixed(1)}L recovery exposure</strong>. Recommend: dispatch joint
          inspection raid covering the top 3 DTRs by flagged count.
        </div>

        <div className="map-detail-section">
          <div className="map-detail-label">Feeder summary</div>
          <div className="map-detail-row"><span className="map-detail-key">Avg DTR loss</span><span className="map-detail-val" style={{ color: avgLossColor }}>{avgLoss}%</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Avg DTR loading</span><span className="map-detail-val" style={{ color: avgLoadColor }}>{avgLoad}%</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Network flag rate</span><span className="map-detail-val">{flagRate}% (vs ~5% network avg)</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Highest-flagged DTR</span><span className="map-detail-val">{sortedDts[0] ? sortedDts[0].id + ' (' + (sortedDts[0].flagged || 0) + ')' : '—'}</span></div>
        </div>

        <div className="map-detail-section">
          <div className="map-detail-label">Connected DTRs (ranked by flagged count)</div>
          {sortedDts.map((d) => {
            const col = d.loss > 20 ? 'var(--red)' : d.loss > 15 ? 'var(--amber)' : 'var(--green)'
            const fl = d.flagged || 0
            const cr = d.critical || 0
            return (
              <div
                key={d.id}
                className="map-consumer-item"
                style={{ alignItems: 'flex-start' }}
                onClick={() => onSelect({ feeder, dt: d, consumer: null })}
              >
                <div
                  className="map-consumer-risk"
                  style={{ background: `${col}18`, border: `2px solid ${col}`, color: col, fontSize: 10.5, fontFamily: 'var(--mono)', fontWeight: 800 }}
                >
                  {d.loss.toFixed(0)}<span style={{ fontSize: 7, fontWeight: 600 }}>%</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 11.5 }}>{d.id} — {d.area}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span>{formatIndian(d.meters)} consumers</span>
                    <span>{d.load}% load</span>
                    {fl > 0 && <span style={{ color: 'var(--amber)', fontWeight: 600 }}>⚡ {fl} flagged</span>}
                    {cr > 0 && <span style={{ color: 'var(--red)', fontWeight: 700 }}>⚠ {cr} critical</span>}
                  </div>
                </div>
                <span style={{ color: 'var(--text-dim)' }}>›</span>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
          <button
            type="button"
            className="map-action-btn btn-ai"
            style={{ margin: 0, gridColumn: '1 / -1' }}
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Inspection raid scheduled',
                message: `AI suggesting joint raid covering top 3 DTRs of ${feeder.id} feeder. Routes optimized for ${totalCritical} critical consumers across ${highLoss.length} high-loss DTRs.`,
                duration: 5000,
              })
            }
          >
            ✦ Schedule joint raid for top 3 DTRs ({totalCritical} critical)
          </button>
          <button type="button" className="map-action-btn btn-outline" style={{ margin: 0 }} onClick={() => navigate('/meters')}>
            📋 View {totalFlagged} flagged in list
          </button>
          <button
            type="button"
            className="map-action-btn btn-outline"
            style={{ margin: 0 }}
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Feeder report queued',
                message: `Generating audit report for ${feeder.id}: ${dts.length} DTRs · ${formatIndian(totalCons)} consumers · ${totalFlagged} flagged. ETA 90s.`,
                duration: 4000,
              })
            }
          >
            📄 Generate audit report
          </button>
        </div>
      </div>
    </>
  )
}
