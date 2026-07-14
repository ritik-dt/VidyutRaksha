import type { NlResultMeta, NlResultRow } from '../types'
import { RiskWithConfidence } from './RiskWithConfidence'

interface NlResultCardProps {
  meta: NlResultMeta
  sqlText: string
  rows: NlResultRow[]
  onExport: () => void
  onViewAll: () => void
}

/**
 * The result card. Always visible in the prototype (not conditional on submit).
 * Header shows "✦ AI found N meters · in Xs · [SQL] · Export"; body shows the
 * generated SQL; then a 3-row table with risk+confidence; footer shows
 * "N of M • View all →".
 */
export function NlResultCard({ meta, sqlText, rows, onExport, onViewAll }: NlResultCardProps) {
  return (
    <div className="nl-result">
      {/* Header */}
      <div className="nl-header">
        <div>
          <span style={{ fontSize: 12, fontWeight: 500 }}>✦ {meta.headerTitle}</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 6 }}>
            {meta.headerLatency}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span className="badge badge-ai">SQL</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={onExport}>
            Export
          </button>
        </div>
      </div>

      {/* SQL block — \n in the data renders as a hard break */}
      <div className="nl-sql">
        {sqlText.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </div>

      {/* Result table */}
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--bg)' }}>
              <th style={{ borderBottom: '1px solid var(--border)' }}>Meter</th>
              <th style={{ borderBottom: '1px solid var(--border)' }}>Area</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid var(--border)' }}>Drop</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid var(--border)' }}>Events</th>
              <th style={{ textAlign: 'center', borderBottom: '1px solid var(--border)' }}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.meter} className="table-row">
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--id-text)' }}>
                  {r.meter}
                </td>
                <td style={{ color: 'var(--text-mid)' }}>{r.area}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--red)' }}>
                  {r.drop}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{r.events}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex' }}>
                    <RiskWithConfidence risk={r.risk} confidence={r.confidence} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: 'var(--text-dim)' }}>
        {meta.footerCount} •{' '}
        <span
          role="button"
          tabIndex={0}
          onClick={onViewAll}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onViewAll()
            }
          }}
          style={{ color: 'var(--ai-purple)', cursor: 'pointer' }}
        >
          View all →
        </span>
      </div>
    </div>
  )
}
