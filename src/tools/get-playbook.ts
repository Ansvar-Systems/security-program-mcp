import { getItem } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function getPlaybook(args: Record<string, unknown>) {
  const id = args.playbook_id as string;

  if (!id) {
    return {
      content: [
        { type: "text" as const, text: "Parameter `playbook_id` is required." },
      ],
      isError: true,
      _error_type: "INVALID_INPUT",
      ...responseMeta(),
    };
  }

  const row = getItem(id);

  if (!row || row.type !== "playbook") {
    return {
      content: [
        {
          type: "text" as const,
          text: `No playbook found with ID "${id}". Use search_playbooks to find available playbooks.`,
        },
      ],
      isError: true,
      _error_type: "NO_MATCH",
      ...responseMeta(),
    };
  }

  const meta = JSON.parse(row.metadata || "{}");
  const lines = [`# ${row.title}\n`];
  lines.push(`**Category:** ${row.category} | **Source:** ${row.source}`);
  if (meta.duration) lines.push(`**Duration:** ${meta.duration}`);
  if (meta.phases) lines.push(`**Phases:** ${meta.phases}`);
  if (meta.target_org_size)
    lines.push(`**Target org size:** ${meta.target_org_size}`);
  lines.push(`**Tags:** ${row.tags}\n`);
  lines.push(`---\n`);
  lines.push(row.content);

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
