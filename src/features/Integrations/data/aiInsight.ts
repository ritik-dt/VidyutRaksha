import type { IntAiInsight } from '../types'

/** AI integration-health banner. */
export const INTEGRATIONS_AI_INSIGHT: IntAiInsight = {
  title: '✦ AI integration health',
  bodyHtml:
    '<strong>9 of 10 systems operational.</strong> <strong style="color:var(--red)">GIS system is down</strong> — last successful sync 3 hours ago. This doesn\'t affect theft detection but blocks geographic visualization refresh. <strong>SAP ERP showing degraded performance</strong> — sync latency up from 5min to 45min, recommend investigating network path. All critical systems (MRI, Billing, MDM, HES) are healthy.',
}
