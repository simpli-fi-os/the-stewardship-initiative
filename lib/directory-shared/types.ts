/**
 * Shared directory primitive types for the TSI ecosystem.
 *
 * Reference: build-outputs/directory-convergence/2026-04-26_R1_shared-schema-spec.md
 *
 * The shape mirrors the canonical TSI listings table (Postgres) per
 * Simpli-FI OS/Ventures/TSI/The-Stewardship-Initiative/CLAUDE.md "Database Schema".
 * RTS public-safety records, the TSI broader resource directory, and the
 * Five-Year Course's vocation-mentor records all flow through this primitive.
 *
 * The TypeScript shape is the wire format for ingest scripts and for the
 * Firestore denormalized read cache used by the course web app per
 * build-outputs/web-app-spec/2026-04-26_E2_data-model-extensions.md §3.
 */

/**
 * The eight canonical directory listing types governed by R1 §3.
 *
 * Provider, agency, church, nonprofit, maker, farm, and education are
 * inherited from the TSI listings table. `vocation_mentor` is added per
 * the convergence frame at L2 §11 and OQ1.
 */
export type DirectoryType =
  | "provider"
  | "agency"
  | "church"
  | "nonprofit"
  | "maker"
  | "farm"
  | "education"
  | "vocation_mentor";

/**
 * The premium tier governs surface-area placement. The default is `free`.
 * Vocation mentors stay at `free` permanently per L2 OQ8.
 */
export type PremiumTier = "free" | "featured" | "premium" | "sponsored";

/**
 * Where a directory record came from. Source-stamping is required on every
 * write per R1 §6 and per the dedup discipline established by the RTS
 * ingest scripts (see scripts/ingest-tcole-tx-le.ts header comment).
 */
export type DirectorySource =
  | "manual"
  | "tcole"
  | "usfa"
  | "dshs"
  | "google_places"
  | "lott_family_network"
  | "tsi_partnership"
  | "public_application"
  | "bls"
  | "imported_from_rts_typescript";

/**
 * The shared directory primitive. Every record in every venture's directory
 * must serialize to this shape. The Postgres listings table is the canonical
 * store; the Firestore vocation-mentors collection is a denormalized read
 * cache for the Five-Year Course web app.
 *
 * Field semantics inherit from TSI/CLAUDE.md "Database Schema". Required
 * fields are non-null; optional fields are nullable. Fields with defaults
 * are documented inline.
 */
export interface DirectoryEntry {
  /** Canonical UUID. Generated server-side at create time. */
  id: string;

  /** The discriminator. Drives type-specific metadata interpretation. */
  type: DirectoryType;

  /** Optional subtype within a type. Free-form for now per TSI/CLAUDE.md. */
  subtype: string | null;

  /** Display name. Used for slug generation and search. */
  name: string;

  /**
   * URL-safe identifier. Kebab-case from name + city + state per
   * TSI/CLAUDE.md "Coding Conventions". Globally unique across the
   * canonical Postgres listings table.
   */
  slug: string;

  /** Long-form public description. */
  description: string | null;

  // --- Geography ---
  city: string;
  state: string;
  zip: string | null;
  county: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;

  // --- Contact ---
  phone: string | null;
  email: string | null;
  website: string | null;

  // --- Media ---
  logoUrl: string | null;
  photoUrls: string[];

  // --- Aggregates ---
  /** 0.0 to 5.0. Rolled up from the reviews table. */
  rating: number | null;
  /** Count of reviews backing the rating. */
  reviewCount: number;

  /** Cross-cutting tags. GIN-indexed in Postgres for filter performance. */
  tags: string[];

  // --- Provenance (R1 §6) ---
  /** Where the record came from. Required on every write. */
  source: DirectorySource;
  /** Optional URL to the upstream source page. */
  sourceUrl: string | null;

  // --- Claim and tier ---
  /** Has the owner of the record claimed it via the TSI claim flow. */
  claimed: boolean;
  /** Auth user UUID of the claimant when claimed. */
  claimedBy: string | null;
  premiumTier: PremiumTier;
  /** Stripe subscription ID when the record is on a paid premium tier. */
  stripeSubscriptionId: string | null;

  /**
   * Type-specific metadata. The shape inside metadata depends on `type`.
   * See AgencyMetadata, ChurchMetadata, MakerMetadata, NonprofitMetadata,
   * VocationMentorMetadata below for the per-type shapes.
   */
  metadata: DirectoryMetadata;

  /**
   * False until the record is approved for public surface. Vocation
   * mentors default false until D10 timing per L2 §10 phased release.
   */
  published: boolean;

  // --- Timestamps ---
  createdAt: string;
  updatedAt: string;
  scrapedAt: string | null;
}

/**
 * Discriminated union of the metadata shapes per directory type. The
 * TypeScript type system narrows on `kind` so a future ingest script
 * gets compile-time safety on the per-type fields.
 */
