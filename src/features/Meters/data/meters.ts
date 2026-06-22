export interface SuspMeter {
  id: string
  risk: number
  conf: number
  cat: string
  area: string
  dt: string
  sl: string
  flags: string[]
  status: string
  drop: number
  events: number
  aiNote: string
  theftType?: string
  _real?: boolean
  _consumer?: string
  _account?: string
  _activity?: string
  _tariff?: string
  _load?: number
  _load_unit?: string
  _zone?: string
}

export const SUSP_METERS: SuspMeter[] = [
  {
    id: '1849966', risk: 94, conf: 87, cat: 'Industrial',
    area: 'Bhelupur West / UEDC-I Varanasi', dt: 'DTR-1849', sl: '35 KW',
    flags: ['Earth Loading (50x in 2022)', 'Consumption drop 54%', 'MD decline 42%'],
    status: 'New', drop: -54, events: 448,
    aiNote: 'Classic bypass pattern — earth loading paired with sustained consumption drop. High confidence.',
    theftType: 'Earth Loading', _real: true, _consumer: 'HEERA LAL AGRAWAL', _account: '1705463',
  },
  {
    id: '2034871', risk: 91, conf: 92, cat: 'Commercial',
    area: 'Gomti Nagar / EDD-I', dt: 'DT-0887', sl: '20 kW',
    flags: ['Meter bypass suspected', 'Zero night consumption', 'PF anomaly'],
    status: 'Assigned', drop: -72, events: 18,
    aiNote: 'Night usage dropped to zero while day usage holds steady — likely bypass active only at night.',
    theftType: 'Meter Bypass',
  },
  {
    id: '884759', risk: 90, conf: 80, cat: 'Industrial',
    area: 'nan / EDC-II Prayagraj', dt: 'DTR-4759', sl: '12.36 KVA',
    flags: ['77.9% of recent intervals at zero load', '7768 lifetime tamper events recorded', 'Lifetime PF 0.588 below 0.85 threshold'],
    status: 'New', drop: -77, events: 7768,
    aiNote: 'Real MRI data: 7768 lifetime tamper events, 77.9% zero-load intervals in last 7 days, avg 21.9 kWh/day. Rice Mill & Atta Chakki consumer with sanctioned 12.36KVA. AI-flagged for forensic review.',
    theftType: 'Earth Loading', _real: true, _consumer: 'MANNA LAL', _account: '1243849000',
    _activity: 'Rice Mill & Atta Chakki', _tariff: '64', _load: 12.36, _load_unit: 'KVA', _zone: 'Prayagraj II',
  },
  {
    id: '885030', risk: 90, conf: 80, cat: 'Commercial',
    area: 'nan / EDC Pratapgarh', dt: 'DTR-5030', sl: '9.0 KW',
    flags: ['58.1% of recent intervals at zero load', '1269 lifetime tamper events recorded', 'Lifetime PF 0.601 below 0.85 threshold'],
    status: 'New', drop: -58, events: 1269,
    aiNote: 'Real MRI data: 1269 lifetime tamper events, 58.1% zero-load intervals. Atta Chakki consumer.',
    theftType: 'Magnetic Tamper', _real: true, _consumer: 'DEENANATH VERMA', _account: '6069646879',
  },
  {
    id: '885321', risk: 90, conf: 80, cat: 'Commercial',
    area: 'nan / EDC-II Prayagraj', dt: 'DTR-5321', sl: '7.46 KW',
    flags: ['88.9% of recent intervals at zero load', '847 lifetime tamper events recorded', 'Lifetime PF 0.636 below 0.85 threshold'],
    status: 'New', drop: -88, events: 847,
    aiNote: 'Real MRI data: 847 lifetime tamper events, 88.9% zero-load intervals.',
    theftType: 'Meter Bypass', _real: true, _consumer: 'BAIJ NATH MAURYA', _account: '5061520100',
  },
  {
    id: '886086', risk: 90, conf: 80, cat: 'Commercial',
    area: 'nan / EDC Varanasi', dt: 'DTR-6086', sl: '13.0 KVA',
    flags: ['75.8% of recent intervals at zero load', '5482 lifetime tamper events recorded', 'Lifetime PF 0.764 below 0.85 threshold'],
    status: 'New', drop: -75, events: 5482,
    aiNote: 'Real MRI data: 5482 lifetime tamper events. ITI College consumer.',
    theftType: 'CT Manipulation', _real: true, _consumer: 'LALITADEVIINDUSTRIALT', _account: '3814748000',
  },
  {
    id: '886806', risk: 90, conf: 80, cat: 'Commercial',
    area: 'nan / UEDC-II Varanasi', dt: 'DTR-6806', sl: '5.0 KW',
    flags: ['68.2% of recent intervals at zero load', '712 lifetime tamper events recorded', 'Lifetime PF 0.714 below 0.85 threshold'],
    status: 'New', drop: -68, events: 712,
    aiNote: 'Real MRI data: 712 lifetime tamper events. Cotton Work consumer.',
    theftType: 'Earth Loading', _real: true, _consumer: 'GANESH CHAUHAN', _account: '6364221148',
  },
  {
    id: '887067', risk: 90, conf: 80, cat: 'Agricultural',
    area: 'nan / EDC Chandauli', dt: 'DTR-7067', sl: '13.05 KW',
    flags: ['83.7% of recent intervals at zero load', '4085 lifetime tamper events recorded', 'Lifetime PF 0.666 below 0.85 threshold'],
    status: 'New', drop: -83, events: 4085,
    aiNote: 'Real MRI data: 4085 lifetime tamper events. Govt. Tubewell consumer.',
    theftType: 'Earth Loading', _real: true, _consumer: 'RAJKIYA NALKUP', _account: '7562199000',
  },
  {
    id: '1567234', risk: 88, conf: 78, cat: 'Industrial',
    area: 'Alambagh / EDD-II', dt: 'DT-0234', sl: '50 kW',
    flags: ['Reverse energy detected', 'Tariff mismatch', 'Load flatline'],
    status: 'New', drop: -41, events: 32,
    aiNote: 'Reverse energy flow without solar registration. Possible generation-side fraud.',
    theftType: 'CT Manipulation',
  },
  {
    id: '1923445', risk: 85, conf: 83, cat: 'Domestic',
    area: 'Indira Nagar / EDD-III', dt: 'DT-1098', sl: '3 kW',
    flags: ['Magnetic tamper (12x)', 'Night consumption spike'],
    status: 'Inspected', drop: -38, events: 12,
    aiNote: 'Repeated magnet events correlate with evening load — consumer likely using magnet during peak hours.',
    theftType: 'Magnetic Tamper',
  },
  {
    id: '2187690', risk: 82, conf: 75, cat: 'Agricultural',
    area: 'Aliganj / EDD-I', dt: 'DT-0556', sl: '7.5 kW',
    flags: ['Consumption drop 61%', 'Cover open event'],
    status: 'New', drop: -61, events: 8,
    aiNote: 'Agricultural pump consumer with steep drop outside harvest season.',
    theftType: 'Earth Loading',
  },
  {
    id: '738342', risk: 80, conf: 80, cat: 'Domestic',
    area: 'nan / UEDC-I Varanasi', dt: 'DTR-8342', sl: '6.0 KW',
    flags: ['100.0% of recent intervals at zero load', '361 lifetime tamper events recorded', 'Lifetime tampers: 361'],
    status: 'New', drop: -100, events: 361,
    aiNote: 'Real MRI data: 361 lifetime tamper events, 100.0% zero-load intervals.',
    theftType: 'Meter Bypass', _real: true, _consumer: 'SMT CHANDRWATI', _account: '5984501000',
  },
  {
    id: '751780', risk: 80, conf: 80, cat: 'Domestic',
    area: 'nan / UEDC-II Varanasi', dt: 'DTR-1780', sl: '8.0 KW',
    flags: ['100.0% of recent intervals at zero load', '208 lifetime tamper events recorded'],
    status: 'New', drop: -100, events: 208,
    aiNote: 'Real MRI data: 208 lifetime tamper events.',
    theftType: 'Meter Bypass', _real: true, _consumer: 'JAWAHIR LAL SHASTRI', _account: '2430421000',
  },
  {
    id: '1678432', risk: 79, conf: 71, cat: 'Commercial',
    area: 'Hazratganj / EDD-II', dt: 'DT-0112', sl: '15 kW',
    flags: ['kVAh/kWh ratio anomaly', 'Sudden MD drop'],
    status: 'Assigned', drop: -33, events: 5,
    aiNote: 'kVAh-to-kWh ratio has diverged — possible CT ratio manipulation.',
    theftType: 'CT Manipulation',
  },
  {
    id: '1445567', risk: 76, conf: 88, cat: 'Domestic',
    area: 'Charbagh / EDD-I', dt: 'DT-0901', sl: '5 kW',
    flags: ['Zero consumption 3 months', 'Communication normal'],
    status: 'New', drop: -100, events: 2,
    aiNote: 'Meter communicating normally but reporting zero kWh — strong indicator of complete bypass.',
    theftType: 'Meter Bypass',
  },
  {
    id: '897101', risk: 80, conf: 80, cat: 'Commercial',
    area: 'nan / EDC I Azamgarh', dt: 'DTR-7101', sl: '5.0 KW',
    flags: ['73.3% of recent intervals at zero load', '503 lifetime tamper events recorded'],
    status: 'New', drop: -73, events: 503,
    aiNote: 'Real MRI data: 503 lifetime tamper events. Atta Chakki consumer.',
    theftType: 'Earth Loading', _real: true, _consumer: 'SONI KUMARI', _account: '1925844000',
  },
  {
    id: '2098123', risk: 73, conf: 66, cat: 'Industrial',
    area: 'Mahanagar / EDD-II', dt: 'DT-1234', sl: '100 kW',
    flags: ['Load factor drop', 'Neutral disturbance'],
    status: 'New', drop: -28, events: 15,
    aiNote: 'Load factor dropped from 0.72 to 0.41 over 3 months.',
    theftType: 'Neutral Disturbance',
  },
]

