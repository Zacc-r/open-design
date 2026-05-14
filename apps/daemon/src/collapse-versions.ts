// One-shot per-project cleanup that collapses accumulated -2/-3/-N
// versioned HTML files back to a single canonical filename per artifact
// identifier.
//
// Older builds appended numeric suffixes whenever the model regenerated
// the same conceptual page (zacc-romero-signin.html, -2, -3 …). The
// going-forward fix in deriveCanonicalFilename + overwrite-in-place
// stops the bleeding; this module heals the prior damage.
//
// Pipeline:
//   computePlan()  →  pure: list files, group by identifier, pick winner
//   appendAudit()  →  writes the intended plan BEFORE any mutation, so a
//                     crash mid-execute leaves a recoverable trail
//   execute()      →  performs renames/deletes + tab/deployment row
//                     updates; appends an "applied" record per action
//
// Out of scope (v1):
//  - Orphan .artifact.json files with no matching .html.
//  - Multi-process locking. Caller must stop the daemon's chat sessions
//    or accept the residual race window. The HTTP wrapper warns first.

import { appendFile, mkdir, rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { listFiles, projectDir } from './projects.js';

type Database = any;

interface ProjectFile {
  name: string;
  kind: string;
  mtime: number;
  artifactManifest: ArtifactManifestLike | null | undefined;
}

interface ArtifactManifestLike {
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: { identifier?: string };
}

export interface CollapseGroup {
  key: string;
  keyKind: 'manifest-identifier' | 'stripped-basename';
  canonical: string;
  winner: string;
  winnerSelectedBy: 'manifest-createdAt' | 'mtime';
  losers: string[];
}

export type CollapseOp =
  | { op: 'rename'; from: string; to: string; key: string }
  | { op: 'delete'; filename: string; key: string };

export interface CollapsePlan {
  projectId: string;
  groups: CollapseGroup[];
  ops: CollapseOp[];
  noop: boolean;
}

export interface CollapseSummary {
  projectId: string;
  kept: string[];
  renamed: Array<{ from: string; to: string }>;
  deleted: string[];
  noop: boolean;
  auditLog: string | null;
}

const STRIPPABLE_RE = /^(.+?)-(\d+)\.html$/i;
const MAX_STRIPPABLE_N = 99;

export async function computeProjectPlan(
  projectsRoot: string,
  projectId: string,
): Promise<CollapsePlan> {
  const allFiles = (await listFiles(projectsRoot, projectId)) as ProjectFile[];
  const htmlFiles = allFiles.filter((f) => f.kind === 'html');

  // Pre-pass: for files without a manifest identifier, figure out which
  // stripped-bases have multiple siblings. Only multi-sibling bases are
  // eligible for the strip — `landing-2024.html` standing alone keeps
  // its full name, but `landing.html` + `landing-2.html` collapse.
  const stripCount = new Map<string, number>();
  for (const f of htmlFiles) {
    const stripped = strippedBaseFor(f.name);
    stripCount.set(stripped, (stripCount.get(stripped) ?? 0) + 1);
  }

  type Bucket = { keyKind: CollapseGroup['keyKind']; files: ProjectFile[] };
  const buckets = new Map<string, Bucket>();
  for (const f of htmlFiles) {
    const identifier = pickIdentifier(f.artifactManifest);
    let key: string;
    let keyKind: CollapseGroup['keyKind'];
    if (identifier) {
      key = identifier;
      keyKind = 'manifest-identifier';
    } else {
      const stripped = strippedBaseFor(f.name);
      const eligible =
        f.name !== `${stripped}.html` && (stripCount.get(stripped) ?? 0) > 1;
      // Files in a multi-sibling cluster collapse onto the stripped base.
      // A file already at canonical (`foo.html`) joins the same cluster
      // because its stripped form is itself. A standalone numeric-suffix
      // file (`landing-2024.html`, no `landing.html` sibling) keeps its
      // full name as its own group.
      key = eligible || (stripCount.get(stripped) ?? 0) > 1 ? stripped : basenameNoExt(f.name);
      keyKind = 'stripped-basename';
    }
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { keyKind, files: [] };
      buckets.set(key, bucket);
    }
    bucket.files.push(f);
  }

  const groups: CollapseGroup[] = [];
  const ops: CollapseOp[] = [];
  for (const [key, bucket] of buckets) {
    const winner = pickWinner(bucket.files);
    const canonical = `${key}.html`;
    const losers = bucket.files.filter((f) => f.name !== winner.file.name);

    // Edge case: winner is already at canonical AND no losers exist —
    // nothing to do for this group.
    const winnerAtCanonical = winner.file.name === canonical;
    const hasLosers = losers.length > 0;
    if (winnerAtCanonical && !hasLosers) {
      groups.push({
        key,
        keyKind: bucket.keyKind,
        canonical,
        winner: winner.file.name,
        winnerSelectedBy: winner.selectedBy,
        losers: [],
      });
      continue;
    }

    groups.push({
      key,
      keyKind: bucket.keyKind,
      canonical,
      winner: winner.file.name,
      winnerSelectedBy: winner.selectedBy,
      losers: losers.map((f) => f.name),
    });

    // If a non-winner file already sits at the canonical name, we need
    // to delete it FIRST so the rename has somewhere to land. (This
    // happens when an older `foo.html` lost the timestamp race to
    // `foo-2.html`.) Surface that as the first op for this group.
    const blockingLoser = losers.find((f) => f.name === canonical);
    if (!winnerAtCanonical && blockingLoser) {
      ops.push({ op: 'delete', filename: blockingLoser.name, key });
    }
    if (!winnerAtCanonical) {
      ops.push({ op: 'rename', from: winner.file.name, to: canonical, key });
    }
    for (const loser of losers) {
      if (loser.name === canonical && !winnerAtCanonical) continue; // already deleted above
      ops.push({ op: 'delete', filename: loser.name, key });
    }
  }

  const noop = ops.length === 0;
  return { projectId, groups, ops, noop };
}

