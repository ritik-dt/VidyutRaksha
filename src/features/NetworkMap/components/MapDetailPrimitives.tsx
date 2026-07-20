import type { ReactNode } from 'react'

/* ─────────────────────────────────────────────────────────────────────────── *
 *  Reusable primitives for the slide-in Network-Map detail panels
 *  (Feeder / DT / Consumer). Replaces prototype's `.map-detail-*` classes.
 * ─────────────────────────────────────────────────────────────────────────── */

interface MapDetailHeaderProps {
  /** The title node (icon + text). */
  title: ReactNode
  /** ✕ close callback. */
  onClose: () => void
}

/**
 * Sticky panel header — was `.map-detail-header` + `.map-detail-title` +
 * `.map-detail-close`. Sticky at top so the header stays visible while the
 * body scrolls; mobile ≤640 tightens padding + title font-size.
 */
export function MapDetailHeader({ title, onClose }: MapDetailHeaderProps) {
  return (
    <div className="py-[12px] px-[16px] border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--card)] z-[2] max-[640px]:!py-[10px] max-[640px]:!px-[12px]">
      <div className="text-[14px] font-bold flex items-center gap-[6px] min-w-0 max-[640px]:!text-[12.5px]">
        {title}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="bg-transparent border-none text-[18px] cursor-pointer text-[var(--text-dim)] py-[2px] px-[6px] rounded-[4px] hover:bg-[var(--bg)] shrink-0"
      >
        ✕
      </button>
    </div>
  )
}

interface MapDetailBodyProps {
  children: ReactNode
}

/**
 * Scrollable panel body — was `.map-detail-body`. Mobile ≤640 tightens
 * padding to 12px (was `.map-detail-body { padding: 12px !important }`).
 */
export function MapDetailBody({ children }: MapDetailBodyProps) {
  return (
    <div className="py-[14px] px-[16px] max-[640px]:!p-[12px]">{children}</div>
  )
}

interface MapDetailSectionProps {
  /** Section label (uppercase, muted). */
  label: ReactNode
  children: ReactNode
  /** Custom label text color (defaults to var(--text-dim)). */
  labelColor?: string
  /** Optional right-aligned action next to label. */
  labelRight?: ReactNode
}

/**
 * Section wrapper — was `.map-detail-section` + `.map-detail-label`.
 * Renders a small uppercase label followed by children. Supports an
 * optional right-hand action (used by DT detail's "View all →" link).
 */
export function MapDetailSection({
  label,
  labelColor = 'var(--text-dim)',
  labelRight,
  children,
}: MapDetailSectionProps) {
  return (
    <div className="mb-[14px]">
      <div
        className={
          'text-[10px] font-semibold uppercase tracking-[0.5px] mb-[6px] ' +
          (labelRight ? 'flex justify-between items-center' : '')
        }
        style={{ color: labelColor }}
      >
        <span>{label}</span>
        {labelRight}
      </div>
      {children}
    </div>
  )
}

interface MapDetailRowProps {
  /** Left side label (muted). */
  label: ReactNode
  /** Right side value (mono, bold). */
  value: ReactNode
  /** Custom value color (data-driven). */
  valueColor?: string
  /** Custom value font-size (defaults to 12px). */
  valueFontSize?: string | number
}

/**
 * Two-column key/value row — was `.map-detail-row` + `.map-detail-key` +
 * `.map-detail-val`. Used ~25× across FeederDetail / DTDetail / ConsumerDetail.
 */
