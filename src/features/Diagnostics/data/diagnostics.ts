import { hierData } from '@/data/hierarchy'
import { enrichLevel } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type {
  DiagnosticAffectedMeter,
  DiagnosticReport,
  DiagnosticReportDefinition,
  DiagnosticScopeAdjustment,
} from '../types'

const FALLBACK_NAMES = [
  'HEERA LAL AGRAWAL',
  'M/S CHAWLA STEEL',
  'VINOD KUMAR',
  'SUSHILA DEVI',
  'M/S NEW INDIA AGENCIES',
  'RAMA SHANKAR',
  'M/S RAVI TEXTILES',
  'POOJA GUPTA',
  'ANAND KUMAR',
  'M/S SHIVA TRADERS',
  'MOHD. ASLAM',
  'RAKESH KUMAR',
  'M/S SHARMA AUTO PARTS',
  'HARI OM RICE MILL',
  'GRACE NURSING HOME',
  'BANSAL OIL MILLS',
  'ROYAL BANQUET HALL',
  'SHRI BALAJI COLD STORAGE',
  'KAILASH COLD STORAGE',
  'M/S RAJESH STEEL INDUSTRIES',
]

const FALLBACK_ZONES = [
  'Bhelupur',
  'Rathayatra',
  'Chowk',
  'Gomti Nagar',
  'Sigra',
  'Mahanagar',
  'Alambagh',
  'Indira Nagar',
]

const FALLBACK_DTS = [
  'DT-0445',
  'DT-0312',
  'DT-0789',
  'DT-0658',
  'DT-0410',
  'DT-0234',
  'DT-0876',
  'DT-0901',
]

const REPORT_TITLE_TO_EVIDENCE_LABEL: Record<string, string> = {
  'phase-missing': 'Phase currents (R/Y/B)',
  'cover-open': 'Last open event',
  'voltage-low': 'V & I readings',
  'ht-imbalance': 'Imbalance %',
  'consumption-comp': 'vs peer baseline',
  'excess-demand': 'MD vs sanctioned',
  'low-cons-high-md': 'kWh / MD',
  'voltage-no-current': 'V/I status',
}

