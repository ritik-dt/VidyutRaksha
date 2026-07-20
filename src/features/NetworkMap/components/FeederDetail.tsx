import { useToast } from '@/shared/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { formatIndian } from '@/shared/utils/formatters'
import type { DT, EnrichedFeeder, NavContext } from '../types'
import {
  MapBcCurrent,
  MapBcItem,
  MapBcSep,
  MapBreadcrumb,
  MapConsumerItem,
  MapConsumerRisk,
  MapDetailAi,
  MapDetailBody,
  MapDetailHeader,
  MapDetailRow,
  MapDetailSection,
  MapActionBtn,
} from './MapDetailPrimitives'

interface FeederDetailProps {
  feeder: EnrichedFeeder
  allDts: DT[]
  onSelect: (ctx: NavContext) => void
  onClose: () => void
}

/** Feeder detail panel — direct port of prototype's showFeederDetail(). */
export function FeederDetail({
  feeder,
  allDts,
  onSelect,
  onClose,
}: FeederDetailProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()

  const dts = allDts.filter((d) => d.feeder === feeder.id)
  const totalCons = dts.reduce((s, d) => s + (d.meters || 0), 0)
  const totalFlagged = dts.reduce((s, d) => s + (d.flagged || 0), 0)
  const totalCritical = dts.reduce((s, d) => s + (d.critical || 0), 0)
  const avgLoss =
    dts.length > 0 ? (dts.reduce((s, d) => s + d.loss, 0) / dts.length).toFixed(1) : '0.0'
  const avgLoad =
    dts.length > 0 ? Math.round(dts.reduce((s, d) => s + d.load, 0) / dts.length) : 0
  const highLoss = dts.filter((d) => d.loss > 20)
  const flagRate = totalCons > 0 ? ((totalFlagged / totalCons) * 100).toFixed(1) : '0.0'
  const estRevenue = totalCritical * 15000 + (totalFlagged - totalCritical) * 8000
  const sortedDts = dts.slice().sort((a, b) => (b.flagged || 0) - (a.flagged || 0))

  const avgLossColor = Number(avgLoss) > 18 ? 'var(--red)' : 'var(--amber)'
  const avgLoadColor =
    avgLoad > 85 ? 'var(--red)' : avgLoad > 70 ? 'var(--amber)' : 'var(--green)'

  return (
    <>
      <MapDetailHeader
        title={`⚡ ${feeder.id} Feeder — ${feeder.area}`}
        onClose={onClose}
      />

      <MapDetailBody>
        <MapBreadcrumb>
          <MapBcItem onClick={onClose}>🗺️ Map</MapBcItem>
          <MapBcSep />
          <MapBcCurrent>⚡ {feeder.id}</MapBcCurrent>
        </MapBreadcrumb>

        {/* Headline strip — 4 KPIs (DTRs / Consumers / Flagged / Critical) */}
        <div className="grid grid-cols-4 gap-[6px] mb-[12px]">
          <div
            className="py-[8px] px-[6px] rounded-[6px] text-center border"
            style={{
              background: 'rgba(124,58,237,0.06)',
              borderColor: 'rgba(124,58,237,0.2)',
            }}
          >
            <div className="text-[9px] font-bold tracking-[0.4px] uppercase text-[var(--ai-purple)]">
              DTRs
            </div>
            <div className="text-[18px] font-extrabold font-mono leading-[1.1] mt-[2px] text-[var(--ai-purple)]">
              {dts.length}
            </div>
          </div>
          <div
            className="py-[8px] px-[6px] rounded-[6px] text-center border"
            style={{
              background: 'rgba(0,123,255,0.06)',
              borderColor: 'rgba(0,123,255,0.2)',
              color: 'var(--id-text, #0284c7)',
            }}
          >
            <div className="text-[9px] font-bold tracking-[0.4px] uppercase">
              Consumers
            </div>
            <div className="text-[18px] font-extrabold font-mono leading-[1.1] mt-[2px]">
              {formatIndian(totalCons)}
            </div>
          </div>
          <div
            className="py-[8px] px-[6px] rounded-[6px] text-center border text-[var(--amber)]"
            style={{
              background: 'rgba(230,146,30,0.06)',
              borderColor: 'rgba(230,146,30,0.2)',
            }}
          >
            <div className="text-[9px] font-bold tracking-[0.4px] uppercase">
              Flagged
            </div>
            <div className="text-[18px] font-extrabold font-mono leading-[1.1] mt-[2px]">
              {formatIndian(totalFlagged)}
            </div>
            <div className="text-[8.5px] text-[var(--text-dim)] mt-[1px]">
              {flagRate}%
            </div>
          </div>
          <div
            className="py-[8px] px-[6px] rounded-[6px] text-center border text-[var(--red)]"
            style={{
              background: 'rgba(220,53,69,0.06)',
              borderColor: 'rgba(220,53,69,0.2)',
            }}
          >
            <div className="text-[9px] font-bold tracking-[0.4px] uppercase">
              Critical
            </div>
            <div className="text-[18px] font-extrabold font-mono leading-[1.1] mt-[2px]">
              {totalCritical}
            </div>
          </div>
        </div>

        <MapDetailAi>
          <strong>✦ AI feeder analysis:</strong>{' '}
          {highLoss.length > 0 ? (
            <>
              ⚠ This feeder has{' '}
              <strong>
                {highLoss.length} high-loss DTR
                {highLoss.length > 1 ? 's' : ''} (&gt;20%)
              </strong>{' '}
              downstream — {highLoss.map((d) => d.id).join(', ')}. Concentrated
              losses suggest localized theft patterns.{' '}
            </>
          ) : (
            <>✓ All DTRs under this feeder are within acceptable loss range. </>
          )}
          <strong>{formatIndian(totalFlagged)} flagged consumers</strong> across{' '}
          <strong>{formatIndian(totalCons)} total</strong> · estimated{' '}
          <strong>
            ₹{(estRevenue / 100000).toFixed(1)}L recovery exposure
          </strong>
          . Recommend: dispatch joint inspection raid covering the top 3 DTRs
          by flagged count.
        </MapDetailAi>

        <MapDetailSection label="Feeder summary">
          <MapDetailRow
            label="Avg DTR loss"
            value={`${avgLoss}%`}
            valueColor={avgLossColor}
          />
          <MapDetailRow
            label="Avg DTR loading"
            value={`${avgLoad}%`}
            valueColor={avgLoadColor}
          />
          <MapDetailRow
            label="Network flag rate"
            value={`${flagRate}% (vs ~5% network avg)`}
          />
          <MapDetailRow
            label="Highest-flagged DTR"
            value={
              sortedDts[0]
                ? `${sortedDts[0].id} (${sortedDts[0].flagged || 0})`
                : '—'
            }
          />
        </MapDetailSection>

        <MapDetailSection label="Connected DTRs (ranked by flagged count)">
          {sortedDts.map((d) => {
            const col =
              d.loss > 20
                ? 'var(--red)'
                : d.loss > 15
                  ? 'var(--amber)'
                  : 'var(--green)'
            const fl = d.flagged || 0
            const cr = d.critical || 0
            return (
              <MapConsumerItem
                key={d.id}
                align="start"
                onClick={() => onSelect({ feeder, dt: d, consumer: null })}
              >
                <MapConsumerRisk color={col} fontSize={10.5} fontWeight={800}>
                  {d.loss.toFixed(0)}
                  <span className="text-[7px] font-semibold">%</span>
                </MapConsumerRisk>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[11.5px] break-words">
                    {d.id} — {d.area}
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)] mt-[2px] flex gap-[8px] flex-wrap">
                    <span>{formatIndian(d.meters)} consumers</span>
                    <span>{d.load}% load</span>
                    {fl > 0 && (
                      <span className="text-[var(--amber)] font-semibold">
                        ⚡ {fl} flagged
                      </span>
                    )}
                    {cr > 0 && (
                      <span className="text-[var(--red)] font-bold">
                        ⚠ {cr} critical
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[var(--text-dim)] shrink-0">›</span>
              </MapConsumerItem>
            )
          })}
        </MapDetailSection>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-[6px] mt-[8px]">
          <MapActionBtn
            variant="ai"
            className="col-span-2 !mt-0"
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Inspection raid scheduled',
                message: `AI suggesting joint raid covering top 3 DTRs of ${feeder.id} feeder. Routes optimized for ${totalCritical} critical consumers across ${highLoss.length} high-loss DTRs.`,
                duration: 5000,
              })
            }
          >
            ✦ Schedule joint raid for top 3 DTRs ({totalCritical} critical)
          </MapActionBtn>
          <MapActionBtn
            variant="outline"
            className="!mt-0"
            onClick={() => navigate('/meters')}
          >
            📋 View {totalFlagged} flagged in list
          </MapActionBtn>
          <MapActionBtn
            variant="outline"
            className="!mt-0"
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Feeder report queued',
                message: `Generating audit report for ${feeder.id}: ${dts.length} DTRs · ${formatIndian(totalCons)} consumers · ${totalFlagged} flagged. ETA 90s.`,
                duration: 4000,
              })
            }
          >
            📄 Generate audit report
          </MapActionBtn>
        </div>
      </MapDetailBody>
    </>
  )
}
