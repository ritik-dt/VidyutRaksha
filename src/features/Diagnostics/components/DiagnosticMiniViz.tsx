import type { DiagnosticReport } from '../types'

interface DiagnosticMiniVizProps {
  report: DiagnosticReport
}

/**
 * Exact JSX ports of the prototype's diagViz() SVGs (viewBox 0 0 220 50).
 * One branch per report id; falls back to a neutral placeholder.
 */
export function DiagnosticMiniViz({ report }: DiagnosticMiniVizProps) {
  switch (report.id) {
    case 'phase-missing':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="20" y="10" width="40" height="32" fill="var(--red)" rx="3" />
          <text x="40" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">R: 28A</text>
          <rect x="80" y="38" width="40" height="2" fill="var(--text-dim)" rx="3" />
          <text x="100" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">Y: 0A ⚠</text>
          <rect x="140" y="14" width="40" height="28" fill="var(--red)" rx="3" />
          <text x="160" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">B: 26A</text>
        </svg>
      )
    case 'cover-open':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <line x1="10" y1="25" x2="210" y2="25" stroke="var(--text-dim)" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="40" cy="25" r="6" fill="var(--green)" />
          <text x="40" y="44" textAnchor="middle" fontSize="8" fill="var(--text-dim)">Sealed</text>
          <circle cx="100" cy="25" r="7" fill="var(--red)" />
          <text x="100" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--red)">⚠</text>
          <text x="100" y="44" textAnchor="middle" fontSize="8" fill="var(--red)">OPENED</text>
          <circle cx="160" cy="25" r="6" fill="var(--amber)" />
          <text x="160" y="44" textAnchor="middle" fontSize="8" fill="var(--amber)">Re-opened</text>
        </svg>
      )
    case 'voltage-low':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="10" y="6" width="200" height="38" fill="var(--bg)" rx="3" />
          <line x1="10" y1="20" x2="210" y2="20" stroke="var(--red)" strokeWidth="0.8" strokeDasharray="2,2" />
          <text x="14" y="17" fontSize="7" fill="var(--red)">200V</text>
          <polyline
            points="10,12 30,14 50,18 70,28 90,34 110,32 130,38 150,30 170,26 190,28 210,22"
            fill="none"
            stroke="var(--red)"
            strokeWidth="1.6"
          />
          <text x="190" y="44" fontSize="8" fontWeight="700" fill="var(--red)" textAnchor="end">169V dropping ⬇</text>
        </svg>
      )
    case 'ht-imbalance':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <text x="40" y="14" textAnchor="middle" fontSize="9" fill="var(--text-mid)">R</text>
          <rect x="30" y="18" width="20" height="24" fill="var(--green)" rx="2" />
          <text x="40" y="40" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">10.8</text>
          <text x="100" y="14" textAnchor="middle" fontSize="9" fill="var(--text-mid)">Y</text>
          <rect x="90" y="14" width="20" height="28" fill="var(--amber)" rx="2" />
          <text x="100" y="40" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">11.4</text>
          <text x="160" y="14" textAnchor="middle" fontSize="9" fill="var(--text-mid)">B</text>
          <rect x="150" y="22" width="20" height="20" fill="var(--red)" rx="2" />
          <text x="160" y="40" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">10.2</text>
          <text x="195" y="28" fontSize="10" fontWeight="700" fill="var(--red)">5.8% Δ</text>
        </svg>
      )
    case 'consumption-comp':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <text x="14" y="13" fontSize="8" fill="var(--text-dim)">Peer avg</text>
          <rect x="10" y="16" width="14" height="26" fill="var(--green)" rx="2" />
          <rect x="30" y="13" width="14" height="29" fill="var(--green)" rx="2" />
          <rect x="50" y="14" width="14" height="28" fill="var(--green)" rx="2" />
          <rect x="70" y="12" width="14" height="30" fill="var(--green)" rx="2" />
          <text x="120" y="13" fontSize="8" fill="var(--red)">This consumer</text>
          <rect x="120" y="32" width="14" height="10" fill="var(--red)" rx="2" />
          <rect x="140" y="34" width="14" height="8" fill="var(--red)" rx="2" />
          <rect x="160" y="36" width="14" height="6" fill="var(--red)" rx="2" />
          <rect x="180" y="38" width="14" height="4" fill="var(--red)" rx="2" />
          <text x="207" y="42" textAnchor="end" fontSize="9" fontWeight="700" fill="var(--red)">-68% ⬇</text>
        </svg>
      )
    case 'excess-demand':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <rect x="20" y="22" width="180" height="14" fill="var(--bg)" rx="7" stroke="var(--border)" />
          <rect x="20" y="22" width="115" height="14" fill="var(--green)" rx="7" />
          <line x1="135" y1="18" x2="135" y2="40" stroke="var(--text)" strokeWidth="2" strokeDasharray="3,2" />
          <text x="135" y="14" textAnchor="middle" fontSize="8" fill="var(--text-mid)">Sanctioned 25kW</text>
          <rect x="135" y="22" width="40" height="14" fill="var(--red)" rx="0" />
          <text x="180" y="44" textAnchor="end" fontSize="9" fontWeight="700" fill="var(--red)">38kW · +52% over</text>
        </svg>
      )
    case 'low-cons-high-md':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <line x1="50" y1="8" x2="50" y2="46" stroke="var(--text-dim)" strokeWidth="1" />
          <line x1="50" y1="27" x2="200" y2="27" stroke="var(--text-dim)" strokeWidth="1" />
          <text x="42" y="14" textAnchor="end" fontSize="7" fill="var(--text-dim)">High MD</text>
          <text x="42" y="42" textAnchor="end" fontSize="7" fill="var(--text-dim)">Low MD</text>
          <text x="60" y="46" fontSize="7" fill="var(--text-dim)">Low kWh</text>
          <text x="190" y="46" fontSize="7" fill="var(--text-dim)">High kWh</text>
          <rect x="50" y="8" width="50" height="19" fill="var(--red)" opacity="0.15" />
          <text x="75" y="20" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--red)">SUSPICIOUS</text>
          <circle cx="65" cy="14" r="2.5" fill="var(--red)" />
          <circle cx="78" cy="18" r="2.5" fill="var(--red)" />
          <circle cx="92" cy="22" r="2.5" fill="var(--red)" />
          <circle cx="120" cy="14" r="2.5" fill="var(--text-dim)" />
          <circle cx="160" cy="18" r="2.5" fill="var(--text-dim)" />
          <circle cx="180" cy="32" r="2.5" fill="var(--green)" />
          <circle cx="65" cy="38" r="2.5" fill="var(--green)" />
          <circle cx="100" cy="36" r="2.5" fill="var(--green)" />
        </svg>
      )
    case 'voltage-no-current':
      return (
        <svg viewBox="0 0 220 50" className="h-[50px] w-full">
          <text x="14" y="13" fontSize="8" fill="var(--green)">V (240V)</text>
          <polyline
            points="10,18 40,18 70,18 100,18 130,18 160,18 190,18 210,18"
            fill="none"
            stroke="var(--green)"
            strokeWidth="1.6"
          />
          <text x="14" y="40" fontSize="8" fill="var(--red)">I (zero)</text>
          <polyline
            points="10,38 40,38 70,38 100,38 130,38 160,38 190,38 210,38"
            fill="none"
            stroke="var(--red)"
            strokeWidth="1.6"
            strokeDasharray="3,2"
          />
          <text x="207" y="32" fontSize="9" fontWeight="700" fill="var(--red)" textAnchor="end">⚠ Bypassed</text>
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
