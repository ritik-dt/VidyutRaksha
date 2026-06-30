import DashboardHeader from '@/features/Dashboard/components/DashboardHeader'
import DashboardKpis from '@/features/Dashboard/components/DashboardKpis'
// import DashboardAiAnalysis from '@/features/Dashboard/components/DashboardAiAnalysis'
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
      <DashboardKpis />
      {/* <DashboardAiAnalysis /> */}
      <DashboardDrilldown />
      <DashboardTables />
      <DashboardCharts />
    </div>
  )
}
