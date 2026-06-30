/**
 * CasesListDrawer — exact port of prototype's openCaseList + renderCaseListPage
 * panel.style: maxWidth:800px, height:100vh, borderRadius:14px 0 0 14px
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type { CaseRecord, CasesStats } from './types'

const PAGE_SIZE = 25

interface Props {
  scopeName: string
  scopeType: string
  stats: CasesStats
  records: CaseRecord[]
  initialStatusFilter?: string
  onClose: () => void
}

/* ── status badge — exact prototype sBadge() map ── */
const STATUS_MAP: Record<string, { c: string; bg: string }> = {
  'Assigned':        { c: '#0EA5E9', bg: 'rgba(14,165,233,0.1)'  },
  'In Progress':     { c: '#E6921E', bg: 'rgba(230,146,30,0.1)'  },
  'Escalated':       { c: '#DC3545', bg: 'rgba(220,53,69,0.1)'   },
  'Confirmed Theft': { c: '#28A745', bg: 'rgba(40,167,69,0.1)'   },
  'False Positive':  { c: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  'Closed':          { c: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}
function StatusBadge({ status }: { status: string }) {
  const x = STATUS_MAP[status] ?? { c: 'var(--text-dim)', bg: 'rgba(0,0,0,0.05)' }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px',
      background: x.bg, color: x.c,
      border: `1px solid ${x.c}40`,
      borderRadius: 10, fontSize: 9.5, fontWeight: 700, letterSpacing: '.2px',
    }}>
      {status}
    </span>
  )
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

/* ── status pill button — exact prototype inline style ── */
function Pill({
  label, active, activeColor,
  baseColor, baseBg, borderBase, onClick,
}: {
  label: string; active: boolean; activeColor: string
  baseColor: string; baseBg: string; borderBase: string; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '5px 11px', borderRadius: 14, fontSize: 11, fontWeight: 600,
        cursor: 'pointer', transition: 'all .15s',
        border: `1px solid ${active ? activeColor : borderBase}`,
        background: active ? activeColor : baseBg,
        color: active ? '#fff' : baseColor,
      }}
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
      style={{
        padding: '4px 10px', background: 'transparent',
        border: '1px solid var(--border)', borderRadius: 6,
        fontSize: 10.5, fontWeight: 600, color: '#0EA5E9',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#0EA5E9'
        e.currentTarget.style.color = '#fff'
        e.currentTarget.style.borderColor = '#0EA5E9'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#0EA5E9'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      View →
    </button>
  )
}

