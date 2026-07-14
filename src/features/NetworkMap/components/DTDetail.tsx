import { useMemo, useState } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { generateConsumers } from '../logic/consumerGen'
import type { DT, Feeder, MapConsumer, NavContext } from '../types'

interface DTDetailProps {
  dt: DT
  parentFeeder: Feeder | null
  onSelect: (ctx: NavContext) => void
  onBack: () => void
  onClose: () => void
}

type FilterKey = 'critical' | 'flagged' | 'industrial' | 'commercial'

function seedRng(seed: number): () => number {
  let x = seed
  return () => {
    x = (x * 16807) % 2147483647
    return (x - 1) / 2147483646
  }
}

/** Compact per-consumer row used in the DT panel triage list (matches prototype's dtConsumerRow). */
function DtConsumerRow({ c, onClick }: { c: MapConsumer; onClick: () => void }) {
  const col = c.risk >= 80 ? 'var(--red)' : c.risk >= 60 ? 'var(--amber)' : 'var(--green)'
  const display = c.name ?? c.id
  return (
    <div className="map-consumer-item" onClick={onClick}>
      <div
        className="map-consumer-risk"
        style={{ background: `${col}18`, border: `2px solid ${col}`, color: col }}
      >
        {c.risk}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 11.5, display: 'flex', alignItems: 'center' }}>
          {display.length > 28 ? display.substring(0, 28) + '…' : display}
          {c.isReal && (
            <span style={{ display: 'inline-block', padding: '1px 5px', background: 'rgba(40,167,69,.12)', color: 'var(--green)', border: '1px solid rgba(40,167,69,.3)', borderRadius: 6, fontSize: 8.5, fontWeight: 800, letterSpacing: '.3px', marginLeft: 4, verticalAlign: 'middle' }}>
              ✓ REAL
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 1 }}>
          {c.cat} · {c.events} events{c.theftType ? ' · ' + c.theftType : ''}{c.drop ? ' · ' + c.drop + '%' : ''}
        </div>
      </div>
      <span style={{ color: 'var(--text-dim)' }}>›</span>
    </div>
  )
}

