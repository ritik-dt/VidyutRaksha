import { fmtINRFull, formatIndian } from '@/shared/utils/formatters'
import type { AssessmentBreakdown, AssessmentInputs } from '../types'

interface CalculationStepsCardProps {
  inputs: AssessmentInputs
  breakdown: AssessmentBreakdown
}

/** Number → Indian words (up to 99,99,99,99,99 — enough for lakhs/crores). */
function inIndianWords(n: number): string {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const twoDigits = (num: number): string => {
    if (num < 20) return ones[num]
    const t = Math.floor(num / 10)
    const o = num % 10
    return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`
  }
  const threeDigits = (num: number): string => {
    const h = Math.floor(num / 100)
    const r = num % 100
    if (h === 0) return twoDigits(r)
    return r === 0 ? `${ones[h]} hundred` : `${ones[h]} hundred ${twoDigits(r)}`
  }
  if (n === 0) return 'zero'
  const crore = Math.floor(n / 10000000)
  const lakh = Math.floor((n / 100000) % 100)
  const thousand = Math.floor((n / 1000) % 100)
  const rest = n % 1000
  const parts: string[] = []
  if (crore) parts.push(`${twoDigits(crore)} crore`)
  if (lakh) parts.push(`${twoDigits(lakh)} lakh`)
  if (thousand) parts.push(`${twoDigits(thousand)} thousand`)
  if (rest) parts.push(threeDigits(rest))
  return parts.join(' ')
}

/** Right card in grid-2 — step-by-step Section-135 calculation. */
export function CalculationStepsCard({ inputs, breakdown }: CalculationStepsCardProps) {
  const BOX =
    'mb-2 rounded-md p-2.5 font-mono text-[11px] leading-[1.6]'
  const DIM = { color: 'var(--text-dim)' }
  const HL = { color: 'var(--id-text, #0284c7)', fontWeight: 700 }

  return (
    <div className="card">
      <div className="card-title" style={{ color: 'var(--red)' }}>
        Assessment calculation (step-by-step)
      </div>

      <div>
        <div className={BOX} style={{ background: 'var(--bg)' }}>
          <span style={DIM}>Step 1 — Theft duration:</span>
          <br />
          <span style={HL}>
            {inputs.detectionDate} - {inputs.theftStartDate} = {formatIndian(breakdown.days)} days
          </span>
        </div>

        <div className={BOX} style={{ background: 'var(--bg)' }}>
          <span style={DIM}>Step 2 — Stolen energy (baseline method):</span>
          <br />
          <span style={HL}>
            {formatIndian(breakdown.days)} days × {inputs.peerAvgKwhPerDay} kWh/day (peer avg) ={' '}
            {formatIndian(breakdown.stolenKwh)} kWh
          </span>
          <br />
          <span style={{ ...DIM, fontSize: 10 }}>
            Less metered consumption during period: {breakdown.meteredKwh} kWh (earth-loading = zero recording)
          </span>
        </div>

        <div className={BOX} style={{ background: 'var(--bg)' }}>
          <span style={DIM}>Step 3 — Principal assessment:</span>
          <br />
          <span style={HL}>
            {formatIndian(breakdown.stolenKwh)} kWh × ₹{inputs.tariffRate.toFixed(2)}/unit ={' '}
            <span style={{ color: 'var(--amber)' }}>{fmtINRFull(breakdown.principal)}</span>
          </span>
        </div>

        <div className={BOX} style={{ background: 'var(--red-light, rgba(220,53,69,0.08))' }}>
          <span style={DIM}>Step 4 — Penalty (Section 135.1A):</span>
          <br />
          <span style={{ color: 'var(--red)', fontWeight: 700 }}>
            Principal × {breakdown.penaltyMultiplier.toFixed(1)} = {fmtINRFull(breakdown.total)}
          </span>
        </div>

        {/* TOTAL */}
        <div
          className="mb-0 rounded-md p-3"
          style={{
            background:
              'linear-gradient(135deg,rgba(220,53,69,.12),rgba(124,58,237,.12))',
            border: '2px solid var(--red)',
          }}
        >
          <span style={{ ...DIM, fontSize: 10 }}>TOTAL ASSESSMENT PAYABLE</span>
          <br />
          <span className="font-mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)' }}>
            {fmtINRFull(breakdown.total)}
          </span>
          <span className="ml-1.5 text-[11px] text-text-mid">
            ({inIndianWords(breakdown.total).replace(/\b\w/g, (c) => c.toUpperCase())})
          </span>
        </div>
      </div>

      {/* Legal basis footer */}
      <div
        className="mt-3 rounded-md text-[10px] leading-[1.5] text-ai-purple"
        style={{ padding: 8, background: 'var(--ai-purple-light)' }}
      >
        <strong>⚖️ Legal basis:</strong> Section 135 of Electricity Act 2003 read with UPERC
        Regulations. Peer-group baseline method as per precedent DHBVN vs Consumer 2019. Assessment
        computed without deducting any billed consumption since meter recorded zero during theft
        period (fully bypassed).
      </div>
    </div>
  )
}