/* ── PageBtn for pagination ── */
function PageBtn({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '5px 11px', minWidth: 30,
        border: `1px solid ${active ? '#0EA5E9' : 'var(--border)'}`,
        background: active ? '#0EA5E9' : '#fff',
        color: active ? '#fff' : 'var(--text)',
        borderRadius: 6, fontSize: 11, fontWeight: active ? 700 : 600, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

export function CasesListDrawer({ scopeName, scopeType, stats, records, initialStatusFilter, onClose }: Props) {
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
      btns.push(<PageBtn key="first" label="« First" onClick={() => setPage(1)} />)
      btns.push(<PageBtn key="prev"  label="‹ Prev"  onClick={() => setPage(curPage - 1)} />)
    }
    for (let p = startPg; p <= endPg; p++) {
      btns.push(<PageBtn key={p} label={String(p)} active={p === curPage} onClick={() => setPage(p)} />)
    }
    if (curPage < totalPages) {
      btns.push(<PageBtn key="next" label="Next ›"  onClick={() => setPage(curPage + 1)} />)
      btns.push(<PageBtn key="last" label="Last »"  onClick={() => setPage(totalPages)} />)
    }
    return btns
  }

  const filterLabel = statusFilter === 'Past SLA' ? 'Showing Past SLA cases'
    : statusFilter === 'Assigned'        ? 'Showing Open (assigned) cases'
    : statusFilter === 'In Progress'     ? 'Showing In progress cases'
    : statusFilter === 'Confirmed Theft' ? 'Showing Confirmed cases'
    : statusFilter === 'Closed'          ? 'Showing Closed cases'
    : 'All cases at this scope'

  return (
    <>
      {/* backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)', zIndex: 40 }}
        onClick={onClose}
      />

      {/* panel — exact prototype: maxWidth:800px, width:90vw, height:100vh */}
      <div
        style={{
          position: 'fixed', right: 0, top: 0, zIndex: 50,
          maxWidth: 800, width: '90vw', height: '100vh',
          display: 'flex', flexDirection: 'column',
          borderRadius: '14px 0 0 14px', overflow: 'hidden',
          boxShadow: '-16px 0 48px rgba(15,23,42,0.22)',
          background: 'var(--card)',
        }}
      >
        {/* ═══ HEADER ═══ */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(14,165,233,0.95) 0%,rgba(2,132,199,0.95) 100%)',
          color: '#fff', padding: '18px 22px 0', flexShrink: 0,
        }}>
          {/* top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px #fff' }} />
                Live case workload · {scopeType} scope
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginBottom: 5 }}>{scopeName}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {filterLabel} · <strong>{filtered.length} matching{filtered.length !== records.length ? ` of ${formatIndian(records.length)}` : ''}</strong>
              </div>
            </div>
            {/* totals */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>Total cases</div>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, fontFamily: 'var(--mono)' }}>{formatIndian(stats.total)}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{formatIndian(stats.active)} active · {stats.avgClose}d avg close</div>
              </div>
              <div style={{ width: 1, height: 46, background: 'rgba(255,255,255,0.25)' }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>Recovery YTD</div>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, color: '#FFD93D', fontFamily: 'var(--mono)' }}>{fmtINR(stats.recovery)}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>62% realization</div>
              </div>
              {/* close */}
              <button
                type="button" onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 18, color: '#fff', lineHeight: 1, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', flexShrink: 0 }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)' }}
                onMouseOut={(e)  => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              >×</button>
            </div>
          </div>

          {/* ── STATUS BREAKDOWN BAR ── */}
          <div style={{ marginTop: 14, paddingBottom: 14 }}>
            <div style={{ display: 'flex', height: 6, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.15)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)' }}>
              {[ ['#FF4757', pPct, `Past SLA: ${formatIndian(stats.pastSla)}`],
                 ['#0EA5E9', oPct, `Open: ${formatIndian(stats.open)}`],
                 ['#FFA502', iPct, `In progress: ${formatIndian(stats.inProgress)}`],
                 ['#28A745', cPct, `Confirmed: ${formatIndian(stats.confirmed)}`],
                 ['#9CA3AF', xPct, `Closed: ${formatIndian(stats.closed)}`],
              ].map(([color, pct, title]) => (
                +pct > 0 && <div key={color as string} style={{ background: color as string, width: `${pct}%` }} title={title as string} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, marginTop: 5, color: 'rgba(255,255,255,0.85)', flexWrap: 'wrap', gap: 6 }}>
              {[ ['#FF4757', `Past SLA ${formatIndian(stats.pastSla)} (${Math.round(+pPct)}%)`],
                 ['#0EA5E9', `Open ${formatIndian(stats.open)} (${Math.round(+oPct)}%)`],
                 ['#FFA502', `In progress ${formatIndian(stats.inProgress)} (${Math.round(+iPct)}%)`],
                 ['#28A745', `Confirmed ${formatIndian(stats.confirmed)} (${Math.round(+cPct)}%)`],
                 ['#9CA3AF', `Closed ${formatIndian(stats.closed)} (${Math.round(+xPct)}%)`],
              ].map(([color, label]) => (
                <span key={color as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: color as string }} />
                  {label as string}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ FILTER BAR ═══ */}
        <div style={{ padding: '12px 18px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--border-light)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {/* status pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px', marginRight: 4 }}>Status:</span>
            <Pill label={`All ${formatIndian(stats.total)}`} active={!statusFilter} activeColor="#0EA5E9" baseColor="var(--text)" baseBg="var(--card)" borderBase="var(--border)" onClick={() => setStatusFilter('')} />
            <Pill label={`⚠ Past SLA ${formatIndian(stats.pastSla)}`} active={statusFilter === 'Past SLA'} activeColor="#FF4757" baseColor="#D43645" baseBg="rgba(255,71,87,0.08)" borderBase="rgba(255,71,87,0.3)" onClick={() => setStatusFilter('Past SLA')} />
            <Pill label={`Open ${formatIndian(stats.open)}`} active={statusFilter === 'Assigned'} activeColor="#0EA5E9" baseColor="#0284C7" baseBg="rgba(14,165,233,0.08)" borderBase="rgba(14,165,233,0.3)" onClick={() => setStatusFilter('Assigned')} />
            <Pill label={`In progress ${formatIndian(stats.inProgress)}`} active={statusFilter === 'In Progress'} activeColor="#E6921E" baseColor="var(--amber-dark,#B45309)" baseBg="rgba(230,146,30,0.08)" borderBase="rgba(230,146,30,0.3)" onClick={() => setStatusFilter('In Progress')} />
            <Pill label={`Confirmed ${formatIndian(stats.confirmed)}`} active={statusFilter === 'Confirmed Theft'} activeColor="#28A745" baseColor="#1E7E34" baseBg="rgba(40,167,69,0.08)" borderBase="rgba(40,167,69,0.3)" onClick={() => setStatusFilter('Confirmed Theft')} />
            <Pill label={`Closed ${formatIndian(stats.closed)}`} active={statusFilter === 'Closed'} activeColor="#6B7280" baseColor="#4B5563" baseBg="rgba(107,114,128,0.08)" borderBase="rgba(107,114,128,0.3)" onClick={() => setStatusFilter('Closed')} />
          </div>
          {/* search + sort */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search consumer, meter #, case ID, area, assignee…"
                style={{ width: '100%', padding: '7px 10px 7px 32px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-sans)', background: 'var(--card)', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e)  => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)' }}
                onBlur={(e)   => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11.5, background: 'var(--card)', cursor: 'pointer', outline: 'none' }}
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
          <div style={{ padding: '9px 18px', background: '#0EA5E9', color: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{selected.size} selected</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['reassign','👤 Reassign inspector'],['escalate','⚠ Escalate'],['close','✓ Bulk close']].map(([action, label]) => (
                <button key={action} type="button" onClick={() => bulkAction(action)}
                  style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  {label}
                </button>
              ))}
              <button type="button" onClick={clearSelection}
                style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 6, fontSize: 11, color: '#fff', cursor: 'pointer' }}>
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ═══ BODY ═══ */}
        <div ref={bodyRef} style={{ overflowY: 'auto', flex: 1, padding: 0, background: 'var(--card)' }}>
          {/* sticky row count */}
          <div style={{ padding: '9px 18px', fontSize: 10.5, color: 'var(--text-dim)', background: 'var(--bg-soft)', position: 'sticky', top: 0, zIndex: 2, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              Showing <strong style={{ color: 'var(--text)' }}>{start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}</strong>{' '}
              of <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong>
              {search ? ' matching' : ''}{filtered.length !== records.length ? ' (filtered)' : ''}
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontWeight: 600, color: 'var(--text-mid)', fontSize: 10.5 }}>
              <input
                type="checkbox"
                checked={slice.length > 0 && slice.every((c) => selected.has(c.id))}
                onChange={(e) => selectVisible(e.target.checked)}
                style={{ cursor: 'pointer', width: 14, height: 14 }}
              />
              Select visible page
            </label>
          </div>

          {/* table */}
          {slice.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 38, marginBottom: 12, opacity: .4 }}>📋</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 4 }}>No cases match the current filters</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Try clearing the search or selecting a different status.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg-soft)', position: 'sticky', top: 32, zIndex: 1 }}>
                  <th style={{ padding: '9px 10px 9px 18px', textAlign: 'left', width: 36 }} />
                  {['Risk','Case · Consumer','Area','Inspector','Due','Status','Action'].map((h, i) => (
                    <th key={h} style={{ padding: '9px 10px', textAlign: i === 6 ? 'right' : 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '.5px', ...(i === 6 ? { paddingRight: 18 } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.map((c) => {
                  const col   = c.risk >= 80 ? '#DC3545' : c.risk >= 60 ? '#E6921E' : 'var(--amber-dark,#B45309)'
                  const colBg = c.risk >= 80 ? 'rgba(220,53,69,0.08)' : c.risk >= 60 ? 'rgba(230,146,30,0.08)' : 'rgba(180,117,24,0.08)'
                  const past  = isPastSla(c)
                  const isSel = selected.has(c.id)
                  const consumer = (c.consumer || '').length > 28 ? c.consumer.substring(0, 28) + '…' : c.consumer
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: isSel ? 'rgba(14,165,233,0.07)' : 'transparent', transition: 'background .12s' }}
                      onMouseOver={(e) => { if (!isSel) e.currentTarget.style.background = 'var(--bg-soft)' }}
                      onMouseOut={(e)  => { if (!isSel) e.currentTarget.style.background = 'transparent' }}
                      onClick={() => { onClose(); navigate(`/cases/${c.id}`) }}
                    >
                      {/* checkbox */}
                      <td style={{ padding: '11px 10px 11px 18px' }}>
                        <input type="checkbox" checked={isSel} onChange={() => {}} onClick={(e) => toggleRow(c.id, e)} style={{ cursor: 'pointer', width: 14, height: 14 }} />
                      </td>
                      {/* risk badge */}
                      <td style={{ padding: '11px 10px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, background: colBg, border: `2px solid ${col}`, color: col, fontSize: 12, fontWeight: 800, fontFamily: 'var(--mono)' }}>
                          {c.risk}
                        </div>
                      </td>
                      {/* case · consumer */}
                      <td style={{ padding: '11px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10.5, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--id-text)' }}>{c.id}</span>
                          {c._real && <span style={{ display: 'inline-block', padding: '1px 5px', background: 'rgba(40,167,69,.12)', color: 'var(--green)', border: '1px solid rgba(40,167,69,.3)', borderRadius: 5, fontSize: 8.5, fontWeight: 800 }}>✓ REAL</span>}
                          {past && <span style={{ display: 'inline-block', padding: '1px 5px', background: 'rgba(220,53,69,0.12)', color: 'var(--red)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: 5, fontSize: 8.5, fontWeight: 800 }}>⚠ PAST SLA</span>}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 11.5, color: 'var(--text)', marginTop: 2, lineHeight: 1.3 }}>{consumer}</div>
                        <div style={{ fontSize: 9.5, color: 'var(--text-dim)', fontFamily: 'var(--mono)', marginTop: 2 }}>M#{c.meter}</div>
                      </td>
                      {/* area */}
                      <td style={{ padding: '11px 10px' }}>
                        <div style={{ fontSize: 10.5, color: 'var(--text-mid)' }}>
                          {(c.area || '—').substring(0, 30)}{(c.area || '').length > 30 ? '…' : ''}
                        </div>
                      </td>
                      {/* inspector */}
                      <td style={{ padding: '11px 10px', fontSize: 10.5, color: 'var(--text-mid)' }}>{c.assignee || '—'}</td>
                      {/* due */}
                      <td style={{ padding: '11px 10px', fontSize: 10.5, color: past ? 'var(--red)' : 'var(--text-dim)', fontFamily: 'var(--mono)', fontWeight: past ? 700 : 400 }}>{c.due || '—'}</td>
                      {/* status */}
                      <td style={{ padding: '11px 10px' }}><StatusBadge status={c.status || '—'} /></td>
                      {/* action */}
                      <td style={{ padding: '11px 18px 11px 10px', textAlign: 'right' }}>
                        <ViewBtn onClick={(e) => { e.stopPropagation(); onClose(); navigate(`/cases/${c.id}`) }} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-soft)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>Page {curPage} of {totalPages}</div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>{paginationButtons()}</div>
            </div>
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{ padding: '11px 18px', borderTop: '1px solid var(--border-light)', background: 'linear-gradient(180deg,var(--bg-soft) 0%,#EEF1F7 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontSize: 10.5, color: 'var(--text-mid)', fontWeight: 600 }}>
            <span style={{ color: 'var(--ai-purple)' }}>✦</span>{' '}
            <strong>AI suggestion:</strong> Auto-escalate the {formatIndian(stats.pastSla)} past-SLA cases under {scopeName} to next-level supervisor.
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => showToast({ type: 'info', title: 'CSV export started', message: `Exporting ${formatIndian(stats.total)} cases from ${scopeName}.`, duration: 4000 })}
              style={{ padding: '7px 13px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 7, fontSize: 11.5, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
            >
              📥 Export {formatIndian(stats.total)}
            </button>
            <button
              type="button"
              onClick={() => { showToast({ type: 'success', title: 'Auto-escalated', message: `${formatIndian(stats.pastSla)} past-SLA cases escalated to next-level supervisor.`, duration: 5000 }); onClose() }}
              style={{ padding: '7px 14px', background: 'linear-gradient(135deg,#FF4757 0%,#A8222F 100%)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(255,71,87,0.3)' }}
            >
              ⚠ Escalate {formatIndian(stats.pastSla)} past-SLA
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
