import { getItem, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getCharterTemplate(args: Record<string, unknown>) {
  const id = args.charter_id as string | undefined;
  const category = args.category as string | undefined;

  if (id) {
    const row = getItem(id);
    if (!row || row.type !== "program_charter") {
      return {
        content: [
          {
            type: "text" as const,
            text: `No program charter found with ID "${id}".`,
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
    if (meta.sponsor_role) lines.push(`**Sponsor role:** ${meta.sponsor_role}`);
    if (meta.duration) lines.push(`**Duration:** ${meta.duration}`);
    lines.push(`**Tags:** ${row.tags}\n`);
    lines.push(`---\n`);
    lines.push(row.content);

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      ...responseMeta(),
    };
  }

  const results: ItemRow[] = getItemsByType("program_charter", category);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No program charters found${category ? ` in category "${category}"` : ""}.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Program Charters\n`];
  lines.push(`Found ${results.length} charter(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(`**ID:** \`${row.id}\` | **Category:** ${row.category}`);
    if (meta.sponsor_role)
      lines.push(`**Sponsor role:** ${meta.sponsor_role}`);
    lines.push(`\n${row.summary}\n`);
  }

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
