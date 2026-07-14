/**
 * Chart info catalog — the single source of truth for the inline "ⓘ" chart
 * explanations, ported from the prototype's `CHART_INFO` object.
 *
 * Each entry powers a {@link ChartInfoButton}. Add new entries here as more
 * modules are built; components reference them by `chartId`.
 */
export interface ChartInfoEntry {
  /** Popover heading. */
  title: string
  /** 1–2 sentence plain-language definition. */
  body: string
  /** "How to read" guidance. Empty string hides the section. */
  how?: string
  /** "Data source" / methodology + cadence. Empty string hides the section. */
  source?: string
}

export type ChartInfoId =
  | 'detection-trend'
  | 'child-loss'
  | 'atc-trajectory'
  | 'risk-trend'
  | 'risk-drivers'
  | 'load-survey'
  | 'daily-consumption'
  | 'monthly-consumption'
  | 'load-factor'
  | 'generic'

export const CHART_INFO: Record<string, ChartInfoEntry> = {
  // ── Team module ────────────────────────────────────────────────────────────
  'hit-rate': {
    title: 'Inspection Hit Rate',
    body: 'Share of inspections that confirm theft. Hit rate improves as AI ranking matures.',
    how: 'Baseline (manual): 15-22%. AI-guided target: >50%. Drops below 40% = retrain model; below 30% = investigate methodology.',
    source: 'Confirmed cases / total inspections completed, rolling 30-day window.',
  },
  workload: {
    title: 'Workload Balance',
    body: 'Number of cases assigned per inspector. Identifies overloaded or underutilized team members.',
    how: 'Even distribution is the goal. Outliers on either end warrant attention. AI auto-assign helps balance workload based on area and skills.',
    source: 'Active case count per inspector (status != closed).',
  },
  // ── Forecast module ────────────────────────────────────────────────────────
  'forecast-atc': {
    title: 'AT&C Loss Forecast',
    body: 'Predicted AT&C losses for next quarter with 85% confidence band.',
    how: 'Forecast uses 24 months of history. Confidence band widens with distance. Shaded area = uncertainty range.',
    source: 'Prophet model trained on monthly AT&C losses, weather variables, seasonality.',
  },
  'dt-overload': {
    title: 'DT Overload Risk',
    body: 'Distribution transformers predicted to exceed 85% loading in next 90 days.',
    how: 'Each bar is a DT. Height = predicted peak loading. Red = at risk (>90%). Driver actions: load balancing or capacity upgrade.',
    source: 'Load prediction ML model using 3 months of 30-min interval data per DT.',
  },
  'seasonal-theft': {
    title: 'Seasonal Theft Pattern',
    body: 'Historical theft detection rate by month-of-year. Shows when coordinated theft peaks.',
    how: 'May-Jul spikes typically tied to agricultural pump season. Aug-Oct spikes often unauthorized cooling load.',
    source: 'Aggregated confirmed-theft cases from past 3 years, bucketed by calendar month.',
  },
  'atc-waterfall': {
    title: 'AT&C Loss Waterfall',
    body: 'Breaks down where each unit of energy goes — from purchased at Zone boundary to billed-and-collected revenue.',
    how: 'Read left-to-right. Each red bar is a loss bucket. Green bars are recovered/billed. The width of red bars shows relative loss magnitude.',
    source: 'Computed from Zone input energy, DT output energy, billing, and collection data. Updated nightly.',
  },
  'tech-vs-comm': {
    title: 'Technical vs Commercial Loss',
    body: 'Splits total loss into technical (infrastructure inefficiency) and commercial (theft + billing errors).',
    how: 'Commercial loss is the AI-addressable portion. Technical loss needs capex (transformer upgrades, conductor replacement).',
    source: 'Technical loss from feeder-DT-consumer energy reconciliation. Commercial loss = Total AT&C − Technical.',
  },
  'dt-loss-top10': {
    title: 'Top 10 DTs by Loss %',
    body: 'The 10 distribution transformers with highest loss percentage in the selected scope.',
    how: 'Click any DT bar to drill into that transformer\u2019s detail. Color gradient: red >25%, amber 15-25%, green <15%.',
    source: 'DT-level energy audit. Loss % = (DT input kWh − sum of consumer kWh) / DT input kWh.',
  },
  'saidi-trend': {
    title: 'SAIDI Trend',
    body: 'System Average Interruption Duration Index — average outage time per consumer per year.',
    how: 'Lower is better. Benchmark: urban SAIDI < 10 hrs/year, rural < 20 hrs/year. Color-coded against CEA benchmarks.',
    source: 'Computed from outage logs: Σ(customer-minutes interrupted) / total consumers served.',
  },
  'saifi-trend': {
    title: 'SAIFI Trend',
    body: 'System Average Interruption Frequency Index — average number of outages per consumer per year.',
    how: 'Lower is better. Benchmark: urban SAIFI < 5 events/year. High SAIFI with low SAIDI = frequent short outages.',
    source: 'Computed from outage logs: Σ(customers interrupted) / total consumers served.',
  },
  'caifi': {
    title: 'CAIFI — Customer Avg Interruption Frequency Index',
    body: 'Average number of interruptions per consumer who actually experienced at least one interruption. Unlike SAIFI which divides by ALL consumers, CAIFI divides by only the affected ones — exposing concentrated outage burden.',
    how: 'CAIFI > SAIFI by a factor of (1 / fraction_of_affected_consumers). When CAIFI is much higher than SAIFI, outages are concentrated on a sub-population — an equity issue regulators care about. RDSS norm: CAIFI within 1.5× of SAIFI for healthy networks.',
    source: 'Computed as: Σ(interruption events) / count(unique consumers with ≥1 interruption). Aggregated monthly per feeder per division.',
  },
  'maifi': {
    title: 'MAIFI — Momentary Avg Interruption Frequency Index',
    body: 'Average number of MOMENTARY interruptions (typically < 5 minutes) per consumer per year. SAIDI/SAIFI usually exclude these brief blips, but they matter — especially for industrial loads where flickers cause production stoppages.',
    how: 'Lower is better. MAIFI typically 2-4× SAIFI in Indian distribution networks due to motor switching, agricultural pump cycling, and trip-reclose recloser actions. High MAIFI on industrial feeders is a red flag for power-quality complaints. CEA benchmark: < 25 events/yr for urban distribution.',
    source: 'Computed from SCADA / smart-meter momentary outage logs. Counts every interruption with restoration within the momentary window (CEA defines 1-5 min depending on jurisdiction).',
  },
  'outage-causes': {
    title: 'Outage Cause Distribution',
    body: 'Pie breakdown of root causes: equipment failure, weather, planned, consumer-initiated.',
    how: 'Unexplained / consumer-only outages can indicate bypass theft patterns — worth cross-referencing with suspicious meters.',
    source: 'Root-cause codes entered by field engineers during outage resolution.',
  },
  'billing-efficiency': {
    title: 'Billing Efficiency Trend',
    body: 'Share of consumed energy that gets billed. Gap = unbilled consumption (stopped meters, tariff misapplication, theft).',
    how: '100% is the target. Every 1pp drop represents roughly ₹15 L/month for this DISCOM. Sustained drops warrant investigation.',
    source: 'Billing efficiency = billed kWh / metered kWh (monthly rollup).',
  },
  'collection-rate': {
    title: 'Collection Rate',
    body: 'Share of billed amount that gets collected within due period.',
    how: 'Below 90% signals collection workflow issues. Target: 95%+. Watch for seasonal dips in Q2 (monsoon) and post-festival.',
    source: 'Collection rate = collected ₹ / billed ₹. Monthly.',
  },
  'voltage-profile': {
    title: 'Voltage Profile',
    body: 'Distribution of consumer voltage readings vs regulatory band (207-253V in India).',
    how: 'Low voltage (<200V) = poor supply quality, consumer complaints. High voltage (>260V) = damage to appliances.',
    source: 'Real-time voltage readings from smart meters, aggregated at feeder level.',
  },
  'power-factor': {
    title: 'Power Factor Distribution',
    body: 'How much consumer load is reactive vs real power. Low PF = inefficient loads (motors without capacitor correction).',
    how: 'PF < 0.85 incurs a penalty under UPERC tariff (10% surcharge). Industrial consumers drive most of this metric.',
    source: 'PF values from smart meter readings. Penalty computation per UPERC Tariff Order 2024.',
  },
  'peer-loss': {
    title: 'Peer AT&C Comparison',
    body: 'Side-by-side AT&C loss % for selected peer entities (feeders, sub-divisions, or DTs in the same category).',
    how: 'Bars sorted by loss %. Lower is better. Significant gaps between similar peers are investigation opportunities.',
    source: 'AT&C loss per entity, averaged over selected time window.',
  },
  'yoy-loss': {
    title: 'Year-over-Year AT&C Loss',
    body: 'Same entity compared across multiple years to separate trend from noise.',
    how: 'Look for sustained improvement (downward slope). Seasonal patterns should align year-over-year — deviations warrant investigation.',
    source: 'Monthly AT&C figures for 3 full fiscal years. Seasonally decomposed.',
  },
  'before-after': {
    title: 'Before / After Impact',
    body: 'Selected metric before and after VidyutRaksha deployment, with a visible deployment marker.',
    how: 'The vertical line marks go-live. Compare the slope (rate of change) before vs after, not just the levels. Shaded area shows confidence.',
    source: 'Pre-deployment: 12 months of baseline. Post-deployment: actual measurements. Confidence intervals from bootstrap resampling.',
  },
  'percentile-ranking': {
    title: 'Percentile Ranking',
    body: 'Where this entity sits among all peers as a percentile. Bronze/silver/gold medals indicate top performers.',
    how: 'Higher percentile = better performance. P90+ is top decile. Medals awarded monthly; trends matter more than single-month snapshots.',
    source: 'Percentile computed across all peer entities on selected metric. Monthly rollup.',
  },
  'pareto': {
    title: 'Pareto Analysis (80/20 contribution)',
    body: 'Sorted bar chart of contributors with cumulative percentage line overlay. Identifies the "vital few" — typically ~20% of entities causing ~80% of an outcome (loss, theft, complaints).',
    how: 'Bars are sorted descending by share. The cumulative line crosses 80% at the cutoff between vital few and trivial many. Focus enforcement/intervention on the vital few — same effort, much higher recovery vs uniform allocation.',
    source: 'Pareto principle (Vilfredo Pareto, 1896) — empirically observed across DISCOMs, theft cases, customer complaints, defect distributions. Computed monthly per feeder/division.',
  },
  'appeal-grounds': {
    title: 'Appeal grounds distribution',
    body: 'Breakdown of the reasons consumers cite when appealing a Section 135 assessment. Baseline disputed is the most common ground (44%), meaning consumers challenge the peer-group consumption estimate used by the calculator.',
    how: 'A high share of "Baseline disputed" appeals suggests we should strengthen peer-group documentation in notices — attach the specific comparable consumers and their consumption to reduce the argument surface.',
    source: 'Grounds are extracted from the appeal petition text via LLM classification. Ambiguous appeals are hand-labeled by the appeals cell.',
  },
  'appeal-outcomes': {
    title: 'Appeal outcomes (last 12 months)',
    body: 'How appeals were decided each month — Dismissed (original assessment upheld), Reduced (assessment lowered), or Upheld (consumer prevailed).',
    how: 'A rising dismissal rate signals stronger evidence packages upstream. A rising "Reduced" rate suggests our peer-baseline estimates are slightly aggressive and warrant a review.',
    source: 'Recorded from the appellate authority order sheet after each hearing.',
  },
  'ctc-active-groups': {
    title: 'Active cases',
    body: 'Number of coordinated theft cases currently open in this scope. A case is 4+ consumers under the same DTR/feeder showing matching tamper signatures within a tight time window.',
    how: 'Each case requires a batch raid (multiple inspectors, sometimes police coordination). A higher count means more coordinated enforcement effort needed.',
    source: 'AI grouping runs weekly on overnight MRI batch. A case is opened when ≥4 consumers cross the correlation threshold.',
  },
  'ctc-revenue-exposure': {
    title: 'Estimated revenue exposure',
    body: 'Total revenue at risk across all open cases in this scope IF every flagged consumer confirms as theft on inspection.',
    how: 'Use this to prioritize: cases with high exposure get senior officer attention. The actual recovered amount is typically 60-65% of exposure (collection realization).',
    source: 'Sum of per-consumer assessment amount × 12-month lookback period. Calculated from MRI consumption gap × applicable tariff.',
  },
  'ctc-confirmed': {
    title: 'Confirmed members',
    body: 'How many flagged consumers have been physically inspected AND found tampering — out of total consumers across all cases.',
    how: 'Track progress: ratio close to 100% means cases are fully worked. Low ratio means cases are stalling — assign more inspectors.',
    source: 'Updated when an inspector files an inspection report with theft confirmation and signed panchnama.',
  },
  'ctc-pending': {
    title: 'Pending inspection',
    body: 'Consumers within open cases who have not yet been inspected. These are the highest-priority dispatches at this scope.',
    how: 'Aim to clear pending inspections within 7 days of case creation. Beyond that, the chance of recovering evidence drops sharply.',
    source: 'Total consumers minus confirmed minus already-cleared (false positive) members.',
  },
  'ctc-largest': {
    title: 'Largest case',
    body: 'Member count of the biggest coordinated theft case in this scope. Larger cases = more organized = higher priority.',
    how: 'Cases with 10+ members usually need joint police coordination, sometimes magistrate authorization. Plan resources accordingly.',
    source: 'Maximum members across all open cases at this scope.',
  },
  'ctc-pattern-column': {
    title: 'Theft method (Pattern)',
    body: 'The tampering technique flagged by AI. Common patterns: Earth loading, Meter bypass, CT manipulation (industrial), Magnetic tamper, Tariff misuse, Synchronized zero consumption (multiple consumers showing 0 at the same time = collective bypass).',
    how: 'Pattern guides inspector preparation: CT manipulation needs a CT testing kit; magnetic tamper needs a degausser; earth loading needs a 4-wire disconnect tool.',
    source: 'AI classifier trained on 2,840 historical confirmed cases from KVVNL Varanasi. Labels match UPPCL Theft Section codes.',
  },
  'ctc-risk-column': {
    title: 'Risk score (0–100)',
    body: 'AI confidence that this case represents real coordinated theft (not a false positive). 80+ = strong evidence, 60–80 = moderate, below 60 not shown.',
    how: 'Higher risk = more likely to confirm on inspection. 90+ cases historically have 78% confirmation rate; 80–90 cases have 64%.',
    source: 'Computed from temporal correlation + spatial proximity + tamper-signature similarity + historical confirmation base rate. Updated nightly.',
  },
  'ctc-estloss-column': {
    title: 'Estimated loss (12-month lookback)',
    body: "Estimated revenue lost to this case if all members confirm. Calculated as (peer median consumption − this consumer's recorded consumption) × applicable tariff × 12 months.",
    how: 'This is the figure used to seek magistrate authorization for batch raids. Realized recovery is typically 60-65% of this number.',
    source: 'Per-consumer estimate from last 12 months of MRI data, summed across case members. Excludes punitive surcharge.',
  },
  'cluster-sizes': {
    title: 'Coordinated theft case sizes',
    body: 'How many coordinated theft cases exist at each size bucket (number of consumers in the group).',
    how: 'Larger groups (10+ consumers) indicate organized theft — prioritize for batch raids with police coordination.',
    source: 'AI grouping runs weekly; correlates same-window tamper patterns, location, and theft method.',
  },
  // Overview → "Detection funnel · 12-month trend".
  // (No entry existed in the prototype for this chart; authored in the same
  // format/tone as the rest of the catalog.)
  'detection-trend': {
    title: 'Detection Funnel — 12-Month Trend',
    body: 'Monthly view of the detection pipeline: meters AI-flagged → inspected → confirmed as theft. Shows whether flag-to-confirmation conversion is improving over the year.',
    how: 'Watch the gap between the three series. A rising Confirmed line with a narrowing gap to Flagged means better targeting; a widening Flagged–Inspected gap signals an inspection backlog.',
    source: 'Detection-engine outputs reconciled with case outcomes. Updated nightly from the MRI batch.',
  },

  // Overview → "Where is the loss concentrated?" (loss by child entity).
  'child-loss': {
    title: 'Loss by Child Level',
    body: 'Breakdown of AT&C losses across immediate child entities of the current scope (e.g., Zones within a DISCOM, Feeders within a Division).',
    how: 'Red bars are above-target; green are on-track. Click any bar to drill into that entity. Color threshold: red >20%, amber 15-20%, green <15%.',
    source: 'Rolled up from MRI consumption data + DT input/output reconciliation. Updated nightly.',
  },

  // Executive / Overview AT&C trajectory (kept for reuse in later modules).
  'atc-trajectory': {
    title: 'AT&C Loss Trajectory (24 months)',
    body: '24-month view of AT&C losses with the VidyutRaksha deployment marker and projection to RDSS FY27 target.',
    how: 'The vertical purple line marks product go-live. Slope change afterwards indicates program impact. Dashed line projects current trajectory to target.',
    source: 'Monthly AT&C figures from DISCOM filings; projection uses ARIMA model on post-deployment trend.',
  },

  // ── Meter detail charts (verbatim from prototype CHART_INFO) ──
  'risk-trend': {
    title: 'Risk Score — 12 Month Trend',
    body: "How this meter's AI risk score has evolved over the past year. Reveals when theft likely started.",
    how: 'Stable low score + sharp jump = clear theft installation signal. Gradual rise = slow-developing pattern. Spikes that subside = likely false positive.',
    source: 'Daily risk score from detection engine, averaged to monthly for this view. Uses the model version current at each date.',
  },
  'risk-drivers': {
    title: 'Risk Drivers — Rule Breakdown',
    body: "Which detection rules contributed most to this meter's current risk score.",
    how: 'Largest segment = dominant signal. If one rule dominates 60%+, investigate that pattern specifically. Balanced distribution = multiple corroborating signals.',
    source: 'Contribution = rule weight × rule activation strength. Normalized to 100%.',
  },
  'load-survey': {
    title: '30-Minute Load Survey',
    body: 'Intraday consumption (kWh) and demand (kW) in 30-minute intervals for a single day.',
    how: "Residential peaks: morning 7-9am, evening 7-10pm. Commercial: steady 9am-6pm. Industrial: flat 24h. Patterns that don't match consumer category = suspicious.",
    source: 'Direct from meter MRI data. 48 intervals per day. Most recent full day shown by default.',
  },
  'daily-consumption': {
    title: 'Daily Consumption vs Peer Group',
    body: "This meter's daily kWh compared to the average of 15-20 similar consumers (same feeder, tariff category, sanctioned load).",
    how: 'Blue line is this meter; green dashed is peer average. Sustained divergence below peer = likely theft. Temporary dips = vacation/seasonal.',
    source: 'Peer group selected by Euclidean distance on category, load, feeder, area type. Top 20 nearest neighbors.',
  },
  'monthly-consumption': {
    title: 'Monthly Consumption + Max Demand',
    body: 'Monthly kWh (bars) and peak kW demand (line) on dual axis — helps distinguish bypass from genuine reduction.',
    how: 'In a partial bypass, kWh drops but kW stays stable. Proportional drops in both = full bypass or genuine reduction. Investigate the ratio change.',
    source: 'Monthly billing rollup. Max Demand = highest 30-min average in the month.',
  },
  'load-factor': {
    title: 'Load Factor Trend',
    body: 'Load Factor = Average Demand / Max Demand. Shows how consistently a consumer uses power.',
    how: 'LF < 0.3 = intermittent use (typical residential). LF 0.5-0.7 = steady commercial. LF > 0.7 = industrial. Sudden LF drops can indicate bypass.',
    source: 'Computed from 30-min interval data: mean(kW) / max(kW) over 30-day windows.',
  },

  generic: {
    title: 'Chart explanation',
    body: 'Explanation for this chart will be added in a future update.',
    how: '',
    source: '',
  },
  // ── Data Quality module ────────────────────────────────────────────────────
  'mri-freshness': {
    title: 'MRI Data Freshness',
    body: 'Age of latest meter reading per meter. Fresher is better.',
    how: 'Green (<24h) = healthy. Amber (1-7 days) = communication issue. Red (>7 days) = stopped meter requiring field visit.',
    source: 'Timestamp delta between now and latest MRI reading per meter, bucketed.',
  },
  'comm-health': {
    title: 'Meter Communication Health',
    body: 'Distribution of meters by communication status: normal, intermittent, or stopped.',
    how: 'Healthy system has >95% normal. Intermittent suggests network issues at DT level. Stopped meters are high-priority for field dispatch.',
    source: 'Communication status flags from AMI head-end system. Updated every 4 hours.',
  },
}

/** Resolve an entry by id, falling back to the generic placeholder. */
export function getChartInfo(chartId: string): ChartInfoEntry {
  return CHART_INFO[chartId] ?? CHART_INFO.generic
}
