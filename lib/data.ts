import type {
  AuditEntry,
  CapturePolicy,
  FieldDevice,
  Photo,
  PhotoCategory,
  Project,
  SceneId,
  Verdict,
} from "./types";

export const PROJECTS: Project[] = [
  {
    id: "P-101",
    name: "Lekki Bridge Rehabilitation",
    region: "Lagos",
    mode: "Bridge",
    status: "At Risk",
    progress: 61,
    budget: 4_200_000_000,
    spent: 2_940_000_000,
    contractor: "Delta Infraworks Ltd",
    updatedAt: "2026-08-13T14:20:00Z",
    lat: 6.4281,
    lng: 3.4219,
    risk: "Cost variance +14.2% against baseline. Contractor productivity down for three consecutive weeks.",
    forecastSlip: 8,
    startedAt: "2024-11-04T00:00:00Z",
    dueAt: "2026-12-18T00:00:00Z",
  },
  {
    id: "P-102",
    name: "Lagos–Ibadan Interchange Upgrade",
    region: "Western",
    mode: "Road",
    status: "On Track",
    progress: 94,
    budget: 6_800_000_000,
    spent: 6_392_000_000,
    contractor: "Zenith Civil Works",
    updatedAt: "2026-08-15T03:10:00Z",
    lat: 6.8912,
    lng: 3.6704,
    risk: null,
    forecastSlip: 0,
    startedAt: "2024-02-19T00:00:00Z",
    dueAt: "2026-10-30T00:00:00Z",
  },
  {
    id: "P-103",
    name: "Ibadan Ring Road Phase 2",
    region: "Western",
    mode: "Road",
    status: "On Track",
    progress: 88,
    budget: 3_100_000_000,
    spent: 2_670_000_000,
    contractor: "Coastline Builders",
    updatedAt: "2026-08-14T08:45:00Z",
    lat: 7.3775,
    lng: 3.947,
    risk: null,
    forecastSlip: 0,
    startedAt: "2024-06-11T00:00:00Z",
    dueAt: "2026-11-27T00:00:00Z",
  },
  {
    id: "P-104",
    name: "Rail Overpass — Kano",
    region: "Kano",
    mode: "Rail",
    status: "Delayed",
    progress: 32,
    budget: 5_400_000_000,
    spent: 3_850_000_000,
    contractor: "NorthBridge Rail Co.",
    updatedAt: "2026-08-15T04:30:00Z",
    lat: 12.0022,
    lng: 8.592,
    risk: "Material delivery anomaly detected across supply-chain records. Fourteen-day slippage forecast.",
    forecastSlip: 14,
    startedAt: "2024-09-02T00:00:00Z",
    dueAt: "2027-03-15T00:00:00Z",
  },
  {
    id: "P-105",
    name: "Enugu–Onitsha Link",
    region: "Eastern",
    mode: "Road",
    status: "On Track",
    progress: 76,
    budget: 2_900_000_000,
    spent: 2_204_000_000,
    contractor: "Sunrise Roadways",
    updatedAt: "2026-08-14T11:05:00Z",
    lat: 6.2109,
    lng: 7.0688,
    risk: null,
    forecastSlip: 0,
    startedAt: "2024-08-20T00:00:00Z",
    dueAt: "2026-12-04T00:00:00Z",
  },
  {
    id: "P-106",
    name: "Port Harcourt–Aba Expressway",
    region: "Central",
    mode: "Road",
    status: "At Risk",
    progress: 55,
    budget: 3_600_000_000,
    spent: 2_160_000_000,
    contractor: "Delta Infraworks Ltd",
    updatedAt: "2026-08-12T16:40:00Z",
    lat: 4.9244,
    lng: 7.2623,
    risk: "Sustained weather-delay pattern. Economic impact submissions outstanding for two milestones.",
    forecastSlip: 6,
    startedAt: "2025-01-15T00:00:00Z",
    dueAt: "2027-02-20T00:00:00Z",
  },
  {
    id: "P-107",
    name: "Kano–Zaria Road Resurfacing",
    region: "Kano",
    mode: "Road",
    status: "Delayed",
    progress: 41,
    budget: 2_200_000_000,
    spent: 1_690_000_000,
    contractor: "NorthBridge Rail Co.",
    updatedAt: "2026-08-11T09:15:00Z",
    lat: 11.581,
    lng: 8.229,
    risk: "Repeat schedule slippage across two consecutive milestones. Root-cause review under way.",
    forecastSlip: 11,
    startedAt: "2025-03-08T00:00:00Z",
    dueAt: "2026-11-12T00:00:00Z",
  },
  {
    id: "P-108",
    name: "Abuja–Kaduna Rail Spur",
    region: "Northern",
    mode: "Rail",
    status: "On Track",
    progress: 68,
    budget: 7_100_000_000,
    spent: 4_828_000_000,
    contractor: "Zenith Civil Works",
    updatedAt: "2026-08-15T01:20:00Z",
    lat: 9.5836,
    lng: 7.3986,
    risk: null,
    forecastSlip: 0,
    startedAt: "2024-05-27T00:00:00Z",
    dueAt: "2027-01-22T00:00:00Z",
  },
  {
    id: "P-109",
    name: "Enugu 9th Mile Corner Interchange",
    region: "Eastern",
    mode: "Road",
    status: "Ahead",
    progress: 97,
    budget: 1_800_000_000,
    spent: 1_512_000_000,
    contractor: "Sunrise Roadways",
    updatedAt: "2026-08-14T21:00:00Z",
    lat: 6.472,
    lng: 7.36,
    risk: null,
    forecastSlip: -5,
    startedAt: "2024-10-14T00:00:00Z",
    dueAt: "2026-09-30T00:00:00Z",
  },
  {
    id: "P-110",
    name: "Ibadan–Ilorin Road Widening",
    region: "Northern",
    mode: "Road",
    status: "At Risk",
    progress: 47,
    budget: 3_300_000_000,
    spent: 1_815_000_000,
    contractor: "Coastline Builders",
    updatedAt: "2026-08-13T07:30:00Z",
    lat: 8.12,
    lng: 4.39,
    risk: "Axle-load violation rate on the adjacent corridor trending upward. Additional site inspection advised.",
    forecastSlip: 5,
    startedAt: "2025-02-03T00:00:00Z",
    dueAt: "2027-04-08T00:00:00Z",
  },
];

