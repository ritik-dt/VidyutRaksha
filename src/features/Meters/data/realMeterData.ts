// Forensic-grade real MRI data for Meter #1849966, transcribed from the original
// prototype dump (61 days of half-hour load survey + tamper events by year).
// Used by MeterDetailPage to render the real-data forensic card pixel-for-pixel.

export interface RealMeterDailyPoint {
  date: string
  kwh: number
  kvah: number
  pf: number
  volt_min: number
  volt_max: number
  zero_pct: number
}

export interface RealMeterYearStat {
  earth: number
  pf: number
  neutral: number
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
