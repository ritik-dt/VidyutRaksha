import type { ReportDef, ReportId } from '../types'

/**
 * 11 fully-authored report documents, machine-extracted from the prototype's
 * _REPORT_DEFS and structured into the typed block model — no opaque HTML blobs.
 *
 * Every inline style the prototype applies is preserved as typed data:
 *   • rows    → variant (purple/red/green tint + bold) + strongTop (2px border)
 *   • cells   → color, bold, mono, align, width, fontSize, inline progress bar
 *   • tiles   → tone (red/amber/green/purple/teal) + optional unit; grid cols 4 or 3
 *   • captions render as plain small dim text — the prototype boxes none of them
 *
 * The 12th report ('rep-daily-theft') is built at runtime — two of its sections
 * compute from live hierarchy data. See data/dailyTheftReport.ts.
 */
export const STATIC_REPORT_DEFS: Partial<Record<ReportId, ReportDef>> =
{
  "rep-uperc-arr": {
    "title": "UPERC ARR Petition · FY 2026-27",
    "subtitle": "Annual Revenue Requirement & Tariff Determination · UPPCL Distribution",
    "docNo": "UPPCL/UPERC/ARR/FY26-27/2026",
    "classification": "Confidential · for regulatory filing",
    "regulator": "Uttar Pradesh Electricity Regulatory Commission",
    "legalCite": "EA 2003 §62 + §64 · UPERC MYT Regulations 2019 · Companies Act §175",
    "footer": "Filed at UPERC, Kisan Mandi Bhawan, Vibhuti Khand, Gomti Nagar, Lucknow — 226010. Hearing scheduled 18 Jun 2026. Counsel: Senior Advocate M.G. Ramachandran.",
    "sections": [
      {
        "heading": "1. Background & Brief History",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "In accordance with Section 62 read with Section 64 of the Electricity Act, 2003 (hereinafter \"the Act\") and UPERC (Multi Year Tariff for Distribution and Transmission) Regulations, 2019 (\"MYT Regulations 2019\"), Uttar Pradesh Power Corporation Limited (the \"Petitioner\" / \"UPPCL\") submits this Petition for:"
          },
          {
            "kind": "list",
            "items": [
              "True-up of FY 2024-25",
              "Annual Performance Review (APR) of FY 2025-26",
              "Determination of ARR and Tariff for FY 2026-27"
            ]
          },
          {
            "kind": "paragraph",
            "html": "This is the 4th petition under the current MYT control period (FY 2024-25 to FY 2028-29). Petition №: 2287/2026."
          }
        ]
      },
      {
        "heading": "2. Public Notice & Stakeholder Consultation",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Newspaper"
              },
              {
                "label": "Language"
              },
              {
                "label": "Date of publication",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Times of India"
                  },
                  {
                    "text": "English",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "28 Apr 2026",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Dainik Jagran"
                  },
                  {
                    "text": "Hindi",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "28 Apr 2026",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Amar Ujala"
                  },
                  {
                    "text": "Hindi",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "29 Apr 2026",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Hindustan Times"
                  },
                  {
                    "text": "English",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "29 Apr 2026",
                    "align": "right",
                    "mono": true
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Objections to be filed within 21 days. Public hearing scheduled for 18 Jun 2026 at UPERC Conference Hall, Lucknow."
          }
        ]
      },
      {
        "heading": "3. Energy Balance · FY 2026-27 (projected)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Particulars"
              },
              {
                "label": "FY24-25 actual",
                "align": "right"
              },
              {
                "label": "FY25-26 estimate",
                "align": "right"
              },
              {
                "label": "FY26-27 projected",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Energy input at distribution periphery (MU)"
                  },
                  {
                    "text": "1,01,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,06,200",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,11,500",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Energy sold to consumers (MU)"
                  },
                  {
                    "text": "78,219",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "82,360",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "87,540",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Distribution losses (MU)"
                  },
                  {
                    "text": "23,621",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "23,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "23,960",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Distribution losses (%)"
                  },
                  {
                    "text": "23.2%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "22.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "21.5%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Collection efficiency (%)"
                  },
                  {
                    "text": "94.6%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "95.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "96.2%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "AT&C loss (%)"
                  },
                  {
                    "text": "27.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "25.9%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "24.5%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ],
                "variant": "red"
              }
            ]
          },
          {
            "kind": "caption",
            "html": "FY26-27 AT&C trajectory of 24.5% is above MYT-approved trajectory of 17.5%. Variance attributed to delayed RDSS smart-meter rollout; mitigation plan submitted under Section 4 of this petition."
          }
        ]
      },
      {
        "heading": "4. Power Purchase Cost · FY 2026-27 (projected)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Source"
              },
              {
                "label": "Quantum (MU)",
                "align": "right"
              },
              {
                "label": "Rate (₹/kWh)",
                "align": "right"
              },
              {
                "label": "Cost (₹ Cr)",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Long-term PPA · NTPC (Bara, Karchhana, Rihand)"
                  },
                  {
                    "text": "52,400",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4.92",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "25,781",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Long-term PPA · State GENCO (UPRVUNL)"
                  },
                  {
                    "text": "18,200",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5.18",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "9,428",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Long-term PPA · Hydro (THDC, SJVN, NHPC)"
                  },
                  {
                    "text": "8,100",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3.82",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3,094",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Medium-term · case-1 bid winners"
                  },
                  {
                    "text": "12,300",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5.41",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "6,654",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Short-term · IEX day-ahead"
                  },
                  {
                    "text": "10,200",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4.18",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4,264",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Renewable / RPO (solar + wind + bio)"
                  },
                  {
                    "text": "10,300",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2.95",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3,039",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Transmission charges (PGCIL + UPPTCL)"
                  },
                  {
                    "text": "—",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "—",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5,820",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Total power purchase cost"
                  },
                  {
                    "text": "1,11,500",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5.21",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "58,080",
                    "align": "right",
                    "mono": true,
                    "color": "var(--ai-purple)"
                  }
                ],
                "variant": "purple",
                "strongTop": true
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Power purchase ≈ 73.5% of total ARR. Hedging strategy and merit-order despatch certified by UPSLDC under UPERC MOD Regulations 2021."
          }
        ]
      },
      {
        "heading": "5. ARR Summary (Rs. Crore)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Component"
              },
              {
                "label": "FY26-27 petitioned",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Power purchase cost (incl. transmission)"
                  },
                  {
                    "text": "58,080",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "O&M expenses (employee + R&M + A&G)"
                  },
                  {
                    "text": "9,840",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Depreciation"
                  },
                  {
                    "text": "2,840",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Interest on long-term loans"
                  },
                  {
                    "text": "3,920",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Interest on working capital"
                  },
                  {
                    "text": "1,840",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Return on equity (15.5%)"
                  },
                  {
                    "text": "1,620",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Provision for bad & doubtful debts"
                  },
                  {
                    "text": "480",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Less: non-tariff income"
                  },
                  {
                    "text": "(620)",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "GROSS ARR"
                  },
                  {
                    "text": "78,000",
                    "align": "right",
                    "mono": true
                  }
                ],
                "variant": "purple"
              },
              {
                "cells": [
                  {
                    "text": "Less: revenue from existing tariff"
                  },
                  {
                    "text": "(72,180)",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "REVENUE GAP"
                  },
                  {
                    "text": "5,820",
                    "align": "right",
                    "mono": true
                  }
                ],
                "variant": "red",
                "strongTop": true
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Proposed: average tariff increase of 4.2% to bridge revenue gap. Cross-subsidy reduction in line with EA Amendment 2022 trajectory. State subsidy of ₹15,300 Cr expected from GoUP under Sec 65, EA 2003."
          }
        ]
      },
      {
        "heading": "6. RDSS Compliance & Trajectory Commitments",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "As required under the Revamped Distribution Sector Scheme (RDSS) Action Plan approved by Distribution Reforms Committee on 12 Aug 2022, the Petitioner submits compliance status:"
          },
          {
            "kind": "list",
            "items": [
              "Smart meter rollout: 18.4 lakh of 43.5 lakh sanctioned (42.3%). Sunset 31 Mar 2026 — extension to FY28 proposed by MoP.",
              "Annual accounts FY24-25 filed: 25 Sep 2025 ✓",
              "ACS-ARR gap reduction trajectory: ₹0.62/kWh (FY26 actual) vs ₹0.50/kWh (committed)",
              "Loss reduction works: 47% of ₹14,400 Cr sanctioned executed",
              "Government department dues: paid current month (no arrears beyond 60 days)"
            ]
          }
        ]
      }
    ]
  },
  "rep-uperc-true-up": {
    "title": "UPERC True-up Petition · FY 2024-25",
    "subtitle": "True-up of audited expenses vs approved ARR · UPPCL Distribution",
    "docNo": "UPPCL/UPERC/TRUE-UP/FY24-25/2026",
    "classification": "Confidential · for regulatory filing",
    "regulator": "Uttar Pradesh Electricity Regulatory Commission",
    "legalCite": "EA 2003 §62(4) · UPERC MYT Regulations 2019 · APTEL OP 14.12.2022",
    "footer": "Filed at UPERC, Kisan Mandi Bhawan, Vibhuti Khand, Gomti Nagar, Lucknow — 226010. Public hearing scheduled 22 Sep 2026.",
    "sections": [
      {
        "heading": "1. Background & Scope",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "Per Section 62(4) of the Electricity Act 2003 and UPERC MYT Regulations 2019, the Petitioner submits the True-up of audited expenses for FY 2024-25 against the Aggregate Revenue Requirement (ARR) approved by the Commission vide Tariff Order dated 10 Oct 2024 (Petition № 2043/2023)."
          },
          {
            "kind": "paragraph",
            "html": "Audited financial statements (FY24-25) certified by CAG-empanelled statutory auditor M/s S.N. Dhawan & Co. LLP, signed off 25 Sep 2025. CAG comments addressed in Annexure-VII."
          }
        ]
      },
      {
        "heading": "2. Reconciliation with Audited Accounts (Rs. Crore)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Particulars"
              },
              {
                "label": "Per audited accts",
                "align": "right"
              },
              {
                "label": "Approved ARR",
                "align": "right"
              },
              {
                "label": "Variance",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Net energy sold (MU)"
                  },
                  {
                    "text": "78,219",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "80,400",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(2,181)",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Revenue from sale of power"
                  },
                  {
                    "text": "66,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "68,140",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(1,720)",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Power purchase cost"
                  },
                  {
                    "text": "56,180",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "54,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,360",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Employee expenses"
                  },
                  {
                    "text": "5,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5,180",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "240",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "R&M expenses"
                  },
                  {
                    "text": "2,180",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,040",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "140",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "A&G expenses"
                  },
                  {
                    "text": "1,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,720",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "120",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Depreciation"
                  },
                  {
                    "text": "2,720",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,680",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "40",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Interest on long-term loans"
                  },
                  {
                    "text": "3,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3,620",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "220",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Interest on working capital"
                  },
                  {
                    "text": "1,920",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,720",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "200",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Return on Equity (15.5%)"
                  },
                  {
                    "text": "1,580",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,580",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "0",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Non-tariff income"
                  },
                  {
                    "text": "(580)",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(540)",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(40)",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Excess / Shortfall Claims by Head",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Net true-up gap (admissible)",
                    "color": "var(--text)"
                  },
                  {
                    "text": "₹3,420 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Power purchase carrying cost claim",
                    "color": "var(--text)"
                  },
                  {
                    "text": "₹512 Cr · @ SBI MCLR + 100 bps",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber-dark)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "GENCO arrears carrying cost (FY22-FY23)",
                    "color": "var(--text)"
                  },
                  {
                    "text": "₹284 Cr · per APTEL Order 14.12.2022",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber-dark)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Subsidy delay carrying cost claim",
                    "color": "var(--text)"
                  },
                  {
                    "text": "₹318 Cr · @ avg 5.4 month delay",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber-dark)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Truing-up · employee & R&M (normative excess)",
                    "color": "var(--text)"
                  },
                  {
                    "text": "₹420 Cr · disallowance proposed",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "NET TRUE-UP CLAIM",
                    "color": "var(--text)"
                  },
                  {
                    "text": "₹4,114 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--ai-purple)"
                  }
                ],
                "variant": "purple",
                "strongTop": true
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Carrying cost claim under MYT Regulation 14.3 · interest on revenue gap until liquidation through tariff revision."
          }
        ]
      },
      {
        "heading": "4. AT&C Loss · Actual vs Approved",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DISCOM"
              },
              {
                "label": "Approved AT&C",
                "align": "right"
              },
              {
                "label": "Actual FY24-25",
                "align": "right"
              },
              {
                "label": "Efficiency loss",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "DVVNL · Agra",
                    "bold": true
                  },
                  {
                    "text": "18.5%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "22.6%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+4.1pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "MVVNL · Lucknow",
                    "bold": true
                  },
                  {
                    "text": "17.5%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "19.7%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+2.2pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PVVNL · Meerut",
                    "bold": true
                  },
                  {
                    "text": "16.5%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "18.4%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+1.9pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PuVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "18.0%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "21.3%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+3.3pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "KESCO · Kanpur",
                    "bold": true
                  },
                  {
                    "text": "14.0%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "15.8%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+1.8pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Per UPERC Regulation 13.7, efficiency loss above approved trajectory is disallowed in true-up. Petitioner has provided justifications (delayed RDSS rollout, monsoon flooding in Eastern UP, agricultural metering pendency). Commission decision awaited."
          }
        ]
      },
      {
        "heading": "5. Commission Directives Awaited",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "Acceptance of carrying cost claim (₹1,114 Cr) on power purchase and GENCO arrears",
              "Treatment of efficiency loss (₹1,820 Cr potential disallowance)",
              "Working capital interest reconciliation",
              "Inclusion in tariff trajectory for FY 2026-27 (per Section 5 of pending ARR petition)"
            ]
          }
        ]
      }
    ]
  },
  "rep-rdss-quarterly": {
    "title": "RDSS Quarterly Progress · Q1 FY 2026-27",
    "subtitle": "Revamped Distribution Sector Scheme · UPPCL · 5 DISCOMs",
    "docNo": "UPPCL/RDSS/QPR/Q1-FY26-27/2026",
    "classification": "Submitted to PFC (Nodal Agency)",
    "regulator": "Ministry of Power · PFC · REC",
    "legalCite": "RDSS Scheme Guidelines (Version 3, Dec 2021) · CCEA approval 30 Jun 2021",
    "footer": "Submitted to PFC New Delhi · Monitoring Committee chaired by Secretary (Power). Next review meeting: 22 May 2026.",
    "sections": [
      {
        "heading": "1. Executive Summary · Q1 FY26-27",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Total sanctioned outlay (Part A + B)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹14,400 Cr · CCEA approved Aug 2022",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Cumulative funds disbursed",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹6,768 Cr (47%) · last tranche Mar 2026",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Smart meters installed",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "18.4 lakh of 43.5 lakh sanctioned (42.3%)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Loss reduction works executed",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "47.2% of physical scope",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "AT&C loss reduction (FY24 baseline)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "From 27.4% → 24.5% (FY26 projected, -2.9pp)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "ACS-ARR gap reduction",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "From ₹0.84/kWh → ₹0.62/kWh (-₹0.22/kWh)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Sunset compliance",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "⚠ At-risk — MoP proposed 2-year extension to FY28",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Part A · Loss Reduction Works · 5-DISCOM scorecard",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DISCOM"
              },
              {
                "label": "Sanctioned (₹ Cr)",
                "align": "right"
              },
              {
                "label": "Disbursed",
                "align": "right"
              },
              {
                "label": "Executed %",
                "align": "right"
              },
              {
                "label": "Status"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "PVVNL · Meerut",
                    "bold": true
                  },
                  {
                    "text": "3,200",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,536",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "48%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "On track",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "MVVNL · Lucknow",
                    "bold": true
                  },
                  {
                    "text": "2,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,278",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "45%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "On track",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "KVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "2,180",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,068",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "49%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "On track",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PuVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "2,920",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,168",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "40%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "Lagging",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DVVNL · Agra",
                    "bold": true
                  },
                  {
                    "text": "3,260",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,043",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "32%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "At risk",
                    "color": "#fff"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Scope per DISCOM: feeder bifurcation, AB cabling, 11kV reconductoring, new 33/11kV sub-stations, HVDS conversion, IT/OT integration. DVVNL \"at risk\" status flagged in 4th Monitoring Committee meeting (12 Mar 2026); corrective action plan submitted 28 Mar."
          }
        ]
      },
      {
        "heading": "3. Part B · Smart Metering Rollout (AMISP TOTEX mode)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Stage"
              },
              {
                "label": "Count (lakh)",
                "align": "right"
              },
              {
                "label": "% of sanctioned",
                "align": "right"
              },
              {
                "label": "Δ vs last quarter"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Sanctioned (CCEA approved)"
                  },
                  {
                    "text": "43.5",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  },
                  {
                    "text": "100%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "—",
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "green"
              },
              {
                "cells": [
                  {
                    "text": "AMISP awarded · LOA issued"
                  },
                  {
                    "text": "38.2",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  },
                  {
                    "text": "87.8%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+0.0L",
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Procurement completed"
                  },
                  {
                    "text": "24.7",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  },
                  {
                    "text": "56.8%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+2.4L QoQ",
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Installed at site"
                  },
                  {
                    "text": "18.4",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  },
                  {
                    "text": "42.3%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+3.1L QoQ",
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Communicating with HES"
                  },
                  {
                    "text": "11.2",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  },
                  {
                    "text": "25.7%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+1.8L QoQ",
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "In prepaid mode"
                  },
                  {
                    "text": "4.6",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  },
                  {
                    "text": "10.6%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+0.9L QoQ",
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "AMISP partners: Genus Power (PVVNL + MVVNL), Adani Energy Solutions (DVVNL), Intellismart (KVVNL + PuVVNL). PMPM ₹2,840 avg. At current velocity ~1.8L/month, will reach ~32L by 31 Mar 2026 — shortfall 11.5L without 2-yr extension."
          }
        ]
      },
      {
        "heading": "4. Annual Evaluation Framework · Q1 score",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Parameter"
              },
              {
                "label": "Weightage",
                "align": "right"
              },
              {
                "label": "Score (out of 100)",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "AT&C loss reduction"
                  },
                  {
                    "text": "30%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "62",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 62,
                      "tone": "amber"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "ACS-ARR gap reduction"
                  },
                  {
                    "text": "25%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "58",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 58,
                      "tone": "red"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Annual accounts timeliness"
                  },
                  {
                    "text": "10%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "100",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 100,
                      "tone": "green"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Subsidy & govt dues payment"
                  },
                  {
                    "text": "10%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "84",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 84,
                      "tone": "green"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "No new regulatory assets"
                  },
                  {
                    "text": "10%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "100",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 100,
                      "tone": "green"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Tariff order regularity"
                  },
                  {
                    "text": "5%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "100",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 100,
                      "tone": "green"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Energy accounting compliance"
                  },
                  {
                    "text": "5%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "78",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 78,
                      "tone": "amber"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Consumer service ranking"
                  },
                  {
                    "text": "5%",
                    "align": "right",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "48",
                    "align": "right",
                    "bold": true,
                    "bar": {
                      "percent": 48,
                      "tone": "red"
                    }
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Composite weighted score"
                  },
                  {
                    "text": "100%",
                    "align": "right"
                  },
                  {
                    "text": "71.4",
                    "align": "right",
                    "mono": true,
                    "color": "var(--ai-purple)",
                    "fontSize": "14px"
                  }
                ],
                "variant": "purple",
                "strongTop": true
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Score 71.4 qualifies UPPCL for Q1 tranche release of ₹620 Cr (per RDSS evaluation framework). Score < 60 triggers withholding. ACS-ARR sub-score the largest drag."
          }
        ]
      },
      {
        "heading": "5. AT&C Loss Trajectory vs Committed",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Year"
              },
              {
                "label": "Committed",
                "align": "right"
              },
              {
                "label": "Actual",
                "align": "right"
              },
              {
                "label": "Variance",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "FY 2021-22 (baseline)"
                  },
                  {
                    "text": "27.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "27.4%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "—",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "FY 2022-23"
                  },
                  {
                    "text": "25.0%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "26.1%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+1.1pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "FY 2023-24"
                  },
                  {
                    "text": "22.0%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "24.8%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+2.8pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "FY 2024-25"
                  },
                  {
                    "text": "19.5%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "23.2%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+3.7pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "FY 2025-26 (proj)"
                  },
                  {
                    "text": "17.5%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "22.4%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+4.9pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "FY 2026-27 (target)"
                  },
                  {
                    "text": "15.0%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "21.5%*",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "+6.5pp",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ],
                "variant": "red"
              }
            ]
          },
          {
            "kind": "caption",
            "html": "*FY26-27 projection includes accelerated theft-detection deployment via VidyutRaksha platform. Annual narrowing of variance is the corrective trajectory submitted to Monitoring Committee."
          }
        ]
      }
    ]
  },
  "rep-bee-audit": {
    "title": "BEE Energy Audit · Half-yearly (H2 FY 2025-26)",
    "subtitle": "Mandatory audit under BEE Notification 18/1/BEE/DISCOM/2021",
    "docNo": "UPPCL/BEE/EA/H2-FY26/2026",
    "classification": "Submitted to Bureau of Energy Efficiency & State Designated Agency",
    "regulator": "Bureau of Energy Efficiency · Ministry of Power",
    "legalCite": "BEE Notification 18/1/BEE/DISCOM/2021 · EC Act 2001 §26 + §14A",
    "footer": "Audited by M/s Hindustan Energy Audit Pvt Ltd (BEE-AEA-2018). Submitted to BEE New Delhi + UP State Designated Agency (UPNEDA). Published on UPPCL website per Regulation 7.",
    "sections": [
      {
        "heading": "1. Designated Consumer Profile (BEE Form-1)",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Designated Consumer",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "Uttar Pradesh Power Corporation Ltd (UPPCL)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Registration No.",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "DC-DISCOM-UP-001 (BEE notification 06 Oct 2021)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Reporting period",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "H2 FY 2025-26 (01 Oct 2025 — 31 Mar 2026)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Energy Manager",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "Shri Anil Kumar Pandey (EM-7142) · Chief Engineer (Energy Audit)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Authorised signatory",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "Director (Distribution), UPPCL",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Accredited Energy Auditor",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "M/s Hindustan Energy Audit Pvt Ltd (BEE-AEA-2018)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Network · 33kV lines",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "18,420 ckt-km",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Network · 11kV lines",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "1,42,300 ckt-km",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Distribution transformers",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "4,82,000 nos (DT-metered: 1,82,000 = 37.8%)",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Consumers served",
                    "color": "var(--text-mid)",
                    "width": "42%"
                  },
                  {
                    "text": "4.18 crore",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Energy Flow at Voltage Levels (MU · H2 FY26)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Voltage level"
              },
              {
                "label": "Input MU",
                "align": "right"
              },
              {
                "label": "Sold MU",
                "align": "right"
              },
              {
                "label": "Loss MU",
                "align": "right"
              },
              {
                "label": "Loss %",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "400 kV (EHT)"
                  },
                  {
                    "text": "54,860",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,184",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "62",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "2.8%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "220 kV"
                  },
                  {
                    "text": "52,614",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "8,920",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,108",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "4.0%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "132 kV"
                  },
                  {
                    "text": "41,586",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,038",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "4.9%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "33 kV"
                  },
                  {
                    "text": "34,728",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "12,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,224",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "6.4%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "11 kV"
                  },
                  {
                    "text": "20,084",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "18,540",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,544",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "7.7%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "LT (415V / 230V)"
                  },
                  {
                    "text": "18,540",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "15,082",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3,458",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "18.7%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ],
                "variant": "red"
              }
            ]
          },
          {
            "kind": "caption",
            "html": "LT-level loss of 18.7% is the largest contributor. 65% of LT loss attributed to commercial (theft + un-billed) per consumer-level audit (Section 4)."
          }
        ]
      },
      {
        "heading": "3. Feeder & DT-Level Losses · Top 10 high-loss feeders (state)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Feeder"
              },
              {
                "label": "DISCOM · Zone"
              },
              {
                "label": "Input MU",
                "align": "right"
              },
              {
                "label": "Loss %",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Chowk (old city)",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Varanasi",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "18.4",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "34.2%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Trans-Yamuna",
                    "bold": true
                  },
                  {
                    "text": "PVVNL · Agra",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "22.1",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "31.8%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Padri Bazaar",
                    "bold": true
                  },
                  {
                    "text": "PuVVNL · Gorakhpur",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "14.6",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "29.4%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Civil Lines",
                    "bold": true
                  },
                  {
                    "text": "DVVNL · Prayagraj",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "19.8",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "27.8%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Aminabad",
                    "bold": true
                  },
                  {
                    "text": "MVVNL · Lucknow",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "24.2",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "25.6%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Bhelupur",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Varanasi",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "12.8",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "21.9%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Sigra",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Varanasi",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "15.4",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "19.7%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Mahanagar",
                    "bold": true
                  },
                  {
                    "text": "MVVNL · Lucknow",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "18.6",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "18.4%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Sadar Bazaar",
                    "bold": true
                  },
                  {
                    "text": "PVVNL · Meerut",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "16.2",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "17.8%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Naini",
                    "bold": true
                  },
                  {
                    "text": "DVVNL · Prayagraj",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "13.9",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "17.1%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Chowk feeder (Varanasi) loss 34.2% — flagged for KVVNL DRC review. Currently under VidyutRaksha pilot inspection (1,116 consumers, 49 DTRs covered)."
          }
        ]
      },
      {
        "heading": "4. AT&C Loss · Quarterly Trend",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Quarter"
              },
              {
                "label": "T&D loss",
                "align": "right"
              },
              {
                "label": "Billing eff",
                "align": "right"
              },
              {
                "label": "Collection eff",
                "align": "right"
              },
              {
                "label": "AT&C",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Q3 FY25-26 (Oct-Dec)",
                    "bold": true
                  },
                  {
                    "text": "23.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "86.6%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "94.2%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "25.6%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Q4 FY25-26 (Jan-Mar)",
                    "bold": true
                  },
                  {
                    "text": "22.8%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "86.9%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "94.6%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "24.9%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "5. Data Gaps & Compliance Status",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Feeder-level metering",
                    "width": "35%"
                  },
                  {
                    "text": "100% (per CEA 2014 Metering Code)",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "✓",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DT-level metering",
                    "width": "35%"
                  },
                  {
                    "text": "37.8% (target 100% per RDSS guidelines)",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "✗",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Consumer indexing accuracy",
                    "width": "35%"
                  },
                  {
                    "text": "~70% (verified by field audit on 8% sample)",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "!",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Open access consumer data",
                    "width": "35%"
                  },
                  {
                    "text": "Provided · 28 OA consumers reported",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "✓",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Captive power data",
                    "width": "35%"
                  },
                  {
                    "text": "Provided · 142 captive plants",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "✓",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Inter-DISCOM adjustments",
                    "width": "35%"
                  },
                  {
                    "text": "Reconciled · 4 boundary points with KESCO",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "✓",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Calibration certificates · feeder meters",
                    "width": "35%"
                  },
                  {
                    "text": "87% within validity",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "!",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Energy Accounting Cell · personnel adequacy",
                    "width": "35%"
                  },
                  {
                    "text": "12 of 18 sanctioned positions filled",
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "!",
                    "color": "#fff"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "3 amber/red items will be addressed in H1 FY26-27 action plan. Non-compliance penalty under EC Act §26: ₹10 lakh + ₹10,000/day of continuing default."
          }
        ]
      }
    ]
  },
  "rep-cea-reliability": {
    "title": "CEA Reliability Indices · Monthly · April 2026",
    "subtitle": "SAIDI / SAIFI / CAIDI / ASAI · Feeder-wise with outage cause classification",
    "docNo": "UPPCL/CEA/REL/APR-2026/2026",
    "classification": "Submitted to Central Electricity Authority",
    "regulator": "Central Electricity Authority · Ministry of Power",
    "legalCite": "CEA (Furnishing of Statistics) Regulations 2007 · CEA Reliability Reporting Procedures",
    "footer": "Submitted to CEA, Sewa Bhawan, R K Puram, New Delhi. Public disclosure on UPPCL website per CEA Reliability Reporting Procedures 2014.",
    "sections": [
      {
        "heading": "1. Index Definitions",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "SAIDI",
                    "bold": true,
                    "color": "var(--ai-purple)",
                    "width": "12%"
                  },
                  {
                    "text": "System Average Interruption Duration Index",
                    "width": "35%"
                  },
                  {
                    "text": "Σ(duration × customers affected) / total customers · minutes / customer",
                    "mono": true,
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "SAIFI",
                    "bold": true,
                    "color": "var(--ai-purple)",
                    "width": "12%"
                  },
                  {
                    "text": "System Average Interruption Frequency Index",
                    "width": "35%"
                  },
                  {
                    "text": "Σ(customers interrupted) / total customers · interruptions / customer",
                    "mono": true,
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "CAIDI",
                    "bold": true,
                    "color": "var(--ai-purple)",
                    "width": "12%"
                  },
                  {
                    "text": "Customer Average Interruption Duration Index",
                    "width": "35%"
                  },
                  {
                    "text": "SAIDI / SAIFI · minutes / interruption",
                    "mono": true,
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "ASAI",
                    "bold": true,
                    "color": "var(--ai-purple)",
                    "width": "12%"
                  },
                  {
                    "text": "Average Service Availability Index",
                    "width": "35%"
                  },
                  {
                    "text": "1 - (SAIDI / 8760×60) · % (target ≥99.7%)",
                    "mono": true,
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2. State-Aggregate Reliability · Apr 2026",
        "blocks": [
          {
            "kind": "metricGrid",
            "cols": 4,
            "tiles": [
              {
                "label": "SAIDI",
                "value": "180",
                "unit": "min/customer",
                "sub": "Target: <120 min",
                "tone": "red"
              },
              {
                "label": "SAIFI",
                "value": "6.2",
                "unit": "interruptions",
                "sub": "Target: <4.0",
                "tone": "red"
              },
              {
                "label": "CAIDI",
                "value": "29.0",
                "unit": "min/interruption",
                "sub": "Target: <30",
                "tone": "amber"
              },
              {
                "label": "ASAI",
                "value": "99.66",
                "unit": "%",
                "sub": "Target: ≥99.7%",
                "tone": "amber"
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Outage Cause Classification · Apr 2026",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Cause category"
              },
              {
                "label": "Incidents",
                "align": "right"
              },
              {
                "label": "% of total",
                "align": "right"
              },
              {
                "label": "SAIDI contrib (min)",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Equipment failure (transformer, cable, switch)"
                  },
                  {
                    "text": "4,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "31.4%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "56.5",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Weather (storm, lightning, heatwave)"
                  },
                  {
                    "text": "3,140",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "20.5%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "36.9",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Planned maintenance / shutdown"
                  },
                  {
                    "text": "2,680",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "17.5%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "31.5",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Overload / cascading trips"
                  },
                  {
                    "text": "1,920",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "12.5%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "22.5",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Third-party damage (excavation, vehicle)"
                  },
                  {
                    "text": "1,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "9.3%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "16.7",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Vegetation / tree falls"
                  },
                  {
                    "text": "820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5.3%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "9.6",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Bird/animal contact"
                  },
                  {
                    "text": "380",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2.5%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "4.4",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Unknown / under investigation"
                  },
                  {
                    "text": "160",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1.0%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "1.9",
                    "align": "right",
                    "mono": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Total"
                  },
                  {
                    "text": "15,340",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "100%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "180.0",
                    "align": "right",
                    "mono": true,
                    "color": "var(--ai-purple)"
                  }
                ],
                "variant": "purple",
                "strongTop": true
              }
            ]
          },
          {
            "kind": "caption",
            "html": "Equipment failure dominant — driven by ageing transformer fleet (avg DT age 11.2 yrs vs OEM-recommended 8). Replacement plan: 8,400 DTs in RDSS Phase-2."
          }
        ]
      },
      {
        "heading": "4. DISCOM-Wise SAIDI · Apr 2026",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DISCOM"
              },
              {
                "label": "SAIDI (min)",
                "align": "right"
              },
              {
                "label": "SAIFI",
                "align": "right"
              },
              {
                "label": "ASAI %",
                "align": "right"
              },
              {
                "label": "vs target"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "PVVNL · Meerut",
                    "bold": true
                  },
                  {
                    "text": "132",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  },
                  {
                    "text": "4.8",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  },
                  {
                    "text": "99.75",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "WITHIN",
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "MVVNL · Lucknow",
                    "bold": true
                  },
                  {
                    "text": "154",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  },
                  {
                    "text": "5.6",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  },
                  {
                    "text": "99.71",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "BREACH",
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "KVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "178",
                    "align": "right",
                    "mono": true,
                    "color": "var(--amber)"
                  },
                  {
                    "text": "6.1",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "99.66",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "BREACH",
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DVVNL · Agra",
                    "bold": true
                  },
                  {
                    "text": "204",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "7.1",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "99.61",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "BREACH",
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PuVVNL · Gorakhpur",
                    "bold": true
                  },
                  {
                    "text": "224",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "7.4",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "99.57",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "BREACH",
                    "color": "var(--red)"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "CEA target: SAIDI < 120 min, SAIFI < 4.0. PVVNL is the only DISCOM meeting CEA targets. PuVVNL the worst (rural feeder concentration, ageing infra)."
          }
        ]
      }
    ]
  },
  "rep-companies-act": {
    "title": "Audited Annual Accounts · FY 2025-26",
    "subtitle": "Companies Act §175 · UPPCL standalone & consolidated",
    "docNo": "UPPCL/MCA/AOC-4/FY25-26/2026",
    "classification": "For regulatory filing · MCA + CAG",
    "regulator": "Ministry of Corporate Affairs · CAG · State Govt",
    "legalCite": "Companies Act 2013 §129 + §175 + §148 · MCA Notification AOC-4 · Ind AS applicable",
    "footer": "Adopted by Board of Directors on 18 Sep 2026. Approved by shareholders at 27th AGM on 25 Sep 2026. Filed with MCA Kanpur RoC.",
    "sections": [
      {
        "heading": "1. Directors Report (Excerpts)",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "<strong>U.P. Power Corporation Limited (UPPCL)</strong> is a wholly-owned undertaking of the Government of Uttar Pradesh, incorporated 20 June 2000 under the Companies Act 1956, with Registered Office at Shakti Bhawan, 14-Ashok Marg, Lucknow."
          },
          {
            "kind": "paragraph",
            "html": "UPPCL is primarily engaged in bulk purchase of power from generators and bulk sale to its 5 subsidiary distribution companies: PuVVNL, MVVNL, DVVNL, PVVNL, KESCO."
          },
          {
            "kind": "paragraph",
            "html": "Authorised Share Capital: Rs. 200,000 Cr · Paid-up Share Capital: Rs. 84,420 Cr (post Q4 FY26 allotment of 108 Cr equity shares of Rs. 100 each to GoUP)"
          }
        ]
      },
      {
        "heading": "2. Independent Auditors Report (Summary)",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Statutory Auditor",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "M/s S.N. Dhawan & Co. LLP, Chartered Accountants",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "CAG-empanelled",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "Yes · CA Firm Reg № 000050N/N500045",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Audit period",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "01 Apr 2025 — 31 Mar 2026",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Audit fee (Board approved)",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "Rs. 1.42 Cr · plus reimbursables",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Opinion",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "Qualified opinion · 3 emphasis-of-matter paragraphs",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "EoM-1",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "Subsidy receivable from GoUP Rs. 3,820 Cr · not provided for as doubtful",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "EoM-2",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "GENCO dues reconciliation pending with UPRVUNL Rs. 196 Cr",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "EoM-3",
                    "color": "var(--text-mid)",
                    "width": "38%"
                  },
                  {
                    "text": "Long-term receivables > 5 years aging Rs. 740 Cr · provision adequacy under review",
                    "bold": true,
                    "color": "var(--text)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Balance Sheet · 31 Mar 2026 (Rs. Crore)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Particulars"
              },
              {
                "label": "31 Mar 2026",
                "align": "right"
              },
              {
                "label": "31 Mar 2025",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "EQUITY & LIABILITIES"
                  },
                  {
                    "text": "",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "purple"
              },
              {
                "cells": [
                  {
                    "text": "Equity share capital"
                  },
                  {
                    "text": "84,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "73,616",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Other equity (reserves)"
                  },
                  {
                    "text": "(42,180)",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(38,460)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Long-term borrowings"
                  },
                  {
                    "text": "48,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "45,132",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Long-term provisions"
                  },
                  {
                    "text": "4,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4,520",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Trade payables (long-term)"
                  },
                  {
                    "text": "12,340",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "11,820",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Short-term borrowings"
                  },
                  {
                    "text": "15,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "14,988",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Trade payables (current)"
                  },
                  {
                    "text": "8,640",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "9,180",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Other current liabilities"
                  },
                  {
                    "text": "6,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "6,420",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "TOTAL EQUITY & LIABILITIES"
                  },
                  {
                    "text": "1,39,120",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,27,218",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "purple"
              },
              {
                "cells": [
                  {
                    "text": "ASSETS"
                  },
                  {
                    "text": "",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "purple"
              },
              {
                "cells": [
                  {
                    "text": "Property, Plant & Equipment (net)"
                  },
                  {
                    "text": "68,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "64,820",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Capital work-in-progress (RDSS, smart meters)"
                  },
                  {
                    "text": "18,640",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "14,820",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Long-term receivables (govt subsidy)"
                  },
                  {
                    "text": "3,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3,180",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Trade receivables (current)"
                  },
                  {
                    "text": "12,340",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "11,640",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Inventories (stores, capital spares)"
                  },
                  {
                    "text": "2,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,640",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Cash & cash equivalents"
                  },
                  {
                    "text": "4,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "3,640",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Other current assets"
                  },
                  {
                    "text": "28,240",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "26,478",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "TOTAL ASSETS"
                  },
                  {
                    "text": "1,39,120",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,27,218",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "purple"
              }
            ]
          }
        ]
      },
      {
        "heading": "4. Profit & Loss Statement (Rs. Crore)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Particulars"
              },
              {
                "label": "FY25-26",
                "align": "right"
              },
              {
                "label": "FY24-25",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Revenue from operations (sale of power)"
                  },
                  {
                    "text": "70,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "66,420",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Subsidy from GoUP"
                  },
                  {
                    "text": "14,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "13,640",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Other income"
                  },
                  {
                    "text": "1,240",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,080",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "TOTAL INCOME"
                  },
                  {
                    "text": "86,880",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "81,140",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "purple"
              },
              {
                "cells": [
                  {
                    "text": "Power purchase cost"
                  },
                  {
                    "text": "58,920",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "56,180",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Employee expenses"
                  },
                  {
                    "text": "5,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5,420",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "R&M + A&G expenses"
                  },
                  {
                    "text": "4,180",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4,020",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Depreciation"
                  },
                  {
                    "text": "2,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,720",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Finance cost (interest)"
                  },
                  {
                    "text": "5,920",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5,760",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Other operating expenses"
                  },
                  {
                    "text": "2,640",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,480",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "TOTAL EXPENSES"
                  },
                  {
                    "text": "80,320",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "76,580",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "purple"
              },
              {
                "cells": [
                  {
                    "text": "Profit / (Loss) before tax"
                  },
                  {
                    "text": "6,560",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4,560",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Tax expense"
                  },
                  {
                    "text": "0",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "0",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PROFIT / (LOSS) AFTER TAX"
                  },
                  {
                    "text": "6,560",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "4,560",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ],
                "variant": "green"
              }
            ]
          }
        ]
      },
      {
        "heading": "5. Subsidiary Disclosures · 5 DISCOMs",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DISCOM"
              },
              {
                "label": "Sale volume (MU)",
                "align": "right"
              },
              {
                "label": "Revenue (Rs. Cr)",
                "align": "right"
              },
              {
                "label": "PAT (Rs. Cr)",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "PuVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "19,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "14,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(2,180)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "MVVNL · Lucknow",
                    "bold": true
                  },
                  {
                    "text": "17,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "13,640",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(1,840)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PVVNL · Meerut",
                    "bold": true
                  },
                  {
                    "text": "20,640",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "15,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "1,420",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DVVNL · Agra",
                    "bold": true
                  },
                  {
                    "text": "18,820",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "14,180",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "(2,640)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "KESCO · Kanpur",
                    "bold": true
                  },
                  {
                    "text": "3,420",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2,840",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "180",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "6. Compliance Certifications",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "AOC-4 filed with RoC Kanpur · 28 Sep 2026 ✓",
              "MGT-7 annual return filed · 28 Sep 2026 ✓",
              "DIR-3 KYC completed for all 8 Directors ✓",
              "Statutory Auditor appointed by CAG for FY26-27 · M/s S.N. Dhawan & Co. LLP reappointed",
              "Audited Cost Records · Section 148 compliance: filed CRA-4 on 22 Sep 2026 ✓",
              "CSR expenditure FY25-26: Rs. 24 Cr (against statutory 2% of avg net profit)"
            ]
          }
        ]
      }
    ]
  },
  "rep-weekly-recovery": {
    "title": "Weekly Recovery Report · Wk-19 FY26 (29 Apr — 05 May 2026)",
    "subtitle": "AI-driven cases · assessment, collection, and conversion · 5-DISCOM scope",
    "docNo": "UPPCL/WEEKLY-REC/WK19-FY26",
    "classification": "Internal · for SEs + AENs",
    "regulator": "Auto-generated",
    "legalCite": "Internal performance report",
    "footer": "Auto-generated Mon 06 May 09:00 IST. Distributed to 12 SE + 47 AEN by email. Interactive version on dashboard.",
    "sections": [
      {
        "heading": "1. Week-at-a-Glance",
        "blocks": [
          {
            "kind": "metricGrid",
            "cols": 4,
            "tiles": [
              {
                "label": "Cases closed",
                "value": "107",
                "sub": "this week · ↑18% WoW",
                "tone": "green"
              },
              {
                "label": "Cases confirmed theft",
                "value": "62",
                "sub": "58% hit rate",
                "tone": "purple"
              },
              {
                "label": "Total assessment",
                "value": "₹4.84 Cr",
                "sub": "Sec 135 issued",
                "tone": "red"
              },
              {
                "label": "Total recovered",
                "value": "₹2.84 Cr",
                "sub": "58.7% conversion",
                "tone": "green"
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Recovery Breakdown by DISCOM",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DISCOM"
              },
              {
                "label": "Cases",
                "align": "right"
              },
              {
                "label": "Assessed",
                "align": "right"
              },
              {
                "label": "Recovered",
                "align": "right"
              },
              {
                "label": "Conversion",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "PVVNL · Meerut",
                    "bold": true
                  },
                  {
                    "text": "32",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹1.42 Cr",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.84 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "59.1%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--amber)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "KVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "24",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.96 Cr",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.58 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "60.4%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "MVVNL · Lucknow",
                    "bold": true
                  },
                  {
                    "text": "21",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.84 Cr",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.51 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "60.7%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DVVNL · Agra",
                    "bold": true
                  },
                  {
                    "text": "18",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹1.04 Cr",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.52 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "50.0%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PuVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "12",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.58 Cr",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.39 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "67.2%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Top Performers (Inspector Level)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Inspector"
              },
              {
                "label": "Zone"
              },
              {
                "label": "Cases",
                "align": "right"
              },
              {
                "label": "Hit rate",
                "align": "right"
              },
              {
                "label": "Recovered",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Rajesh Kumar",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Bhelupur",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "11",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "73%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "₹38L",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Sunita Verma",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Gomti Nagar",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "9",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "67%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "₹24L",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Amit Singh",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Residency",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "8",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "63%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "₹18L",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Pavan Kumar",
                    "bold": true
                  },
                  {
                    "text": "PVVNL · Sadar",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "8",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "62%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  },
                  {
                    "text": "₹16L",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "4. Next Week Pipeline",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Inspections scheduled (Wk-20)",
                    "color": "var(--text-mid)",
                    "width": "45%"
                  },
                  {
                    "text": "168 across 5 DISCOMs",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "High-priority cases queued",
                    "color": "var(--text-mid)",
                    "width": "45%"
                  },
                  {
                    "text": "42 (assessed > ₹5L each)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Cluster-driven inspections",
                    "color": "var(--text-mid)",
                    "width": "45%"
                  },
                  {
                    "text": "24 (Aliganj, Sigra, Bhelupur, Kamachha continuations)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Section 135 prosecution batch",
                    "color": "var(--text-mid)",
                    "width": "45%"
                  },
                  {
                    "text": "18 cases ready for vigilance dispatch",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Pending CMD/SE approvals",
                    "color": "var(--text-mid)",
                    "width": "45%"
                  },
                  {
                    "text": "9 inspection orders > ₹50L (urgent)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Forecast recovery (Wk-20)",
                    "color": "var(--text-mid)",
                    "width": "45%"
                  },
                  {
                    "text": "₹3.2 Cr · based on pipeline + historical conversion",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "rep-monthly-dt-audit": {
    "title": "Monthly DT Energy Audit · April 2026",
    "subtitle": "DT input vs &Sigma;-billed reconciliation · per BEE 2021 mandate",
    "docNo": "UPPCL/DT-AUDIT/APR-2026",
    "classification": "Internal · for Chief Engr (Energy Audit) + 5 SE",
    "regulator": "Auto-generated (BEE-compliant format)",
    "legalCite": "BEE Notification 18/1/BEE/DISCOM/2021 · EC Act 2001",
    "footer": "Generated 1st of each month at 06:00 IST. Routed to Chief Engineer (Energy Audit) + 5 SEs. BEE-compliant format per Notification 18/1/BEE/DISCOM/2021.",
    "sections": [
      {
        "heading": "1. State-Level Summary",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Total DTs in network",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "4,82,000",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DT-metered (RDSS funded)",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "1,82,000 (37.8%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTs with reliable readings (Apr 2026)",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "1,68,420 (92.5% of metered)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Aggregate DT input",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "18,640 MU",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Aggregate consumer billed",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "15,082 MU",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Aggregate LT loss",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "3,558 MU (19.1%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "LT loss vs technical baseline",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "+11.4pp commercial loss",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "High-loss DTs flagged (loss > 30%)",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "4,820 (2.9% of metered)",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Top 10 DTs with Loss > 30% (state)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DT ID"
              },
              {
                "label": "Location"
              },
              {
                "label": "Input MU",
                "align": "right"
              },
              {
                "label": "Loss %",
                "align": "right"
              },
              {
                "label": "Action"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "DTR-1849",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Kamachha · KVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.42",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "47.2%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Inspection scheduled",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-2247",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Trans-Yamuna · PVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.38",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "44.8%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "AEN visiting today",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-2391",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Aliganj · MVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.36",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "41.6%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Cluster-flagged",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-1748",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Naini · DVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.34",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "38.9%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Section 135 issued",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-3120",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Sigra · KVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.32",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "37.4%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "AMISP comms down",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-4421",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Padri Bazaar · PuVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.3",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "36.2%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "AEN reassigned",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-1942",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Bhelupur · KVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.29",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "35.8%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Pilot inspection",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-5128",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Civil Lines · DVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.27",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "33.7%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Cluster-flagged",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-3814",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Mahanagar · MVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.26",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "32.4%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Inspection planned",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTR-4642",
                    "mono": true,
                    "bold": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Hapur · PVVNL",
                    "color": "var(--text-mid)",
                    "fontSize": "10.5px"
                  },
                  {
                    "text": "0.24",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "30.9%",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Phase imbalance fixed",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Phase Imbalance Flags",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "DTs with phase imbalance > 25%",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "1,420 (0.8% of metered)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTs with overload R-phase",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "620 — possible hooking on R",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTs with overload Y-phase",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "480 — possible hooking on Y",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTs with overload B-phase",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "320 — possible hooking on B",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Recommended for field verification",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "1,420 (priority by loss × imbalance score)",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "4. Consumer Indexing Gaps",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Consumers without DT mapping",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "12,40,000 (3.0% of 4.18 Cr total)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DTs without complete consumer list",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "6,200 (3.4% of metered)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Mapping accuracy verified (field audit, 8% sample)",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "~70%",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Indexing work pending under RDSS Part-A",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "14.2 lakh consumers",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Target completion (per Action Plan)",
                    "color": "var(--text-mid)",
                    "width": "50%"
                  },
                  {
                    "text": "31 Dec 2026",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "5. Action Items for AENs",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "Field inspection of 4,820 high-loss DTs by 31 May (avg 102/AEN)",
              "Phase imbalance verification: 1,420 DTs — multimeter check + correction",
              "Consumer indexing: complete 14.2 lakh pending mappings (target 31 Dec)",
              "Update meter-DT linkage in MDM for newly installed smart meters (Q1 FY27 cohort)",
              "Submit corrective action plan for any DT with 3 consecutive months > 30% loss"
            ]
          }
        ]
      }
    ]
  },
  "rep-board-pack": {
    "title": "Monthly Board Pack · April 2026",
    "subtitle": "10-slide CMD review deck · auto-routed to Board",
    "docNo": "UPPCL/BOARD-PACK/APR-2026",
    "classification": "Restricted · Board of Directors + Audit Committee",
    "regulator": "Auto-generated (Sec 175 Cos Act format)",
    "legalCite": "Companies Act 2013 §175 · Audit Committee Charter · Articles of Association",
    "footer": "Auto-generated 25th of each month. Distributed to Board of Directors (11 members) + Principal Secretary (Energy) + Audit Committee.",
    "sections": [
      {
        "heading": "1. Slide 1-2: Cover + Executive Summary",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Statutory KPI"
              },
              {
                "label": "Apr 2026",
                "align": "right"
              },
              {
                "label": "Mar 2026",
                "align": "right"
              },
              {
                "label": "MoM",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "AT&C loss",
                    "bold": true
                  },
                  {
                    "text": "20.5%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "20.7%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "-0.2pp",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "ACS-ARR gap",
                    "bold": true
                  },
                  {
                    "text": "₹0.62/kWh",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹0.64",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "-₹0.02",
                    "align": "right",
                    "mono": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Billing efficiency",
                    "bold": true
                  },
                  {
                    "text": "86.2%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "85.9%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+0.3pp",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Collection efficiency",
                    "bold": true
                  },
                  {
                    "text": "94.8%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "94.6%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+0.2pp",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Smart meters · RDSS",
                    "bold": true
                  },
                  {
                    "text": "42.3%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "41.1%",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+1.2pp",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Outstanding dues",
                    "bold": true
                  },
                  {
                    "text": "₹12,340 Cr",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹12,000 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "+₹340 Cr",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Integrated PFC rating",
                    "bold": true
                  },
                  {
                    "text": "B",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "B",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  },
                  {
                    "text": "—",
                    "align": "right",
                    "mono": true,
                    "color": "var(--text-mid)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Slide 3-4: 5-DISCOM Scorecard",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "DISCOM"
              },
              {
                "label": "AT&C",
                "align": "right"
              },
              {
                "label": "Billing",
                "align": "right"
              },
              {
                "label": "Collection",
                "align": "right"
              },
              {
                "label": "Status",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "PVVNL · Meerut",
                    "bold": true
                  },
                  {
                    "text": "18.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "88.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "95.8%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "Best",
                    "align": "right",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "MVVNL · Lucknow",
                    "bold": true
                  },
                  {
                    "text": "19.7%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "87.2%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "95.4%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "On track",
                    "align": "right",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "KVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "19.9%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "87.0%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "94.8%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "On track",
                    "align": "right",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "PuVVNL · Varanasi",
                    "bold": true
                  },
                  {
                    "text": "21.3%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "85.8%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "94.2%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "Lagging",
                    "align": "right",
                    "color": "#fff"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "DVVNL · Agra",
                    "bold": true
                  },
                  {
                    "text": "22.6%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "84.1%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "93.6%",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "At risk",
                    "align": "right",
                    "color": "#fff"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Slide 5-6: AT&C Trajectory + National Peer Position",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "<strong>4-year trajectory:</strong> FY23 25.4% &rarr; FY24 22.8% &rarr; FY25 21.6% &rarr; FY26 (proj) 20.5%. UPERC-committed: FY26 17.5%. Variance: +3.0pp."
          },
          {
            "kind": "paragraph",
            "html": "<strong>National rank: 22 / 30</strong> large-state DISCOMs. UPPCL AT&C 20.5% vs national avg 15.37% (PFC 13th edition + MoP Rajya Sabha reply Nov 2024). Top performers: DGVCL Gujarat 5.2%, TANGEDCO 10.3%, BESCOM 14.8%. UPPCL among top-4 states for accumulated debt."
          }
        ]
      },
      {
        "heading": "4. Slide 7: RDSS Milestone Tracker",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Smart meters sanctioned",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "43.5 lakh",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Installed",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "18.4 lakh (42.3%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Communicating",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "11.2 lakh (25.7%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Sunset",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "31 Mar 2026 · MoP proposed 2-yr extension",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Velocity needed for sunset",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "2.3× current rate",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Loss reduction works · executed",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "47.2% of ₹14,400 Cr sanctioned",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "5. Slide 8: Theft-Detection ROI · KVVNL Varanasi Pilot",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "<strong>VidyutRaksha pilot results (6 months):</strong> 1,116 consumers, 49 DTRs covered. AT&C in pilot zone: 21.2% &rarr; 17.7% (-3.5pp). 6-month recovery: ₹1.42 Cr direct + ₹2.85 Cr deterrence (estimated)."
          },
          {
            "kind": "paragraph",
            "html": "<strong>Annualised scale projection:</strong> If extended state-wide to high-loss zones (top 30% of feeders), estimated recovery ₹47 Cr/year + 1.2pp AT&C reduction."
          }
        ]
      },
      {
        "heading": "6. Slide 9-10: Decisions Awaiting Board + Appendix",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "1. UPERC tariff petition FY26-27 filing",
                    "bold": true
                  },
                  {
                    "text": "15 May (9d)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹2,800 Cr ARR risk",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "2. AMISP Phase-2 PO · 7.2L smart meters",
                    "bold": true
                  },
                  {
                    "text": "20 May (14d)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹204 Cr · RDSS-linked",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "3. Section 135 prosecution batch · 18 cases",
                    "bold": true
                  },
                  {
                    "text": "25 May (19d)",
                    "align": "right",
                    "mono": true,
                    "color": "var(--red)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹14.2 Cr · statute of limitations 3 cases",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              }
            ]
          },
          {
            "kind": "caption",
            "html": "<strong>Appendix:</strong> UPERC pending orders · Subsidy receivable vs UDAY · RPO compliance status (38% vs 43% target) · Privatisation discussion paper (PuVVNL + DVVNL 50:50 PPP)"
          }
        ]
      }
    ]
  },
  "rep-aen-weekly": {
    "title": "AEN Weekly Performance · Wk-19 FY26",
    "subtitle": "Inspector-level scorecard · zone-scoped to each AEN",
    "docNo": "UPPCL/AEN-WEEKLY/WK19-FY26",
    "classification": "Internal · zone-scoped (each AEN sees only their data)",
    "regulator": "Auto-generated",
    "legalCite": "Internal performance management",
    "footer": "Generated Fri 17:00 IST. Each AEN sees only data for their assigned zone. Comparative benchmarks (network avg, rank) computed across all 47 AENs.",
    "sections": [
      {
        "heading": "1. Inspections Completed vs Target (your zone)",
        "blocks": [
          {
            "kind": "metricGrid",
            "cols": 3,
            "tiles": [
              {
                "label": "Target this week",
                "value": "45",
                "sub": "(9 inspections × 5 working days)"
              },
              {
                "label": "Completed",
                "value": "42",
                "sub": "93% of target",
                "tone": "green"
              },
              {
                "label": "Pending (carry-forward)",
                "value": "3",
                "sub": "priority for Mon",
                "tone": "amber"
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Hit Rate vs Network Average",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Your hit rate (Wk-19)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "63%",
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Your hit rate (4-week avg)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "61%",
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Network avg (4-week)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "57%",
                    "bold": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Your rank (among 47 AENs)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "#8",
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Trend",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "Improving · +4pp vs prior month",
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Recovery per Inspector (your zone)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Inspector"
              },
              {
                "label": "Inspections",
                "align": "right"
              },
              {
                "label": "Confirmed",
                "align": "right"
              },
              {
                "label": "Assessment",
                "align": "right"
              },
              {
                "label": "Recovered",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Rajesh Kumar",
                    "bold": true
                  },
                  {
                    "text": "11",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "8",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹52L",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹38L",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Sunita Verma",
                    "bold": true
                  },
                  {
                    "text": "10",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "7",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹38L",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹24L",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Amit Singh",
                    "bold": true
                  },
                  {
                    "text": "9",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "5",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹26L",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹18L",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Priya Mishra",
                    "bold": true
                  },
                  {
                    "text": "7",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "4",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹18L",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹14L",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Vikram Yadav",
                    "bold": true
                  },
                  {
                    "text": "5",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "2",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹8L",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹6L",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--green)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "4. Cases Pending > 7 Days (action needed)",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Inspections pending field visit",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "4 (oldest: 9 days)",
                    "bold": true,
                    "color": "var(--amber)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Assessment orders awaiting your sign-off",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "2",
                    "bold": true,
                    "color": "var(--amber)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Appeals filed against your zone orders",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "1 (hearing 14 May)",
                    "bold": true,
                    "color": "var(--text-mid)"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Section 135 cases ready for prosecution batch",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "3",
                    "bold": true,
                    "color": "var(--ai-purple)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "5. Field Hours Utilisation",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Total field hours (your zone)",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "168 hrs · 5 inspectors × 33.6 hrs avg",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Travel time as % of field hours",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "28% (network avg 32%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Inspection time per case",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "42 min (network avg 38 min)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Recommendation",
                    "color": "var(--text-mid)",
                    "width": "48%"
                  },
                  {
                    "text": "Route optimization saves 12 hrs/week · explore VidyutRaksha route planner",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "rep-sec135-status": {
    "title": "Section 135 Monthly Status · April 2026",
    "subtitle": "Confirmed theft cases + assessment + prosecution pipeline",
    "docNo": "UPPCL/SEC135/APR-2026",
    "classification": "Restricted · Vigilance + Legal Cell",
    "regulator": "Internal · for Vigilance Officers",
    "legalCite": "EA 2003 §135 (theft) + §126 (assessment) + §127 (appeal) · IT Act §65B (electronic evidence)",
    "footer": "Generated 5th of each month. Routed to Vigilance (8 officers) + Legal Cell + CMD office. Court-admissible dossiers maintained with SHA-256 evidence integrity.",
    "sections": [
      {
        "heading": "1. Cases by Status (April 2026)",
        "blocks": [
          {
            "kind": "metricGrid",
            "cols": 4,
            "tiles": [
              {
                "label": "New inspections",
                "value": "342",
                "sub": "opened in April"
              },
              {
                "label": "Confirmed theft",
                "value": "198",
                "sub": "58% hit rate",
                "tone": "purple"
              },
              {
                "label": "Sec 135 orders issued",
                "value": "192",
                "sub": "(6 disputes pending)",
                "tone": "red"
              },
              {
                "label": "Closed with recovery",
                "value": "128",
                "sub": "66.7% conversion",
                "tone": "green"
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Assessment ₹ Summary",
        "blocks": [
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Total assessment ordered (April)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹24.40 Cr",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Recovered in cash",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹16.20 Cr (66.4%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Recovered through installments",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹4.80 Cr (19.7%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Pending recovery (within 30-day window)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹2.40 Cr (9.8%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Under appeal (Section 127)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹1.00 Cr (4.1%)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Avg assessment per case",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "₹1.27 Lakh",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "High-value cases (> ₹50L each)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "7 cases · aggregate ₹6.40 Cr",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Appeals Filed (Section 127 EA 2003)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Appeal stage"
              },
              {
                "label": "Count",
                "align": "right"
              },
              {
                "label": "Amount",
                "align": "right"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Appeals filed this month",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "18",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹1.04 Cr",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Pre-deposit received (1/3rd)",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "18",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹35 Lakh",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Hearings scheduled",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "24",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹2.40 Cr · (Apr + carry-fwd)",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Orders confirmed by Appellate Authority",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "12",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹84 Lakh · upheld",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Orders reduced",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "4",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹38 Lakh · reduced by avg 22%",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Orders set aside",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "2",
                    "align": "right",
                    "mono": true
                  },
                  {
                    "text": "₹16 Lakh · refunded with interest",
                    "align": "right",
                    "mono": true,
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "4. Cases Ready for Prosecution",
        "blocks": [
          {
            "kind": "paragraph",
            "html": "<strong>18 cases recommended for criminal prosecution</strong> by Vigilance Cell, each with confirmed theft > ₹50L. Aggregate exposure ₹14.2 Cr."
          },
          {
            "kind": "table",
            "cols": [],
            "rows": [
              {
                "cells": [
                  {
                    "text": "Court-admissible dossiers ready",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "18 (SHA-256 signed)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Statute of limitations · expiring < 90 days",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "3 cases (URGENT)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Statute of limitations · expiring < 6 months",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "6 cases",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "CMD/SE sanction for prosecution",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "Awaiting (deadline 25 May)",
                    "bold": true
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "Court filing batch · scheduled",
                    "color": "var(--text-mid)",
                    "width": "55%"
                  },
                  {
                    "text": "Jun 2026 (Special Court for Electricity Offences)",
                    "bold": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "5. Top 5 High-Value Cases (> ₹50L)",
        "blocks": [
          {
            "kind": "table",
            "cols": [
              {
                "label": "Case ID"
              },
              {
                "label": "Consumer"
              },
              {
                "label": "Zone"
              },
              {
                "label": "Assessment",
                "align": "right"
              },
              {
                "label": "Status"
              }
            ],
            "rows": [
              {
                "cells": [
                  {
                    "text": "C-20260408-014",
                    "mono": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Bharat Steel Mills",
                    "bold": true
                  },
                  {
                    "text": "KVVNL · Bhelupur",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹1.42 Cr",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Confirmed · prosecution",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "C-20260411-022",
                    "mono": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Mahalakshmi Textiles",
                    "bold": true
                  },
                  {
                    "text": "PVVNL · Sadar",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹1.18 Cr",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Recovery in progress",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "C-20260415-007",
                    "mono": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Krishna Cold Storage",
                    "bold": true
                  },
                  {
                    "text": "DVVNL · Civil Lines",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹98 Lakh",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Recovered · closed",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "C-20260418-031",
                    "mono": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Singh Manufacturing",
                    "bold": true
                  },
                  {
                    "text": "MVVNL · Aliganj",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹84 Lakh",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Section 127 appeal",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              },
              {
                "cells": [
                  {
                    "text": "C-20260422-005",
                    "mono": true,
                    "fontSize": "10px"
                  },
                  {
                    "text": "Annapurna Atta Chakki",
                    "bold": true
                  },
                  {
                    "text": "PuVVNL · Padri Bazaar",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  },
                  {
                    "text": "₹62 Lakh",
                    "align": "right",
                    "mono": true,
                    "bold": true,
                    "color": "var(--red)"
                  },
                  {
                    "text": "Confirmed · prosecution",
                    "color": "var(--text-mid)",
                    "fontSize": "10px"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
