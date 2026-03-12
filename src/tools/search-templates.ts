import { searchItems, getItemsByType, type ItemRow } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function searchTemplates(args: Record<string, unknown>) {
  const query = args.query as string | undefined;
  const template_type = args.template_type as string | undefined;
  const limit = Math.min(Math.max((args.limit as number) || 10, 1), 50);

  // template_type maps to the item type in DB: raci_template, wbs_pattern, etc.
  const typeFilter = template_type || undefined;

  let results: ItemRow[];

  if (query) {
    results = searchItems(query, typeFilter, limit);
    // If a template_type was given but it's not a direct type match, also filter
    if (!typeFilter) {
      // search across all template-like types
      const templateTypes = [
        "raci_template",
        "wbs_pattern",
        "change_management",
      ];
      const allResults: ItemRow[] = [];
      for (const t of templateTypes) {
        allResults.push(...searchItems(query, t, limit));
      }
      // Deduplicate
      const seen = new Set<string>();
      results = [];
      for (const r of allResults) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          results.push(r);
        }
      }
      results = results.slice(0, limit);
    }
  } else {
    if (typeFilter) {
      results = getItemsByType(typeFilter);
    } else {
      // Return all template types
      const templateTypes = [
        "raci_template",
        "wbs_pattern",
        "change_management",
      ];
      results = [];
      for (const t of templateTypes) {
        results.push(...getItemsByType(t));
      }
    }
    if (limit < results.length) {
      results = results.slice(0, limit);
    }
  }

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No templates found${query ? ` matching "${query}"` : ""}${template_type ? ` of type "${template_type}"` : ""}.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const lines = [`## Security Program Templates\n`];
  lines.push(`Found ${results.length} template(s).\n`);

  for (const row of results) {
    const meta = JSON.parse(row.metadata || "{}");
    lines.push(`### ${row.title}`);
    lines.push(
      `**ID:** \`${row.id}\` | **Type:** ${row.type} | **Category:** ${row.category}`
    );
    if (meta.roles) lines.push(`**Roles:** ${meta.roles}`);
    if (meta.deliverables) lines.push(`**Deliverables:** ${meta.deliverables}`);
    lines.push(`\n${row.summary}\n`);
  }

  lines.push(
    `\n*Use \`get_template\` with the template ID for full content.*`
  );

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
