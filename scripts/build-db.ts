#!/usr/bin/env tsx
/**
 * Build the SQLite database from YAML content files.
 *
 * Reads all YAML files from data/content/, creates the database schema,
 * inserts all items, builds the FTS5 index, and writes coverage.json.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "../data/content");
const DB_PATH = join(__dirname, "../data/database.db");
const COVERAGE_PATH = join(__dirname, "../data/coverage.json");

interface ContentItem {
  id: string;
  type: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  metadata: Record<string, unknown>;
  source: string;
  tags: string;
}

/**
 * Minimal YAML parser for our specific format.
 * Handles multi-document YAML (--- separators) and block scalars (|).
 * Does NOT handle the full YAML spec -- only what our content files use.
 */
function parseYamlDocuments(text: string): ContentItem[] {
  // Split on document separators
  const docs = text.split(/^---$/m).filter((d) => d.trim().length > 0);
  const items: ContentItem[] = [];

  for (const doc of docs) {
    const item = parseSimpleYaml(doc);
    if (item && item.id) {
      items.push(item);
    }
  }

  return items;
}

function parseSimpleYaml(text: string): ContentItem | null {
  const lines = text.split("\n");
  const result: Record<string, string> = {};
  let currentKey = "";
  let inBlock = false;
  let blockIndent = 0;
  let blockLines: string[] = [];
  let metadataLines: string[] = [];
  let inMetadata = false;
  let metadataIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inMetadata) {
      const indent = line.search(/\S/);
      if (indent > metadataIndent || line.trim() === "") {
        metadataLines.push(line);
        continue;
      } else {
        // End of metadata block
        result["metadata"] = parseSimpleMetadata(metadataLines);
        inMetadata = false;
      }
    }

    if (inBlock) {
      // Check if we're still in the block scalar
      if (line.trim() === "") {
        blockLines.push("");
        continue;
      }
      const indent = line.search(/\S/);
      if (indent >= blockIndent) {
        blockLines.push(line.slice(blockIndent));
        continue;
      } else {
        // End of block scalar
        result[currentKey] = blockLines.join("\n").trimEnd();
        inBlock = false;
        blockLines = [];
      }
    }

    // Match key: value on a single line
    const match = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();

      if (value === "|") {
        // Block scalar
        currentKey = key;
        inBlock = true;
        blockIndent = 2; // Assume 2-space indent
        blockLines = [];
        continue;
      }

      if (value === "" && key === "metadata") {
        // Metadata mapping
        inMetadata = true;
        metadataIndent = line.search(/\S/);
        metadataLines = [];
        continue;
      }

      // Remove surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      result[key] = value;
    }
  }

  // Flush any remaining block
  if (inBlock && blockLines.length > 0) {
    result[currentKey] = blockLines.join("\n").trimEnd();
  }
  if (inMetadata && metadataLines.length > 0) {
    result["metadata"] = parseSimpleMetadata(metadataLines);
  }

  if (!result.id) return null;

  // Parse metadata from string if it's a JSON-like structure
  let metadata: Record<string, unknown> = {};
  if (typeof result.metadata === "string") {
    try {
      metadata = JSON.parse(result.metadata);
    } catch {
      metadata = {};
    }
  } else if (typeof result.metadata === "object") {
    metadata = result.metadata as unknown as Record<string, unknown>;
  }

  return {
    id: result.id || "",
    type: result.type || "",
    category: result.category || "",
    title: result.title || "",
    summary: result.summary || "",
    content: result.content || "",
    metadata,
    source: result.source || "",
    tags: result.tags || "",
  };
}

