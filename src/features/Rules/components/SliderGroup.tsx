interface SliderGroupProps {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  disabled?: boolean
}

/** Label + range input + right-aligned value. Used for threshold and weight.
 *
 *  Matches prototype's `.slider-group label`, `.slider-row`, and `.slider-row input[type=range]`
 *  byte-for-byte — INCLUDING browser-default accent color for the range track
 *  (prototype does NOT set `accent-color` on sliders). */
export function SliderGroup({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  disabled,
}: SliderGroupProps) {
  return (
    <div>
      <label className="text-[10px] font-medium text-[var(--text-dim)] block mb-[3px]">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="flex-1 h-[3px]"
        />
        <span className="text-[12px] font-medium font-[var(--mono)] min-w-[28px] text-right">
          {display}
        </span>
      </div>
    </div>
  )
}
