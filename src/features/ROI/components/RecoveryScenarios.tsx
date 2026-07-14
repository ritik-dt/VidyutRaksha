import type { RecoveryScenario } from '../types'

interface RecoveryScenariosProps {
  scenarios: RecoveryScenario[]
}

/** 3 AI-attributable recovery scenario cards. */
export function RecoveryScenarios({ scenarios }: RecoveryScenariosProps) {
  return (
    <div className="grid-3" style={{ marginBottom: 14 }}>
      {scenarios.map((s) => (
        <div key={s.id} className={`card roi-scenario roi-tone-${s.tone}`}>
          <div className="roi-scenario-label">{s.label}</div>
          <div className="roi-scenario-value">{s.recovery}</div>
          <div className="roi-scenario-sub">
            recovered per year · <strong>{s.pct}</strong> of theft pool
          </div>
          <div className="roi-scenario-desc">{s.desc}</div>
          <div className="roi-scenario-ass-label">Assumptions</div>
          <div className="roi-scenario-ass">
            {s.assumptions.map((a, i) => (
              <div key={i} className="roi-scenario-ass-item">
                <span>●</span>
                {a}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