/** Stage vocabulary is asset-specific: a road is linear, a bridge is elemental. */
const STAGES: Record<string, { scene: SceneId; label: string; hidden?: boolean }[]> = {
  Road: [
    { scene: "survey", label: "Corridor survey" },
    { scene: "earthworks", label: "Earthworks" },
    { scene: "subgrade", label: "Subgrade preparation" },
    { scene: "drainage", label: "Drainage & culverts", hidden: true },
    { scene: "basecourse", label: "Base course", hidden: true },
    { scene: "paving", label: "Binder course" },
    { scene: "wearing", label: "Wearing course" },
    { scene: "signage", label: "Signage & furniture" },
    { scene: "marking", label: "Line marking" },
  ],
  Bridge: [
    { scene: "survey", label: "Setting out" },
    { scene: "earthworks", label: "Pile cap excavation" },
    { scene: "rebar", label: "Reinforcement cage", hidden: true },
    { scene: "pier", label: "Pier columns" },
    { scene: "deck", label: "Deck slab" },
    { scene: "wearing", label: "Deck surfacing" },
    { scene: "signage", label: "Parapet & railing" },
  ],
  Rail: [
    { scene: "survey", label: "Alignment survey" },
    { scene: "earthworks", label: "Formation earthworks" },
    { scene: "subgrade", label: "Blanket layer", hidden: true },
    { scene: "ballast", label: "Ballast bed" },
    { scene: "track", label: "Track laying" },
    { scene: "pier", label: "Overpass piers" },
    { scene: "signage", label: "Signalling" },
  ],
};

const CREWS = [
  { name: "Chinedu Okafor", device: "MOT-FLD-0184" },
  { name: "Amina Bello", device: "MOT-FLD-0207" },
  { name: "Grace Effiong", device: "MOT-FLD-0142" },
  { name: "D. Infraworks site team", device: "CTR-DLT-0031" },
  { name: "NorthBridge site team", device: "CTR-NBR-0018" },
  { name: "Zenith Civil site team", device: "CTR-ZEN-0044" },
];

