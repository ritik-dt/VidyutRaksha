import type { ReactNode } from 'react'

interface WhatIfSliderCardProps {
  emoji: string
  title: string
  valuePrefix?: string
  valueDisplay: string
  valueSuffix: string
  valueColor: string       // CSS var
  accentColor: string      // maps to input's `accent-color`
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  labels: [string, string, string]
  description: ReactNode
  background: string
}

/**
 * Reusable slider card — matches prototype's inline card layout in renderWhatIfTab.
 * Header row with emoji title + big colored value, native range slider, 3-position
 * label row, and description text.
 */
export function WhatIfSliderCard({
  emoji,
  title,
  valuePrefix = '',
  valueDisplay,
  valueSuffix,
  valueColor,
  accentColor,
  min,
  max,
  step,
  value,
  onChange,
  labels,
  description,
  background,
}: WhatIfSliderCardProps) {
  return (
    <div className="card" style={{ background }}>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[12.5px] font-bold">
          {emoji} {title}
        </div>
        <div
          className="font-mono text-[18px] font-extrabold"
          style={{ color: valueColor }}
        >
          {valuePrefix}
          <span>{valueDisplay}</span>
          {valueSuffix}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor }}
      />

      <div className="mt-1 flex justify-between font-mono text-[9.5px] text-text-dim">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>

      <div className="mt-2 text-[10.5px] leading-relaxed text-text-mid">{description}</div>
    </div>
  )
}
