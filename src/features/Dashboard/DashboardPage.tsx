import DashboardHeader from '@/features/Dashboard/components/DashboardHeader'
import DashboardOvernightStrip from '@/features/Dashboard/components/DashboardOvernightStrip'
import DashboardAiAnalysis from '@/features/Dashboard/components/DashboardAiAnalysis'
import DashboardKpis from '@/features/Dashboard/components/DashboardKpis'
import DashboardDrilldown from '@/features/Dashboard/components/DashboardDrilldown'
import DashboardTables from '@/features/Dashboard/components/DashboardTables'
import DashboardCharts from '@/features/Dashboard/components/DashboardCharts'
import DashboardEmptyState from '@/features/Dashboard/components/DashboardEmptyState'
import { useScope } from '@/shared/context/ScopeContext'

export default function DashboardPage() {
  const { currentNode } = useScope()

  if (!currentNode) {
    return <DashboardEmptyState />
  }

  return (
    <div className="dashboard-page space-y-0 pb-2">
      <DashboardHeader />
      <DashboardOvernightStrip />
      <DashboardAiAnalysis />
      <DashboardKpis />
      <DashboardDrilldown />
      <DashboardTables />
      <DashboardCharts />
    </div>
  )
}
