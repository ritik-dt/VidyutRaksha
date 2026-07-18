import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from './ErrorFallback'

/**
 * Fallback renderer contract.
 *
 * Consumers can render a custom fallback with full access to the caught error,
 * the React component stack, and a `reset` callback that clears the boundary's
 * error state so it can retry rendering `children`.
 */
export type ErrorFallbackRender = (args: {
  error: Error
  componentStack: string | null
  reset: () => void
}) => ReactNode

export interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Custom fallback UI. Accepts either a ReactNode (rendered as-is) or a
   * render-prop function receiving the caught error and a reset callback.
   * When omitted, the default {@link ErrorFallback} card is rendered.
   */
  fallback?: ReactNode | ErrorFallbackRender
  /**
   * Optional error observer. Called from `componentDidCatch` with the caught
   * error and React error info. This is the wiring seam for a future
   * observability integration (Sentry, structured logger). When absent, the
   * error is logged via `console.error` in development only.
   */
  onError?: (error: Error, info: ErrorInfo) => void
  /**
   * When any value in this array changes between renders, the boundary
   * automatically clears its error state. Used by the route-level boundary to
   * reset on navigation so the user isn't stuck on a stale error card after
   * moving to a new page.
   */
  resetKeys?: ReadonlyArray<unknown>
}

interface ErrorBoundaryState {
  error: Error | null
  componentStack: string | null
}

const INITIAL_STATE: ErrorBoundaryState = {
  error: null,
  componentStack: null,
}

/** Reference equality check across two `resetKeys` arrays. */
function resetKeysChanged(
  previous: ReadonlyArray<unknown> | undefined,
  next: ReadonlyArray<unknown> | undefined,
): boolean {
  if (previous === next) {
    return false
  }
  if (!previous || !next) {
    return true
  }
  if (previous.length !== next.length) {
    return true
  }
  for (let i = 0; i < previous.length; i += 1) {
    if (!Object.is(previous[i], next[i])) {
      return true
    }
  }
  return false
}

/**
 * Reusable error boundary.
 *
 * React error boundaries must be class components — `getDerivedStateFromError`
 * and `componentDidCatch` have no hook equivalents. This is deliberately the
 * only class component in the codebase.
 *
 * Design intent:
 * - The default fallback matches the app's card language via {@link ErrorFallback};
 *   consumers can supply their own via the `fallback` prop.
 * - The `onError` prop is the single seam through which errors are reported
 *   outward. Later, wiring a logger like Sentry is a one-line change per
 *   boundary instance — no internal changes required.
 * - `resetKeys` lets callers trigger a reset declaratively (e.g. on route
 *   change) without needing an imperative ref.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = INITIAL_STATE

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ componentStack: info.componentStack ?? null })

    if (this.props.onError) {
      this.props.onError(error, info)
      return
    }

    if (import.meta.env.DEV) {
      // Development-only diagnostic. Production callers wire `onError` to a
      // real observability sink.
      console.error('[ErrorBoundary]', error, info)
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.error !== null &&
      resetKeysChanged(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset()
    }
  }

  reset = (): void => {
    this.setState(INITIAL_STATE)
  }

  render(): ReactNode {
    const { error, componentStack } = this.state
    const { children, fallback } = this.props

    if (error === null) {
      return children
    }

    if (typeof fallback === 'function') {
      return fallback({ error, componentStack, reset: this.reset })
    }

    if (fallback !== undefined) {
      return fallback
    }

    return (
      <ErrorFallback
        error={error}
        componentStack={componentStack}
        onReset={this.reset}
      />
    )
  }
}
