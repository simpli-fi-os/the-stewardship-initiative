/**
 * Shared directory primitive for the TSI ecosystem.
 *
 * Reference: build-outputs/directory-convergence/2026-04-26_R1_shared-schema-spec.md
 *            build-outputs/directory-convergence/2026-04-26_R2_migration-plan.md
 *
 * One DirectoryEntry shape covers RTS public-safety records, the TSI
 * broader resource directory, and the Five-Year Course's vocation-mentor
 * records. The Postgres listings table is the canonical store; the
 * Firestore vocation-mentors collection is a denormalized read cache
 * for the course web app per L2 §11.
 *
 * A future ingest script for any directory in any venture can:
 *
 *   import {
 *     DirectoryEntry,
 *     dedupeBatch,
 *     buildDedupIndex,
 *     makeSlug,
 *     resolveSlugCollision,
 *     stampSource,
 *     makeStamp,
 *   } from "@/lib/directory-shared";
 *
 * and ride the same dedup discipline established by the RTS ingest
 * scripts at /Simpli-FI OS/Ventures/RTS/ready-to-serve/scripts/.
 */

export type {
  DirectoryEntry,
  DirectoryEntryInsert,
  DirectoryType,
  DirectoryMetadata,
  DirectorySource,
  PremiumTier,
  AgencyMetadata,
  ChurchMetadata,
  MakerMetadata,
  NonprofitMetadata,
  VocationMentorMetadata,
  ProviderMetadata,
  FarmMetadata,
  EducationMetadata,
  EmptyMetadata,
} from "./types";

export {
  kebabCase,
  makeSlug,
  resolveSlugCollision,
  isValidSlug,
  normalizeName,
  normalizeCity,
} from "./slug";

export type { DedupIndex, CollisionReportEntry } from "./dedup";

export {
  buildDedupIndex,
  checkSlugCollision,
  dedupeBatch,
  makeNormalizedKey,
  renderDedupReport,
} from "./dedup";

export type { SourceStamp } from "./source-stamp";

export {
  makeStamp,
  stampSource,
  isStamped,
  renderSourceHeader,
} from "./source-stamp";
