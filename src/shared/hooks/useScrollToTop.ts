import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Reset the app's scroll container to the top on forward navigation.
 *
 * Why this hook exists
 * --------------------
 * AppShell sizes the root to `h-screen` and marks every ancestor of the
 * `<Outlet />` as `overflow-hidden`, so the `window` never scrolls — scrolling
 * happens on the inner `#content` container. React Router 7's JSX router API
 * (`<Routes>`) does not restore or reset scroll on navigation on its own, and
 * `<ScrollRestoration>` is only available with the data-router API. Without
 * this hook, `#content.scrollTop` carries over across route changes and each
 * new page appears mid-scroll.
 *
 * Why it respects `POP` (back/forward)
 * ------------------------------------
 * Browsers restore scroll on Back/Forward by default and users rely on it. We
 * only reset for `PUSH` / `REPLACE` — i.e. genuinely new navigations — so the
 * Back button still feels native.
 *
 * Why `useLayoutEffect`
 * ---------------------
 * The reset is a visual concern that must happen before the browser paints the
 * new route, otherwise the user sees a one-frame flash of the old scroll offset.
 *
 * Mount this once, near `<Outlet />` in `AppShell`. No per-page code needed.
 */
export function useScrollToTop(scrollContainerId = 'content') {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'POP') return
    const container = document.getElementById(scrollContainerId)
    if (container) {
      container.scrollTop = 0
    } else {
      // Fallback for any layout that doesn't have the custom scroll container
      // (e.g. login screen) — window scroll harmlessly resets there too.
      window.scrollTo(0, 0)
    }
  }, [pathname, navigationType, scrollContainerId])
}
