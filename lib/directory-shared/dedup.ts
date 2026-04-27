/**
 * Dedup utilities for the shared directory primitive.
 *
 * Reference: build-outputs/directory-convergence/2026-04-26_R1_shared-schema-spec.md §5
 *
 * Patterns mirrored from RTS:
 *   - scripts/ingest-tcole-tx-le.ts (lines 521 to 542): collectExistingDepartments,
 *     the slug + name + city collection used as a collision-detection set.
 *   - .tx-le-dedup-report.md and .tx-ems-dedup-report.md: the 7-stage
 *     pipeline-counts table (raw rows, filter, intra-batch dedup, existing-match,
 *     final included).
 *
 * The contract: any future ingest script for any directory in any venture
 * must satisfy these primitives before writing rows to the canonical
 * Postgres listings table.
 */

import type { DirectoryEntry } from "./types";
import { normalizeCity, normalizeName } from "./slug";

/**
 * The dedup index a caller assembles from the canonical store before
 * starting a batch ingest. Mirrors the existing-departments collection
 * built by collectExistingDepartments at scripts/ingest-tcole-tx-le.ts:529.
 */
export interface DedupIndex {
  slugs: Set<string>;
  normalizedKeys: Set<string>;
}

/**
 * A collision report entry. Returned from the dedup pre-check so the
 * caller can write a per-batch dedup report mirroring the .tx-*-dedup-report.md
 * format at src/data/departments/.
 */
export interface CollisionReportEntry {
  candidateName: string;
  candidateCity: string;
  candidateState: string;
  reason: "slug-collision" | "name-city-state-collision" | "intra-batch-duplicate";
  existingSlug: string | null;
}

/**
 * Build a normalized key for cross-source collision detection.
 *
 * The key is the tuple (normalizedName, normalizedCity, state) reduced
 * to a single string. Two records with the same key are treated as the
 * same agency / church / mentor / etc. and the second is skipped.
 *
 * @example
 *   makeNormalizedKey("Denton Police Department", "Denton", "TX")
 *     === "denton-police|denton|TX" (after normalizeName + normalizeCity)
 */
export function makeNormalizedKey(
  name: string,
  city: string,
  state: string
): string {
  return `${normalizeName(name)}|${normalizeCity(city)}|${state.toUpperCase()}`;
}

/**
 * Build the dedup index from a list of canonical entries already in the
 * store. The caller is responsible for fetching the entries first; this
 * is a pure helper.
 *
 * In production the entries come from the Postgres listings table via
 * the TSI search engine's listings reader. In tests, the entries can
 * be synthesized.
 */
export function buildDedupIndex(
  existing: ReadonlyArray<Pick<DirectoryEntry, "slug" | "name" | "city" | "state">>
): DedupIndex {
  const slugs = new Set<string>();
  const normalizedKeys = new Set<string>();
  for (const entry of existing) {
    slugs.add(entry.slug);
    normalizedKeys.add(makeNormalizedKey(entry.name, entry.city, entry.state));
  }
  return { slugs, normalizedKeys };
}

/**
 * Check a candidate against the dedup index. Returns null when the
 * candidate is novel; returns a CollisionReportEntry when the candidate
 * collides with an existing record.
 *
 * @example
 *   const idx = buildDedupIndex(existing);
 *   const collision = checkSlugCollision(candidate, idx);
 *   if (collision) {
 *     report.existingMatched.push(collision);
 *   } else {
 *     await writeCanonical(candidate);
 *   }
 */
export function checkSlugCollision(
  candidate: Pick<DirectoryEntry, "slug" | "name" | "city" | "state">,
  index: DedupIndex
): CollisionReportEntry | null {
  if (index.slugs.has(candidate.slug)) {
    return {
      candidateName: candidate.name,
      candidateCity: candidate.city,
      candidateState: candidate.state,
      reason: "slug-collision",
      existingSlug: candidate.slug,
    };
  }
  const key = makeNormalizedKey(candidate.name, candidate.city, candidate.state);
  if (index.normalizedKeys.has(key)) {
    return {
      candidateName: candidate.name,
      candidateCity: candidate.city,
      candidateState: candidate.state,
      reason: "name-city-state-collision",
      existingSlug: null,
    };
  }
  return null;
}

/**
 * Check a batch of candidates against the dedup index AND against each
 * other (intra-batch dedup). Used by ingest scripts to produce the
 * "Skipped: intra-batch duplicate" row in the dedup report.
 *
 * Mutates `index` so subsequent batches see the rows just admitted.
 *
 * @returns admitted candidates in input order, plus the collision report.
 */
export function dedupeBatch<
  T extends Pick<DirectoryEntry, "slug" | "name" | "city" | "state">
>(
  candidates: ReadonlyArray<T>,
  index: DedupIndex
): { admitted: T[]; collisions: CollisionReportEntry[] } {
  const admitted: T[] = [];
  const collisions: CollisionReportEntry[] = [];
  const intraBatchSlugs = new Set<string>();
  const intraBatchKeys = new Set<string>();

  for (const candidate of candidates) {
    if (intraBatchSlugs.has(candidate.slug)) {
      collisions.push({
        candidateName: candidate.name,
        candidateCity: candidate.city,
        candidateState: candidate.state,
        reason: "intra-batch-duplicate",
        existingSlug: candidate.slug,
      });
      continue;
    }
    const intraKey = makeNormalizedKey(
      candidate.name,
      candidate.city,
      candidate.state
    );
    if (intraBatchKeys.has(intraKey)) {
      collisions.push({
        candidateName: candidate.name,
        candidateCity: candidate.city,
        candidateState: candidate.state,
        reason: "intra-batch-duplicate",
        existingSlug: null,
      });
      continue;
    }

    const collision = checkSlugCollision(candidate, index);
    if (collision) {
      collisions.push(collision);
      continue;
    }

    admitted.push(candidate);
    intraBatchSlugs.add(candidate.slug);
    intraBatchKeys.add(intraKey);
    index.slugs.add(candidate.slug);
    index.normalizedKeys.add(intraKey);
  }

  return { admitted, collisions };
}

/**
 * Render a dedup report in the format used by RTS at
 * src/data/departments/.tx-*-dedup-report.md. The pipeline-counts table
 * has the same columns; the per-section "Skipped" tables are appended.
 *
 * Stub: the rendering logic is similar to renderReport at
 * scripts/ingest-tcole-tx-le.ts:657 but generalized for any directory
 * type. The full implementation lives downstream of R2 Phase 2 work.
 */
export function renderDedupReport(_collisions: ReadonlyArray<CollisionReportEntry>): string {
  throw new Error(
    "not_implemented: see TODO at scripts/ingest-tcole-tx-le.ts:657 for the canonical report shape; port that renderer here in R2 Phase 2."
  );
}
