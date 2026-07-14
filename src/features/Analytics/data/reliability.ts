/** Feeder reliability data — exact port of the prototype's `saidiData`. */
export interface FeederReliability {
  feeder: string
  saidi: number
  saifi: number
  caidi: number
  asai: number
  caifi: number
  maifi: number
  trend: '↑' | '↓' | '→'
  worst: string
}

export const SAIDI_DATA: FeederReliability[] = [
  { feeder: 'Bhelupur',        saidi: 14.2, saifi: 8.4,  caidi: 1.69, asai: 99.84, caifi: 11.8, maifi: 24.6, trend: '↑', worst: 'Vijaya Complex'    },
  { feeder: 'Rathayatra',      saidi: 22.8, saifi: 12.1, caidi: 1.88, asai: 99.74, caifi: 18.2, maifi: 42.4, trend: '↓', worst: 'Shivpur Colony'    },
  { feeder: 'Central Jail',    saidi: 8.6,  saifi: 5.2,  caidi: 1.65, asai: 99.90, caifi: 7.4,  maifi: 14.8, trend: '→', worst: '—'                 },
  { feeder: 'Chauk',           saidi: 18.4, saifi: 9.8,  caidi: 1.88, asai: 99.79, caifi: 14.6, maifi: 32.2, trend: '↓', worst: 'Jal Sansthan DTR'  },
  { feeder: 'Ganesh Pur',      saidi: 11.2, saifi: 6.4,  caidi: 1.75, asai: 99.87, caifi: 9.1,  maifi: 18.4, trend: '↑', worst: 'Dindayalpur'       },
  { feeder: 'Kabir Nagar',     saidi: 16.8, saifi: 10.2, caidi: 1.65, asai: 99.81, caifi: 15.2, maifi: 28.6, trend: '→', worst: '—'                 },
  { feeder: 'Kerakatpur',      saidi: 9.4,  saifi: 5.8,  caidi: 1.62, asai: 99.89, caifi: 8.3,  maifi: 16.2, trend: '↑', worst: '—'                 },
  { feeder: 'Raghunath Nagar', saidi: 20.4, saifi: 11.6, caidi: 1.76, asai: 99.77, caifi: 17.4, maifi: 38.8, trend: '↓', worst: 'Raghunath Colony'  },
  { feeder: 'Ramarepur',       saidi: 12.8, saifi: 7.2,  caidi: 1.78, asai: 99.85, caifi: 10.6, maifi: 21.4, trend: '→', worst: '—'                 },
  { feeder: 'Shaktipeeth',     saidi: 15.6, saifi: 8.8,  caidi: 1.77, asai: 99.82, caifi: 12.4, maifi: 26.2, trend: '↑', worst: 'Ledhupur DTR'      },
]

export function computeReliabilityAverages() {
  const n = SAIDI_DATA.length
  return {
    avgSaidi: (SAIDI_DATA.reduce((s, d) => s + d.saidi, 0) / n).toFixed(1),
    avgSaifi: (SAIDI_DATA.reduce((s, d) => s + d.saifi, 0) / n).toFixed(1),
    avgAsai:  (SAIDI_DATA.reduce((s, d) => s + d.asai,  0) / n).toFixed(2),
    avgCaifi: (SAIDI_DATA.reduce((s, d) => s + d.caifi, 0) / n).toFixed(1),
    avgMaifi: (SAIDI_DATA.reduce((s, d) => s + d.maifi, 0) / n).toFixed(1),
  }
}
