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
import { DtSectionHeader } from './components/DtSectionHeader'
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
          <div className="flex gap-[8px] items-center">
            <span
              className="text-[11px] font-bold font-mono whitespace-nowrap"
              style={{ color: hasDts ? 'var(--text)' : 'var(--text-dim)' }}
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
        <div className="card p-[36px] text-center">
          <div className="text-[42px] mb-[8px] opacity-50">⚡</div>
          <div className="text-[14px] font-bold text-[var(--text)] mb-[6px]">
            No distribution transformer data at {scopeName}
          </div>
          <div className="text-[12px] text-[var(--text-mid)] max-w-[520px] mx-auto leading-[1.5] mb-[16px]">
            The Load management page covers KVVNL Varanasi territory in this
            prototype. State-wide there are <strong>10 demo DTs</strong> —
            navigate up to UPPCL or KVVNL to view them.
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
            <div className="card py-[40px] px-[20px] text-center text-[var(--text-dim)]">
              <div className="text-[36px] mb-[10px] opacity-40">⚡</div>
              <div className="font-bold text-[var(--text-mid)] text-[14px]">
                No DTs match this filter
              </div>
              <div className="text-[11px] mt-[6px]">
                Try clearing the filter to see all transformers.
              </div>
            </div>
          )}

          {buckets.overloaded.length > 0 && (
            <>
              <DtSectionHeader
                id="overloaded-dts-section"
                dotColor="var(--red)"
                labelColor="var(--red)"
                label={`Overloaded · ${buckets.overloaded.length}`}
                desc=">100% loading — act this week, capacity upgrade or load redistribution"
                topMargin="first"
              />
              {buckets.overloaded.map((d) => (
                <CriticalDtCard key={d.id} dt={d} onSelectDt={setSelectedDt} />
              ))}
            </>
          )}

          {buckets.nearOverload.length > 0 && (
            <>
              <DtSectionHeader
                id="near-overload-dts-section"
                dotColor="var(--amber)"
                labelColor="var(--amber)"
                label={`Near-overload · ${buckets.nearOverload.length}`}
                desc="85–100% loading — plan within 30 days, monitor closely"
              />
              <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-[12px] max-[640px]:grid-cols-1">
                {buckets.nearOverload.map((d) => (
                  <WarningDtCard key={d.id} dt={d} onSelectDt={setSelectedDt} />
                ))}
              </div>
            </>
          )}

          {buckets.optimal.length > 0 && (
            <>
              <DtSectionHeader
                id="optimal-dts-section"
                dotColor="var(--green)"
                labelColor="var(--green)"
                label={`Optimal · ${buckets.optimal.length}`}
                desc="55–85% loading — efficient utilisation, monitor monthly"
              />
              <DtPillList dts={buckets.optimal} variant="optimal" onSelectDt={setSelectedDt} />
            </>
          )}

          {buckets.underUtilised.length > 0 && (
            <>
              <DtSectionHeader
                id="under-utilised-dts-section"
                dotColor="var(--navy-light, #4B6BB8)"
                labelColor="var(--id-text, #0284c7)"
                label={`Under-utilised · ${buckets.underUtilised.length}`}
                desc="<55% loading — DT may be oversized; consider redistribution to optimise capex"
              />
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