export function MapDetailRow({
  label,
  value,
  valueColor,
  valueFontSize,
}: MapDetailRowProps) {
  return (
    <div className="flex justify-between py-[5px] border-b border-[var(--border-light)] text-[12px] gap-[8px]">
      <span className="text-[var(--text-dim)] shrink-0">{label}</span>
      <span
        className="font-semibold font-mono text-right break-words min-w-0"
        style={{
          color: valueColor,
          fontSize: valueFontSize,
        }}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * AI-flag callout — was `.map-detail-ai`. Purple-tinted box with rounded
 * corners, inline text.
 */
export function MapDetailAi({ children }: { children: ReactNode }) {
  return (
    <div className="py-[10px] px-[12px] bg-[var(--ai-purple-light)] rounded-[8px] text-[11px] text-[var(--ai-purple)] leading-[1.6] mb-[12px]">
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── *
 *  Breadcrumb primitives (was .map-breadcrumb / .map-bc-item / .map-bc-sep /
 *  .map-bc-current). Small helpers to keep each detail panel readable.
 * ─────────────────────────────────────────────────────────────────────────── */

export function MapBreadcrumb({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center py-[8px] text-[11px] flex-wrap">
      {children}
    </div>
  )
}

interface BreadcrumbItemProps {
  onClick?: () => void
  children: ReactNode
}
export function MapBcItem({ onClick, children }: BreadcrumbItemProps) {
  return (
    <span
      onClick={onClick}
      className="text-[var(--ai-purple)] cursor-pointer font-medium py-[3px] px-[6px] rounded-[4px] transition-colors duration-150 hover:bg-[var(--ai-purple-light)]"
    >
      {children}
    </span>
  )
}
export function MapBcSep() {
  return <span className="text-[var(--text-dim)] px-[2px] text-[10px]">›</span>
}
export function MapBcCurrent({ children }: { children: ReactNode }) {
  return (
    <span className="text-[var(--text)] font-semibold py-[3px] px-[6px] cursor-default">
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── *
 *  Back-navigation button — was `.map-back-btn`. Used at DT / Consumer /
 *  DT-viewAll panels.
 * ─────────────────────────────────────────────────────────────────────────── */

interface MapBackBtnProps {
  onClick: () => void
  children: ReactNode
}
export function MapBackBtn({ onClick, children }: MapBackBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[4px] py-[6px] px-[12px] rounded-[8px] border border-[var(--border)] bg-[var(--card)] text-[var(--ai-purple)] text-[11px] font-semibold cursor-pointer mb-[12px] transition-all duration-150 hover:bg-[var(--ai-purple-light)] hover:border-[var(--ai-purple)]"
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── *
 *  Consumer triage list-item + risk-badge (used in FeederDetail + DTDetail).
 *  Was `.map-consumer-item` + `.map-consumer-risk`.
 * ─────────────────────────────────────────────────────────────────────────── */

interface MapConsumerItemProps {
  onClick: () => void
  /** Alignment override (default center, some rows use flex-start). */
  align?: 'center' | 'start'
  children: ReactNode
}
export function MapConsumerItem({
  onClick,
  align = 'center',
  children,
}: MapConsumerItemProps) {
  return (
    <div
      onClick={onClick}
      className={
        'flex gap-[6px] py-[6px] px-[8px] rounded-[6px] cursor-pointer text-[11px] border-b border-[var(--border-light)] transition-colors duration-150 hover:bg-[rgba(124,58,237,0.04)] ' +
        (align === 'start' ? 'items-start' : 'items-center')
      }
    >
      {children}
    </div>
  )
}

interface MapConsumerRiskProps {
  /** Border + text colour (matches risk band). */
  color: string
  /** Optional size override (default 24×24 for list rows; 40×40 for header). */
  size?: number
  /** Font size (default 9px list, 14px header). */
  fontSize?: number
  /** Font weight (default 700). */
  fontWeight?: number
  children: ReactNode
}
export function MapConsumerRisk({
  color,
  size = 24,
  fontSize = 9,
  fontWeight = 700,
  children,
}: MapConsumerRiskProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-mono shrink-0"
      style={{
        width: size,
        height: size,
        fontSize,
        fontWeight,
        background: `${color}18`,
        border: `2px solid ${color}`,
        color,
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── *
 *  Full-width panel action button — was `.map-action-btn`. Composes with
 *  shared `.btn-ai` / `.btn-outline` classes; adds full-width + centered
 *  layout that all panel CTAs share.
 * ─────────────────────────────────────────────────────────────────────────── */

interface MapActionBtnProps {
  variant: 'ai' | 'outline'
  onClick?: () => void
  /** Extra Tailwind classes (grid-column overrides etc.). */
  className?: string
  children: ReactNode
}
export function MapActionBtn({
  variant,
  onClick,
  className = '',
  children,
}: MapActionBtnProps) {
  const base =
    'block w-full py-[8px] rounded-[8px] text-[12px] font-semibold cursor-pointer text-center border-none'
  const variantClass = variant === 'ai' ? 'btn-ai' : 'btn-outline'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}
