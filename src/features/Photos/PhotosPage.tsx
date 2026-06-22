import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'

interface Photo {
  id: string; case: string; consumer: string; type: string
  date: string; inspector: string; aiConf: number; tags: string[]
  verified: boolean; gps: string; desc: string
}

const PHOTOS: Photo[] = [
  { id: 'P-842', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Tamper seal', date: '07 Mar 2026 12:15', inspector: 'Rajesh Kumar', aiConf: 96, tags: ['seal', 'broken', 'earth_wire'], verified: true, gps: '25.3176° N, 82.9739° E', desc: 'Meter seal visibly broken and re-applied with tape. Earth wire bypass confirmed.' },
  { id: 'P-841', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Meter body', date: '07 Mar 2026 12:12', inspector: 'Rajesh Kumar', aiConf: 94, tags: ['meter', 'bypass', 'wiring'], verified: true, gps: '25.3176° N, 82.9739° E', desc: 'Unauthorized wiring running from phase terminal to neutral. Classic earth loading setup.' },
  { id: 'P-840', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Installation overview', date: '07 Mar 2026 12:10', inspector: 'Rajesh Kumar', aiConf: 89, tags: ['installation', 'overview'], verified: true, gps: '25.3176° N, 82.9739° E', desc: 'Full view of meter installation showing unauthorized connection point.' },
  { id: 'P-839', case: 'C-20260228-014', consumer: 'R.K. ENTERPRISES', type: 'CT terminals', date: '05 Mar 2026 15:30', inspector: 'Sunita Verma', aiConf: 91, tags: ['ct', 'manipulation', 'wiring'], verified: true, gps: '25.3212° N, 82.9801° E', desc: 'CT terminal block with bridging wire. Current transformer short-circuited.' },
  { id: 'P-838', case: 'C-20260228-014', consumer: 'R.K. ENTERPRISES', type: 'Meter reading', date: '05 Mar 2026 15:28', inspector: 'Sunita Verma', aiConf: 88, tags: ['reading', 'display'], verified: true, gps: '25.3212° N, 82.9801° E', desc: 'Meter display showing 18 kWh cumulative. Expected: 420+ kWh for this consumer type.' },
  { id: 'P-837', case: 'C-20260225-008', consumer: 'VINOD KUMAR', type: 'Cover damage', date: '02 Mar 2026 11:45', inspector: 'Amit Sharma', aiConf: 85, tags: ['cover', 'open', 'damage'], verified: false, gps: '25.3089° N, 82.9645° E', desc: 'Meter cover shows signs of forced opening. Three cover-open events logged in system.' },
  { id: 'P-836', case: 'C-20260218-005', consumer: 'M/S CHAWLA STEEL', type: 'Bypass wiring', date: '28 Feb 2026 14:20', inspector: 'Deepak Yadav', aiConf: 98, tags: ['bypass', 'industrial', 'critical'], verified: true, gps: '25.3301° N, 82.9888° E', desc: 'Direct bypass of metering system. Full load running through unauthorized cable.' },
]

const TYPE_FILTERS = [
  { value: 'all', label: 'All photos' },
  { value: 'verified', label: '✅ AI-verified' },
  { value: 'unverified', label: '⚠ Pending review' },
  { value: 'tamper', label: '🔓 Tamper evidence' },
]

const CONF_COLOR = (c: number) => c >= 90 ? 'var(--green)' : c >= 75 ? 'var(--amber)' : 'var(--red)'

export default function PhotosPage() {
  const { showToast } = useToast()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Photo | null>(null)

  const filtered = PHOTOS.filter((p) => {
    if (filter === 'verified') return p.verified
    if (filter === 'unverified') return !p.verified
    if (filter === 'tamper') return p.tags.some((t) => ['seal', 'bypass', 'ct', 'cover'].includes(t))
    return true
  })

  const verified = PHOTOS.filter((p) => p.verified).length

  return (
    <div className="pb-8">
      <PageHeader
        title="📷 Field evidence photos"
        subtitle="AI-verified, geo-tagged inspection photos — court-ready evidence"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Downloaded', message: `Evidence pack (${PHOTOS.length} photos) downloaded as ZIP.`, duration: 3500 })}>
              📥 Download all
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'AI verification', message: 'Running AI analysis on all unverified photos…', duration: 3500 })}>
              ✦ AI verify all
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI photo evidence summary">
        <strong>{PHOTOS.length} photos</strong> across <strong>{new Set(PHOTOS.map((p) => p.case)).size} cases</strong>.
        <strong style={{ color: 'var(--green)' }}> {verified} AI-verified</strong> with avg confidence{' '}
        <strong>{Math.round(PHOTOS.reduce((s, p) => s + p.aiConf, 0) / PHOTOS.length)}%</strong>.
        Photo P-836 (M/S CHAWLA STEEL) has the highest evidence confidence (98%) — strongest for court filing.
        {PHOTOS.filter((p) => !p.verified).length > 0 && (
          <> <strong style={{ color: 'var(--amber)' }}>{PHOTOS.filter((p) => !p.verified).length} photos pending manual review.</strong></>
        )}
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Total photos', value: String(PHOTOS.length), sub: `Across ${new Set(PHOTOS.map(p => p.case)).size} cases`, accent: 'var(--navy-light)', color: 'var(--text)' },
          { label: 'AI-verified', value: String(verified), sub: `${Math.round((verified / PHOTOS.length) * 100)}% verification rate`, accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Avg AI confidence', value: `${Math.round(PHOTOS.reduce((s, p) => s + p.aiConf, 0) / PHOTOS.length)}%`, sub: 'Court-admissibility threshold: 80%', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'Pending review', value: String(PHOTOS.filter(p => !p.verified).length), sub: 'Requires manual sign-off', accent: 'var(--amber)', color: 'var(--amber)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-[22px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      <FilterBar filters={TYPE_FILTERS} active={filter} onChange={setFilter} />

      {/* Photo grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((photo) => (
          <button key={photo.id} type="button" onClick={() => setSelected(photo)}
            className="card group cursor-pointer text-left transition-all hover:-translate-y-0.5 hover:shadow-lg">
            {/* Photo placeholder */}
            <div className="relative mb-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-900"
              style={{ border: photo.verified ? '2px solid rgba(34,197,94,0.4)' : '2px solid rgba(230,146,30,0.4)' }}>
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <div className="text-[10px] font-semibold text-white/70">{photo.type}</div>
              </div>
              {/* AI conf badge */}
              <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9.5px] font-bold text-white"
                style={{ background: CONF_COLOR(photo.aiConf) }}>
                ✦ {photo.aiConf}%
              </div>
              {photo.verified && (
                <div className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9.5px] font-bold text-white"
                  style={{ background: 'var(--green)' }}>
                  ✓ Verified
                </div>
              )}
            </div>

            <div className="px-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-mono text-[10.5px] font-bold" style={{ color: 'var(--id-text)' }}>{photo.id}</div>
                <div className="font-mono text-[10px] font-bold" style={{ color: 'var(--id-text)' }}>{photo.case}</div>
              </div>
              <div className="text-[12px] font-semibold text-text mb-0.5">{photo.consumer}</div>
              <div className="text-[10.5px] text-text-dim mb-2">{photo.type} · {photo.inspector}</div>
              <div className="text-[11px] leading-[1.4] text-text-mid line-clamp-2">{photo.desc}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {photo.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-bg px-1.5 py-px text-[9px] text-text-dim border border-border">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-[9.5px] text-text-dim">{photo.date} · 📍 {photo.gps}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Photo detail modal */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSelected(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[560px] max-w-[95vw] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-card shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between p-4"
              style={{ background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 100%)' }}>
              <div>
                <div className="font-bold text-white">{selected.id} · {selected.type}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.5)]">{selected.consumer} · {selected.case}</div>
              </div>
              <button type="button" onClick={() => setSelected(null)}
                className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10">✕</button>
            </div>
            <div className="p-4">
              {/* Large photo placeholder */}
              <div className="mb-4 flex h-56 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900">
                <div className="text-center">
                  <div className="text-6xl mb-2">📷</div>
                  <div className="text-white/70 text-[11px]">Field photo · {selected.date}</div>
                </div>
              </div>

              {/* AI analysis */}
              <div className="mb-4 rounded-xl p-3 text-[11.5px]"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <div className="mb-1 font-bold" style={{ color: 'var(--ai-purple)' }}>
                  ✦ AI analysis · {selected.aiConf}% confidence
                </div>
                <p className="text-text-mid leading-[1.5]">{selected.desc}</p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-x-6">
                {[
                  ['Inspector', selected.inspector],
                  ['Date', selected.date],
                  ['GPS', selected.gps],
                  ['Case', selected.case],
                  ['AI confidence', `${selected.aiConf}%`],
                  ['Verified', selected.verified ? '✓ Yes' : '⚠ Pending'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border py-2 text-[11px]">
                    <span className="text-text-dim">{k}</span>
                    <span className="font-semibold text-text">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button type="button" className="btn btn-ai flex-1" style={{ justifyContent: 'center' }}
                  onClick={() => { showToast({ type: 'success', title: 'Downloaded', message: `${selected.id} downloaded.`, duration: 3000 }); setSelected(null) }}>
                  📥 Download
                </button>
                {!selected.verified && (
                  <button type="button" className="btn btn-outline flex-1" style={{ justifyContent: 'center', fontSize: '11px', color: 'var(--green)' }}
                    onClick={() => { showToast({ type: 'success', title: 'Verified', message: `${selected.id} manually verified.`, duration: 3000 }); setSelected(null) }}>
                    ✓ Mark verified
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
