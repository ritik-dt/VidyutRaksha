import { REMEDIATION_KB } from '@/features/Meters/data/meters'

interface RemediationCardProps {
  theftType: string
}

export function RemediationCard({ theftType }: RemediationCardProps) {
  const rem = REMEDIATION_KB[theftType]
  if (!rem) return null

  return (
    <div className="card mb-4" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
      {/* Purple top bar */}
      <div className="mb-4 h-1 w-full rounded-full" style={{ background: 'var(--ai-gradient)' }} />

      <div className="mb-3 flex items-center gap-2 text-[13px] font-bold" style={{ color: 'var(--ai-purple)' }}>
        ✦ AI remediation — {rem.type}
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-[11px] font-semibold" style={{ color: 'var(--red)' }}>
            ⚠ Safety precautions
          </div>
          {rem.safety.map((s) => (
            <div key={s} className="flex items-start gap-2 py-1 text-[11px] text-text">
              <span style={{ color: 'var(--red)', flexShrink: 0 }}>●</span>
              {s}
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2 text-[11px] font-semibold" style={{ color: 'var(--id-text)' }}>
            📋 Meter action
          </div>
          <div className="mb-3 text-[11px] leading-[1.6] text-text-mid">{rem.meterAction}</div>
          <div className="mb-1 text-[11px] font-semibold" style={{ color: 'var(--id-text)' }}>
            ⚖️ Legal basis
          </div>
          <div className="text-[11px] leading-[1.5] text-text-mid">{rem.legal}</div>
        </div>
      </div>

      <div className="mb-2 text-[11px] font-semibold" style={{ color: 'var(--ai-purple)' }}>
        ✦ Field inspection checklist
      </div>
      <div className="grid gap-x-4 md:grid-cols-2">
        {rem.checklist.map((item) => (
          <div key={item} className="flex items-start gap-2 py-1 text-[11px]">
            <span className="mt-px text-[13px]">☐</span>
            {item}
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg p-3" style={{ background: 'rgba(124,58,237,0.06)' }}>
        <div className="mb-1 text-[11px] font-semibold" style={{ color: 'var(--ai-purple)' }}>
          ✦ AI assessment estimate
        </div>
        <div className="text-[11px] leading-[1.6]" style={{ color: 'var(--ai-purple)' }}>
          {rem.formula}
          <br /><br />
          <strong>Auto-calculated:</strong> Assessment period from first event to detection = ~1,350 days.
          Peer avg: 19.2 kWh/day. Estimated stolen: ~25,920 kWh. At ₹7.50/unit ={' '}
          <strong>₹1,94,400 + penalty = ₹3,88,800</strong>
        </div>
      </div>
    </div>
  )
}
