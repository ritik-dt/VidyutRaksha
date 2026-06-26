// Forensic "Meter analysis" derivations — ported 1:1 from the prototype's
// buildInstantParams / phaseIntegrityCheck / phaseIntegrityFromLoadSurvey /
// buildTODProfile / computeRunningTime / categorizeTamperEvents so that every
// number on this tab matches the prototype exactly (verified against the
// real screenshots for meter #1849966).
import type { SuspMeter } from './meters'
import type { RealMeterData } from './realMeterData'

// ─── Deterministic seed (Java/JS string-hashCode, mirrors prototype) ────────
function seedFor(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

// ─── Instantaneous parameter snapshot ────────────────────────────────────────
export interface PhaseTriplet {
  R: number
  Y: number
  B: number
}

export interface InstantParams {
  isReal: boolean
  timestamp: string
  isThreePhase: boolean
  voltage: PhaseTriplet
  current: PhaseTriplet
  pf: PhaseTriplet
  angle: { vR: number; vY: number; vB: number; iR: number; iY: number; iB: number }
  frequency: number
  reverseCurrent: boolean
}

export function buildInstantParams(meter: SuspMeter, realData?: RealMeterData): InstantParams {
  const seed = seedFor(meter.id || '')
  const rand = (offset: number, mod: number, base: number) => base + ((seed >> offset) % mod)
  const severity = clamp01(((meter.risk || 50) - 30) / 60)
  const isThreePhase = meter.cat === 'Industrial' || meter.cat === 'Commercial' || (meter.sl != null && parseFloat(meter.sl) >= 10)

  // PRIORITY: a real recorded tamper V/I reading (when we have one) overrides the synthetic base
  const lastVI = realData?.last_tamper_vi
  const baseV = lastVI?.v ?? 230 + rand(0, 6, -3)
  const baseI = lastVI?.i ?? (isThreePhase ? 18 + rand(2, 12, 0) : 4 + rand(2, 4, 0))

  const vImbalanceMag = severity * 0.13 + 0.012
  const vR = baseV * (1 + (rand(4, 7, -3) / 100) * (1 - severity * 0.3))
  const vY = baseV * (1 - vImbalanceMag * (severity > 0.5 ? 1 : 0.3))
  const vB = baseV * (1 + (severity > 0.6 ? -vImbalanceMag * 0.5 : rand(6, 5, -2) / 100))

  const phaseZero = severity > 0.7 && (seed & 3) > 0
  const iR = phaseZero && (seed & 3) === 1 ? 0.1 : baseI * (1 + rand(8, 8, -4) / 100)
  const iY = phaseZero && (seed & 3) === 2 ? 0.1 : baseI * (1 - severity * 0.4 + rand(10, 6, -3) / 100)
  const iB = phaseZero && (seed & 3) === 3 ? 0.1 : baseI * (1 + severity * 0.2 + rand(12, 8, -4) / 100)

  const pfR = Math.max(0.3, 0.96 - severity * 0.45 + rand(14, 4, -2) / 100)
  const pfY = Math.max(0.3, 0.95 - severity * 0.5 + rand(16, 4, -2) / 100)
  const pfB = Math.max(0.3, 0.94 - severity * 0.4 + rand(18, 4, -2) / 100)

  const angleDev = severity * 22
  const angR = 0 + rand(20, 5, -2)
  const angY = 120 + rand(22, 5, -2) - (severity > 0.6 ? angleDev * 0.5 : 0)
  const angB = 240 + rand(24, 5, -2) + (severity > 0.5 ? angleDev * 0.4 : 0)

  const reverseCurrent = severity > 0.85 && !!(seed & 1)
  const lagFromPF = (pf: number) => (Math.acos(Math.max(-1, Math.min(1, pf))) * 180) / Math.PI
  const revPhaseIdx = seed % 3
  const buildIAngle = (vAngle: number, pf: number, phaseIdx: number) => {
    let lag = lagFromPF(pf)
    if (reverseCurrent && phaseIdx === revPhaseIdx) {
      lag = 155 + rand(28 + phaseIdx * 2, 20, 0)
    }
    return (vAngle - lag + 360) % 360
  }
  const iAngR = buildIAngle(angR, pfR, 0)
  const iAngY = buildIAngle(angY, pfY, 1)
  const iAngB = buildIAngle(angB, pfB, 2)

  return {
    isReal: false,
    timestamp: realData?.summary?.mri_date ?? new Date().toISOString(),
    isThreePhase,
    voltage: { R: +vR.toFixed(1), Y: +vY.toFixed(1), B: +vB.toFixed(1) },
    current: { R: +iR.toFixed(2), Y: +iY.toFixed(2), B: +iB.toFixed(2) },
    pf: { R: +pfR.toFixed(2), Y: +pfY.toFixed(2), B: +pfB.toFixed(2) },
    angle: { vR: angR, vY: angY, vB: angB, iR: iAngR, iY: iAngY, iB: iAngB },
    frequency: 49.9 + rand(26, 3, -1) / 10,
    reverseCurrent,
  }
}

// ─── V/I imbalance ───────────────────────────────────────────────────────────
export function computeImbalance(values: PhaseTriplet): number {
  const avg = (values.R + values.Y + values.B) / 3
  if (avg === 0) return 100
  const maxDev = Math.max(Math.abs(values.R - avg), Math.abs(values.Y - avg), Math.abs(values.B - avg))
  return (maxDev / avg) * 100
}

// ─── Instantaneous phase integrity check (bypass / PT manipulation) ────────
export interface PhaseIntegrityFlag {
  phase: 'R' | 'Y' | 'B'
  code: 'V_AVAIL_I_ZERO' | 'I_AVAIL_V_LOW'
  desc: string
}

export function phaseIntegrityCheck(p: InstantParams) {
  const result: { critical: PhaseIntegrityFlag[]; warnings: PhaseIntegrityFlag[] } = { critical: [], warnings: [] }
  ;(['R', 'Y', 'B'] as const).forEach((ph) => {
    const v = p.voltage[ph]
    const i = p.current[ph]
    if (v > 200 && i < 0.5) {
      result.critical.push({
        phase: ph,
        code: 'V_AVAIL_I_ZERO',
        desc: `V=${v}V available but I=${i}A — line is energized but meter records no current. Strong bypass signature.`,
      })
    } else if (i > 1 && v < 200) {
      result.warnings.push({
        phase: ph,
        code: 'I_AVAIL_V_LOW',
        desc: `I=${i}A flowing but V=${v}V is below normal range. Possible PT manipulation or upstream tap.`,
      })
    }
  })
  return result
}

// ─── Phase integrity over the load-survey window ────────────────────────────
export interface LoadSurveyIntegrity {
  isReal: boolean
  windowDays: number
  totalIntervals: number
  perPhase: Record<'R' | 'Y' | 'B', { vAvailIZero: number; iAvailVLow: number }>
  lowVoltDays: number
  normVoltDays: number
}

export function phaseIntegrityFromLoadSurvey(meter: SuspMeter, realData?: RealMeterData): LoadSurveyIntegrity {
  // PRIORITY 1: flagship has N days of daily summaries with zero_pct + volt_min/max
  if (realData?.daily?.length) {
    const days = realData.daily
    let totalIntervals = 0
    let vAvailIZeroIntervals = 0
    let iAvailVLowIntervals = 0
    let lowVoltDays = 0
    let normVoltDays = 0
    days.forEach((d) => {
      const intervalsPerDay = 48
      totalIntervals += intervalsPerDay
      const zeroPct = d.zero_pct ?? 0
      const vMin = d.volt_min ?? 230
      if (vMin >= 200) {
        vAvailIZeroIntervals += Math.round((intervalsPerDay * zeroPct) / 100)
        normVoltDays++
      }
      if (vMin < 200) {
        iAvailVLowIntervals += Math.round((intervalsPerDay * (100 - zeroPct)) / 100)
        lowVoltDays++
      }
    })
    const vAvailIZeroPct = totalIntervals > 0 ? +((vAvailIZeroIntervals / totalIntervals) * 100).toFixed(1) : 0
    const iAvailVLowPct = totalIntervals > 0 ? +((iAvailVLowIntervals / totalIntervals) * 100).toFixed(1) : 0
    return {
      isReal: true,
      windowDays: days.length,
      totalIntervals,
      perPhase: {
        R: { vAvailIZero: vAvailIZeroPct, iAvailVLow: iAvailVLowPct },
        Y: { vAvailIZero: +(vAvailIZeroPct * 0.92).toFixed(1), iAvailVLow: +(iAvailVLowPct * 1.08).toFixed(1) },
        B: { vAvailIZero: +(vAvailIZeroPct * 1.05).toFixed(1), iAvailVLow: +(iAvailVLowPct * 0.95).toFixed(1) },
      },
      lowVoltDays,
      normVoltDays,
    }
  }
  // FALLBACK: derive from meter risk profile
  const seed = seedFor(meter.id || '')
  const severity = clamp01(((meter.risk || 50) - 30) / 60)
  const baseVZero = severity * 45 + (seed % 6)
  const baseVLow = severity * 18 + ((seed >> 3) % 5)
  return {
    isReal: false,
    windowDays: 30,
    totalIntervals: 1440,
    perPhase: {
      R: { vAvailIZero: +baseVZero.toFixed(1), iAvailVLow: +baseVLow.toFixed(1) },
      Y: { vAvailIZero: +(baseVZero * (0.85 + ((seed >> 5) % 6) / 100)).toFixed(1), iAvailVLow: +(baseVLow * 1.1).toFixed(1) },
      B: { vAvailIZero: +(baseVZero * 1.1).toFixed(1), iAvailVLow: +(baseVLow * 0.9).toFixed(1) },
    },
    lowVoltDays: Math.round(30 * severity * 0.4),
    normVoltDays: 30 - Math.round(30 * severity * 0.4),
  }
}

export function phaseSeverity(ls: LoadSurveyIntegrity, ph: 'R' | 'Y' | 'B'): 'critical' | 'warning' | 'ok' {
  const pp = ls.perPhase[ph]
  if (pp.vAvailIZero > 25 || pp.iAvailVLow > 15) return 'critical'
  if (pp.vAvailIZero > 10 || pp.iAvailVLow > 5) return 'warning'
  return 'ok'
}

// ─── Time-of-Day (TOD) profile ───────────────────────────────────────────────
export interface TODProfile {
  offPeak: number
  normal: number
  peak: number
  expectedPeakPct: number
  actualPeakPct: number
  isReal: boolean
}

export function buildTODProfile(meter: SuspMeter): TODProfile {
  const seed = seedFor(meter.id || '')
  const severity = clamp01(((meter.risk || 50) - 30) / 60)
  const isInd = meter.cat === 'Industrial' || meter.cat === 'Commercial'
  const peakSuppress = severity * 0.7
  const total = isInd ? 800 : 280
  const offPct = (isInd ? 0.25 : 0.35) + (seed % 8) / 100
  const peakPct = (isInd ? 0.2 : 0.15) * (1 - peakSuppress)
  const normalPct = 1 - offPct - peakPct
  return {
    offPeak: Math.round(total * offPct),
    normal: Math.round(total * normalPct),
    peak: Math.round(total * peakPct),
    expectedPeakPct: isInd ? 20 : 15,
    actualPeakPct: +(peakPct * 100).toFixed(1),
    isReal: false,
  }
}

// ─── Running time % ───────────────────────────────────────────────────────────
export interface RunningTime {
  pct: number
  totalIntervals: number
  activeIntervals: number
  isReal: boolean
}

export function computeRunningTime(meter: SuspMeter, realData?: RealMeterData): RunningTime {
  // PRIORITY 1: flagship's daily survey has pre-computed zero_pct on each day
  if (realData?.daily?.length && realData.daily[0].zero_pct != null) {
    const days = realData.daily.filter((d) => d.zero_pct != null)
    if (days.length > 0) {
      const avgZero = days.reduce((s, d) => s + d.zero_pct, 0) / days.length
      const runPct = +(100 - avgZero).toFixed(1)
      return {
        pct: runPct,
        totalIntervals: days.length * 48,
        activeIntervals: Math.round((days.length * 48 * runPct) / 100),
        isReal: true,
      }
    }
  }
  // FALLBACK: derive from meter profile
  const seed = seedFor(meter.id || '')
  const severity = clamp01(((meter.risk || 50) - 30) / 60)
  const isInd = meter.cat === 'Industrial'
  const baseline = isInd ? 78 : meter.cat === 'Commercial' ? 62 : 42
  const drop = severity * 35
  const noise = (seed % 8) - 4
  const pct = +Math.max(8, baseline - drop + noise).toFixed(1)
  return {
    pct,
    totalIntervals: 2880,
    activeIntervals: Math.round((2880 * pct) / 100),
    isReal: false,
  }
}

// ─── Tamper event criticality, year-by-year ─────────────────────────────────
export interface YearCriticality {
  critical: number
  high: number
  medium: number
}

export function categorizeTamperEvents(realData?: RealMeterData) {
  const byYear: Record<string, YearCriticality> = {}
  if (realData?.year_stats && Object.keys(realData.year_stats).length > 0) {
    Object.entries(realData.year_stats).forEach(([yr, counts]) => {
      byYear[yr] = {
        critical: counts.earth || 0,
        high: counts.neutral || 0,
        medium: counts.pf || 0,
      }
    })
    return { byYear, isReal: true }
  }
  // FALLBACK: derive from total event count
  const total = realData?.summary?.tamper_count ? Number(realData.summary.tamper_count) : 100
  const years = ['2022', '2023', '2024', '2025', '2026']
  years.forEach((yr, i) => {
    const factor = 0.05 + i * 0.22
    const yrTotal = Math.round(total * factor)
    byYear[yr] = {
      critical: Math.round(yrTotal * 0.55),
      high: Math.round(yrTotal * 0.28),
      medium: Math.round(yrTotal * 0.17),
    }
  })
  return { byYear, isReal: false }
}

// ─── Live phasor classification (drives the AI Classification box + sliders) ─
export interface PhasorClassification {
  cls: string
  color: string
  bg: string
  sig: string
  msg: string
}

export function classifyPhasor(angle: InstantParams['angle'], pf: PhaseTriplet): PhasorClassification {
  const lags = (['R', 'Y', 'B'] as const).map((ph) => {
    const v = angle[('v' + ph) as 'vR' | 'vY' | 'vB']
    const i = angle[('i' + ph) as 'iR' | 'iY' | 'iB']
    return ((v - i + 540) % 360) - 180
  })
  const maxAbsLag = Math.max(...lags.map(Math.abs))
  const minPF = Math.min(pf.R, pf.Y, pf.B)
  const reverseCount = lags.filter((l) => Math.abs(l) > 90).length

  if (reverseCount >= 2) {
    return {
      cls: 'REVERSE CURRENT · LIKELY THEFT',
      color: '#DC3545',
      bg: 'rgba(220,53,69,0.10)',
      sig: `CT polarity inversion on ${reverseCount} phases`,
      msg: 'Multiple phases reading negative power (energy flowing meter → grid). Strong CT-wire-swap signature. Forensic priority.',
    }
  }
  if (reverseCount === 1) {
    return {
      cls: 'SINGLE-PHASE REVERSAL · SUSPICIOUS',
      color: '#DC3545',
      bg: 'rgba(220,53,69,0.08)',
      sig: '1 phase with |lag| > 90°',
      msg: 'One phase showing reverse current. Could be CT installation error or selective tampering on highest-load phase. Site verification recommended.',
    }
  }
  if (maxAbsLag > 60 || minPF < 0.6) {
    return {
      cls: 'CT MANIPULATION · HIGH RISK',
      color: '#E6921E',
      bg: 'rgba(230,146,30,0.10)',
      sig: `lag ${maxAbsLag.toFixed(0)}° · PF ${minPF.toFixed(2)}`,
      msg: 'Phase angles outside normal inductive range (typical industrial: 15-35°). Pattern consistent with partial CT shorting or burden manipulation.',
    }
  }
  if (maxAbsLag > 35 || minPF < 0.85) {
    return {
      cls: 'LOW PF · BORDERLINE',
      color: '#F4A847',
      bg: 'rgba(244,168,71,0.10)',
      sig: `lag ${maxAbsLag.toFixed(0)}° · PF ${minPF.toFixed(2)}`,
      msg: 'Slightly elevated lag. Could be legitimate inductive load (motor, pump) or early-stage tamper. Cross-check with consumer activity type.',
    }
  }
  return {
    cls: 'NORMAL · HEALTHY',
    color: '#28A745',
    bg: 'rgba(40,167,69,0.10)',
    sig: `lag ${maxAbsLag.toFixed(0)}° · PF ${minPF.toFixed(2)}`,
    msg: 'Phase angles within expected range for this consumer category. No CT manipulation indicators.',
  }
}
