import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface LineageModalProps {
  open: boolean
  onClose: () => void
}

const PIPELINE = [
  { step: 'AMISP HES', icon: '📥', desc: 'Smart meter cloud', sub: 'Genus · Linkwell · Capital' },
  { step: 'MRI batch', icon: '📊', desc: 'Monthly readings', sub: 'CSV · JSON · 28-day' },
  { step: 'AI model', icon: '✦', desc: '16 tamper signals', sub: 'Ensemble · XGBoost + rules' },
  { step: 'Risk score', icon: '🎯', desc: 'Per-meter 0-100', sub: 'Confidence-weighted' },
  { step: 'This UI', icon: '🖥️', desc: 'You are here', sub: 'Live dashboards + cases' },
]

const SOURCE_SYSTEMS = [
  { s: 'AMISP HES (3 vendors)', w: 'Push-pull MRI · interval load · tamper events · billing reads', c: '1,116 / 1,116 meters', d: '30-min push · daily batch' },
  { s: 'CIS billing (SAP-IS-U)', w: 'Tariff · sanctioned load · consumer category · payment history', c: '1,116 / 1,116 consumers', d: 'Daily ETL' },
  { s: 'GIS network model', w: 'Feeder/DTR topology · consumer ↔ DTR mapping · distance', c: '49 / 49 DTRs', d: 'Weekly sync' },
  { s: 'Inspection forms (mobile)', w: 'Field outcomes · photos · vigilance notes · ground truth', c: '12,040 inspections FYTD', d: 'Real-time' },
  { s: 'GRP / billing audit', w: 'Assessment values · Sec 135 notices · recovery confirmation', c: '6,870 confirmed cases', d: 'Weekly close' },
]

const TAMPER_SIGNALS = [
  { n: 'Earth loading', w: '0.14', d: 'Earth wire current > threshold' },
  { n: 'Magnet tamper', w: '0.12', d: 'Hall-effect sensor trigger' },
  { n: 'Cover open', w: '0.10', d: 'Tamper switch on meter cover' },
  { n: 'Neutral tamper', w: '0.10', d: 'Neutral wire disconnected' },
  { n: 'CT manipulation', w: '0.10', d: 'Phase angle outside ±35° band' },
  { n: 'Reverse current', w: '0.09', d: 'Power flowing meter → grid' },
  { n: 'Low PF lifetime', w: '0.08', d: 'Lifetime PF < 0.85' },
  { n: 'Zero load anomaly', w: '0.07', d: '>70% intervals at zero kWh' },
  { n: 'Voltage interruption', w: '0.05', d: 'Low voltage events > 100/mo' },
  { n: 'Phase imbalance', w: '0.04', d: 'I-RMS deviation > 25% across phases' },
  { n: 'Consumption drop', w: '0.04', d: 'kWh fell > 60% vs 6-month avg' },
  { n: 'Billing/MRI gap', w: '0.03', d: 'Billed kWh ≠ MRI kWh by > 10%' },
  { n: 'Site load mismatch', w: '0.02', d: 'Load > sanctioned by > 30%' },
  { n: 'Activity/tariff mismatch', w: '0.01', d: 'Commercial load on domestic tariff' },
  { n: 'Comms offline', w: '0.005', d: 'No MRI > 48h (AMISP SLA breach)' },
  { n: 'Cluster correlation', w: '0.005', d: 'Co-located meters with same pattern' },
]

const MODEL_LINEAGE = [
  { l: 'Model version', v: 'risk-v3.4.1' },
  { l: 'Last trained', v: '15 Apr 2026 · on 3-year inspection ground truth (47,238 labels)' },
  { l: 'Holdout AUC', v: '0.91 · F1: 0.82 · precision @ top-100: 0.78' },
  { l: 'Drift monitoring', v: 'PSI < 0.18 across all features for last 90 days' },
  { l: 'Bias audit', v: 'Equal precision (±3%) across consumer tariff categories · last audited 28 Apr 2026' },
  { l: 'Refresh cadence', v: 'Daily inference at 06:00 IST · weekly retrain on new ground truth' },
  { l: 'Human override rate', v: 'AI score upheld in 73% of inspector decisions (last 30 days)' },
]

const SECTION_LABEL =
  'mb-2.5 text-[11px] font-bold uppercase tracking-[0.4px] text-text-dim'
const TH =
  'px-[9px] py-[7px] text-left text-[9.5px] font-bold uppercase text-text-dim'

