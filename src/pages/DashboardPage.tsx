import DashboardHeader from '@/features/Dashboard/DashboardHeader'
import DashboardKpis from '@/features/Dashboard/DashboardKpis'
// import DashboardAiAnalysis from '@/features/Dashboard/DashboardAiAnalysis'
import DashboardDrilldown from '@/features/Dashboard/DashboardDrilldown'
import DashboardTables from '@/features/Dashboard/DashboardTables'
import DashboardCharts from '@/features/Dashboard/DashboardCharts'
import DashboardEmptyState from '@/features/Dashboard/DashboardEmptyState'
import { useScope } from '@/context/ScopeContext'

export default function DashboardPage() {
  const { currentNode } = useScope()

  if (!currentNode) {
    return <DashboardEmptyState />
  }

  return (
    <div className="dashboard-page space-y-0 pb-8">
      <DashboardHeader />
      <DashboardKpis />

      {/* <DashboardAiAnalysis /> */}

      <DashboardDrilldown />
      <DashboardTables />
      <DashboardCharts />
    </div>
  )
}
