import { Navigate, Route, Routes } from 'react-router-dom'
import { ChartShowcasePage } from '@/pages/ChartShowcase/ChartShowcasePage'
import { AppShell } from '@/app/layouts/AppShell'
import { ProtectedOutlet } from '@/app/layouts/ProtectedOutlet'
import DashboardPage from '@/features/Dashboard/DashboardPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { UiShowcasePage } from '@/pages/UiShowcasePage'
import { ROUTE_DEFINITIONS } from './routeConfig'

// Feature pages
import MetersPage from '@/features/Meters/MetersPage'
import MeterDetailPage from '@/features/Meters/MeterDetailPage'
import CasesPage from '@/features/Cases/CasesPage'
import DiagnosticsPage from '@/features/Diagnostics/DiagnosticsPage'
import AlertsPage from '@/features/Alerts/AlertsPage'
import AnalyticsPage from '@/features/Analytics/AnalyticsPage'
import ClustersPage from '@/features/Clusters/ClustersPage'
import NLQueryPage from '@/features/NLQuery/NLQueryPage'
import TeamPage from '@/features/Team/TeamPage'
import RulesPage from '@/features/Rules/RulesPage'
import SettingsPage from '@/features/Settings/SettingsPage'
import ReportsPage from '@/features/Reports/ReportsPage'
import ROIPage from '@/features/ROI/ROIPage'
import DtLoadPage from '@/features/DtLoad/DtLoadPage'
import NetworkMapPage from '@/features/NetworkMap/NetworkMapPage'
import MobilePage from '@/features/Mobile/MobilePage'
import AssessmentPage from '@/features/Assessment/AssessmentPage'
import NoticesPage from '@/features/Notices/NoticesPage'
import ExecutivePage from '@/features/Executive/ExecutivePage'
import ForecastPage from '@/features/Forecast/ForecastPage'
import AppealsPage from '@/features/Appeals/AppealsPage'
import AuditPage from '@/features/Audit/AuditPage'
import ComparePage from '@/features/Compare/ComparePage'
import DataQualityPage from '@/features/DataQuality/DataQualityPage'
import IntegrationsPage from '@/features/Integrations/IntegrationsPage'
import NotificationsPage from '@/features/Notifications/NotificationsPage'
import PhotosPage from '@/features/Photos/PhotosPage'
import UsersPage from '@/features/Users/UsersPage'

import type { ScreenName } from '@/shared/types'

function pageForScreen(screen: ScreenName) {
  switch (screen) {
    case 'dashboard':    return <DashboardPage />
    case 'meters':       return <MetersPage />
    case 'meterDetail':  return <MeterDetailPage />
    case 'cases':        return <CasesPage />
    case 'diagnostics':  return <DiagnosticsPage />
    case 'alerts':       return <AlertsPage />
    case 'analytics':    return <AnalyticsPage />
    case 'clusters':     return <ClustersPage />
    case 'nlquery':      return <NLQueryPage />
    case 'team':         return <TeamPage />
    case 'rules':        return <RulesPage />
    case 'settings':     return <SettingsPage />
    case 'reports':      return <ReportsPage />
    case 'roi':          return <ROIPage />
    case 'dtload':       return <DtLoadPage />
    case 'networkmap':   return <NetworkMapPage />
    case 'mobile':       return <MobilePage />
    case 'assessment':   return <AssessmentPage />
    case 'notices':      return <NoticesPage />
    case 'executive':    return <ExecutivePage />
    case 'forecast':     return <ForecastPage />
    case 'appeals':      return <AppealsPage />
    case 'audit':        return <AuditPage />
    case 'compare':      return <ComparePage />
    case 'dataQuality':  return <DataQualityPage />
    case 'integrations': return <IntegrationsPage />
    case 'notifications':return <NotificationsPage />
    case 'photos':       return <PhotosPage />
    case 'users':        return <UsersPage />
    case 'chartShowcase': return <ChartShowcasePage />
    case 'uiShowcase':   return <UiShowcasePage />
    default:             return <PlaceholderPage screen={screen} />
  }
}

export function AppRouter() {
  const shellRoutes = ROUTE_DEFINITIONS.filter((route) => route.screen !== 'login')

  return (
    <Routes>
      <Route path="/login" element={<PlaceholderPage screen="login" />} />
      <Route element={<AppShell />}>
        <Route element={<ProtectedOutlet />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {shellRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={pageForScreen(route.screen)}
            />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