/** DT detail — direct port of prototype's showDTDetail(). */
export function DTDetail({ dt, parentFeeder, onSelect, onBack, onClose }: DTDetailProps) {
  const { showToast } = useToast()
  const [filter, setFilter] = useState<FilterKey>('critical')

  // "View all N →" opens an in-panel full flagged-consumer list (paginated + searchable).
  // The prototype uses a full-screen modal here — we keep it inside the map-detail panel
  // for a smoother UX. State reset whenever DT changes.
  const [viewMode, setViewMode] = useState<'default' | 'viewAll'>('default')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<'risk' | 'events' | 'drop'>('risk')
  const [page, setPage] = useState(1)

  const cons = useMemo(() => generateConsumers([dt]), [dt])
  const susp = useMemo(() => cons.filter((c) => c.isTheft).sort((a, b) => b.risk - a.risk), [cons])
  const critical = useMemo(() => cons.filter((c) => c.isCritical).sort((a, b) => b.risk - a.risk), [cons])
  const high = useMemo(() => cons.filter((c) => c.isTheft && !c.isCritical), [cons])
  const normal = useMemo(() => cons.filter((c) => !c.isTheft), [cons])
  const flagRate = cons.length > 0 ? ((susp.length / cons.length) * 100).toFixed(1) : '0.0'

  const topType: Record<string, number> = {}
  susp.forEach((c) => {
    if (c.theftType) topType[c.theftType] = (topType[c.theftType] || 0) + 1
  })
  const topTypeStr =
    Object.entries(topType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([k, v]) => `${k} (${v})`)
      .join(', ') || '—'

  const byCat: Record<string, number> = {}
  susp.forEach((c) => {
    byCat[c.cat] = (byCat[c.cat] || 0) + 1
  })
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])

  const totalEvents = cons.reduce((s, c) => s + c.events, 0)
  const estRevenue = critical.length * 15000 + high.length * 8000

  // Derived DT-level energy audit (matches prototype)
  const dtMonthlyKwhPerMeter = 145
  const dtBilledMU = (cons.length * dtMonthlyKwhPerMeter) / 1000
  const dtInputMU = dtBilledMU / (1 - dt.loss / 100)
  const dtLossMU = dtInputMU - dtBilledMU
  const technicalLossBaseline = 8
  const commercialLossEst = Math.max(0, dt.loss - technicalLossBaseline)

  // Phase imbalance (deterministic per DT id)
  const phaseSeed = dt.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pRng = seedRng(phaseSeed)
  const phaseTotal = Math.round((dt.load || 60) * 3)
  const phRPct = 0.28 + pRng() * 0.18
  const phYPct = 0.26 + pRng() * 0.14
  const phBPct = 1 - phRPct - phYPct
  const phR = Math.round(phaseTotal * phRPct)
  const phY = Math.round(phaseTotal * phYPct)
  const phB = Math.round(phaseTotal * phBPct)
  const phMax = Math.max(phR, phY, phB)
  const phMin = Math.min(phR, phY, phB)
  const phAvg = (phR + phY + phB) / 3
  const phImbalance = Math.round(((phMax - phMin) / phAvg) * 100)
  const phMaxLetter = phR === phMax ? 'R' : phY === phMax ? 'Y' : 'B'
  const phImbColor = phImbalance >= 20 ? 'var(--red)' : phImbalance >= 12 ? 'var(--amber)' : 'var(--green)'

  const color = dt.loss > 20 ? 'var(--red)' : dt.loss > 15 ? 'var(--amber)' : 'var(--green)'
  const loadColor = dt.load > 85 ? 'var(--red)' : dt.load > 70 ? 'var(--amber)' : 'var(--green)'

  // Filter list — mirrors prototype's filterDTConsumers()
  const { filtered, filterLabel } = useMemo(() => {
    if (filter === 'critical') return { filtered: critical, filterLabel: '(showing critical, ranked by risk)' }
    if (filter === 'flagged') return { filtered: susp, filterLabel: '(showing all flagged, ranked by risk)' }
    if (filter === 'industrial')
      return { filtered: susp.filter((c) => c.cat === 'Industrial'), filterLabel: '(showing flagged Industrial)' }
    return { filtered: susp.filter((c) => c.cat === 'Commercial'), filterLabel: '(showing flagged Commercial)' }
  }, [filter, critical, susp])
  const displayed = filtered.slice(0, 10)
  const remaining = filtered.length - displayed.length

  // ── View-all mode: full paginated + searchable + sortable flagged-consumer list ──
  // Reuses the same map-detail sidepanel container so it slides in like the DT detail
  // did, per user request. Prototype behaviour is a full-screen modal; we chose in-panel
  // for a smoother UX.
  const PAGE_SIZE = 50
  const searchedSorted = useMemo(() => {
    let list = susp.slice()
    const q = searchTerm.trim().toLowerCase()
    if (q) {
      list = list.filter((c) => {
        return (
          c.id.toLowerCase().includes(q) ||
          c.cat.toLowerCase().includes(q) ||
          (c.name || '').toLowerCase().includes(q) ||
          (c.theftType || '').toLowerCase().includes(q)
        )
      })
    }
    if (sortKey === 'risk') list.sort((a, b) => b.risk - a.risk)
    else if (sortKey === 'events') list.sort((a, b) => b.events - a.events)
    else if (sortKey === 'drop') list.sort((a, b) => a.drop - b.drop)
    return list
  }, [susp, searchTerm, sortKey])
  const totalPages = Math.max(1, Math.ceil(searchedSorted.length / PAGE_SIZE))
  const currentPage = Math.max(1, Math.min(totalPages, page))
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, searchedSorted.length)
  const pageSlice = searchedSorted.slice(pageStart, pageEnd)

  if (viewMode === 'viewAll') {
    return (
      <>
        <div className="map-detail-header">
          <div className="map-detail-title">
            <span style={{ color }}>●</span> {dt.id} — full flagged list
          </div>
          <button type="button" className="map-detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="map-detail-body">
          <div className="map-breadcrumb">
            <span className="map-bc-item" onClick={onClose}>🗺️ Map</span>
            <span className="map-bc-sep">›</span>
            <span className="map-bc-item" onClick={onBack}>⚡ {dt.feeder}</span>
            <span className="map-bc-sep">›</span>
            <span className="map-bc-item" onClick={() => setViewMode('default')}>{dt.id}</span>
            <span className="map-bc-sep">›</span>
            <span className="map-bc-current">All flagged</span>
          </div>

          {/* Back to DT detail */}
          <button type="button" className="map-back-btn" onClick={() => setViewMode('default')}>
            ← Back to {dt.id}
          </button>

          {/* Header summary */}
          <div
            style={{
              padding: '8px 10px',
              background: 'var(--bg)',
              borderRadius: 8,
              marginBottom: 10,
              fontSize: 11,
              color: 'var(--text-mid)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
              {dt.area} · {dt.feeder} feeder
            </div>
            <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{susp.length}</span> of{' '}
            {formatIndian(cons.length)} consumers flagged ({flagRate}% rate)
          </div>

          {/* Search + sort strip */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Search by meter # or activity…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '6px 10px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 11.5,
                fontFamily: 'var(--font)',
                background: 'var(--card)',
                color: 'var(--text)',
              }}
            />
            <select
              value={sortKey}
              onChange={(e) => {
                setSortKey(e.target.value as 'risk' | 'events' | 'drop')
                setPage(1)
              }}
              style={{
                padding: '6px 8px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 11,
                background: 'var(--card)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              <option value="risk">By risk (highest)</option>
              <option value="events">By tamper events</option>
              <option value="drop">By kWh drop</option>
            </select>
          </div>

          {/* Result banner */}
          <div
            style={{
              padding: '6px 10px',
              fontSize: 10.5,
              color: 'var(--text-dim)',
              background: 'var(--bg)',
              borderRadius: 6,
              marginBottom: 6,
            }}
          >
            {searchedSorted.length === 0
              ? 'No consumers match this search.'
              : `Showing ${pageStart + 1}–${pageEnd} of ${searchedSorted.length}${searchTerm ? ' matching' : ' flagged'}`}
          </div>

          {/* Paged list */}
          {pageSlice.map((c) => (
            <DtConsumerRow
              key={c.id}
              c={c}
              onClick={() => onSelect({ feeder: parentFeeder, dt, consumer: c })}
            />
          ))}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
                padding: '10px 0',
                borderTop: '1px solid var(--border-light)',
                marginTop: 8,
              }}
            >
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                style={{
                  padding: '5px 12px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  borderRadius: 6,
                  fontSize: 11,
                  cursor: currentPage <= 1 ? 'default' : 'pointer',
                  opacity: currentPage <= 1 ? 0.4 : 1,
                }}
              >
                ‹ Prev
              </button>
              <span style={{ padding: '5px 10px', fontSize: 11, color: 'var(--text-dim)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                style={{
                  padding: '5px 12px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  borderRadius: 6,
                  fontSize: 11,
                  cursor: currentPage >= totalPages ? 'default' : 'pointer',
                  opacity: currentPage >= totalPages ? 0.4 : 1,
                }}
              >
                Next ›
              </button>
            </div>
          )}

          {/* Bottom actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
            <button
              type="button"
              className="map-action-btn btn-ai"
              style={{ margin: 0 }}
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Cases auto-created',
                  message: `Created cases for top 20 by risk under ${dt.id}. Routed to nearest inspectors.`,
                  duration: 5000,
                })
              }
            >
              ✦ Auto-create top 20 cases
            </button>
            <button
              type="button"
              className="map-action-btn btn-outline"
              style={{ margin: 0 }}
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'CSV export started',
                  message: `Exporting ${susp.length} flagged consumers from ${dt.id} with full evidence pack.`,
                  duration: 4000,
                })
              }
            >
              📥 Export all {susp.length}
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="map-detail-header">
        <div className="map-detail-title">
          <span style={{ color }}>●</span> {dt.id} — {dt.area}
        </div>
        <button type="button" className="map-detail-close" onClick={onClose}>✕</button>
      </div>

      <div className="map-detail-body">
        <div className="map-breadcrumb">
          <span className="map-bc-item" onClick={onClose}>🗺️ Map</span>
          <span className="map-bc-sep">›</span>
          <span className="map-bc-item" onClick={onBack}>⚡ {dt.feeder}</span>
          <span className="map-bc-sep">›</span>
          <span className="map-bc-current">{dt.id}</span>
        </div>

        {/* Back button — always shown, matching prototype behaviour */}
        <button type="button" className="map-back-btn" onClick={onBack}>
          ← Back to {dt.feeder}
        </button>

        {/* Headline strip — 3 KPIs (Critical / Flagged / Est. ₹) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          <div style={{ padding: '10px 8px', background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, color: 'var(--red)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>Critical</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--red)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>{critical.length}</div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>risk ≥ 80</div>
          </div>
          <div style={{ padding: '10px 8px', background: 'rgba(230,146,30,0.06)', border: '1px solid rgba(230,146,30,0.2)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, color: 'var(--amber)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>Flagged</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>{susp.length}</div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>{flagRate}% flag rate</div>
          </div>
          <div style={{ padding: '10px 8px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, color: 'var(--ai-purple)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>Est. ₹</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ai-purple)', fontFamily: 'var(--mono)', lineHeight: 1.1, marginTop: 2 }}>₹{(estRevenue / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>recovery</div>
          </div>
        </div>

        {/* Energy audit card */}
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.04) 0%,rgba(23,162,184,0.03) 100%)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Energy audit · DT-level reconciliation</div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>BEE 2021 mandate · monthly basis</div>
          </div>

          {/* 3-col reconciliation grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
            <div style={{ padding: 8, background: 'var(--bg)', borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.4px' }}>DT input (kWh)</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--id-text, #0284c7)', fontFamily: 'var(--mono)' }}>{dtInputMU.toFixed(1)}k</div>
              <div style={{ fontSize: 9, color: 'var(--text-mid)' }}>DT meter · last 30 days</div>
            </div>
            <div style={{ padding: 8, background: 'var(--bg)', borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Σ billed (kWh)</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--mono)' }}>{dtBilledMU.toFixed(1)}k</div>
              <div style={{ fontSize: 9, color: 'var(--text-mid)' }}>{formatIndian(cons.length)} consumers</div>
            </div>
            <div style={{ padding: 8, background: 'rgba(220,53,69,0.05)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Unaccounted</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--red)', fontFamily: 'var(--mono)' }}>{dtLossMU.toFixed(1)}k</div>
              <div style={{ fontSize: 9, color: 'var(--red)' }}>{dt.loss}% of input</div>
            </div>
          </div>

          {/* Loss decomposition bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: 'var(--bg)' }}>
              <div style={{ width: `${technicalLossBaseline}%`, background: 'var(--teal, #17a2b8)' }} title="Technical loss baseline" />
              <div style={{ width: `${commercialLossEst}%`, background: 'var(--red)' }} title="Estimated commercial loss / theft" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9.5, color: 'var(--text-mid)' }}>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--teal, #17a2b8)', borderRadius: 2, verticalAlign: 'middle' }} /> Technical ({technicalLossBaseline}%)</span>
              <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--red)', borderRadius: 2, verticalAlign: 'middle' }} /> Commercial / theft (~{commercialLossEst.toFixed(1)}%)</span>
            </div>
          </div>

          {/* Phase imbalance */}
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Three-phase load distribution</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: phImbColor, fontFamily: 'var(--mono)' }}>{phImbalance}% imbalance</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 4 }}>
              <div style={{ padding: '6px 8px', background: 'var(--bg)', borderRadius: 6, borderLeft: '3px solid var(--red)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 600 }}>R-phase</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text)' }}>{phR} A</div>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg)', borderRadius: 6, borderLeft: '3px solid var(--amber)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 600 }}>Y-phase</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text)' }}>{phY} A</div>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg)', borderRadius: 6, borderLeft: '3px solid var(--navy-light, #4B6BB8)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 600 }}>B-phase</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text)' }}>{phB} A</div>
              </div>
            </div>
            {phImbalance >= 12 ? (
              <div style={{ marginTop: 6, padding: '6px 8px', background: `rgba(${phImbalance >= 20 ? '220,53,69' : '230,146,30'},0.06)`, borderRadius: 6, fontSize: 10, color: 'var(--text-mid)', lineHeight: 1.4 }}>
                <strong style={{ color: phImbColor }}>⚠ {phImbalance >= 20 ? 'Severe' : 'Moderate'} imbalance on {phMaxLetter}-phase</strong> —{' '}
                {phImbalance >= 20
                  ? 'transformer overheating risk + possible bypass on under-loaded phase. Recommend physical inspection within 7 days.'
                  : 'load shifting may indicate selective bypass or unbalanced consumer wiring. Monitor next 30 days.'}
              </div>
            ) : (
              <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-mid)' }}>Within healthy band (&lt;12%). No action needed.</div>
            )}
          </div>
          <div style={{ marginTop: 8, fontSize: 9, color: 'var(--text-dim)', fontStyle: 'italic' }}>
            Note: phase currents are model estimates derived from DT load profile. Replace with live MRI phasor data when DT meter is integrated.
          </div>
        </div>

        {/* AI triage */}
        <div className="map-detail-ai">
          <strong>✦ AI triage:</strong>{' '}
          {dt.loss > 20 ? (
            <>
              This DTR has <strong>critically high losses ({dt.loss}%)</strong>. Of{' '}
              <strong>{formatIndian(cons.length)} consumers</strong>, <strong>{susp.length} are flagged</strong>{' '}
              ({flagRate}% flag rate vs network avg ~5%). <strong>{critical.length} are critical priority</strong>.
              Dominant theft type: {topTypeStr}.{' '}
            </>
          ) : dt.loss > 15 ? (
            <>Moderate losses at {dt.loss}%. {susp.length} consumer(s) flagged across {formatIndian(cons.length)} total. </>
          ) : (
            <>Operating within normal parameters ({dt.loss}% loss). {susp.length} flagged across {formatIndian(cons.length)} total. </>
          )}
          <strong>Recommended action: dispatch inspection team to top {Math.min(20, critical.length || 10)} critical meters first.</strong>
        </div>

        {/* Quick filter strip */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10, padding: 6, background: 'var(--bg)', borderRadius: 8 }}>
          <button type="button" className={`dt-filter-btn${filter === 'critical' ? ' active' : ''}`} onClick={() => setFilter('critical')}>
            ⚠ Critical {critical.length}
          </button>
          <button type="button" className={`dt-filter-btn${filter === 'flagged' ? ' active' : ''}`} onClick={() => setFilter('flagged')}>
            ⚡ All flagged {susp.length}
          </button>
          <button type="button" className={`dt-filter-btn${filter === 'industrial' ? ' active' : ''}`} onClick={() => setFilter('industrial')}>
            🏭 Industrial {susp.filter((c) => c.cat === 'Industrial').length}
          </button>
          <button type="button" className={`dt-filter-btn${filter === 'commercial' ? ' active' : ''}`} onClick={() => setFilter('commercial')}>
            🏪 Commercial {susp.filter((c) => c.cat === 'Commercial').length}
          </button>
        </div>

        {/* Top priority consumers */}
        <div className="map-detail-section">
          <div className="map-detail-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Top priority consumers{' '}
              <span style={{ fontWeight: 500, color: 'var(--text-dim)', textTransform: 'none', letterSpacing: 0, fontSize: 10, marginLeft: 6 }}>
                {filterLabel}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setViewMode('viewAll')
                setSearchTerm('')
                setPage(1)
              }}
              style={{ background: 'none', border: 'none', color: 'var(--ai-purple)', fontSize: 10.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              View all {susp.length} →
            </button>
          </div>

          {displayed.length === 0 ? (
            <div style={{ padding: 14, textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', background: 'var(--bg)', borderRadius: 6 }}>
              No consumers match this filter under this DTR.
            </div>
          ) : (
            <>
              {displayed.map((c) => (
                <DtConsumerRow
                  key={c.id}
                  c={c}
                  onClick={() => onSelect({ feeder: parentFeeder, dt, consumer: c })}
                />
              ))}
              {remaining > 0 && (
                <div style={{ padding: 8, textAlign: 'center', fontSize: 10.5, color: 'var(--text-dim)', background: 'var(--bg)', borderRadius: 6, marginTop: 6 }}>
                  Showing top 10 of {filtered.length} · click &quot;View all&quot; to see the rest
                </div>
              )}
            </>
          )}
        </div>

        {/* Distribution mini-charts */}
        <div className="map-detail-section">
          <div className="map-detail-label">Risk distribution &amp; breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* By risk band */}
            <div style={{ padding: '8px 10px', background: 'var(--bg)', borderRadius: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>By risk band</div>
              {[
                { label: 'Critical', count: critical.length, color: 'var(--red)' },
                { label: 'High', count: high.length, color: 'var(--amber)' },
                { label: 'Normal', count: normal.length, color: 'var(--green)' },
              ].map((band) => {
                const pct = cons.length > 0 ? (band.count / cons.length) * 100 : 0
                return (
                  <div key={band.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, fontSize: 10 }}>
                    <span style={{ color: band.color, fontWeight: 700, width: 14, textAlign: 'right' }}>{band.count}</span>
                    <div style={{ flex: 1, height: 9, background: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: band.color }} />
                    </div>
                    <span style={{ color: 'var(--text-dim)', fontSize: 9.5, width: 60 }}>{band.label}</span>
                  </div>
                )
              })}
            </div>

            {/* By activity category */}
            <div style={{ padding: '8px 10px', background: 'var(--bg)', borderRadius: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Flagged by activity</div>
              {topCat.length === 0 ? (
                <div style={{ fontSize: 10, color: 'var(--text-dim)', padding: '4px 0' }}>No flagged consumers</div>
              ) : (
                topCat.slice(0, 4).map(([cat, count]) => {
                  const maxCount = topCat[0][1]
                  return (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, fontSize: 10 }}>
                      <span style={{ color: 'var(--text)', fontWeight: 700, width: 14, textAlign: 'right' }}>{count}</span>
                      <div style={{ flex: 1, height: 9, background: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / maxCount) * 100}%`, background: 'var(--ai-purple)' }} />
                      </div>
                      <span style={{ color: 'var(--text-dim)', fontSize: 9.5, width: 60 }}>{cat}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* DT specifications */}
        <div className="map-detail-section">
          <div className="map-detail-label">DT specifications</div>
          <div className="map-detail-row"><span className="map-detail-key">Feeder</span><span className="map-detail-val">{dt.feeder}</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Loading</span><span className="map-detail-val" style={{ color: loadColor }}>{dt.load}%</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Loss %</span><span className="map-detail-val" style={{ color }}>{dt.loss}%</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Total consumers</span><span className="map-detail-val">{formatIndian(cons.length)}</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Lifetime tamper events</span><span className="map-detail-val">{formatIndian(totalEvents)}</span></div>
          <div className="map-detail-row"><span className="map-detail-key">Top theft signature</span><span className="map-detail-val" style={{ fontSize: 10.5 }}>{topTypeStr}</span></div>
        </div>

        {/* Bulk actions footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
          <button
            type="button"
            className="map-action-btn btn-ai"
            style={{ margin: 0 }}
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Cases auto-created',
                message: `Created ${Math.min(critical.length, 20)} priority cases for the top critical consumers under ${dt.id}. Routed to nearest inspector team.`,
                duration: 5000,
              })
            }
          >
            ✦ Auto-create top {Math.min(critical.length, 20)} cases
          </button>
          <button
            type="button"
            className="map-action-btn btn-outline"
            style={{ margin: 0 }}
            onClick={() =>
              showToast({
                type: 'info',
                title: 'CSV export started',
                message: `Exporting all ${susp.length} flagged consumers under ${dt.id} with full evidence and recommended actions.`,
                duration: 4000,
              })
            }
          >
            📥 Export {susp.length} flagged as CSV
          </button>
          <button
            type="button"
            className="map-action-btn btn-outline"
            style={{ margin: 0, gridColumn: '1 / -1' }}
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Inspection batch scheduled',
                message: `AI suggesting batch inspection for ${dt.id} on next available slot. ${critical.length} priority consumers grouped by route proximity.`,
                duration: 5000,
              })
            }
          >
            📅 Schedule inspection batch for {dt.id}
          </button>
        </div>
      </div>
    </>
  )
}
