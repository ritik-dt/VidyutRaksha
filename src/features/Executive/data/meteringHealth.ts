import type { MeteringHealthData } from '../types'

export const METERING_HEALTH: MeteringHealthData = {
  stats: [
    {
      id: 'smart',
      name: 'Smart Meter Coverage',
      valueText: '36%',
      barPercent: 36,
      tone: 'warn',
      panelKey: 'smart',
    },
    {
      id: 'commSuccess',
      name: 'Communication Success',
      valueText: '87%',
      barPercent: 87,
      tone: 'good',
      panelKey: 'smart',
    },
    {
      id: 'nonComm',
      name: 'Non-Communicating',
      valueText: '13%',
      barPercent: 13,
      tone: 'bad',
      panelKey: 'smart',
    },
    {
      id: 'neverCom',
      name: 'Never COM (Ever)',
      valueText: '4,218',
      barPercent: 18,
      tone: 'bad',
      nameStyle: 'emphasis',
      panelKey: 'smart',
    },
  ],
  nonCom: {
    title: 'Non-COM Ageing',
    countText: '32,600 meters',
    buckets: [
      { label: '< 30 Days', barPercent: 45, valueText: '14,670', age: 'fresh' },
      { label: '30 – 90 Days', barPercent: 35, valueText: '11,410', age: 'mid' },
      { label: '> 90 Days', barPercent: 20, valueText: '6,520', age: 'old' },
    ],
  },
  tamperToday: { name: 'Tamper Alerts (Today)', valueText: '186' },
}