type Fault = {
  idx: number;
  kind: "geofence" | "duplicate" | "no-exif" | "stale";
  finding: string;
  duplicateOf?: string;
};

/**
 * Deliberate verification failures. A demo has to show the control firing, not
 * merely assert that it exists. Indices stay low so they land even on the
 * shortest project.
 */
const FAULTS: Record<string, Fault[]> = {
  "P-104": [
    {
      idx: 1,
      kind: "geofence",
      finding: "Captured 11.4 km from the corridor centreline — outside the 500 m capture geofence.",
    },
    {
      idx: 3,
      kind: "duplicate",
      finding: "Perceptual hash matches evidence already accepted against the Kano–Zaria contract.",
      duplicateOf: "P-107-E04",
    },
  ],
  "P-107": [
    {
      idx: 2,
      kind: "duplicate",
      finding: "Perceptual hash matches an image submitted for a previous milestone on this contract.",
      duplicateOf: "P-107-E01",
    },
    {
      idx: 5,
      kind: "no-exif",
      finding: "Capture metadata stripped. File date precedes the claim period by 47 days.",
    },
  ],
  "P-106": [
    {
      idx: 3,
      kind: "no-exif",
      finding: "Uploaded from the device gallery rather than the in-app camera.",
    },
    {
      idx: 6,
      kind: "geofence",
      finding: "Coordinates fall 18 km east of the surveyed corridor.",
    },
  ],
  "P-110": [
    {
      idx: 4,
      kind: "duplicate",
      finding: "Identical to an image accepted on the Ibadan Ring Road contract three weeks earlier.",
      duplicateOf: "P-103-E05",
    },
  ],
  "P-101": [
    {
      idx: 5,
      kind: "stale",
      finding: "Capture date falls outside the claimed reporting period.",
    },
  ],
};

const CAPTIONS: Partial<Record<SceneId, string>> = {
  survey: "Total station set up on the corridor centreline prior to works commencing.",
  earthworks: "Cut and fill in progress; spoil stockpiled to the northern verge.",
  subgrade: "Formation graded and proof-rolled ahead of sub-base delivery.",
  drainage: "Box culvert cast in situ; barrel dimensions verified against drawing.",
  basecourse: "Crushed-stone base compacted in two lifts; density testing recorded.",
  paving: "Binder course laid at temperature; joint sealed to the existing surface.",
  wearing: "Wearing course complete over the northbound carriageway.",
  marking: "Thermoplastic centre-line applied following surface cure.",
  rebar: "Reinforcement cage tied and inspected prior to concrete pour.",
  pier: "Pier columns struck; surface finish accepted by resident engineer.",
  deck: "Deck beams positioned; in-situ stitch pours to follow.",
  ballast: "Ballast bed profiled to design cross-section ahead of sleeper laying.",
  track: "Continuous welded rail laid and clipped through the section.",
  signage: "Directional gantry erected and torque-checked.",
  delivery: "Materials received on the laydown area; delivery note reconciled.",
  defect: "Surface deterioration recorded at the joint; remediation instruction raised.",
};

