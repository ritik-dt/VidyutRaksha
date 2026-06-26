import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { formatIndian } from '@/shared/utils/formatters'
import type { CaseListSortKey, CaseRecord, CasesStats } from './types'

interface CasesListDrawerProps {
  scopeName: string
  scopeType: string
  stats: CasesStats
  records: CaseRecord[]
  initialStatusFilter?: string
  onClose: () => void
}

const STATUS_PILLS = [
  { value: 'all', label: (count: number) => `All ${formatIndian(count)}` },
  { value: 'Past SLA', label: (count: number) => `Past SLA ${formatIndian(count)}` },
  { value: 'Assigned', label: (count: number) => `Open ${formatIndian(count)}` },
  { value: 'In Progress', label: (count: number) => `In progress ${formatIndian(count)}` },
  { value: 'Confirmed Theft', label: (count: number) => `Confirmed ${formatIndian(count)}` },
  { value: 'Closed', label: (count: number) => `Closed ${formatIndian(count)}` },
] as const

const SORT_OPTIONS: Array<{ value: CaseListSortKey; label: string }> = [
  { value: 'due', label: 'Sort: Due date (overdue first)' },
  { value: 'risk', label: 'Sort: Risk score (highest)' },
  { value: 'created', label: 'Sort: Created date (newest)' },
  { value: 'assignee', label: 'Sort: Inspector name' },
]

function isPastSla(record: CaseRecord) {
  const due = new Date(record.due)
  return (
    due < new Date('2026-04-01T00:00:00.000Z') &&
    record.status !== 'Confirmed Theft' &&
    record.status !== 'False Positive' &&
    record.status !== 'Closed'
  )
}

