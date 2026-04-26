# Changelog

## [2.0.0] - 2026-04-26

### Removed
- `data/content/playbooks/nis2-implementation.yml` — deleted. The playbook cited ENISA NIS2
  Implementation Guidance as its primary source. The ENISA publications license
  ("freely available for non-commercial use with attribution") is incompatible with
  Ansvar commercial use. Content is quarantined to `/tmp/security-program-pre-scrub-2026-04-26/`.

### Changed
- `sources.yml` — ENISA NIS2 source entry replaced with quarantine note. Backfill
  candidate: EUR-Lex NIS2 implementing acts (Directive 2022/2555). See fleet-overlap note:
  the `eu-regulations` MCP already indexes the NIS2 Directive at article level; Phase 4
  work should verify whether that MCP already covers this at adequate depth before
  authoring new content here.
- `data/content/governance/governance-structures.yml` — `governance-nis2-compliance` source
  field updated from ENISA attribution to EUR-Lex citation only. Content unchanged
  (Article 20 obligation structure is derived from the directive text, not ENISA guidance).
- `data/content/governance/milestones.yml` — `milestones-nis2-compliance` source field
  updated from ENISA attribution to EUR-Lex citation only. Content unchanged.
- `src/tools/meta.ts` — `listSources`, `about`, and `checkDataFreshness` updated:
  ENISA URL replaced with EUR-Lex NIS2 directive URL; version bumped to 2.0.0;
  total_sources reduced from 6 to 5 (ENISA removed, NIS2 directive listed under EU legislation).
- `package.json` — version 1.0.0 -> 2.0.0 (major bump: source removed, breaking change
  for consumers expecting the NIS2 playbook tool response).
- `README.md`, `COVERAGE.md`, `DISCLAIMER.md` — ENISA references removed; NIS2 gap
  documented in COVERAGE.md under What's NOT Included.

### Fleet-overlap note
The `eu-regulations` MCP serves the NIS2 Directive (Directive 2022/2555) and its
implementing acts. Before Phase 4 backfill work, check whether `eu-regulations` already
returns NIS2 content at article level. If it does, this source entry remains a permanent
gap and this MCP does not add value for NIS2 queries.

## [1.0.0] - 2026-03-14

Initial release with playbooks, RACI templates, WBS patterns, milestone frameworks,
governance structures, communication plans, program charters, and resource models
covering NIST CSF 2.0, ISO 27001:2022, NIS2 Directive, SOC 2, DORA, and general
security program management practices.
