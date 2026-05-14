import { useEffect, useMemo, useState } from 'react';
import { fetchProjectFileText, projectRawUrl } from '../providers/registry';
import { buildSrcdoc } from '../runtime/srcdoc';
import type { ProjectFile } from '../types';

const ENTRY_NAMES = new Set(['index.html', 'index.htm', 'main.html', 'home.html']);

function resolveEntryFile(pages: ProjectFile[]): string | null {
  if (pages.length === 0) return null;
  // Prefer an explicit entry field set by the artifact manifest (e.g. 'index.html').
  const byEntry = pages.find((p) => p.artifactManifest?.entry === p.name);
  if (byEntry) return byEntry.name;
  // Fall back to well-known entry names.
  const byName = pages.find((p) => ENTRY_NAMES.has(p.name));
  if (byName) return byName.name;
  // pages are sorted newest first by listFiles
  return pages[0]!.name;
}

function baseDirOf(fileName: string): string {
  const idx = fileName.lastIndexOf('/');
  return idx >= 0 ? fileName.slice(0, idx + 1) : '';
}

function pageLabelFor(page: ProjectFile): string {
  return page.artifactManifest?.title ?? page.name;
}

interface Props {
  projectId: string;
  pages: ProjectFile[];
  // When a specific page was opened via chat / file panel, the parent passes
  // its name here. The bundle viewer shows that page; once the user picks
  // from the dropdown the viewer takes over with its own local state.
  requestedPage: string | null;
  onPageChange: (name: string) => void;
  streaming?: boolean;
}

export function ProjectBundleViewer({
  projectId,
  pages,
  requestedPage,
  onPageChange,
  streaming,
}: Props) {
  const entryFile = useMemo(() => resolveEntryFile(pages), [pages]);

  // Local page tracks the user's dropdown selection; requestedPage overrides
  // it when the parent wants to jump to a specific page.
  const [localPage, setLocalPage] = useState<string | null>(null);

  const activePage: string | null =
    requestedPage ?? localPage ?? entryFile;

  // Reset localPage when requestedPage arrives so the dropdown reflects it.
  useEffect(() => {
    if (requestedPage) setLocalPage(requestedPage);
  }, [requestedPage]);

  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    if (!activePage) return;
    let cancelled = false;
    setSource(null);
    void fetchProjectFileText(projectId, activePage).then((text) => {
      if (!cancelled) setSource(text ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId, activePage]);

  const srcDoc = useMemo(
    () =>
      source
        ? buildSrcdoc(source, {
            baseHref: activePage ? projectRawUrl(projectId, baseDirOf(activePage)) : undefined,
          })
        : '',
    [source, projectId, activePage],
  );

  if (pages.length === 0) {
    return <div className="viewer-empty">No pages yet.</div>;
  }

  return (
    <div className="bundle-viewer">
      <div className="bundle-viewer-toolbar">
        <select
          className="bundle-page-select"
          value={activePage ?? ''}
          onChange={(e) => {
            const name = e.target.value;
            setLocalPage(name);
            onPageChange(name);
          }}
        >
          {pages.map((p) => (
            <option key={p.name} value={p.name}>
              {pageLabelFor(p)}
            </option>
          ))}
        </select>
        <a
          className="bundle-download-btn"
          href={`/api/projects/${encodeURIComponent(projectId)}/bundle.zip`}
          download
        >
          Download zip
        </a>
      </div>
      <div className="viewer-body">
        {source === null ? (
          <div className="viewer-empty">
            {streaming ? 'Generating…' : 'Loading…'}
          </div>
        ) : (
          <iframe
            data-testid="bundle-preview-frame"
            title={activePage ?? 'bundle'}
            sandbox="allow-scripts"
            srcDoc={srcDoc}
          />
        )}
      </div>
    </div>
  );
}
