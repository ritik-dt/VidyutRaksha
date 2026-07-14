/**
 * CasesListDrawer — exact port of prototype's openCaseList + renderCaseListPage
 * panel: maxWidth 800px, height 100vh, rounded left side
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/shared/utils/formatters'
import { formatIndian } from '@/shared/utils/formatters'
import type { CaseRecord, CasesStats } from './types'
import { CaseStatusBadge as StatusBadge } from './CaseStatusBadge'

const PAGE_SIZE = 25

interface Props {
  scopeName: string
  scopeType: string
  stats: CasesStats
  records: CaseRecord[]
  initialStatusFilter?: string
  onReassign: (caseRecord: CaseRecord) => void
  onClose: () => void
}


/* ── is past SLA? — exact prototype logic ── */
const TODAY = new Date('2026-04-01')
function isPastSla(c: CaseRecord) {
  try {
    return (
      new Date(c.due) < TODAY &&
      c.status !== 'Confirmed Theft' &&
      c.status !== 'False Positive' &&
      c.status !== 'Closed'
    )
  } catch { return false }
}

/* ── status pill button — variant-based Tailwind classes ── */
type PillVariant = 'all' | 'pastsla' | 'open' | 'inprogress' | 'confirmed' | 'closed'
const PILL_CLASSES: Record<PillVariant, { active: string; inactive: string }> = {
  all:        { active: 'border-[#0EA5E9] bg-[#0EA5E9] text-white', inactive: 'border-border bg-card text-text' },
  pastsla:    { active: 'border-[#FF4757] bg-[#FF4757] text-white', inactive: 'border-[rgba(255,71,87,0.3)] bg-[rgba(255,71,87,0.08)] text-[#D43645]' },
  open:       { active: 'border-[#0EA5E9] bg-[#0EA5E9] text-white', inactive: 'border-[rgba(14,165,233,0.3)] bg-[rgba(14,165,233,0.08)] text-[#0284C7]' },
  inprogress: { active: 'border-[#E6921E] bg-[#E6921E] text-white', inactive: 'border-[rgba(230,146,30,0.3)] bg-[rgba(230,146,30,0.08)] text-[var(--amber-dark)]' },
  confirmed:  { active: 'border-[#28A745] bg-[#28A745] text-white', inactive: 'border-[rgba(40,167,69,0.3)] bg-[rgba(40,167,69,0.08)] text-[#1E7E34]' },
  closed:     { active: 'border-[#6B7280] bg-[#6B7280] text-white', inactive: 'border-[rgba(107,114,128,0.3)] bg-[rgba(107,114,128,0.08)] text-[#4B5563]' },
}
function Pill({ label, active, variant, onClick }: { label: string; active: boolean; variant: PillVariant; onClick: () => void }) {
  const cls = active ? PILL_CLASSES[variant].active : PILL_CLASSES[variant].inactive
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 cursor-pointer rounded-[14px] border px-[11px] py-[5px] text-[11px] font-semibold whitespace-nowrap transition-all duration-150 ${cls}`}
    >
      {label}
    </button>
  )
}

/* ── view button with hover ── */
function ViewBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-[10.5px] font-semibold whitespace-nowrap text-[#0EA5E9] transition-all duration-150 hover:border-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
    >
      View →
    </button>
  )
}

/* ── PageBtn for pagination ── */
function PageBtn({ label, active, onClick, hideOnMobile }: { label: string; active?: boolean; onClick: () => void; hideOnMobile?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[30px] cursor-pointer rounded-md border px-[11px] py-[5px] text-[11px] ${hideOnMobile ? 'max-sm:hidden ' : ''}${active ? 'border-[#0EA5E9] bg-[#0EA5E9] font-bold text-white' : 'border-border bg-white font-semibold text-text'}`}
    >
      {label}
    </button>
  )
}

