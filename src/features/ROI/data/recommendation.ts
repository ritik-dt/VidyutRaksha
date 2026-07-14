import type { Recommendation, RoiToast } from '../types'

/** Recommendation to CMD & Board — narrative paragraphs (contain <strong>). */
export const RECOMMENDATION: Recommendation = {
  approveHtml:
    '<strong>Approve 6-month KVVNL Varanasi-zone pilot</strong> (₹4.2 Cr capex · ₹1.4 Cr OpEx) with a hard ROI gate at month 6. Success gate: achieve ≥₹50 Cr in confirmed-theft Section 135 assessments. On meeting the gate, trigger statewide 24-month rollout. Decision required within FY26-Q1 to align with RDSS Tranche-2 disbursement window (deadline: 30 Jun 2026).',
  bottomLineHtml:
    '<strong style="color:var(--ai-purple)">Bottom line:</strong> Base-case ₹740 Cr/year recovery at ₹13.4 Cr/year run-cost. Payback in <strong>3.8 months</strong>. Even the conservative scenario (₹340 Cr/year) yields <strong>17× ROI</strong>. The downside is bounded by pilot cost; the upside is bounded by addressable theft pool (₹4,260 Cr).',
}

// ── Toast payloads (verbatim from prototype) ─────────────────────────────────
export const TOAST_EXPORT_MODEL: RoiToast = {
  type: 'success',
  title: 'Excel export ready',
  message:
    'ROI model exported with all assumptions, sensitivity tables, and 5-year cashflow. Locked PDF + unlocked XLSX sent to your email.',
  duration: 4500,
}

export const TOAST_DRAFT_TENDER: RoiToast = {
  type: 'ai',
  title: 'Tender response drafted',
  message:
    'AI generated a 14-page response to UPPCL/RDSS/2026 tender using this ROI as Exhibit B. Review in Reports.',
  duration: 4500,
}

export const TOAST_LOCK_SCOPE: RoiToast = {
  type: 'info',
  title: 'Pilot scope locked',
  message:
    'KVVNL Varanasi pilot scope drafted: 1,116 consumers · 49 DTRs · 10 feeders · 6-month gate. Ready for CMD signature.',
  duration: 4500,
}

export const TOAST_SEND_BOARD: RoiToast = {
  type: 'success',
  title: 'Board pack assembled',
  message:
    '18-page board pack with this ROI as Exhibit A, KVVNL pilot results as Exhibit B, and risk matrix as Exhibit C — sent to all 9 directors.',
  duration: 4500,
}