export async function executeProjectPlan(
  projectsRoot: string,
  db: Database,
  plan: CollapsePlan,
  auditLogPath: string,
): Promise<CollapseSummary> {
  // Audit-before-mutate: write the full intended plan first.
  await appendAudit(auditLogPath, {
    ts: new Date().toISOString(),
    kind: 'plan',
    projectId: plan.projectId,
    plan,
  });

  if (plan.noop) {
    await appendAudit(auditLogPath, {
      ts: new Date().toISOString(),
      kind: 'complete',
      projectId: plan.projectId,
      noop: true,
    });
    return {
      projectId: plan.projectId,
      kept: plan.groups.map((g) => g.winner),
      renamed: [],
      deleted: [],
      noop: true,
      auditLog: auditLogPath,
    };
  }

  const dir = projectDir(projectsRoot, plan.projectId);
  const renamed: Array<{ from: string; to: string }> = [];
  const deleted: string[] = [];

  // Snapshot current tabs so we can decide promotion before mutating.
  const currentTabs = listTabsRaw(db, plan.projectId);
  const activeTab = currentTabs.find((t) => t.is_active === 1)?.name ?? null;

  // Build a from→to + delete-set view of file movements for tab/deploy logic.
  const renameMap = new Map<string, string>();
  const deleteSet = new Set<string>();
  const groupOfFile = new Map<string, string>(); // filename → group key
  for (const op of plan.ops) {
    if (op.op === 'rename') {
      renameMap.set(op.from, op.to);
      groupOfFile.set(op.from, op.key);
      groupOfFile.set(op.to, op.key);
    } else {
      deleteSet.add(op.filename);
      groupOfFile.set(op.filename, op.key);
    }
  }
  // Group → canonical (target after cleanup)
  const groupCanonical = new Map<string, string>();
  for (const g of plan.groups) groupCanonical.set(g.key, g.canonical);

  for (const op of plan.ops) {
    try {
      if (op.op === 'rename') {
        await renameWithSidecar(dir, op.from, op.to);
        await appendAudit(auditLogPath, {
          ts: new Date().toISOString(),
          kind: 'applied',
          projectId: plan.projectId,
          op: 'rename',
          from: op.from,
          to: op.to,
        });
        renamed.push({ from: op.from, to: op.to });
      } else {
        await deleteWithSidecar(dir, op.filename);
        await appendAudit(auditLogPath, {
          ts: new Date().toISOString(),
          kind: 'applied',
          projectId: plan.projectId,
          op: 'delete',
          filename: op.filename,
        });
        deleted.push(op.filename);
      }
    } catch (err) {
      await appendAudit(auditLogPath, {
        ts: new Date().toISOString(),
        kind: 'failed',
        projectId: plan.projectId,
        op,
        error: String((err as Error)?.message ?? err),
      });
      throw err;
    }
  }

  // Tab updates per R3:
  //  - tab points at a renamed file → update name, keep is_active.
  //  - tab points at a deleted file → drop. If it was active, promote
  //    the surviving canonical filename for that file's group.
  const newTabs: Array<{ name: string; is_active: number }> = [];
  let nextActive: string | null = null;
  for (const t of currentTabs) {
    const renamed = renameMap.get(t.name);
    if (renamed) {
      newTabs.push({ name: renamed, is_active: t.is_active });
      if (t.is_active === 1) nextActive = renamed;
      continue;
    }
    if (deleteSet.has(t.name)) {
      if (t.is_active === 1) {
        const groupKey = groupOfFile.get(t.name);
        const promoteTo = groupKey ? groupCanonical.get(groupKey) ?? null : null;
        if (promoteTo && !newTabs.some((nt) => nt.name === promoteTo)) {
          // Promotion target may already be in newTabs as a renamed entry;
          // in that case we just transfer is_active.
          nextActive = promoteTo;
          await appendAudit(auditLogPath, {
            ts: new Date().toISOString(),
            kind: 'applied',
            projectId: plan.projectId,
            op: 'tab-promote',
            from: t.name,
            to: promoteTo,
          });
        } else if (promoteTo) {
          nextActive = promoteTo;
        }
      }
      await appendAudit(auditLogPath, {
        ts: new Date().toISOString(),
        kind: 'applied',
        projectId: plan.projectId,
        op: 'tab-delete',
        filename: t.name,
        wasActive: t.is_active === 1,
      });
      continue;
    }
    newTabs.push({ name: t.name, is_active: t.is_active });
  }

  // If a promotion target wasn't already in newTabs (the canonical was
  // not in the user's open tabs), append it so the user keeps eyeballs
  // on whatever they were looking at.
  if (nextActive && !newTabs.some((t) => t.name === nextActive)) {
    newTabs.push({ name: nextActive, is_active: 1 });
  }

  // Settle is_active. When a promotion happened, re-flag exclusively on
  // the promotion target. Otherwise leave existing flags alone — the
  // surviving active tab keeps its is_active=1.
  if (nextActive) {
    for (const t of newTabs) t.is_active = t.name === nextActive ? 1 : 0;
  }

  if (currentTabs.length !== newTabs.length || nextActive !== activeTab || renameMap.size > 0) {
    setTabsRaw(db, plan.projectId, newTabs);
  }

  // Deployment row rewrites per R4.
  const deployRows = listDeploymentsRaw(db, plan.projectId);
  for (const row of deployRows) {
    const renamedTo = renameMap.get(row.file_name);
    if (renamedTo) {
      // Collision check: if a row already exists at (project, renamedTo,
      // provider), keep the newer updated_at and drop the older.
      const collision = deployRows.find(
        (r) =>
          r.id !== row.id &&
          r.file_name === renamedTo &&
          r.provider_id === row.provider_id,
      );
      if (collision) {
        const olderId =
          collision.updated_at >= row.updated_at ? row.id : collision.id;
        deleteDeploymentByIdRaw(db, plan.projectId, olderId);
        await appendAudit(auditLogPath, {
          ts: new Date().toISOString(),
          kind: 'applied',
          projectId: plan.projectId,
          op: 'deployment-collision-drop',
          id: olderId,
        });
        const survivorId = olderId === row.id ? collision.id : row.id;
        renameDeploymentFileRaw(db, plan.projectId, survivorId, renamedTo);
      } else {
        renameDeploymentFileRaw(db, plan.projectId, row.id, renamedTo);
      }
      await appendAudit(auditLogPath, {
        ts: new Date().toISOString(),
        kind: 'applied',
        projectId: plan.projectId,
        op: 'deployment-rewrite',
        from: row.file_name,
        to: renamedTo,
        providerId: row.provider_id,
      });
      continue;
    }
    if (deleteSet.has(row.file_name)) {
      deleteDeploymentByIdRaw(db, plan.projectId, row.id);
      await appendAudit(auditLogPath, {
        ts: new Date().toISOString(),
        kind: 'applied',
        projectId: plan.projectId,
        op: 'deployment-orphan-delete',
        filename: row.file_name,
        providerId: row.provider_id,
      });
    }
  }

  await appendAudit(auditLogPath, {
    ts: new Date().toISOString(),
    kind: 'complete',
    projectId: plan.projectId,
    renamedCount: renamed.length,
    deletedCount: deleted.length,
  });

  return {
    projectId: plan.projectId,
    kept: plan.groups.map((g) => g.canonical),
    renamed,
    deleted,
    noop: false,
    auditLog: auditLogPath,
  };
}