export const DIAGNOSTIC_REPORTS: DiagnosticReportDefinition[] = [
  {
    id: 'phase-missing',
    priority: 'high',
    severity: 'critical',
    icon: '⚡',
    title: 'Phase Missing & CT Open',
    sub: 'Critical Tamper · 3-phase consumers',
    count: 47,
    delta: 6,
    insight:
      '47 meters show <strong>zero current on R or Y phase</strong> while other phases carry load. Direct CT bypass — meter recording only ⅔ of consumption.',
    physics:
      'A 3-phase meter showing 0A on one phase while drawing load on others = Current Transformer is open or shorted. Theft method: tampering CT to under-record. Detection: instantaneous current per phase < 0.1A while voltage > 200V on that phase.',
    revenueImpact: 4200000,
    typicalMeters: 'Industrial · Commercial · LT-6 tariff',
  },
  {
    id: 'cover-open',
    priority: 'high',
    severity: 'critical',
    icon: '🔓',
    title: 'Meter Cover Open',
    sub: 'Critical Tamper · Sealed compartment breach',
    count: 23,
    delta: 3,
    insight:
      '23 meters logged cover-open events <strong>without UPPCL technician work order</strong>. Sealed compartment was opened — likely tamper attempt.',
    physics:
      'Meters log "cover open" events when the sealed compartment is breached. Cross-reference with technician schedule: events without a matching work order are unauthorized opens. Often precede consumption pattern changes.',
    revenueImpact: 1850000,
    typicalMeters: 'Mixed · all tariff categories',
  },
  {
    id: 'voltage-low',
    priority: 'high',
    severity: 'critical',
    icon: '⬇️',
    title: 'Current Available, Voltage Low',
    sub: 'Earth-loading theft pattern',
    count: 89,
    delta: 12,
    insight:
      '89 meters show voltage <strong>&lt; 190V while drawing load</strong>. Either genuine LV condition or earth-loading theft creating apparent drop.',
    physics:
      'When voltage drops below 190V while current flows, two possibilities: (1) genuine system low-voltage requiring transformer tap adjustment, or (2) earth-loading theft where consumer connects load to earth/neutral, creating current flow with depressed voltage signature.',
    revenueImpact: 7800000,
    typicalMeters: 'Mostly residential LT-1, some LT-2',
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
    insight:
      '6 HT feeders show <strong>&gt; 5% voltage imbalance</strong> across phases. Power-quality issue — and shadow under which downstream theft hides.',
    physics:
      'NEMA standard: voltage imbalance < 1% healthy, > 5% damaging. Imbalance comes from unequal phase loading or downstream phase faults. Beyond power-quality concern, voltage imbalance complicates downstream tamper detection — masks individual meter signatures.',
    revenueImpact: 0,
    typicalMeters: 'HT feeder level (network, not consumer)',
  },
  {
    id: 'consumption-comp',
    priority: 'high',
    severity: 'high',
    icon: '📉',
    title: 'Consumption Comparison',
    sub: 'Period-over-period vs peer baseline',
    count: 312,
    delta: 28,
    insight:
      '312 consumers consuming <strong>&lt; 60% of peer baseline</strong> for 3+ months. Daily bread-and-butter theft signal.',
    physics:
      "Compare each consumer's monthly kWh to the peer-group baseline (same DT, same tariff, same activity type). Sustained drops > 40% without seasonal explanation indicate theft. The most common report DISCOMs run.",
    revenueImpact: 12600000,
    typicalMeters: 'All tariffs · primarily residential and small commercial',
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
    insight:
      '134 consumers recording <strong>MD beyond sanctioned load</strong>. Either revenue opportunity (load augmentation + penalty) or unauthorized load.',
    physics:
      'Maximum Demand (MD) reading exceeds the sanctioned contract load. Two paths: (a) consumer needs upgrade — revenue opportunity via load augmentation + penalty under MD violation clause, or (b) unauthorized load drawing more than declared.',
    revenueImpact: 3200000,
    typicalMeters: 'Industrial, Commercial, Hotels',
  },
  {
    id: 'low-cons-high-md',
    priority: 'medium',
    severity: 'high',
    icon: '🎭',
    title: 'Low Consumption + Excess Demand',
    sub: 'Classic theft signature',
    count: 41,
    delta: 5,
    insight:
      '41 consumers with <strong>low monthly kWh but high peak MD</strong>. Theft signature — meter under-records cumulative but glitches on peak.',
    physics:
      'Counter-intuitive but powerful: meters being tampered for kWh under-recording (e.g., partial CT bypass) often still glitch correctly during sudden peak draws. Result: low cumulative kWh but high MD recorded. The mismatch is unmistakable.',
    revenueImpact: 5400000,
    typicalMeters: 'Industrial, Hotels, Atta Chakki',
  },
  {
    id: 'voltage-no-current',
    priority: 'medium',
    severity: 'medium',
    icon: '🔌',
    title: 'Voltage Available, Current Missing',
    sub: 'Direct service-line theft',
    count: 67,
    delta: 9,
    insight:
      '67 meters with <strong>voltage normal but zero current for &gt; 7 days</strong>. Either genuinely off, or current flowing through alternate path (direct hooking).',
    physics:
      'Voltage is being supplied to the meter (no power outage) but the meter records no current flow. Two possibilities: (1) consumer truly disconnected/vacant — verifiable via field visit or, (2) current flowing through alternate path (direct hooking from service line bypassing the meter entirely).',
    revenueImpact: 3800000,
    typicalMeters: 'Often closed shops, vacant homes — mix of legitimate and theft',
  },
]

