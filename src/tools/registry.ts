import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { searchPlaybooks } from "./search-playbooks.js";
import { getPlaybook } from "./get-playbook.js";
import { searchTemplates } from "./search-templates.js";
import { getTemplate } from "./get-template.js";
import { listFrameworks } from "./list-frameworks.js";
import { getDependencyMap } from "./get-dependency-map.js";
import { getMilestones } from "./get-milestones.js";
import { getGovernanceTemplate } from "./get-governance-template.js";
import { getCommunicationPlan } from "./get-communication-plan.js";
import { getCharterTemplate } from "./get-charter-template.js";
import { getResourceModel } from "./get-resource-model.js";
import { listSources, about, checkDataFreshness } from "./meta.js";
import { responseMeta } from "../lib/response-meta.js";

export const TOOL_DEFINITIONS: Tool[] = [
  {
    name: "search_playbooks",
    description:
      "Search security program implementation playbooks by keyword, framework, or category. Returns playbook summaries with IDs. Covers NIS2, ISO 27001, SOC 2, DORA, NIST CSF, Zero Trust, incident response, and vulnerability management programs.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search term (e.g., 'NIS2', 'incident response', 'SOC 2'). Searches title, summary, content, and tags.",
        },
        category: {
          type: "string",
          description:
            "Filter by category: compliance, security-operations, risk-management, architecture",
        },
        limit: {
          type: "number",
          description: "Maximum results to return (default: 10, max: 50)",
        },
      },
    },
  },
  {
    name: "get_playbook",
    description:
      "Get the full content of a specific security program playbook by ID. Returns complete multi-phase implementation plan with timelines, deliverables, staffing guidance, and decision gates.",
    inputSchema: {
      type: "object" as const,
      properties: {
        playbook_id: {
          type: "string",
          description:
            "Playbook ID (e.g., 'nis2-implementation', 'iso27001-implementation'). Use search_playbooks to find IDs.",
        },
      },
      required: ["playbook_id"],
    },
  },
  {
    name: "search_templates",
    description:
      "Search RACI matrices, WBS patterns, and change management templates. Returns template summaries with IDs for incident response, access control, vendor assessment, patch management, and other security activities.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search term (e.g., 'RACI incident response', 'WBS SOC', 'change management')",
        },
        template_type: {
          type: "string",
          description:
            "Filter by type: raci_template, wbs_pattern, change_management",
        },
        limit: {
          type: "number",
          description: "Maximum results to return (default: 10, max: 50)",
        },
      },
    },
  },
  {
    name: "get_template",
    description:
      "Get the full content of a RACI template, WBS pattern, or change management template by ID. Returns complete structured content ready for adaptation.",
    inputSchema: {
      type: "object" as const,
      properties: {
        template_id: {
          type: "string",
          description:
            "Template ID (e.g., 'raci-incident-response', 'wbs-soc-build'). Use search_templates to find IDs.",
        },
      },
      required: ["template_id"],
    },
  },
  {
    name: "list_frameworks",
    description:
      "List all available content types and categories in the security program database. Shows counts per type (playbooks, RACI templates, WBS patterns, milestones, governance, etc.) and per category.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_dependency_map",
    description:
      "Get dependency maps showing prerequisite chains and critical paths for security program activities. Shows which activities must complete before others can start.",
    inputSchema: {
      type: "object" as const,
      properties: {
        map_id: {
          type: "string",
          description:
            "Specific dependency map ID. Omit to list all available maps.",
        },
        category: {
          type: "string",
          description: "Filter by category when listing maps",
        },
      },
    },
  },
  {
    name: "get_milestones",
    description:
      "Get milestone frameworks with phase gates, success criteria, and timeline markers for security programs. Defines what 'done' looks like at each stage.",
    inputSchema: {
      type: "object" as const,
      properties: {
        milestone_id: {
          type: "string",
          description:
            "Specific milestone framework ID. Omit to list all available frameworks.",
        },
        category: {
          type: "string",
          description: "Filter by category when listing frameworks",
        },
      },
    },
  },
  {
    name: "get_governance_template",
    description:
      "Get governance structure templates defining committee compositions, reporting lines, decision authorities, and escalation paths for security programs.",
    inputSchema: {
      type: "object" as const,
      properties: {
        governance_id: {
          type: "string",
          description:
            "Specific governance template ID. Omit to list all available structures.",
        },
        category: {
          type: "string",
          description: "Filter by category when listing structures",
        },
      },
    },
  },
  {
    name: "get_communication_plan",
    description:
      "Get communication plan templates for security programs. Defines stakeholder groups, message types, cadence, and escalation triggers.",
    inputSchema: {
      type: "object" as const,
      properties: {
        plan_id: {
          type: "string",
          description:
            "Specific communication plan ID. Omit to list all available plans.",
        },
        category: {
          type: "string",
          description: "Filter by category when listing plans",
        },
      },
    },
  },
  {
    name: "get_charter_template",
    description:
      "Get program charter templates with scope definitions, objectives, success criteria, budget frameworks, and sponsor responsibilities for security programs.",
    inputSchema: {
      type: "object" as const,
      properties: {
        charter_id: {
          type: "string",
          description:
            "Specific charter ID. Omit to list all available charters.",
        },
        category: {
          type: "string",
          description: "Filter by category when listing charters",
        },
      },
    },
  },
  {
    name: "get_resource_model",
    description:
      "Get resource and staffing models for security programs. Defines team structures, role requirements, FTE estimates, skill matrices, and budget ranges by organization size.",
    inputSchema: {
      type: "object" as const,
      properties: {
        model_id: {
          type: "string",
          description:
            "Specific resource model ID. Omit to list all available models.",
        },
        category: {
          type: "string",
          description: "Filter by category when listing models",
        },
      },
    },
  },
  {
    name: "list_sources",
    description:
      "List all data sources and their provenance. Shows which frameworks and standards the methodology content is derived from.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "about",
    description:
      "Get server metadata: name, version, description, statistics, data sources, freshness info, and Ansvar MCP Network details.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "check_data_freshness",
    description:
      "Check the age and freshness status of each data source. Reports which sources are current, due for refresh, or overdue.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

type HandlerFn = (args: Record<string, unknown>) => Promise<{
  content: { type: string; text: string }[];
  [key: string]: unknown;
}>;

const handlers: Record<string, HandlerFn> = {
  search_playbooks: searchPlaybooks,
  get_playbook: getPlaybook,
  search_templates: searchTemplates,
  get_template: getTemplate,
  list_frameworks: listFrameworks as HandlerFn,
  get_dependency_map: getDependencyMap,
  get_milestones: getMilestones,
  get_governance_template: getGovernanceTemplate,
  get_communication_plan: getCommunicationPlan,
  get_charter_template: getCharterTemplate,
  get_resource_model: getResourceModel,
  list_sources: listSources as HandlerFn,
  about: about as HandlerFn,
  check_data_freshness: checkDataFreshness as HandlerFn,
};

export async function dispatch(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: { type: string; text: string }[]; [key: string]: unknown }> {
  const handler = handlers[name];
  if (!handler) {
    return {
      content: [
        {
          type: "text",
          text: `Unknown tool: "${name}". Call list_frameworks to see available tools.`,
        },
      ],
      isError: true,
      _error_type: "INVALID_INPUT",
      ...responseMeta(),
    };
  }

  try {
    return await handler(args);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
      ...responseMeta(),
    };
  }
}
