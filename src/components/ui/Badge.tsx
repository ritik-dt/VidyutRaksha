import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export type BadgeVariant =
  | 'default'
  | 'new'
  | 'assigned'
  | 'progress'
  | 'confirmed'
  | 'false'
  | 'escalated'
  | 'active'
  | 'ai'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: '',
  new: 'bg-[#ebf5fb] text-[#2471a3] border-[#aed6f1]',
  assigned: 'bg-amber-light text-amber-dark border-amber',
  progress: 'bg-amber-light text-amber-dark border-amber',
  confirmed: 'bg-red-light text-red border-red',
  'false': 'bg-[#e2e3e5] text-[#383d41] border-[#d6d8db]',
  escalated: 'bg-red-light text-red border-red',
  active: 'bg-green-light text-green border-[var(--green-mid)]',
  ai: 'bg-ai-purple-light text-ai-purple border-[rgba(124,58,237,0.2)]',
  success: 'bg-green-light text-green border-[var(--green-mid)]',
  warning: 'bg-amber-light text-amber-dark border-[rgba(245,158,11,0.4)]',
  danger: 'bg-red-light text-red border-[rgba(239,68,68,0.35)]',
  muted: 'bg-bg text-text-dim border-border',
  info: 'bg-[rgba(27,114,232,0.1)] text-electric border-[rgba(27,114,232,0.25)]',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-[10px] border px-2 py-[3px] text-[10px] font-semibold',
        BADGE_VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  )
}
