/**
 * Theft-type remediation knowledge base — byte-identical port of the prototype
 * remediationKB (7 entries: Earth Loading, Meter Bypass, Magnetic Tamper,
 * Tariff Misuse, Direct Hooking, CT Manipulation, Neutral Disturbance).
 * Each entry has safety notes, an inspection checklist, evidence to collect,
 * a meter action, the legal citation, and the assessment/formula for recovery.
 */

export interface RemediationEntry {
  type: string
  safety: string[]
  checklist: string[]
  evidence: string[]
  meterAction: string
  legal: string
  assessmentMethod: string
  formula: string
}

export const REMEDIATION_KB: Record<string, RemediationEntry> = {
  "Earth Loading": {
    "type": "Earth Loading / Neutral Bypass",
    "safety": [
      "Wear insulated safety gloves before approaching meter",
      "Do not touch bare wires or exposed connections",
      "Keep a safe distance from live conductors"
    ],
    "checklist": [
      "Photograph meter seal and serial number",
      "Check neutral wire — is it intact, cut, or bypassed?",
      "Check for bypass wire between phase and earth",
      "Take clamp-meter reading: compare neutral current vs phase current",
      "Photograph any unauthorized wiring from multiple angles",
      "Record meter display reading (kWh, kVAh, tamper count)",
      "Check earth pit connection",
      "If bypass confirmed — do NOT reconnect, escalate to AE"
    ],
    "evidence": [
      "Photographs of wiring (before and after)",
      "Clamp-meter readings (neutral vs phase)",
      "Meter event log screenshot (earth loading events)",
      "GPS coordinates of meter location",
      "Witness signatures if available"
    ],
    "meterAction": "Replace meter with anti-tamper enclosure. Install neutral monitoring relay. Reseal with tamper-evident seals.",
    "legal": "Section 135(1)(a), Electricity Act 2003 — unauthorized use by tampering with meter or delivery system.",
    "assessmentMethod": "Calculate from date of first earth-loading event to detection date, using peer-group average daily consumption.",
    "formula": "(Days from first event to detection) × Peer avg kWh/day × Tariff rate + 2x penalty under Section 135"
  },
  "Meter Bypass": {
    "type": "Full Meter Bypass",
    "safety": [
      "De-energize the connection before physical inspection",
      "Wear insulated gloves and safety shoes",
      "Have a helper present during inspection"
    ],
    "checklist": [
      "Inspect meter seal — is it intact or broken?",
      "Check for jumper wire across CT or across meter terminals",
      "Verify serial number matches DISCOM records",
      "Check if direct connection exists before the meter point",
      "Take clamp-meter reading at input vs output of meter",
      "Photograph all connections from multiple angles",
      "Record meter display readings"
    ],
    "evidence": [
      "Photographs of bypass wiring",
      "Meter seal status (intact/broken/missing)",
      "Serial number verification",
      "Clamp-meter readings (input vs output)",
      "Consumer statement if cooperative"
    ],
    "meterAction": "Remove bypass. Replace meter + seal. Install anti-tamper box. Consider CTPT meter for high-value consumers.",
    "legal": "Section 135(1)(a), Electricity Act 2003",
    "assessmentMethod": "Estimate from last normal billing reading to detection date using pre-tamper consumption average.",
    "formula": "(Days from last normal reading to detection) × Pre-tamper avg kWh/day × Tariff rate + 2x penalty"
  },
  "Magnetic Tamper": {
    "type": "Magnetic Interference",
    "safety": [
      "Standard safety precautions",
      "No special electrical danger beyond normal"
    ],
    "checklist": [
      "Check for magnets near or attached to meter casing",
      "Test meter casing for magnetic residue using gauss meter",
      "Check if meter display shows tamper flag",
      "Verify tamper event log matches physical evidence",
      "Photograph meter location and surroundings",
      "Check for hidden compartments near meter"
    ],
    "evidence": [
      "Photographs of magnet (if found) and meter location",
      "Gauss meter readings on casing",
      "Meter event log showing magnet-detected events with timestamps",
      "Consumer statement"
    ],
    "meterAction": "Replace with anti-magnetic (shielded) meter. Install in locked anti-tamper enclosure.",
    "legal": "Section 135(1)(a), Electricity Act 2003",
    "assessmentMethod": "Calculate from date of first magnet-detected event to detection, using pre-tamper average.",
    "formula": "(Days from first magnet event to detection) × Pre-tamper avg kWh/day × Tariff rate + 2x penalty"
  },
  "Tariff Misuse": {
    "type": "Tariff Category Misuse",
    "safety": [
      "No electrical danger — this is a premises inspection",
      "Be respectful and document professionally"
    ],
    "checklist": [
      "Verify actual usage of premises (residential vs commercial vs industrial)",
      "Look for commercial activity indicators: signboard, stock, equipment, employees",
      "Check load types: industrial machinery, commercial refrigeration, etc.",
      "Photograph premises from outside and inside (with consent)",
      "Note business name and type if commercial activity found",
      "Compare actual connected load vs sanctioned load",
      "Verify meter category matches actual usage"
    ],
    "evidence": [
      "Photographs of premises showing commercial/industrial activity",
      "Business registration documents (if visible)",
      "Connected load inventory",
      "Comparison of sanctioned vs actual category",
      "Consumer details and account history"
    ],
    "meterAction": "No meter replacement needed. Reclassify tariff category in billing system.",
    "legal": "Section 126, Electricity Act 2003 — unauthorized use of electricity at wrong tariff.",
    "assessmentMethod": "Calculate tariff differential for the entire period of misuse.",
    "formula": "Total kWh consumed × (Correct tariff rate - Applied tariff rate) × Period of misuse + penalty as per SERC regulations"
  },
  "Direct Hooking": {
    "type": "Direct Hooking / Unauthorized Connection",
    "safety": [
      "⚠ HIGH DANGER — De-energize the feeder section BEFORE inspection",
      "Coordinate with control room for planned shutdown",
      "Wear full PPE: insulated gloves, safety shoes, helmet",
      "Have a line crew present — do NOT attempt alone"
    ],
    "checklist": [
      "Identify the unauthorized cable connection point on the line",
      "Trace the cable from source to consumer premises",
      "Photograph the hooking point from multiple angles",
      "Note cable gauge and type",
      "Record GPS coordinates of hooking point",
      "Check if connection is before or after the meter",
      "Disconnect the unauthorized cable (only after de-energizing)",
      "Verify no other unauthorized connections in the area"
    ],
    "evidence": [
      "Photographs of hooking point and cable route",
      "Cable sample (confiscate the unauthorized cable)",
      "GPS coordinates",
      "Photographs of premises receiving unauthorized supply",
      "FIR filing documentation"
    ],
    "meterAction": "Disconnect unauthorized cable. Install new metered connection if consumer applies. Confiscate cable as evidence.",
    "legal": "Section 135 + Section 138, Electricity Act 2003 — theft of electricity + interference with meters/lines. Criminal offense — FIR mandatory.",
    "assessmentMethod": "Estimate from cable gauge and connected load, for the estimated period of unauthorized connection.",
    "formula": "Estimated load (from cable gauge) × Estimated hours of use per day × Estimated days × Tariff rate + 2x penalty + FIR"
  },
  "CT Manipulation": {
    "type": "CT Ratio Manipulation",
    "safety": [
      "De-energize before testing CT connections",
      "Wear insulated gloves"
    ],
    "checklist": [
      "Test CT ratio with clamp meter — compare primary vs secondary current",
      "Compare CT readings with meter-recorded values",
      "Check CT seals — intact or tampered?",
      "Verify CT specifications match DISCOM records",
      "Photograph CT installation and connections",
      "Record all readings for evidence"
    ],
    "evidence": [
      "CT test results (primary vs secondary current)",
      "Photographs of CT installation",
      "CT seal status",
      "Comparison with DISCOM CT records",
      "Meter readings before and after correction"
    ],
    "meterAction": "Replace CTs with correct specification. Recalibrate metering. Install tamper-evident CT seals.",
    "legal": "Section 135(1)(a), Electricity Act 2003",
    "assessmentMethod": "Apply ratio correction factor to all historical kVAh billed since last CT verification.",
    "formula": "Total kVAh billed × (Correct CT ratio / Tampered CT ratio - 1) × Tariff rate + penalty"
  },
  "Neutral Disturbance": {
    "type": "Neutral Wire Disturbance",
    "safety": [
      "Wear insulated gloves",
      "Check for live neutral before touching"
    ],
    "checklist": [
      "Check neutral wire integrity — is it intact, cut, or loosened?",
      "Perform resistance test on neutral connection",
      "Check if disturbance is intentional or due to corrosion/damage",
      "Look for signs of recent wiring work",
      "Photograph neutral point and all connections",
      "Compare load readings with and without neutral connected"
    ],
    "evidence": [
      "Photographs of neutral connection point",
      "Resistance test readings",
      "Meter event log showing neutral-disturbance events",
      "Assessment of intentionality (tool marks vs corrosion)"
    ],
    "meterAction": "Repair neutral connection. Install neutral monitoring relay. Replace meter if damaged.",
    "legal": "Section 135(1)(a) if intentional, Section 126 if unintentional but consumer negligent.",
    "assessmentMethod": "If intentional: calculate from first neutral event date using peer average. If unintentional: issue notice for repair.",
    "formula": "(Days from first neutral event to detection) × Peer avg kWh/day × Tariff rate (if intentional)"
  }
}
