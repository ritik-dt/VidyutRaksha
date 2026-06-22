import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  InfoTooltip,
  KpiCard,
  LoadingState,
  MetricTrend,
  SectionHeader,
  StatItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  InfoIcon,
  SparklesIcon,
} from '@/shared/components/ui/icons'

export function UiShowcasePage() {
  const [tabValue, setTabValue] = useState('overview')

  return (
    <div className="flex flex-col gap-[18px]">
      <SectionHeader
        title="Shared UI Component System"
        subtitle="Presentation-only primitives aligned to the legacy prototype and ready for Dashboard implementation."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge variant="ai">Prototype matched</Badge>
            <InfoTooltip content="This page demonstrates every shared primitive in one place." />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        <Card>
          <CardHeader
            actions={
              <Button variant="ghost" size="sm" iconLeft={<InfoIcon width={14} height={14} />}>
                Help
              </Button>
            }
          >
            <CardTitle>Buttons and badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <Button iconLeft={<SparklesIcon width={14} height={14} />}>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex items-center gap-2.5">
                <Button loading>Loading</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button variant="outline" iconRight={<ArrowUpIcon width={14} height={14} />}>
                  Icon right
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="new">New</Badge>
                <Badge variant="assigned">Assigned</Badge>
                <Badge variant="progress">In progress</Badge>
                <Badge variant="confirmed">Confirmed</Badge>
                <Badge variant="false">False positive</Badge>
                <Badge variant="escalated">Escalated</Badge>
                <Badge variant="active">Active</Badge>
                <Badge variant="ai">AI</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="muted">Muted</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metric trend and stat items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <MetricTrend value="+4.2%" direction="up" />
                <MetricTrend value="-1.5%" direction="down" />
                <MetricTrend value="0%" direction="neutral" />
              </div>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <StatItem
                  label="Peak demand"
                  value="84 MW"
                  description="Last 24 hours"
                  trend="+6.1%"
                  trendDirection="up"
                  icon={<ArrowUpIcon width={14} height={14} />}
                />
                <StatItem
                  label="Loss reduction"
                  value="12.8%"
                  description="Compared with last month"
                  trend="-0.9%"
                  trendDirection="down"
                  icon={<ArrowDownIcon width={14} height={14} />}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <KpiCard
          title="Active consumers"
          value="1,24,560"
          trend="+4.2%"
          trendDirection="up"
          subtitle="Compared with last week"
          icon={<SparklesIcon width={14} height={14} />}
        />
        <KpiCard
          title="Open cases"
          value="842"
          trend="-2.8%"
          trendDirection="down"
          subtitle="Already routed to field teams"
          icon={<InfoIcon width={14} height={14} />}
        />
        <KpiCard
          title="Inspection completion"
          value="91%"
          trend="+1.1%"
          trendDirection="up"
          subtitle="Monthly target tracking"
          icon={<ArrowUpIcon width={14} height={14} />}
        />
        <KpiCard
          title="Recovery forecast"
          value="₹18.2 Cr"
          trend="0%"
          trendDirection="neutral"
          subtitle="Projected 30-day outcome"
          icon={<ArrowDownIcon width={14} height={14} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        <Card>
          <CardHeader actions={<Badge variant="ai">Accessible</Badge>}>
            <CardTitle>Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="disabled" disabled>
                  Disabled
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="text-xs leading-relaxed text-text-mid">
                  Overview content stays mounted only for the active tab value.
                </div>
              </TabsContent>
              <TabsContent value="alerts">
                <div className="text-xs leading-relaxed text-text-mid">
                  Alerts content demonstrates keyboard navigation and state sync.
                </div>
              </TabsContent>
              <TabsContent value="disabled">
                <div className="text-xs leading-relaxed text-text-mid">
                  Disabled tabs cannot be selected or focused.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading states</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5">
              <LoadingState variant="card" />
              <LoadingState variant="kpi" />
              <LoadingState variant="table" rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Empty state</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<SparklesIcon width={28} height={28} />}
              title="No network anomalies found"
              description="Once feeder data arrives, this space can guide operators to the next action."
              action={
                <Button variant="outline" iconLeft={<InfoIcon width={14} height={14} />}>
                  Refresh data
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reusable card structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5">
              <Card interactive onClick={() => undefined}>
                <CardHeader actions={<Badge variant="active">Interactive</Badge>}>
                  <CardTitle as="h4">Card header</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs leading-relaxed text-text-mid">
                    Cards are presentation-only and can be made clickable when needed.
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader
                  actions={
                    <InfoTooltip content="Header actions slot for filters, buttons, or contextual controls." />
                  }
                >
                  <CardTitle as="h4">Optional actions area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs leading-relaxed text-text-mid">
                    The header keeps the title and actions aligned without introducing business logic.
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

