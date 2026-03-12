# Security Program MCP

Structured security program planning methodologies: implementation playbooks, RACI templates, WBS patterns, milestone frameworks, governance structures, communication plans, program charters, and resource models.

Part of the [Ansvar MCP Network](https://ansvar.ai/mcp).

## Quick Start

### Remote (HTTP)

Configure your MCP client to connect to the HTTP endpoint:

```json
{
  "mcpServers": {
    "security-program": {
      "url": "https://security-program-mcp.ansvar.eu/mcp"
    }
  }
}
```

### Local (stdio)

```json
{
  "mcpServers": {
    "security-program": {
      "command": "npx",
      "args": ["@ansvar/security-program-mcp"]
    }
  }
}
```

### Docker

```bash
docker build -t security-program-mcp .
docker run -p 3000:3000 security-program-mcp
```

## What's Included

| Content Type | Count | Description |
|-------------|-------|-------------|
| Playbooks | 7 | Multi-phase implementation plans (NIS2, ISO 27001, SOC 2, DORA, NIST CSF, Zero Trust, IR, VulnMgmt) |
| RACI Templates | 8 | Responsibility assignment matrices for security activities |
| WBS Patterns | 6 | Work breakdown structures for program planning |
| Milestone Frameworks | 5+ | Phase-gate definitions with success criteria |
| Dependency Maps | 5 | Prerequisite chains and critical paths |
| Governance Structures | 5 | Committee structures and reporting lines |
| Communication Plans | 5 | Stakeholder communication schedules |
| Program Charters | 5 | Program scope, objectives, and success criteria |
| Resource Models | 4 | Staffing models and budget frameworks |
| Change Management | 2 | Organizational change strategies for security rollouts |

## What's NOT Included

- Privacy-specific playbooks (GDPR, CCPA) -- planned for v1.1
- Cloud-provider-specific guides (AWS, Azure, GCP)
- Sector-specific playbooks (HIPAA, PCI DSS) -- planned for v1.2

See [COVERAGE.md](COVERAGE.md) for full details.

## Available Tools

| Tool | Description |
|------|-------------|
| `search_playbooks` | Search implementation playbooks by keyword or category |
| `get_playbook` | Get full playbook content by ID |
| `search_templates` | Search RACI, WBS, and change management templates |
| `get_template` | Get full template content by ID |
| `list_frameworks` | List all content types and categories |
| `get_dependency_map` | Get prerequisite chains and critical paths |
| `get_milestones` | Get milestone frameworks with success criteria |
| `get_governance_template` | Get governance structures and committee definitions |
| `get_communication_plan` | Get stakeholder communication schedules |
| `get_charter_template` | Get program charter templates |
| `get_resource_model` | Get staffing models and budget frameworks |
| `list_sources` | List data sources and provenance |
| `about` | Server metadata and statistics |
| `check_data_freshness` | Check data freshness status |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Data Sources & Freshness

| Source | Authority | Refresh |
|--------|-----------|---------|
| NIST CSF 2.0 | NIST | Manual (on framework update) |
| ISO 27001:2022 | ISO (derived methodology) | Manual (on standard update) |
| NIS2 Directive | ENISA | Manual (on RTS/ITS update) |
| SOC 2 TSC | AICPA (derived methodology) | Manual (on TSC update) |
| DORA Regulation | ESAs | Manual (on RTS/ITS update) |
| Program Management | ISACA, SANS, (ISC)2 | Manual (quarterly review) |

All content is derived methodology -- not reproduced framework text.
Call `check_data_freshness` to verify current data age.

## Security

| Layer | Tool | Trigger |
|-------|------|---------|
| SAST | CodeQL | Weekly + push/PR |
| SAST | Semgrep | Push/PR |
| Container | Trivy | Weekly |
| Secrets | Gitleaks | Push/PR |
| Supply chain | OSSF Scorecard | Weekly |
| Dependencies | Dependabot | Weekly |

## Disclaimer

**This is NOT professional advice.** Content is provided for informational and research purposes only. Consult qualified security professionals for decisions affecting your organization's security posture or compliance status. See [DISCLAIMER.md](DISCLAIMER.md).

## Ansvar MCP Network

This server is part of the Ansvar MCP Network -- structured access to legislation, compliance frameworks, and cybersecurity standards across 119 countries.

| Category | Servers | Coverage |
|----------|---------|---------|
| Law | 108 | 119 countries, 668K+ laws |
| EU Regulations | 1 | 61 regulations |
| Security Frameworks | 1 | 262 frameworks |
| Domain Intelligence | ~56 | CVE, STRIDE, sanctions, and more |

Directory: [ansvar.ai/mcp](https://ansvar.ai/mcp)

## Development

```bash
# Install dependencies
npm install

# Build database from YAML content
npm run build:db

# Build TypeScript
npm run build

# Run locally (HTTP)
npm start

# Run locally (development with hot reload)
npm run dev

# Type check
npm run typecheck
```

### Branch Strategy

`feature-branch` -> PR to `dev` -> verify on `dev` -> PR to `main` -> deploy

Never push directly to `main`. The `main` branch triggers npm publish, GHCR image build, and Watchtower auto-update.

## License

Apache 2.0 -- see [LICENSE](LICENSE).

All methodology content is derived from publicly available frameworks and standards. No copyrighted framework text is reproduced. See [sources.yml](sources.yml) for provenance details.
