import { severityColor } from '../logic/settingsLogic'
import type { AlertRule } from '../types'

interface AlertRulesTableProps {
  rules: AlertRule[]
  blurb: string
  roleLabel: string
  onAddRule: () => void
  onEditRule: (r: AlertRule) => void
}

/** 8 alert rules — configuration lives here rather than on the Alerts page. */
export function AlertRulesTable({
  rules,
  blurb,
  roleLabel,
  onAddRule,
  onEditRule,
}: AlertRulesTableProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title set-card-title-row">
        <span>Alert rules · {roleLabel}</span>
        <button type="button" className="btn btn-ai btn-sm set-btn-add" onClick={onAddRule}>
          + Add rule
        </button>
      </div>

      <div className="set-blurb">{blurb}</div>

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
                <td className="set-rule-name">{r.name}</td>
                <td className="set-rule-desc">{r.desc}</td>
                <td>
                  <span
                    className="badge set-badge-sm"
                    style={{ background: severityColor(r.sev), color: '#fff' }}
                  >
                    {r.sev}
                  </span>
                </td>
                <td className="set-rule-chan">{r.channels}</td>
                <td className="set-rule-status">
                  <span
                    className={`badge set-badge-sm ${r.enabled ? 'badge-active' : 'badge-assigned'}`}
                  >
                    {r.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm set-btn-xs"
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
