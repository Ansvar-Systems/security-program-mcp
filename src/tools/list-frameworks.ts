import { getAllTypes, getAllCategories, getTotalCount } from "../database/db.js";
import { responseMeta } from "../lib/response-meta.js";

export async function listFrameworks() {
  const types = getAllTypes();
  const categories = getAllCategories();
  const total = getTotalCount();

  const lines = [`## Security Program Content Index\n`];
  lines.push(`**Total items:** ${total}\n`);

  lines.push(`### Content Types\n`);
  lines.push(`| Type | Count |`);
  lines.push(`|------|-------|`);
  for (const t of types) {
    lines.push(`| ${t.type} | ${t.count} |`);
  }

  lines.push(`\n### Categories\n`);
  lines.push(`| Category | Count |`);
  lines.push(`|----------|-------|`);
  for (const c of categories) {
    lines.push(`| ${c.category} | ${c.count} |`);
  }

  lines.push(`\n### Available Content Types\n`);
  lines.push(`- **playbook** -- Multi-phase implementation plans with timelines, deliverables, and decision gates`);
  lines.push(`- **raci_template** -- Responsibility assignment matrices for security activities`);
  lines.push(`- **wbs_pattern** -- Work breakdown structures for program planning`);
  lines.push(`- **milestone_framework** -- Phase-gate milestone definitions with success criteria`);
  lines.push(`- **dependency_map** -- Prerequisite and dependency chains between program activities`);
  lines.push(`- **governance_structure** -- Committee structures, reporting lines, decision authorities`);
  lines.push(`- **communication_plan** -- Stakeholder communication schedules and message frameworks`);
  lines.push(`- **change_management** -- Organizational change management strategies`);
  lines.push(`- **program_charter** -- Program charter templates with scope, objectives, and success criteria`);
  lines.push(`- **resource_model** -- Staffing models, role definitions, and budget frameworks`);

  lines.push(
    `\n*Use the search and get tools to access specific content.*`
  );

  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    ...responseMeta(),
  };
}
