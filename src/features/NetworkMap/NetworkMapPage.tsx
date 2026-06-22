import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { useToast } from '@/shared/context/ToastContext'

const FEEDERS = [
  { id: 'F-BHL', name: 'Bhelupur', consumers: 2842, dtrs: 18, loss: 18.4, flagged: 142, status: 'critical' },
  { id: 'F-RTY', name: 'Rathayatra', consumers: 3210, dtrs: 22, loss: 22.8, flagged: 189, status: 'critical' },
  { id: 'F-CJL', name: 'Central Jail', consumers: 1840, dtrs: 12, loss: 8.6, flagged: 48, status: 'healthy' },
  { id: 'F-CHK', name: 'Chauk', consumers: 4120, dtrs: 28, loss: 18.4, flagged: 210, status: 'warning' },
  { id: 'F-GNP', name: 'Ganesh Pur', consumers: 2680, dtrs: 16, loss: 11.2, flagged: 84, status: 'healthy' },
  { id: 'F-KBN', name: 'Kabir Nagar', consumers: 3340, dtrs: 20, loss: 16.8, flagged: 162, status: 'warning' },
  { id: 'F-KPR', name: 'Kerakatpur', consumers: 1920, dtrs: 11, loss: 9.4, flagged: 52, status: 'healthy' },
  { id: 'F-RGN', name: 'Raghunath Nagar', consumers: 3860, dtrs: 24, loss: 20.4, flagged: 224, status: 'critical' },
  { id: 'F-RMP', name: 'Ramarepur', consumers: 2240, dtrs: 14, loss: 12.8, flagged: 96, status: 'warning' },
  { id: 'F-SKT', name: 'Shaktipeeth', consumers: 2960, dtrs: 18, loss: 15.6, flagged: 138, status: 'warning' },
]

const STATUS_COLOR: Record<string, string> = {
  critical: 'var(--red)',
  warning: 'var(--amber)',
  healthy: 'var(--green)',
}

// Pseudo-geographic positions for feeders on a canvas
const FEEDER_POSITIONS: Record<string, { x: number; y: number }> = {
  'F-BHL': { x: 35, y: 42 }, 'F-RTY': { x: 58, y: 28 }, 'F-CJL': { x: 72, y: 55 },
  'F-CHK': { x: 48, y: 62 }, 'F-GNP': { x: 25, y: 62 }, 'F-KBN': { x: 65, y: 72 },
  'F-KPR': { x: 18, y: 35 }, 'F-RGN': { x: 42, y: 78 }, 'F-RMP': { x: 80, y: 42 },
  'F-SKT': { x: 55, y: 85 },
}

