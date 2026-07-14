import type { LossBucket, LossTotal, OpportunityCard } from '../types'

/** 4 severity-tinted KPI cards under "The opportunity (loss baseline)". */
export const OPPORTUNITY_CARDS: OpportunityCard[] = [
  {
    id: 'revenue-input',
    label: 'Total revenue input',
    value: '₹47,200 Cr',
    valueTone: 'ink',
    subHtml: 'FY26 UPPCL revenue · 5 DISCOMs',
    tint: 'red',
  },
  {
    id: 'atc-loss',
    label: 'AT&C loss · current',
    value: '20.5%',
    valueTone: 'red',
    subHtml: 'vs FY26 target <strong>18.0%</strong> · gap <strong style="color:var(--red)">2.5pp</strong>',
    tint: 'red',
  },
  {
    id: 'annual-loss',
    label: 'Annual loss · all causes',
    value: '₹9,676 Cr',
    valueTone: 'red',
    subHtml: 'technical + commercial + collection',
    tint: 'red',
  },
  {
    id: 'theft-share',
    label: 'Theft-attributable share',
    value: '~₹4,260 Cr',
    valueTone: 'amber',
    subHtml: 'est. 44% of total loss · TOI baseline',
    tint: 'amber',
  },
]

/** "Where the ₹9,676 Cr goes" — 5 loss buckets. */
export const LOSS_BUCKETS: LossBucket[] = [
  {
    bucket: 'Technical losses (DT, line, transformer)',
    value: '₹3,580 Cr',
    share: '37%',
    addressable: 'no',
    note: 'No · physical infrastructure',
  },
  {
    bucket: 'Commercial — theft & meter tamper',
    value: '₹3,160 Cr',
    share: '33%',
    addressable: 'yes',
    note: 'Yes · primary use case',
  },
  {
    bucket: 'Commercial — billing irregularities',
    value: '₹1,100 Cr',
    share: '11%',
    addressable: 'yes',
    note: 'Yes · billing-MRI reconciliation',
  },
  {
    bucket: 'Collection inefficiency',
    value: '₹1,536 Cr',
    share: '16%',
    addressable: 'partial',
    note: 'Partial · payment-default scoring',
  },
  {
    bucket: 'Unmetered/free-tier leakage',
    value: '₹300 Cr',
    share: '3%',
    addressable: 'no',
    note: 'No · policy-level',
  },
]

/** Purple total row: AI-addressable pool. */
export const LOSS_TOTAL: LossTotal = {
  label: 'Total AI-addressable',
  value: '₹4,260 Cr',
  share: '44%',
  note: 'theft + billing + 30% of collection',
}
