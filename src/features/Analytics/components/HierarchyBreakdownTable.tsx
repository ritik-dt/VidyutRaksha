import { useMemo } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { formatIndian } from '@/shared/utils/formatters'
import { getChildLabel } from '@/shared/utils/level'

type DrillTab = 'audit' | 'reliability' | 'outage' | 'revenue' | 'pq'

interface HierarchyBreakdownTableProps {
  tab?: DrillTab
}

/**
 * Hierarchy drill table — port of prototype's `auditDrillTable(tab)`.
 * Renders different columns for each Analytics tab. Children sorted by loss desc.
 * Audit columns:       Meters, Flagged, AT&C loss, Hit rate, Tech loss, Commercial, Recovered
 * Reliability columns: Meters, SAIDI, SAIFI, CAIFI, MAIFI, CAIDI, ASAI %, Trend
 * Outage columns:      Meters, Feeder outage %, DTR outage %, Consumer-only %, Suspicious, Night pattern, Flagged
 */
export function HierarchyBreakdownTable({ tab = 'audit' }: HierarchyBreakdownTableProps) {
  const { currentNode, drillToChild } = useScope()
  const children = useMemo(() => currentNode?.children ?? [], [currentNode])

  const sortedChildren = useMemo(
    () => [...children].sort((a, b) => (b.loss ?? 0) - (a.loss ?? 0)),
    [children],
  )

  if (children.length === 0) return null

  const label = getChildLabel(currentNode?.type ?? 'State')

  const headers = tab === 'reliability'
    ? ['Meters', 'SAIDI (hrs)', 'SAIFI', 'CAIFI', 'MAIFI', 'CAIDI', 'ASAI %', 'Trend']
    : tab === 'outage'
      ? ['Meters', 'Feeder outage', 'DTR outage', 'Consumer-only', 'Suspicious', 'Night pattern', 'Flagged']
      : tab === 'revenue'
        ? ['Meters', 'Billing eff.', 'Unbilled', 'Collection %', 'Outstanding', 'PF penalty', 'Flagged']
        : tab === 'pq'
          ? ['Meters', 'Avg voltage', 'Low V (<200)', 'Avg PF', 'PF <0.85', 'High V (>260)', 'Flagged']
          : ['Meters', 'Flagged', 'AT&C loss', 'Hit rate', 'Tech loss', 'Commercial', 'Recovered']

  function renderCells(child: HierChild) {
    if (tab === 'reliability') return renderReliabilityCells(child)
    if (tab === 'outage') return renderOutageCells(child)
    if (tab === 'revenue') return renderRevenueCells(child)
    if (tab === 'pq') return renderPqCells(child)
    return renderAuditCells(child)
  }

  return (
    <div className="card">
      <div className="card-title flex items-center justify-between">
        <span>{label}-wise breakdown (click to drill down)</span>
        <span className="text-[11px] font-normal text-text-dim">{children.length} items</span>
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>{label}</th>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedChildren.map((child) => (
              <tr
                key={child.id}
                className="table-row cursor-pointer"
                onClick={() => drillToChild(child.id)}
              >
                <td className="font-semibold" style={{ color: 'var(--id-text, #0284c7)' }}>
                  {child.name}
                </td>
                {renderCells(child)}
                <td className="text-right text-[14px] font-semibold" style={{ color: 'var(--ai-purple)' }}>›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

type HierChild = { meters?: number; flagged?: number; loss?: number; hitRate?: number; recovered?: number }

/** Audit tab cells — matches prototype's rowVals('audit'). */
function renderAuditCells(child: HierChild) {
  const loss = child.loss ?? 0
  const commercial = Math.max(0, loss - 8.2)
  const lossColor = loss > 22 ? 'var(--red)' : loss > 18 ? 'var(--amber)' : 'var(--green)'
  return (
    <>
      <td className="font-mono text-[11px]">{formatIndian(child.meters ?? 0)}</td>
      <td className="font-mono text-[11px]">{formatIndian(child.flagged ?? 0)}</td>
      <td className="font-mono font-bold" style={{ color: lossColor }}>{loss.toFixed(1)}%</td>
      <td className="font-mono text-[11px]">{(child.hitRate ?? 0).toFixed(1)}%</td>
      <td className="font-mono text-[11px]">8.2%</td>
      <td className="font-mono text-[11px]" style={{ color: 'var(--red)' }}>{commercial.toFixed(1)}%</td>
      <td className="font-mono text-[11px]">{formatIndian(child.recovered ?? 0)} kWh</td>
    </>
  )
}

/** Reliability tab cells — matches prototype's rowVals('reliability') formulas exactly. */
function renderReliabilityCells(child: HierChild) {
  const loss = child.loss ?? 0
  const saidi = 10 + loss * 0.5
  const saifi = 5 + loss * 0.3
  const caifi = saifi * (1.35 + loss * 0.01)
  const maifi = saifi * (2.4 + loss * 0.05)
  const caidi = saidi / saifi
  const asai = 99.9 - saidi / 876
  const caifiColor = caifi > 15 ? 'var(--red)' : caifi > 10 ? 'var(--amber)' : 'var(--green)'
  const maifiColor = maifi > 30 ? 'var(--red)' : maifi > 20 ? 'var(--amber)' : 'var(--green)'
  const trend = loss > 22
    ? { text: '↓ Degrading', color: 'var(--red)' }
    : loss > 18
      ? { text: '→ Stable', color: 'var(--amber)' }
      : { text: '↑ Improving', color: 'var(--green)' }
  return (
    <>
      <td className="font-mono text-[11px]">{formatIndian(child.meters ?? 0)}</td>
      <td className="font-mono text-[11px]">{saidi.toFixed(1)}</td>
      <td className="font-mono text-[11px]">{saifi.toFixed(1)}</td>
      <td className="font-mono text-[11px] font-semibold" style={{ color: caifiColor }}>{caifi.toFixed(1)}</td>
      <td className="font-mono text-[11px] font-semibold" style={{ color: maifiColor }}>{maifi.toFixed(1)}</td>
      <td className="font-mono text-[11px]">{caidi.toFixed(2)}</td>
      <td className="font-mono text-[11px]">{asai.toFixed(2)}%</td>
      <td className="text-[11px] font-semibold" style={{ color: trend.color }}>{trend.text}</td>
    </>
  )
}

/** Outage tab cells — matches prototype's rowVals('outage') formulas exactly. */
function renderOutageCells(child: HierChild) {
  const loss = child.loss ?? 0
  const flagged = child.flagged ?? 0
  const feederPct = Math.round(68 - loss * 0.3)
  const dtrPct = Math.round(18 + loss * 0.2)
  const consumerOnlyPct = Math.round(14 + loss * 0.3)
  const suspicious = Math.round(flagged * 0.02)
  const nightPattern = Math.round(flagged * 0.008)
  const nightColor = loss > 20 ? 'var(--red)' : 'var(--text-dim)'
  return (
    <>
      <td className="font-mono text-[11px]">{formatIndian(child.meters ?? 0)}</td>
      <td className="font-mono text-[11px]">{feederPct}%</td>
      <td className="font-mono text-[11px]">{dtrPct}%</td>
      <td className="font-mono text-[11px]" style={{ color: 'var(--red)' }}>{consumerOnlyPct}%</td>
      <td className="font-mono text-[11px]">{formatIndian(suspicious)}</td>
      <td className="font-mono text-[11px]" style={{ color: nightColor }}>{formatIndian(nightPattern)}</td>
      <td className="font-mono text-[11px]">{formatIndian(flagged)}</td>
    </>
  )
}

/** Revenue tab cells — matches prototype's rowVals('revenue') formulas exactly. */
function renderRevenueCells(child: HierChild) {
  const loss = child.loss ?? 0
  const meters = child.meters ?? 0
  const flagged = child.flagged ?? 0
  const billingEff = (96 - loss * 0.1).toFixed(1)
  const unbilled = Math.round(meters * 0.058)
  const collectionPct = (90 - loss * 0.3).toFixed(1)
  const outstandingCr = Math.round((meters * 0.0012) / 100)
  // Prototype: `'₹'+Math.round(c.meters*0.00008/100).toFixed(1)+' Cr'`
  const pfPenaltyCr = Math.round((meters * 0.00008) / 100).toFixed(1)
  return (
    <>
      <td className="font-mono text-[11px]">{formatIndian(meters)}</td>
      <td className="font-mono text-[11px]">{billingEff}%</td>
      <td className="font-mono text-[11px]">{formatIndian(unbilled)}</td>
      <td className="font-mono text-[11px]">{collectionPct}%</td>
      <td className="font-mono text-[11px]">₹{outstandingCr} Cr</td>
      <td className="font-mono text-[11px]">₹{pfPenaltyCr} Cr</td>
      <td className="font-mono text-[11px]">{formatIndian(flagged)}</td>
    </>
  )
}

/** PQ tab cells — matches prototype's rowVals('pq') formulas exactly. */
function renderPqCells(child: HierChild) {
  const loss = child.loss ?? 0
  const meters = child.meters ?? 0
  const flagged = child.flagged ?? 0
  const avgVoltage = Math.round(232 - loss * 0.2)
  const lowVoltage = Math.round(meters * 0.12)
  const avgPf = (0.92 - loss * 0.002).toFixed(2)
  const lowPfConsumers = Math.round(meters * 0.064)
  const highVoltage = Math.round(meters * 0.018)
  return (
    <>
      <td className="font-mono text-[11px]">{formatIndian(meters)}</td>
      <td className="font-mono text-[11px]">{avgVoltage} V</td>
      <td className="font-mono text-[11px]">{formatIndian(lowVoltage)}</td>
      <td className="font-mono text-[11px]">{avgPf}</td>
      <td className="font-mono text-[11px]">{formatIndian(lowPfConsumers)}</td>
      <td className="font-mono text-[11px]">{formatIndian(highVoltage)}</td>
      <td className="font-mono text-[11px]">{formatIndian(flagged)}</td>
    </>
  )
}
