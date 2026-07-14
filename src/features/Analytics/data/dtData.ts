import type { DtRow } from '../types'

/** DT-level detailed audit rows — exact port of the prototype's `dtData`. */
export const DT_DATA: DtRow[] = [
  { dt: 'DT-1142', cap: 100, load: 87, meters: 148, input: 42500,  billed: 33200,  loss: 21.9, div: 'Chowk',      feeder: 'Feeder-7',  phaseR: 35, phaseY: 28, phaseB: 24, alerts: 3 },
  { dt: 'DT-0887', cap: 200, load: 72, meters: 312, input: 89200,  billed: 74500,  loss: 16.5, div: 'Gomti Nagar', feeder: 'Feeder-3',  phaseR: 26, phaseY: 24, phaseB: 22, alerts: 1 },
  { dt: 'DT-0234', cap: 500, load: 91, meters: 86,  input: 156800, billed: 118900, loss: 24.2, div: 'Residency',   feeder: 'Feeder-12', phaseR: 48, phaseY: 22, phaseB: 21, alerts: 5 },
  { dt: 'DT-1098', cap: 100, load: 65, meters: 124, input: 38900,  billed: 33600,  loss: 13.6, div: 'Chowk',      feeder: 'Feeder-9',  phaseR: 23, phaseY: 21, phaseB: 21, alerts: 0 },
  { dt: 'DT-0556', cap: 200, load: 78, meters: 267, input: 72100,  billed: 54800,  loss: 24.0, div: 'Mahanagar',   feeder: 'Feeder-5',  phaseR: 30, phaseY: 26, phaseB: 22, alerts: 2 },
  { dt: 'DT-0112', cap: 315, load: 55, meters: 198, input: 98700,  billed: 87200,  loss: 11.7, div: 'Residency',   feeder: 'Feeder-2',  phaseR: 20, phaseY: 18, phaseB: 17, alerts: 0 },
  { dt: 'DT-0901', cap: 100, load: 82, meters: 156, input: 45200,  billed: 34100,  loss: 24.6, div: 'Gomti Nagar', feeder: 'Feeder-8',  phaseR: 32, phaseY: 27, phaseB: 23, alerts: 4 },
  { dt: 'DT-0445', cap: 200, load: 94, meters: 205, input: 112400, billed: 82100,  loss: 26.9, div: 'Gomti Nagar', feeder: 'Feeder-14', phaseR: 42, phaseY: 28, phaseB: 24, alerts: 6 },
]
