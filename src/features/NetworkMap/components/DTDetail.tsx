import { useMemo, useState } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { generateConsumers } from '../logic/consumerGen'
import type { DT, Feeder, MapConsumer, NavContext } from '../types'
import {
  MapActionBtn,
  MapBackBtn,
  MapBcCurrent,
  MapBcItem,
  MapBcSep,
  MapBreadcrumb,
  MapConsumerItem,
  MapConsumerRisk,
  MapDetailAi,
  MapDetailBody,
  MapDetailHeader,
  MapDetailRow,
  MapDetailSection,
} from './MapDetailPrimitives'

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

/**
 * Compact per-consumer row used in the DT panel triage list (matches
 * prototype's dtConsumerRow). Uses MapConsumerItem + MapConsumerRisk
 * primitives.
 */
function DtConsumerRow({
  c,
  onClick,
}: {
  c: MapConsumer
  onClick: () => void
}) {
  const col =
    c.risk >= 80
      ? 'var(--red)'
      : c.risk >= 60
        ? 'var(--amber)'
        : 'var(--green)'
  const display = c.name ?? c.id
  return (
    <MapConsumerItem onClick={onClick}>
      <MapConsumerRisk color={col}>{c.risk}</MapConsumerRisk>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[11.5px] flex items-center flex-wrap break-words">
          {display.length > 28 ? display.substring(0, 28) + '…' : display}
          {c.isReal && (
            <span
              className="inline-block py-[1px] px-[5px] rounded-[6px] text-[8.5px] font-extrabold tracking-[0.3px] ml-[4px] align-middle"
              style={{
                background: 'rgba(40,167,69,.12)',
                color: 'var(--green)',
                border: '1px solid rgba(40,167,69,.3)',
              }}
            >
              ✓ REAL
            </span>
          )}
        </div>
        <div className="text-[10px] text-[var(--text-dim)] mt-[1px] break-words">
          {c.cat} · {c.events} events
          {c.theftType ? ' · ' + c.theftType : ''}
          {c.drop ? ' · ' + c.drop + '%' : ''}
        </div>
      </div>
      <span className="text-[var(--text-dim)] shrink-0">›</span>
    </MapConsumerItem>
  )
}

/** Filter pill (was .dt-filter-btn). */
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'py-[5px] px-[10px] rounded-[14px] border text-[10.5px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-150 ' +
        (active
          ? 'bg-[var(--ai-purple)] text-white border-[var(--ai-purple)] shadow-[0_1px_3px_rgba(124,58,237,0.3)]'
          : 'bg-[var(--card)] text-[var(--text-mid)] border-[var(--border)] hover:border-[var(--ai-purple)] hover:text-[var(--ai-purple)] hover:bg-[rgba(124,58,237,0.04)]')
      }
    >
      {children}
    </button>
  )
}