export function CasesListDrawer({ scopeName, scopeType, stats, records, initialStatusFilter, onClose, onReassign }: Props) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter ?? '')
  const [search, setSearch]     = useState('')
  const [sortKey, setSortKey]   = useState('due')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const bodyRef = useRef<HTMLDivElement>(null)

  /* close on Escape */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  /* reset page when filter/search changes */
  useEffect(() => { setPage(1); bodyRef.current?.scrollTo(0, 0) }, [statusFilter, search, sortKey])

  /* ── filter + sort — exact prototype renderCaseListPage logic ── */
  const filtered = useMemo(() => {
    let rows = [...records]
    if (statusFilter === 'Past SLA') {
      rows = rows.filter(isPastSla)
    } else if (statusFilter === 'Closed') {
      rows = rows.filter((c) => c.status === 'Closed' || c.status === 'False Positive')
    } else if (statusFilter) {
      rows = rows.filter((c) => c.status === statusFilter)
    }
    if (search.trim()) {
      const s = search.toLowerCase()
      rows = rows.filter((c) =>
        (c.id || '').toLowerCase().includes(s) ||
        (c.meter || '').toLowerCase().includes(s) ||
        (c.consumer || '').toLowerCase().includes(s) ||
        (c.area || '').toLowerCase().includes(s) ||
        (c.assignee || '').toLowerCase().includes(s),
      )
    }
    if (sortKey === 'risk')     rows.sort((a, b) => b.risk - a.risk)
    else if (sortKey === 'due') rows.sort((a, b) => { try { return +new Date(a.due) - +new Date(b.due) } catch { return 0 } })
    else if (sortKey === 'created') rows.sort((a, b) => { try { return +new Date(b.created) - +new Date(a.created) } catch { return 0 } })
    else if (sortKey === 'assignee') rows.sort((a, b) => (a.assignee || '').localeCompare(b.assignee || ''))
    return rows
  }, [records, statusFilter, search, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage    = Math.max(1, Math.min(page, totalPages))
  const start      = (curPage - 1) * PAGE_SIZE
  const slice      = filtered.slice(start, start + PAGE_SIZE)

  /* ── status bar pct ── */
  const tot  = stats.total || 1
  const pPct = ((stats.pastSla   / tot) * 100).toFixed(1)
  const oPct = ((stats.open      / tot) * 100).toFixed(1)
  const iPct = ((stats.inProgress/ tot) * 100).toFixed(1)
  const cPct = ((stats.confirmed / tot) * 100).toFixed(1)
  const xPct = Math.max(0, 100 - +pPct - +oPct - +iPct - +cPct).toFixed(1)

  /* ── selection helpers ── */
  function toggleRow(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function selectVisible(checked: boolean) {
    setSelected((prev) => {
      const n = new Set(prev)
      slice.forEach((c) => checked ? n.add(c.id) : n.delete(c.id))
      return n
    })
  }
  function clearSelection() { setSelected(new Set()) }

  function bulkAction(action: string) {
    if (selected.size === 0) return
    if (action === 'reassign') {
      const first = records.find((r) => selected.has(r.id))
      if (first) onReassign(first)
      return
    }
    const msgs: Record<string, string> = {
      reassign: `${selected.size} cases reassigned to available inspectors.`,
      escalate: `${selected.size} cases escalated to next-level supervisor.`,
      close:    `${selected.size} cases marked closed. Assessments archived.`,
    }
    showToast({ type: 'success', title: action === 'close' ? 'Bulk closed' : action === 'escalate' ? 'Escalated' : 'Reassigned', message: msgs[action], duration: 4000 })
    clearSelection()
  }

  /* ── pagination buttons ── */
  function paginationButtons() {
    const startPg = Math.max(1, Math.min(curPage - 2, totalPages - 4))
    const endPg   = Math.min(totalPages, startPg + 4)
    const btns: React.ReactNode[] = []
    if (curPage > 1) {
      btns.push(<PageBtn key="first" label="« First" hideOnMobile onClick={() => setPage(1)} />)
      btns.push(<PageBtn key="prev"  label="‹ Prev"  onClick={() => setPage(curPage - 1)} />)
    }
    for (let p = startPg; p <= endPg; p++) {
      btns.push(<PageBtn key={p} label={String(p)} active={p === curPage} onClick={() => setPage(p)} />)
    }
    if (curPage < totalPages) {
      btns.push(<PageBtn key="next" label="Next ›"  onClick={() => setPage(curPage + 1)} />)
      btns.push(<PageBtn key="last" label="Last »"  hideOnMobile onClick={() => setPage(totalPages)} />)
    }
    return btns
  }

  const filterLabel = statusFilter === 'Past SLA' ? 'Showing Past SLA cases'
    : statusFilter === 'Assigned'        ? 'Showing Open (assigned) cases'
    : statusFilter === 'In Progress'     ? 'Showing In progress cases'
    : statusFilter === 'Confirmed Theft' ? 'Showing Confirmed cases'
    : statusFilter === 'Closed'          ? 'Showing Closed cases'
    : 'All cases at this scope'

  const breakdownBars: [string, string, string][] = [
    ['#FF4757', pPct, `Past SLA: ${formatIndian(stats.pastSla)}`],
    ['#0EA5E9', oPct, `Open: ${formatIndian(stats.open)}`],
    ['#FFA502', iPct, `In progress: ${formatIndian(stats.inProgress)}`],
    ['#28A745', cPct, `Confirmed: ${formatIndian(stats.confirmed)}`],
    ['#9CA3AF', xPct, `Closed: ${formatIndian(stats.closed)}`],
  ]
  const breakdownLegend: [string, string][] = [
    ['#FF4757', `Past SLA ${formatIndian(stats.pastSla)} (${Math.round(+pPct)}%)`],
    ['#0EA5E9', `Open ${formatIndian(stats.open)} (${Math.round(+oPct)}%)`],
    ['#FFA502', `In progress ${formatIndian(stats.inProgress)} (${Math.round(+iPct)}%)`],
    ['#28A745', `Confirmed ${formatIndian(stats.confirmed)} (${Math.round(+cPct)}%)`],
    ['#9CA3AF', `Closed ${formatIndian(stats.closed)} (${Math.round(+xPct)}%)`],
  ]

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" onClick={onClose} />

      {/* panel — exact prototype: maxWidth:800px, width:90vw, height:100vh */}
      <div className="fixed top-0 right-0 z-50 flex h-screen w-[95vw] max-w-[800px] flex-col overflow-hidden rounded-l-[14px] bg-card shadow-[-16px_0_48px_rgba(15,23,42,0.22)] sm:w-[90vw]">
        {/* ═══ HEADER ═══ */}
        <div className="shrink-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.95)_0%,rgba(2,132,199,0.95)_100%)] px-[22px] pt-[18px] text-white max-sm:px-4 max-sm:pt-3">
          {/* top row */}
          <div className="flex items-start justify-between gap-3.5">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-[9.5px] font-bold tracking-[0.6px] text-[rgba(255,255,255,0.75)] uppercase">
                <span className="inline-block size-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                Live case workload · {scopeType} scope
              </div>
              <div className="mb-[5px] text-xl leading-[1.2] font-extrabold max-sm:text-base max-sm:mb-0.5">{scopeName}</div>
              <div className="text-[11.5px] font-medium text-[rgba(255,255,255,0.85)] max-sm:hidden">
                {filterLabel} · <strong>{filtered.length} matching{filtered.length !== records.length ? ` of ${formatIndian(records.length)}` : ''}</strong>
              </div>
            </div>
            {/* totals */}
            <div className="flex shrink-0 items-center gap-3.5">
              <div className="flex items-center gap-3.5 max-sm:hidden">
                <div className="text-right">
                  <div className="text-[9.5px] font-bold tracking-[0.4px] text-[rgba(255,255,255,0.7)] uppercase">Total cases</div>
                  <div className="font-mono text-[22px] leading-[1.1] font-extrabold">{formatIndian(stats.total)}</div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.7)]">{formatIndian(stats.active)} active · {stats.avgClose}d avg close</div>
                </div>
                <div className="h-[46px] w-px bg-[rgba(255,255,255,0.25)]" />
                <div className="text-right">
                  <div className="text-[9.5px] font-bold tracking-[0.4px] text-[rgba(255,255,255,0.7)] uppercase">Recovery YTD</div>
                  <div className="font-mono text-[22px] leading-[1.1] font-extrabold text-[#FFD93D]">{fmtINR(stats.recovery)}</div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.7)]">62% realization</div>
                </div>
              </div>
              {/* close */}
              <button
                type="button" onClick={onClose}
                className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center self-start rounded-lg border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.12)] text-lg leading-none text-white transition-colors hover:bg-[rgba(255,255,255,0.22)]"
              >×</button>
            </div>
          </div>

          {/* ── STATUS BREAKDOWN BAR ── */}
          <div className="mt-3.5 pb-3.5 max-sm:mt-2 max-sm:pb-2">
            <div className="flex h-1.5 overflow-hidden rounded-[4px] bg-[rgba(255,255,255,0.15)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
              {breakdownBars.map(([color, pct, title]) => (
                +pct > 0 && <div key={color} style={{ background: color, width: `${pct}%` }} title={title} />
              ))}
            </div>
            <div className="mt-[5px] flex flex-wrap justify-between gap-1.5 text-[10px] font-semibold text-[rgba(255,255,255,0.85)] max-sm:flex-nowrap max-sm:justify-start max-sm:overflow-x-auto">
              {breakdownLegend.map(([color, label]) => (
                <span key={color} className="inline-flex shrink-0 items-center gap-[5px] whitespace-nowrap">
                  <span className="inline-block size-2 rounded-[2px]" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ FILTER BAR ═══ */}
        <div className="flex shrink-0 flex-col gap-2.5 border-b border-border-light bg-bg-soft px-[18px] py-3 max-sm:gap-2 max-sm:px-3 max-sm:py-2">
          {/* status pills */}
          <div className="flex flex-wrap items-center gap-1.5 max-sm:flex-nowrap max-sm:overflow-x-auto">
            <span className="mr-1 text-[9.5px] font-bold tracking-[0.5px] text-text-dim uppercase">Status:</span>
            <Pill label={`All ${formatIndian(stats.total)}`} active={!statusFilter} variant="all" onClick={() => setStatusFilter('')} />
            <Pill label={`⚠ Past SLA ${formatIndian(stats.pastSla)}`} active={statusFilter === 'Past SLA'} variant="pastsla" onClick={() => setStatusFilter('Past SLA')} />
            <Pill label={`Open ${formatIndian(stats.open)}`} active={statusFilter === 'Assigned'} variant="open" onClick={() => setStatusFilter('Assigned')} />
            <Pill label={`In progress ${formatIndian(stats.inProgress)}`} active={statusFilter === 'In Progress'} variant="inprogress" onClick={() => setStatusFilter('In Progress')} />
            <Pill label={`Confirmed ${formatIndian(stats.confirmed)}`} active={statusFilter === 'Confirmed Theft'} variant="confirmed" onClick={() => setStatusFilter('Confirmed Theft')} />
            <Pill label={`Closed ${formatIndian(stats.closed)}`} active={statusFilter === 'Closed'} variant="closed" onClick={() => setStatusFilter('Closed')} />
          </div>
          {/* search + sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-[2] sm:w-auto sm:min-w-[240px] sm:flex-1">
              <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[13px] text-text-dim">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search consumer, meter #, case ID, area, assignee…"
                className="box-border w-full rounded-lg border border-border bg-card py-1.5 pr-2.5 pl-8 font-sans text-xs outline-none focus:border-[#0EA5E9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="min-w-0 flex-1 cursor-pointer rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] outline-none sm:flex-none"
            >
              <option value="due">Sort: Due date (overdue first)</option>
              <option value="risk">Sort: Risk score (highest)</option>
              <option value="created">Sort: Created date (newest)</option>
              <option value="assignee">Sort: Inspector name</option>
            </select>
          </div>
        </div>

        {/* ═══ SELECTION BAR ═══ */}
        {selected.size > 0 && (
          <div className="flex shrink-0 items-center justify-between gap-2.5 bg-[#0EA5E9] px-[18px] py-2.5 text-white">
            <div className="text-xs font-semibold">{selected.size} selected</div>
            <div className="flex gap-1.5">
              {[['reassign','👤 Reassign inspector'],['escalate','⚠ Escalate'],['close','✓ Bulk close']].map(([action, label]) => (
                <button key={action} type="button" onClick={() => bulkAction(action)}
                  className="cursor-pointer rounded-md border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.15)] px-3 py-1.5 text-[11px] font-semibold text-white">
                  {label}
                </button>
              ))}
              <button type="button" onClick={clearSelection}
                className="cursor-pointer rounded-md border border-[rgba(255,255,255,0.4)] bg-transparent px-2.5 py-1.5 text-[11px] text-white">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ═══ SUB-HEADER (fixed) ═══ */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-light bg-bg-soft px-[18px] py-2.5 text-[10.5px] text-text-dim max-sm:px-3">
          <div>
            Showing <strong className="text-text">{start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}</strong>{' '}
            of <strong className="text-text">{filtered.length}</strong>
            {search ? ' matching' : ''}{filtered.length !== records.length ? ' (filtered)' : ''}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-[5px] text-[10.5px] font-semibold text-text-mid">
            <input
              type="checkbox"
              checked={slice.length > 0 && slice.every((c) => selected.has(c.id))}
              onChange={(e) => selectVisible(e.target.checked)}
              className="size-3.5 cursor-pointer"
            />
            <span className="max-sm:hidden">Select visible page</span>
          </label>
        </div>

        {/* ═══ BODY — ONLY the table scrolls ═══ */}
        <div ref={bodyRef} className="flex-1 overflow-auto bg-card p-0">
          {/* table */}
          {slice.length === 0 ? (
            <div className="px-6 py-[60px] text-center">
              <div className="mb-3 text-[38px] opacity-40">📋</div>
              <div className="mb-1 text-[13px] font-semibold text-text-mid">No cases match the current filters</div>
              <div className="text-[11px] text-text-dim">Try clearing the search or selecting a different status.</div>
            </div>
          ) : (
            <table className="w-full min-w-[560px] border-collapse text-[11.5px] md:min-w-[680px]">
              <thead>
                <tr className="sticky top-0 z-1 bg-bg-soft">
                  <th className="w-9 px-2.5 py-2.5 pl-[18px] text-left" />
                  {['Risk','Case · Consumer','Area','Inspector','Due','Status','Action'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-2.5 py-2.5 text-[10px] font-bold tracking-[0.5px] text-text-mid uppercase ${i === 6 ? 'pr-[18px] text-right' : 'text-left'} ${i === 2 ? 'hidden lg:table-cell' : ''} ${i === 3 ? 'hidden md:table-cell' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.map((c) => {
                  const riskTier = c.risk >= 80 ? 'high' : c.risk >= 60 ? 'mid' : 'low'
                  const riskClasses =
                    riskTier === 'high'
                      ? 'border-[#DC3545] bg-[rgba(220,53,69,0.08)] text-[#DC3545]'
                      : riskTier === 'mid'
                        ? 'border-[#E6921E] bg-[rgba(230,146,30,0.08)] text-[#E6921E]'
                        : 'border-[var(--amber-dark)] bg-[rgba(180,117,24,0.08)] text-[var(--amber-dark)]'
                  const past  = isPastSla(c)
                  const isSel = selected.has(c.id)
                  const consumer = (c.consumer || '').length > 28 ? c.consumer.substring(0, 28) + '…' : c.consumer
                  return (
                    <tr
                      key={c.id}
                      className={`cursor-pointer border-b border-border-light transition-colors duration-150 ${isSel ? 'bg-[rgba(14,165,233,0.07)]' : 'bg-transparent hover:bg-bg-soft'}`}
                      onClick={() => { onClose(); navigate(`/cases/${c.id}`) }}
                    >
                      {/* checkbox */}
                      <td className="py-[11px] pr-2.5 pl-[18px]">
                        <input type="checkbox" checked={isSel} onChange={() => {}} onClick={(e) => toggleRow(c.id, e)} className="size-3.5 cursor-pointer" />
                      </td>
                      {/* risk badge */}
                      <td className="px-2.5 py-[11px]">
                        <div className={`inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg border-2 font-mono text-xs font-extrabold ${riskClasses}`}>
                          {c.risk}
                        </div>
                      </td>
                      {/* case · consumer */}
                      <td className="px-2.5 py-[11px]">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-mono text-[10.5px] font-bold text-id-text">{c.id}</span>
                          {c._real && <span className="inline-block rounded-[5px] border border-[rgba(40,167,69,0.3)] bg-[rgba(40,167,69,0.12)] px-[5px] py-px text-[8.5px] font-extrabold text-green">✓ REAL</span>}
                          {past && <span className="inline-block rounded-[5px] border border-[rgba(220,53,69,0.3)] bg-[rgba(220,53,69,0.12)] px-[5px] py-px text-[8.5px] font-extrabold text-red">⚠ PAST SLA</span>}
                        </div>
                        <div className="mt-0.5 text-[11.5px] leading-[1.3] font-semibold text-text">{consumer}</div>
                        <div className="mt-0.5 font-mono text-[9.5px] text-text-dim">M#{c.meter}</div>
                      </td>
                      {/* area */}
                      <td className="hidden px-2.5 py-[11px] lg:table-cell">
                        <div className="text-[10.5px] text-text-mid">
                          {(c.area || '—').substring(0, 30)}{(c.area || '').length > 30 ? '…' : ''}
                        </div>
                      </td>
                      {/* inspector */}
                      <td className="hidden px-2.5 py-[11px] text-[10.5px] text-text-mid md:table-cell">{c.assignee || '—'}</td>
                      {/* due */}
                      <td className={`px-2.5 py-[11px] font-mono text-[10.5px] ${past ? 'font-bold text-red' : 'font-normal text-text-dim'}`}>{c.due || '—'}</td>
                      {/* status */}
                      <td className="px-2.5 py-[11px]"><StatusBadge status={c.status || '—'} /></td>
                      {/* action */}
                      <td className="py-[11px] pr-[18px] pl-2.5 text-right">
                        <ViewBtn onClick={(e) => { e.stopPropagation(); onClose(); navigate(`/cases/${c.id}`) }} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

        </div>

        {/* ═══ PAGINATION (fixed) ═══ */}
        {totalPages > 1 && (
          <div className="flex shrink-0 items-center justify-between border-t border-border-light bg-bg-soft px-[18px] py-3.5 max-sm:justify-center max-sm:px-3 max-sm:py-2.5">
            <div className="text-[10.5px] text-text-dim max-sm:hidden">Page {curPage} of {totalPages}</div>
            <div className="flex flex-wrap items-center justify-center gap-1">{paginationButtons()}</div>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <div className="flex shrink-0 items-center justify-between gap-2.5 border-t border-border-light bg-[linear-gradient(180deg,var(--bg-soft)_0%,#EEF1F7_100%)] px-[18px] py-2.5 max-sm:gap-2 max-sm:px-3 max-sm:py-2">
          <div className="text-[10.5px] font-semibold text-text-mid max-sm:hidden">
            <span className="text-ai-purple">✦</span>{' '}
            <strong>AI suggestion:</strong> Auto-escalate the {formatIndian(stats.pastSla)} past-SLA cases under {scopeName} to next-level supervisor.
          </div>
          <div className="flex gap-1.5 max-sm:overflow-x-auto max-sm:[&>button]:shrink-0">
            <button
              type="button"
              onClick={() => showToast({ type: 'info', title: 'CSV export started', message: `Exporting ${formatIndian(stats.total)} cases from ${scopeName}.`, duration: 4000 })}
              className="cursor-pointer rounded-[7px] border border-border bg-card px-[13px] py-1.5 text-[11.5px] font-semibold text-text"
            >
              📥 Export {formatIndian(stats.total)}
            </button>
            <button
              type="button"
              onClick={() => { showToast({ type: 'success', title: 'Auto-escalated', message: `${formatIndian(stats.pastSla)} past-SLA cases escalated to next-level supervisor.`, duration: 5000 }); onClose() }}
              className="cursor-pointer rounded-[7px] border-none bg-[linear-gradient(135deg,#FF4757_0%,#A8222F_100%)] px-3.5 py-1.5 text-[11.5px] font-bold text-white shadow-[0_2px_8px_rgba(255,71,87,0.3)]"
            >
              ⚠ Escalate {formatIndian(stats.pastSla)} past-SLA
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
