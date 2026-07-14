// Forensic-grade real MRI data for Meter #1849966, transcribed from the original
// prototype dump (61 days of half-hour load survey + tamper events by year).
// Used by MeterDetailPage to render the real-data forensic card pixel-for-pixel.

export interface RealMeterDailyPoint {
  date: string
  kwh: number
  kvah: number
  pf: number | null
  volt_min: number | null
  volt_max: number | null
  zero_pct: number
}

export interface RealMeterYearStat {
  earth: number
  pf: number
  neutral: number
}

export interface RealMeterTamperEvent {
  ts: string
  type: 'Earth Loading' | 'Neutral Disturbance' | 'Power Failure'
  occ: 'Occurrence' | 'Restoration'
  kwh_at: string | null
  i: string | null
  v: string | null
  pf: string | null
}

export interface RealMeterData {
  summary: {
    meter_no: string
    meter_make: string
    category: string
    year_mfg: string
    current_rating: string
    cumul_kwh: string
    cumul_kvah: string
    tamper_count: string
    rtc_date: string
    visit_date: string
    mri_date: string
  }
  daily: RealMeterDailyPoint[]
  // Full lifetime tamper-event log (real MRI dump) — 300 events for #1849966.
  tampers?: RealMeterTamperEvent[]
  year_stats: Record<string, RealMeterYearStat>
  // Last tamper-inspection reading with a real V/I pair on record — seeds the
  // Meter analysis tab's instantaneous-parameter snapshot so phase magnitudes
  // match the actual forensic dump instead of the purely-synthetic fallback.
  last_tamper_vi?: { v: number; i: number }
}

