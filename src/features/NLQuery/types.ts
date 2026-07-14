// ── NLQuery module types (Layer 0) ───────────────────────────────────────────
// Faithful port of the prototype's renderNLQuery(). The screen has no state,
// no scope, and no computed logic — every string, row, and count is a fixed
// example. These types describe the shape of that static example.

/** One suggestion chip in the "Try:" row. */
export interface NlSuggestion {
  /** Text shown inside the chip. Quotes are part of the prototype content. */
  label: string
}

/** One row of the example result table. */
export interface NlResultRow {
  meter: string
  area: string
  /** Percentage with sign, e.g. "-54%". */
  drop: string
  /** Earth-loading event count. */
  events: number
  /** 0–100 risk score. */
  risk: number
  /** 0–100 model confidence. */
  confidence: number
}

/** Header + footer meta for the result card. */
export interface NlResultMeta {
  /** e.g. "AI found 23 meters" (sparkle prefix is added in the component). */
  headerTitle: string
  /** e.g. "in 0.4s". */
  headerLatency: string
  /** e.g. "3 of 23". */
  footerCount: string
}
