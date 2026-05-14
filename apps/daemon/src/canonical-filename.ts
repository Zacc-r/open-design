// Single source of truth for "what filename does an artifact get?".
//
// The model emits `<artifact identifier="kebab-slug" title="Human Title">`
// on every regeneration. We turn that pair into a stable, slug-shaped
// `<slug>.html` so re-emitting the same identifier overwrites in place
// (one canonical URL per page). Web client posts identifier + title to
// /api/projects/:id/files and uses whatever filename the server returns
// — the slug logic does not live in two places.

import { createHash } from 'node:crypto';

const MAX_SLUG_LENGTH = 60;
const HASH_SUFFIX_BYTES = 6;
const TRUNCATE_BODY_LENGTH = MAX_SLUG_LENGTH - 1 - HASH_SUFFIX_BYTES; // "<53>-<6>" = 60

export interface CanonicalFilenameInput {
  identifier?: string | null;
  title?: string | null;
}

export function deriveCanonicalFilename(
  input: CanonicalFilenameInput,
  ext: string = '.html',
): string {
  const seed = pickSeed(input);
  if (!seed) return `artifact${ext}`;

  const slug = seed
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) return `artifact${ext}`;

  if (slug.length <= MAX_SLUG_LENGTH) return `${slug}${ext}`;

  // Two long identifiers that share the first 60 chars must produce
  // distinct filenames; deterministic hash suffix preserves uniqueness.
  const hash = createHash('sha1').update(slug).digest('hex').slice(0, HASH_SUFFIX_BYTES);
  return `${slug.slice(0, TRUNCATE_BODY_LENGTH)}-${hash}${ext}`;
}

function pickSeed(input: CanonicalFilenameInput): string {
  if (typeof input.identifier === 'string' && input.identifier.trim()) {
    return input.identifier.trim();
  }
  if (typeof input.title === 'string' && input.title.trim()) {
    return input.title.trim();
  }
  return '';
}
