import Database from "better-sqlite3";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "../../data/database.db");

let db: InstanceType<typeof Database> | null = null;

export function getDb(): InstanceType<typeof Database> {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true });
    db.pragma("journal_mode = DELETE");
    db.pragma("cache_size = -64000");
    db.pragma("temp_store = MEMORY");
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export interface ItemRow {
  id: string;
  type: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  metadata: string;
  source: string;
  tags: string;
}

export function searchItems(
  query: string,
  type?: string,
  limit = 20
): ItemRow[] {
  const d = getDb();
  let sql = `
    SELECT i.id, i.type, i.category, i.title, i.summary, i.content, i.metadata, i.source, i.tags,
           rank
    FROM items_fts fts
    JOIN items i ON i.rowid = fts.rowid
    WHERE items_fts MATCH ?
  `;
  const params: (string | number)[] = [query];
  if (type) {
    sql += ` AND i.type = ?`;
    params.push(type);
  }
  sql += ` ORDER BY rank LIMIT ?`;
  params.push(limit);
  return d.prepare(sql).all(...params) as ItemRow[];
}

export function getItem(id: string): ItemRow | undefined {
  const d = getDb();
  return d.prepare("SELECT * FROM items WHERE id = ?").get(id) as
    | ItemRow
    | undefined;
}

export function getItemsByType(
  type: string,
  category?: string
): ItemRow[] {
  const d = getDb();
  if (category) {
    return d
      .prepare(
        "SELECT * FROM items WHERE type = ? AND category = ? ORDER BY title"
      )
      .all(type, category) as ItemRow[];
  }
  return d
    .prepare("SELECT * FROM items WHERE type = ? ORDER BY title")
    .all(type) as ItemRow[];
}

export function getItemsByCategory(category: string): ItemRow[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM items WHERE category = ? ORDER BY type, title")
    .all(category) as ItemRow[];
}

export function getAllTypes(): { type: string; count: number }[] {
  const d = getDb();
  return d
    .prepare(
      "SELECT type, COUNT(*) as count FROM items GROUP BY type ORDER BY type"
    )
    .all() as { type: string; count: number }[];
}

export function getAllCategories(): { category: string; count: number }[] {
  const d = getDb();
  return d
    .prepare(
      "SELECT category, COUNT(*) as count FROM items GROUP BY category ORDER BY category"
    )
    .all() as { category: string; count: number }[];
}

export function getTotalCount(): number {
  const d = getDb();
  const row = d.prepare("SELECT COUNT(*) as cnt FROM items").get() as {
    cnt: number;
  };
  return row.cnt;
}
