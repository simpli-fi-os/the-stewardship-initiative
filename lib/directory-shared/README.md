# `directory-shared`

The shared directory primitive for the Simpli-FI OS ecosystem. One TypeScript shape covers three directories that started in three separate codebases: RTS public-safety records, the TSI broader resource directory, and the Five-Year Course's vocation-mentor records.

## What lives here

```
directory-shared/
├── index.ts          re-exports the public surface
├── types.ts          DirectoryEntry interface and per-type metadata shapes
├── slug.ts           slug-hygiene utilities (kebab-case, collision resolution)
├── dedup.ts          dedup index, batch dedup, collision reports
├── source-stamp.ts   provenance wrapper for every insert
└── README.md         this file
```

## Read-me-first

The architecture is documented in two specs in the youth-programs-library:

1. `build-outputs/directory-convergence/2026-04-26_R1_shared-schema-spec.md`
2. `build-outputs/directory-convergence/2026-04-26_R2_migration-plan.md`

The Postgres listings table at TSI is the canonical store. The Firestore vocation-mentors collection (per E2 §3) is a denormalized read cache for the course web app. The shared primitive lives in this folder so a future ingest script in either codebase can ride the same dedup discipline.

## Source citations

The dedup discipline is mirrored from the RTS scripts at:

- `Simpli-FI OS/Ventures/RTS/ready-to-serve/scripts/ingest-tcole-tx-le.ts`
- `Simpli-FI OS/Ventures/RTS/ready-to-serve/scripts/ingest-usfa-tx-fire.ts`
- `Simpli-FI OS/Ventures/RTS/ready-to-serve/scripts/ingest-dshs-tx-ems.ts`

The dedup-report format is mirrored from:

- `Simpli-FI OS/Ventures/RTS/ready-to-serve/src/data/departments/.tx-le-dedup-report.md`
- `Simpli-FI OS/Ventures/RTS/ready-to-serve/src/data/departments/.tx-ems-dedup-report.md`

The TSI listings table schema is the canonical anchor at:

- `Simpli-FI OS/Ventures/TSI/The-Stewardship-Initiative/CLAUDE.md` (Database Schema section)

The Firestore vocation-mentors collection schema is at:

- `youth-programs-library/the-five-year-course/build-outputs/web-app-spec/2026-04-26_E2_data-model-extensions.md` §3

## Stub status

`renderDedupReport` and `renderSourceHeader` are stubs that throw `not_implemented`. The full renderers are ported from the RTS scripts in R2 Phase 2 work. Every other exported symbol is fully implemented and compiles under TypeScript strict mode.