export const REAL_METER_DATA: Record<string, RealMeterData> = {
  "1849966": {
    "summary": {
      "meter_no": "1849966",
      "meter_make": "CAPITAL POWER SYSTEMS LIMITED",
      "category": "C3",
      "year_mfg": "2017",
      "current_rating": "10-60 A",
      "cumul_kwh": "47293.68",
      "cumul_kvah": "64262.28",
      "tamper_count": "448",
      "rtc_date": "01-Mar-2026 13:42:15",
      "visit_date": "2026-03-01 19:15:00",
      "mri_date": "2026-03-01 19:15:00"
    },
    "daily": [
      {
        "date": "01-Jan-2026",
        "kwh": 11.71,
        "kvah": 12.85,
        "pf": 0.911,
        "volt_min": 224,
        "volt_max": 252,
        "zero_pct": 19.1
      },
      {
        "date": "02-Jan-2026",
        "kwh": 12.3,
        "kvah": 13.62,
        "pf": 0.903,
        "volt_min": 224,
        "volt_max": 252,
        "zero_pct": 20.8
      },
      {
        "date": "03-Jan-2026",
        "kwh": 7.71,
        "kvah": 8.86,
        "pf": 0.87,
        "volt_min": 232,
        "volt_max": 252,
        "zero_pct": 14.3
      },
      {
        "date": "04-Jan-2026",
        "kwh": 11.67,
        "kvah": 12.99,
        "pf": 0.898,
        "volt_min": 220,
        "volt_max": 250,
        "zero_pct": 17
      },
      {
        "date": "05-Jan-2026",
        "kwh": 12.72,
        "kvah": 14.27,
        "pf": 0.891,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 16.7
      },
      {
        "date": "06-Jan-2026",
        "kwh": 12.43,
        "kvah": 13.71,
        "pf": 0.907,
        "volt_min": 222,
        "volt_max": 252,
        "zero_pct": 20.8
      },
      {
        "date": "07-Jan-2026",
        "kwh": 15.74,
        "kvah": 17.76,
        "pf": 0.886,
        "volt_min": 222,
        "volt_max": 252,
        "zero_pct": 20.8
      },
      {
        "date": "08-Jan-2026",
        "kwh": 14.71,
        "kvah": 16.5,
        "pf": 0.892,
        "volt_min": 224,
        "volt_max": 252,
        "zero_pct": 18.8
      },
      {
        "date": "09-Jan-2026",
        "kwh": 12.59,
        "kvah": 13.92,
        "pf": 0.904,
        "volt_min": 222,
        "volt_max": 252,
        "zero_pct": 16.7
      },
      {
        "date": "10-Jan-2026",
        "kwh": 13.66,
        "kvah": 15.37,
        "pf": 0.889,
        "volt_min": 224,
        "volt_max": 252,
        "zero_pct": 18.8
      },
      {
        "date": "11-Jan-2026",
        "kwh": 13.3,
        "kvah": 15.07,
        "pf": 0.883,
        "volt_min": 218,
        "volt_max": 252,
        "zero_pct": 14.6
      },
      {
        "date": "12-Jan-2026",
        "kwh": 14.01,
        "kvah": 16.11,
        "pf": 0.87,
        "volt_min": 224,
        "volt_max": 252,
        "zero_pct": 18.8
      },
      {
        "date": "13-Jan-2026",
        "kwh": 11.82,
        "kvah": 13.45,
        "pf": 0.879,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 22.9
      },
      {
        "date": "14-Jan-2026",
        "kwh": 12.26,
        "kvah": 13.87,
        "pf": 0.884,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 18.8
      },
      {
        "date": "15-Jan-2026",
        "kwh": 11.79,
        "kvah": 13.46,
        "pf": 0.876,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 16.7
      },
      {
        "date": "16-Jan-2026",
        "kwh": 12.62,
        "kvah": 14.14,
        "pf": 0.893,
        "volt_min": 222,
        "volt_max": 250,
        "zero_pct": 16.7
      },
      {
        "date": "17-Jan-2026",
        "kwh": 15.45,
        "kvah": 17.34,
        "pf": 0.891,
        "volt_min": 204,
        "volt_max": 250,
        "zero_pct": 16.7
      },
      {
        "date": "18-Jan-2026",
        "kwh": 10.45,
        "kvah": 11.91,
        "pf": 0.877,
        "volt_min": 222,
        "volt_max": 250,
        "zero_pct": 31.2
      },
      {
        "date": "19-Jan-2026",
        "kwh": 12.56,
        "kvah": 13.91,
        "pf": 0.903,
        "volt_min": 114,
        "volt_max": 252,
        "zero_pct": 20.8
      },
      {
        "date": "20-Jan-2026",
        "kwh": 8.67,
        "kvah": 9.55,
        "pf": 0.908,
        "volt_min": 228,
        "volt_max": 250,
        "zero_pct": 33.3
      },
      {
        "date": "21-Jan-2026",
        "kwh": 13,
        "kvah": 14.52,
        "pf": 0.895,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 20.8
      },
      {
        "date": "22-Jan-2026",
        "kwh": 11.51,
        "kvah": 13,
        "pf": 0.885,
        "volt_min": 226,
        "volt_max": 250,
        "zero_pct": 18.8
      },
      {
        "date": "23-Jan-2026",
        "kwh": 12,
        "kvah": 13.53,
        "pf": 0.887,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 25
      },
      {
        "date": "24-Jan-2026",
        "kwh": 12.78,
        "kvah": 13.97,
        "pf": 0.915,
        "volt_min": 226,
        "volt_max": 250,
        "zero_pct": 16.7
      },
      {
        "date": "25-Jan-2026",
        "kwh": 15.07,
        "kvah": 17.06,
        "pf": 0.883,
        "volt_min": 224,
        "volt_max": 246,
        "zero_pct": 12.5
      },
      {
        "date": "26-Jan-2026",
        "kwh": 17.81,
        "kvah": 19.76,
        "pf": 0.901,
        "volt_min": 226,
        "volt_max": 248,
        "zero_pct": 0
      },
      {
        "date": "27-Jan-2026",
        "kwh": 13.15,
        "kvah": 15,
        "pf": 0.877,
        "volt_min": 224,
        "volt_max": 248,
        "zero_pct": 16.7
      },
      {
        "date": "28-Jan-2026",
        "kwh": 7.76,
        "kvah": 8.46,
        "pf": 0.917,
        "volt_min": 222,
        "volt_max": 252,
        "zero_pct": 37.5
      },
      {
        "date": "29-Jan-2026",
        "kwh": 16.16,
        "kvah": 17.94,
        "pf": 0.901,
        "volt_min": 222,
        "volt_max": 248,
        "zero_pct": 20.8
      },
      {
        "date": "30-Jan-2026",
        "kwh": 6.25,
        "kvah": 6.58,
        "pf": 0.95,
        "volt_min": 220,
        "volt_max": 246,
        "zero_pct": 31.2
      },
      {
        "date": "31-Jan-2026",
        "kwh": 15.84,
        "kvah": 17.62,
        "pf": 0.899,
        "volt_min": 224,
        "volt_max": 248,
        "zero_pct": 14.6
      },
      {
        "date": "01-Feb-2026",
        "kwh": 12.02,
        "kvah": 13.57,
        "pf": 0.886,
        "volt_min": 226,
        "volt_max": 248,
        "zero_pct": 16.7
      },
      {
        "date": "02-Feb-2026",
        "kwh": 16.97,
        "kvah": 19.21,
        "pf": 0.883,
        "volt_min": 228,
        "volt_max": 248,
        "zero_pct": 16.7
      },
      {
        "date": "03-Feb-2026",
        "kwh": 12.99,
        "kvah": 14.62,
        "pf": 0.889,
        "volt_min": 226,
        "volt_max": 248,
        "zero_pct": 31.2
      },
      {
        "date": "04-Feb-2026",
        "kwh": 12.81,
        "kvah": 14.36,
        "pf": 0.892,
        "volt_min": 224,
        "volt_max": 250,
        "zero_pct": 16.7
      },
      {
        "date": "05-Feb-2026",
        "kwh": 16.05,
        "kvah": 18.22,
        "pf": 0.881,
        "volt_min": 226,
        "volt_max": 248,
        "zero_pct": 18.8
      },
      {
        "date": "06-Feb-2026",
        "kwh": 16.31,
        "kvah": 18.4,
        "pf": 0.886,
        "volt_min": 224,
        "volt_max": 248,
        "zero_pct": 14.6
      },
      {
        "date": "07-Feb-2026",
        "kwh": 16.01,
        "kvah": 18.24,
        "pf": 0.878,
        "volt_min": 228,
        "volt_max": 250,
        "zero_pct": 20.8
      },
      {
        "date": "08-Feb-2026",
        "kwh": 16.69,
        "kvah": 18.98,
        "pf": 0.879,
        "volt_min": 226,
        "volt_max": 248,
        "zero_pct": 12.5
      },
      {
        "date": "09-Feb-2026",
        "kwh": 16.18,
        "kvah": 18.64,
        "pf": 0.868,
        "volt_min": 208,
        "volt_max": 246,
        "zero_pct": 14.6
      },
      {
        "date": "10-Feb-2026",
        "kwh": 13.49,
        "kvah": 14.92,
        "pf": 0.904,
        "volt_min": 222,
        "volt_max": 246,
        "zero_pct": 20.8
      },
      {
        "date": "11-Feb-2026",
        "kwh": 18.42,
        "kvah": 21.09,
        "pf": 0.873,
        "volt_min": 224,
        "volt_max": 248,
        "zero_pct": 16.7
      },
      {
        "date": "12-Feb-2026",
        "kwh": 18.61,
        "kvah": 21.05,
        "pf": 0.884,
        "volt_min": 224,
        "volt_max": 246,
        "zero_pct": 12.5
      },
      {
        "date": "13-Feb-2026",
        "kwh": 15.75,
        "kvah": 17.85,
        "pf": 0.882,
        "volt_min": 226,
        "volt_max": 246,
        "zero_pct": 14.6
      },
      {
        "date": "14-Feb-2026",
        "kwh": 14.44,
        "kvah": 16.1,
        "pf": 0.897,
        "volt_min": 224,
        "volt_max": 246,
        "zero_pct": 18.8
      },
      {
        "date": "15-Feb-2026",
        "kwh": 20.1,
        "kvah": 22.79,
        "pf": 0.882,
        "volt_min": 228,
        "volt_max": 244,
        "zero_pct": 6.2
      },
      {
        "date": "16-Feb-2026",
        "kwh": 15.43,
        "kvah": 17.48,
        "pf": 0.883,
        "volt_min": 228,
        "volt_max": 246,
        "zero_pct": 18.8
      },
      {
        "date": "17-Feb-2026",
        "kwh": 12.43,
        "kvah": 13.05,
        "pf": 0.952,
        "volt_min": 228,
        "volt_max": 246,
        "zero_pct": 16.7
      },
      {
        "date": "18-Feb-2026",
        "kwh": 13.38,
        "kvah": 13.66,
        "pf": 0.98,
        "volt_min": 226,
        "volt_max": 246,
        "zero_pct": 4.2
      },
      {
        "date": "19-Feb-2026",
        "kwh": 12.33,
        "kvah": 13.03,
        "pf": 0.946,
        "volt_min": 228,
        "volt_max": 244,
        "zero_pct": 10.4
      },
      {
        "date": "20-Feb-2026",
        "kwh": 16.23,
        "kvah": 18.04,
        "pf": 0.9,
        "volt_min": 224,
        "volt_max": 244,
        "zero_pct": 14.6
      },
      {
        "date": "21-Feb-2026",
        "kwh": 13.46,
        "kvah": 14.16,
        "pf": 0.951,
        "volt_min": 228,
        "volt_max": 244,
        "zero_pct": 10.4
      },
      {
        "date": "22-Feb-2026",
        "kwh": 13.02,
        "kvah": 14.38,
        "pf": 0.905,
        "volt_min": 226,
        "volt_max": 244,
        "zero_pct": 18.8
      },
      {
        "date": "23-Feb-2026",
        "kwh": 16.25,
        "kvah": 18.27,
        "pf": 0.889,
        "volt_min": 226,
        "volt_max": 244,
        "zero_pct": 10.4
      },
      {
        "date": "24-Feb-2026",
        "kwh": 18.53,
        "kvah": 20.88,
        "pf": 0.887,
        "volt_min": 226,
        "volt_max": 242,
        "zero_pct": 12.5
      },
      {
        "date": "25-Feb-2026",
        "kwh": 14.38,
        "kvah": 16.18,
        "pf": 0.889,
        "volt_min": 226,
        "volt_max": 242,
        "zero_pct": 14.6
      },
      {
        "date": "26-Feb-2026",
        "kwh": 16.38,
        "kvah": 18.47,
        "pf": 0.887,
        "volt_min": 222,
        "volt_max": 242,
        "zero_pct": 12.5
      },
      {
        "date": "27-Feb-2026",
        "kwh": 18.68,
        "kvah": 20.81,
        "pf": 0.898,
        "volt_min": 224,
        "volt_max": 244,
        "zero_pct": 10.4
      },
      {
        "date": "28-Feb-2026",
        "kwh": 16.86,
        "kvah": 19.33,
        "pf": 0.872,
        "volt_min": 232,
        "volt_max": 246,
        "zero_pct": 12.5
      },
      {
        "date": "01-Mar-2026",
        "kwh": 6.18,
        "kvah": 6.9,
        "pf": 0.896,
        "volt_min": 230,
        "volt_max": 246,
        "zero_pct": 58.3
      },
      {
        "date": "02-Mar-2026",
        "kwh": 0,
        "kvah": 0,
        "pf": null,
        "volt_min": null,
        "volt_max": null,
        "zero_pct": 100
      }
    ],
    "tampers": [
      { "ts": "2022-03-13T14:40:34", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16263.86", "i": "8.32", "v": "220", "pf": "1" },
      { "ts": "2022-03-13T14:56:39", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16264.48", "i": "17.12", "v": "226", "pf": "0.84" },
      { "ts": "2022-03-13T14:58:14", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16264.57", "i": "8.85", "v": "224", "pf": "1" },
      { "ts": "2022-03-13T15:06:39", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16265.08", "i": "16.61", "v": "228", "pf": "0.7" },
      { "ts": "2022-03-13T15:10:04", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16265.23", "i": "7.22", "v": "224", "pf": "1" },
      { "ts": "2022-03-13T15:17:39", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16265.63", "i": "16.05", "v": "230", "pf": "0.8" },
      { "ts": "2022-03-13T15:19:34", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16265.72", "i": "7.24", "v": "226", "pf": "1" },
      { "ts": "2022-03-13T15:26:34", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16266.08", "i": "13.46", "v": "232", "pf": "0.99" },
      { "ts": "2022-03-13T15:28:54", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16266.19", "i": "7.07", "v": "228", "pf": "1" },
      { "ts": "2022-03-13T16:31:17", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16266.44", "i": "21.02", "v": "224", "pf": "0.91" },
      { "ts": "2022-03-19T14:31:10", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16391.58", "i": "10.35", "v": "214", "pf": "1" },
      { "ts": "2022-03-19T14:37:20", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16392.02", "i": "18.67", "v": "214", "pf": "0.87" },
      { "ts": "2022-03-19T14:46:25", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16392.6", "i": "10.48", "v": "214", "pf": "1" },
      { "ts": "2022-03-19T14:50:40", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16392.89", "i": "18.37", "v": "214", "pf": "0.88" },
      { "ts": "2022-03-19T15:38:25", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16395.62", "i": "8.7", "v": "218", "pf": "1" },
      { "ts": "2022-03-19T15:51:30", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16396.45", "i": "26.94", "v": "212", "pf": "0.78" },
      { "ts": "2022-03-19T16:04:05", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "16397.24", "i": "7.58", "v": "220", "pf": "1" },
      { "ts": "2022-03-19T16:09:00", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "16397.46", "i": "14.41", "v": "220", "pf": "0.82" },
      { "ts": "2022-06-07T23:56:54", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "18660.44", "i": "7.63", "v": "208", "pf": "1" },
      { "ts": "2022-06-08T00:06:24", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "18660.9", "i": "7.05", "v": "218", "pf": "0.95" },
      { "ts": "2022-06-16T16:40:37", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "18925.29", "i": "10.48", "v": "208", "pf": "1" },
      { "ts": "2022-06-16T16:46:07", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "18925.66", "i": "16.91", "v": "212", "pf": "0.79" },
      { "ts": "2022-06-16T16:58:42", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "18926.45", "i": "10.23", "v": "206", "pf": "1" },
      { "ts": "2022-06-16T17:13:22", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "18927.49", "i": "11.21", "v": "208", "pf": "0.98" },
      { "ts": "2022-06-17T11:51:35", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "18957.45", "i": "9.83", "v": "198", "pf": "1" },
      { "ts": "2022-06-17T12:08:35", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "18958.59", "i": "15.1", "v": "198", "pf": "0.82" },
      { "ts": "2022-06-17T13:12:15", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "18961.17", "i": "9.73", "v": "202", "pf": "1" },
      { "ts": "2022-06-17T13:18:10", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "18961.54", "i": "15.51", "v": "204", "pf": "0.81" },
      { "ts": "2022-06-17T13:27:25", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "18962.01", "i": "10.24", "v": "202", "pf": "1" },
      { "ts": "2022-06-17T13:35:35", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "18962.57", "i": "16.2", "v": "200", "pf": "0.84" },
      { "ts": "2022-06-18T13:38:31", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19002.02", "i": "9.61", "v": "204", "pf": "1" },
      { "ts": "2022-06-18T13:46:41", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19002.54", "i": "15.5", "v": "204", "pf": "0.81" },
      { "ts": "2022-06-18T13:50:41", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19002.71", "i": "9.57", "v": "206", "pf": "1" },
      { "ts": "2022-06-18T14:00:01", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19003.31", "i": "17.11", "v": "204", "pf": "0.89" },
      { "ts": "2022-06-18T15:50:21", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19004.49", "i": "19.16", "v": "200", "pf": "1" },
      { "ts": "2022-06-18T15:55:31", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19005.02", "i": "10.82", "v": "214", "pf": "0.98" },
      { "ts": "2022-06-18T17:13:36", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19006.68", "i": "10.38", "v": "206", "pf": "1" },
      { "ts": "2022-06-18T17:21:26", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19007.2", "i": "11.58", "v": "198", "pf": "0.98" },
      { "ts": "2022-06-18T19:42:25", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19012.04", "i": "4.92", "v": "198", "pf": "1" },
      { "ts": "2022-06-18T19:47:25", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19012.17", "i": "5.04", "v": "196", "pf": "0.99" },
      { "ts": "2022-06-19T16:31:26", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19039.75", "i": "10.59", "v": "208", "pf": "1" },
      { "ts": "2022-06-19T16:55:21", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19041.47", "i": "9.72", "v": "206", "pf": "0.99" },
      { "ts": "2022-06-20T12:04:20", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19063.6", "i": "10.36", "v": "200", "pf": "1" },
      { "ts": "2022-06-20T12:16:55", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19064.48", "i": "15.27", "v": "200", "pf": "0.82" },
      { "ts": "2022-06-20T16:30:04", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19072.19", "i": "9.47", "v": "218", "pf": "1" },
      { "ts": "2022-06-20T16:34:19", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19072.43", "i": "15.93", "v": "214", "pf": "0.79" },
      { "ts": "2022-06-20T16:43:04", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19072.81", "i": "8.98", "v": "216", "pf": "0.99" },
      { "ts": "2022-06-20T16:59:39", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19073.38", "i": "16.67", "v": "212", "pf": "0.88" },
      { "ts": "2022-06-20T17:00:49", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19073.43", "i": "8.43", "v": "216", "pf": "0.99" },
      { "ts": "2022-06-20T17:12:49", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19073.84", "i": "16.48", "v": "212", "pf": "0.88" },
      { "ts": "2022-06-20T17:13:44", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19073.88", "i": "8.16", "v": "216", "pf": "0.99" },
      { "ts": "2022-06-20T17:28:54", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19074.46", "i": "18.65", "v": "206", "pf": "0.91" },
      { "ts": "2022-06-20T17:34:14", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19074.75", "i": "11.02", "v": "210", "pf": "0.99" },
      { "ts": "2022-06-20T17:41:44", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19075.04", "i": "11.34", "v": "212", "pf": "0.99" },
      { "ts": "2022-06-21T10:43:43", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19097.58", "i": "13.1", "v": "206", "pf": "0.99" },
      { "ts": "2022-06-21T10:50:58", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19097.99", "i": "27.07", "v": "190", "pf": "0.84" },
      { "ts": "2022-06-21T10:54:43", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19098.25", "i": "10.52", "v": "202", "pf": "0.99" },
      { "ts": "2022-06-21T11:00:13", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19098.48", "i": "17.45", "v": "198", "pf": "0.88" },
      { "ts": "2022-06-21T11:01:38", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19098.55", "i": "10.55", "v": "202", "pf": "0.99" },
      { "ts": "2022-06-21T11:25:58", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19099.41", "i": "18.22", "v": "202", "pf": "0.91" },
      { "ts": "2022-06-21T11:27:23", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19099.48", "i": "9.14", "v": "208", "pf": "0.99" },
      { "ts": "2022-06-21T11:33:43", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19099.72", "i": "17.39", "v": "202", "pf": "0.87" },
      { "ts": "2022-06-21T11:36:58", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19099.89", "i": "10.22", "v": "206", "pf": "0.99" },
      { "ts": "2022-06-21T11:43:28", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19100.33", "i": "15.15", "v": "202", "pf": "0.85" },
      { "ts": "2022-06-21T11:43:43", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19100.34", "i": "10.52", "v": "204", "pf": "0.99" },
      { "ts": "2022-06-21T11:52:58", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19100.68", "i": "14.56", "v": "202", "pf": "0.84" },
      { "ts": "2022-06-21T11:53:58", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19100.72", "i": "10.33", "v": "206", "pf": "0.99" },
      { "ts": "2022-06-21T12:11:58", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19101.68", "i": "29.13", "v": "194", "pf": "0.88" },
      { "ts": "2022-06-21T12:19:58", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19102.25", "i": "15.27", "v": "200", "pf": "0.99" },
      { "ts": "2022-06-21T12:24:38", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19102.52", "i": "20.83", "v": "200", "pf": "0.93" },
      { "ts": "2022-06-21T12:39:08", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19103.59", "i": "15.12", "v": "202", "pf": "0.99" },
      { "ts": "2022-06-21T12:52:48", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19104.08", "i": "17.09", "v": "198", "pf": "0.92" },
      { "ts": "2022-06-21T12:54:13", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19104.14", "i": "9.04", "v": "202", "pf": "0.99" },
      { "ts": "2022-06-21T13:02:33", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19104.43", "i": "16.61", "v": "198", "pf": "0.87" },
      { "ts": "2022-06-21T13:02:48", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19104.44", "i": "9.7", "v": "202", "pf": "0.99" },
      { "ts": "2022-06-21T13:10:23", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19104.73", "i": "17.68", "v": "200", "pf": "0.92" },
      { "ts": "2022-06-21T13:11:53", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19104.8", "i": "9", "v": "204", "pf": "0.99" },
      { "ts": "2022-06-21T13:25:38", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19105.25", "i": "16.42", "v": "204", "pf": "0.9" },
      { "ts": "2022-06-21T13:27:23", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19105.34", "i": "8.2", "v": "210", "pf": "0.99" },
      { "ts": "2022-06-21T13:56:03", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19106.36", "i": "26.83", "v": "208", "pf": "0.8" },
      { "ts": "2022-06-21T13:59:48", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19106.6", "i": "11.22", "v": "218", "pf": "0.99" },
      { "ts": "2022-06-21T14:08:03", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19106.97", "i": "18.09", "v": "214", "pf": "0.85" },
      { "ts": "2022-06-21T14:13:33", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19107.27", "i": "13.92", "v": "214", "pf": "0.95" },
      { "ts": "2022-06-21T14:59:50", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19107.8", "i": "22.51", "v": "216", "pf": "0.88" },
      { "ts": "2022-06-21T16:18:12", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19108.34", "i": "15.39", "v": "230", "pf": "0.98" },
      { "ts": "2022-06-21T16:18:22", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19108.36", "i": "14.67", "v": "226", "pf": "1" },
      { "ts": "2022-06-21T16:27:47", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19109.65", "i": "22.86", "v": "224", "pf": "0.87" },
      { "ts": "2022-06-21T16:28:02", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19109.67", "i": "22.53", "v": "222", "pf": "0.88" },
      { "ts": "2022-06-21T16:30:17", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19109.83", "i": "14.02", "v": "216", "pf": "1" },
      { "ts": "2022-06-21T16:32:07", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19110.02", "i": "14", "v": "224", "pf": "1" },
      { "ts": "2022-06-21T16:58:52", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19112.27", "i": "11", "v": "228", "pf": "0.97" },
      { "ts": "2022-06-21T17:00:17", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19112.33", "i": "10.97", "v": "228", "pf": "0.97" },
      { "ts": "2022-06-22T11:04:00", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19134.97", "i": "12.08", "v": "214", "pf": "0.99" },
      { "ts": "2022-06-22T11:33:30", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19136.42", "i": "22.39", "v": "200", "pf": "0.95" },
      { "ts": "2022-06-22T11:35:25", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19136.53", "i": "8.78", "v": "208", "pf": "0.99" },
      { "ts": "2022-06-22T11:47:40", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19136.94", "i": "16.93", "v": "204", "pf": "0.87" },
      { "ts": "2022-06-22T11:51:25", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19137.18", "i": "19", "v": "194", "pf": "1" },
      { "ts": "2022-06-22T12:00:35", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19137.59", "i": "17.35", "v": "204", "pf": "0.91" },
      { "ts": "2022-06-22T12:13:40", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19138.53", "i": "10.61", "v": "208", "pf": "0.99" },
      { "ts": "2022-06-22T12:49:09", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19139.52", "i": "10.1", "v": "204", "pf": "1" },
      { "ts": "2022-06-22T12:53:19", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19139.74", "i": "9.52", "v": "206", "pf": "0.99" },
      { "ts": "2022-06-22T13:08:49", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19140.26", "i": "16.96", "v": "208", "pf": "0.86" },
      { "ts": "2022-06-22T13:11:49", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19140.41", "i": "9.73", "v": "212", "pf": "0.99" },
      { "ts": "2022-06-22T15:30:38", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19143.07", "i": "11.18", "v": "214", "pf": "1" },
      { "ts": "2022-06-22T15:35:18", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19143.4", "i": "19.04", "v": "212", "pf": "0.83" },
      { "ts": "2022-06-22T15:35:18", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19143.4", "i": "19.04", "v": "212", "pf": "0.83" },
      { "ts": "2022-06-22T15:38:28", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19143.59", "i": "20.85", "v": "198", "pf": "1" },
      { "ts": "2022-06-22T15:38:33", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19143.6", "i": "20.28", "v": "202", "pf": "1" },
      { "ts": "2022-06-22T17:42:22", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19144.98", "i": "13.76", "v": "204", "pf": "0.98" },
      { "ts": "2022-06-22T17:46:57", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19145.25", "i": "14.66", "v": "196", "pf": "0.98" },
      { "ts": "2022-06-22T18:17:02", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19146.63", "i": "13.84", "v": "192", "pf": "1" },
      { "ts": "2022-06-22T18:17:02", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19146.63", "i": "13.84", "v": "192", "pf": "1" },
      { "ts": "2022-06-22T18:26:17", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19147.47", "i": "25.29", "v": "188", "pf": "0.93" },
      { "ts": "2022-06-22T18:27:37", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19147.57", "i": "25.4", "v": "188", "pf": "0.93" },
      { "ts": "2022-06-22T18:28:27", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19147.63", "i": "18.99", "v": "190", "pf": "0.99" },
      { "ts": "2022-06-22T18:32:22", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19147.86", "i": "19.83", "v": "188", "pf": "0.99" },
      { "ts": "2022-06-23T09:02:08", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19169.62", "i": "13.32", "v": "214", "pf": "0.99" },
      { "ts": "2022-06-23T09:07:38", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19169.9", "i": "14.79", "v": "212", "pf": "1" },
      { "ts": "2022-06-23T09:14:13", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19170.24", "i": "9.07", "v": "216", "pf": "0.99" },
      { "ts": "2022-06-23T09:30:08", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19170.78", "i": "18.17", "v": "212", "pf": "0.89" },
      { "ts": "2022-06-23T09:41:13", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19171.36", "i": "9.95", "v": "224", "pf": "0.99" },
      { "ts": "2022-06-23T09:49:13", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19171.65", "i": "10.42", "v": "218", "pf": "0.98" },
      { "ts": "2022-06-23T11:00:03", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19172.13", "i": "24.36", "v": "186", "pf": "1" },
      { "ts": "2022-06-23T11:04:33", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19172.53", "i": "20.55", "v": "200", "pf": "0.88" },
      { "ts": "2022-06-23T11:30:18", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19174.16", "i": "19.88", "v": "196", "pf": "1" },
      { "ts": "2022-06-23T11:30:18", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19174.16", "i": "19.88", "v": "196", "pf": "1" },
      { "ts": "2022-06-23T11:35:13", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19174.75", "i": "26.06", "v": "196", "pf": "0.95" },
      { "ts": "2022-06-23T11:37:43", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19174.93", "i": "22.67", "v": "200", "pf": "0.92" },
      { "ts": "2022-06-23T11:42:33", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19175.3", "i": "16.84", "v": "200", "pf": "0.99" },
      { "ts": "2022-06-23T11:51:53", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19175.86", "i": "24.2", "v": "194", "pf": "0.95" },
      { "ts": "2022-06-23T11:53:58", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19176.01", "i": "16.45", "v": "196", "pf": "0.99" },
      { "ts": "2022-06-23T12:00:13", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19176.34", "i": "18.84", "v": "186", "pf": "1" },
      { "ts": "2022-06-23T12:17:28", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19177.83", "i": "10.65", "v": "200", "pf": "0.99" },
      { "ts": "2022-06-23T12:42:18", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19178.71", "i": "16.68", "v": "198", "pf": "0.91" },
      { "ts": "2022-06-23T12:44:03", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19178.8", "i": "8.62", "v": "202", "pf": "0.99" },
      { "ts": "2022-06-23T12:58:08", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19179.42", "i": "15.79", "v": "200", "pf": "0.87" },
      { "ts": "2022-06-23T12:58:18", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19179.43", "i": "9.3", "v": "204", "pf": "0.99" },
      { "ts": "2022-06-23T13:00:08", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "19179.5", "i": "17.09", "v": "192", "pf": "1" },
      { "ts": "2022-06-23T13:04:13", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19179.87", "i": "15.95", "v": "196", "pf": "0.86" },
      { "ts": "2022-06-23T13:04:13", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "19179.87", "i": "15.95", "v": "196", "pf": "0.86" },
      { "ts": "2022-06-23T13:08:33", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19180.06", "i": "9.33", "v": "198", "pf": "0.99" },
      { "ts": "2022-06-23T13:15:23", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19180.53", "i": "15.89", "v": "194", "pf": "0.87" },
      { "ts": "2022-07-03T16:18:17", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "19517.39", "i": "10.73", "v": "220", "pf": "0.99" },
      { "ts": "2022-07-03T16:22:27", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "19517.54", "i": "10.75", "v": "216", "pf": "0.93" },
      { "ts": "2023-07-15T22:18:48", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "28655.63", "i": "1.05", "v": "238", "pf": "0.99" },
      { "ts": "2023-07-15T22:37:36", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28655.71", "i": "1.04", "v": "230", "pf": "1" },
      { "ts": "2023-07-15T22:45:16", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28655.75", "i": "1.03", "v": "238", "pf": "1" },
      { "ts": "2023-07-15T23:24:06", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28655.92", "i": "0.98", "v": "230", "pf": "1" },
      { "ts": "2023-07-15T23:52:26", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28656.11", "i": "0.96", "v": "240", "pf": "0.99" },
      { "ts": "2023-07-15T23:53:21", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28656.12", "i": "0.96", "v": "232", "pf": "1" },
      { "ts": "2023-07-16T02:09:17", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28657.06", "i": "0.87", "v": "248", "pf": "0.99" },
      { "ts": "2023-07-16T02:10:02", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28657.06", "i": "0.9", "v": "240", "pf": "1" },
      { "ts": "2023-07-16T02:41:45", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28657.26", "i": "0.88", "v": "250", "pf": "0.99" },
      { "ts": "2023-07-16T02:42:40", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28657.27", "i": "0.89", "v": "242", "pf": "1" },
      { "ts": "2023-07-16T03:36:59", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "28657.53", "i": "3.08", "v": "248", "pf": "0.82" },
      { "ts": "2023-07-16T03:36:59", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28657.53", "i": "3.08", "v": "248", "pf": "0.82" },
      { "ts": "2023-07-16T03:39:44", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "28657.55", "i": "0.94", "v": "240", "pf": "1" },
      { "ts": "2023-07-16T03:39:49", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28657.55", "i": "0.94", "v": "238", "pf": "1" },
      { "ts": "2023-07-16T04:16:39", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28657.8", "i": "0.88", "v": "252", "pf": "0.99" },
      { "ts": "2023-07-16T04:17:04", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28657.8", "i": "0.93", "v": "244", "pf": "1" },
      { "ts": "2023-07-16T06:16:04", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "28657.96", "i": "3.03", "v": "246", "pf": "0.82" },
      { "ts": "2023-07-16T06:16:04", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28657.96", "i": "3.03", "v": "246", "pf": "0.82" },
      { "ts": "2023-07-16T07:04:36", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "28658.23", "i": "1.16", "v": "222", "pf": "1" },
      { "ts": "2023-07-16T07:04:41", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "28658.23", "i": "1.16", "v": "220", "pf": "1" },
      { "ts": "2023-07-16T09:23:38", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "28658.86", "i": "17.81", "v": "240", "pf": "0.65" },
      { "ts": "2023-07-16T09:23:38", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "28658.86", "i": "17.81", "v": "240", "pf": "0.65" },
      { "ts": "2024-07-01T00:05:39", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "35353.39", "i": "1.19", "v": "238", "pf": "0.99" },
      { "ts": "2024-07-01T00:18:44", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35353.45", "i": "1.17", "v": "238", "pf": "1" },
      { "ts": "2024-07-01T01:13:59", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35353.91", "i": "1.17", "v": "240", "pf": "0.99" },
      { "ts": "2024-07-01T01:18:04", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35353.94", "i": "1.17", "v": "238", "pf": "1" },
      { "ts": "2024-07-01T01:40:49", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35354.13", "i": "1.17", "v": "242", "pf": "0.99" },
      { "ts": "2024-07-01T01:51:44", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35354.2", "i": "1.17", "v": "238", "pf": "1" },
      { "ts": "2024-07-01T02:29:38", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "35354.5", "i": "0.96", "v": "242", "pf": "0.99" },
      { "ts": "2024-07-01T02:29:38", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35354.5", "i": "0.96", "v": "242", "pf": "0.99" },
      { "ts": "2024-07-02T08:35:46", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "35383.5", "i": "1.04", "v": "262", "pf": "0.99" },
      { "ts": "2024-07-02T08:36:41", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35383.5", "i": "1.09", "v": "258", "pf": "1" },
      { "ts": "2024-07-02T09:01:26", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "35383.71", "i": "0.92", "v": "262", "pf": "0.99" },
      { "ts": "2024-07-02T09:01:26", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35383.71", "i": "0.92", "v": "262", "pf": "0.99" },
      { "ts": "2024-07-06T01:25:50", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "35487.14", "i": "1.67", "v": "238", "pf": "1" },
      { "ts": "2024-07-06T01:25:50", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35487.14", "i": "1.67", "v": "238", "pf": "1" },
      { "ts": "2024-07-06T03:49:41", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35488.61", "i": "3.15", "v": "244", "pf": "0.89" },
      { "ts": "2024-07-06T03:49:46", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "35488.61", "i": "3.14", "v": "244", "pf": "0.89" },
      { "ts": "2024-07-06T03:55:36", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "35488.66", "i": "1.56", "v": "234", "pf": "1" },
      { "ts": "2024-07-06T03:55:36", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35488.66", "i": "1.56", "v": "234", "pf": "1" },
      { "ts": "2024-07-06T03:59:36", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35488.74", "i": "1.71", "v": "248", "pf": "0.99" },
      { "ts": "2024-07-06T04:00:16", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "35488.74", "i": "1.76", "v": "226", "pf": "1" },
      { "ts": "2024-07-06T07:03:30", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "35488.92", "i": "2.58", "v": "250", "pf": "0.88" },
      { "ts": "2024-07-06T07:03:35", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "35488.92", "i": "2.57", "v": "250", "pf": "0.88" },
      { "ts": "2025-10-10T18:39:53", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "45230.32", "i": "1.81", "v": "242", "pf": "1" },
      { "ts": "2025-10-10T18:47:53", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "45230.39", "i": "1.12", "v": "238", "pf": "1" },
      { "ts": "2025-10-10T19:21:33", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "45230.72", "i": "6.7", "v": "246", "pf": "0.99" },
      { "ts": "2025-10-10T19:21:33", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "45230.72", "i": "6.7", "v": "246", "pf": "0.99" },
      { "ts": "2025-10-10T19:22:43", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "45230.75", "i": "3.53", "v": "78", "pf": "1" },
      { "ts": "2025-10-10T19:22:48", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "45230.75", "i": "1.16", "v": "240", "pf": "1" },
      { "ts": "2025-10-10T19:37:13", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "45230.88", "i": "1.62", "v": "246", "pf": "0.99" },
      { "ts": "2025-10-10T19:44:45", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "45230.9", "i": "2.88", "v": "242", "pf": "0.92" },
      { "ts": "2025-10-10T19:52:20", "type": "Earth Loading", "occ": "Occurrence", "kwh_at": "45230.96", "i": "3.96", "v": "114", "pf": "1" },
      { "ts": "2025-10-10T19:52:25", "type": "Neutral Disturbance", "occ": "Occurrence", "kwh_at": "45230.96", "i": "1.94", "v": "232", "pf": "1" },
      { "ts": "2025-10-10T20:13:25", "type": "Neutral Disturbance", "occ": "Restoration", "kwh_at": "45231.22", "i": "1.59", "v": "246", "pf": "1" },
      { "ts": "2025-10-11T01:18:51", "type": "Earth Loading", "occ": "Restoration", "kwh_at": "45233.13", "i": "1.44", "v": "252", "pf": "0.99" },
      { "ts": "2026-02-13T06:03:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-13T07:04:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-13T09:41:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-13T10:20:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-13T13:50:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-13T15:24:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T03:57:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T05:50:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T07:35:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T08:39:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T09:52:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T10:51:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T13:49:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-14T15:56:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-15T04:15:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-15T05:52:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-15T19:55:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-15T20:48:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-16T03:58:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-16T06:35:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-16T09:21:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-16T10:20:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-16T13:50:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-16T15:58:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-17T04:19:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-17T06:59:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-17T09:21:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-17T10:19:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-17T13:50:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-17T15:34:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-18T04:47:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-18T05:56:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-18T06:03:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-18T06:33:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-18T11:15:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-18T12:01:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-19T04:05:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-19T06:29:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-19T11:16:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-19T12:04:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-20T03:53:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-20T06:43:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-20T11:13:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-20T12:00:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-20T16:43:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-20T17:39:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-21T04:04:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-21T06:33:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-21T11:14:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-21T12:07:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-21T16:42:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-21T17:19:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T03:42:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T05:41:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T05:55:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T07:00:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T09:19:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T10:20:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T13:51:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-22T15:51:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-23T04:05:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-23T06:30:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-23T11:14:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-23T11:59:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-24T03:57:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-24T06:33:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-24T11:14:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-24T12:01:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-24T16:38:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-24T17:14:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-25T04:15:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-25T06:32:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-25T11:15:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-25T11:59:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-25T16:50:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-25T17:46:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-26T04:05:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-26T06:32:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-26T11:13:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-26T12:00:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-26T16:40:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-26T17:52:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-27T04:04:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-27T06:31:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-27T11:15:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-27T12:01:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-27T16:41:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-27T17:22:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-28T04:00:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-28T06:33:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-28T11:13:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-28T11:59:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-28T16:41:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-02-28T17:49:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-03-01T04:05:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-03-01T05:59:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-03-01T06:57:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-03-01T08:00:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-03-01T08:25:30", "type": "Power Failure", "occ": "Occurrence", "kwh_at": null, "i": null, "v": null, "pf": null },
      { "ts": "2026-03-01T10:55:30", "type": "Power Failure", "occ": "Restoration", "kwh_at": null, "i": null, "v": null, "pf": null }
    ],
    "year_stats": {
      "2022": {
        "earth": 80,
        "pf": 0,
        "neutral": 64
      },
      "2023": {
        "earth": 6,
        "pf": 0,
        "neutral": 16
      },
      "2024": {
        "earth": 8,
        "pf": 0,
        "neutral": 14
      },
      "2025": {
        "earth": 6,
        "pf": 0,
        "neutral": 6
      },
      "2026": {
        "earth": 0,
        "pf": 100,
        "neutral": 0
      }
    },
    "last_tamper_vi": { "v": 220, "i": 8.32 }
  },
}
