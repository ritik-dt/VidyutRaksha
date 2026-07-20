interface DtSectionHeaderProps {
  /** Anchor id for KPI-strip scroll target (optional). */
  id?: string
  /** Dot colour — CSS var expression or hex (e.g. `var(--red)`). */
  dotColor: string
  /** Label text colour — usually matches or contrasts the dot. */
  labelColor: string
  /** Uppercase label (e.g. "Overloaded · 3"). */
  label: string
  /** Description line under/next to the label. */
  desc: string
  /** Top margin variant: 'first' 18px | 'default' 22px | 'none' 0. */
  topMargin?: 'first' | 'default' | 'none'
}

/**
 * Colored-dot + uppercase-label + description section header used across
 * DtLoad and ExcessDemand sections. Replaces the prototype's
 * `.dt-section-header/.dt-section-label/.dt-section-desc` triad with a
 * single reusable component.
 *
 * Mobile responsiveness (was `.dt-section-header .dt-section-desc { font-size: 10px; flex-basis: 100%; margin-top: 2px }`):
 *   - Description shrinks to 10px on ≤640px.
 *   - Description wraps to its own line via `basis-full` at ≤640px.
 */
export function DtSectionHeader({
  id,
  dotColor,
  labelColor,
  label,
  desc,
  topMargin = 'default',
}: DtSectionHeaderProps) {
  const topClass =
    topMargin === 'none'
      ? 'mt-0'
      : topMargin === 'first'
        ? 'mt-[18px] max-[480px]:mt-[14px]'
        : 'mt-[22px] max-[480px]:mt-[18px]'
  return (
    <div
      id={id}
      className={`flex items-center gap-[10px] flex-wrap mb-[10px] ${topClass}`}
    >
      <div
        className="w-[10px] h-[10px] rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      <div
        className="text-[13px] font-bold uppercase tracking-[0.6px] max-[640px]:text-[11.5px] max-[640px]:tracking-[0.4px]"
        style={{ color: labelColor }}
      >
        {label}
      </div>
      <div className="text-[11px] text-[var(--text-dim)] max-[640px]:text-[10px] max-[640px]:basis-full max-[640px]:mt-[2px]">
        {desc}
      </div>
    </div>
  )
}
