/**
 * Slug-hygiene utilities for the shared directory primitive.
 *
 * Reference: build-outputs/directory-convergence/2026-04-26_R1_shared-schema-spec.md §6
 *
 * The slug rules are inherited from TSI/CLAUDE.md "Coding Conventions":
 *   "Slugs auto-generated from name + city + state: kebab-case"
 *
 * The kebab-case implementation matches RTS scripts/ingest-tcole-tx-le.ts
 * lines 165 to 174 so an ingest script in either codebase produces
 * identical slugs for the same input.
 */

/**
 * Lowercase, ASCII-fold, and kebab-case a string.
 *
 * Mirrors the `slugify` function in scripts/ingest-tcole-tx-le.ts:165 to 174.
 * Exported here so both codebases share a single implementation.
 *
 * @example
 *   kebabCase("Denton Police Dept.") === "denton-police-dept"
 *   kebabCase("Hunter's Café") === "hunters-cafe"
 */
export function kebabCase(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a directory slug from name + city + state.
 *
 * The default policy across TSI listings is "name-city-state" with the
 * state-abbreviation suffix omitted when the name already implies the
 * geography (e.g., a city name embedded in the org name). Callers may
 * override the default by passing a literal slug.
 *
 * @example
 *   makeSlug("Denton Police Department", "Denton", "TX")
 *     === "denton-police-department"
 *   makeSlug("First Baptist", "Lewisville", "TX")
 *     === "first-baptist-lewisville-tx"
 */
export function makeSlug(name: string, city: string, state: string): string {
  const base = kebabCase(name);
  const cityKebab = kebabCase(city);
  const stateKebab = kebabCase(state);

  // If the city is already inside the name, omit the suffix.
  if (cityKebab.length > 0 && base.includes(cityKebab)) {
    return base;
  }

  // Otherwise append city and state for global uniqueness.
  const parts = [base, cityKebab, stateKebab].filter((p) => p.length > 0);
  return parts.join("-");
}

/**
 * Resolve a slug collision by appending a numeric suffix.
 *
 * The convention matches the journey-architect bulk card-create pattern
 * at anthropic-skills:simpli-fi-journey-architect "Batch Card Generator"
 * section, generate_slug function: collision check returns base, base-1,
 * base-2, ...
 *
 * @param base the candidate slug
 * @param existing a Set of slugs already in the canonical store
 * @returns a unique slug not present in `existing`
 */
export function resolveSlugCollision(
  base: string,
  existing: ReadonlySet<string>
): string {
  if (!existing.has(base)) {
    return base;
  }
  let counter = 1;
  while (existing.has(`${base}-${counter}`)) {
    counter += 1;
  }
  return `${base}-${counter}`;
}

/**
 * Validate that a slug obeys the kebab-case constraint.
 *
 * Rejects: uppercase letters, leading or trailing hyphens, double hyphens,
 * non-ASCII characters, underscores, dots.
 *
 * @returns true when the slug is well-formed.
 */
export function isValidSlug(slug: string): boolean {
  if (slug.length === 0) return false;
  if (slug.length > 200) return false;
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Normalize a name for collision detection. Mirrors the `normalizeName`
 * function in scripts/ingest-tcole-tx-le.ts:196 to 203.
 *
 * Strips department-suffix words (department, dept, office, services, etc.)
 * and reduces to lowercase letters and digits. Used by the dedup module
 * to detect cross-source name collisions where one source says "Denton
 * Police Department" and another says "Denton PD".
 */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(department|dept|office|services|service|the|of)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/**
 * Normalize a city for collision detection. Mirrors the `normalizeCity`
 * function in scripts/ingest-tcole-tx-le.ts:205 to 207.
 */
export function normalizeCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}