export type DirectoryMetadata =
  | AgencyMetadata
  | ChurchMetadata
  | MakerMetadata
  | NonprofitMetadata
  | VocationMentorMetadata
  | ProviderMetadata
  | FarmMetadata
  | EducationMetadata
  | EmptyMetadata;

/**
 * Metadata for `type === 'agency'` records (fire, police, EMS).
 * Sourced from RTS data files at src/data/departments/. The RTS TypeScript
 * shape (DepartmentData) maps onto this metadata block when migrated to
 * the canonical Postgres listings table per R2 Phase 2.
 */
export interface AgencyMetadata {
  kind: "agency";
  /** career, volunteer, or combination per TSI/CLAUDE.md examples. */
  staffingType: "career" | "volunteer" | "combination" | null;
  stationCount: number | null;
  populationServed: number | null;
  isoRating: number | null;
  union: string | null;
  shiftSchedule: string | null;
  hiringStatus: "active" | "closed" | "upcoming" | null;
  applicationUrl: string | null;
  certificationsRequired: string[];
  lateralFriendly: boolean | null;
  academyProvided: boolean | null;
  tuitionReimbursement: boolean | null;
  takeHomeVehicle: boolean | null;
}

/**
 * Metadata for `type === 'church'` records.
 */
export interface ChurchMetadata {
  kind: "church";
  denomination: string | null;
  serviceTimes: string[];
  campusCount: number | null;
  avgAttendance: number | null;
  ministries: string[];
  benevolenceFund: boolean | null;
}

/**
 * Metadata for `type === 'maker'` records (local artisans, food, crafts).
 */
export interface MakerMetadata {
  kind: "maker";
  craftType: string | null;
  acceptsCustomOrders: boolean | null;
  shipsNationwide: boolean | null;
  farmersMarketLocations: string[];
  onlineStoreUrl: string | null;
}

/**
 * Metadata for `type === 'nonprofit'` records.
 */
export interface NonprofitMetadata {
  kind: "nonprofit";
  ein: string | null;
  missionArea: string | null;
  serviceArea: string | null;
  volunteerOpportunities: boolean | null;
  acceptsDonations: boolean | null;
  annualBudget: number | null;
}

/**
 * Metadata for `type === 'vocation_mentor'` records. Mirrors the
 * vocation-mentor JSONB block at L2 §2.
 */
export interface VocationMentorMetadata {
  kind: "vocation_mentor";
  vocationDomain: string;
  vocationSubdomain: string | null;
  faithTraditions: string[];
  geographicRadiusMiles: number;
  hostingCapacityPerYear: number;
  hostingModes: Array<"in_person" | "video" | "hybrid">;
  vettingStatus:
    | "applied"
    | "references_pending"
    | "background_pending"
    | "pilot_pending"
    | "vetted"
    | "active"
    | "paused"
    | "retired"
    | "removed";
  /** Private; read access restricted to mentor-coach lead role. */
  vettingNotes: string | null;
  photoConsent: boolean;
  bioConsent: boolean;
  lastVettedAt: string | null;
  courseYearAlignment: number[];
  languagesSpoken: string[];
  faithFriendly: boolean;
  /** Reference to vetting partner record; not a verbatim background hit. */
  backgroundCheckId: string | null;
  backgroundCheckExpiresAt: string | null;
  covenantSignedAt: string | null;
  covenantVersion: string | null;
  studentsHostedThisYear: number;
  studentsHostedLifetime: number;
  averageResponseTimeHours: number | null;
  declineCountThisYear: number;
  isWitnessPanelEligible: boolean;
  preferredContactChannel: "course_app" | "email" | "phone";
  autoMatchEnabled: boolean;
}

/**
 * Lightweight metadata for the existing `provider` type. Most providers
 * carry no extra structured metadata; downstream tooling can extend this.
 */
export interface ProviderMetadata {
  kind: "provider";
  acceptsNewClients: boolean | null;
  yearsInBusiness: number | null;
  bilingual: boolean | null;
  veteranOwned: boolean | null;
}

/** Placeholder for `farm` type. Extend as the farms directory matures. */
export interface FarmMetadata {
  kind: "farm";
  produceTypes: string[];
  csaOffered: boolean | null;
  farmersMarketLocations: string[];
}

/** Placeholder for `education` type. Extend as the education directory matures. */
export interface EducationMetadata {
  kind: "education";
  educationLevel: string | null;
  enrollmentSize: number | null;
}

/** No-metadata variant used when a record has not yet been enriched. */
export interface EmptyMetadata {
  kind: "empty";
}

/**
 * Insertable view of DirectoryEntry. id, createdAt, updatedAt, slug, and
 * the aggregate fields are computed server-side. Metadata is required so
 * type-narrowing works at the call site.
 */
export type DirectoryEntryInsert = Omit<
  DirectoryEntry,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "slug"
  | "rating"
  | "reviewCount"
  | "claimed"
  | "claimedBy"
  | "premiumTier"
  | "stripeSubscriptionId"
  | "scrapedAt"
> & {
  /** Optional slug override. Default behavior generates from name + city + state. */
  slug?: string;
};
