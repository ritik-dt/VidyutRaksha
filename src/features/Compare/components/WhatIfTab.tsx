import { useWhatIf } from '../hooks/useWhatIf'
import { WhatIfSliderCard } from './WhatIfSliderCard'
import { WhatIfPresets } from './WhatIfPresets'
import { WhatIfResults } from './WhatIfResults'

/** What-if simulator tab (screenshots 1-4). Ai-purple bordered card. */
export function WhatIfTab() {
  const {
    state,
    results,
    noChange,
    setHitRateBoost,
    setFixBottomFeeders,
    setInspectorBoost,
    applyPreset,
    reset,
  } = useWhatIf()

  return (
    <div className="card" style={{ border: '2px solid var(--ai-purple)' }}>
      <div
        className="card-title flex items-center justify-between gap-2 max-md:flex-col max-md:items-start"
        style={{ color: 'var(--ai-purple)' }}
      >
        <span>✦ What-if simulator — model interventions before committing budget</span>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ fontSize: 10.5 }}
          onClick={reset}
        >
          ↻ Reset to baseline
        </button>
      </div>

      <div className="ai-insight mb-3.5">
        <div className="ai-insight-body">
          Move sliders to model interventions. The math is grounded in real program economics —
          each lever uses a defensible formula (shown at the bottom). Current baseline:{' '}
          <strong className="text-ai-purple">
            20.5% AT&C loss · 57% hit rate · ₹14.2 Cr/yr recovery · 7.9× ROI
          </strong>
          .
        </div>
      </div>

      <div className="grid-2 mb-3.5 gap-3.5">
        <div className="min-w-0">
          <WhatIfSliderCard
            emoji="🎯"
            title="Improve hit rate"
            valuePrefix="+"
            valueDisplay={String(state.hitRateBoost)}
            valueSuffix="pp"
            valueColor="var(--ai-purple)"
            accentColor="var(--ai-purple)"
            min={0}
            max={18}
            step={1}
            value={state.hitRateBoost}
            onChange={setHitRateBoost}
            labels={['57%', '66%', '75% (industry top)']}
            description={
              <>
                Better AI targeting → more confirmed cases per inspection. Each +1pp hit rate ≈ ₹30
                lakh additional annual recovery at current scale.
              </>
            }
            background="rgba(124,58,237,0.04)"
          />
        </div>

        <div className="min-w-0">
          <WhatIfSliderCard
            emoji="🔧"
            title="Fix bottom feeders"
            valueDisplay={String(state.fixBottomFeeders)}
            valueSuffix=" feeders"
            valueColor="var(--red)"
            accentColor="var(--red)"
            min={0}
            max={5}
            step={1}
            value={state.fixBottomFeeders}
            onChange={setFixBottomFeeders}
            labels={['0', '3', '5 (worst → median)']}
            description={
              <>
                Bring worst feeders (Rathayatra, Raghunath, Chauk) to median 19.8% loss. Each fix ≈
                ₹80 lakh/yr recovery + 0.4pp zone-level loss reduction.
              </>
            }
            background="rgba(220,53,69,0.04)"
          />
        </div>

        <div className="min-w-0">
          <WhatIfSliderCard
            emoji="👥"
            title="Expand inspector team"
            valuePrefix="+"
            valueDisplay={String(state.inspectorBoost)}
            valueSuffix=" inspectors"
            valueColor="var(--green)"
            accentColor="var(--green)"
            min={0}
            max={8}
            step={1}
            value={state.inspectorBoost}
            onChange={setInspectorBoost}
            labels={['8 (current)', '12', '16 (2× team)']}
            description={
              <>
                Each new inspector handles ~150 cases/yr.{' '}
                <strong style={{ color: 'var(--amber)' }}>Diminishing returns past 4 hires</strong>{' '}
                due to case-pipeline saturation. Cost: ₹6L/yr each.
              </>
            }
            background="rgba(40,167,69,0.04)"
          />
        </div>

        <div className="min-w-0">
          <WhatIfPresets onApply={applyPreset} />
        </div>
      </div>

      <WhatIfResults state={state} results={results} noChange={noChange} />
    </div>
  )
}
