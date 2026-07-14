import type { DqAiInsight } from '../types'

/** AI data-quality assessment banner. */
export const DQ_AI_INSIGHT: DqAiInsight = {
  title: '✦ AI data quality assessment',
  bodyHtml:
    'Overall health: <strong style="color:var(--amber)">Good with concerns</strong>. <strong>94.2%</strong> of meters have recent MRI data (last 30 days). <strong>47,200 meters</strong> haven\'t been read in 60+ days — concentrated in Raghunath Nagar and Kerakatpur areas (communication issues). Today\'s ingestion: <strong>18,420 files processed, 142 failed</strong> (0.77% failure rate — within target). <strong>Recommended action:</strong> Dispatch field teams to verify communication in Raghunath Nagar area.',
}
