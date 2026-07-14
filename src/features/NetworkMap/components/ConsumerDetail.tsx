import { useToast } from '@/shared/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import type { MapConsumer } from '../types'
import { REMEDIATION_KB } from '../data/remediationKb'

interface ConsumerDetailProps {
  consumer: MapConsumer
  onBack: () => void
  onClose: () => void
}

/** Consumer detail — direct port of prototype's showConsumerDetail(). */
export function ConsumerDetail({ consumer, onBack, onClose }: ConsumerDetailProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const c = consumer
  const isReal = c.isReal === true
  const col = c.risk >= 70 ? 'var(--red)' : c.risk >= 40 ? 'var(--amber)' : 'var(--green)'
  const rem = c.theftType ? REMEDIATION_KB[c.theftType] : null

  return (
    <>
      <div className="map-detail-header">
        <div className="map-detail-title">
          {isReal && (
            <span
              style={{
                display: 'inline-block',
                padding: '2px 6px',
                background: '#D4A017',
                color: '#fff',
                borderRadius: 8,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '.3px',
                marginRight: 6,
                verticalAlign: 'middle',
              }}
            >
              ✓ REAL
            </span>
          )}
          {c.isTheft && !isReal && <span style={{ color: 'var(--red)' }}>⚠ </span>}
          M#{c.id}
        </div>
        <button type="button" className="map-detail-close" onClick={onClose}>✕</button>
      </div>

      <div className="map-detail-body">
        <div className="map-breadcrumb">
          <span className="map-bc-item" onClick={onClose}>🗺️ Map</span>
          <span className="map-bc-sep">›</span>
          <span className="map-bc-item" onClick={onBack}>⚡ {c.feeder}</span>
          <span className="map-bc-sep">›</span>
          <span className="map-bc-item" onClick={onBack}>{c.dt}</span>
          <span className="map-bc-sep">›</span>
          <span className="map-bc-current">{c.id}</span>
        </div>

        {/* Back button — always shown, matching prototype behaviour */}
        <button type="button" className="map-back-btn" onClick={onBack}>
          ← Back to {c.dt}
        </button>

        {/* Header row: risk circle + name/id */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            className="map-consumer-risk"
            style={{
              width: 40,
              height: 40,
              fontSize: 14,
              background: `${col}18`,
              border: `2.5px solid ${col}`,
              color: col,
            }}
          >
            {c.risk}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {isReal ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                  {(c.name || c.id).substring(0, 40)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                  M#{c.id} · {c.activity || c.cat} · {c.zone || ''}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{c.id}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  {c.cat} • {c.dt} • {c.feeder}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Real MRI notice */}
        {isReal && (
          <div
            style={{
              padding: '8px 10px',
              background: 'rgba(212,160,23,0.08)',
              border: '1px solid rgba(212,160,23,0.3)',
              borderRadius: 8,
              fontSize: 11,
              color: '#7a5b0a',
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          >
            <strong>✓ Real meter from KVVNL March 2026 MRI batch.</strong> Forensic data is live — actual
            cumulative kWh, tamper count, last 7-day load survey, voltage/current readings from the meter itself.
          </div>
        )}

        {/* AI flag / normal status */}
        {c.isTheft ? (
          <div className="map-detail-ai">
            <strong>✦ AI flag:</strong>{' '}
            {isReal ? (
              <>
                This meter shows <strong>{c.events} lifetime tamper events</strong> with risk score{' '}
                <strong>{c.risk}</strong>.{' '}
              </>
            ) : (
              <>
                This meter shows <strong>anomalous consumption patterns</strong> consistent with{' '}
                <strong>{c.theftType || 'theft'}</strong>. Consumption dropped <strong>{c.drop}%</strong> vs peer
                group with <strong>{c.events} tamper events</strong>.{' '}
              </>
            )}
            Confidence: <strong>{c.risk}%</strong>. Recommend immediate field inspection.
          </div>
        ) : (
          <div
            style={{
              padding: '8px 10px',
              background: 'rgba(40,167,69,0.08)',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--green)',
              marginBottom: 12,
            }}
          >
            ✓ Normal consumption pattern. No anomalies detected.
          </div>
        )}

        {/* Consumer details */}
        <div className="map-detail-section">
          <div className="map-detail-label">{isReal ? 'Consumer (real KVVNL master data)' : 'Consumer details'}</div>
          {isReal ? (
            <>
              <div className="map-detail-row"><span className="map-detail-key">Account #</span><span className="map-detail-val" style={{ fontFamily: 'var(--mono)' }}>{c.account}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Activity</span><span className="map-detail-val">{c.activity || '—'}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Tariff</span><span className="map-detail-val">{c.tariff || '—'}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Sanctioned load</span><span className="map-detail-val">{c.sl}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Zone</span><span className="map-detail-val">{c.zone || '—'}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">DTR</span><span className="map-detail-val">{c.dt}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Risk score</span><span className="map-detail-val" style={{ color: col }}>{c.risk}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Lifetime tampers</span><span className="map-detail-val" style={{ color: c.events > 200 ? 'var(--red)' : c.events > 50 ? 'var(--amber)' : 'var(--text)' }}>{c.events}</span></div>
              {c._ref && (
                <>
                  <div className="map-detail-row"><span className="map-detail-key">7d avg kWh/day</span><span className="map-detail-val">{c._ref.avg_kwh_d || '—'}</span></div>
                  <div className="map-detail-row"><span className="map-detail-key">Zero-load %</span><span className="map-detail-val" style={{ color: (c._ref.zero_pct || 0) > 30 ? 'var(--red)' : (c._ref.zero_pct || 0) > 15 ? 'var(--amber)' : 'var(--text)' }}>{c._ref.zero_pct || 0}%</span></div>
                  <div className="map-detail-row"><span className="map-detail-key">Lifetime PF</span><span className="map-detail-val" style={{ color: c._ref.pf && c._ref.pf < 0.85 ? 'var(--red)' : 'var(--text)' }}>{c._ref.pf ?? '—'}</span></div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="map-detail-row"><span className="map-detail-key">Category</span><span className="map-detail-val">{c.cat}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Sanctioned load</span><span className="map-detail-val">{c.sl}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">DT</span><span className="map-detail-val">{c.dt}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Feeder</span><span className="map-detail-val">{c.feeder}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Risk score</span><span className="map-detail-val" style={{ color: col }}>{c.risk}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">kWh drop</span><span className="map-detail-val" style={{ color: c.drop < -30 ? 'var(--red)' : 'var(--text)' }}>{c.drop}%</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Tamper events</span><span className="map-detail-val">{c.events}</span></div>
              <div className="map-detail-row"><span className="map-detail-key">Monthly kWh</span><span className="map-detail-val">{c.kwh}</span></div>
              {c.theftType && <div className="map-detail-row"><span className="map-detail-key">Theft type</span><span className="map-detail-val" style={{ color: 'var(--red)' }}>{c.theftType}</span></div>}
            </>
          )}
        </div>

        {/* Billing snapshot — synthetic only */}
        {!isReal && (
          <div className="map-detail-section">
            <div className="map-detail-label">📊 Billing snapshot (last 3 months)</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[
                { m: 'Jan', v: Math.round(c.kwh * 0.9) },
                { m: 'Feb', v: Math.round(c.kwh * (c.isTheft ? 0.6 : 0.95)) },
                { m: 'Mar', v: Math.round(c.kwh * (c.isTheft ? 0.35 : 1.02)) },
              ].map((b) => (
                <div key={b.m} style={{ flex: 1, textAlign: 'center', padding: 6, background: 'var(--bg)', borderRadius: 6 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>{b.m}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: b.v < c.kwh * 0.5 ? 'var(--red)' : 'var(--text)' }}>
                    {b.v}
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--text-dim)' }}>kWh</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI remediation — from REMEDIATION_KB */}
        {rem && (
          <div className="map-detail-section">
            <div className="map-detail-label" style={{ color: 'var(--ai-purple)' }}>
              ✦ AI remediation — {rem.type}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>⚠ Safety</div>
            {rem.safety.slice(0, 3).map((s, i) => (
              <div key={i} className="map-safety-item">
                <span style={{ color: 'var(--red)' }}>●</span>
                {s}
              </div>
            ))}
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ai-purple)', margin: '8px 0 4px' }}>
              Inspection steps
            </div>
            {rem.checklist.slice(0, 5).map((s, i) => (
              <div key={i} className="map-checklist-item">
                <span style={{ color: 'var(--ai-purple)', fontWeight: 600, minWidth: 14 }}>{i + 1}.</span>
                {s}
              </div>
            ))}
            {rem.checklist.length > 5 && (
              <div style={{ fontSize: 10, color: 'var(--text-dim)', padding: '2px 0 0 20px' }}>
                + {rem.checklist.length - 5} more steps in full detail view
              </div>
            )}
            <div
              style={{
                marginTop: 8,
                padding: '6px 8px',
                background: 'var(--ai-purple-light)',
                borderRadius: 6,
                fontSize: 10,
                color: 'var(--ai-purple)',
              }}
            >
              <strong>⚖️</strong> {rem.legal}
            </div>
          </div>
        )}

        {/* Actions */}
        {(isReal || c.isTheft) && (
          <>
            <button
              type="button"
              className="map-action-btn btn-ai"
              style={{ marginBottom: 6 }}
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'Full meter detail',
                  message: `Opening ${isReal ? 'real KVVNL MRI data' : 'meter forensics'} for M#${c.id}.`,
                  duration: 3500,
                })
              }
            >
              ✦ Open full meter detail{isReal ? ' (real MRI data)' : ''}
            </button>
            <button
              type="button"
              className="map-action-btn btn-outline"
              onClick={() => navigate('/cases')}
            >
              📋 Create case
            </button>
          </>
        )}
      </div>
    </>
  )
}
