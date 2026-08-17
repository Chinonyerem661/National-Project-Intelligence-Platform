export type Mode = "Road" | "Bridge" | "Rail";
export type Region = "Lagos" | "Kano" | "Northern" | "Western" | "Central" | "Eastern";
export type ProjectStatus = "Ahead" | "On Track" | "At Risk" | "Delayed";

export type SceneId =
  | "earthworks"
  | "subgrade"
  | "basecourse"
  | "paving"
  | "wearing"
  | "marking"
  | "drainage"
  | "rebar"
  | "pier"
  | "deck"
  | "ballast"
  | "track"
  | "signage"
  | "delivery"
  | "defect"
  | "survey";

export type PhotoCategory = "progress" | "hidden" | "defect" | "delivery";

/** Result of the automated checks, derived — never stored. */
export type Verdict = "verified" | "review" | "flagged";

export type EvidenceStatus = "approved" | "pending" | "rejected" | "flagged";

export interface Project {
  id: string;
  name: string;
  region: Region;
  mode: Mode;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  contractor: string;
  updatedAt: string;
  lat: number;
  lng: number;
  risk: string | null;
  forecastSlip: number;
  startedAt: string;
  dueAt: string;
}

export interface Photo {
  id: string;
  projectId: string;
  scene: SceneId;
  category: PhotoCategory;
  stage: string;
  location: string;
  caption: string;
  uploader: string;
  device: string;
  capturedAt: string;
  uploadedAt: string;
  lat: number;
  lng: number;
  /** Automated check results. Verdict is computed from these. */
  hasExif: boolean;
  capturedInApp: boolean;
  insideGeofence: boolean;
  withinPeriod: boolean;
  duplicateOf: string | null;
  finding: string | null;
  bytes: number;
  status: EvidenceStatus;
  publicRelease: boolean;
}

export interface FieldDevice {
  id: string;
  holder: string;
  role: string;
  region: Region;
  queued: number;
  lastSync: string;
  state: "Synced" | "Syncing" | "Offline queue" | "Dormant";
  appVersion: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: "CREATE" | "UPDATE" | "RELEASE" | "REJECT";
  entityType: string;
  entityId: string;
  summary: string;
}

export interface CapturePolicy {
  geofenceRadius: number;
  maxCaptureAgeDays: number;
  requireInApp: boolean;
  duplicateDetection: boolean;
  hiddenWorksGate: boolean;
  publicReleaseRequiresApproval: boolean;
  retentionYears: number;
  storageQuotaGb: number;
}
