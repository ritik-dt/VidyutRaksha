import type { DiagnosticReport } from '../types'

interface DiagnosticMiniVizProps {
  report: DiagnosticReport
}

export function DiagnosticMiniViz({ report }: DiagnosticMiniVizProps) {
  switch (report.id) {
    case 'phase-missing':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="20" y="10" width="40" height="32" fill="var(--red)" rx="3" />
          <text x="40" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">
            R: 28A
          </text>
          <rect x="80" y="38" width="40" height="2" fill="var(--text-dim)" rx="3" />
          <text x="100" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">
            Y: 0A ⚠
          </text>
          <rect x="140" y="14" width="40" height="28" fill="var(--red)" rx="3" />
          <text x="160" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">
            B: 26A
          </text>
        </svg>
      )
    case 'cover-open':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <line x1="10" y1="25" x2="210" y2="25" stroke="var(--text-dim)" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="40" cy="25" r="6" fill="var(--green)" />
          <text x="40" y="44" textAnchor="middle" fontSize="8" fill="var(--text-dim)">
            Sealed
          </text>
          <circle cx="100" cy="25" r="7" fill="var(--red)" />
          <text x="100" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">
            ⚠
          </text>
          <text x="100" y="44" textAnchor="middle" fontSize="8" fill="var(--red)">
            OPENED
          </text>
          <circle cx="160" cy="25" r="6" fill="var(--amber)" />
          <text x="160" y="44" textAnchor="middle" fontSize="8" fill="var(--amber)">
            Re-opened
          </text>
        </svg>
      )
    case 'voltage-low':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="10" y="6" width="200" height="38" fill="var(--bg)" rx="3" />
          <line x1="10" y1="20" x2="210" y2="20" stroke="var(--red)" strokeWidth="0.8" strokeDasharray="2,2" />
          <text x="14" y="17" fontSize="7" fill="var(--red)">
            200V
          </text>
          <polyline
            points="10,12 30,14 50,18 70,28 90,34 110,32 130,38 150,30 170,26 190,28 210,22"
            fill="none"
            stroke="var(--red)"
            strokeWidth="1.6"
          />
          <text x="190" y="44" fontSize="8" fontWeight="700" fill="var(--red)" textAnchor="end">
            169V dropping
          </text>
        </svg>
      )
    case 'ht-imbalance':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <text x="40" y="14" textAnchor="middle" fontSize="9" fill="var(--text-mid)">
            R
          </text>
          <rect x="30" y="18" width="20" height="24" fill="var(--green)" rx="2" />
          <text x="40" y="40" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">
            10.8
          </text>
          <text x="100" y="14" textAnchor="middle" fontSize="9" fill="var(--text-mid)">
            Y
          </text>
          <rect x="90" y="14" width="20" height="28" fill="var(--amber)" rx="2" />
          <text x="100" y="40" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">
            11.4
          </text>
          <text x="160" y="14" textAnchor="middle" fontSize="9" fill="var(--text-mid)">
            B
          </text>
          <rect x="150" y="22" width="20" height="20" fill="var(--red)" rx="2" />
          <text x="160" y="40" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">
            10.2
          </text>
          <text x="195" y="28" fontSize="10" fontWeight="700" fill="var(--red)">
            5.8% Δ
          </text>
        </svg>
      )
    case 'consumption-comp':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <text x="14" y="13" fontSize="8" fill="var(--text-dim)">
            Peer avg
          </text>
          <rect x="10" y="16" width="14" height="26" fill="var(--green)" rx="2" />
          <rect x="28" y="12" width="14" height="30" fill="var(--green)" rx="2" />
          <rect x="46" y="16" width="14" height="26" fill="var(--green)" rx="2" />
          <rect x="64" y="10" width="14" height="32" fill="var(--green)" rx="2" />
          <text x="114" y="13" fontSize="8" fill="var(--text-dim)">
            This consumer
          </text>
          <rect x="110" y="24" width="14" height="18" fill="var(--red)" rx="2" />
          <rect x="128" y="26" width="14" height="16" fill="var(--red)" rx="2" />
          <rect x="146" y="28" width="14" height="14" fill="var(--red)" rx="2" />
          <rect x="164" y="30" width="14" height="12" fill="var(--red)" rx="2" />
          <text x="177" y="40" fontSize="8" fill="var(--red)" fontWeight="700">
            -60% ↓
          </text>
        </svg>
      )
    case 'excess-demand':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="62" y="24" width="96" height="16" rx="8" fill="rgba(34,197,94,0.85)" />
          <rect x="100" y="24" width="58" height="16" rx="8" fill="var(--red)" />
          <text x="110" y="20" fontSize="9" fill="var(--text-mid)" textAnchor="middle">
            Sanctioned 25kW
          </text>
          <text x="111" y="42" fontSize="9" fill="#fff" fontWeight="700" textAnchor="middle">
            38kW · +52% over
          </text>
        </svg>
      )
    case 'low-cons-high-md':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <line x1="10" y1="17" x2="190" y2="17" stroke="var(--text-mid)" strokeWidth="1" />
          <line x1="10" y1="35" x2="190" y2="35" stroke="var(--text-mid)" strokeWidth="1" />
          <circle cx="24" cy="32" r="3" fill="var(--green)" />
          <circle cx="60" cy="30" r="3" fill="var(--green)" />
          <circle cx="94" cy="18" r="3" fill="var(--text-mid)" />
          <circle cx="128" cy="14" r="3" fill="var(--text-mid)" />
          <circle cx="164" cy="31" r="3" fill="var(--green)" />
          <text x="36" y="20" fontSize="8" fill="var(--text-mid)">
            Low MD
          </text>
          <rect x="76" y="4" width="48" height="20" rx="4" fill="var(--red)" opacity=".12" />
          <text x="100" y="18" fontSize="10" fill="var(--red)" textAnchor="middle" fontWeight="700">
            SUSPICIOUS
          </text>
          <text x="195" y="42" fontSize="8" fill="var(--text-dim)" textAnchor="end">
            High kWh
          </text>
        </svg>
      )
    case 'voltage-no-current':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <line x1="18" y1="14" x2="188" y2="14" stroke="var(--green)" strokeWidth="1.6" />
          <line x1="18" y1="34" x2="188" y2="34" stroke="var(--red)" strokeWidth="1.6" strokeDasharray="3,3" />
          <text x="18" y="11" fontSize="8" fill="var(--green)">
            V (240V)
          </text>
          <text x="18" y="31" fontSize="8" fill="var(--red)">
            I (0A)
          </text>
          <text x="145" y="29" fontSize="8" fill="var(--red)" fontWeight="700">
            Bypassed
          </text>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="10" y="12" width="200" height="26" fill="rgba(124,58,237,0.08)" rx="6" />
          <text x="110" y="29" fontSize="10" fill="var(--text-mid)" textAnchor="middle">
            {report.title}
          </text>
        </svg>
      )
  }
}
