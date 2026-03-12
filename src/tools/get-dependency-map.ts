import { getItem, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getDependencyMap(args: Record<string, unknown>) {
  const id = args.map_id as string | undefined;
  const category = args.category as string | undefined;

  if (id) {
    const row = getItem(id);
    if (!row || row.type !== "dependency_map") {
      return {
        content: [
          {
            type: "text" as const,
            text: `No dependency map found with ID "${id}".`,
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
    if (meta.critical_path)
      lines.push(`**Critical path:** ${meta.critical_path}`);
    lines.push(`**Tags:** ${row.tags}\n`);
    lines.push(`---\n`);
    lines.push(row.content);

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      ...responseMeta(),
    };
  }

  // List all dependency maps
  const results: ItemRow[] = getItemsByType("dependency_map", category);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No dependency maps found${category ? ` in category "${category}"` : ""}.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Dependency Maps\n`];
  lines.push(`Found ${results.length} dependency map(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(`**ID:** \`${row.id}\` | **Category:** ${row.category}`);
    if (meta.critical_path)
      lines.push(`**Critical path:** ${meta.critical_path}`);
    lines.push(`\n${row.summary}\n`);
  }

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
