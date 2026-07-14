import { fmtINRFull, formatIndian } from '@/shared/utils/formatters'
import { CALCULATION_METHODS } from '../data/assessment'
import type { AssessmentMethod } from '../types'

interface MethodComparisonTableProps {
  onSelectMethod: (m: AssessmentMethod) => void
}

function confidenceStyle(confidence: number): { bg: string; color: string; border: string } {
  if (confidence >= 90) {
    return { bg: 'rgba(220,53,69,0.10)', color: 'var(--red)', border: 'var(--red)' }
  }
  if (confidence >= 80) {
    return { bg: 'rgba(40,167,69,0.10)', color: 'var(--green)', border: 'rgba(40,167,69,0.5)' }
  }
  return {
    bg: 'var(--amber-light, rgba(230,146,30,0.12))',
    color: 'var(--amber-dark, #92400e)',
    border: 'var(--amber)',
  }
}

/** "Comparison — 3 calculation methods" card. */
export function MethodComparisonTable({ onSelectMethod }: MethodComparisonTableProps) {
  return (
    <div className="card">
      <div className="card-title">Comparison — 3 calculation methods (AI confidence per method)</div>
      <div className="table-wrap">
        <table className="min-w-[720px]">
          <thead>
            <tr className="table-header">
              <th>Method</th>
              <th>Description</th>
              <th>Stolen energy</th>
              <th>Principal</th>
              <th>With penalty</th>
              <th>AI confidence</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CALCULATION_METHODS.map((m) => {
              const conf = confidenceStyle(m.confidence)
              return (
                <tr
                  key={m.id}
                  className="table-row"
                  style={m.recommended ? { background: 'rgba(40,167,69,0.05)' } : undefined}
                >
                  <td
                    className="font-bold"
                    style={m.recommended ? { color: 'var(--green)' } : undefined}
                  >
                    {m.name}
                  </td>
                  <td className="text-[11px]">{m.description}</td>
                  <td className="font-mono whitespace-nowrap">{formatIndian(m.stolenKwh)} kWh</td>
                  <td className="font-mono whitespace-nowrap">{fmtINRFull(m.principal)}</td>
                  <td
                    className="font-mono font-bold whitespace-nowrap"
                    style={m.recommended ? { color: 'var(--red)' } : undefined}
                  >
                    {fmtINRFull(m.withPenalty)}
                  </td>
                  <td>
                    <span
                      className="inline-block whitespace-nowrap rounded-[10px] px-2 py-[3px] text-[10px] font-semibold"
                      style={{
                        background: conf.bg,
                        color: conf.color,
                        border: `1px solid ${conf.border}`,
                      }}
                    >
                      {m.confidence}% confident
                    </span>
                  </td>
                  <td>
                    {m.recommended ? (
                      <span className="font-bold" style={{ color: 'var(--green)' }}>
                        SELECTED
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 10 }}
                        onClick={() => onSelectMethod(m)}
                      >
                        Use this
                      </button>
                    )}
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
