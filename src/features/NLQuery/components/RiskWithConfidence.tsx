interface RiskWithConfidenceProps {
  risk: number
  confidence: number
}

/** Map a 0–100 risk score → .risk-circle tier class. Mirrors prototype `rc()`. */
function tierClass(risk: number): string {
  if (risk >= 70) return 'risk-circle risk-high'
  if (risk >= 40) return 'risk-circle risk-mid'
  return 'risk-circle risk-low'
}

/**
 * Local port of the prototype's `riskWithConf(risk, conf)` helper: a risk
 * tier circle next to a small confidence bar + percent label.
 */
export function RiskWithConfidence({ risk, confidence }: RiskWithConfidenceProps) {
  return (
    <div className="risk-wrap">
      <div className={tierClass(risk)}>{risk}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="w-[24px] h-[3px] rounded-[2px] bg-[rgba(124,58,237,0.15)]">
          <div
            className="h-full rounded-[2px] bg-[var(--ai-purple)]"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span style={{ fontSize: 8, color: 'var(--ai-purple)', fontWeight: 600 }}>
          {confidence}%
        </span>
      </div>
    </div>
  )
}
