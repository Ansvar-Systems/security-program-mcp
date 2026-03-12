import { getItem, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getGovernanceTemplate(args: Record<string, unknown>) {
  const id = args.governance_id as string | undefined;
  const category = args.category as string | undefined;

  if (id) {
    const row = getItem(id);
    if (!row || row.type !== "governance_structure") {
      return {
        content: [
          {
            type: "text" as const,
            text: `No governance structure found with ID "${id}".`,
          },
        ],
        isError: true,
        _error_type: "NO_MATCH",
        ...responseMeta(),
      };
    }

    const meta = JSON.parse(row.metadata || "{}");
    const lines = [`# ${row.title}\n`];
    lines.push(
      `**Category:** ${row.category} | **Source:** ${row.source}`
    );
    if (meta.committees) lines.push(`**Committees:** ${meta.committees}`);
    if (meta.reporting_cadence)
      lines.push(`**Reporting cadence:** ${meta.reporting_cadence}`);
    lines.push(`**Tags:** ${row.tags}\n`);
    lines.push(`---\n`);
    lines.push(row.content);

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      ...responseMeta(),
    };
  }

  const results: ItemRow[] = getItemsByType("governance_structure", category);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No governance structures found${category ? ` in category "${category}"` : ""}.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Governance Structures\n`];
  lines.push(`Found ${results.length} governance structure(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(`**ID:** \`${row.id}\` | **Category:** ${row.category}`);
    if (meta.committees) lines.push(`**Committees:** ${meta.committees}`);
    lines.push(`\n${row.summary}\n`);
  }

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