function parseSimpleMetadata(
  lines: string[]
): string {
  const obj: Record<string, string> = {};
  for (const line of lines) {
    const match = line.match(/^\s+(\w[\w_-]*)\s*:\s*(.+)$/);
    if (match) {
      let val = match[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      obj[match[1]] = val;
    }
  }
  return JSON.stringify(obj);
}

function findYamlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...findYamlFiles(fullPath));
    } else if (entry.endsWith(".yml") || entry.endsWith(".yaml")) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  console.log("Building security-program-mcp database...\n");

  // Remove existing database
  if (existsSync(DB_PATH)) {
    unlinkSync(DB_PATH);
  }

  // Read all YAML files
  const yamlFiles = findYamlFiles(CONTENT_DIR);
  console.log("Found " + yamlFiles.length + " YAML files\n");

  const allItems: ContentItem[] = [];
  for (const file of yamlFiles) {
    const text = readFileSync(file, "utf-8");
    const items = parseYamlDocuments(text);
    console.log("  " + file.replace(CONTENT_DIR + "/", "") + ": " + items.length + " items");
    allItems.push(...items);
  }

  console.log("\nTotal items: " + allItems.length + "\n");

  // Create database
  const db = new Database(DB_PATH);

  // Create schema
  db.exec(`
    CREATE TABLE items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      source TEXT DEFAULT '',
      tags TEXT DEFAULT ''
    );

    CREATE INDEX idx_items_type ON items(type);
    CREATE INDEX idx_items_category ON items(category);
    CREATE INDEX idx_items_type_category ON items(type, category);

    CREATE VIRTUAL TABLE items_fts USING fts5(
      title,
      summary,
      content,
      tags,
      content=items,
      content_rowid=rowid
    );

    CREATE TRIGGER items_ai AFTER INSERT ON items BEGIN
      INSERT INTO items_fts(rowid, title, summary, content, tags)
      VALUES (new.rowid, new.title, new.summary, new.content, new.tags);
    END;

    CREATE TRIGGER items_ad AFTER DELETE ON items BEGIN
      INSERT INTO items_fts(items_fts, rowid, title, summary, content, tags)
      VALUES ('delete', old.rowid, old.title, old.summary, old.content, old.tags);
    END;

    CREATE TRIGGER items_au AFTER UPDATE ON items BEGIN
      INSERT INTO items_fts(items_fts, rowid, title, summary, content, tags)
      VALUES ('delete', old.rowid, old.title, old.summary, old.content, old.tags);
      INSERT INTO items_fts(rowid, title, summary, content, tags)
      VALUES (new.rowid, new.title, new.summary, new.content, new.tags);
    END;

    CREATE TABLE db_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Insert items
  const insert = db.prepare(
    "INSERT INTO items (id, type, category, title, summary, content, metadata, source, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const insertMany = db.transaction((items: ContentItem[]) => {
    for (const item of items) {
      insert.run(
        item.id,
        item.type,
        item.category,
        item.title,
        item.summary,
        item.content,
        JSON.stringify(item.metadata),
        item.source,
        item.tags
      );
    }
  });

  insertMany(allItems);

  // Insert metadata
  const insertMeta = db.prepare(
    "INSERT INTO db_metadata (key, value) VALUES (?, ?)"
  );
  insertMeta.run("schema_version", "1.0");
  insertMeta.run("mcp_name", "security-program-mcp");
  insertMeta.run("category", "security_knowledge");
  insertMeta.run("database_built", new Date().toISOString().split("T")[0]);
  insertMeta.run("item_count", String(allItems.length));

  // Set journal mode and optimize
  db.pragma("journal_mode = DELETE");
  db.exec("VACUUM");

  // Verify
  const count = db.prepare("SELECT COUNT(*) as cnt FROM items").get() as {
    cnt: number;
  };
  const types = db
    .prepare(
      "SELECT type, COUNT(*) as cnt FROM items GROUP BY type ORDER BY type"
    )
    .all() as { type: string; cnt: number }[];

  console.log("Database created at " + DB_PATH);
  console.log("Total rows: " + count.cnt);
  console.log("\nBy type:");
  for (const t of types) {
    console.log("  " + t.type + ": " + t.cnt);
  }

  // Verify FTS
  const ftsTest = db
    .prepare(
      "SELECT COUNT(*) as cnt FROM items_fts WHERE items_fts MATCH 'security'"
    )
    .get() as { cnt: number };
  console.log("\nFTS index: " + ftsTest.cnt + " items match 'security'");

  // Verify journal mode
  const journalMode = db.pragma("journal_mode") as { journal_mode: string }[];
  console.log("Journal mode: " + journalMode[0]?.journal_mode);

  db.close();

  // Write coverage.json
  const typeSummary: Record<string, number> = {};
  for (const t of types) {
    typeSummary[t.type] = t.cnt;
  }

  const coverage = {
    schema_version: "1.0",
    mcp_name: "Security Program MCP",
    mcp_type: "security_knowledge",
    coverage_date: new Date().toISOString().split("T")[0],
    database_version: "1.0.0",
    // Sources are generated per actual DB type so verify-coverage.ts
    // (which queries `WHERE type = source.id`) can validate counts.
    // The pre-scrub design used aggregate category names (nist-csf,
    // iso-27001, program-management) that never matched DB type values.
    sources: types.map((t) => ({
      id: t.type,
      name: t.type
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      authority: "Ansvar Systems (post-quarantine surviving content)",
      url: "https://ansvar.eu",
      version: "2.0.0",
      item_count: t.cnt,
      item_type: t.type,
      last_refresh: new Date().toISOString().split("T")[0],
      refresh_frequency: "manual",
      completeness: "partial",
      completeness_note:
        "Surviving content after Red MCP Legal Remediation scrub (2026-04-26). ENISA-attributed content removed; remaining items derive from the EU NIS2 directive text directly.",
    })),
    gaps: [
      {
        id: "gap-privacy-program",
        description: "Privacy program playbooks (GDPR, CCPA implementation)",
        reason: "Planned for v1.1",
        impact: "medium",
        planned: true,
        target_version: "1.1",
      },
      {
        id: "gap-cloud-specific",
        description: "Cloud-provider-specific implementation guides (AWS, Azure, GCP)",
        reason: "Scope limited to framework-agnostic content",
        impact: "low",
        planned: false,
      },
      {
        id: "gap-sector-specific",
        description: "Sector-specific playbooks (healthcare HIPAA, payment PCI DSS)",
        reason: "Planned for v1.2",
        impact: "medium",
        planned: true,
        target_version: "1.2",
      },
    ],
    tools: [
      { name: "search_playbooks", category: "search", description: "Search implementation playbooks", data_sources: ["nist-csf", "program-management"], verified: true },
      { name: "get_playbook", category: "lookup", description: "Get full playbook content", data_sources: ["nist-csf", "program-management"], verified: true },
      { name: "search_templates", category: "search", description: "Search RACI, WBS, and change management templates", data_sources: ["iso-27001", "program-management"], verified: true },
      { name: "get_template", category: "lookup", description: "Get full template content", data_sources: ["iso-27001", "program-management"], verified: true },
      { name: "list_frameworks", category: "meta", description: "List content types and categories", data_sources: ["program-management"], verified: true },
      { name: "get_dependency_map", category: "lookup", description: "Get dependency maps", data_sources: ["program-management"], verified: true },
      { name: "get_milestones", category: "lookup", description: "Get milestone frameworks", data_sources: ["program-management"], verified: true },
      { name: "get_governance_template", category: "lookup", description: "Get governance structures", data_sources: ["program-management"], verified: true },
      { name: "get_communication_plan", category: "lookup", description: "Get communication plans", data_sources: ["program-management"], verified: true },
      { name: "get_charter_template", category: "lookup", description: "Get program charters", data_sources: ["program-management"], verified: true },
      { name: "get_resource_model", category: "lookup", description: "Get resource and staffing models", data_sources: ["program-management"], verified: true },
      { name: "list_sources", category: "meta", description: "List data sources", data_sources: [], verified: true },
      { name: "about", category: "meta", description: "Server metadata", data_sources: [], verified: true },
      { name: "check_data_freshness", category: "meta", description: "Check data freshness", data_sources: [], verified: true },
    ],
    summary: {
      total_tools: 14,
      total_sources: 6,
      total_items: count.cnt,
      db_size_mb: 0,
      known_gaps: 3,
      gaps_planned: 2,
      types: typeSummary,
    },
  };

  writeFileSync(COVERAGE_PATH, JSON.stringify(coverage, null, 2) + "\n");
  console.log("\nCoverage written to " + COVERAGE_PATH);
  console.log("\nDone.");
}

main();
