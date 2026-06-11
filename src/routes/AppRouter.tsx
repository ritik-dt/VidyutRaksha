import { Navigate, Route, Routes } from 'react-router-dom'
import { ChartShowcasePage } from '@/pages/ChartShowcasePage'
import { AppShell } from '@/layouts/AppShell'
import { ProtectedOutlet } from '@/layouts/ProtectedOutlet'
// import { DashboardPage } from '@/pages/DashboardPage'
import DashboardPage from '@/pages/DashboardPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { UiShowcasePage } from '@/pages/UiShowcasePage'
import { ROUTE_DEFINITIONS } from './routeConfig'
// import { RoleLandingRedirect } from './RoleLandingRedirect'

export function AppRouter() {
  const shellRoutes = ROUTE_DEFINITIONS.filter(
    (route) => route.screen !== 'login',
  )

  return (
    <Routes>
      <Route
        path="/login"
        element={<PlaceholderPage screen="login" />}
      />
      <Route element={<AppShell />}>
        <Route element={<ProtectedOutlet />}>
          {/* <Route index element={<RoleLandingRedirect />} /> */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          {shellRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.screen === 'dashboard' ? (
                  <DashboardPage />
                ) : route.screen === 'chartShowcase' ? (
                  <ChartShowcasePage />
                ) : route.screen === 'uiShowcase' ? (
                  <UiShowcasePage />
                ) : (
                  <PlaceholderPage screen={route.screen} />
                )
              }
            />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
