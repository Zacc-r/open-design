// @ts-nocheck
// Scans a source directory and extracts a compact backend manifest:
// entities (from Drizzle schemas / SQL migrations) and endpoints (from
// Next.js app-router route files). No AST — text-pattern extraction only.
// Cap is ~6 KB so the manifest stays within system-prompt budget.

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git', '.turbo', 'out', 'coverage']);
const MANIFEST_BYTE_CAP = 6000;

export interface BackendEntity {
  name: string;
  fields: Array<{ name: string; type: string }>;
  source: 'drizzle' | 'sql';
}

export interface BackendEndpoint {
  method: string;
  path: string;
  source: 'nextjs-route';
}

export interface BackendManifest {
  entities: BackendEntity[];
  endpoints: BackendEndpoint[];
}

// ---------- public entry point ----------

export async function scanBackend(sourcePath: string): Promise<BackendManifest> {
  const resolved = path.resolve(sourcePath);
  const files = await collectFiles(resolved);

  const schemaFiles = files.filter(
    (f) =>
      (f.rel.endsWith('schema.ts') || f.rel.includes('/schema/')) &&
      !f.rel.includes('migration'),
  );
  const migrationFiles = files.filter(
    (f) => f.rel.includes('/migrations/') && f.rel.endsWith('.sql'),
  );
  const routeFiles = files.filter(
    (f) =>
      (f.rel.includes('/app/api/') || f.rel.includes('\\app\\api\\')) &&
      (f.rel.endsWith('/route.ts') || f.rel.endsWith('\\route.ts')),
  );

  const entities: BackendEntity[] = [];
  const seen = new Set<string>();

  // Drizzle schemas take precedence over SQL migrations for same-named tables.
  for (const f of schemaFiles) {
    const src = await tryRead(f.abs);
    if (!src) continue;
    for (const e of parseDrizzleEntities(src)) {
      if (!seen.has(e.name)) {
        seen.add(e.name);
        entities.push(e);
      }
    }
  }

  for (const f of migrationFiles) {
    const src = await tryRead(f.abs);
    if (!src) continue;
    for (const e of parseSqlEntities(src)) {
      if (!seen.has(e.name)) {
        seen.add(e.name);
        entities.push(e);
      }
    }
  }

  const endpoints: BackendEndpoint[] = [];
  for (const f of routeFiles) {
    const src = await tryRead(f.abs);
    if (!src) continue;
    for (const ep of parseNextRoutes(resolved, f.abs, src)) {
      endpoints.push(ep);
    }
  }

  return { entities, endpoints };
}

export function formatManifest(manifest: BackendManifest): string {
  const lines: string[] = [];

  if (manifest.entities.length > 0) {
    lines.push('**Entities**\n');
    for (const e of manifest.entities) {
      const fieldList = e.fields.map((f) => `${f.name}:${f.type}`).join(', ');
      lines.push(`- \`${e.name}\` — ${fieldList || '(no fields parsed)'}`);
    }
  }

  if (manifest.endpoints.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push('**API Endpoints**\n');
    for (const ep of manifest.endpoints) {
      lines.push(`- \`${ep.method} ${ep.path}\``);
    }
  }

  let out = lines.join('\n');
  if (Buffer.byteLength(out, 'utf8') > MANIFEST_BYTE_CAP) {
    // Hard-truncate at byte cap and append a note.
    const enc = Buffer.from(out, 'utf8').slice(0, MANIFEST_BYTE_CAP).toString('utf8');
    // Trim at last newline to avoid cutting mid-line.
    const lastNl = enc.lastIndexOf('\n');
    out = (lastNl > 0 ? enc.slice(0, lastNl) : enc) + '\n\n…(manifest truncated — use source files for full detail)';
  }
  return out;
}

// ---------- Drizzle parser ----------

