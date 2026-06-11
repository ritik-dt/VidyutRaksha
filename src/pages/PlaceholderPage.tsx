import { useLocation } from 'react-router-dom'
import { useNavigation } from '@/context/NavigationContext'
import { useScope } from '@/context/ScopeContext'
import type { ScreenName } from '@/types'
import { ROUTE_DEFINITIONS } from '@/routes/routeConfig'
import { isHierAwareScreen } from '@/utils/hierarchy'

interface PlaceholderPageProps {
  screen: ScreenName
}

function findTitle(pathname: string, screen: ScreenName): string {
  const exact = ROUTE_DEFINITIONS.find((r) => r.screen === screen)
  if (exact && !exact.path.includes(':')) {
    return exact.title
  }

  const matched = ROUTE_DEFINITIONS.find((route) => {
    const pattern = route.path.replace(/:[^/]+/g, '[^/]+')
    return new RegExp(`^${pattern}$`).test(pathname)
  })

  return matched?.title ?? screen
}

export function PlaceholderPage({ screen }: PlaceholderPageProps) {
  const { pathname } = useLocation()
  const { currentScreen } = useNavigation()
  const { scopeLabel, currentNode, hierPath, scopeVersion } = useScope()
  const title = findTitle(pathname, screen)
  const scopeAware = isHierAwareScreen(currentScreen)

  return (
    <div>
      <div className="mb-[18px] flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-bold tracking-tight">{title}</div>
          <div className="mt-0.5 text-xs text-text-dim">
            Phase 2 — scope context active · screen migration pending
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="text-xs leading-relaxed text-text-mid">
          <p className="mb-3">
            <strong className="text-text">Route:</strong>{' '}
            <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[11px]">
              {pathname}
            </code>
          </p>
          <p className="mb-3">
            <strong className="text-text">Screen key:</strong>{' '}
            <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[11px]">
              {screen}
            </code>
          </p>
          <p className="mb-3">
            <strong className="text-text">Scope:</strong>{' '}
            <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[11px]">
              {scopeLabel}
            </code>
            {currentNode ? (
              <span className="ml-2 text-text-dim">
                ({currentNode.type}
                {scopeAware ? ' · hier-aware screen' : ''})
              </span>
            ) : null}
          </p>
          <p className="mb-3">
            <strong className="text-text">Hierarchy path:</strong>{' '}
            <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[11px]">
              {hierPath.join(' → ')}
            </code>
          </p>
          <p className="m-0 text-[11px] text-text-dim">
            Scope version: {scopeVersion}. Change scope via the 📍 picker in the
            top bar — hier-aware screens remount when scope changes.
          </p>
        </div>
      </div>
    </div>
  )
}
