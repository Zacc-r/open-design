import { useState, useRef, useEffect } from 'react';
import type { ProjectBackend } from '@open-design/contracts';

interface Props {
  projectId: string;
  onClose: () => void;
  onConnected: (live: boolean) => void;
}

type Step = 'pick' | 'preview' | 'live';

export function BackendConnectDialog({ projectId, onClose, onConnected }: Props) {
  const [step, setStep] = useState<Step>('pick');
  const [sourcePath, setSourcePath] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ entities: number; endpoints: number } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [liveEnabled, setLiveEnabled] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [authMode, setAuthMode] = useState<'none' | 'cookie' | 'bearer'>('none');
  const [dopplerProject, setDopplerProject] = useState('');
  const [dopplerConfig, setDopplerConfig] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState<ProjectBackend | null>(null);
  const folderRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/backend`)
      .then((r) => r.json())
      .then((d: ProjectBackend) => {
        if (!d || d.connected === false) return;
        setExisting(d);
        setSourcePath(d.sourcePath ?? '');
        if (d.live) {
          setLiveEnabled(d.live.enabled ?? false);
          setBaseUrl(d.live.baseUrl ?? '');
          setAuthMode(d.live.authMode ?? 'none');
          setDopplerProject(d.live.dopplerProject ?? '');
          setDopplerConfig(d.live.dopplerConfig ?? '');
          setSecretKey(d.live.secretKey ?? '');
        }
        if (d.manifest) {
          setScanResult({ entities: d.manifest.entities.length, endpoints: d.manifest.endpoints.length });
          setStep('preview');
        }
      })
      .catch(() => {});
  }, [projectId]);

  async function handleScan() {
    if (!sourcePath.trim()) return;
    setScanning(true);
    setScanError(null);
    try {
      const r = await fetch(`/api/projects/${projectId}/backend/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourcePath: sourcePath.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error?.message ?? `scan failed: ${r.status}`);
      setScanResult({ entities: d.entities, endpoints: d.endpoints });
      setStep('preview');
    } catch (err: any) {
      setScanError(err.message ?? String(err));
    } finally {
      setScanning(false);
    }
  }

  async function handleSaveLive() {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/backend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: liveEnabled, baseUrl, authMode, dopplerProject, dopplerConfig, secretKey }),
      });
      onConnected(liveEnabled);
    } catch {
      onConnected(false);
    } finally {
      setSaving(false);
    }
  }

  function handleFolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // webkitRelativePath gives "folderName/..." — take the root folder's absolute path via the first file.
    // We can only get relative paths in the browser; send the webkitRelativePath root as a hint.
    const rel = (files[0] as any).webkitRelativePath as string;
    if (rel) {
      const parts = rel.split('/');
      // We can't get the real absolute path from a browser folder picker.
      // Show the folder name and ask the user to confirm the full path.
      setSourcePath(parts[0] ?? '');
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal backend-connect-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Connect backend</h2>

        {step === 'pick' && (
          <>
            <p className="hint">
              Enter the absolute path to your backend source directory. The scanner will extract
              entities from Drizzle schemas / SQL migrations and API endpoints from Next.js route files.
            </p>
            <label>
              Source path
              <input
                type="text"
                value={sourcePath}
                placeholder="/Users/you/projects/my-app"
                autoFocus
                onChange={(e) => setSourcePath(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleScan(); }}
              />
            </label>
            {scanError ? <p className="error-hint">{scanError}</p> : null}
            <div className="row">
              <button onClick={onClose}>Cancel</button>
              <button
                className="primary"
                onClick={handleScan}
                disabled={!sourcePath.trim() || scanning}
              >
                {scanning ? 'Scanning…' : 'Scan'}
              </button>
            </div>
          </>
        )}

        {step === 'preview' && scanResult && (
          <>
            <div className="backend-scan-summary">
              <span className="scan-stat"><strong>{scanResult.entities}</strong> entities</span>
              <span className="scan-sep">·</span>
              <span className="scan-stat"><strong>{scanResult.endpoints}</strong> endpoints</span>
              <span className="scan-sep">·</span>
              <span className="scan-path">{sourcePath}</span>
            </div>
            <p className="hint">
              The manifest is injected into every chat prompt so the agent knows your real data shapes.
              Optionally enable live tap to let the agent sample real API responses during generation.
            </p>
            <label className="backend-toggle-row">
              <input
                type="checkbox"
                checked={liveEnabled}
                onChange={(e) => { setLiveEnabled(e.target.checked); if (e.target.checked) setStep('live'); }}
              />
              Enable live tap (let agent call your backend in real time)
            </label>
            <div className="row">
              <button onClick={() => setStep('pick')}>← Back</button>
              <button className="primary" onClick={() => { if (liveEnabled) { setStep('live'); } else { void handleSaveLive(); } }} disabled={saving}>
                {saving ? 'Saving…' : (liveEnabled ? 'Configure live tap →' : 'Save')}
              </button>
            </div>
          </>
        )}

        {step === 'live' && (
          <>
            <p className="hint">
              Configure how the agent reaches your live backend. Credentials are fetched from Doppler at
              request time — never stored in the manifest file.
            </p>
            <label>
              Base URL
              <input
                type="text"
                value={baseUrl}
                placeholder="https://yourapp.com"
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </label>
            <label>
              Auth mode
              <select value={authMode} onChange={(e) => setAuthMode(e.target.value as any)}>
                <option value="none">None</option>
                <option value="bearer">Bearer token</option>
                <option value="cookie">Cookie (access_code=…)</option>
              </select>
            </label>
            {authMode !== 'none' && (
              <>
                <label>
                  Doppler project
                  <input type="text" value={dopplerProject} placeholder="e.g. gym-nyc" onChange={(e) => setDopplerProject(e.target.value)} />
                </label>
                <label>
                  Doppler config
                  <input type="text" value={dopplerConfig} placeholder="e.g. dev" onChange={(e) => setDopplerConfig(e.target.value)} />
                </label>
                <label>
                  Secret key name
                  <input type="text" value={secretKey} placeholder="e.g. ACCESS_CODES" onChange={(e) => setSecretKey(e.target.value)} />
                </label>
              </>
            )}
            <div className="row">
              <button onClick={() => setStep('preview')}>← Back</button>
              <button className="primary" onClick={handleSaveLive} disabled={saving || !baseUrl.trim()}>
                {saving ? 'Saving…' : 'Enable live tap'}
              </button>
            </div>
          </>
        )}

        {/* hidden folder picker for future use */}
        <input
          ref={folderRef}
          type="file"
          style={{ display: 'none' }}
          // @ts-expect-error webkitdirectory not in React types
          webkitdirectory=""
          onChange={handleFolderChange}
        />
      </div>
    </div>
  );
}
