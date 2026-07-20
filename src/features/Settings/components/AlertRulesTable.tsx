import { severityColor } from '../logic/settingsLogic'
import type { AlertRule } from '../types'

interface AlertRulesTableProps {
  rules: AlertRule[]
  blurb: string
  roleLabel: string
  onAddRule: () => void
  onEditRule: (r: AlertRule) => void
}

/** 8 alert rules — configuration lives here rather than on the Alerts page.
 *  Matches prototype's renderSettings() alert-rules card exactly. */
export function AlertRulesTable({
  rules,
  blurb,
  roleLabel,
  onAddRule,
  onEditRule,
}: AlertRulesTableProps) {
  return (
    <div className="card mb-[14px]">
      <div className="card-title flex justify-between items-center gap-[10px] max-[640px]:flex-col max-[640px]:items-start">
        <span>Alert rules · {roleLabel}</span>
        <button
          type="button"
          className="btn btn-ai btn-sm text-[11px] py-1 px-[10px]"
          onClick={onAddRule}
        >
          + Add rule
        </button>
      </div>

      <div className="text-[11.5px] text-[var(--text-mid)] leading-[1.5] mb-3">{blurb}</div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th style={{ width: '18%' }}>Rule name</th>
              <th style={{ width: '34%' }}>Trigger condition</th>
              <th style={{ width: '10%' }}>Severity</th>
              <th style={{ width: '18%' }}>Channels</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.name} className="table-row">
                <td className="font-semibold text-[11.5px]">{r.name}</td>
                <td className="text-[11px] text-[var(--text-mid)]">{r.desc}</td>
                <td>
                  <span
                    className="badge text-[9.5px]"
                    style={{ background: severityColor(r.sev), color: '#fff' }}
                  >
                    {r.sev}
                  </span>
                </td>
                <td className="text-[11px]">{r.channels}</td>
                <td className="text-center">
                  <span
                    className={`badge text-[9.5px] ${r.enabled ? 'badge-active' : 'badge-assigned'}`}
                  >
                    {r.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm text-[10px] py-[3px] px-2"
                    onClick={() => onEditRule(r)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
