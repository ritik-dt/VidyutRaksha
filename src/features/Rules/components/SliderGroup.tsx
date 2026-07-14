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

/** Label + range input + right-aligned value. Used for threshold and weight. */
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
    <div className="slider-group">
      <label>{label}</label>
      <div className="slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
        />
        <span className="slider-val">{display}</span>
      </div>
    </div>
  )
}
