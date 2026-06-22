import { useState, type ChangeEvent } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'

interface Rule {
  id: string
  name: string
  impact: 'High' | 'Medium' | 'Low'
  dot: string
  desc: string
  thresh: string
  tVal: string
  weight: number
  extra: string
  eOpts: string[]
  enabled: boolean
  flagCount: number
}

const INITIAL_RULES: Rule[] = [
  { id: 'R01', name: 'Consumption drop', impact: 'High', dot: 'var(--red)', desc: 'Flags meters where monthly kWh drops beyond threshold vs same period last year.', thresh: 'Drop threshold', tVal: '40%', weight: 8, extra: 'Min months', eOpts: ['3 months', '6 months'], enabled: true, flagCount: 312 },
  { id: 'R02', name: 'Earth loading events', impact: 'High', dot: 'var(--red)', desc: 'Flags meters with repeated earth loading events above threshold.', thresh: 'Min occurrences', tVal: '10', weight: 9, extra: 'Lookback', eOpts: ['6 months', '12 months'], enabled: true, flagCount: 89 },
  { id: 'R03', name: 'Max demand decline', impact: 'Medium', dot: 'var(--amber)', desc: 'Flags meters where kVA peak has dropped over consecutive periods.', thresh: 'MD drop', tVal: '30%', weight: 6, extra: 'Periods', eOpts: ['2 months', '3 months'], enabled: true, flagCount: 47 },
  { id: 'R04', name: 'Zero consumption', impact: 'High', dot: 'var(--red)', desc: 'Flags meters with zero kWh while communication is healthy.', thresh: 'Max kWh', tVal: '5', weight: 7, extra: 'Months', eOpts: ['2', '3'], enabled: true, flagCount: 203 },
  { id: 'R05', name: 'Night anomaly', impact: 'Medium', dot: 'var(--amber)', desc: 'Flags disproportionate night consumption vs daytime.', thresh: 'Night ratio', tVal: '60%', weight: 5, extra: 'Window', eOpts: ['22:00-06:00', '23:00-05:00'], enabled: true, flagCount: 134 },
  { id: 'R06', name: 'Consumer-only outage', impact: 'High', dot: 'var(--red)', desc: 'Flags meters with off-time while DTR is live — suggests deliberate disconnection.', thresh: 'Off-hrs/month', tVal: '20', weight: 8, extra: 'Window', eOpts: ['Night only', 'Any time'], enabled: true, flagCount: 78 },
  { id: 'R07', name: 'kWh-MD divergence', impact: 'Medium', dot: 'var(--amber)', desc: 'Flags when energy consumed is disproportionally low vs demand recorded.', thresh: 'Load factor', tVal: '25%', weight: 6, extra: 'Duration', eOpts: ['1 month', '3 months'], enabled: false, flagCount: 0 },
  { id: 'R08', name: 'Tariff category mismatch', impact: 'High', dot: 'var(--red)', desc: 'Flags consumers whose registered tariff is inconsistent with activity type.', thresh: 'Confidence', tVal: '80%', weight: 7, extra: 'Source', eOpts: ['GST data', 'Field report'], enabled: true, flagCount: 56 },
]

