interface SyntheticDataBannerProps {
  isAllSynthetic: boolean
}

/**
 * Amber warning banner shown when the current scope has any synthetic (non-pilot) feeders.
 * Text switches based on whether the scope is _all_ synthetic or a mix.
 */
export function SyntheticDataBanner({ isAllSynthetic }: SyntheticDataBannerProps) {
  return (
    <div
      className="mb-3 flex items-center gap-2.5 rounded-lg border px-3.5 py-2 text-[11.5px]"
      style={{
        background: 'rgba(251,191,36,0.08)',
        borderColor: 'rgba(251,191,36,0.3)',
      }}
    >
      <span className="text-[16px]">⚠️</span>
      <div>
        <strong style={{ color: 'var(--amber-dark, #b45309)' }}>
          {isAllSynthetic ? 'Demo projection' : 'Mixed data — pilot + projection'}.
        </strong>{' '}
        {isAllSynthetic
          ? 'Network at this scope is not part of the live pilot. Numbers are illustrative based on UPPCL-wide AT&C benchmarks.'
          : 'KVVNL Varanasi data is from the live pilot; other zones are illustrative projections.'}{' '}
        Live pilot data is currently <strong>KVVNL → Varanasi Zone</strong> only.
      </div>
    </div>
  )
}
