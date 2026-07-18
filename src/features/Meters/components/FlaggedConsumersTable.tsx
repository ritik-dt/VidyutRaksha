import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUSP_METERS, type SuspMeter } from '@/features/Meters/data/meters'
import { useToast } from '@/shared/context/ToastContext'

interface FlaggedConsumersTableProps {
  scopeName: string
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  New: { bg: 'rgba(14,165,233,0.1)', color: '#0EA5E9' },
  Assigned: { bg: 'rgba(230,146,30,0.12)', color: 'var(--amber-dark)' },
  Inspected: { bg: 'rgba(230,146,30,0.12)', color: 'var(--amber-dark)' },
}

/**
 * Matches the prototype's terminal-scope (DTR) table exactly: this is what
 * renders inline — search box + bulk-actions bar + full checkbox table —
 * instead of the slide-over panel, once you've drilled to the deepest level.
 */
export function FlaggedConsumersTable({ scopeName }: FlaggedConsumersTableProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (!search) return SUSP_METERS
    const s = search.toLowerCase()
    return SUSP_METERS.filter(
      (m) =>
        m.id.toLowerCase().includes(s) ||
        (m.area ?? '').toLowerCase().includes(s) ||
        (m.cat ?? '').toLowerCase().includes(s) ||
        (m._consumer ?? '').toLowerCase().includes(s),
    )
  }, [search])

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function selectAll(checked: boolean) {
    setSelected(checked ? new Set(filtered.map((m) => m.id)) : new Set())
  }

  function bulkAction(kind: 'assign' | 'case' | 'notice' | 'export') {
    const messages: Record<string, { title: string; message: string }> = {
      assign: { title: 'Inspector assigned', message: `${selected.size} consumers assigned for inspection.` },
      case: { title: 'Cases created', message: `${selected.size} cases created and routed to nearest inspectors.` },
      notice: { title: 'Notices generated', message: `${selected.size} Section 135 draft notices generated.` },
      export: { title: 'Export started', message: `Exporting ${selected.size} consumers to Excel.` },
    }
    const m = messages[kind]
    showToast({ type: 'success', title: m.title, message: m.message, duration: 4500 })
    setSelected(new Set())
  }

  return (
    <div className="card">
      <div className="card-title mb-2 flex items-center justify-between">
        <span className="text-[14px] font-bold">Flagged consumers under {scopeName}</span>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="🔍 Search…"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="rounded-md border border-border bg-card px-2 py-[5px] text-[11px]"
            style={{ width: 200 }}
          />
          <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: '10px' }} onClick={() => selectAll(selected.size === 0)}>
            ✦ Bulk actions
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div
          className="mb-3 flex items-center justify-between rounded-lg p-[12px_16px]"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.25)' }}
        >
          <div className="text-[12px] font-semibold" style={{ color: 'var(--ai-purple)' }}>
            {selected.size} consumer(s) selected
          </div>
          <div className="flex gap-1.5">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => bulkAction('assign')}>👥 Assign to inspector</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => bulkAction('case')}>📋 Create cases</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => bulkAction('notice')}>✉️ Generate notices</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => bulkAction('export')}>⬇ Export to Excel</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelected(new Set())}>Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11.5px]">
          <thead>
            <tr className="table-header">
              <th className="w-[30px] p-[9px_10px]">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => selectAll(e.target.checked)}
                />
              </th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Risk score · AI conf.</th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Meter #</th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Consumer name</th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Tariff category</th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Service area</th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Top AI flag</th>
              <th className="p-[9px_10px] text-right text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">kWh drop vs baseline</th>
              <th className="p-[9px_10px] text-right text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Tamper events (lifetime)</th>
              <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">Workflow status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-[40px_18px] text-center text-[12px] text-text-dim">
                  🔍 No consumers match the current search.
                </td>
              </tr>
            )}
            {filtered.map((m: SuspMeter) => {
              const col = m.risk >= 80 ? '#DC3545' : m.risk >= 60 ? '#E6921E' : 'var(--amber-dark)'
              const colBg = m.risk >= 80 ? 'rgba(220,53,69,0.08)' : m.risk >= 60 ? 'rgba(230,146,30,0.08)' : 'rgba(180,117,24,0.08)'
              const displayName = m._consumer ?? `Consumer #${m.id}`
              const dropAbs = Math.abs(m.drop || 0)
              const dropColor = dropAbs >= 50 ? 'var(--red)' : 'var(--amber-dark)'
              const isSelected = selected.has(m.id)
              const statusStyle = STATUS_STYLE[m.status] ?? STATUS_STYLE.New

              return (
                <tr
                  key={m.id}
                  className="cursor-pointer border-b border-border-light"
                  style={{ background: isSelected ? 'rgba(124,58,237,0.06)' : 'transparent' }}
                  onClick={() => navigate(`/meters/${m.id}`)}
                >
                  <td className="p-[11px_10px]" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleRow(m.id)} className="cursor-pointer" />
                  </td>
                  <td className="p-[11px_10px]">
                    <div className="inline-flex flex-col items-start gap-[3px]">
                      <div
                        className="flex size-[34px] items-center justify-center rounded-full border-2 font-mono text-[12px] font-extrabold"
                        style={{ background: colBg, borderColor: col, color: col }}
                      >
                        {m.risk}
                      </div>
                      <span className="font-mono text-[9.5px] font-semibold" style={{ color: 'var(--ai-purple)' }}>{m.conf}%</span>
                    </div>
                  </td>
                  <td className="p-[11px_10px]">
                    <div className="font-mono text-[12px] font-bold" style={{ color: 'var(--id-text, var(--text))' }}>{m.id}</div>
                    {m._real && (
                      <span
                        className="mt-[3px] inline-block rounded-[5px] border px-[5px] py-px text-[8.5px] font-extrabold"
                        style={{ background: 'rgba(40,167,69,.12)', color: 'var(--green)', borderColor: 'rgba(40,167,69,.3)' }}
                      >
                        ✓ REAL
                      </span>
                    )}
                  </td>
                  <td className="p-[11px_10px]">
                    <span
                      className="text-[11px] font-semibold underline"
                      style={{ color: 'var(--ai-purple)' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/meters/${m.id}`) }}
                    >
                      {displayName.length > 28 ? `${displayName.substring(0, 28)}…` : displayName}
                    </span>
                  </td>
                  <td className="p-[11px_10px] text-[11px] text-text-mid">{m.cat}</td>
                  <td className="p-[11px_10px] text-[11px] text-text-mid">{m.area}</td>
                  <td className="p-[11px_10px] text-[11px] text-text">{m.flags?.[0] ?? '—'}</td>
                  <td className="p-[11px_10px] text-right font-mono font-bold" style={{ color: dropColor }}>
                    {m.drop}%
                  </td>
                  <td className="p-[11px_10px] text-right font-mono font-semibold">{m.events ?? 0}</td>
                  <td className="p-[11px_10px]">
                    <span
                      className="inline-block rounded-full px-2.5 py-[3px] text-[10.5px] font-bold"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
