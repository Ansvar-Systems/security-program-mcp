import { getItem, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getMilestones(args: Record<string, unknown>) {
  const id = args.milestone_id as string | undefined;
  const category = args.category as string | undefined;

  if (id) {
    const row = getItem(id);
    if (!row || row.type !== "milestone_framework") {
      return {
        content: [
          {
            type: "text" as const,
            text: `No milestone framework found with ID "${id}".`,
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
    if (meta.total_milestones)
      lines.push(`**Total milestones:** ${meta.total_milestones}`);
    if (meta.duration) lines.push(`**Duration:** ${meta.duration}`);
    lines.push(`**Tags:** ${row.tags}\n`);
    lines.push(`---\n`);
    lines.push(row.content);

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      ...responseMeta(),
    };
  }

  const results: ItemRow[] = getItemsByType("milestone_framework", category);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No milestone frameworks found${category ? ` in category "${category}"` : ""}.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Milestone Frameworks\n`];
  lines.push(`Found ${results.length} framework(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(`**ID:** \`${row.id}\` | **Category:** ${row.category}`);
    if (meta.total_milestones)
      lines.push(`**Total milestones:** ${meta.total_milestones}`);
    if (meta.duration) lines.push(`**Duration:** ${meta.duration}`);
    lines.push(`\n${row.summary}\n`);
  }

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