function toComparableDate(label: string) {
  const parsed = new Date(label)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

export function CasesListDrawer({
  scopeName,
  scopeType,
  stats,
  records,
  initialStatusFilter = 'all',
  onClose,
}: CasesListDrawerProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<CaseListSortKey>('due')
  const [selection, setSelection] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const filteredRecords = useMemo(() => {
    let next = [...records]

    if (statusFilter === 'Past SLA') {
      next = next.filter(isPastSla)
    } else if (statusFilter === 'Closed') {
      next = next.filter((record) => record.status === 'Closed' || record.status === 'False Positive')
    } else if (statusFilter !== 'all') {
      next = next.filter((record) => record.status === statusFilter)
    }

    const term = search.trim().toLowerCase()
    if (term) {
      next = next.filter(
        (record) =>
          record.id.toLowerCase().includes(term) ||
          record.meter.toLowerCase().includes(term) ||
          record.consumer.toLowerCase().includes(term) ||
          record.area.toLowerCase().includes(term) ||
          record.assignee.toLowerCase().includes(term),
      )
    }

    switch (sortBy) {
      case 'risk':
        next.sort((a, b) => b.risk - a.risk)
        break
      case 'created':
        next.sort((a, b) => toComparableDate(b.created) - toComparableDate(a.created))
        break
      case 'assignee':
        next.sort((a, b) => a.assignee.localeCompare(b.assignee))
        break
      default:
        next.sort((a, b) => {
          const overdueA = isPastSla(a) ? 1 : 0
          const overdueB = isPastSla(b) ? 1 : 0
          if (overdueA !== overdueB) return overdueB - overdueA
          return toComparableDate(a.due) - toComparableDate(b.due)
        })
    }

    return next
  }, [records, search, sortBy, statusFilter])

  const visibleRecords = filteredRecords
  const selectedCount = selection.size
  const visibleSelected = visibleRecords.every((record) => selection.has(record.id))

  function toggleSelection(recordId: string) {
    setSelection((current) => {
      const next = new Set(current)
      if (next.has(recordId)) {
        next.delete(recordId)
      } else {
        next.add(recordId)
      }
      return next
    })
  }

  function clearSelection() {
    setSelection(new Set())
  }

  function selectVisible(checked: boolean) {
    setSelection((current) => {
      const next = new Set(current)
      visibleRecords.forEach((record) => {
        if (checked) next.add(record.id)
        else next.delete(record.id)
      })
      return next
    })
  }

  function handleBulkAction(action: 'reassign' | 'escalate' | 'close') {
    if (selection.size === 0) {
      showToast({
        type: 'warning',
        title: 'Select rows first',
        message: 'Tick the checkbox on any row to select it for a bulk action.',
      })
      return
    }

    const message = {
      reassign: 'cases reassigned. Notifications sent to inspectors.',
      escalate: 'cases escalated to the next-level supervisor.',
      close: 'cases marked closed. Final assessments archived.',
    }[action]

    showToast({
      type: 'success',
      title: action === 'reassign' ? 'Reassigned' : action === 'escalate' ? 'Escalated' : 'Closed',
      message: `${selection.size} ${message}`,
      duration: 5000,
    })
    clearSelection()
  }

  const totalRows = visibleRecords.length
  const start = totalRows === 0 ? 0 : 1
  const end = totalRows
  const selectedFilterCount = filteredRecords.length
  const baseCount = records.length
  const statusCounts = useMemo(() => ({
    all: baseCount,
    'Past SLA': records.filter(isPastSla).length,
    Assigned: records.filter((record) => record.status === 'Assigned').length,
    'In Progress': records.filter((record) => record.status === 'In Progress').length + records.filter((record) => record.status === 'Escalated').length,
    'Confirmed Theft': records.filter((record) => record.status === 'Confirmed Theft').length,
    Closed: records.filter((record) => record.status === 'Closed' || record.status === 'False Positive').length,
  }), [baseCount, records])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="fixed right-0 top-0 z-50 flex h-full w-[860px] max-w-[95vw] flex-col overflow-hidden rounded-l-[20px] bg-card shadow-[-16px_0_42px_rgba(15,23,42,0.18)]"
        style={{ borderLeft: '1px solid var(--border)' }}
      >
        <div className="flex items-start justify-between gap-4 bg-[#1994d8] px-5 py-4 text-white">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.7px] text-white/80">
              <span className="inline-block size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              Live case workload · {scopeType} scope
            </div>
            <div className="text-[18px] font-extrabold leading-tight">{scopeName}</div>
            <div className="mt-1 text-[12px] text-white/85">
              {statusFilter === 'all'
                ? 'All cases at this scope'
                : statusFilter === 'Past SLA'
                  ? 'Showing Past SLA cases'
                  : statusFilter === 'Confirmed Theft'
                    ? 'Showing Confirmed cases'
                    : `Showing ${statusFilter} cases`}
              {' '}· <strong>{formatIndian(selectedFilterCount)}</strong> matching
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="text-right">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.4px] text-white/70">Total cases</div>
              <div className="font-mono text-[26px] font-extrabold leading-none">{formatIndian(stats.total)}</div>
              <div className="text-[10px] text-white/75">
                {formatIndian(stats.active)} active · {stats.avgClose}d avg close
              </div>
            </div>
            <div className="h-[46px] w-px bg-white/25" />
            <div className="text-right">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.4px] text-white/70">Recovery YTD</div>
              <div className="font-mono text-[26px] font-extrabold leading-none text-[#FFD93D]">{fmtINR(stats.recovery)}</div>
              <div className="text-[10px] text-white/75">62% realization</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-xl bg-white/15 text-[18px] font-bold hover:bg-white/25"
              aria-label="Close cases drawer"
            >
              ×
            </button>
          </div>
        </div>

        <div className="border-b border-border-light bg-[#dce4f1] px-5 py-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-dim">Status:</span>
            {STATUS_PILLS.map((pill) => {
              const count = statusCounts[pill.value as keyof typeof statusCounts] ?? baseCount
              const active = statusFilter === pill.value
              return (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => setStatusFilter(pill.value)}
                  className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all"
                  style={{
                    background: active ? 'var(--ai-purple)' : 'rgba(255,255,255,0.7)',
                    borderColor: active ? 'var(--ai-purple)' : 'rgba(148,163,184,0.4)',
                    color: active ? '#fff' : 'var(--text)',
                  }}
                >
                  {pill.label(count)}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[300px] flex-1">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search consumer, meter #, case ID, area, assignee..."
                className="h-10 w-full rounded-xl border border-border bg-card px-3 pl-10 text-[12px] outline-none focus:border-[#0EA5E9]"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-text-dim">🔍</span>
            </div>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as CaseListSortKey)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-[12px] outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center justify-between gap-3 bg-[#1994d8] px-5 py-2.5 text-white">
            <div className="text-[12px] font-semibold">
              {formatIndian(selectedCount)} selected
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBulkAction('reassign')}
                className="rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/25"
              >
                Reassign inspector
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('escalate')}
                className="rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/25"
              >
                Escalate
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('close')}
                className="rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/25"
              >
                Bulk close
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-white/40 bg-transparent px-3 py-1.5 text-[11px] font-semibold hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-card">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light bg-[#f4f7fb] px-5 py-2.5 text-[10.5px] text-text-dim">
            <div>
              Showing <strong className="text-text">{start}–{end}</strong> of <strong className="text-text">{formatIndian(totalRows)}</strong>
            </div>
            <label className="inline-flex items-center gap-2 font-semibold text-text-mid">
              <input
                type="checkbox"
                checked={visibleSelected && totalRows > 0}
                onChange={(event) => selectVisible(event.target.checked)}
              />
              Select visible page
            </label>
          </div>

          <table className="w-full border-collapse text-[11.5px]">
            <thead>
              <tr className="sticky top-[33px] z-[1] bg-[#dce4f1]">
                <th className="w-[34px] px-4 py-3 text-left" />
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Risk</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Case · Consumer</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Area</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Inspector</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Due</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-[12px] text-text-dim">
                    No cases match the current filters.
                  </td>
                </tr>
              ) : (
                visibleRecords.map((record) => {
                  const selected = selection.has(record.id)
                  const overdue = isPastSla(record)
                  const riskColor = record.risk >= 80 ? '#DC3545' : record.risk >= 60 ? '#E6921E' : '#B47518'
                  const riskBg = record.risk >= 80 ? 'rgba(220,53,69,0.08)' : record.risk >= 60 ? 'rgba(230,146,30,0.08)' : 'rgba(180,117,24,0.08)'

                  return (
                    <tr
                      key={record.id}
                      className="cursor-pointer border-b border-border-light transition-colors hover:bg-[#f7fafc]"
                      data-case-id={record.id}
                      onClick={() => navigate(`/cases/${record.id}`)}
                      style={{ background: selected ? 'rgba(14,165,233,0.07)' : 'transparent' }}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelection(record.id)}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div
                          className="flex size-[42px] items-center justify-center rounded-lg border-2 font-mono text-[12px] font-extrabold"
                          style={{ background: riskBg, borderColor: riskColor, color: riskColor }}
                        >
                          {record.risk}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-mono text-[10.5px] font-bold text-id-text">{record.id}</div>
                        <div className="mt-0.5 font-semibold text-text">{record.consumer}</div>
                        <div className="mt-0.5 font-mono text-[9.5px] text-text-dim">M#{record.meter}</div>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-text-mid">
                        {record.area}
                        {record._real ? (
                          <span className="ml-1.5 inline-block rounded-md border border-green-300 bg-green-50 px-1.5 py-px text-[8.5px] font-extrabold uppercase tracking-[0.3px] text-green-700">
                            REAL
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-[11px] text-text-mid">{record.assignee}</td>
                      <td className="px-3 py-3 font-mono text-[11px]" style={{ color: overdue ? 'var(--amber)' : 'var(--text-dim)' }}>
                        {record.due}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '10px', padding: '3px 9px' }}
                          onClick={(event) => {
                            event.stopPropagation()
                            navigate(`/cases/${record.id}`)
                          }}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-light bg-[#eef1f7] px-5 py-3">
          <div className="text-[11px] text-text-mid">
            <strong className="text-text">AI suggestion:</strong> Auto-escalate the {formatIndian(stats.pastSla)} past-SLA cases under {scopeName} to the next-level supervisor.
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ padding: '7px 13px', fontSize: '11px' }}
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'CSV export started',
                  message: `Exporting ${formatIndian(records.length)} cases from ${scopeName}.`,
                  duration: 4000,
                })
              }
            >
              Export {formatIndian(records.length)}
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              style={{ padding: '7px 14px', fontSize: '11px' }}
              onClick={() => {
                showToast({
                  type: 'success',
                  title: 'Auto-escalated',
                  message: `${formatIndian(stats.pastSla)} past-SLA cases escalated to the next-level supervisor.`,
                  duration: 5000,
                })
                onClose()
              }}
            >
              Escalate {formatIndian(stats.pastSla)} past-SLA
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
