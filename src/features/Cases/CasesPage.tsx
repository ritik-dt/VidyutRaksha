import { useState, type ChangeEvent, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScope } from '@/shared/context/ScopeContext'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { enrichLevel, getChildLabel, fmtINR } from '@/features/Dashboard/adapter'
import { CASES_LIST, computeCasesStats } from '@/features/Cases/data/cases'
import { formatIndian } from '@/shared/utils/formatters'
import { getPathForScreen } from '@/shared/utils/navigation'
import { CaseDetailPanel } from './CaseDetailPanel'
import { AssignInspectorModal } from './AssignInspectorModal'

const STATUS_FILTERS = [
  { value: 'all', label: 'All cases' },
  { value: 'Past SLA', label: '⚠ Past SLA' },
  { value: 'Assigned', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Escalated', label: 'Escalated' },
  { value: 'Confirmed Theft', label: 'Confirmed' },
  { value: 'Closed', label: 'Closed' },
]

export default function CasesPage() {
  const navigate = useNavigate()
  const { currentNode } = useScope()
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [assignCaseId, setAssignCaseId] = useState<string | null>(null)

  const level = currentNode ? enrichLevel(currentNode) : null
  const scopeName = level?.name ?? 'UPPCL'
  const scopeType = level?.type ?? 'State'
  const isConsumerLevel = scopeType === 'DTR'
  const childLabel = getChildLabel(scopeType)

  const stats = computeCasesStats(CASES_LIST)

  // Filter cases
  const filtered = CASES_LIST.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    const matchSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.consumer.toLowerCase().includes(search.toLowerCase()) ||
      c.meter.includes(search) ||
      c.assignee.toLowerCase().includes(search.toLowerCase()) ||
      c.area.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const selectedCase = selectedCaseId ? CASES_LIST.find((c) => c.id === selectedCaseId) : null
  const assignCase = assignCaseId ? CASES_LIST.find((c) => c.id === assignCaseId) : null

  return (
    <div className="pb-8">
      <PageHeader
        title="📋 Cases"
        subtitle={`Investigation cases · ${formatIndian(stats.total)} total · ${formatIndian(stats.active)} active`}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate(getPathForScreen('dashboard'))}
              className="btn btn-outline btn-sm"
            >
              ← Overview
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
            >
              📋 View all {formatIndian(stats.total)} cases →
            </button>
          </>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <span className="text-[10.5px] font-semibold text-text-mid">
            {formatIndian(stats.total)} total · {formatIndian(stats.active)} active
          </span>
        }
      />

      {/* AI Insight */}
      <AiInsightBanner
        title="AI case advisor"
        actions={
          <>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              style={{ padding: '5px 11px', fontSize: '10.5px' }}
              onClick={() => setStatusFilter('Past SLA')}
            >
              ✦ Review past SLA →
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ padding: '5px 11px', fontSize: '10.5px' }}
              onClick={() => navigate(getPathForScreen('meters'))}
            >
              View flagged meters
            </button>
          </>
        }
      >
        Across <strong>{scopeName}</strong>,{' '}
        <strong style={{ color: 'var(--red)' }}>{formatIndian(stats.pastSla)} cases are past SLA</strong> — recommend immediate escalation.{' '}
        <strong>{formatIndian(stats.confirmed)} confirmed</strong> theft cases have generated assessments worth{' '}
        <strong>{fmtINR(stats.recovery)}</strong> (at 62% realization). Closure rate is{' '}
        <strong>{stats.avgClose} days</strong>{' '}
        {stats.avgClose > 3
          ? '(above 3-day target — investigate inspector load)'
          : '(within 3-day target ✓)'}.{' '}
        {isConsumerLevel
          ? 'You are at the deepest scope — the case list is below.'
          : `Drill into any ${childLabel} below to narrow scope.`}
      </AiInsightBanner>

      {/* KPI Row */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          {
            label: 'Past SLA',
            value: formatIndian(stats.pastSla),
            sub: stats.active > 0 ? `${((stats.pastSla / stats.active) * 100).toFixed(1)}% of active` : 'no active cases',
            accent: 'var(--red)',
            valueColor: 'var(--red)',
            filter: 'Past SLA',
          },
          {
            label: 'Open',
            value: formatIndian(stats.open),
            sub: 'awaiting inspection',
            accent: '#0EA5E9',
            valueColor: '#0EA5E9',
            filter: 'Assigned',
          },
          {
            label: 'In progress',
            value: formatIndian(stats.inProgress),
            sub: `includes ${formatIndian(stats.escalated)} escalated`,
            accent: 'var(--amber)',
            valueColor: 'var(--amber)',
            filter: 'In Progress',
          },
          {
            label: 'Confirmed',
            value: formatIndian(stats.confirmed),
            sub: 'cumulative this fiscal',
            accent: 'var(--green)',
            valueColor: 'var(--green)',
            filter: 'Confirmed Theft',
          },
          {
            label: 'Avg time-to-close',
            value: `${stats.avgClose} d`,
            sub: `target: 3.0 d ${stats.avgClose > 3 ? '⚠' : '✓'}`,
            accent: 'var(--navy-light)',
            valueColor: stats.avgClose > 3.5 ? 'var(--amber)' : 'var(--text)',
            filter: null,
          },
          {
            label: 'Recovery',
            value: fmtINR(stats.recovery),
            sub: 'YTD · 62% realization',
            accent: 'var(--ai-purple)',
            valueColor: 'var(--ai-purple)',
            fontSize: '18px',
            filter: null,
          },
        ].map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={kpi.filter ? () => setStatusFilter(kpi.filter!) : undefined}
            className="kpi-card clickable relative min-w-[140px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:shadow-md"
          >
            <div
              className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
              style={{ background: kpi.accent }}
            />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">
              {kpi.label}
            </div>
            <div
              className="font-mono font-extrabold"
              style={{ color: kpi.valueColor, fontSize: kpi.fontSize ?? '24px' }}
            >
              {kpi.value}
            </div>
            <div className="mt-0.5 text-[10px] text-text-mid">{kpi.sub}</div>
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div className="card">
        <div className="card-title mb-3 flex items-center justify-between">
          <span className="text-[14px] font-bold">All cases</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search case, meter, consumer…"
              className="h-[28px] rounded-lg border border-border bg-bg px-3 text-[11px] outline-none focus:border-ai-purple"
              style={{ width: 200 }}
            />
          </div>
        </div>

        <FilterBar
          filters={STATUS_FILTERS}
          active={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Case ID</th>
                <th>Consumer</th>
                <th>Meter</th>
                <th>Risk</th>
                <th>Area</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Due date</th>
                <th>Flags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isOverdue = c.status !== 'Closed' && c.status !== 'False Positive'
                const riskColor = c.risk >= 80 ? 'var(--red)' : c.risk >= 60 ? 'var(--amber)' : 'var(--green)'
                return (
                  <tr
                    key={c.id}
                    className="table-row cursor-pointer"
                    onClick={() => setSelectedCaseId(c.id)}
                  >
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11.5px] font-bold" style={{ color: 'var(--id-text)' }}>
                          {c.id}
                        </span>
                        {c._real && (
                          <span
                            className="rounded-full px-1.5 py-px text-[9px] font-bold text-white"
                            style={{ background: 'var(--green)' }}
                          >
                            REAL
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[9.5px] text-text-dim">Created {c.created}</div>
                    </td>
                    <td>
                      <div className="max-w-[160px] truncate text-[11.5px] font-medium text-text">
                        {c.consumer}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-[11px]" style={{ color: 'var(--id-text)' }}>
                        #{c.meter}
                      </span>
                    </td>
                    <td>
                      <div
                        className="inline-flex size-[28px] items-center justify-center rounded-md border font-mono text-[10px] font-extrabold"
                        style={{ background: `${riskColor}18`, borderColor: riskColor, color: riskColor }}
                      >
                        {c.risk}
                      </div>
                    </td>
                    <td className="max-w-[140px] text-[11px] text-text-mid">{c.area}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="text-[11px]">
                      {c.assignee === 'Unassigned' ? (
                        <span className="text-text-dim italic">Unassigned</span>
                      ) : (
                        c.assignee
                      )}
                    </td>
                    <td>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: isOverdue ? 'var(--amber)' : 'var(--text-mid)' }}
                      >
                        {c.due}
                      </span>
                    </td>
                    <td className="text-center font-mono text-[11px] font-bold">{c.flags}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '10px', padding: '3px 8px' }}
                          onClick={(e: MouseEvent) => {
                            e.stopPropagation()
                            setSelectedCaseId(c.id)
                          }}
                        >
                          View
                        </button>
                        {c.status === 'New' || c.assignee === 'Unassigned' ? (
                          <button
                            type="button"
                            className="btn btn-ai btn-sm"
                            style={{ fontSize: '10px', padding: '3px 8px' }}
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation()
                              setAssignCaseId(c.id)
                            }}
                          >
                            Assign
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[12px] text-text-dim">
                    No cases match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10.5px] text-text-dim">
          <span>
            Showing <strong className="text-text">{filtered.length}</strong> of{' '}
            <strong className="text-text">{CASES_LIST.length}</strong> cases
          </span>
          <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px' }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Side Panels */}
      {selectedCase && (
        <CaseDetailPanel
          caseRecord={selectedCase}
          onClose={() => setSelectedCaseId(null)}
          onAssign={(id) => { setSelectedCaseId(null); setAssignCaseId(id) }}
        />
      )}
      {assignCase && (
        <AssignInspectorModal
          caseRecord={assignCase}
          onClose={() => setAssignCaseId(null)}
        />
      )}
    </div>
  )
}
