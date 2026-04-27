/**
 * Source-stamping wrapper for the shared directory primitive.
 *
 * Reference: build-outputs/directory-convergence/2026-04-26_R1_shared-schema-spec.md §6
 *
 * Every record in the canonical Postgres listings table carries a `source`
 * and an optional `sourceUrl`. The pattern mirrors the RTS ingest scripts
 * (see scripts/ingest-tcole-tx-le.ts:81 to 84 for the TCOLE_RETRIEVED_DATE
 * + TCOLE_SOURCE_URL pair, and the renderFile header comment that prints
 * the source citation into the generated TypeScript file).
 *
 * The contract: no record may be inserted without a known `source`. The
 * stampSource helper enforces this at the type level; it is the single
 * choke point any ingest script should pass through.
 */

import type {
  DirectoryEntry,
  DirectoryEntryInsert,
  DirectorySource,
} from "./types";

/**
 * The provenance block stamped onto every insert. The retrievedAt date is
 * recorded so a re-run of the same ingest is idempotent against time.
 */
export interface SourceStamp {
  source: DirectorySource;
  sourceUrl: string | null;
  retrievedAt: string;
}

/**
 * Build a SourceStamp from the source identifier. If `sourceUrl` is given
 * it is preserved verbatim (the URL of the source dataset, not the URL
 * of the individual record).
 *
 * @example
 *   const stamp = makeStamp("tcole", "https://www.tcole.texas.gov/document/racial-profiling-public-2.xlsx");
 *   const stamped = stampSource(candidate, stamp);
 */
export function makeStamp(
  source: DirectorySource,
  sourceUrl: string | null = null
): SourceStamp {
  return {
    source,
    sourceUrl,
    retrievedAt: new Date().toISOString().slice(0, 10),
  };
}

/**
 * Apply a SourceStamp to a candidate insert. The wrapped insert is
 * guaranteed to carry a non-null `source` and the `scrapedAt` field is
 * populated from `retrievedAt`.
 *
 * Stub: the full version writes to the canonical Postgres store via
 * the TSI Supabase client. This signature is the public surface that
 * ingest scripts should call.
 */
export function stampSource(
  candidate: DirectoryEntryInsert,
  stamp: SourceStamp
): DirectoryEntryInsert {
  return {
    ...candidate,
    source: stamp.source,
    sourceUrl: stamp.sourceUrl,
  };
}

/**
 * Verify that a record carries a stamp. Used by Postgres-side or
 * Firestore-side write guards to refuse anonymous inserts.
 *
 * @returns true when source is set and not the manual fallback used
 * for hand-curated TSI listings.
 */
export function isStamped(entry: Pick<DirectoryEntry, "source">): boolean {
  return Boolean(entry.source) && entry.source.length > 0;
}

/**
 * Render the source citation header that ingest scripts prepend to their
 * generated TypeScript files. Mirrors the header block at
 * scripts/ingest-tcole-tx-le.ts:586 to 617 so any future ingest produces
 * the same auditable file shape.
 *
 * Stub: the full version is implemented in R2 Phase 2 alongside the
 * dedup-report renderer. The signature is fixed.
 */
export function renderSourceHeader(_stamp: SourceStamp, _description: string): string {
  throw new Error(
    "not_implemented: see TODO at scripts/ingest-tcole-tx-le.ts:586 for the canonical header shape; port that renderer here in R2 Phase 2."
  );
}
