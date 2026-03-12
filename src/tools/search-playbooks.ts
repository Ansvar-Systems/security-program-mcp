import { searchItems, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function searchPlaybooks(args: Record<string, unknown>) {
  const query = args.query as string | undefined;
  const category = args.category as string | undefined;
  const limit = Math.min(Math.max((args.limit as number) || 10, 1), 50);

  let results: ItemRow[];

  if (query) {
    results = searchItems(query, "playbook", limit);
  } else {
    results = getItemsByType("playbook", category);
    if (limit < results.length) {
      results = results.slice(0, limit);
    }
  }

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No playbooks found${query ? ` matching "${query}"` : ""}${category ? ` in category "${category}"` : ""}. Use list_frameworks to see available categories.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Security Program Playbooks\n`];
  lines.push(`Found ${results.length} playbook(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(`**ID:** \`${row.id}\` | **Category:** ${row.category}`);
    if (meta.duration) lines.push(`**Duration:** ${meta.duration}`);
    if (meta.phases) lines.push(`**Phases:** ${meta.phases}`);
    lines.push(`\n${row.summary}\n`);
    lines.push(`**Tags:** ${row.tags}\n`);
  }

  lines.push(
    `\n*Use \`get_playbook\` with the playbook ID for full implementation details.*`
  );

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
