import type { DetailPanelKey, ReliabilityPanelData } from '../types'

interface ReliabilityPanelProps {
  data: ReliabilityPanelData
  onOpenPanel: (key: DetailPanelKey) => void
}

function toneBorder(tone: 'good' | 'warn' | 'bad'): string {
  switch (tone) {
    case 'good': return 'var(--exec-jade-border)'
    case 'warn': return 'var(--exec-amber-border)'
    case 'bad':  return 'var(--exec-crimson-border)'
  }
}

function toneValueColor(tone: 'good' | 'warn' | 'bad'): string {
  switch (tone) {
    case 'good': return 'var(--exec-jade)'
    case 'warn': return 'var(--exec-amber)'
    case 'bad':  return 'var(--exec-crimson)'
  }
}

/** 📡 Reliability Indices — SAIDI, SAIFI, Outages, Transformer Failures. */
export function ReliabilityPanel({ data, onOpenPanel }: ReliabilityPanelProps) {
  const tf = data.transformerFailures
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        📡 <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Reliability</em> Indices
      </h3>

      <div className="flex flex-col gap-[8px]">
        {data.metrics.map((m) => (
          <div
            key={m.id}
            className="bg-[var(--exec-surface2)] border rounded-[8px] py-[10px] px-[12px] cursor-pointer flex items-center justify-between gap-[10px] transition-[all_0.18s] min-w-0 hover:[transform:translateY(-1px)] hover:shadow-[var(--exec-shadow-sm)]"
            style={{ borderColor: toneBorder(m.tone) }}
            onClick={() => onOpenPanel(m.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="text-[11.5px] text-[var(--exec-ink3)]">{m.name}</div>
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">{m.subtitle}</div>
            </div>
            <div className="text-right shrink-0">
              <div
                className="font-['Syne',_serif] text-[20px] font-bold max-[480px]:text-[18px]"
                style={{ color: toneValueColor(m.tone) }}
              >
                {m.valueText}
              </div>
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">{m.unit}</div>
            </div>
          </div>
        ))}

        {/* Transformer Failures — special layout with ratio + split bars */}
        <div
          className="bg-[var(--exec-surface2)] border rounded-[8px] py-[10px] px-[12px] cursor-pointer transition-[all_0.18s] hover:[transform:translateY(-1px)] hover:shadow-[var(--exec-shadow-sm)] flex flex-col items-start gap-[8px]"
          style={{ borderColor: 'var(--exec-amber-border)' }}
          onClick={() => onOpenPanel(tf.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="flex justify-between gap-[10px] items-start w-full">
            <div>
              <div className="text-[11.5px] text-[var(--exec-ink3)]">Transformer Failures</div>
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">FYTD · Failures / Fleet</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] text-[var(--exec-ink3)] flex items-baseline gap-[5px] justify-end">
                <strong className="font-['Syne',_serif] text-[18px] font-bold text-[var(--exec-amber)]">{tf.totalText}</strong>
                <span className="text-[11px] text-[var(--exec-ink3)]">{tf.fleetText}</span>
                <span className="text-[11px] text-[var(--exec-crimson)] font-bold">{tf.percentText}</span>
              </div>
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">affected transformers</div>
            </div>
          </div>
          <div className="flex flex-col gap-[4px] w-full">
            {/* Below 100 KVA — amber */}
            <div className="flex items-center gap-[8px]">
              <div className="text-[10px] text-[var(--exec-ink3)] whitespace-nowrap min-w-[86px] max-[640px]:min-w-[74px] max-[480px]:min-w-[62px] max-[480px]:text-[9.5px]">{tf.belowKva.label}</div>
              <div className="flex-1 h-[7px] bg-[var(--exec-bg3)] rounded-[4px] overflow-hidden min-w-0">
                <div className="h-full rounded-[4px]" style={{ width: `${tf.belowKva.barPercent}%`, background: 'var(--exec-amber)' }} />
              </div>
              <div
                className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold min-w-[88px] text-right max-[640px]:min-w-[74px] max-[480px]:min-w-[64px] max-[480px]:text-[9.5px]"
                style={{ color: 'var(--exec-amber)' }}
              >
                {tf.belowKva.valueText}
              </div>
            </div>
            {/* Above 100 KVA — crimson */}
            <div className="flex items-center gap-[8px]">
              <div className="text-[10px] text-[var(--exec-ink3)] whitespace-nowrap min-w-[86px] max-[640px]:min-w-[74px] max-[480px]:min-w-[62px] max-[480px]:text-[9.5px]">{tf.aboveKva.label}</div>
              <div className="flex-1 h-[7px] bg-[var(--exec-bg3)] rounded-[4px] overflow-hidden min-w-0">
                <div className="h-full rounded-[4px]" style={{ width: `${tf.aboveKva.barPercent}%`, background: 'var(--exec-crimson)' }} />
              </div>
              <div
                className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold min-w-[88px] text-right max-[640px]:min-w-[74px] max-[480px]:min-w-[64px] max-[480px]:text-[9.5px]"
                style={{ color: 'var(--exec-crimson)' }}
              >
                {tf.aboveKva.valueText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
