import { useState, useMemo, useCallback } from 'react'
import {
  WHAT_IF_INITIAL,
  isBaseline,
  whatIfCompute,
  type WhatIfState,
} from '../data/whatIfData'

/** What-if simulator state — 3 sliders + derived results + helpers. */
export function useWhatIf() {
  const [state, setState] = useState<WhatIfState>(WHAT_IF_INITIAL)

  const results = useMemo(() => whatIfCompute(state), [state])
  const noChange = useMemo(() => isBaseline(state), [state])

  const setHitRateBoost = useCallback(
    (v: number) => setState((s) => ({ ...s, hitRateBoost: v })),
    [],
  )
  const setFixBottomFeeders = useCallback(
    (v: number) => setState((s) => ({ ...s, fixBottomFeeders: v })),
    [],
  )
  const setInspectorBoost = useCallback(
    (v: number) => setState((s) => ({ ...s, inspectorBoost: v })),
    [],
  )
  const applyPreset = useCallback((preset: WhatIfState) => setState({ ...preset }), [])
  const reset = useCallback(() => setState(WHAT_IF_INITIAL), [])

  return {
    state,
    results,
    noChange,
    setHitRateBoost,
    setFixBottomFeeders,
    setInspectorBoost,
    applyPreset,
    reset,
  }
}
