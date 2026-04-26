import { getTotalCount, getAllTypes } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function listSources() {
  const lines = [
    `## Data Sources\n`,
    `| Source | Authority | Version | License |`,
    `|--------|-----------|---------|---------|`,
    `| NIST CSF 2.0 | NIST | CSF 2.0 (Feb 2024) | Public Domain |`,
    `| ISO 27001:2022 Methodology | ISO (derived guidance) | ISO 27001:2022 | Derived methodology |`,
    `| NIS2 Directive | EUR-Lex (EU legislation) | Directive 2022/2555 | EU reuse policy (free) |`,
    `| SOC 2 Preparation Methodology | AICPA (derived guidance) | 2017 TSC (2022 updates) | Derived methodology |`,
    `| DORA Implementation | ESAs | Regulation (EU) 2022/2554 | EU legislation |`,
    `| Program Management Practices | ISACA, SANS, (ISC)2 | Current (2026-03) | Derived methodology |`,
    ``,
    `All content is derived methodology -- not reproduced framework text.`,
    `NIS2 playbook content was quarantined 2026-04-26 (ENISA NC license). NIS2 governance`,
    `and milestone frameworks now cite only the directive text via EUR-Lex.`,
    `For detailed coverage, see COVERAGE.md.`,
  ];

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}

export async function about() {
  const total = getTotalCount();
  const types = getAllTypes();

  const result = {
    name: "Security Program MCP",
    version: "2.0.0",
    category: "security_knowledge",
    description:
      "Security program planning methodologies: implementation playbooks, RACI templates, WBS patterns, milestone frameworks, governance structures, communication plans, program charters, and resource models.",
    stats: {
      total_items: total,
      total_sources: 5,
      content_types: types.length,
    },
    data_sources: [
      {
        name: "NIST CSF 2.0",
        url: "https://www.nist.gov/cyberframework",
        authority: "NIST",
        version: "CSF 2.0",
      },
      {
        name: "ISO 27001:2022 Methodology",
        url: "https://www.iso.org/standard/27001",
        authority: "ISO (derived)",
        version: "2022",
      },
      {
        name: "NIS2 Directive",
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2555",
        authority: "EU (EUR-Lex)",
        version: "Directive 2022/2555",
      },
      {
        name: "SOC 2 Methodology",
        url: "https://www.aicpa.org/resources/landing/system-and-organization-controls-soc-suite-of-services",
        authority: "AICPA (derived)",
        version: "2017 TSC",
      },
      {
        name: "DORA Implementation",
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554",
        authority: "ESAs (EUR-Lex)",
        version: "Regulation 2022/2554",
      },
      {
        name: "Program Management Practices",
        url: "https://www.isaca.org/resources",
        authority: "ISACA/SANS/(ISC)2",
        version: "2026-03",
      },
    ],
    freshness: {
      last_ingestion: "2026-03-12",
      database_built: "2026-03-12",
      next_scheduled_refresh: "Manual (curated methodology content)",
    },
    disclaimer:
      "This is a reference tool, not professional advice. Verify critical data against authoritative sources.",
    network: {
      name: "Ansvar MCP Network",
      directory: "https://ansvar.ai/mcp",
      total_servers: 157,
    },
  };

  return {
    content: [
      { type: "text" as const, text: JSON.stringify(result, null, 2) },
    ],
    ...responseMeta(),
  };
}

export async function checkDataFreshness() {
  const lines = [
    `## Data Freshness Report\n`,
    `| Source | Last Refresh | Frequency | Status |`,
    `|--------|-------------|-----------|--------|`,
    `| NIST CSF 2.0 | 2026-03-12 | Manual | Current |`,
    `| ISO 27001:2022 Methodology | 2026-03-12 | Manual | Current |`,
    `| NIS2 Directive (EUR-Lex) | 2026-04-26 | Manual | Current |`,
    `| SOC 2 Methodology | 2026-03-12 | Manual | Current |`,
    `| DORA Implementation | 2026-03-12 | Manual | Current |`,
    `| Program Management Practices | 2026-03-12 | Manual | Current |`,
    ``,
    `Database version: 2.0.0`,
    `Database built: 2026-04-26`,
    ``,
    `This MCP contains curated methodology content that updates manually.`,
    `Framework methodology changes infrequently -- major updates happen`,
    `when source frameworks release new versions.`,
    ``,
    `To trigger a forced rebuild:`,
    `\`\`\``,
    `gh workflow run ingest.yml --repo Ansvar-Systems/security-program-mcp -f force=true`,
    `\`\`\``,
  ];

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