function makeSeed(input: string): number {
  let seed = 0
  for (let i = 0; i < input.length; i += 1) {
    seed = (seed * 31 + input.charCodeAt(i)) & 0x7fffffff
  }
  return seed
}

function createRandom(seedRef: { value: number }) {
  return () => {
    seedRef.value = (seedRef.value * 1103515245 + 12345) & 0x7fffffff
    return seedRef.value / 0x7fffffff
  }
}

function getScopeInfo(scopeId: string) {
  const scope = hierData[scopeId] ?? hierData.uppcl
  if (scope && typeof enrichLevel === 'function') {
    enrichLevel(scope)
  }

  const globalMeters = hierData.uppcl?.meters ?? 1_500_000
  const scopeMeters = scope?.meters ?? globalMeters
  const baseShare = Math.min(1, scopeMeters / globalMeters)

  return {
    scope,
    baseShare,
  }
}

function diagnosticAtScope(
  report: DiagnosticReportDefinition,
  scopeId: string,
): DiagnosticScopeAdjustment {
  const { scope, baseShare } = getScopeInfo(scopeId)
  if (!scope) {
    return {
      count: report.count,
      revenueImpact: report.revenueImpact,
      scopeShare: 1,
    }
  }

  const key = `${report.id}|${scopeId}`
  const seed = makeSeed(key)
  const adjustment = 0.75 + (seed % 50) / 100
  const scopeShare = Math.min(1, baseShare * adjustment)

  return {
    count: Math.max(0, Math.round(report.count * scopeShare)),
    revenueImpact: Math.max(0, Math.round(report.revenueImpact * scopeShare)),
    scopeShare,
  }
}

export function scopeDiagnosticCount(baseCount: number, scopeId: string): number {
  if (scopeId === 'uppcl') {
    return baseCount
  }

  const seed = makeSeed(scopeId)
  const share = 0.05 + (seed % 60) / 100
  return Math.max(1, Math.round(baseCount * share))
}

export function getDiagnosticReportsForScope(scopeId: string): DiagnosticReport[] {
  return DIAGNOSTIC_REPORTS.map((report) => {
    const adjustment = diagnosticAtScope(report, scopeId)
    return {
      ...report,
      count: adjustment.count,
      revenueImpact: adjustment.revenueImpact,
      originalCount: report.count,
      scopeShare: adjustment.scopeShare,
    }
  })
}

export function getDiagnosticScopeStats(scopeId: string) {
  const reports = getDiagnosticReportsForScope(scopeId)
  const highPriority = reports.filter((report) => report.priority === 'high')
  const mediumPriority = reports.filter((report) => report.priority === 'medium')
  const criticalCount = highPriority.filter((report) => report.severity === 'critical').length
  const totalAffected = reports.reduce((sum, report) => sum + report.count, 0)
  const totalImpact = reports.reduce((sum, report) => sum + report.revenueImpact, 0)
  const trendingUp = reports
    .filter((report) => report.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3)

  return {
    reports,
    highPriority,
    mediumPriority,
    criticalCount,
    totalAffected,
    totalImpact,
    trendingUp,
  }
}

export function getDiagnosticEvidenceLabel(reportId: string): string {
  return REPORT_TITLE_TO_EVIDENCE_LABEL[reportId] ?? 'Evidence'
}

function buildDetectionText(index: number): string {
  const labels = ['Today', 'Today', 'Yesterday', '2d ago', '3d ago', '5d ago']
  return labels[index % labels.length]
}

function buildLocation(scopeId: string, zone: string, dt: string): string {
  const scope = hierData[scopeId]
  const scopeName = scope?.name ?? 'UPPCL'
  return `${dt} · ${zone} · ${scopeName}`
}