// Exposure calculation — same formula as prototype
export function calcExposure(m: SuspMeter): number {
  const loadKw = parseFloat((m.sl || '0').replace(/[^0-9.]/g, '')) || 5
  const tariffMult = m.cat === 'Industrial' ? 8.5 : m.cat === 'Commercial' ? 6.2 : m.cat === 'Agricultural' ? 2.3 : 1
  return Math.round(m.risk * Math.abs(m.drop || 1) * loadKw * tariffMult * 18)
}

export function getTopTargets(meters: SuspMeter[], n = 5) {
  return [...meters]
    .map((m) => ({ ...m, _exposure: calcExposure(m) }))
    .sort((a, b) => b._exposure - a._exposure)
    .slice(0, n)
}

export type MeterRiskBand = 'all' | 'critical' | 'high' | 'medium' | 'new'

export function filterMetersByBand(meters: SuspMeter[], band: MeterRiskBand): SuspMeter[] {
  if (band === 'all') return meters
  if (band === 'critical') return meters.filter((m) => m.risk >= 80)
  if (band === 'high') return meters.filter((m) => m.risk >= 60 && m.risk < 80)
  if (band === 'medium') return meters.filter((m) => m.risk >= 40 && m.risk < 60)
  if (band === 'new') return meters.filter((m) => m.status === 'New')
  return meters
}

