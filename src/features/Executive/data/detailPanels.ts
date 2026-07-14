import type { DetailPanelData, DetailPanelKey } from '../types'

/** 21 slide-out detail panels. Bodies were structured out of the prototype's
 *  original HTML strings; every summary tile, table row, action, and note is
 *  now typed data. Add/replace panels by editing this file only. */
export const DETAIL_PANELS: Record<DetailPanelKey, DetailPanelData> = {
  "atc": {
    "sub": "AT&C Loss · 20.5%",
    "title": "Suspicious Meters — High-Loss Investigation",
    "summary": [
      {
        "tone": "crimson",
        "value": "40,500",
        "label": "Flagged (cum.)"
      },
      {
        "tone": "amber",
        "value": "6,870",
        "label": "Confirmed cases"
      },
      {
        "tone": "brand",
        "value": "₹9,676 Cr",
        "label": "Annual loss"
      }
    ],
    "sections": [
      {
        "header": "Top suspicious meters · auto-flagged by AI",
        "table": {
          "headers": [
            "Meter ID",
            "Location",
            "Anomaly",
            "Flagged",
            "Est. loss/mo"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "MTR-KNP-44218",
                  "bold": true
                },
                {
                  "text": "Kanpur Nagar · F1",
                  "bold": false
                },
                {
                  "text": "Reverse current",
                  "bold": false
                },
                {
                  "text": "2h ago",
                  "bold": false
                },
                {
                  "text": "₹1.2 L",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "MTR-AGR-28912",
                  "bold": true
                },
                {
                  "text": "Agra-South · F3",
                  "bold": false
                },
                {
                  "text": "Bypass detected",
                  "bold": false
                },
                {
                  "text": "4h ago",
                  "bold": false
                },
                {
                  "text": "₹0.9 L",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "MTR-BRL-11045",
                  "bold": true
                },
                {
                  "text": "Bareilly-East · F2",
                  "bold": false
                },
                {
                  "text": "Tamper seal broken",
                  "bold": false
                },
                {
                  "text": "6h ago",
                  "bold": false
                },
                {
                  "text": "₹0.7 L",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "MTR-ALG-92103",
                  "bold": true
                },
                {
                  "text": "Aligarh-Urban",
                  "bold": false
                },
                {
                  "text": "Zero reading · 14 days",
                  "bold": false
                },
                {
                  "text": "1d ago",
                  "bold": false
                },
                {
                  "text": "₹0.5 L",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "MTR-VAR-55320",
                  "bold": true
                },
                {
                  "text": "Varanasi-West",
                  "bold": false
                },
                {
                  "text": "CT/PT mismatch",
                  "bold": false
                },
                {
                  "text": "2d ago",
                  "bold": false
                },
                {
                  "text": "₹1.1 L",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Field verification orders issued",
        "label": "Issue field orders"
      },
      {
        "variant": "ghost",
        "toastMessage": "Batch FIR queued",
        "label": "Batch FIR filing"
      }
    ],
    "note": "⚡ Urban 14.0% · Rural 29.5%. Rural loss driver: feeder pilferage in Bareilly & Agra circles."
  },
  "billing": {
    "sub": "Billing Efficiency · 86.2%",
    "title": "Unbilled & Partial-Billed Consumers",
    "summary": [
      {
        "tone": "amber",
        "value": "48,210",
        "label": "Unbilled this cycle"
      },
      {
        "tone": "crimson",
        "value": "₹62 Cr",
        "label": "Deferred revenue"
      },
      {
        "tone": "jade",
        "value": "86.2%",
        "label": "Billing eff."
      }
    ],
    "sections": [
      {
        "header": "Unbilled by circle",
        "table": {
          "headers": [
            "Circle",
            "DISCOM",
            "Unbilled",
            "Reason",
            "Action"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Kanpur Nagar",
                  "bold": true
                },
                {
                  "text": "PVVNL",
                  "bold": false
                },
                {
                  "text": "12,840",
                  "bold": false
                },
                {
                  "text": "Non-comm meters",
                  "bold": false
                },
                {
                  "text": "Field visit",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Agra-South",
                  "bold": true
                },
                {
                  "text": "DVVNL",
                  "bold": false
                },
                {
                  "text": "9,420",
                  "bold": false
                },
                {
                  "text": "Locked premises",
                  "bold": false
                },
                {
                  "text": "Re-attempt",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Varanasi-West",
                  "bold": true
                },
                {
                  "text": "PuVVNL",
                  "bold": false
                },
                {
                  "text": "8,180",
                  "bold": false
                },
                {
                  "text": "Read disputes",
                  "bold": false
                },
                {
                  "text": "Inspection",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Bareilly-East",
                  "bold": true
                },
                {
                  "text": "MVVNL",
                  "bold": false
                },
                {
                  "text": "7,650",
                  "bold": false
                },
                {
                  "text": "Faulty meters",
                  "bold": false
                },
                {
                  "text": "Replace",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Lucknow-Urban",
                  "bold": true
                },
                {
                  "text": "MVVNL",
                  "bold": false
                },
                {
                  "text": "5,920",
                  "bold": false
                },
                {
                  "text": "Provisional billing",
                  "bold": false
                },
                {
                  "text": "Reconcile",
                  "bold": false
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [],
    "note": "Urban 88.4% · Rural 82.8% — rural gap from remote read failures."
  },
  "collection": {
    "sub": "Collection Efficiency · 94.8%",
    "title": "High-Arrear Defaulters",
    "summary": [
      {
        "tone": "crimson",
        "value": "₹12,340 Cr",
        "label": "Outstanding"
      },
      {
        "tone": "amber",
        "value": "2,84,120",
        "label": "Defaulters >90d"
      },
      {
        "tone": "jade",
        "value": "94.8%",
        "label": "Collection eff."
      }
    ],
    "sections": [
      {
        "header": "Top defaulter segments",
        "table": {
          "headers": [
            "Segment",
            "Consumers",
            "Arrears",
            "Avg dues",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Govt depts",
                  "bold": true
                },
                {
                  "text": "1,240",
                  "bold": false
                },
                {
                  "text": "₹4,820 Cr",
                  "bold": false
                },
                {
                  "text": "₹3.9 Cr",
                  "bold": false
                },
                {
                  "text": "Notice issued",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Industrial >1MW",
                  "bold": true
                },
                {
                  "text": "3,610",
                  "bold": false
                },
                {
                  "text": "₹2,140 Cr",
                  "bold": false
                },
                {
                  "text": "₹59 L",
                  "bold": false
                },
                {
                  "text": "Sec-56 active",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Commercial",
                  "bold": true
                },
                {
                  "text": "42,800",
                  "bold": false
                },
                {
                  "text": "₹1,680 Cr",
                  "bold": false
                },
                {
                  "text": "₹3.9 L",
                  "bold": false
                },
                {
                  "text": "Disconnection",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Domestic >6mo",
                  "bold": true
                },
                {
                  "text": "2,36,470",
                  "bold": false
                },
                {
                  "text": "₹2,223 Cr",
                  "bold": false
                },
                {
                  "text": "₹9,400",
                  "bold": false
                },
                {
                  "text": "Recovery drive",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Never Paid",
                  "bold": true
                },
                {
                  "text": "2,84,120",
                  "bold": false
                },
                {
                  "text": "₹982 Cr",
                  "bold": false
                },
                {
                  "text": "₹3,457",
                  "bold": false
                },
                {
                  "text": "Legal action",
                  "bold": false,
                  "tone": "brand"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [],
    "note": "Urban 96.2% · Rural 92.1%. Gap concentrated in PuVVNL & DVVNL divisions."
  },
  "peak": {
    "sub": "Peak Demand · 18,420 MW",
    "title": "Peak-Hour Demand by Circle",
    "summary": [
      {
        "tone": "amber",
        "value": "18,420 MW",
        "label": "State peak (7 PM)"
      },
      {
        "tone": "jade",
        "value": "17,860 MW",
        "label": "Available"
      },
      {
        "tone": "crimson",
        "value": "−560 MW",
        "label": "Deficit"
      }
    ],
    "sections": [
      {
        "header": "Top 5 circles · 7 PM today",
        "table": {
          "headers": [
            "Circle",
            "Demand (MW)",
            "Supplied",
            "Status",
            "Shed (min)"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Lucknow",
                  "bold": true
                },
                {
                  "text": "3,210",
                  "bold": false
                },
                {
                  "text": "3,180",
                  "bold": false
                },
                {
                  "text": "OK",
                  "bold": false
                },
                {
                  "text": "—",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kanpur",
                  "bold": true
                },
                {
                  "text": "2,840",
                  "bold": false
                },
                {
                  "text": "2,720",
                  "bold": false
                },
                {
                  "text": "Tight",
                  "bold": false,
                  "tone": "amber"
                },
                {
                  "text": "22",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Agra",
                  "bold": true
                },
                {
                  "text": "2,180",
                  "bold": false
                },
                {
                  "text": "2,090",
                  "bold": false
                },
                {
                  "text": "Tight",
                  "bold": false,
                  "tone": "amber"
                },
                {
                  "text": "35",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Varanasi",
                  "bold": true
                },
                {
                  "text": "1,940",
                  "bold": false
                },
                {
                  "text": "1,780",
                  "bold": false
                },
                {
                  "text": "Shed",
                  "bold": false,
                  "tone": "crimson"
                },
                {
                  "text": "58",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Bareilly",
                  "bold": true
                },
                {
                  "text": "1,620",
                  "bold": false
                },
                {
                  "text": "1,510",
                  "bold": false
                },
                {
                  "text": "Shed",
                  "bold": false,
                  "tone": "crimson"
                },
                {
                  "text": "72",
                  "bold": false
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [],
    "note": "Urban 10,700 MW · Rural 7,720 MW. Rural shedding hours significantly higher."
  },
  "supply": {
    "sub": "Supply Available · 17,860 MW",
    "title": "Generation Source Status",
    "summary": [
      {
        "tone": "jade",
        "value": "17,860 MW",
        "label": "Total available"
      },
      {
        "tone": "brand",
        "value": "3,680 MW",
        "label": "Renewable"
      },
      {
        "tone": "crimson",
        "value": "560 MW",
        "label": "Short"
      }
    ],
    "sections": [
      {
        "header": "Source breakdown",
        "table": {
          "headers": [
            "Source",
            "Capacity (MW)",
            "Generating",
            "Util.",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Thermal (state)",
                  "bold": true
                },
                {
                  "text": "12,400",
                  "bold": false
                },
                {
                  "text": "11,200",
                  "bold": false
                },
                {
                  "text": "90%",
                  "bold": false
                },
                {
                  "text": "Normal",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Thermal (central)",
                  "bold": true
                },
                {
                  "text": "5,800",
                  "bold": false
                },
                {
                  "text": "5,420",
                  "bold": false
                },
                {
                  "text": "93%",
                  "bold": false
                },
                {
                  "text": "Normal",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Hydro",
                  "bold": true
                },
                {
                  "text": "1,820",
                  "bold": false
                },
                {
                  "text": "1,360",
                  "bold": false
                },
                {
                  "text": "75%",
                  "bold": false
                },
                {
                  "text": "Low storage",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Solar",
                  "bold": true
                },
                {
                  "text": "3,200",
                  "bold": false
                },
                {
                  "text": "620",
                  "bold": false
                },
                {
                  "text": "19%",
                  "bold": false
                },
                {
                  "text": "Evening dip",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Wind",
                  "bold": true
                },
                {
                  "text": "1,400",
                  "bold": false
                },
                {
                  "text": "840",
                  "bold": false
                },
                {
                  "text": "60%",
                  "bold": false
                },
                {
                  "text": "Steady",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Imports/Banking",
                  "bold": true
                },
                {
                  "text": "2,200",
                  "bold": false
                },
                {
                  "text": "4,360",
                  "bold": false
                },
                {
                  "text": "—",
                  "bold": false
                },
                {
                  "text": "Active",
                  "bold": false,
                  "tone": "brand"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Procurement alerted: 700 MW gap",
        "label": "Alert procurement"
      }
    ]
  },
  "saidi": {
    "sub": "SAIDI · 12.2 hr/yr",
    "title": "Recent Outage Incidents",
    "summary": [
      {
        "tone": "crimson",
        "value": "340",
        "label": "Active outages"
      },
      {
        "tone": "amber",
        "value": "48",
        "label": "Planned this wk"
      },
      {
        "tone": "crimson",
        "value": "4.2 hr",
        "label": "Avg restore"
      }
    ],
    "sections": [
      {
        "header": "Outages today · top by impact",
        "table": {
          "headers": [
            "Time",
            "Location",
            "Cause",
            "Affected",
            "Duration"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "14:22",
                  "bold": false
                },
                {
                  "text": "Varanasi-City",
                  "bold": true
                },
                {
                  "text": "SS fire",
                  "bold": false
                },
                {
                  "text": "1.2 L",
                  "bold": false
                },
                {
                  "text": "Active",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "11:48",
                  "bold": false
                },
                {
                  "text": "Agra-South",
                  "bold": true
                },
                {
                  "text": "Tower collapse",
                  "bold": false
                },
                {
                  "text": "42 K",
                  "bold": false
                },
                {
                  "text": "3h 18m",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "09:30",
                  "bold": false
                },
                {
                  "text": "Kanpur-East",
                  "bold": true
                },
                {
                  "text": "Cable fault",
                  "bold": false
                },
                {
                  "text": "18 K",
                  "bold": false
                },
                {
                  "text": "1h 52m",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "07:15",
                  "bold": false
                },
                {
                  "text": "Bareilly",
                  "bold": true
                },
                {
                  "text": "DT failure",
                  "bold": false
                },
                {
                  "text": "6.4 K",
                  "bold": false
                },
                {
                  "text": "55m",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "06:02",
                  "bold": false
                },
                {
                  "text": "Lucknow-W",
                  "bold": true
                },
                {
                  "text": "11kV fault",
                  "bold": false
                },
                {
                  "text": "3.1 K",
                  "bold": false
                },
                {
                  "text": "38m",
                  "bold": false
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [],
    "note": "Urban 9.2 · Rural 16.8 hr/yr. Rural restoration impacted by sparse crew coverage."
  },
  "smart": {
    "sub": "Smart Meter · 36%",
    "title": "Smart Meter Installation Pipeline",
    "summary": [
      {
        "tone": "jade",
        "value": "15.2 L",
        "label": "Installed"
      },
      {
        "tone": "brand",
        "value": "42 L",
        "label": "Target FY26"
      },
      {
        "tone": "amber",
        "value": "27 L",
        "label": "Pending"
      }
    ],
    "sections": [
      {
        "header": "Pipeline by DISCOM",
        "table": {
          "headers": [
            "DISCOM",
            "Installed",
            "Target",
            "Pending",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "PVVNL",
                  "bold": true
                },
                {
                  "text": "4.8 L",
                  "bold": false
                },
                {
                  "text": "12 L",
                  "bold": false
                },
                {
                  "text": "7.2 L",
                  "bold": false
                },
                {
                  "text": "On-track",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "MVVNL",
                  "bold": true
                },
                {
                  "text": "3.6 L",
                  "bold": false
                },
                {
                  "text": "10 L",
                  "bold": false
                },
                {
                  "text": "6.4 L",
                  "bold": false
                },
                {
                  "text": "On-track",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "KVVNL",
                  "bold": true
                },
                {
                  "text": "3.2 L",
                  "bold": false
                },
                {
                  "text": "8 L",
                  "bold": false
                },
                {
                  "text": "4.8 L",
                  "bold": false
                },
                {
                  "text": "Ahead",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "PuVVNL",
                  "bold": true
                },
                {
                  "text": "2.4 L",
                  "bold": false
                },
                {
                  "text": "7 L",
                  "bold": false
                },
                {
                  "text": "4.6 L",
                  "bold": false
                },
                {
                  "text": "Behind",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "DVVNL",
                  "bold": true
                },
                {
                  "text": "1.2 L",
                  "bold": false
                },
                {
                  "text": "5 L",
                  "bold": false
                },
                {
                  "text": "3.8 L",
                  "bold": false
                },
                {
                  "text": "Behind",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [],
    "note": "Urban 48% · Rural 17%. Rural rollout slowed by communication infrastructure."
  },
  "revenue": {
    "sub": "Revenue Billed · ₹19,432 Cr",
    "title": "Top Revenue Contributors",
    "summary": [
      {
        "tone": "jade",
        "value": "₹19,432 Cr",
        "label": "Billed (FYTD)"
      },
      {
        "tone": "jade",
        "value": "₹18,422 Cr",
        "label": "Collected"
      },
      {
        "tone": "jade",
        "value": "+3.2%",
        "label": "MoM"
      }
    ],
    "sections": [
      {
        "header": "Top 5 contributing circles",
        "table": {
          "headers": [
            "Circle",
            "Billed (₹ Cr)",
            "Collected (₹ Cr)",
            "Eff. %",
            "MoM"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Lucknow-Urban",
                  "bold": true
                },
                {
                  "text": "612",
                  "bold": false
                },
                {
                  "text": "580",
                  "bold": false
                },
                {
                  "text": "94.8%",
                  "bold": false
                },
                {
                  "text": "+4.2%",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kanpur-Nagar",
                  "bold": true
                },
                {
                  "text": "548",
                  "bold": false
                },
                {
                  "text": "468",
                  "bold": false
                },
                {
                  "text": "85.4%",
                  "bold": false
                },
                {
                  "text": "+1.8%",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Noida-Ghaziabad",
                  "bold": true
                },
                {
                  "text": "520",
                  "bold": false
                },
                {
                  "text": "502",
                  "bold": false
                },
                {
                  "text": "96.5%",
                  "bold": false
                },
                {
                  "text": "+5.1%",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Agra",
                  "bold": true
                },
                {
                  "text": "384",
                  "bold": false
                },
                {
                  "text": "310",
                  "bold": false
                },
                {
                  "text": "80.7%",
                  "bold": false
                },
                {
                  "text": "−2.1%",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Varanasi",
                  "bold": true
                },
                {
                  "text": "346",
                  "bold": false
                },
                {
                  "text": "296",
                  "bold": false
                },
                {
                  "text": "85.5%",
                  "bold": false
                },
                {
                  "text": "+0.6%",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [],
    "note": "Urban ₹12,400 Cr · Rural ₹7,032 Cr. Urban share 64% of total billing."
  },
  "alert1": {
    "sub": "P1 Critical · AT&C Loss",
    "title": "Kanpur AT&C Inspection — High-Loss Feeders",
    "summary": [
      {
        "tone": "crimson",
        "value": "48.2%",
        "label": "Worst feeder loss"
      },
      {
        "tone": "crimson",
        "value": "₹18.5 Cr",
        "label": "Monthly risk"
      },
      {
        "tone": "amber",
        "value": "12",
        "label": "Feeders flagged"
      }
    ],
    "sections": [
      {
        "header": "Top high-loss feeders",
        "table": {
          "headers": [
            "Feeder",
            "AT&C %",
            "Input (MU)",
            "Rev. loss/mo",
            "Last audit"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Kanpur-Nagar F1",
                  "bold": true
                },
                {
                  "text": "48.2%",
                  "bold": false,
                  "tone": "crimson"
                },
                {
                  "text": "82",
                  "bold": false
                },
                {
                  "text": "₹5.2 Cr",
                  "bold": false
                },
                {
                  "text": "120d ago",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kanpur-Cantt F3",
                  "bold": true
                },
                {
                  "text": "42.8%",
                  "bold": false,
                  "tone": "crimson"
                },
                {
                  "text": "64",
                  "bold": false
                },
                {
                  "text": "₹3.8 Cr",
                  "bold": false
                },
                {
                  "text": "95d ago",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kanpur-South F2",
                  "bold": true
                },
                {
                  "text": "37.4%",
                  "bold": false,
                  "tone": "amber"
                },
                {
                  "text": "58",
                  "bold": false
                },
                {
                  "text": "₹2.6 Cr",
                  "bold": false
                },
                {
                  "text": "78d ago",
                  "bold": false
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Anti-theft drive initiated",
        "label": "Launch drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Inspection team dispatched",
        "label": "Dispatch team"
      }
    ]
  },
  "alert2": {
    "sub": "P1 Critical · Outage",
    "title": "Varanasi Substation Outage",
    "summary": [
      {
        "tone": "crimson",
        "value": "4",
        "label": "Sub-stations down"
      },
      {
        "tone": "crimson",
        "value": "1.2 L",
        "label": "Consumers affected"
      },
      {
        "tone": "amber",
        "value": "2h 14m",
        "label": "Elapsed"
      }
    ],
    "sections": [
      {
        "header": "Affected substations",
        "table": {
          "headers": [
            "Substation",
            "Capacity",
            "Status",
            "Affected",
            "ETA"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Varanasi-City 132kV",
                  "bold": true
                },
                {
                  "text": "100 MVA",
                  "bold": false
                },
                {
                  "text": "Fire",
                  "bold": false,
                  "tone": "crimson"
                },
                {
                  "text": "48,000",
                  "bold": false
                },
                {
                  "text": "4h",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Sigra 33kV",
                  "bold": true
                },
                {
                  "text": "40 MVA",
                  "bold": false
                },
                {
                  "text": "Down",
                  "bold": false,
                  "tone": "crimson"
                },
                {
                  "text": "32,000",
                  "bold": false
                },
                {
                  "text": "2h",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Lanka 33kV",
                  "bold": true
                },
                {
                  "text": "25 MVA",
                  "bold": false
                },
                {
                  "text": "Partial",
                  "bold": false,
                  "tone": "amber"
                },
                {
                  "text": "24,000",
                  "bold": false
                },
                {
                  "text": "1h",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "BHU 11kV",
                  "bold": true
                },
                {
                  "text": "10 MVA",
                  "bold": false
                },
                {
                  "text": "Partial",
                  "bold": false,
                  "tone": "amber"
                },
                {
                  "text": "16,000",
                  "bold": false
                },
                {
                  "text": "45m",
                  "bold": false
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "PuVVNL CE escalated",
        "label": "Escalate to CE"
      }
    ]
  },
  "alert3": {
    "sub": "P1 Critical · Supply",
    "title": "Peak Shortage — 7 PM Today",
    "summary": [
      {
        "tone": "crimson",
        "value": "560 MW",
        "label": "Deficit"
      },
      {
        "tone": "amber",
        "value": "19:00",
        "label": "Peak hour"
      },
      {
        "tone": "amber",
        "value": "₹4.2 Cr",
        "label": "Spot cost"
      }
    ],
    "sections": [
      {
        "header": "Mitigation options",
        "table": {
          "headers": [
            "Option",
            "Capacity",
            "Cost (₹/u)",
            "Lead time",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "IEX Real-time",
                  "bold": true
                },
                {
                  "text": "450 MW",
                  "bold": false
                },
                {
                  "text": "9.80",
                  "bold": false
                },
                {
                  "text": "30 min",
                  "bold": false
                },
                {
                  "text": "Available",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Banking return",
                  "bold": true
                },
                {
                  "text": "180 MW",
                  "bold": false
                },
                {
                  "text": "5.20",
                  "bold": false
                },
                {
                  "text": "1 hr",
                  "bold": false
                },
                {
                  "text": "Confirmed",
                  "bold": false,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "DSM overdraw",
                  "bold": true
                },
                {
                  "text": "120 MW",
                  "bold": false
                },
                {
                  "text": "13.50",
                  "bold": false
                },
                {
                  "text": "Immediate",
                  "bold": false
                },
                {
                  "text": "Penalty risk",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Urban DR",
                  "bold": true
                },
                {
                  "text": "80 MW",
                  "bold": false
                },
                {
                  "text": "—",
                  "bold": false
                },
                {
                  "text": "15 min",
                  "bold": false
                },
                {
                  "text": "Voluntary",
                  "bold": false
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "IEX bid placed: 450 MW",
        "label": "Bid on IEX"
      }
    ]
  },
  "alert4": {
    "sub": "P1 Critical · Revenue",
    "title": "DVVNL Collection Drop",
    "summary": [
      {
        "tone": "crimson",
        "value": "82%",
        "label": "Collection eff."
      },
      {
        "tone": "crimson",
        "value": "₹482 Cr",
        "label": "Monthly gap"
      },
      {
        "tone": "crimson",
        "value": "−6 pp",
        "label": "vs prev month"
      }
    ],
    "sections": [
      {
        "header": "DVVNL divisions · collection gap",
        "table": {
          "headers": [
            "Division",
            "Billed (₹ Cr)",
            "Collected",
            "Eff. %",
            "Action"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Agra City",
                  "bold": true
                },
                {
                  "text": "142",
                  "bold": false
                },
                {
                  "text": "108",
                  "bold": false
                },
                {
                  "text": "76.1%",
                  "bold": false
                },
                {
                  "text": "Disconnection drive",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Mathura",
                  "bold": true
                },
                {
                  "text": "98",
                  "bold": false
                },
                {
                  "text": "78",
                  "bold": false
                },
                {
                  "text": "79.6%",
                  "bold": false
                },
                {
                  "text": "Notice batch",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Firozabad",
                  "bold": true
                },
                {
                  "text": "84",
                  "bold": false
                },
                {
                  "text": "69",
                  "bold": false
                },
                {
                  "text": "82.1%",
                  "bold": false
                },
                {
                  "text": "Field visits",
                  "bold": false
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Etawah",
                  "bold": true
                },
                {
                  "text": "62",
                  "bold": false
                },
                {
                  "text": "54",
                  "bold": false
                },
                {
                  "text": "87.1%",
                  "bold": false
                },
                {
                  "text": "Monitor",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Mainpuri",
                  "bold": true
                },
                {
                  "text": "48",
                  "bold": false
                },
                {
                  "text": "41",
                  "bold": false
                },
                {
                  "text": "85.4%",
                  "bold": false
                },
                {
                  "text": "Monitor",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Sec-56 notices issued to 1,240 consumers",
        "label": "Issue Sec-56"
      }
    ]
  },
  "discom-pvvnl": {
    "sub": "P1 Tamper · PVVNL · 1,482 tamper cases",
    "title": "PVVNL · 1,482 tamper cases",
    "summary": [
      {
        "tone": "crimson",
        "value": "1,482",
        "label": "Tamper cases"
      },
      {
        "tone": "crimson",
        "value": "₹6.2 Cr",
        "label": "Monthly risk"
      },
      {
        "tone": "brand",
        "value": "92%",
        "label": "Bar utilization"
      }
    ],
    "sections": [
      {
        "header": "Top affected divisions",
        "table": {
          "headers": [
            "Division",
            "Cases",
            "Top anomaly",
            "Loss/mo"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Meerut City",
                  "bold": true
                },
                {
                  "text": "342",
                  "bold": false
                },
                {
                  "text": "Reverse current",
                  "bold": false
                },
                {
                  "text": "₹1.4 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Saharanpur",
                  "bold": true
                },
                {
                  "text": "298",
                  "bold": false
                },
                {
                  "text": "Bypass",
                  "bold": false
                },
                {
                  "text": "₹1.2 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Bulandshahr",
                  "bold": true
                },
                {
                  "text": "264",
                  "bold": false
                },
                {
                  "text": "Tamper seal",
                  "bold": false
                },
                {
                  "text": "₹1.0 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Moradabad",
                  "bold": true
                },
                {
                  "text": "248",
                  "bold": false
                },
                {
                  "text": "CT/PT mismatch",
                  "bold": false
                },
                {
                  "text": "₹0.9 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Bijnor",
                  "bold": true
                },
                {
                  "text": "198",
                  "bold": false
                },
                {
                  "text": "Zero reading",
                  "bold": false
                },
                {
                  "text": "₹0.7 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Paschimanchal Vidyut Vitran Nigam anti-theft drive launched",
        "label": "Launch anti-theft drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Inspection team dispatched to hotspots",
        "label": "Dispatch teams"
      }
    ],
    "note": "Hotspot divisions: Meerut, Saharanpur, Bulandshahr. Paschimanchal Vidyut Vitran Nigam accounts for 1,482 cases this month."
  },
  "discom-mvvnl": {
    "sub": "P1 Tamper · MVVNL · 1,186 tamper cases · Bareilly hotspot",
    "title": "MVVNL · 1,186 tamper cases · Bareilly hotspot",
    "summary": [
      {
        "tone": "crimson",
        "value": "1,186",
        "label": "Tamper cases"
      },
      {
        "tone": "crimson",
        "value": "₹4.8 Cr",
        "label": "Monthly risk"
      },
      {
        "tone": "brand",
        "value": "73%",
        "label": "Bar utilization"
      }
    ],
    "sections": [
      {
        "header": "Top affected divisions",
        "table": {
          "headers": [
            "Division",
            "Cases",
            "Top anomaly",
            "Loss/mo"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Bareilly-East",
                  "bold": true
                },
                {
                  "text": "412",
                  "bold": false
                },
                {
                  "text": "Reverse current",
                  "bold": false
                },
                {
                  "text": "₹1.8 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Sitapur",
                  "bold": true
                },
                {
                  "text": "248",
                  "bold": false
                },
                {
                  "text": "Bypass",
                  "bold": false
                },
                {
                  "text": "₹0.9 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Hardoi",
                  "bold": true
                },
                {
                  "text": "198",
                  "bold": false
                },
                {
                  "text": "Tamper seal",
                  "bold": false
                },
                {
                  "text": "₹0.7 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Lakhimpur",
                  "bold": true
                },
                {
                  "text": "184",
                  "bold": false
                },
                {
                  "text": "Zero reading",
                  "bold": false
                },
                {
                  "text": "₹0.6 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Pilibhit",
                  "bold": true
                },
                {
                  "text": "144",
                  "bold": false
                },
                {
                  "text": "CT/PT mismatch",
                  "bold": false
                },
                {
                  "text": "₹0.5 Cr",
                  "bold": true,
                  "tone": "crimson"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Madhyanchal Vidyut Vitran Nigam anti-theft drive launched",
        "label": "Launch anti-theft drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Inspection team dispatched to hotspots",
        "label": "Dispatch teams"
      }
    ],
    "note": "Hotspot divisions: Bareilly, Sitapur, Hardoi. Madhyanchal Vidyut Vitran Nigam accounts for 1,186 cases this month."
  },
  "discom-dvvnl": {
    "sub": "P2 Tamper · DVVNL · 924 tamper cases",
    "title": "DVVNL · 924 tamper cases",
    "summary": [
      {
        "tone": "amber",
        "value": "924",
        "label": "Tamper cases"
      },
      {
        "tone": "amber",
        "value": "₹3.6 Cr",
        "label": "Monthly risk"
      },
      {
        "tone": "brand",
        "value": "57%",
        "label": "Bar utilization"
      }
    ],
    "sections": [
      {
        "header": "Top affected divisions",
        "table": {
          "headers": [
            "Division",
            "Cases",
            "Top anomaly",
            "Loss/mo"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Agra-South",
                  "bold": true
                },
                {
                  "text": "248",
                  "bold": false
                },
                {
                  "text": "Reverse current",
                  "bold": false
                },
                {
                  "text": "₹1.0 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Mathura",
                  "bold": true
                },
                {
                  "text": "198",
                  "bold": false
                },
                {
                  "text": "Bypass",
                  "bold": false
                },
                {
                  "text": "₹0.8 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Firozabad",
                  "bold": true
                },
                {
                  "text": "184",
                  "bold": false
                },
                {
                  "text": "Tamper seal",
                  "bold": false
                },
                {
                  "text": "₹0.7 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Etawah",
                  "bold": true
                },
                {
                  "text": "158",
                  "bold": false
                },
                {
                  "text": "CT/PT mismatch",
                  "bold": false
                },
                {
                  "text": "₹0.6 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Mainpuri",
                  "bold": true
                },
                {
                  "text": "136",
                  "bold": false
                },
                {
                  "text": "Zero reading",
                  "bold": false
                },
                {
                  "text": "₹0.5 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Dakshinanchal Vidyut Vitran Nigam anti-theft drive launched",
        "label": "Launch anti-theft drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Inspection team dispatched to hotspots",
        "label": "Dispatch teams"
      }
    ],
    "note": "Hotspot divisions: Agra, Mathura, Firozabad. Dakshinanchal Vidyut Vitran Nigam accounts for 924 cases this month."
  },
  "discom-puvvnl": {
    "sub": "P2 Tamper · PuVVNL · 812 tamper cases",
    "title": "PuVVNL · 812 tamper cases",
    "summary": [
      {
        "tone": "amber",
        "value": "812",
        "label": "Tamper cases"
      },
      {
        "tone": "amber",
        "value": "₹3.2 Cr",
        "label": "Monthly risk"
      },
      {
        "tone": "brand",
        "value": "50%",
        "label": "Bar utilization"
      }
    ],
    "sections": [
      {
        "header": "Top affected divisions",
        "table": {
          "headers": [
            "Division",
            "Cases",
            "Top anomaly",
            "Loss/mo"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Varanasi-West",
                  "bold": true
                },
                {
                  "text": "228",
                  "bold": false
                },
                {
                  "text": "Reverse current",
                  "bold": false
                },
                {
                  "text": "₹0.9 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Allahabad",
                  "bold": true
                },
                {
                  "text": "184",
                  "bold": false
                },
                {
                  "text": "Bypass",
                  "bold": false
                },
                {
                  "text": "₹0.7 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Mirzapur",
                  "bold": true
                },
                {
                  "text": "152",
                  "bold": false
                },
                {
                  "text": "Tamper seal",
                  "bold": false
                },
                {
                  "text": "₹0.6 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Ghazipur",
                  "bold": true
                },
                {
                  "text": "138",
                  "bold": false
                },
                {
                  "text": "Zero reading",
                  "bold": false
                },
                {
                  "text": "₹0.5 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Jaunpur",
                  "bold": true
                },
                {
                  "text": "110",
                  "bold": false
                },
                {
                  "text": "CT/PT mismatch",
                  "bold": false
                },
                {
                  "text": "₹0.5 Cr",
                  "bold": true,
                  "tone": "amber"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Purvanchal Vidyut Vitran Nigam anti-theft drive launched",
        "label": "Launch anti-theft drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Inspection team dispatched to hotspots",
        "label": "Dispatch teams"
      }
    ],
    "note": "Hotspot divisions: Varanasi, Allahabad, Mirzapur. Purvanchal Vidyut Vitran Nigam accounts for 812 cases this month."
  },
  "discom-kesco": {
    "sub": "P3 Tamper · KESCO · 438 tamper cases",
    "title": "KESCO · 438 tamper cases",
    "summary": [
      {
        "tone": "jade",
        "value": "438",
        "label": "Tamper cases"
      },
      {
        "tone": "jade",
        "value": "₹1.6 Cr",
        "label": "Monthly risk"
      },
      {
        "tone": "brand",
        "value": "27%",
        "label": "Bar utilization"
      }
    ],
    "sections": [
      {
        "header": "Top affected divisions",
        "table": {
          "headers": [
            "Division",
            "Cases",
            "Top anomaly",
            "Loss/mo"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Kanpur-Nagar",
                  "bold": true
                },
                {
                  "text": "148",
                  "bold": false
                },
                {
                  "text": "Reverse current",
                  "bold": false
                },
                {
                  "text": "₹0.6 Cr",
                  "bold": true,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kanpur-Cantt",
                  "bold": true
                },
                {
                  "text": "92",
                  "bold": false
                },
                {
                  "text": "Bypass",
                  "bold": false
                },
                {
                  "text": "₹0.4 Cr",
                  "bold": true,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kanpur-Central",
                  "bold": true
                },
                {
                  "text": "78",
                  "bold": false
                },
                {
                  "text": "Tamper seal",
                  "bold": false
                },
                {
                  "text": "₹0.3 Cr",
                  "bold": true,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Kalyanpur",
                  "bold": true
                },
                {
                  "text": "64",
                  "bold": false
                },
                {
                  "text": "Zero reading",
                  "bold": false
                },
                {
                  "text": "₹0.2 Cr",
                  "bold": true,
                  "tone": "jade"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Govind Nagar",
                  "bold": true
                },
                {
                  "text": "56",
                  "bold": false
                },
                {
                  "text": "CT/PT mismatch",
                  "bold": false
                },
                {
                  "text": "₹0.1 Cr",
                  "bold": true,
                  "tone": "jade"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Kanpur Electricity Supply Company anti-theft drive launched",
        "label": "Launch anti-theft drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Inspection team dispatched to hotspots",
        "label": "Dispatch teams"
      }
    ],
    "note": "Hotspot divisions: Kanpur-Nagar, Kanpur-Cantt, Kanpur-Central. Kanpur Electricity Supply Company accounts for 438 cases this month."
  },
  "dues-03": {
    "sub": "Outstanding Dues · 25% of ₹12,340 Cr",
    "title": "0–3 Months Aging",
    "summary": [
      {
        "tone": "amber",
        "value": "₹3,100 Cr",
        "label": "Aging total"
      },
      {
        "tone": "amber",
        "value": "25%",
        "label": "Share of dues"
      },
      {
        "tone": "amber",
        "value": "88 L",
        "label": "Consumers"
      }
    ],
    "sections": [
      {
        "header": "Defaulter breakdown by segment",
        "table": {
          "headers": [
            "Segment",
            "Consumers",
            "Arrears",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Domestic >5kW",
                  "bold": true
                },
                {
                  "text": "3,240",
                  "bold": false
                },
                {
                  "text": "₹2,820 Cr",
                  "bold": false
                },
                {
                  "text": "Sec-56 active",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Industrial LT",
                  "bold": true
                },
                {
                  "text": "1,820",
                  "bold": false
                },
                {
                  "text": "₹1,940 Cr",
                  "bold": false
                },
                {
                  "text": "Reminder issued",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Commercial",
                  "bold": true
                },
                {
                  "text": "1,140",
                  "bold": false
                },
                {
                  "text": "₹1,180 Cr",
                  "bold": false
                },
                {
                  "text": "Disconnection notice",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Govt depts",
                  "bold": true
                },
                {
                  "text": "680",
                  "bold": false
                },
                {
                  "text": "₹847 Cr",
                  "bold": false
                },
                {
                  "text": "Liaison ongoing",
                  "bold": false,
                  "tone": "amber"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Recovery drive launched for 0–3 Months Aging",
        "label": "Launch recovery drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Disconnection batch queued",
        "label": "Batch disconnection"
      }
    ],
    "note": "⚡ This bucket contributes 25% of total ₹12,340 Cr outstanding. Bucket status: <strong>recent</strong>."
  },
  "dues-36": {
    "sub": "Outstanding Dues · 17% of ₹12,340 Cr",
    "title": "3–6 Months Aging",
    "summary": [
      {
        "tone": "crimson",
        "value": "₹2,060 Cr",
        "label": "Aging total"
      },
      {
        "tone": "crimson",
        "value": "17%",
        "label": "Share of dues"
      },
      {
        "tone": "crimson",
        "value": "58 L",
        "label": "Consumers"
      }
    ],
    "sections": [
      {
        "header": "Defaulter breakdown by segment",
        "table": {
          "headers": [
            "Segment",
            "Consumers",
            "Arrears",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Industrial HT",
                  "bold": true
                },
                {
                  "text": "1,420",
                  "bold": false
                },
                {
                  "text": "₹1,148 Cr",
                  "bold": false
                },
                {
                  "text": "Disconnection scheduled",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Domestic >6kW",
                  "bold": true
                },
                {
                  "text": "1,840",
                  "bold": false
                },
                {
                  "text": "₹920 Cr",
                  "bold": false
                },
                {
                  "text": "Sec-56 served",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Commercial",
                  "bold": true
                },
                {
                  "text": "620",
                  "bold": false
                },
                {
                  "text": "₹720 Cr",
                  "bold": false
                },
                {
                  "text": "FIR filed",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Govt depts",
                  "bold": true
                },
                {
                  "text": "340",
                  "bold": false
                },
                {
                  "text": "₹542 Cr",
                  "bold": false
                },
                {
                  "text": "High-level escalation",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Recovery drive launched for 3–6 Months Aging",
        "label": "Launch recovery drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Disconnection batch queued",
        "label": "Batch disconnection"
      }
    ],
    "note": "⚡ This bucket contributes 17% of total ₹12,340 Cr outstanding. Bucket status: <strong>serious</strong>."
  },
  "dues-6p": {
    "sub": "Outstanding Dues · 58% of ₹12,340 Cr",
    "title": "6+ Months Aging",
    "summary": [
      {
        "tone": "crimson",
        "value": "₹7,180 Cr",
        "label": "Aging total"
      },
      {
        "tone": "crimson",
        "value": "58%",
        "label": "Share of dues"
      },
      {
        "tone": "crimson",
        "value": "52 L",
        "label": "Consumers"
      }
    ],
    "sections": [
      {
        "header": "Defaulter breakdown by segment",
        "table": {
          "headers": [
            "Segment",
            "Consumers",
            "Arrears",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Industrial HT",
                  "bold": true
                },
                {
                  "text": "920",
                  "bold": false
                },
                {
                  "text": "₹1,082 Cr",
                  "bold": false
                },
                {
                  "text": "Court orders pending",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Commercial",
                  "bold": true
                },
                {
                  "text": "548",
                  "bold": false
                },
                {
                  "text": "₹612 Cr",
                  "bold": false
                },
                {
                  "text": "Legal proceedings",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Domestic",
                  "bold": true
                },
                {
                  "text": "918",
                  "bold": false
                },
                {
                  "text": "₹408 Cr",
                  "bold": false
                },
                {
                  "text": "Property attachment",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Govt depts",
                  "bold": true
                },
                {
                  "text": "148",
                  "bold": false
                },
                {
                  "text": "₹121 Cr",
                  "bold": false
                },
                {
                  "text": "Treasury hold",
                  "bold": false,
                  "tone": "crimson"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Recovery drive launched for 6+ Months Aging",
        "label": "Launch recovery drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Disconnection batch queued",
        "label": "Batch disconnection"
      }
    ],
    "note": "⚡ This bucket contributes 58% of total ₹12,340 Cr outstanding. Bucket status: <strong>critical</strong>."
  },
  "dues-never": {
    "sub": "Outstanding Dues · 7% of ₹12,340 Cr",
    "title": "Never Paid Bucket",
    "summary": [
      {
        "tone": "brand",
        "value": "₹920 Cr",
        "label": "Aging total"
      },
      {
        "tone": "brand",
        "value": "7%",
        "label": "Share of dues"
      },
      {
        "tone": "brand",
        "value": "2.84 L",
        "label": "Consumers"
      }
    ],
    "sections": [
      {
        "header": "Defaulter breakdown by segment",
        "table": {
          "headers": [
            "Segment",
            "Consumers",
            "Arrears",
            "Status"
          ],
          "rows": [
            {
              "cells": [
                {
                  "text": "Sec-56 court orders",
                  "bold": true
                },
                {
                  "text": "142 active",
                  "bold": false
                },
                {
                  "text": "₹382 Cr",
                  "bold": false
                },
                {
                  "text": "Hearing date set",
                  "bold": false,
                  "tone": "brand"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "FIR cases",
                  "bold": true
                },
                {
                  "text": "268 pending",
                  "bold": false
                },
                {
                  "text": "₹298 Cr",
                  "bold": false
                },
                {
                  "text": "Police escalation",
                  "bold": false,
                  "tone": "brand"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Property attachment",
                  "bold": true
                },
                {
                  "text": "38 properties",
                  "bold": false
                },
                {
                  "text": "₹140 Cr",
                  "bold": false
                },
                {
                  "text": "Auction notice",
                  "bold": false,
                  "tone": "brand"
                }
              ]
            },
            {
              "cells": [
                {
                  "text": "Write-off review",
                  "bold": true
                },
                {
                  "text": "—",
                  "bold": false
                },
                {
                  "text": "₹162 Cr",
                  "bold": false
                },
                {
                  "text": "Provisioning",
                  "bold": false,
                  "tone": "brand"
                }
              ]
            }
          ]
        }
      }
    ],
    "actions": [
      {
        "variant": "solid",
        "toastMessage": "Recovery drive launched for Never Paid Bucket",
        "label": "Launch recovery drive"
      },
      {
        "variant": "ghost",
        "toastMessage": "Disconnection batch queued",
        "label": "Batch disconnection"
      }
    ],
    "note": "⚡ This bucket contributes 7% of total ₹12,340 Cr outstanding. Bucket status: <strong>legal</strong>."
  }
}
