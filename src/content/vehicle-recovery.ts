export type VehicleRecoveryBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }

export type VehicleRecoverySection = {
  id: string
  title: string
  visibility: "public" | "locked"
  lead?: string
  blocks?: VehicleRecoveryBlock[]
}

export const vehicleRecoveryContent = {
  eyebrow: "Motorq · 2023–Present · B2B Product Design",
  title: "Designing the Vehicle Recovery Console from zero to live",
  summary: "A 0→1 product that replaced a broken, 5-tool manual recovery workflow — cutting per-vehicle time from 1–2 hours to 10–15 minutes, powered by Motorq's OEM telematics and AI prediction engine.",
  meta: [
    ["My role", "Product Designer + Product Strategy"],
    ["Timeline", "9 months, zero to live"],
    ["Stage", "Live · Phase 2 shipped"],
    ["Customers", "4 live paying customers"],
    ["Tools", "Figma · Motorq Portal"],
  ],
  stats: [
    ["48→18", "Days to recover (median) before vs. after"],
    ["1hr→15m", "Time per vehicle for recovery manager"],
    ["77%", "AI prediction accuracy on vehicle location"],
    ["50%", "Recovery rate on previously unrecoverable cases"],
    ["90%", "US repo market reachable via RDN"],
  ],
  sections: [
    {
      id: "problem",
      title: "The problem",
      visibility: "public",
      lead: "The vehicle recovery industry processes 10.5 million repo assignments annually — and fails on 70% of them. Each unrecovered vehicle costs a lender approximately $16,000. The problem wasn't the repossessors. It was the workflow.",
      blocks: [
        { type: "subheading", text: "Skip tracers were flying blind" },
        { type: "paragraph", text: "Recovery agents relied on LPR cameras and skip-tracing — reactive, slow, expensive methods with no way to predict where a vehicle would be at a specific time of day." },
        { type: "subheading", text: "OEM telematics = unfair advantage" },
        { type: "paragraph", text: "Motorq's direct OEM data pipeline gave access to real-time vehicle location, trip history, and behavioral data that no competitor could touch. The question: could we turn that into a workflow that actually recovered vehicles?" },
        { type: "subheading", text: "The old workflow" },
        { type: "list", items: ["Open Motorq Portal — Search by VIN", "Export trip history — Download as Excel", "Filter Excel — Find repeated locations manually", "Copy lat/long — Paste into Google Maps", "Open Street View — Check accessibility", "Send to RDN — Hand off to skip tracer"] },
        { type: "paragraph", text: "1–2 hours per vehicle across 5 different applications. This is what I watched a recovery manager at BridgeCrest — a DriveTime subsidiary managing $149M in revenue — do live in our first discovery session with my PM and Product VP. That single observation became the entire design foundation." },
      ],
    },
    {
      id: "competitive",
      title: "Competitive benchmarking",
      visibility: "public",
      lead: "Before designing, I studied Recovr — the closest product in market — alongside RDN, the 90% market-share incumbent. Understanding where each fell short shaped exactly what we built differently.",
      blocks: [
        { type: "table", headers: ["Capability", "Recovr", "RDN (incumbent)", "Manual workflow", "Vehicle Recovery Console"], rows: [
          ["Real-time location", "Hardware GPS tracker required", "Relies on skip tracers", "Via Motorq portal manually", "OEM telematics, zero hardware"],
          ["AI location prediction", "No prediction", "None", "Human inference from Excel", "Daytime + overnight, 77% accuracy"],
          ["Works on existing fleet", "Device install per vehicle", "Assignment-based", "Yes", "Any OEM-connected vehicle"],
          ["Unified workflow", "Mobile app, dealer-only", "Assignment management only", "5 separate apps", "Triage → recommendation → handoff in one console"],
          ["Confidence scoring", "No", "No", "No", "High / Medium / Low on every recommendation"],
          ["Live tracking", "Hardware + law enforcement link", "No", "No", "10–15s latency via OEM, no hardware"],
          ["Fleet triage view", "No", "No", "No", "Vehicle Priority View — rank by recovery confidence"],
        ] },
        { type: "subheading", text: "What benchmarking actually revealed" },
        { type: "paragraph", text: "Recovr had solved a completely different problem. Their product assumes the vehicle has already been stolen and a hardware tracker is already installed. Ours assumes neither. They're reactive; we're predictive. We were building a workflow tool for lenders that turns telematics data into recovery decisions before an agent ever leaves the office." },
      ],
    },
    {
      id: "user",
      title: "The user",
      visibility: "public",
      lead: "My PM, Product VP, and I got direct access to two recovery managers at BridgeCrest. We watched them do the job live — not just describe it. That session changed everything about how we scoped the product.",
      blocks: [
        { type: "subheading", text: "Recovery / Repossession Manager" },
        { type: "paragraph", text: "Manages a portfolio of vehicles flagged for recovery. On any Monday morning they may have 40 vehicles to prioritise — only a handful have enough trip data for the AI to generate confident recommendations. Their job is triage: which vehicles can we realistically recover in the next 24 hours?" },
        { type: "quote", text: "I'm jumping between five tools for every single vehicle. By the time I figure out where it might be, I've spent two hours on one VIN.", attribution: "Primary user frustration" },
        { type: "subheading", text: "FMC Field Agent / Skip Tracer" },
        { type: "paragraph", text: "On the ground, often coordinating with police in real time. Needs precise, confident location recommendations — not raw data. When tracking a stolen vehicle, seconds matter. They previously relied on RDN's recommendations; they now ask for Motorq's AI recommendations instead." },
        { type: "quote", text: "When they saw everything in one place, the reaction was immediate — this is going to save so much time. And when they saw the AI recommendations, they asked: when can we start using this?", attribution: "Recovery Manager, BridgeCrest" },
        { type: "paragraph", text: "That first session wasn't the end of research — it was the beginning. We ran a standing Wednesday sync with BridgeCrest's recovery managers through Phase 1 and Phase 2, reviewing how the product performed in real use each week." },
      ],
    },
  ] satisfies VehicleRecoverySection[],
} as const

export const vehicleRecoveryNavigation = [
  { id: "hero", title: "Overview", visibility: "public" },
  { id: "stats", title: "Results", visibility: "public" },
  ...vehicleRecoveryContent.sections.map(({ id, title, visibility }) => ({ id, title, visibility })),
  { id: "flow", title: "User flow and IA", visibility: "locked" },
  { id: "process", title: "My process", visibility: "locked" },
  { id: "product", title: "The product", visibility: "locked" },
  { id: "impact", title: "Impact", visibility: "locked" },
  { id: "reflection", title: "Reflection", visibility: "locked" },
  { id: "next", title: "What's next", visibility: "locked" },
]