function mulberry(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const NOW = Date.parse("2026-08-15T09:00:00Z");

function buildPhotos(): Photo[] {
  const out: Photo[] = [];

  PROJECTS.forEach((p, pi) => {
    const stages = STAGES[p.mode];
    const rand = mulberry(pi * 7919 + 13);
    const reached = Math.max(3, Math.round((p.progress / 100) * stages.length));
    const count = Math.min(stages.length, reached + 2);

    for (let i = 0; i < count; i++) {
      const stage = stages[Math.min(i, stages.length - 1)];
      const fault = (FAULTS[p.id] ?? []).find((f) => f.idx === i);
      const isDelivery = i > 1 && i % 4 === 3 && !fault;
      const isDefect = Boolean(p.risk) && i === reached - 1 && !fault && !isDelivery;

      const scene: SceneId = isDefect ? "defect" : isDelivery ? "delivery" : stage.scene;
      const category: PhotoCategory = isDefect
        ? "defect"
        : isDelivery
          ? "delivery"
          : stage.hidden
            ? "hidden"
            : "progress";

      const crew = CREWS[(pi + i) % CREWS.length];
      const daysAgo = (count - i) * 7 + Math.floor(rand() * 5);
      const captured = new Date(NOW - daysAgo * 864e5 - Math.floor(rand() * 7) * 36e5);
      const uploaded = new Date(captured.getTime() + Math.floor(rand() * 9) * 36e5);

      const spread = fault?.kind === "geofence" ? 0.2 : 0.011;
      const lat = +(p.lat + (rand() - 0.5) * spread).toFixed(4);
      const lng = +(p.lng + (rand() - 0.5) * spread).toFixed(4);

      const location =
        p.mode === "Bridge"
          ? `Pier ${1 + (i % 4)}`
          : `km ${(6 + i * 3).toString()}+${((150 + i * 175) % 900).toString().padStart(3, "0")}`;

      const hasExif = fault?.kind !== "no-exif";
      const withinPeriod = fault?.kind !== "stale" && fault?.kind !== "no-exif";
      const insideGeofence = fault?.kind !== "geofence";
      const duplicateOf = fault?.kind === "duplicate" ? (fault.duplicateOf ?? null) : null;

      out.push({
        id: `${p.id}-E${String(i + 1).padStart(2, "0")}`,
        projectId: p.id,
        scene,
        category,
        stage: isDefect ? "Defect record" : isDelivery ? "Material delivery" : stage.label,
        location,
        caption: CAPTIONS[scene] ?? "",
        uploader: crew.name,
        device: crew.device,
        capturedAt: captured.toISOString(),
        uploadedAt: uploaded.toISOString(),
        lat,
        lng,
        hasExif,
        capturedInApp: hasExif,
        insideGeofence,
        withinPeriod,
        duplicateOf,
        finding: fault?.finding ?? null,
        bytes: 1_600_000 + Math.floor(rand() * 3_400_000),
        status: fault ? "flagged" : i >= reached - 1 ? "pending" : "approved",
        publicRelease: !fault && category === "progress" && i % 3 === 0,
      });
    }
  });

  return out;
}

export const PHOTOS: Photo[] = buildPhotos();

export function verdictOf(p: Photo): Verdict {
  if (p.duplicateOf || !p.insideGeofence) return "flagged";
  if (!p.hasExif || !p.withinPeriod) return "review";
  return "verified";
}

export function isUndecided(p: Photo): boolean {
  return p.status !== "approved" && p.status !== "rejected";
}

export function photosFor(projectId: string): Photo[] {
  return PHOTOS.filter((p) => p.projectId === projectId);
}

export function projectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const DEVICES: FieldDevice[] = [
  {
    id: "MOT-FLD-0184",
    holder: "Chinedu Okafor",
    role: "Highway Engineer",
    region: "Lagos",
    queued: 0,
    lastSync: "8 minutes ago",
    state: "Synced",
    appVersion: "2.4.1",
  },
  {
    id: "MOT-FLD-0207",
    holder: "Amina Bello",
    role: "Regional Project Director",
    region: "Kano",
    queued: 14,
    lastSync: "3 days ago",
    state: "Offline queue",
    appVersion: "2.4.1",
  },
  {
    id: "MOT-FLD-0142",
    holder: "Grace Effiong",
    role: "Highway Engineer",
    region: "Eastern",
    queued: 0,
    lastSync: "14 days ago",
    state: "Dormant",
    appVersion: "2.1.8",
  },
  {
    id: "CTR-DLT-0031",
    holder: "D. Infraworks site team",
    role: "Contractor",
    region: "Lagos",
    queued: 6,
    lastSync: "19 hours ago",
    state: "Offline queue",
    appVersion: "2.4.0",
  },
  {
    id: "CTR-NBR-0018",
    holder: "NorthBridge site team",
    role: "Contractor",
    region: "Kano",
    queued: 2,
    lastSync: "5 hours ago",
    state: "Syncing",
    appVersion: "2.4.1",
  },
  {
    id: "CTR-ZEN-0044",
    holder: "Zenith Civil site team",
    role: "Contractor",
    region: "Northern",
    queued: 0,
    lastSync: "22 minutes ago",
    state: "Synced",
    appVersion: "2.4.1",
  },
];

export const POLICY: CapturePolicy = {
  geofenceRadius: 500,
  maxCaptureAgeDays: 14,
  requireInApp: true,
  duplicateDetection: true,
  hiddenWorksGate: true,
  publicReleaseRequiresApproval: true,
  retentionYears: 10,
  storageQuotaGb: 2048,
};

export const SEED_AUDIT: AuditEntry[] = [
  {
    id: "AUD-0007",
    timestamp: "2026-08-15T07:42:00Z",
    actor: "Ibrahim Sule",
    action: "UPDATE",
    entityType: "CapturePolicy",
    entityId: "policy",
    summary: "Geofence radius reduced from 750 m to 500 m across all corridors",
  },
  {
    id: "AUD-0006",
    timestamp: "2026-08-15T06:10:00Z",
    actor: "Verification service",
    action: "REJECT",
    entityType: "Evidence",
    entityId: "P-104-E02",
    summary: "P-104-E02 auto-flagged — capture outside corridor geofence",
  },
  {
    id: "AUD-0005",
    timestamp: "2026-08-14T16:25:00Z",
    actor: "Ngozi Eze",
    action: "RELEASE",
    entityType: "Evidence",
    entityId: "P-102-E04",
    summary: "P-102-E04 released to the public transparency portal",
  },
  {
    id: "AUD-0004",
    timestamp: "2026-08-14T11:03:00Z",
    actor: "Amina Bello",
    action: "UPDATE",
    entityType: "ProgressClaim",
    entityId: "P-108-C11",
    summary: "Claim P-108-C11 accepted — 4 supporting images verified",
  },
  {
    id: "AUD-0003",
    timestamp: "2026-08-13T09:47:00Z",
    actor: "Ibrahim Sule",
    action: "UPDATE",
    entityType: "User",
    entityId: "U-006",
    summary: "Grace Effiong suspended — 14 days without device sync",
  },
  {
    id: "AUD-0002",
    timestamp: "2026-08-12T15:12:00Z",
    actor: "Finance sync service",
    action: "CREATE",
    entityType: "Disbursement",
    entityId: "P-103-D08",
    summary: "Disbursement ₦412m reconciled against IFMIS staging record",
  },
  {
    id: "AUD-0001",
    timestamp: "2026-08-11T08:30:00Z",
    actor: "Chinedu Okafor",
    action: "CREATE",
    entityType: "Evidence",
    entityId: "P-101-E06",
    summary: "6 images uploaded from MOT-FLD-0184 following offline capture",
  },
];

export const USERS = [
  { id: "U-001", name: "Chinedu Okafor", role: "Highway Engineer", region: "Lagos", status: "Active", lastLogin: "10 minutes ago" },
  { id: "U-002", name: "Amina Bello", role: "Regional Project Director", region: "Kano", status: "Active", lastLogin: "1 hour ago" },
  { id: "U-003", name: "Tunde Adeyemi", role: "Ministry Leadership", region: "All", status: "Active", lastLogin: "3 hours ago" },
  { id: "U-004", name: "Ngozi Eze", role: "Finance Officer", region: "All", status: "Active", lastLogin: "5 hours ago" },
  { id: "U-005", name: "Ibrahim Sule", role: "ICT Administrator", region: "All", status: "Active", lastLogin: "20 minutes ago" },
  { id: "U-006", name: "Grace Effiong", role: "Highway Engineer", region: "Eastern", status: "Suspended", lastLogin: "14 days ago" },
  { id: "U-007", name: "Delta Infraworks Ltd", role: "Contractor", region: "Lagos", status: "Active", lastLogin: "2 days ago" },
] as const;

export const INTEGRATIONS = [
  { id: "ifmis", name: "Financial Management System (IFMIS)", state: "Connected", direction: "Bi-directional", lastSync: "4 minutes ago" },
  { id: "egp", name: "Procurement / e-GP Platform", state: "Connected", direction: "Bi-directional", lastSync: "18 minutes ago" },
  { id: "gis", name: "National GIS & Mapping Agency", state: "Connected", direction: "Inbound", lastSync: "1 hour ago" },
  { id: "store", name: "Evidence Object Store (S3-compatible)", state: "Connected", direction: "Bi-directional", lastSync: "1 minute ago" },
  { id: "cohims", name: "COHIMS Migration Connector", state: "Degraded", direction: "Inbound (migration)", lastSync: "6 hours ago" },
  { id: "gateway", name: "SMS & Email Gateway", state: "Connected", direction: "Outbound", lastSync: "2 minutes ago" },
] as const;