const DRIZZLE_TABLE_RE = /(?:pgTable|sqliteTable|mysqlTable)\s*\(\s*['"`]([^'"` ]+)['"`]\s*,\s*\{([^}]*)\}/gs;
const DRIZZLE_FIELD_RE = /(\w+)\s*:\s*(\w+)\s*\(/g;

function parseDrizzleEntities(src: string): BackendEntity[] {
  const out: BackendEntity[] = [];
  let m: RegExpExecArray | null;
  DRIZZLE_TABLE_RE.lastIndex = 0;
  while ((m = DRIZZLE_TABLE_RE.exec(src)) !== null) {
    const tableName = m[1];
    const body = m[2];
    const fields: Array<{ name: string; type: string }> = [];
    let fm: RegExpExecArray | null;
    DRIZZLE_FIELD_RE.lastIndex = 0;
    while ((fm = DRIZZLE_FIELD_RE.exec(body)) !== null) {
      fields.push({ name: fm[1], type: fm[2] });
    }
    out.push({ name: tableName, fields, source: 'drizzle' });
  }
  return out;
}

// ---------- SQL migration parser ----------

const SQL_CREATE_RE = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["'`]?(\w+)["'`]?\s*\(([^;]*)\)/gis;
const SQL_COL_RE = /^\s*["'`]?(\w+)["'`]?\s+([\w()]+)/m;

function parseSqlEntities(src: string): BackendEntity[] {
  const byName = new Map<string, BackendEntity>();
  let m: RegExpExecArray | null;
  SQL_CREATE_RE.lastIndex = 0;
  while ((m = SQL_CREATE_RE.exec(src)) !== null) {
    const tableName = m[1].toLowerCase();
    if (tableName === 'index' || tableName === 'unique') continue;
    const body = m[2];
    const fields: Array<{ name: string; type: string }> = [];
    for (const line of body.split('\n')) {
      const cm = SQL_COL_RE.exec(line);
      if (!cm) continue;
      const colName = cm[1].toLowerCase();
      if (/^(primary|unique|foreign|check|index|constraint)$/i.test(colName)) continue;
      fields.push({ name: colName, type: cm[2].toLowerCase() });
    }
    byName.set(tableName, { name: tableName, fields, source: 'sql' });
  }
  return [...byName.values()];
}

// ---------- Next.js route parser ----------

const NEXT_METHOD_RE = /^export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/gm;

function parseNextRoutes(sourceRoot: string, absPath: string, src: string): BackendEndpoint[] {
  const rel = path.relative(sourceRoot, absPath);
  // Convert filesystem path to URL path.
  // e.g. apps/web/app/api/members/[id]/route.ts -> /api/members/[id]
  const parts = rel.split(path.sep).join('/');
  const apiMatch = parts.match(/app\/api\/(.+?)\/route\.ts$/);
  if (!apiMatch) return [];
  const apiPath = '/api/' + apiMatch[1];

  const out: BackendEndpoint[] = [];
  let m: RegExpExecArray | null;
  NEXT_METHOD_RE.lastIndex = 0;
  while ((m = NEXT_METHOD_RE.exec(src)) !== null) {
    out.push({ method: m[1], path: apiPath, source: 'nextjs-route' });
  }
  return out;
}

// ---------- filesystem helpers ----------

interface FileEntry {
  abs: string;
  rel: string;
}

async function collectFiles(dir: string, rel = '', out: FileEntry[] = []): Promise<FileEntry[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const relPath = rel ? `${rel}/${e.name}` : e.name;
    const absPath = path.join(dir, e.name);

    let isDir = e.isDirectory();
    let isFile = e.isFile();
    if (e.isSymbolicLink()) {
      try {
        const st = await stat(absPath);
        isDir = st.isDirectory();
        isFile = st.isFile();
      } catch {
        continue;
      }
    }

    if (isDir) {
      await collectFiles(absPath, relPath, out);
    } else if (isFile) {
      out.push({ abs: absPath, rel: relPath });
    }
  }
  return out;
}

async function tryRead(abs: string): Promise<string | null> {
  try {
    return await readFile(abs, 'utf8');
  } catch {
    return null;
  }
}
