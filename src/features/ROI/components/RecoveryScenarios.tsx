import type { RecoveryScenario } from '../types'

interface RecoveryScenariosProps {
  scenarios: RecoveryScenario[]
}

/** Tone → border colour + bg tint + accent (label/value/bullet) colour. */
function scenarioStyles(tone: string): { bg: string; border: string; accent: string } {
  switch (tone) {
    case 'amber':  return { bg: 'rgba(230,146,30,0.05)', border: 'var(--amber)',     accent: 'var(--amber)' }
    case 'purple': return { bg: 'rgba(124,58,237,0.05)', border: 'var(--ai-purple)', accent: 'var(--ai-purple)' }
    case 'green':  return { bg: 'rgba(40,167,69,0.05)',  border: 'var(--green)',     accent: 'var(--green)' }
    default:       return { bg: 'var(--card)',            border: 'var(--border)',    accent: 'var(--text)' }
  }
}

/**
 * 3 AI-attributable recovery scenario cards (Conservative amber, Realistic
 * purple, Optimistic green). Each shows:
 *   • Small uppercase label in accent colour
 *   • Big 30px monospace recovery number in accent
 *   • Sub-text with "of theft pool" %
 *   • Dashed-top-border description
 *   • Uppercase "Assumptions" label
 *   • Bulleted assumption list with accent-colored bullets
 *
 * Responsive: 3-col → 2-col at ≤900px → 1-col at ≤640px.
 */
export function RecoveryScenarios({ scenarios }: RecoveryScenariosProps) {
  return (
    <div className="grid grid-cols-3 gap-[14px] mb-[14px] max-[900px]:grid-cols-2 max-[640px]:grid-cols-1 max-[480px]:gap-[10px]">
      {scenarios.map((s) => {
        const st = scenarioStyles(s.tone)
        return (
          <div
            key={s.id}
            className="card !m-0 flex flex-col min-w-0"
            style={{ background: st.bg, border: `1px solid ${st.border}` }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-[0.5px]"
              style={{ color: st.accent }}
            >
              {s.label}
            </div>
            <div
              className="text-[30px] font-extrabold font-['JetBrains_Mono',_ui-monospace,_monospace] mt-[6px] leading-none break-words max-[900px]:text-[26px] max-[480px]:text-[24px]"
              style={{ color: st.accent }}
            >
              {s.recovery}
            </div>
            <div className="text-[11px] text-[var(--text-mid)] mt-[2px] [&_strong]:text-[var(--text)] break-words">
              recovered per year · <strong>{s.pct}</strong> of theft pool
            </div>
            <div className="text-[10.5px] text-[var(--text-mid)] leading-[1.45] mt-[10px] pt-[10px] border-t border-dashed border-[var(--border)] break-words">
              {s.desc}
            </div>
            <div className="mt-[10px] text-[9.5px] font-bold text-[var(--text-dim)] uppercase tracking-[0.3px]">
              Assumptions
            </div>
            <div className="mt-[4px] text-[10px] text-[var(--text-mid)] leading-[1.5]">
              {s.assumptions.map((a, i) => (
                <div key={i} className="flex items-start gap-[6px] mb-[2px]">
                  <span className="shrink-0" style={{ color: st.accent }}>●</span>
                  <span className="break-words">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