export const METER_THEFT_TYPES: Record<string, string> = {
  '1849966': 'Earth Loading',
  '2034871': 'Meter Bypass',
  '884759': 'Earth Loading',
  '1567234': 'CT Manipulation',
  '1923445': 'Magnetic Tamper',
  '2187690': 'Earth Loading',
  '1678432': 'CT Manipulation',
  '2098123': 'Neutral Disturbance',
}

export const THEFT_TYPES = ['Earth Loading', 'Meter Bypass', 'CT Manipulation', 'Magnetic Tamper', 'Tariff Misuse', 'Direct Hooking']

export function topTheftFor(id: string): { type: string; pct: number } {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return { type: THEFT_TYPES[Math.abs(h) % THEFT_TYPES.length], pct: 28 + (Math.abs(h >> 3) % 25) }
}

export function oldestPendingFor(id: string, loss: number): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const base = loss > 22 ? 14 : loss > 18 ? 8 : 4
  return base + (Math.abs(h >> 5) % 7)
}

export const REMEDIATION_KB: Record<string, {
  type: string; safety: string[]; checklist: string[]
  meterAction: string; legal: string; formula: string
}> = {
  'Earth Loading': {
    type: 'Earth Loading / Neutral Bypass',
    safety: ['Wear insulated safety gloves before approaching meter', 'Do not touch bare wires or exposed connections', 'Keep safe distance from live conductors'],
    checklist: ['Photograph meter seal and serial number', 'Check neutral wire — intact, cut, or bypassed?', 'Check for bypass wire between phase and earth', 'Take clamp-meter reading: compare neutral vs phase current', 'Photograph any unauthorized wiring from multiple angles', 'Record meter display reading (kWh, kVAh, tamper count)', 'Check earth pit connection', 'If bypass confirmed — do NOT reconnect, escalate to AE'],
    meterAction: 'Replace meter with anti-tamper enclosure. Install neutral monitoring relay. Reseal with tamper-evident seals.',
    legal: 'Section 135(1)(a), Electricity Act 2003 — unauthorized use by tampering with meter or delivery system.',
    formula: '(Days from first event to detection) × Peer avg kWh/day × Tariff rate + 2x penalty under Section 135',
  },
  'Meter Bypass': {
    type: 'Full Meter Bypass',
    safety: ['De-energize the connection before physical inspection', 'Wear insulated gloves and safety shoes', 'Have a helper present for safety'],
    checklist: ['Check for direct connection bypassing meter', 'Inspect service connection for unauthorized taps', 'Check metering compartment seal integrity', 'Verify meter terminal block connections', 'Photograph all wiring from multiple angles', 'Compare meter reading with expected consumption', 'Document any unauthorized wiring'],
    meterAction: 'Remove bypass wiring. Replace meter. Install anti-tamper seals. Increase inspection frequency.',
    legal: 'Section 135(1)(b), Electricity Act 2003 — energy theft by bypassing meter.',
    formula: '(Days of bypass) × Sanctioned load × 24h × Load factor × Tariff rate + 2x penalty',
  },
  'CT Manipulation': {
    type: 'Current Transformer Manipulation',
    safety: ['High voltage hazard — CT terminals can be dangerous', 'Wear class-2 insulated gloves', 'De-energize CT circuit before inspection if possible'],
    checklist: ['Check CT terminal block for bridging wires', 'Measure secondary current with reference CT', 'Check CT winding polarity — reversed = fraud signal', 'Inspect CT ratio marking vs specification', 'Check for CT shorting links', 'Photograph CT installation from all angles', 'Record power factor and current readings'],
    meterAction: 'Replace CT set with sealed anti-tamper CTs. Verify metering accuracy after replacement.',
    legal: 'Section 135(1)(a) — manipulation of measuring device. FIR warranted for industrial consumers.',
    formula: '(CT ratio error %) × Recorded consumption ÷ (100 - CT ratio error %) × Assessment period × Rate',
  },
  'Magnetic Tamper': {
    type: 'Magnetic Field Interference',
    safety: ['Standard PPE — no special hazard', 'Do not dismantle meter on-site without authorization'],
    checklist: ['Check meter body for external magnet attachment points', 'Test meter register with calibrated test current', 'Check for residual magnetization in meter disc', 'Photograph meter and surrounding area', 'Check tamper event log for timing pattern vs billing periods', 'Correlate magnet events with zero-load periods'],
    meterAction: 'Replace mechanical meter with solid-state electronic meter (magnet-immune). Apply tamper-evident seal.',
    legal: 'Section 135(1)(a) — fraudulent use of measuring device.',
    formula: '(Months of tamper × Baseline monthly consumption × Tamper efficiency rate) × Tariff rate + penalty',
  },
  'Neutral Disturbance': {
    type: 'Neutral Disturbance / MD Manipulation',
    safety: ['Standard PPE required', 'Caution around CT/PT connections'],
    checklist: ['Check neutral terminal connections', 'Measure neutral current vs phase currents', 'Verify MD recording accuracy', 'Check for neutral point manipulation', 'Record before/after readings'],
    meterAction: 'Reseal neutral terminals. Install monitoring relay. Replace if tampered.',
    legal: 'Section 135(1)(a), Electricity Act 2003.',
    formula: '(MD underrecording %) × Assessment period × Tariff rate',
  },
}