export default function RulesPage() {
  const { showToast } = useToast()
  const [rules, setRules] = useState(INITIAL_RULES)
  const [thresholds, setThresholds] = useState<Record<string, string>>(Object.fromEntries(INITIAL_RULES.map((r) => [r.id, r.tVal])))

  function toggleRule(id: string) {
    setRules((prev: Rule[]) => prev.map((r: Rule) => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  return (
    <div className="pb-8">
      <PageHeader
        title="🔧 Detection rules"
        subtitle="Configure the rule engine powering the suspicious meter detection pipeline"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Changes reverted', message: 'All rules restored to last saved state.', duration: 3000 })}>
              ↻ Revert changes
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Rules saved & applied', message: 'Rule changes will take effect in next nightly batch run.', duration: 4000 })}>
              💾 Save & apply
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI rule optimizer">
        Based on the last 90 days of inspection outcomes,{' '}
        <strong>R02 (Earth loading) has the highest hit rate at 74%</strong> — consider increasing its weight.{' '}
        <strong>R05 (Night anomaly)</strong> has a 38% false positive rate in agricultural areas — recommend adding a seasonal suppression filter.{' '}
        R07 is currently disabled — enabling it with a 3-month lookback is estimated to surface{' '}
        <strong>~120 additional high-value commercial targets</strong>.
      </AiInsightBanner>

      {/* Stats row */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Active rules', value: String(rules.filter((r: Rule) => r.enabled).length), sub: `of ${rules.length} configured`, accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Total flags', value: rules.filter((r: Rule) => r.enabled).reduce((s: number, r: Rule) => s + r.flagCount, 0).toLocaleString('en-IN'), sub: 'Across all active rules', accent: 'var(--red)', color: 'var(--red)' },
          { label: 'High impact', value: String(rules.filter((r: Rule) => r.impact === 'High' && r.enabled).length), sub: 'High-impact active rules', accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Avg model weight', value: (rules.filter((r: Rule) => r.enabled).reduce((s: number, r: Rule) => s + r.weight, 0) / Math.max(1, rules.filter((r: Rule) => r.enabled).length)).toFixed(1), sub: 'Risk score contribution', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-2xl font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map((r: Rule) => (
          <div key={r.id} className="card transition-all" style={{ opacity: r.enabled ? 1 : 0.6, borderLeft: `3px solid ${r.dot}` }}>
            <div className="flex items-start gap-4 p-[14px_16px]">
              {/* Toggle */}
              <button type="button" onClick={() => toggleRule(r.id)}
                className="relative mt-0.5 shrink-0 h-5 w-9 rounded-full transition-colors"
                style={{ background: r.enabled ? 'var(--green)' : 'var(--border)' }}>
                <div className="absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: r.enabled ? 'translateX(100%)' : 'translateX(2px)', left: 0 }} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-[10.5px] font-bold text-text-dim">{r.id}</span>
                  <span className="text-[13px] font-bold text-text">{r.name}</span>
                  <span className="rounded-md px-1.5 py-px text-[9.5px] font-bold"
                    style={{ background: r.impact === 'High' ? 'rgba(220,53,69,0.1)' : 'rgba(230,146,30,0.1)', color: r.dot }}>
                    {r.impact}
                  </span>
                  {r.enabled && r.flagCount > 0 && (
                    <span className="rounded-full px-2 py-px text-[10px] font-semibold"
                      style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--ai-purple)' }}>
                      {r.flagCount.toLocaleString('en-IN')} flagged
                    </span>
                  )}
                </div>
                <p className="mb-3 text-[11.5px] leading-[1.5] text-text-mid">{r.desc}</p>

                <div className="flex flex-wrap gap-4">
                  {/* Threshold input */}
                  <div>
                    <div className="mb-1 text-[10px] font-semibold text-text-dim">{r.thresh}</div>
                    <input type="text" value={thresholds[r.id]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setThresholds((prev: Record<string, string>) => ({ ...prev, [r.id]: e.target.value }))}
                      className="h-7 w-20 rounded-md border border-border bg-bg px-2 text-[11.5px] font-mono outline-none focus:border-ai-purple"
                      disabled={!r.enabled} />
                  </div>
                  {/* Extra option */}
                  <div>
                    <div className="mb-1 text-[10px] font-semibold text-text-dim">{r.extra}</div>
                    <select className="h-7 rounded-md border border-border bg-bg px-2 text-[11px] outline-none focus:border-ai-purple" disabled={!r.enabled}>
                      {r.eOpts.map((o: string) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* Weight */}
                  <div>
                    <div className="mb-1 text-[10px] font-semibold text-text-dim">Model weight (1–10)</div>
                    <div className="flex items-center gap-2">
                      <input type="range" min={1} max={10} defaultValue={r.weight}
                        className="w-20" disabled={!r.enabled} />
                      <span className="font-mono text-[11px] font-bold text-text">{r.weight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
