import { useToast } from '@/shared/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import type { MapConsumer } from '../types'
import { REMEDIATION_KB } from '../data/remediationKb'
import {
  MapActionBtn,
  MapBackBtn,
  MapBcCurrent,
  MapBcItem,
  MapBcSep,
  MapBreadcrumb,
  MapConsumerRisk,
  MapDetailAi,
  MapDetailBody,
  MapDetailHeader,
  MapDetailRow,
  MapDetailSection,
} from './MapDetailPrimitives'

interface ConsumerDetailProps {
  consumer: MapConsumer
  /** Navigate back to parent DT (matches prototype's `mapNavUp('dt', c.dt)`). */
  onBack: () => void
  /** Navigate back to parent feeder (matches prototype's `mapNavUp('feeder', c.feeder)`). */
  onBackToFeeder: () => void
  onClose: () => void
}

/** Consumer detail — direct port of prototype's showConsumerDetail(). */
export function ConsumerDetail({
  consumer,
  onBack,
  onBackToFeeder,
  onClose,
}: ConsumerDetailProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const c = consumer
  const isReal = c.isReal === true
  const col =
    c.risk >= 70
      ? 'var(--red)'
      : c.risk >= 40
        ? 'var(--amber)'
        : 'var(--green)'
  const rem = c.theftType ? REMEDIATION_KB[c.theftType] : null

  const headerTitle = (
    <>
      {isReal && (
        <span
          className="inline-block py-[2px] px-[6px] rounded-[8px] text-[9px] font-extrabold tracking-[0.3px] mr-[6px] align-middle text-white"
          style={{ background: '#D4A017' }}
        >
          ✓ REAL
        </span>
      )}
      {c.isTheft && !isReal && (
        <span className="text-[var(--red)]">⚠ </span>
      )}
      M#{c.id}
    </>
  )

  return (
    <>
      <MapDetailHeader title={headerTitle} onClose={onClose} />

      <MapDetailBody>
        <MapBreadcrumb>
          <MapBcItem onClick={onClose}>🗺️ Map</MapBcItem>
          <MapBcSep />
          <MapBcItem onClick={onBackToFeeder}>⚡ {c.feeder}</MapBcItem>
          <MapBcSep />
          <MapBcItem onClick={onBack}>{c.dt}</MapBcItem>
          <MapBcSep />
          <MapBcCurrent>{c.id}</MapBcCurrent>
        </MapBreadcrumb>

        <MapBackBtn onClick={onBack}>← Back to {c.dt}</MapBackBtn>

        {/* Header row: risk circle + name/id */}
        <div className="flex items-center gap-[10px] mb-[12px]">
          <MapConsumerRisk color={col} size={40} fontSize={14}>
            {c.risk}
          </MapConsumerRisk>
          <div className="flex-1 min-w-0">
            {isReal ? (
              <>
                <div className="text-[13px] font-bold leading-[1.3] break-words">
                  {(c.name || c.id).substring(0, 40)}
                </div>
                <div className="text-[11px] text-[var(--text-dim)] mt-[2px] break-words">
                  M#{c.id} · {c.activity || c.cat} · {c.zone || ''}
                </div>
              </>
            ) : (
              <>
                <div className="text-[14px] font-bold break-words">
                  {c.id}
                </div>
                <div className="text-[11px] text-[var(--text-dim)] break-words">
                  {c.cat} • {c.dt} • {c.feeder}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Real MRI notice */}
        {isReal && (
          <div
            className="py-[8px] px-[10px] rounded-[8px] text-[11px] mb-[12px] leading-[1.5] break-words border"
            style={{
              background: 'rgba(212,160,23,0.08)',
              borderColor: 'rgba(212,160,23,0.3)',
              color: '#7a5b0a',
            }}
          >
            <strong>✓ Real meter from KVVNL March 2026 MRI batch.</strong>{' '}
            Forensic data is live — actual cumulative kWh, tamper count, last
            7-day load survey, voltage/current readings from the meter itself.
          </div>
        )}

        {/* AI flag / normal status */}
        {c.isTheft ? (
          <MapDetailAi>
            <strong>✦ AI flag:</strong>{' '}
            {isReal ? (
              <>
                This meter shows{' '}
                <strong>{c.events} lifetime tamper events</strong> with risk
                score <strong>{c.risk}</strong>.{' '}
              </>
            ) : (
              <>
                This meter shows{' '}
                <strong>anomalous consumption patterns</strong> consistent with{' '}
                <strong>{c.theftType || 'theft'}</strong>. Consumption dropped{' '}
                <strong>{c.drop}%</strong> vs peer group with{' '}
                <strong>{c.events} tamper events</strong>.{' '}
              </>
            )}
            Confidence: <strong>{c.risk}%</strong>. Recommend immediate field
            inspection.
          </MapDetailAi>
        ) : (
          <div className="py-[8px] px-[10px] bg-[rgba(40,167,69,0.08)] rounded-[8px] text-[11px] text-[var(--green)] mb-[12px] leading-[1.4]">
            ✓ Normal consumption pattern. No anomalies detected.
          </div>
        )}

        {/* Consumer details */}
        <MapDetailSection
          label={
            isReal ? 'Consumer (real KVVNL master data)' : 'Consumer details'
          }
        >
          {isReal ? (
            <>
              <MapDetailRow label="Account #" value={c.account} />
              <MapDetailRow label="Activity" value={c.activity || '—'} />
              <MapDetailRow label="Tariff" value={c.tariff || '—'} />
              <MapDetailRow label="Sanctioned load" value={c.sl} />
              <MapDetailRow label="Zone" value={c.zone || '—'} />
              <MapDetailRow label="DTR" value={c.dt} />
              <MapDetailRow
                label="Risk score"
                value={c.risk}
                valueColor={col}
              />
              <MapDetailRow
                label="Lifetime tampers"
                value={c.events}
                valueColor={
                  c.events > 200
                    ? 'var(--red)'
                    : c.events > 50
                      ? 'var(--amber)'
                      : 'var(--text)'
                }
              />
              {c._ref && (
                <>
                  <MapDetailRow
                    label="7d avg kWh/day"
                    value={c._ref.avg_kwh_d || '—'}
                  />
                  <MapDetailRow
                    label="Zero-load %"
                    value={`${c._ref.zero_pct || 0}%`}
                    valueColor={
                      (c._ref.zero_pct || 0) > 30
                        ? 'var(--red)'
                        : (c._ref.zero_pct || 0) > 15
                          ? 'var(--amber)'
                          : 'var(--text)'
                    }
                  />
                  <MapDetailRow
                    label="Lifetime PF"
                    value={c._ref.pf ?? '—'}
                    valueColor={
                      c._ref.pf && c._ref.pf < 0.85 ? 'var(--red)' : 'var(--text)'
                    }
                  />
                </>
              )}
            </>
          ) : (
            <>
              <MapDetailRow label="Category" value={c.cat} />
              <MapDetailRow label="Sanctioned load" value={c.sl} />
              <MapDetailRow label="DT" value={c.dt} />
              <MapDetailRow label="Feeder" value={c.feeder} />
              <MapDetailRow
                label="Risk score"
                value={c.risk}
                valueColor={col}
              />
              <MapDetailRow
                label="kWh drop"
                value={`${c.drop}%`}
                valueColor={c.drop < -30 ? 'var(--red)' : 'var(--text)'}
              />
              <MapDetailRow label="Tamper events" value={c.events} />
              <MapDetailRow label="Monthly kWh" value={c.kwh} />
              {c.theftType && (
                <MapDetailRow
                  label="Theft type"
                  value={c.theftType}
                  valueColor="var(--red)"
                />
              )}
            </>
          )}
        </MapDetailSection>

        {/* Billing snapshot — synthetic only */}
        {!isReal && (
          <MapDetailSection label="📊 Billing snapshot (last 3 months)">
            <div className="flex gap-[4px] mb-[4px]">
              {[
                { m: 'Jan', v: Math.round(c.kwh * 0.9) },
                {
                  m: 'Feb',
                  v: Math.round(c.kwh * (c.isTheft ? 0.6 : 0.95)),
                },
                {
                  m: 'Mar',
                  v: Math.round(c.kwh * (c.isTheft ? 0.35 : 1.02)),
                },
              ].map((b) => (
                <div
                  key={b.m}
                  className="flex-1 text-center p-[6px] bg-[var(--bg)] rounded-[6px]"
                >
                  <div className="text-[9px] text-[var(--text-dim)]">{b.m}</div>
                  <div
                    className="text-[13px] font-bold font-mono"
                    style={{
                      color: b.v < c.kwh * 0.5 ? 'var(--red)' : 'var(--text)',
                    }}
                  >
                    {b.v}
                  </div>
                  <div className="text-[8px] text-[var(--text-dim)]">kWh</div>
                </div>
              ))}
            </div>
          </MapDetailSection>
        )}

        {/* AI remediation — from REMEDIATION_KB */}
        {rem && (
          <MapDetailSection
            label={`✦ AI remediation — ${rem.type}`}
            labelColor="var(--ai-purple)"
          >
            <div className="text-[10px] font-semibold text-[var(--red)] mb-[4px]">
              ⚠ Safety
            </div>
            {rem.safety.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-[4px] py-[2px] text-[10px] text-[var(--text)] break-words"
              >
                <span className="text-[var(--red)] shrink-0">●</span>
                {s}
              </div>
            ))}
            <div className="text-[10px] font-semibold text-[var(--ai-purple)] mt-[8px] mb-[4px]">
              Inspection steps
            </div>
            {rem.checklist.slice(0, 5).map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-[6px] py-[3px] text-[11px] break-words"
              >
                <span className="text-[var(--ai-purple)] font-semibold min-w-[14px] shrink-0">
                  {i + 1}.
                </span>
                {s}
              </div>
            ))}
            {rem.checklist.length > 5 && (
              <div className="text-[10px] text-[var(--text-dim)] pt-[2px] pl-[20px]">
                + {rem.checklist.length - 5} more steps in full detail view
              </div>
            )}
            <div className="mt-[8px] py-[6px] px-[8px] bg-[var(--ai-purple-light)] rounded-[6px] text-[10px] text-[var(--ai-purple)] leading-[1.5] break-words">
              <strong>⚖️</strong> {rem.legal}
            </div>
          </MapDetailSection>
        )}

        {/* Actions */}
        {(isReal || c.isTheft) && (
          <>
            <MapActionBtn
              variant="ai"
              className="!mt-0 mb-[6px]"
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
            </MapActionBtn>
            <MapActionBtn
              variant="outline"
              className="!mt-0"
              onClick={() => navigate('/cases')}
            >
              📋 Create case
            </MapActionBtn>
          </>
        )}
      </MapDetailBody>
    </>
  )
}
