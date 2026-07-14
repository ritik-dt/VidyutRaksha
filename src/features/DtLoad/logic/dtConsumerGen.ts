import type { DT } from '../types'

/** Consumer row synthesized deterministically per DT (byte-identical to prototype). */
export interface DtConsumer {
  id: string
  name: string
  tariff: 'LT-1' | 'LT-2' | 'LT-6'
  sanctioned: number
  avgKw: number
  peakKw: number
  loadFactor: number
  sharePct: number
  anomaly: string | null
}

export interface DtConsumersResult {
  consumers: DtConsumer[]
  totalShare: number
}

/** Names bank — verbatim from prototype. */
const NAMES = [
  'HEERA LAL AGRAWAL', 'R.K. ENTERPRISES', 'VINOD KUMAR', 'SUSHILA DEVI', 'M/S CHAWLA STEEL',
  'ANAND KUMAR', 'RAMA SHANKAR', 'POOJA GUPTA', 'M/S PRECISION TOOLS', 'MOHD. ASLAM',
  'JASBIR SINGH', 'DEEPAK SAHU', 'M/S RAVI TEXTILES', 'SUNITA TIWARI', 'RAJ KUMAR YADAV',
  'M/S NEW INDIA AGENCIES', 'ASHOK GUPTA', 'RITU MISHRA', 'SANJAY VERMA', 'VIJAY PRATAP',
  'MEENA DEVI', 'RAVINDRA NATH', 'M/S CITY ELECTRONICS', 'HARI PRAKASH', 'OM PRAKASH',
  'M/S SHIVA TRADERS', 'KAVITA DEVI', 'RAKESH KUMAR', 'M/S RAJ MEDICALS', 'AMIT VERMA',
  'GEETA SHARMA', 'MUKESH KUMAR', 'PREM CHAND', 'URMILA DEVI', 'SHAILESH GUPTA',
  'LAXMAN PRASAD', 'REKHA AGARWAL', 'SURESH PANDEY', 'MAYA YADAV', 'RAVI TIWARI',
  'BABULAL', 'M/S GUPTA SWEETS', 'TARA DEVI', 'PRADEEP KUMAR', 'SAVITA SINGH',
  'KAUSHAL VERMA', 'GANGA RAM', 'M/S MITTAL STORES', 'PRAMOD SHARMA', 'SARITA YADAV',
  'M/S BHAGWATI MEDICOS', 'HARISH CHANDRA', 'RENU GUPTA', 'SANTOSH KUMAR', 'VIDYA DEVI',
  'SUDHIR PANDEY', 'M/S NEW STAR', 'LALIT KUMAR', 'M/S DEEP TRADERS', 'POONAM SHARMA',
]

/**
 * Deterministic consumer generation for a DT.
 *   - mode='top' → 15 highest-contributing consumers
 *   - mode='all' → all `d.consumers` consumers
 * RNG seeded from DT id so the same DT always yields the same consumer list.
 * Power-law share distribution: top 15 dominate load, tail contributes remainder.
 * Anomaly probability scales with DT loss + consumer index.
 */
export function getDtConsumers(d: DT, mode: 'top' | 'all' = 'top'): DtConsumersResult {
  const totalCount = mode === 'all' ? d.consumers : 15

  // Tariff mix by DT character (matches prototype's isIndustrial/isCommercial branches)
  const noteL = (d.note || '').toLowerCase()
  const isIndustrial = noteL.includes('industrial') || d.feeder.toLowerCase().includes('industrial')
  const isCommercial =
    noteL.includes('commercial') ||
    noteL.includes('market') ||
    d.feeder === 'Chowk' ||
    d.feeder === 'Sigra'
  let tariffMix: DtConsumer['tariff'][]
  if (isIndustrial) tariffMix = ['LT-6', 'LT-6', 'LT-2', 'LT-1', 'LT-1']
  else if (isCommercial) tariffMix = ['LT-2', 'LT-2', 'LT-2', 'LT-1', 'LT-6']
  else tariffMix = ['LT-1', 'LT-1', 'LT-1', 'LT-1', 'LT-2']

  // Stable RNG seeded by DT id — byte-identical to prototype
  let seed = 0
  for (let i = 0; i < d.id.length; i++) {
    seed = (seed * 31 + d.id.charCodeAt(i)) & 0x7fffffff
  }
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  const totalKw = d.currentLoad
  const consumers: DtConsumer[] = []
  for (let i = 0; i < totalCount; i++) {
    const tariff = tariffMix[Math.floor(rand() * tariffMix.length)]
    const sanctioned =
      tariff === 'LT-6'
        ? 25 + Math.floor(rand() * 75)
        : tariff === 'LT-2'
          ? 5 + Math.floor(rand() * 25)
          : 2 + Math.floor(rand() * 5)
    // Power-law share % (matches prototype exactly)
    let sharePct: number
    if (i === 0) sharePct = 8 + rand() * 4
    else if (i < 15) sharePct = Math.max(0.5, (6 - i * 0.35) * (0.5 + rand() * 0.5))
    else {
      sharePct = Math.max(0.05, (30 / Math.max(1, totalCount - 15)) * (0.3 + rand() * 1.4))
    }
    const myKw = Math.max(0.2, (totalKw * sharePct) / 100)
    const peakKw = myKw * (1.3 + rand() * 0.7)
    const loadFactor = myKw / peakKw

    // Anomaly detection (matches prototype exactly)
    let anomaly: string | null = null
    const baseAnomalyChance = d.loss > 15 ? 0.18 : d.loss > 12 ? 0.08 : 0.03
    const anomalyChance = i < 30 ? baseAnomalyChance : baseAnomalyChance * 0.4
    if (rand() < anomalyChance) {
      if (tariff === 'LT-1' && peakKw > sanctioned * 1.5) {
        anomaly =
          'Drawing ' +
          peakKw.toFixed(1) +
          ' kW peak — exceeds sanctioned ' +
          sanctioned +
          ' kW. Likely commercial use under residential tariff.'
      } else if (loadFactor > 0.8 && tariff !== 'LT-6') {
        anomaly =
          'Load factor ' +
          (loadFactor * 100).toFixed(0) +
          '% — running constant load 24/7. Inconsistent with tariff category.'
      } else if (myKw > sanctioned * 0.9) {
        anomaly =
          'Sustained at ' +
          Math.round((myKw / sanctioned) * 100) +
          '% of sanctioned capacity. Unusual draw pattern.'
      } else {
        anomaly = 'AI flagged: consumption pattern deviates from peer group on this DT.'
      }
    }
    consumers.push({
      id: 'K-' + String(100000 + Math.floor(rand() * 900000)),
      name: NAMES[Math.floor(rand() * NAMES.length)],
      tariff,
      sanctioned,
      avgKw: parseFloat(myKw.toFixed(1)),
      peakKw: parseFloat(peakKw.toFixed(1)),
      loadFactor: parseFloat(loadFactor.toFixed(2)),
      sharePct: parseFloat(sharePct.toFixed(1)),
      anomaly,
    })
  }
  // Sort by load contribution desc + recompute shares based on actual avgKw
  consumers.sort((a, b) => b.avgKw - a.avgKw)
  consumers.forEach((c) => {
    c.sharePct = parseFloat(((c.avgKw / totalKw) * 100).toFixed(1))
  })
  const sumKw = consumers.reduce((s, c) => s + c.avgKw, 0)
  const totalShare = Math.min(100, parseFloat(((sumKw / totalKw) * 100).toFixed(1)))
  return { consumers, totalShare }
}
