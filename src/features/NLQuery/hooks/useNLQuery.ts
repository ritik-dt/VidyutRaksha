// ── useNLQuery (Layer 3) ─────────────────────────────────────────────────────
// The sole API-integration seam for the NLQuery module. The prototype has no
// derivations and no scope — this hook simply owns the input text and exposes
// the static data pool in an API-ready shape (loading/error) so callers won't
// change when the pool becomes an async fetcher.

import { useCallback, useState } from 'react'
import {
  DEFAULT_QUERY,
  NL_RESULT_META,
  NL_RESULT_ROWS,
  NL_SQL_TEXT,
  NL_SUGGESTIONS,
} from '../data/nlQuery'

export function useNLQuery() {
  const [input, setInput] = useState<string>(DEFAULT_QUERY)

  /** Populate the input with a suggestion chip's text (send is not wired). */
  const applySuggestion = useCallback((label: string) => setInput(label), [])

  return {
    input,
    setInput,
    applySuggestion,
    // static content served by the hook so components stay data-free
    suggestions: NL_SUGGESTIONS,
    sqlText: NL_SQL_TEXT,
    resultMeta: NL_RESULT_META,
    resultRows: NL_RESULT_ROWS,
    // API-ready seam
    loading: false as const,
    error: null,
  }
}
