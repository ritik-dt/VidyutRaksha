import { MOBILE_MOCK_CASES } from '../data/mobile'
import type { MobileCase, MobileCaseChip } from '../types'

/* ── Badge helper — mirrors the prototype's .badge-* palette. */
function badgeStyle(variant: MobileCaseChip['variant']): { bg: string; color: string; border: string } {
  switch (variant) {
    case 'assigned':
      return { bg: 'var(--amber-light, rgba(230,146,30,0.12))', color: 'var(--amber-dark, #92400e)', border: 'var(--amber)' }
    case 'confirmed':
      return { bg: 'rgba(220,53,69,0.10)', color: 'var(--red)', border: 'var(--red)' }
    case 'active':
      return { bg: 'rgba(40,167,69,0.10)', color: 'var(--green)', border: 'rgba(40,167,69,0.5)' }
    case 'ai':
      return { bg: 'var(--ai-purple-light)', color: 'var(--ai-purple)', border: 'rgba(124,58,237,0.3)' }
  }
}

function Badge({ label, variant }: MobileCaseChip) {
  const s = badgeStyle(variant)
  return (
    <span
      className="inline-block whitespace-nowrap rounded-[10px] px-[5px] py-px text-[9px] font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {label}
    </span>
  )
}

function RiskCircle({ risk }: { risk: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-mono text-[9px] font-extrabold"
      style={{
        width: 22,
        height: 22,
        background: 'rgba(220,53,69,0.1)',
        border: '2px solid var(--red)',
        color: 'var(--red)',
      }}
    >
      {risk}
    </div>
  )
}

function MockCase({ c }: { c: MobileCase }) {
  if (c.variant === 'synced') {
    return (
      <div
        className="mb-2 rounded-[10px] border p-2.5"
        style={{ background: 'rgba(40,167,69,0.08)', borderColor: 'var(--green)' }}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[14px]" style={{ color: 'var(--green)' }}>✓</span>
            <span className="text-[12px] font-semibold">{c.id}</span>
          </div>
          <Badge label="Synced" variant="ai" />
        </div>
        <div className="text-[10px] text-text-mid">
          {c.confirmedLabel} • {c.photosUploaded} photos uploaded
        </div>
      </div>
    )
  }

  if (c.variant === 'queue') {
    return (
      <div className="mb-2 rounded-[10px] border border-border bg-white p-2.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <RiskCircle risk={c.risk} />
            <span className="text-[12px] font-semibold">{c.id}</span>
          </div>
          <Badge label={`Queue ${c.queueNumber}`} variant="active" />
        </div>
        <div className="mb-1 text-[10px] text-text-mid">{c.location}</div>
        <button
          type="button"
          className="w-full cursor-pointer rounded-md border border-border bg-white py-[5px] text-[10px] font-semibold text-text hover:border-ai-purple hover:text-ai-purple"
        >
          View details
        </button>
      </div>
    )
  }

  // NEXT
  return (
    <div className="mb-2 rounded-[10px] border border-border bg-white p-2.5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <RiskCircle risk={c.risk} />
          <span className="text-[12px] font-semibold">{c.id}</span>
        </div>
        <Badge label="▶ NEXT" variant="assigned" />
      </div>
      <div className="mb-1 text-[10px] text-text-mid">{c.location}</div>
      <div className="mb-1.5 flex flex-wrap gap-[3px]">
        {c.chips?.map((chip) => <Badge key={chip.label} {...chip} />)}
      </div>
      <div className="mb-1 grid grid-cols-2 gap-1">
        <button
          type="button"
          className="cursor-pointer rounded-md border border-border bg-white py-[5px] text-[10px] font-semibold text-text hover:border-ai-purple hover:text-ai-purple"
        >
          📍 Route
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-md border border-border bg-white py-[5px] text-[10px] font-semibold text-text hover:border-ai-purple hover:text-ai-purple"
        >
          📋 Checklist
        </button>
      </div>
      <button
        type="button"
        className="w-full cursor-pointer rounded-md py-1.5 text-[11px] font-bold text-white"
        style={{ background: 'var(--ai-gradient)' }}
      >
        ✦ Start inspection
      </button>
    </div>
  )
}

/**
 * Inspector-facing phone mock — port of the prototype's .mobile-frame block:
 * chrome-bezel device, dark header, AI banner, "Today (4 cases)", three case
 * cards, and a 4-item bottom nav.
 */
export function MobilePhoneMock() {
  return (
    <div className="flex items-start justify-center">
      <div
        className="mx-auto overflow-hidden bg-white"
        style={{
          width: 300,
          maxWidth: '100%',
          borderRadius: 24,
          border: '6px solid #2C2C2A',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5"
          style={{ background: 'var(--navy)' }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                background: 'var(--ai-gradient)',
                boxShadow: '0 0 18px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-[12px] font-semibold text-white">VidyutRaksha</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px]" style={{ color: 'var(--green)' }}>● Online</span>
            <div
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--ai-purple) 0%, var(--ai-purple-dark) 100%)',
                fontSize: 8,
              }}
            >
              RK
            </div>
          </div>
        </div>

        {/* content */}
        <div className="px-3.5 py-2.5" style={{ background: 'var(--bg)', minHeight: 380 }}>
          {/* AI banner */}
          <div
            className="mb-2 rounded-lg text-[10px] leading-[1.4]"
            style={{ padding: '8px 10px', background: 'var(--ai-purple-light)', color: 'var(--ai-purple)' }}
          >
            <strong>✦ AI:</strong> Next case is Meter #1849966, 2.4 km away. Earth loading expected — safety gear required.
          </div>

          {/* Today header */}
          <div className="mb-1.5 flex items-center justify-between">
            <div className="text-[11px] font-bold">Today (4 cases)</div>
            <div className="text-[9px] text-text-dim">1 done • 3 pending</div>
          </div>

          {/* mock cases */}
          {MOBILE_MOCK_CASES.map((c) => <MockCase key={c.id} c={c} />)}
        </div>

        {/* bottom nav */}
        <div className="flex bg-white" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex-1 py-2.5 text-center text-[8px] font-semibold" style={{ color: 'var(--ai-purple)' }}>
            🏠 Cases
          </div>
          <div className="flex-1 py-2.5 text-center text-[8px] text-text-dim">📷 Camera</div>
          <div className="flex-1 py-2.5 text-center text-[8px] text-text-dim">📡 Sync</div>
          <div className="flex-1 py-2.5 text-center text-[8px] text-text-dim">👤 Me</div>
        </div>
      </div>
    </div>
  )
}
