# Coverage -- Security Program MCP

> Last verified: 2026-03-12 | Database version: 1.0.0

## What's Included

| Source | Items | Version/Date | Completeness | Refresh |
|--------|-------|-------------|-------------|---------|
| NIST CSF 2.0 methodology | Playbooks | CSF 2.0 (Feb 2024) | Partial | Manual |
| ISO 27001:2022 methodology | Templates, playbooks | ISO 27001:2022 | Partial | Manual |
| NIS2 implementation methodology | Playbooks, governance | Directive 2022/2555 | Partial | Manual |
| SOC 2 preparation methodology | Playbooks, templates | TSC 2017 (2022 updates) | Partial | Manual |
| DORA implementation methodology | Playbooks, governance | Regulation 2022/2554 | Partial | Manual |
| Program management practices | All content types | 2026-03 | Partial | Manual |

**Content types:** playbooks, RACI templates, WBS patterns, milestone frameworks, dependency maps, governance structures, communication plans, change management templates, program charters, resource models

**Total:** 14 tools, ~50 items across 10 content types

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| Privacy program playbooks (GDPR, CCPA) | Planned for v1.1 | Yes (v1.1) |
| Cloud-provider-specific guides (AWS, Azure, GCP) | Scope limited to framework-agnostic content | No |
| Sector-specific playbooks (HIPAA, PCI DSS) | Planned for v1.2 | Yes (v1.2) |
| CMMC / FedRAMP playbooks | US federal market focus not in scope for v1.0 | No |
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
| NIS2 implementation methodology | Manual | 2026-03-12 | On RTS/ITS updates |
| SOC 2 methodology | Manual | 2026-03-12 | On TSC updates |
| DORA methodology | Manual | 2026-03-12 | On RTS/ITS updates |
| Program management practices | Manual | 2026-03-12 | Quarterly review |

To check freshness programmatically, call the `check_data_freshness` tool.
