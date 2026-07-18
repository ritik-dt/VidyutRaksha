import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'

export interface ErrorFallbackProps {
  /** The error caught by the enclosing boundary. */
  error: Error
  /** React component stack captured in `componentDidCatch`, when available. */
  componentStack: string | null
  /** Clears the boundary's error state so it retries rendering `children`. */
  onReset: () => void
  /**
   * Optional path for the secondary "Back to Dashboard" navigation. Defaults
   * to `/dashboard` — override only when a boundary lives on a page where a
   * different fallback destination reads better (e.g. a wizard's first step).
   */
  homePath?: string
}

/**
 * Default fallback UI for {@link ErrorBoundary}.
 *
 * Kept intentionally minimal to match the existing card language (Card /
 * EmptyState). Uses only pre-existing tokens, no additions to `index.css`.
 *
 * Technical details are only rendered under `import.meta.env.DEV`, so
 * production users never see stack traces.
 */
export function ErrorFallback({
  error,
  componentStack,
  onReset,
  homePath = '/dashboard',
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)
  const isDev = import.meta.env.DEV

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[320px] items-center justify-center p-4"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex size-12 items-center justify-center rounded-2xl text-amber"
            style={{ background: 'var(--amber-light)' }}
          >
            <AlertTriangle size={22} />
          </div>

          <div className="text-[15px] font-bold text-text">
            Something went wrong on this page
          </div>

          <div className="max-w-md text-xs leading-relaxed text-text-mid">
            An unexpected error stopped this view from rendering. You can try
            again, or head back to the Overview and continue from there.
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button variant="primary" size="sm" onClick={onReset}>
              Try again
            </Button>
            <Link
              to={homePath}
              onClick={onReset}
              className="inline-flex min-h-[30px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-3 py-[5px] font-sans text-[11px] font-semibold text-text-mid transition-[transform,background-color,border-color,color,box-shadow] duration-150 hover:-translate-y-px hover:border-ai-purple hover:bg-ai-purple-light hover:text-ai-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai-purple"
            >
              Back to Overview
            </Link>
          </div>

          {isDev ? (
            <div className="mt-3 w-full">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="cursor-pointer text-[10.5px] font-medium text-text-dim underline underline-offset-2 hover:text-text-mid"
                aria-expanded={showDetails}
              >
                {showDetails
                  ? 'Hide technical details'
                  : 'Show technical details'}
              </button>

              {showDetails ? (
                <div
                  className="mt-2 max-h-56 overflow-auto rounded-md border border-border p-3 text-left font-mono text-[10.5px] leading-relaxed text-text-mid"
                  style={{ background: 'var(--bg)' }}
                >
                  <div className="mb-1.5 font-bold text-red">{error.name}: {error.message}</div>
                  {componentStack ? (
                    <pre className="whitespace-pre-wrap">{componentStack}</pre>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
