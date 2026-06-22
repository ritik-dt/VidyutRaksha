export interface DiagnosticReport {
  id: string
  priority: 'high' | 'medium'
  severity: 'critical' | 'high' | 'medium'
  icon: string
  title: string
  sub: string
  count: number
  delta: number
  insight: string
  physics: string
  revenue_impact: number
  typical_meters: string
}

export const DIAGNOSTIC_REPORTS: DiagnosticReport[] = [
  {
    id: 'phase-missing',
    priority: 'high',
    severity: 'critical',
    icon: '⚡',
    title: 'Phase Missing & CT Open',
    sub: 'Critical Tamper · 3-phase consumers',
    count: 47,
    delta: +6,
    insight: '47 meters show <strong>zero current on R or Y phase</strong> while other phases carry load. Direct CT bypass — meter recording only ⅔ of consumption.',
    physics: 'A 3-phase meter showing 0A on one phase while drawing load on others = Current Transformer is open or shorted. Theft method: tampering CT to under-record. Detection: instantaneous current per phase < 0.1A while voltage > 200V on that phase.',
    revenue_impact: 4200000,
    typical_meters: 'Industrial · Commercial · LT-6 tariff',
  },
  {
    id: 'cover-open',
    priority: 'high',
    severity: 'critical',
    icon: '🔓',
    title: 'Meter Cover Open',
    sub: 'Critical Tamper · Sealed compartment breach',
    count: 23,
    delta: +3,
    insight: '23 meters logged cover-open events <strong>without UPPCL technician work order</strong>. Sealed compartment was opened — likely tamper attempt.',
    physics: 'Meters log "cover open" events when the sealed compartment is breached. Cross-reference with technician schedule: events without a matching work order are unauthorized opens. Often precede consumption pattern changes.',
    revenue_impact: 1850000,
    typical_meters: 'Mixed · all tariff categories',
  },
  {
    id: 'voltage-low',
    priority: 'high',
    severity: 'critical',
    icon: '⬇️',
    title: 'Current Available, Voltage Low',
    sub: 'Earth-loading theft pattern',
    count: 89,
    delta: +12,
    insight: '89 meters show voltage <strong>&lt; 190V while drawing load</strong>. Either genuine LV condition or earth-loading theft creating apparent drop.',
    physics: 'When voltage drops below 190V while current flows, two possibilities: (1) genuine system low-voltage requiring transformer tap adjustment, or (2) earth-loading theft where consumer connects load to earth/neutral, creating current flow with depressed voltage signature.',
    revenue_impact: 7800000,
    typical_meters: 'Mostly residential LT-1, some LT-2',
  },
  {
    id: 'ht-imbalance',
    priority: 'high',
    severity: 'high',
    icon: '⚖️',
    title: 'HT Voltage Imbalance',
    sub: '11kV feeder upstream stress',
    count: 6,
    delta: 0,
    insight: '6 HT feeders show <strong>&gt; 5% voltage imbalance</strong> across phases. Power-quality issue — and shadow under which downstream theft hides.',
    physics: 'NEMA standard: voltage imbalance < 1% healthy, > 5% damaging. Imbalance comes from unequal phase loading or downstream phase faults. Beyond power-quality concern, voltage imbalance complicates downstream tamper detection.',
    revenue_impact: 0,
    typical_meters: 'HT feeder level (network, not consumer)',
  },
  {
    id: 'consumption-comp',
    priority: 'high',
    severity: 'high',
    icon: '📉',
    title: 'Consumption Comparison',
    sub: 'Period-over-period vs peer baseline',
    count: 312,
    delta: +28,
    insight: '312 consumers consuming <strong>&lt; 60% of peer baseline</strong> for 3+ months. Daily bread-and-butter theft signal.',
    physics: 'Compare each consumer\'s monthly kWh to the peer-group baseline (same DT, same tariff, same activity type). Sustained drops > 40% without seasonal explanation indicate theft.',
    revenue_impact: 12600000,
    typical_meters: 'All tariffs · primarily residential and small commercial',
  },
  {
    id: 'excess-demand',
    priority: 'medium',
    severity: 'medium',
    icon: '📈',
    title: 'Excess Demand',
    sub: 'MD exceeds sanctioned load',
    count: 134,
    delta: -4,
    insight: '134 consumers recording <strong>MD beyond sanctioned load</strong>. Either revenue opportunity (load augmentation + penalty) or unauthorized load.',
    physics: 'Maximum Demand (MD) reading exceeds the sanctioned contract load. Two paths: (a) consumer needs upgrade — revenue opportunity via load augmentation + penalty, or (b) unauthorized load drawing more than declared.',
    revenue_impact: 3200000,
    typical_meters: 'Industrial, Commercial, Hotels',
  },
  {
    id: 'tariff-mismatch',
    priority: 'medium',
    severity: 'medium',
    icon: '🏷️',
    title: 'Tariff Category Mismatch',
    sub: 'Activity vs registered tariff discrepancy',
    count: 78,
    delta: +5,
    insight: '78 consumers show <strong>activity inconsistent with registered tariff</strong>. Commercial entities on domestic LMV-1 tariff — systematic under-billing.',
    physics: 'Cross-reference consumer\'s registered activity/business type with their tariff code. A factory registered as LMV-1 (residential) pays far lower rates. Common in areas with lax initial registration.',
    revenue_impact: 5600000,
    typical_meters: 'Mixed · commercial on domestic tariff',
  },
  {
    id: 'zero-consumption',
    priority: 'medium',
    severity: 'medium',
    icon: '🔇',
    title: 'Consecutive Zero Consumption',
    sub: 'Active connection, zero energy recorded',
    count: 203,
    delta: +15,
    insight: '203 active connections showing <strong>zero kWh for 2+ consecutive months</strong>. Either meter failure (miss revenue), bypass, or abandoned property.',
    physics: 'Active connection with zero energy: three causes — (1) meter hardware failure, (2) consumer bypassing meter entirely, (3) property vacancy. Field visit distinguishes. But all three need action.',
    revenue_impact: 9100000,
    typical_meters: 'All categories · highest in residential',
  },
]

export function scopeDiagnosticCount(baseCount: number, scopeId: string): number {
  // Deterministic scope share based on scope id hash
  if (scopeId === 'uppcl') return baseCount
  let h = 0
  for (let i = 0; i < scopeId.length; i++) h = (h * 31 + scopeId.charCodeAt(i)) | 0
  const share = 0.05 + (Math.abs(h) % 60) / 100 // 5-65% share
  return Math.max(1, Math.round(baseCount * share))
}
