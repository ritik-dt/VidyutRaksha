import { useMemo, useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { useDtLoad } from './hooks/useDtLoad'
import { DtLoadKpiStrip } from './components/DtLoadKpiStrip'
import { DtHealthBar } from './components/DtHealthBar'
import { CriticalDtCard } from './components/CriticalDtCard'
import { WarningDtCard } from './components/WarningDtCard'
import { DtPillList } from './components/DtPillList'
import { ExcessDemandSection } from './components/ExcessDemandSection'
import { DtDetailModal } from './components/DtDetailModal'
import { ratio } from './logic/dtLogic'
import { computeExcessDemand } from './logic/excessDemand'
import type { DT } from './types'

export default function DtLoadPage() {
  const { showToast } = useToast()
  const {
    scope,
    scopeName,
    isStateLevel,
    allDts,
    stats,
    buckets,
    isFilteredEmpty,
    filter,
  } = useDtLoad()

  const [selectedDt, setSelectedDt] = useState<DT | null>(null)
  const excessDemand = useMemo(() => computeExcessDemand(scope.hierPath), [scope.hierPath])

  const hasDts = allDts.length > 0
  const isFiltered = filter !== null
  const worst = allDts.length > 0 ? [...allDts].sort((a, b) => ratio(b) - ratio(a))[0] : null

  // ── AI insight body ──
  const insightBody = !hasDts ? (
    <>
      <strong>No distribution transformer data at {scopeName}.</strong> The Load management page covers KVVNL
      Varanasi territory in this prototype. Navigate up to UPPCL or KVVNL to see all 10 demo DTs.
    </>
  ) : stats.projOverload > 0 && worst ? (
    <>
      <strong>
        {stats.projOverload} DT{stats.projOverload > 1 ? 's are' : ' is'} predicted to overload
      </strong>{' '}
      in the next 90 days at <strong>{scopeName}</strong>. <strong>{worst.id}</strong> is the most critical at{' '}
      <strong style={{ color: 'var(--red)' }}>{Math.round(ratio(worst) * 100)}% current loading</strong> with
      projected {Math.round((worst.projectedLoad90 / worst.capacity) * 100)}% in 90 days.
      {stats.criticalLoss > 0 && (
        <>
          {' '}
          <strong>
            {stats.criticalLoss} DT{stats.criticalLoss > 1 ? 's have' : ' has'} loss &gt; 15%
          </strong>{' '}
          — likely theft or technical issue.
        </>
      )}
    </>
  ) : stats.criticalLoss > 0 ? (
    <>
      Capacity is healthy at <strong>{scopeName}</strong> but{' '}
      <strong style={{ color: 'var(--red)' }}>
        {stats.criticalLoss} DT{stats.criticalLoss > 1 ? 's have' : ' has'} loss &gt; 15%
      </strong>{' '}
      — likely commercial loss (theft) or technical issue. Recommend energy audit on:{' '}
      {allDts
        .filter((d) => d.loss > 15)
        .map((d) => d.id)
        .join(', ')}
      .
    </>
  ) : (
    <>
      All {allDts.length} DTs at <strong>{scopeName}</strong> operating within healthy parameters. No immediate
      intervention needed.
    </>
  )

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="⚡ Load management"
        subtitle={
          <>
            Distribution transformer capacity, loss %, and overload prediction · sanctioned-demand monitoring ·{' '}
            {isStateLevel ? (
              'showing state-wide totals'
            ) : (
              <>
                filtered to <strong>{scopeName}</strong>
              </>
            )}
          </>
        }
        actions={
          <button
            type="button"
            className="btn btn-ai btn-sm"
            onClick={() =>
              showToast({
                type: 'ai',
                title: 'AI load advisor',
                message:
                  'In production: would draft load-balancing work orders, recommend phase rebalancing, and predict future overloads.',
                duration: 5000,
              })
            }
          >
            ✦ AI load advisor
          </button>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: hasDts ? 'var(--text)' : 'var(--text-dim)',
                fontFamily: 'var(--mono)',
              }}
            >
              {allDts.length} DT{allDts.length === 1 ? '' : 's'}
            </span>
            {scope.hierPath.length > 1 && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: 10.5, padding: '4px 10px' }}
                onClick={() => scope.navigateToPathIndex(0)}
              >
                ↕ Change scope
              </button>
            )}
          </div>
        }
      />

      <AiInsightBanner title={`AI load analysis · ${scopeName}`}>{insightBody}</AiInsightBanner>

      {!hasDts && (
        <div className="card" style={{ padding: 36, textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 8, opacity: 0.5 }}>⚡</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            No distribution transformer data at {scopeName}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-mid)',
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            The Load management page covers KVVNL Varanasi territory in this prototype. State-wide there are{' '}
            <strong>10 demo DTs</strong> — navigate up to UPPCL or KVVNL to view them.
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => scope.navigateToPathIndex(0)}
          >
            ↕ Change scope
          </button>
        </div>
      )}

      {hasDts && (
        <>
          <DtLoadKpiStrip stats={stats} excessDemandCount={excessDemand.length} />

          <DtHealthBar
            allDts={allDts}
            sortedAll={buckets.sortedAll}
            bucketCounts={{
              overloaded: buckets.overloaded.length,
              nearOverload: buckets.nearOverload.length,
              optimal: buckets.optimal.length,
              underUtilised: buckets.underUtilised.length,
            }}
            scopeName={scopeName}
            isStateLevel={isStateLevel}
            onSelectDt={setSelectedDt}
          />

          {isFiltered && isFilteredEmpty && (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>⚡</div>
              <div style={{ fontWeight: 700, color: 'var(--text-mid)', fontSize: 14 }}>No DTs match this filter</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>Try clearing the filter to see all transformers.</div>
            </div>
          )}

          {buckets.overloaded.length > 0 && (
            <>
              <div
                id="overloaded-dts-section"
                className="dt-section-header"
                style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 10px', flexWrap: 'wrap' }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)' }} />
                <div className="dt-section-label" style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Overloaded · {buckets.overloaded.length}
                </div>
                <div className="dt-section-desc" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  &gt;100% loading — act this week, capacity upgrade or load redistribution
                </div>
              </div>
              {buckets.overloaded.map((d) => (
                <CriticalDtCard key={d.id} dt={d} onSelectDt={setSelectedDt} />
              ))}
            </>
          )}

          {buckets.nearOverload.length > 0 && (
            <>
              <div
                id="near-overload-dts-section"
                className="dt-section-header"
                style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 10px', flexWrap: 'wrap' }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }} />
                <div className="dt-section-label" style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Near-overload · {buckets.nearOverload.length}
                </div>
                <div className="dt-section-desc" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  85–100% loading — plan within 30 days, monitor closely
                </div>
              </div>
              <div className="dt-warning-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                {buckets.nearOverload.map((d) => (
                  <WarningDtCard key={d.id} dt={d} onSelectDt={setSelectedDt} />
                ))}
              </div>
            </>
          )}

          {buckets.optimal.length > 0 && (
            <>
              <div
                id="optimal-dts-section"
                className="dt-section-header"
                style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 10px', flexWrap: 'wrap' }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
                <div className="dt-section-label" style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Optimal · {buckets.optimal.length}
                </div>
                <div className="dt-section-desc" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  55–85% loading — efficient utilisation, monitor monthly
                </div>
              </div>
              <DtPillList dts={buckets.optimal} variant="optimal" onSelectDt={setSelectedDt} />
            </>
          )}

          {buckets.underUtilised.length > 0 && (
            <>
              <div
                id="under-utilised-dts-section"
                className="dt-section-header"
                style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 10px', flexWrap: 'wrap' }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--navy-light, #4B6BB8)' }} />
                <div className="dt-section-label" style={{ fontSize: 13, fontWeight: 700, color: 'var(--id-text, #0284c7)', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Under-utilised · {buckets.underUtilised.length}
                </div>
                <div className="dt-section-desc" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  &lt;55% loading — DT may be oversized; consider redistribution to optimise capex
                </div>
              </div>
              <DtPillList dts={buckets.underUtilised} variant="under-utilised" onSelectDt={setSelectedDt} />
            </>
          )}
        </>
      )}

      {/* Excess-demand section — renders at every scope, independent of DT availability.
          The prototype shows this even at scopes without DT data (e.g. DVVNL), because the
          UPERC surcharge list is scoped from consumer data, not DT master data. */}
      {excessDemand.length > 0 && (
        <ExcessDemandSection
          excessDemand={excessDemand}
          onSelectMeter={(m) =>
            showToast({
              type: 'info',
              title: `Meter #${m}`,
              message: 'Opening meter detail — coming from Suspicious meters page.',
              duration: 3500,
            })
          }
        />
      )}

      {selectedDt && <DtDetailModal dt={selectedDt} onClose={() => setSelectedDt(null)} />}
    </div>
  )
}