export function LineageModal({ open, onClose }: LineageModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      id="provenanceOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 [backdrop-filter:blur(5px)]"
      style={{ background: 'rgba(11,18,32,.72)' }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-y-auto rounded-[14px] border border-border bg-card shadow-[0_30px_70px_rgba(0,0,0,.5)]">
        {/* Sticky header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-[14px] border-b border-border px-5 py-[18px] sm:px-[26px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(40,167,69,0.06) 0%, rgba(124,58,237,0.03) 100%)',
          }}
        >
          <div>
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.6px] text-green">
              📡 Data Lineage
            </div>
            <div className="text-[16px] font-bold text-text">
              Where does this data come from?
            </div>
            <div className="mt-px text-[11px] text-text-mid">
              End-to-end pipeline · source systems → AI model → screens you see
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-bg text-[15px] text-text-mid hover:text-text"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-[22px] sm:px-7">
          {/* 1 · Pipeline flow */}
          <div className="mb-[22px]">
            <div className={SECTION_LABEL}>1 · Pipeline flow</div>
            <div className="grid grid-cols-2 items-stretch gap-1.5 sm:grid-cols-3 md:grid-cols-5">
              {PIPELINE.map((s, i) => (
                <div
                  key={s.step}
                  className="relative rounded-[7px] border border-border bg-bg px-2 py-2.5 text-center"
                >
                  <div className="mb-1 text-[18px] leading-none">{s.icon}</div>
                  <div className="mb-0.5 text-[10.5px] font-bold text-text">
                    {s.step}
                  </div>
                  <div className="text-[9.5px] leading-[1.3] text-text-mid">
                    {s.desc}
                  </div>
                  <div className="mt-[3px] text-[8.5px] text-text-dim italic">
                    {s.sub}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="absolute top-1/2 -right-[7px] z-[2] flex size-3.5 -translate-y-1/2 items-center justify-center rounded-full bg-card text-[14px] font-bold text-ai-purple max-md:hidden">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2 · Source systems */}
          <div className="mb-[22px]">
            <div className={SECTION_LABEL}>2 · Source systems</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className={TH}>System</th>
                    <th className={TH}>What it provides</th>
                    <th className={`${TH} text-right`}>Coverage</th>
                    <th className={`${TH} text-right`}>Cadence</th>
                  </tr>
                </thead>
                <tbody>
                  {SOURCE_SYSTEMS.map((r) => (
                    <tr key={r.s} className="border-b border-border-light">
                      <td className="px-[9px] py-2 font-semibold text-text">
                        {r.s}
                      </td>
                      <td className="px-[9px] py-2 text-[10.5px] text-text-mid">
                        {r.w}
                      </td>
                      <td className="px-[9px] py-2 text-right font-mono text-[10px] text-text">
                        {r.c}
                      </td>
                      <td className="px-[9px] py-2 text-right text-[10px] text-text-mid">
                        {r.d}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 · Tamper signal categories */}
          <div className="mb-[22px]">
            <div className={SECTION_LABEL}>3 · 16 tamper signal categories</div>
            <div className="grid grid-cols-1 gap-1.5 text-[10.5px] sm:grid-cols-2">
              {TAMPER_SIGNALS.map((c) => (
                <div
                  key={c.n}
                  className="flex items-center justify-between gap-2 rounded-[5px] border border-border-light bg-bg px-[9px] py-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-bold text-text">
                      {c.n}
                    </div>
                    <div className="text-[9.5px] leading-[1.3] text-text-dim">
                      {c.d}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[10.5px] font-extrabold text-ai-purple">
                    w={c.w}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-text-dim italic">
              Weights are learned via XGBoost on 3-year ground-truth from
              inspections + appeals. Updated quarterly. Sum of weights = 1.00.
            </div>
          </div>

          {/* 4 · Model lineage & validation */}
          <div className="mb-[22px]">
            <div className={SECTION_LABEL}>4 · Model lineage & validation</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <tbody>
                  {MODEL_LINEAGE.map((r) => (
                    <tr key={r.l} className="border-b border-border-light">
                      <td className="w-[32%] px-[9px] py-[7px] text-text-mid">
                        {r.l}
                      </td>
                      <td className="px-[9px] py-[7px] font-semibold text-text">
                        {r.v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-[7px] border px-[13px] py-2.5 text-[10.5px] leading-[1.5] text-text-mid"
            style={{
              background: 'rgba(124,58,237,.04)',
              borderColor: 'rgba(124,58,237,.2)',
            }}
          >
            <strong className="text-ai-purple">✦ Prototype note:</strong> This
            pilot ingests real KVVNL Varanasi Zone Mar-2026 MRI data (1,116
            consumers, 1,371 lifetime tamper events). State-wide and 5-DISCOM
            aggregates are extrapolated proportionally. Production deployment
            would consume live AMISP feeds from all 5 DISCOMs (~15 lakh smart
            meters at scale).
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
