import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { useCompare } from './hooks/useCompare'
import { CompareTabStrip } from './components/CompareTabStrip'
import { PeerScopeSelector } from './components/PeerScopeSelector'
import { PeerCharts } from './components/PeerCharts'
import { VarianceWaterfall } from './components/VarianceWaterfall'
import { PeerCompareTable } from './components/PeerCompareTable'
import { YoyTab } from './components/YoyTab'
import { BaTab } from './components/BaTab'
import { PercentileTab } from './components/PercentileTab'
import { ParetoTab } from './components/ParetoTab'
import { WhatIfTab } from './components/WhatIfTab'
import { peerContextLabel, totalRecoveredKwh } from './data/peerData'

export default function ComparePage() {
  const { showToast } = useToast()
  const {
    activeTab,
    setActiveTab,
    scopeName,
    peerScope,
    setPeerScope,
    selectedPeers,
    removePeer,
  } = useCompare()

  const peerHeading = peerContextLabel(selectedPeers, scopeName)
  const totalRec = totalRecoveredKwh(selectedPeers)
  const worst = [...selectedPeers].sort((a, b) => b.atcLossPct - a.atcLossPct)[0]
  const best = [...selectedPeers].sort((a, b) => a.atcLossPct - b.atcLossPct)[0]
  const gapPp = worst && best ? (worst.atcLossPct - best.atcLossPct).toFixed(1) : '0.0'
  const hitLow = selectedPeers.length > 0 ? Math.min(...selectedPeers.map((p) => p.hitRatePct)) : 0
  const hitHigh = selectedPeers.length > 0 ? Math.max(...selectedPeers.map((p) => p.hitRatePct)) : 0

  return (
    <div className="pb-2">
      <PageHeader
        title="⇄ Comparative & trend analysis"
        subtitle="Peer comparison, year-over-year, before/after impact, and percentile ranking — all in one place"
        actions={
          <>
            <select
              className="form-select"
              style={{ padding: '5px 8px', fontSize: 11 }}
              defaultValue="Last 12 months"
              onChange={(e) =>
                showToast({
                  type: 'info',
                  title: 'Time range',
                  message: `Loading data for ${e.target.value}.`,
                  duration: 2500,
                })
              }
            >
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>This quarter</option>
              <option>Custom range</option>
            </select>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI insight',
                  message: 'AI is generating a fresh comparative insight across all selected peers.',
                  duration: 4000,
                })
              }
            >
              ✦ AI insight
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI comparative analysis guide">
        Comparative analysis answers four critical questions:{' '}
        <strong className="text-ai-purple">(1) How does X compare to peers?</strong> (2) Is this
        year better than last year?{' '}
        <strong className="text-ai-purple">(3) Did VidyutRaksha deployment actually help?</strong>{' '}
        (4) Where does this entity rank in its cohort? Leveraging 3-4 years of historical data, the
        analyses below are precomputed for{' '}
        <strong className="text-ai-purple">10 feeders, 49 DTRs, and 1,116 consumers</strong> in the
        KVVNL pilot area.
      </AiInsightBanner>

      <CompareTabStrip activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'peer' && (
        <>
          <PeerScopeSelector
            peerScope={peerScope}
            onPeerScopeChange={setPeerScope}
            selectedPeers={selectedPeers}
            onRemovePeer={removePeer}
          />

          {selectedPeers.length > 0 && (
            <div
              className="card mt-3.5"
              style={{ border: '2px solid var(--ai-purple)' }}
            >
              <div
                className="card-title"
                style={{ color: 'var(--ai-purple)' }}
              >
                ✦ Peer comparison — {peerHeading}
                <ChartInfoButton chartId="peer-loss" />
              </div>

              <div
                className="ai-insight mb-3.5"
                style={{ background: 'var(--ai-purple-light)' }}
              >
                <div className="ai-insight-body" style={{ color: 'var(--ai-purple)' }}>
                  <strong>AI comparison:</strong>{' '}
                  {worst && (
                    <>
                      <strong>{worst.name}</strong> has the highest AT&C loss at{' '}
                      {worst.atcLossPct}% — {gapPp} percentage points worse than{' '}
                      <strong>{best?.name}</strong> ({best?.atcLossPct}%). Hit rate range: {hitLow}%
                      to {hitHigh}%. Total recovered energy across all {selectedPeers.length}{' '}
                      {selectedPeers.length === 1 ? 'feeder' : 'feeders'}:{' '}
                      <strong>{formatIndian(totalRec)} kWh</strong>. Rathayatra and Raghunath Nagar
                      correlate on both poor reliability and high loss — suggesting theft
                      concentration in areas with weaker enforcement presence.
                    </>
                  )}
                </div>
              </div>

              <PeerCharts peers={selectedPeers} />

              <div className="mt-4 border-t pt-3.5" style={{ borderColor: 'var(--border)' }}>
                <div className="mb-2 flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
                  <div className="text-[13px] font-bold">
                    ✦ Variance decomposition — why is Rathayatra 6.6pp worse than Bhelupur?
                  </div>
                  <span
                    className="rounded-[10px] px-2.5 py-[3px] text-[10.5px] font-semibold text-text-dim"
                    style={{ background: 'var(--bg)' }}
                  >
                    Best → Worst waterfall
                  </span>
                </div>
                <div className="mb-2.5 text-[11px] leading-relaxed text-text-mid">
                  Decomposing the gap into <strong>technical loss</strong> (infrastructure quality),{' '}
                  <strong>commercial loss</strong> (theft + unbilled), and{' '}
                  <strong>collection efficiency</strong> (billed but unpaid). This shifts the
                  conversation from <em>"Rathayatra is worse"</em> to{' '}
                  <em>
                    "Rathayatra is worse <strong>because of theft</strong>, not infrastructure — so
                    we need enforcement, not capex."
                  </em>
                </div>

                <VarianceWaterfall />

                <div
                  className="mt-2.5 rounded-md px-3 py-2.5 text-[11px] leading-relaxed"
                  style={{ background: 'var(--ai-purple-light)', color: 'var(--ai-purple)' }}
                >
                  <strong>✦ AI interpretation:</strong> Of the 6.6pp gap,{' '}
                  <strong>4.8pp (73%) is commercial loss</strong> — theft, bypass, unbilled meters.
                  Only <strong>1.2pp is technical</strong> (infrastructure age) and{' '}
                  <strong>0.6pp is collection</strong>.{' '}
                  <strong>The intervention is enforcement, not engineering.</strong> If Rathayatra's
                  commercial loss drops to Bhelupur level, AT&C falls from 24.8% to 20.0% — a
                  one-action fix worth ~₹4.2 Cr/year.
                </div>
              </div>

              <PeerCompareTable peers={selectedPeers} />
            </div>
          )}
        </>
      )}

      {activeTab === 'yoy' && <YoyTab scopeName={scopeName} />}

      {activeTab === 'ba' && <BaTab scopeName={scopeName} />}

      {activeTab === 'pct' && <PercentileTab scopeName={scopeName} />}

      {activeTab === 'pareto' && <ParetoTab />}

      {activeTab === 'whatif' && <WhatIfTab />}
    </div>
  )
}