export function getDiagnosticAffectedMeters(
  reportId: string,
  count: number,
  scopeId = 'uppcl',
): DiagnosticAffectedMeter[] {
  if (count <= 0) {
    return []
  }

  const report = DIAGNOSTIC_REPORTS.find((entry) => entry.id === reportId)
  if (!report) {
    return []
  }

  const seedRef = { value: makeSeed(`${reportId}|${scopeId}`) || 1 }
  const rand = createRandom(seedRef)

  const meters: DiagnosticAffectedMeter[] = []
  const namePool = [...FALLBACK_NAMES]
  const zonePool = [...FALLBACK_ZONES]
  const dtPool = [...FALLBACK_DTS]

  const reportTariffs: Record<string, string[]> = {
    'phase-missing': ['LT-6', 'LT-2', 'HT-1'],
    'cover-open': ['LT-1', 'LT-2', 'LT-6'],
    'voltage-low': ['LT-1', 'LT-1', 'LT-2'],
    'consumption-comp': ['LT-1', 'LT-2', 'LT-1'],
    'excess-demand': ['LT-2', 'LT-6', 'LT-2'],
    'low-cons-high-md': ['LT-6', 'LT-2', 'HT-1'],
    'voltage-no-current': ['LT-1', 'LT-2', 'LT-1'],
    'ht-imbalance': ['HT-1'],
  }

  const fallbackSeverity = report.severity === 'critical' ? 'critical' : report.severity
  const tariffs = reportTariffs[reportId] ?? ['LT-1', 'LT-2']

  for (let i = 0; i < count; i += 1) {
    const meterId = String(Math.floor(rand() * 9_000_000 + 1_000_000))
    const consumer = namePool[Math.floor(rand() * namePool.length)]
    const zone = zonePool[Math.floor(rand() * zonePool.length)]
    const dt = dtPool[Math.floor(rand() * dtPool.length)]
    const tariff = tariffs[Math.floor(rand() * tariffs.length)]
    const activityByTariff: Record<string, string> = {
      'LT-1': 'Domestic',
      'LT-2': 'Commercial',
      'LT-6': 'Industrial',
      'HT-1': 'HT consumer',
    }
    const activity = activityByTariff[tariff] ?? 'Mixed use'
    const baseDetected = buildDetectionText(i)
    const isRealish = i < Math.min(4, count)
    let evidence = ''
    let flag = ''
    let estimatedLoss = 0

    if (reportId === 'phase-missing') {
      const phaseA = (12 + rand() * 20).toFixed(1)
      const phaseB = (15 + rand() * 22).toFixed(1)
      const missing = ['Y', 'R', 'B'][Math.floor(rand() * 3)]
      evidence =
        missing === 'R'
          ? `R: 0.0A · Y: ${phaseA}A · B: ${phaseB}A`
          : missing === 'Y'
            ? `R: ${phaseA}A · Y: 0.0A · B: ${phaseB}A`
            : `R: ${phaseA}A · Y: ${phaseB}A · B: 0.0A`
      flag = `${missing}-phase 0A · CT open`
      estimatedLoss = Math.round(35_000 + rand() * 45_000)
    } else if (reportId === 'cover-open') {
      const events = 1 + Math.floor(rand() * 5)
      const days = 1 + Math.floor(rand() * 14)
      evidence = `${events} cover-open event${events > 1 ? 's' : ''} · last ${days}d ago`
      flag = events > 2 ? 'Repeat offender' : 'No work order'
      estimatedLoss = Math.round(8_000 + events * 2_200 + rand() * 15_000)
    } else if (reportId === 'voltage-low') {
      const voltage = (172 + rand() * 22).toFixed(0)
      const current = (8 + rand() * 15).toFixed(1)
      evidence = `V min: ${voltage}V · I: ${current}A · sustained 7d+`
      flag = Number(voltage) < 195 ? `Critical: ${voltage}V` : `Stressed: ${voltage}V`
      estimatedLoss = Math.round(15_000 + (215 - Number(voltage)) * 1_100 + rand() * 8_000)
    } else if (reportId === 'consumption-comp') {
      const drop = Math.floor(40 + rand() * 40)
      const peerKwh = Math.floor(20 + rand() * 30)
      const myKwh = Math.round(peerKwh * (1 - drop / 100))
      evidence = `${myKwh} kWh/d vs peer ${peerKwh} kWh/d · 3-mo trend`
      flag = `-${drop}% below peer`
      estimatedLoss = Math.round(5_000 + drop * 350 + rand() * 9_000)
    } else if (reportId === 'excess-demand') {
      const sanctioned = [5, 8, 15, 25, 40][Math.floor(rand() * 5)]
      const overshoot = 1.18 + rand() * 0.45
      const md = (sanctioned * overshoot).toFixed(1)
      evidence = `MD ${md}kW · Sanctioned ${sanctioned}kW · ${Math.floor(15 + rand() * 30)} days`
      flag = `+${Math.round((overshoot - 1) * 100)}% over sanction`
      estimatedLoss = Math.round(4_000 + (Number(md) - sanctioned) * 1_800 + rand() * 8_000)
    } else if (reportId === 'low-cons-high-md') {
      const sanctioned = [25, 35, 50, 75, 100][Math.floor(rand() * 5)]
      const lf = Math.floor(5 + rand() * 20)
      const md = (sanctioned * (0.7 + rand() * 0.2)).toFixed(0)
      const kwh = Math.round((lf * Number(md) * 720) / 100)
      evidence = `${kwh} kWh/mo · MD ${md}kW · Sanctioned ${sanctioned}kW · LF ${lf}%`
      flag = `Load factor ${lf}% (target >40%)`
      estimatedLoss = Math.round(18_000 + sanctioned * 250 + rand() * 12_000)
    } else if (reportId === 'voltage-no-current') {
      const voltage = (228 + rand() * 15).toFixed(0)
      const days = 7 + Math.floor(rand() * 30)
      const zeroPct = Math.floor(75 + rand() * 22)
      evidence = `V: ${voltage}V · I: 0.0A · ${zeroPct}% zero-current ${days}d`
      flag = zeroPct >= 90 ? 'Active bypass suspected' : 'Bypass suspected'
      estimatedLoss = Math.round(8_000 + zeroPct * 240 + rand() * 12_000)
    } else if (reportId === 'ht-imbalance') {
      const r = (10.2 + rand() * 1.1).toFixed(1)
      const y = (10.8 + rand() * 1.1).toFixed(1)
      const b = (9.8 + rand() * 1.1).toFixed(1)
      const imbalance = (4.5 + rand() * 1.6).toFixed(1)
      evidence = `R: ${r} · Y: ${y} · B: ${b} · Δ ${imbalance}%`
      flag = 'Network stress'
      estimatedLoss = 0
    }

    meters.push({
      id: meterId,
      consumer,
      location: buildLocation(scopeId, zone, dt),
      zone,
      detected: baseDetected,
      evidence,
      flag,
      estimatedLoss,
      tariff,
      activity,
      real: isRealish || fallbackSeverity === 'critical',
    })
  }

  return meters.slice(0, count)
}

export function getDiagnosticDetailRows(
  reportId: string,
  scopeId: string,
  count: number,
) {
  return getDiagnosticAffectedMeters(reportId, count, scopeId)
}

export function getDiagnosticReportById(reportId: string) {
  return DIAGNOSTIC_REPORTS.find((report) => report.id === reportId) ?? null
}

export function getDiagnosticScopeSummary(scopeId: string) {
  const stats = getDiagnosticScopeStats(scopeId)
  const scopeName = hierData[scopeId]?.name ?? 'UPPCL'
  return {
    scopeName,
    totalAffected: stats.totalAffected,
    totalImpact: stats.totalImpact,
    reportCount: stats.reports.length,
    criticalCount: stats.criticalCount,
    highCount: stats.highPriority.length,
    mediumCount: stats.mediumPriority.length,
    trendingUp: stats.trendingUp,
    scopeLabel: `${formatIndian(stats.totalAffected)} flagged`,
  }
}