export async function collapseProjectVersions(
  projectsRoot: string,
  db: Database,
  projectId: string,
  opts: { dryRun: boolean; logsDir: string },
): Promise<{ plan: CollapsePlan; summary: CollapseSummary | null }> {
  const plan = await computeProjectPlan(projectsRoot, projectId);
  if (opts.dryRun) {
    return { plan, summary: null };
  }
  await mkdir(opts.logsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const auditLogPath = path.join(
    opts.logsDir,
    `collapse-versions-${projectId}-${stamp}.jsonl`,
  );
  const summary = await executeProjectPlan(projectsRoot, db, plan, auditLogPath);
  return { plan, summary };
}

// ---------- helpers ----------

function pickIdentifier(manifest: ArtifactManifestLike | null | undefined): string | null {
  const id = manifest?.metadata?.identifier;
  return typeof id === 'string' && id.length > 0 ? id : null;
}

function strippedBaseFor(name: string): string {
  // foo-3.html → foo, foo.html → foo, foo-2024.html → foo-2024 (year too big).
  const m = STRIPPABLE_RE.exec(name);
  if (!m || !m[1] || !m[2]) return basenameNoExt(name);
  const n = parseInt(m[2], 10);
  if (!Number.isFinite(n) || n < 1 || n > MAX_STRIPPABLE_N) return basenameNoExt(name);
  return m[1];
}

function basenameNoExt(name: string): string {
  return path.basename(name, path.extname(name));
}

function pickWinner(files: ProjectFile[]): {
  file: ProjectFile;
  selectedBy: 'manifest-createdAt' | 'mtime';
} {
  // Prefer manifest.createdAt (set on write, preserved across reads — see
  // sanitizeManifest in artifact-manifest.ts: it preserves createdAt but
  // resets updatedAt to read-time, so updatedAt is NOT a stable signal).
  // Fall back to mtime when no parseable manifest stamp exists.
  // Caller guarantees at least one file in the group.
  if (files.length === 0) {
    throw new Error('pickWinner: empty group');
  }
  let best = files[0]!;
  let bestStamp = parseStamp(best);
  let bestKind: 'manifest-createdAt' | 'mtime' = bestStamp.fromManifest
    ? 'manifest-createdAt'
    : 'mtime';
  for (let i = 1; i < files.length; i++) {
    const cand = files[i]!;
    const candStamp = parseStamp(cand);
    if (candStamp.value > bestStamp.value) {
      best = cand;
      bestStamp = candStamp;
      bestKind = candStamp.fromManifest ? 'manifest-createdAt' : 'mtime';
    }
  }
  return { file: best, selectedBy: bestKind };
}

function parseStamp(f: ProjectFile): { value: number; fromManifest: boolean } {
  const createdAt = f.artifactManifest?.createdAt;
  if (typeof createdAt === 'string') {
    const parsed = Date.parse(createdAt);
    if (Number.isFinite(parsed)) return { value: parsed, fromManifest: true };
  }
  return { value: f.mtime, fromManifest: false };
}

async function renameWithSidecar(dir: string, from: string, to: string): Promise<void> {
  await rename(path.join(dir, from), path.join(dir, to));
  // Sidecar may not exist (legacy file with no manifest). Best-effort.
  try {
    await rename(path.join(dir, `${from}.artifact.json`), path.join(dir, `${to}.artifact.json`));
  } catch (err) {
    if (!isENOENT(err)) throw err;
  }
}

async function deleteWithSidecar(dir: string, name: string): Promise<void> {
  try {
    await unlink(path.join(dir, name));
  } catch (err) {
    if (!isENOENT(err)) throw err;
  }
  try {
    await unlink(path.join(dir, `${name}.artifact.json`));
  } catch (err) {
    if (!isENOENT(err)) throw err;
  }
}

function isENOENT(err: unknown): boolean {
  return !!(err && typeof err === 'object' && (err as any).code === 'ENOENT');
}

async function appendAudit(filePath: string, record: object): Promise<void> {
  await appendFile(filePath, JSON.stringify(record) + '\n', 'utf8');
}

// ---------- raw db helpers ----------
// We use prepared statements directly here rather than going through
// db.ts's typed wrappers because the cleanup needs row-level access to
// is_active and id columns that the existing helpers don't expose.

interface TabRow {
  name: string;
  position: number;
  is_active: number;
}

function listTabsRaw(db: Database, projectId: string): TabRow[] {
  return db
    .prepare(
      `SELECT name, position, is_active FROM tabs
        WHERE project_id = ? ORDER BY position ASC`,
    )
    .all(projectId) as TabRow[];
}

function setTabsRaw(
  db: Database,
  projectId: string,
  tabs: Array<{ name: string; is_active: number }>,
): void {
  const tx = db.transaction(() => {
    db.prepare(`DELETE FROM tabs WHERE project_id = ?`).run(projectId);
    const ins = db.prepare(
      `INSERT INTO tabs (project_id, name, position, is_active) VALUES (?, ?, ?, ?)`,
    );
    tabs.forEach((t, i) => {
      ins.run(projectId, t.name, i, t.is_active);
    });
  });
  tx();
}

interface DeploymentRow {
  id: string;
  file_name: string;
  provider_id: string;
  updated_at: number;
}

function listDeploymentsRaw(db: Database, projectId: string): DeploymentRow[] {
  return db
    .prepare(
      `SELECT id, file_name, provider_id, updated_at FROM deployments
        WHERE project_id = ?`,
    )
    .all(projectId) as DeploymentRow[];
}

function renameDeploymentFileRaw(
  db: Database,
  projectId: string,
  id: string,
  toName: string,
): void {
  db.prepare(
    `UPDATE deployments SET file_name = ?, updated_at = ?
       WHERE project_id = ? AND id = ?`,
  ).run(toName, Date.now(), projectId, id);
}

function deleteDeploymentByIdRaw(db: Database, projectId: string, id: string): void {
  db.prepare(`DELETE FROM deployments WHERE project_id = ? AND id = ?`).run(
    projectId,
    id,
  );
}