/** DT detail — direct port of prototype's showDTDetail(). */
export function DTDetail({
  dt,
  parentFeeder,
  onSelect,
  onBack,
  onClose,
}: DTDetailProps) {
  const { showToast } = useToast()
  const [filter, setFilter] = useState<FilterKey>('critical')
  const [viewMode, setViewMode] = useState<'default' | 'viewAll'>('default')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<'risk' | 'events' | 'drop'>('risk')
  const [page, setPage] = useState(1)

  const cons = useMemo(() => generateConsumers([dt]), [dt])
  const susp = useMemo(
    () => cons.filter((c) => c.isTheft).sort((a, b) => b.risk - a.risk),
    [cons],
  )
  const critical = useMemo(
    () => cons.filter((c) => c.isCritical).sort((a, b) => b.risk - a.risk),
    [cons],
  )
  const high = useMemo(
    () => cons.filter((c) => c.isTheft && !c.isCritical),
    [cons],
  )
  const normal = useMemo(() => cons.filter((c) => !c.isTheft), [cons])
  const flagRate =
    cons.length > 0 ? ((susp.length / cons.length) * 100).toFixed(1) : '0.0'

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
  const phMaxLetter =
    phR === phMax ? 'R' : phY === phMax ? 'Y' : 'B'
  const phImbColor =
    phImbalance >= 20
      ? 'var(--red)'
      : phImbalance >= 12
        ? 'var(--amber)'
        : 'var(--green)'

  const color =
    dt.loss > 20
      ? 'var(--red)'
      : dt.loss > 15
        ? 'var(--amber)'
        : 'var(--green)'
  const loadColor =
    dt.load > 85
      ? 'var(--red)'
      : dt.load > 70
        ? 'var(--amber)'
        : 'var(--green)'

  // Filter list — mirrors prototype's filterDTConsumers()
  const { filtered, filterLabel } = useMemo(() => {
    if (filter === 'critical')
      return {
        filtered: critical,
        filterLabel: '(showing critical, ranked by risk)',
      }
    if (filter === 'flagged')
      return {
        filtered: susp,
        filterLabel: '(showing all flagged, ranked by risk)',
      }
    if (filter === 'industrial')
      return {
        filtered: susp.filter((c) => c.cat === 'Industrial'),
        filterLabel: '(showing flagged Industrial)',
      }
    return {
      filtered: susp.filter((c) => c.cat === 'Commercial'),
      filterLabel: '(showing flagged Commercial)',
    }
  }, [filter, critical, susp])
  const displayed = filtered.slice(0, 10)
  const remaining = filtered.length - displayed.length

  // ── View-all mode: full paginated + searchable + sortable flagged list ──
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

  /* ─── VIEW-ALL MODE ─── */
  if (viewMode === 'viewAll') {
    return (
      <>
        <MapDetailHeader
          title={
            <>
              <span style={{ color }}>●</span> {dt.id} — full flagged list
            </>
          }
          onClose={onClose}
        />

        <MapDetailBody>
          <MapBreadcrumb>
            <MapBcItem onClick={onClose}>🗺️ Map</MapBcItem>
            <MapBcSep />
            <MapBcItem onClick={onBack}>⚡ {dt.feeder}</MapBcItem>
            <MapBcSep />
            <MapBcItem onClick={() => setViewMode('default')}>
              {dt.id}
            </MapBcItem>
            <MapBcSep />
            <MapBcCurrent>All flagged</MapBcCurrent>
          </MapBreadcrumb>

          <MapBackBtn onClick={() => setViewMode('default')}>
            ← Back to {dt.id}
          </MapBackBtn>

          {/* Header summary */}
          <div className="py-[8px] px-[10px] bg-[var(--bg)] rounded-[8px] mb-[10px] text-[11px] text-[var(--text-mid)] leading-[1.5]">
            <div className="text-[12px] font-bold text-[var(--text)] mb-[2px]">
              {dt.area} · {dt.feeder} feeder
            </div>
            <span className="text-[var(--amber)] font-semibold">
              {susp.length}
            </span>{' '}
            of {formatIndian(cons.length)} consumers flagged ({flagRate}% rate)
          </div>

          {/* Search + sort strip */}
          <div className="flex gap-[6px] items-center mb-[10px] flex-wrap">
            <input
              type="text"
              placeholder="Search by meter # or activity…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="flex-1 min-w-0 py-[6px] px-[10px] border border-[var(--border)] rounded-[6px] text-[11.5px] font-sans bg-[var(--card)] text-[var(--text)] outline-none focus:border-[var(--ai-purple)]"
            />
            <select
              value={sortKey}
              onChange={(e) => {
                setSortKey(e.target.value as 'risk' | 'events' | 'drop')
                setPage(1)
              }}
              className="py-[6px] px-[8px] border border-[var(--border)] rounded-[6px] text-[11px] bg-[var(--card)] text-[var(--text)] cursor-pointer"
            >
              <option value="risk">By risk (highest)</option>
              <option value="events">By tamper events</option>
              <option value="drop">By kWh drop</option>
            </select>
          </div>

          {/* Result banner */}
          <div className="py-[6px] px-[10px] text-[10.5px] text-[var(--text-dim)] bg-[var(--bg)] rounded-[6px] mb-[6px]">
            {searchedSorted.length === 0
              ? 'No consumers match this search.'
              : `Showing ${pageStart + 1}–${pageEnd} of ${searchedSorted.length}${searchTerm ? ' matching' : ' flagged'}`}
          </div>

          {/* Paged list */}
          {pageSlice.map((c) => (
            <DtConsumerRow
              key={c.id}
              c={c}
              onClick={() =>
                onSelect({ feeder: parentFeeder, dt, consumer: c })
              }
            />
          ))}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-[6px] py-[10px] border-t border-[var(--border-light)] mt-[8px]">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className={
                  'py-[5px] px-[12px] border border-[var(--border)] bg-[var(--card)] rounded-[6px] text-[11px] ' +
                  (currentPage <= 1
                    ? 'cursor-default opacity-40'
                    : 'cursor-pointer')
                }
              >
                ‹ Prev
              </button>
              <span className="py-[5px] px-[10px] text-[11px] text-[var(--text-dim)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className={
                  'py-[5px] px-[12px] border border-[var(--border)] bg-[var(--card)] rounded-[6px] text-[11px] ' +
                  (currentPage >= totalPages
                    ? 'cursor-default opacity-40'
                    : 'cursor-pointer')
                }
              >
                Next ›
              </button>
            </div>
          )}

          {/* Bottom actions */}
          <div className="grid grid-cols-2 gap-[6px] mt-[10px]">
            <MapActionBtn
              variant="ai"
              className="!mt-0"
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
            </MapActionBtn>
            <MapActionBtn
              variant="outline"
              className="!mt-0"
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
            </MapActionBtn>
          </div>
        </MapDetailBody>
      </>
    )
  }

  /* ─── DEFAULT MODE ─── */
  return (
    <>
      <MapDetailHeader
        title={
          <>
            <span style={{ color }}>●</span> {dt.id} — {dt.area}
          </>
        }
        onClose={onClose}
      />

      <MapDetailBody>
        <MapBreadcrumb>
          <MapBcItem onClick={onClose}>🗺️ Map</MapBcItem>
          <MapBcSep />
          <MapBcItem onClick={onBack}>⚡ {dt.feeder}</MapBcItem>
          <MapBcSep />
          <MapBcCurrent>{dt.id}</MapBcCurrent>
        </MapBreadcrumb>

        <MapBackBtn onClick={onBack}>← Back to {dt.feeder}</MapBackBtn>

        {/* Headline strip — 3 KPIs (Critical / Flagged / Est. ₹) */}
        <div className="grid grid-cols-3 gap-[6px] mb-[12px]">
          <div
            className="py-[10px] px-[8px] rounded-[8px] text-center border text-[var(--red)]"
            style={{
              background: 'rgba(220,53,69,0.06)',
              borderColor: 'rgba(220,53,69,0.2)',
            }}
          >
            <div className="text-[9.5px] font-bold tracking-[0.4px] uppercase">
              Critical
            </div>
            <div className="text-[22px] font-extrabold font-mono leading-[1.1] mt-[2px]">
              {critical.length}
            </div>
            <div className="text-[9px] text-[var(--text-dim)] mt-[1px]">
              risk ≥ 80
            </div>
          </div>
          <div
            className="py-[10px] px-[8px] rounded-[8px] text-center border text-[var(--amber)]"
            style={{
              background: 'rgba(230,146,30,0.06)',
              borderColor: 'rgba(230,146,30,0.2)',
            }}
          >
            <div className="text-[9.5px] font-bold tracking-[0.4px] uppercase">
              Flagged
            </div>
            <div className="text-[22px] font-extrabold font-mono leading-[1.1] mt-[2px]">
              {susp.length}
            </div>
            <div className="text-[9px] text-[var(--text-dim)] mt-[1px]">
              {flagRate}% flag rate
            </div>
          </div>
          <div
            className="py-[10px] px-[8px] rounded-[8px] text-center border text-[var(--ai-purple)]"
            style={{
              background: 'rgba(124,58,237,0.06)',
              borderColor: 'rgba(124,58,237,0.2)',
            }}
          >
            <div className="text-[9.5px] font-bold tracking-[0.4px] uppercase">
              Est. ₹
            </div>
            <div className="text-[18px] font-extrabold font-mono leading-[1.1] mt-[2px]">
              ₹{(estRevenue / 100000).toFixed(1)}L
            </div>
            <div className="text-[9px] text-[var(--text-dim)] mt-[1px]">
              recovery
            </div>
          </div>
        </div>

        {/* Energy audit card */}
        <div
          className="border border-[var(--border)] rounded-[10px] p-[12px] mb-[12px]"
          style={{
            background:
              'linear-gradient(135deg,rgba(124,58,237,0.04) 0%,rgba(23,162,184,0.03) 100%)',
          }}
        >
          <div className="flex justify-between items-baseline mb-[10px] gap-[8px] flex-wrap">
            <div className="text-[11px] font-bold text-[var(--text)] uppercase tracking-[0.4px]">
              Energy audit · DT-level reconciliation
            </div>
            <div className="text-[9px] text-[var(--text-dim)]">
              BEE 2021 mandate · monthly basis
            </div>
          </div>

          {/* 3-col reconciliation grid */}
          <div className="grid grid-cols-3 gap-[8px] mb-[10px]">
            <div className="p-[8px] bg-[var(--bg)] rounded-[6px]">
              <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.4px]">
                DT input (kWh)
              </div>
              <div
                className="text-[14px] font-extrabold font-mono"
                style={{ color: 'var(--id-text, #0284c7)' }}
              >
                {dtInputMU.toFixed(1)}k
              </div>
              <div className="text-[9px] text-[var(--text-mid)]">
                DT meter · last 30 days
              </div>
            </div>
            <div className="p-[8px] bg-[var(--bg)] rounded-[6px]">
              <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.4px]">
                Σ billed (kWh)
              </div>
              <div className="text-[14px] font-extrabold font-mono text-[var(--green)]">
                {dtBilledMU.toFixed(1)}k
              </div>
              <div className="text-[9px] text-[var(--text-mid)]">
                {formatIndian(cons.length)} consumers
              </div>
            </div>
            <div
              className="p-[8px] rounded-[6px] border"
              style={{
                background: 'rgba(220,53,69,0.05)',
                borderColor: 'rgba(220,53,69,0.2)',
              }}
            >
              <div className="text-[9px] text-[var(--red)] uppercase tracking-[0.4px] font-semibold">
                Unaccounted
              </div>
              <div className="text-[14px] font-extrabold font-mono text-[var(--red)]">
                {dtLossMU.toFixed(1)}k
              </div>
              <div className="text-[9px] text-[var(--red)]">
                {dt.loss}% of input
              </div>
            </div>
          </div>

          {/* Loss decomposition bar */}
          <div className="mb-[10px]">
            <div className="flex h-[10px] rounded-[5px] overflow-hidden bg-[var(--bg)]">
              <div
                title="Technical loss baseline"
                style={{
                  width: `${technicalLossBaseline}%`,
                  background: 'var(--teal, #17a2b8)',
                }}
              />
              <div
                title="Estimated commercial loss / theft"
                style={{
                  width: `${commercialLossEst}%`,
                  background: 'var(--red)',
                }}
              />
            </div>
            <div className="flex justify-between mt-[4px] text-[9.5px] text-[var(--text-mid)] gap-[6px] flex-wrap">
              <span>
                <span
                  className="inline-block w-[8px] h-[8px] rounded-[2px] align-middle"
                  style={{ background: 'var(--teal, #17a2b8)' }}
                />{' '}
                Technical ({technicalLossBaseline}%)
              </span>
              <span>
                <span
                  className="inline-block w-[8px] h-[8px] rounded-[2px] align-middle"
                  style={{ background: 'var(--red)' }}
                />{' '}
                Commercial / theft (~{commercialLossEst.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Phase imbalance */}
          <div className="border-t border-dashed border-[var(--border)] pt-[10px]">
            <div className="flex justify-between items-baseline mb-[6px] gap-[8px] flex-wrap">
              <div className="text-[10.5px] font-bold text-[var(--text)] uppercase tracking-[0.4px]">
                Three-phase load distribution
              </div>
              <div
                className="text-[11px] font-bold font-mono"
                style={{ color: phImbColor }}
              >
                {phImbalance}% imbalance
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[6px] mb-[4px]">
              <div className="py-[6px] px-[8px] bg-[var(--bg)] rounded-[6px] border-l-[3px] border-l-[var(--red)]">
                <div className="text-[9px] text-[var(--text-dim)] font-semibold">
                  R-phase
                </div>
                <div className="text-[13px] font-bold font-mono text-[var(--text)]">
                  {phR} A
                </div>
              </div>
              <div className="py-[6px] px-[8px] bg-[var(--bg)] rounded-[6px] border-l-[3px] border-l-[var(--amber)]">
                <div className="text-[9px] text-[var(--text-dim)] font-semibold">
                  Y-phase
                </div>
                <div className="text-[13px] font-bold font-mono text-[var(--text)]">
                  {phY} A
                </div>
              </div>
              <div
                className="py-[6px] px-[8px] bg-[var(--bg)] rounded-[6px] border-l-[3px]"
                style={{ borderLeftColor: 'var(--navy-light, #4B6BB8)' }}
              >
                <div className="text-[9px] text-[var(--text-dim)] font-semibold">
                  B-phase
                </div>
                <div className="text-[13px] font-bold font-mono text-[var(--text)]">
                  {phB} A
                </div>
              </div>
            </div>
            {phImbalance >= 12 ? (
              <div
                className="mt-[6px] py-[6px] px-[8px] rounded-[6px] text-[10px] text-[var(--text-mid)] leading-[1.4] break-words"
                style={{
                  background: `rgba(${phImbalance >= 20 ? '220,53,69' : '230,146,30'},0.06)`,
                }}
              >
                <strong style={{ color: phImbColor }}>
                  ⚠ {phImbalance >= 20 ? 'Severe' : 'Moderate'} imbalance on{' '}
                  {phMaxLetter}-phase
                </strong>{' '}
                —{' '}
                {phImbalance >= 20
                  ? 'transformer overheating risk + possible bypass on under-loaded phase. Recommend physical inspection within 7 days.'
                  : 'load shifting may indicate selective bypass or unbalanced consumer wiring. Monitor next 30 days.'}
              </div>
            ) : (
              <div className="mt-[6px] text-[10px] text-[var(--text-mid)]">
                Within healthy band (&lt;12%). No action needed.
              </div>
            )}
          </div>
          <div className="mt-[8px] text-[9px] text-[var(--text-dim)] italic">
            Note: phase currents are model estimates derived from DT load
            profile. Replace with live MRI phasor data when DT meter is
            integrated.
          </div>
        </div>

        {/* AI triage */}
        <MapDetailAi>
          <strong>✦ AI triage:</strong>{' '}
          {dt.loss > 20 ? (
            <>
              This DTR has{' '}
              <strong>critically high losses ({dt.loss}%)</strong>. Of{' '}
              <strong>{formatIndian(cons.length)} consumers</strong>,{' '}
              <strong>{susp.length} are flagged</strong> ({flagRate}% flag rate
              vs network avg ~5%).{' '}
              <strong>{critical.length} are critical priority</strong>.
              Dominant theft type: {topTypeStr}.{' '}
            </>
          ) : dt.loss > 15 ? (
            <>
              Moderate losses at {dt.loss}%. {susp.length} consumer(s) flagged
              across {formatIndian(cons.length)} total.{' '}
            </>
          ) : (
            <>
              Operating within normal parameters ({dt.loss}% loss).{' '}
              {susp.length} flagged across {formatIndian(cons.length)} total.{' '}
            </>
          )}
          <strong>
            Recommended action: dispatch inspection team to top{' '}
            {Math.min(20, critical.length || 10)} critical meters first.
          </strong>
        </MapDetailAi>

        {/* Quick filter strip (was .dt-filter-btn) */}
        <div className="flex gap-[5px] flex-wrap mb-[10px] p-[6px] bg-[var(--bg)] rounded-[8px]">
          <FilterPill
            active={filter === 'critical'}
            onClick={() => setFilter('critical')}
          >
            ⚠ Critical {critical.length}
          </FilterPill>
          <FilterPill
            active={filter === 'flagged'}
            onClick={() => setFilter('flagged')}
          >
            ⚡ All flagged {susp.length}
          </FilterPill>
          <FilterPill
            active={filter === 'industrial'}
            onClick={() => setFilter('industrial')}
          >
            🏭 Industrial{' '}
            {susp.filter((c) => c.cat === 'Industrial').length}
          </FilterPill>
          <FilterPill
            active={filter === 'commercial'}
            onClick={() => setFilter('commercial')}
          >
            🏪 Commercial{' '}
            {susp.filter((c) => c.cat === 'Commercial').length}
          </FilterPill>
        </div>

        {/* Top priority consumers */}
        <MapDetailSection
          label={
            <>
              Top priority consumers{' '}
              <span className="font-medium text-[var(--text-dim)] normal-case tracking-normal text-[10px] ml-[6px]">
                {filterLabel}
              </span>
            </>
          }
          labelRight={
            <button
              type="button"
              onClick={() => {
                setViewMode('viewAll')
                setSearchTerm('')
                setPage(1)
              }}
              className="bg-transparent border-none text-[var(--ai-purple)] text-[10.5px] font-semibold cursor-pointer p-0"
            >
              View all {susp.length} →
            </button>
          }
        >
          {displayed.length === 0 ? (
            <div className="p-[14px] text-center text-[11px] text-[var(--text-dim)] bg-[var(--bg)] rounded-[6px]">
              {filter === 'critical'
                ? 'No critical-priority consumers under this DTR.'
                : 'No consumers match this filter under this DTR.'}
            </div>
          ) : (
            <>
              {displayed.map((c) => (
                <DtConsumerRow
                  key={c.id}
                  c={c}
                  onClick={() =>
                    onSelect({ feeder: parentFeeder, dt, consumer: c })
                  }
                />
              ))}
              {remaining > 0 && (
                <div className="p-[8px] text-center text-[10.5px] text-[var(--text-dim)] bg-[var(--bg)] rounded-[6px] mt-[6px]">
                  Showing top 10 of {filtered.length}
                  {filter === 'critical' ? ' critical' : ''} · click &quot;View
                  all&quot; to see the rest
                </div>
              )}
            </>
          )}
        </MapDetailSection>

        {/* Distribution mini-charts */}
        <MapDetailSection label="Risk distribution & breakdown">
          <div className="grid grid-cols-2 gap-[8px]">
            {/* By risk band */}
            <div className="py-[8px] px-[10px] bg-[var(--bg)] rounded-[6px]">
              <div className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.4px] mb-[6px]">
                By risk band
              </div>
              {[
                {
                  label: 'Critical',
                  count: critical.length,
                  color: 'var(--red)',
                },
                { label: 'High', count: high.length, color: 'var(--amber)' },
                {
                  label: 'Normal',
                  count: normal.length,
                  color: 'var(--green)',
                },
              ].map((band) => {
                const pct =
                  cons.length > 0 ? (band.count / cons.length) * 100 : 0
                return (
                  <div
                    key={band.label}
                    className="flex items-center gap-[6px] mb-[3px] text-[10px]"
                  >
                    <span
                      className="font-bold w-[14px] text-right"
                      style={{ color: band.color }}
                    >
                      {band.count}
                    </span>
                    <div className="flex-1 h-[9px] bg-[rgba(0,0,0,0.05)] rounded-[3px] overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${pct}%`,
                          background: band.color,
                        }}
                      />
                    </div>
                    <span className="text-[var(--text-dim)] text-[9.5px] w-[60px]">
                      {band.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* By activity category */}
            <div className="py-[8px] px-[10px] bg-[var(--bg)] rounded-[6px]">
              <div className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.4px] mb-[6px]">
                Flagged by activity
              </div>
              {topCat.length === 0 ? (
                <div className="text-[10px] text-[var(--text-dim)] py-[4px]">
                  No flagged consumers
                </div>
              ) : (
                topCat.slice(0, 4).map(([cat, count]) => {
                  const maxCount = topCat[0][1]
                  return (
                    <div
                      key={cat}
                      className="flex items-center gap-[6px] mb-[3px] text-[10px]"
                    >
                      <span className="text-[var(--text)] font-bold w-[14px] text-right">
                        {count}
                      </span>
                      <div className="flex-1 h-[9px] bg-[rgba(0,0,0,0.05)] rounded-[3px] overflow-hidden">
                        <div
                          className="h-full bg-[var(--ai-purple)]"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-[var(--text-dim)] text-[9.5px] w-[60px]">
                        {cat}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </MapDetailSection>

        {/* DT specifications */}
        <MapDetailSection label="DT specifications">
          <MapDetailRow label="Feeder" value={dt.feeder} />
          <MapDetailRow
            label="Loading"
            value={`${dt.load}%`}
            valueColor={loadColor}
          />
          <MapDetailRow
            label="Loss %"
            value={`${dt.loss}%`}
            valueColor={color}
          />
          <MapDetailRow label="Total consumers" value={formatIndian(cons.length)} />
          <MapDetailRow
            label="Lifetime tamper events"
            value={formatIndian(totalEvents)}
          />
          <MapDetailRow
            label="Top theft signature"
            value={topTypeStr}
            valueFontSize={10.5}
          />
        </MapDetailSection>

        {/* Bulk actions footer */}
        <div className="grid grid-cols-2 gap-[6px] mt-[8px]">
          <MapActionBtn
            variant="ai"
            className="!mt-0"
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
          </MapActionBtn>
          <MapActionBtn
            variant="outline"
            className="!mt-0"
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
          </MapActionBtn>
          <MapActionBtn
            variant="outline"
            className="!mt-0 col-span-2"
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
          </MapActionBtn>
        </div>
      </MapDetailBody>
    </>
  )
}
