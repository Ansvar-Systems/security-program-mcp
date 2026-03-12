import { getItem } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getTemplate(args: Record<string, unknown>) {
  const id = args.template_id as string;

  if (!id) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Parameter `template_id` is required.",
        },
      ],
      isError: true,
      _error_type: "INVALID_INPUT",
      ...responseMeta(),
    };
  }

  const row = getItem(id);

  if (
    !row ||
    !["raci_template", "wbs_pattern", "change_management"].includes(row.type)
  ) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No template found with ID "${id}". Use search_templates to find available templates.`,
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
    `**Type:** ${row.type} | **Category:** ${row.category} | **Source:** ${row.source}`
  );
  if (meta.roles) lines.push(`**Roles:** ${meta.roles}`);
  if (meta.deliverables) lines.push(`**Deliverables:** ${meta.deliverables}`);
  lines.push(`**Tags:** ${row.tags}\n`);
  lines.push(`---\n`);
  lines.push(row.content);

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