export default function NetworkMapPage() {
  const { showToast } = useToast()
  const [selected, setSelected] = useState<string | null>(null)
  const [mapMode, setMapMode] = useState<'loss' | 'flagged' | 'health'>('loss')

  const selectedFeeder = selected ? FEEDERS.find((f) => f.id === selected) : null

  return (
    <div className="pb-8">
      <PageHeader
        title="🗺️ Network map"
        subtitle="Feeder-level GIS view · click any feeder to drill in"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Leaflet map', message: 'Full GIS map requires Leaflet integration — see Integrations page.', duration: 4000 })}>
              🗺️ Open full GIS
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'AI hotspot overlay', message: 'Generating theft hotspot heatmap overlay...', duration: 3000 })}>
              ✦ Theft hotspot overlay
            </button>
          </>
        }
      />

      <ScopeBreadcrumb />

      <AiInsightBanner title="AI network overview">
        <strong style={{ color: 'var(--red)' }}>3 feeders are critical</strong> — Bhelupur, Rathayatra, and Raghunath Nagar account for
        40% of all flagged meters. Rathayatra feeder has the worst AT&C loss at{' '}
        <strong>22.8%</strong> and is the site of the active 8-meter synchronized-zero cluster.
        Recommend deploying inspection teams to these feeders first.
      </AiInsightBanner>

      {/* Map mode selector */}
      <div className="mb-3 flex gap-1.5">
        {[
          { id: 'loss' as const, label: 'AT&C Loss heatmap' },
          { id: 'flagged' as const, label: 'Flagged meters' },
          { id: 'health' as const, label: 'Feeder health' },
        ].map((m) => (
          <button key={m.id} type="button" onClick={() => setMapMode(m.id)}
            className="rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all"
            style={{
              borderColor: mapMode === m.id ? 'var(--ai-purple)' : 'var(--border)',
              background: mapMode === m.id ? 'var(--ai-purple)' : 'var(--card)',
              color: mapMode === m.id ? '#fff' : 'var(--text-mid)',
            }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Pseudo-map canvas */}
        <div className="card lg:col-span-2">
          <div className="card-title mb-3 text-[13px] font-bold">
            Feeder map — KVVNL Varanasi (schematic)
          </div>
          <div className="relative rounded-xl border border-border bg-bg overflow-hidden" style={{ paddingBottom: '60%' }}>
            <div className="absolute inset-0 flex items-center justify-center text-text-dim text-[12px]" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 39px,var(--border) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--border) 40px)' }}>
              {/* Feeder nodes */}
              {FEEDERS.map((f) => {
                const pos = FEEDER_POSITIONS[f.id]
                const color = STATUS_COLOR[f.status]
                const size = mapMode === 'flagged' ? Math.max(14, Math.min(36, f.flagged / 8)) : 20
                const isSelected = selected === f.id
                return (
                  <button key={f.id} type="button"
                    onClick={() => setSelected(selected === f.id ? null : f.id)}
                    className="absolute flex items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                    style={{
                      left: `${pos.x}%`, top: `${pos.y}%`,
                      width: `${size}px`, height: `${size}px`,
                      transform: 'translate(-50%,-50%)',
                      background: color,
                      border: isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.4)',
                      boxShadow: isSelected ? `0 0 0 3px ${color}60, 0 2px 8px rgba(0,0,0,0.3)` : '0 2px 4px rgba(0,0,0,0.2)',
                      fontSize: '9px', fontWeight: 700,
                      zIndex: isSelected ? 10 : 1,
                    }}
                    title={f.name}>
                    {mapMode === 'loss' ? `${f.loss}` : mapMode === 'flagged' ? f.flagged : f.name.slice(0, 2)}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[10.5px] text-text-dim">
            {[['🔴', 'Critical (loss>18%)'], ['🟡', 'Warning (12-18%)'], ['🟢', 'Healthy (<12%)']].map(([dot, lbl]) => (
              <span key={lbl}>{dot} {lbl}</span>
            ))}
          </div>
        </div>

        {/* Feeder list / detail panel */}
        <div className="card overflow-y-auto" style={{ maxHeight: '480px' }}>
          <div className="card-title mb-3 text-[13px] font-bold">
            {selectedFeeder ? `${selectedFeeder.name} feeder` : 'All feeders'}
          </div>
          {selectedFeeder ? (
            <div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: 'AT&C Loss', value: `${selectedFeeder.loss}%`, color: STATUS_COLOR[selectedFeeder.status] },
                  { label: 'Flagged meters', value: String(selectedFeeder.flagged), color: 'var(--red)' },
                  { label: 'Consumers', value: selectedFeeder.consumers.toLocaleString('en-IN'), color: 'var(--text)' },
                  { label: 'DTRs', value: String(selectedFeeder.dtrs), color: 'var(--text)' },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-bg p-2.5 text-center">
                    <div className="font-mono text-[15px] font-extrabold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[9.5px] text-text-dim">{s.label}</div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-ai w-full mb-2" style={{ justifyContent: 'center' }}
                onClick={() => showToast({ type: 'success', title: 'Inspection scheduled', message: `Batch inspection for ${selectedFeeder.name} feeder scheduled.`, duration: 3500 })}>
                ✦ Schedule batch inspection
              </button>
              <button type="button" className="btn btn-outline w-full text-[11px]" style={{ justifyContent: 'center' }}
                onClick={() => setSelected(null)}>
                ← All feeders
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {[...FEEDERS].sort((a, b) => b.loss - a.loss).map((f) => (
                <button key={f.id} type="button" onClick={() => setSelected(f.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left transition-all hover:border-ai-purple"
                  style={{ background: selected === f.id ? 'rgba(124,58,237,0.05)' : 'var(--bg)' }}>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ background: STATUS_COLOR[f.status] }} />
                    <span className="text-[12px] font-semibold text-text">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="font-mono font-bold" style={{ color: STATUS_COLOR[f.status] }}>{f.loss}%</span>
                    <span className="text-text-dim">{f.flagged} flagged</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
