export interface CaseRecord {
  id: string
  meter: string
  consumer: string
  risk: number
  area: string
  status: string
  assignee: string
  created: string
  due: string
  flags: number
  _real?: boolean
  _account?: string
  _activity?: string
  _tariff?: string
  _load?: number
  _load_unit?: string
  _zone?: string
}

export const CASES_LIST: CaseRecord[] = [
  {
    id: 'C-20260301-001',
    meter: '1849966',
    consumer: 'HEERA LAL AGRAWAL',
    risk: 94,
    area: 'Bhelupur / EUDD-II Varanasi',
    status: 'Assigned',
    assignee: 'Rajesh Kumar',
    created: '01 Mar 2026',
    due: '15 Mar 2026',
    flags: 3,
    _real: true,
    _account: '1705463',
  },
  {
    id: 'C-20260228-014',
    meter: '2034871',
    consumer: 'R.K. ENTERPRISES',
    risk: 91,
    area: 'Gomti Nagar / EDD-I',
    status: 'In Progress',
    assignee: 'Sunita Verma',
    created: '28 Feb 2026',
    due: '14 Mar 2026',
    flags: 3,
  },
  {
    id: 'C-20260225-008',
    meter: '1567234',
    consumer: 'VINOD KUMAR',
    risk: 88,
    area: 'Alambagh / EDD-II',
    status: 'Confirmed Theft',
    assignee: 'Amit Sharma',
    created: '25 Feb 2026',
    due: '10 Mar 2026',
    flags: 3,
  },
  {
    id: 'C-20260220-022',
    meter: '1923445',
    consumer: 'SUSHILA DEVI',
    risk: 85,
    area: 'Indira Nagar / EDD-III',
    status: 'False Positive',
    assignee: 'Priya Singh',
    created: '20 Feb 2026',
    due: '06 Mar 2026',
    flags: 2,
  },
  {
    id: 'C-20260218-005',
    meter: '2187690',
    consumer: 'M/S CHAWLA STEEL',
    risk: 82,
    area: 'Aliganj / EDD-I',
    status: 'Confirmed Theft',
    assignee: 'Deepak Yadav',
    created: '18 Feb 2026',
    due: '04 Mar 2026',
    flags: 2,
  },
  {
    id: 'C-20260215-011',
    meter: '1678432',
    consumer: 'ANAND KUMAR',
    risk: 79,
    area: 'Hazratganj / EDD-II',
    status: 'Escalated',
    assignee: 'Manish Gupta',
    created: '15 Feb 2026',
    due: '01 Mar 2026',
    flags: 2,
  },
  {
    id: 'C-20260301-R415',
    meter: '300415',
    consumer: 'GANESH CONSUMER PRODUCTS LIMITED',
    risk: 82,
    area: 'EDD-I Chandauli / EDC Chandauli',
    status: 'In Progress',
    assignee: 'Vikash Patel',
    created: '05 Mar 2026',
    due: '19 Mar 2026',
    flags: 2,
    _real: true,
    _account: '1924538000',
    _activity: 'Factory',
    _tariff: 'H21T',
    _load: 1000.0,
    _load_unit: 'KVA',
    _zone: 'Varanasi II',
  },
  {
    id: 'C-20260302-R160',
    meter: '895160',
    consumer: 'MRF CENTRE NAGAR PALIKA MALAKA',
    risk: 92,
    area: 'EDD-1 FATEHPUR / EDC Fatehpur',
    status: 'Assigned',
    assignee: 'Sunita Verma',
    created: '08 Mar 2026',
    due: '22 Mar 2026',
    flags: 2,
    _real: true,
    _account: '1589101174',
  },
  {
    id: 'C-20260305-019',
    meter: '1456789',
    consumer: 'RAMESH PRASAD YADAV',
    risk: 76,
    area: 'Rajajipuram / EDD-I',
    status: 'New',
    assignee: 'Unassigned',
    created: '05 Mar 2026',
    due: '19 Mar 2026',
    flags: 2,
  },
  {
    id: 'C-20260306-023',
    meter: '2098765',
    consumer: 'SHARMA TRADING CO.',
    risk: 73,
    area: 'Mahanagar / EDD-III',
    status: 'New',
    assignee: 'Unassigned',
    created: '06 Mar 2026',
    due: '20 Mar 2026',
    flags: 2,
  },
  {
    id: 'C-20260210-017',
    meter: '1789034',
    consumer: 'LAKSHMI INDUSTRIES',
    risk: 68,
    area: 'Chinhat / EDD-II',
    status: 'Closed',
    assignee: 'Amit Sharma',
    created: '10 Feb 2026',
    due: '24 Feb 2026',
    flags: 2,
  },
  {
    id: 'C-20260207-009',
    meter: '1345678',
    consumer: 'PUJA DEVI',
    risk: 64,
    area: 'Vikas Nagar / EDD-I',
    status: 'False Positive',
    assignee: 'Priya Singh',
    created: '07 Feb 2026',
    due: '21 Feb 2026',
    flags: 1,
  },
]

export interface CasesStats {
  total: number
  pastSla: number
  open: number
  inProgress: number
  escalated: number
  confirmed: number
  closed: number
  avgClose: number
  recovery: number
  active: number
}

export function computeCasesStats(cases: CaseRecord[]): CasesStats {
  const active = cases.filter((c) => !['Closed', 'False Positive'].includes(c.status)).length
  return {
    total: cases.length,
    pastSla: cases.filter((c) => c.status === 'Past SLA').length + 3, // include some past SLA
    open: cases.filter((c) => c.status === 'Assigned').length,
    inProgress: cases.filter((c) => ['In Progress', 'Escalated'].includes(c.status)).length,
    escalated: cases.filter((c) => c.status === 'Escalated').length,
    confirmed: cases.filter((c) => c.status === 'Confirmed Theft').length,
    closed: cases.filter((c) => c.status === 'Closed').length,
    avgClose: 3.2,
    recovery: 2845000,
    active,
  }
}

export const INSPECTORS = [
  'Rajesh Kumar',
  'Sunita Verma',
  'Amit Sharma',
  'Priya Singh',
  'Deepak Yadav',
  'Manish Gupta',
  'Vikash Patel',
  'Priya Mishra',
]
