import type { SVGProps } from 'react'
import { cn } from './cn'

interface IconProps extends SVGProps<SVGSVGElement> {
  title?: string
}

function IconBase({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m18 15-6-6-6 6" />
    </IconBase>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </IconBase>
  )
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </IconBase>
  )
}

export function MinusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
    </IconBase>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </IconBase>
  )
}

export function LoaderIcon(props: IconProps) {
  return (
    <IconBase {...props} className={cn('animate-ui-spin', props.className)}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </IconBase>
  )
}

export function SparklesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8L12 3Z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
    </IconBase>
  )
}

export function XIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </IconBase>
  )
}
