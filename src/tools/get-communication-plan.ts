import { getItem, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getCommunicationPlan(args: Record<string, unknown>) {
  const id = args.plan_id as string | undefined;
  const category = args.category as string | undefined;

  if (id) {
    const row = getItem(id);
    if (!row || row.type !== "communication_plan") {
      return {
        content: [
          {
            type: "text" as const,
            text: `No communication plan found with ID "${id}".`,
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
    if (meta.audiences) lines.push(`**Audiences:** ${meta.audiences}`);
    if (meta.cadence) lines.push(`**Cadence:** ${meta.cadence}`);
    lines.push(`**Tags:** ${row.tags}\n`);
    lines.push(`---\n`);
    lines.push(row.content);

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      ...responseMeta(),
    };
  }

  const results: ItemRow[] = getItemsByType("communication_plan", category);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No communication plans found${category ? ` in category "${category}"` : ""}.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Communication Plans\n`];
  lines.push(`Found ${results.length} plan(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(`**ID:** \`${row.id}\` | **Category:** ${row.category}`);
    if (meta.audiences) lines.push(`**Audiences:** ${meta.audiences}`);
    lines.push(`\n${row.summary}\n`);
  }

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
