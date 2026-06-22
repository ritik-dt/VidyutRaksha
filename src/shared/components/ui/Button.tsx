import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from './cn'
import { LoaderIcon } from './icons'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'text-white shadow-[var(--ai-glow)] hover:shadow-[0_4px_14px_rgba(124,58,237,0.24)]',
  secondary: 'bg-bg text-text border-border hover:border-ai-purple hover:text-ai-purple',
  outline:
    'bg-transparent text-text-mid border-border hover:bg-ai-purple-light hover:text-ai-purple hover:border-ai-purple',
  ghost: 'bg-transparent text-text-mid hover:bg-bg hover:text-text',
  danger: 'bg-red text-white hover:brightness-[1.02]',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[30px] px-3 py-[5px] text-[11px]',
  md: 'min-h-9 px-3.5 py-2 text-xs',
  lg: 'min-h-[42px] px-4 py-2.5 text-[13px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    iconLeft,
    iconRight,
    fullWidth = false,
    children,
    type = 'button',
    style,
    ...props
  },
  ref: Ref<HTMLButtonElement>,
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-sans font-semibold transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-150 hover:not-disabled:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai-purple disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
      style={{
        ...(variant === 'primary' ? { background: 'var(--ai-gradient)' } : undefined),
        ...style,
      }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderIcon className="inline-flex size-3.5 shrink-0 animate-ui-spin" />
      ) : null}
      {!loading && iconLeft ? (
        <span className="inline-flex size-3.5 shrink-0">{iconLeft}</span>
      ) : null}
      <span>{children}</span>
      {!loading && iconRight ? (
        <span className="inline-flex size-3.5 shrink-0">{iconRight}</span>
      ) : null}
    </button>
  )
})
