# Coverage -- Security Program MCP

> Last verified: 2026-04-26 | Database version: 2.0.0

## What's Included

| Source | Items | Version/Date | Completeness | Refresh |
|--------|-------|-------------|-------------|---------|
| NIST CSF 2.0 methodology | Playbooks | CSF 2.0 (Feb 2024) | Partial | Manual |
| ISO 27001:2022 methodology | Templates, playbooks | ISO 27001:2022 | Partial | Manual |
| NIS2 Directive (EUR-Lex) | Governance, milestones | Directive 2022/2555 | Partial | Manual |
| SOC 2 preparation methodology | Playbooks, templates | TSC 2017 (2022 updates) | Partial | Manual |
| DORA implementation methodology | Playbooks, governance | Regulation 2022/2554 | Partial | Manual |
| Program management practices | All content types | 2026-03 | Partial | Manual |

**Content types:** playbooks, RACI templates, WBS patterns, milestone frameworks, dependency maps, governance structures, communication plans, change management templates, program charters, resource models

**Total:** 14 tools, ~49 items across 10 content types

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| NIS2 implementation playbook | Quarantined 2026-04-26 — ENISA NC license incompatible with commercial use. Backfill from EUR-Lex pending Phase 4 review. Fleet-overlap with eu-regulations MCP may obviate backfill. | Phase 4 |
| Privacy program playbooks (GDPR, CCPA) | Planned for v2.1 | Yes (v2.1) |
| Cloud-provider-specific guides (AWS, Azure, GCP) | Scope limited to framework-agnostic content | No |
| Sector-specific playbooks (HIPAA, PCI DSS) | Planned for v2.2 | Yes (v2.2) |
| CMMC / FedRAMP playbooks | US federal market focus not in scope for v2.0 | No |
| Tool-specific implementation guides | Vendor-neutral by design | No |

## Limitations

- Content is derived methodology, not reproduced framework text (ISO, NIST documents must be obtained separately)
- Timeline and budget estimates are ranges based on industry benchmarks; actual values depend on organization context
- RACI matrices use generic role names; adapt to your organization's specific titles
- Content reflects common best practices as of the build date; regulatory requirements may change
- This is curated content, not a real-time data source

## Data Freshness

| Source | Refresh Schedule | Last Refresh | Next Expected |
|--------|-----------------|-------------|---------------|
| NIST CSF 2.0 methodology | Manual | 2026-03-12 | On framework update |
| ISO 27001:2022 methodology | Manual | 2026-03-12 | On standard update |
| NIS2 Directive (EUR-Lex) | Manual | 2026-04-26 | On implementing act update |
| SOC 2 methodology | Manual | 2026-03-12 | On TSC updates |
| DORA methodology | Manual | 2026-03-12 | On RTS/ITS updates |
| Program management practices | Manual | 2026-03-12 | Quarterly review |

To check freshness programmatically, call the `check_data_freshness` tool.
