# Tools -- Security Program MCP

> 14 tools across 3 categories (search, lookup, meta)

## Search Tools

### `search_playbooks`

Search security program implementation playbooks by keyword, framework name, or category. Returns summaries with IDs that can be passed to `get_playbook` for full content.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | No | Search term (e.g., "NIS2", "incident response", "SOC 2"). Searches title, summary, content, and tags. |
| `category` | string | No | Filter by category: compliance, security-operations, risk-management, architecture |
| `limit` | number | No | Maximum results (default: 10, max: 50) |

**Returns:** Markdown-formatted list of matching playbooks with ID, category, duration, phase count, and summary.

**Example:**
```
"What playbooks are available for NIS2 compliance?"
-> search_playbooks({ query: "NIS2" })
```

**Data sources:** NIST CSF, ISO 27001, NIS2, SOC 2, DORA methodology content

**Limitations:**
- FTS search may not match partial words; use complete terms
- Returns summaries only; use `get_playbook` for full content

---

### `search_templates`

Search RACI matrices, WBS patterns, and change management templates by keyword or type.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | No | Search term (e.g., "RACI incident response", "WBS compliance") |
| `template_type` | string | No | Filter by type: raci_template, wbs_pattern, change_management |
| `limit` | number | No | Maximum results (default: 10, max: 50) |

**Returns:** Markdown-formatted list of matching templates with ID, type, category, and summary.

**Example:**
```
"Show me RACI templates for access control"
-> search_templates({ query: "access control", template_type: "raci_template" })
```

**Data sources:** ISO 27001, SOC 2, NIST, SANS methodology content

**Limitations:**
- Templates are starting points; adapt for your organization's specific roles and structure

---

## Lookup Tools

### `get_playbook`

Get the full content of a specific playbook by ID. Returns complete multi-phase implementation plan with timelines, deliverables, staffing guidance, and budget indicators.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `playbook_id` | string | Yes | Playbook ID (e.g., "nis2-implementation"). Use `search_playbooks` to find IDs. |

**Returns:** Full Markdown playbook content with phases, activities, deliverables, decision gates, staffing, and budget guidance.

**Example:**
```
"Give me the ISO 27001 implementation playbook"
-> get_playbook({ playbook_id: "iso27001-implementation" })
```

---

### `get_template`

Get the full content of a RACI template, WBS pattern, or change management template by ID.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `template_id` | string | Yes | Template ID (e.g., "raci-incident-response"). Use `search_templates` to find IDs. |

**Returns:** Full Markdown template content with structured tables, role definitions, and implementation notes.

---

### `list_frameworks`

List all available content types, categories, and counts in the database. Use this to understand what content is available before searching.

**Parameters:** None

**Returns:** Markdown table showing content types (playbook, raci_template, wbs_pattern, etc.) and categories with counts.

---

### `get_dependency_map`

Get dependency maps showing prerequisite chains and critical paths for security program activities. If called without an ID, lists all available maps.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `map_id` | string | No | Dependency map ID. Omit to list all. |
| `category` | string | No | Filter by category when listing. |

**Returns:** Dependency table with prerequisite chains, critical path, parallel work streams, and common bottlenecks.

---

### `get_milestones`

Get milestone frameworks with phase gates, success criteria, and timeline markers. If called without an ID, lists all available frameworks.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `milestone_id` | string | No | Milestone framework ID. Omit to list all. |
| `category` | string | No | Filter by category when listing. |

**Returns:** Phase-gate milestones with gate criteria, evidence requirements, and success measures.

---

### `get_governance_template`

Get governance structure templates with committee compositions, reporting lines, and decision authorities. If called without an ID, lists all available structures.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `governance_id` | string | No | Governance template ID. Omit to list all. |
| `category` | string | No | Filter by category when listing. |

**Returns:** Multi-tier governance structure with committee composition, cadence, responsibilities, and reporting flow.

---

### `get_communication_plan`

Get communication plan templates for security programs. If called without an ID, lists all available plans.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `plan_id` | string | No | Communication plan ID. Omit to list all. |
| `category` | string | No | Filter by category when listing. |

**Returns:** Stakeholder map, communication schedule, message templates, and escalation triggers.

---

### `get_charter_template`

Get program charter templates with scope definitions, objectives, success criteria, and budget frameworks. If called without an ID, lists all available charters.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `charter_id` | string | No | Charter ID. Omit to list all. |
| `category` | string | No | Filter by category when listing. |

**Returns:** Complete program charter with purpose, scope, objectives, milestones, budget, risks, and governance.

---

### `get_resource_model`

Get resource and staffing models for security programs. Defines team structures, role definitions, and budget ranges by organization size. If called without an ID, lists all available models.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `model_id` | string | No | Resource model ID. Omit to list all. |
| `category` | string | No | Filter by category when listing. |

**Returns:** Team structure, role definitions, FTE estimates, and budget frameworks.

---

## Meta Tools

### `list_sources`

List all data sources and their provenance. Shows which frameworks and standards the methodology content is derived from.

**Parameters:** None

**Returns:** Markdown table of sources with authority, version, and license information.

---

### `about`

Get server metadata including name, version, description, statistics, data sources, freshness information, and Ansvar MCP Network details.

**Parameters:** None

**Returns:** JSON with server info, stats, source list, freshness data, and network info.

---

### `check_data_freshness`

Check the age and freshness status of each data source. Reports which sources are current, due for refresh, or overdue.

**Parameters:** None

**Returns:** Markdown table with per-source freshness status and instructions for triggering a refresh.
