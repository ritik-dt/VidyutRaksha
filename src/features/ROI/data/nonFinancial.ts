import type { BenefitCard } from '../types'

/** 6 non-financial value cards. */
export const BENEFIT_CARDS: BenefitCard[] = [
  {
    id: 'court',
    icon: '⚖️',
    title: 'Court conversion rate',
    value: '67% → 85%',
    desc: 'AI-generated Section 135 dossiers with phasor evidence, time-stamped photos, and Form-A reduce appeal success rate. Vigilance directorate metric.',
  },
  {
    id: 'productivity',
    icon: '🎯',
    title: 'Inspector productivity',
    value: '+30%',
    desc: 'Prioritized queue + route optimization + bulk-inspection cluster flagging eliminates the "where do I go first" question. Field-app reduces paper.',
  },
  {
    id: 'glide',
    icon: '📊',
    title: 'AT&C glide path',
    value: '20.5% → 18.4%',
    desc: '2-year glide path to FY26 PFC target. Triggers RDSS Tranche-2 funding eligibility (₹140 Cr unlock).',
  },
  {
    id: 'auditor',
    icon: '🛡️',
    title: 'Auditor defensibility',
    value: 'BEE + CAG ready',
    desc: 'Every flag has model lineage, signal weights, and ground-truth trail. CAG / FRA / UPERC review-ready evidence packs.',
  },
  {
    id: 'grid',
    icon: '⚡',
    title: 'Grid health side-benefit',
    value: '12% fewer DT failures',
    desc: 'DT loading anomaly detection (RDSS-funded DT meter inputs) catches overloads before failure. Avoids unplanned outages.',
  },
  {
    id: 'consumer',
    icon: '👥',
    title: 'Consumer experience',
    value: 'False-positive site visits ↓ 8%',
    desc: 'Reduces honest-consumer harassment. Genuine-mistake category in the AI lets analysts reclassify before raising a Section 135 notice.',
  },
]
