// @ts-nocheck
// Lightweight MCP server for the live-tap backend feature.
// Spawned by Claude Code (via --mcp-config) when a project has a backend
// linked with live.enabled === true.
//
// Reads OD_BACKEND_JSON env var (path to .od-backend.json) on startup.
// Exposes four tools:
//   backend.list_endpoints    — lists all known API endpoints from manifest
//   backend.describe_entity   — returns field list for a named entity
//   backend.sample_response   — GETs a live endpoint via baseUrl (read-only)
//   backend.run_sql           — SELECT-only query via dbUrl (if configured)
//
// Auth secrets are fetched from Doppler at request time using the coordinates
// in live.dopplerProject / live.dopplerConfig / live.secretKey.
// Nothing sensitive is ever written to .od-backend.json.

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import readline from 'node:readline';

const execFileP = promisify(execFile);

// ---------- load backend config ----------

const backendJsonPath = process.env.OD_BACKEND_JSON;
if (!backendJsonPath || !existsSync(backendJsonPath)) {
  process.stderr.write('[backend-mcp] OD_BACKEND_JSON not set or file missing\n');
  process.exit(1);
}

let config: any;
try {
  config = JSON.parse(readFileSync(backendJsonPath, 'utf8'));
} catch (err) {
  process.stderr.write(`[backend-mcp] failed to parse config: ${err}\n`);
  process.exit(1);
}

const manifest = config.manifest ?? { entities: [], endpoints: [] };
const live = config.live ?? {};

// ---------- MCP JSON-RPC over stdio ----------
// Claude Code spawns this process and communicates via stdin/stdout
// using the MCP JSON-RPC 2.0 protocol.

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

function send(obj: object) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

rl.on('line', async (line) => {
  let req: any;
  try {
    req = JSON.parse(line);
  } catch {
    return;
  }

  const { id, method, params } = req;

  if (method === 'initialize') {
    return send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'backend-mcp', version: '1.0.0' },
      },
    });
  }

  if (method === 'notifications/initialized') return;

  if (method === 'tools/list') {
    return send({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'backend__list_endpoints',
            description: 'List all known API endpoints from the connected backend manifest.',
            inputSchema: { type: 'object', properties: {} },
          },
          {
            name: 'backend__describe_entity',
            description: 'Return the field list for a named backend entity.',
            inputSchema: {
              type: 'object',
              properties: { name: { type: 'string', description: 'Entity/table name' } },
              required: ['name'],
            },
          },
          {
            name: 'backend__sample_response',
            description: 'Perform a read-only (GET) request to the live backend and return the first 4 KB of the response body. Only GET requests are allowed.',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: 'API path, e.g. /api/members' },
                query: { type: 'string', description: 'Optional query string, e.g. limit=5' },
              },
              required: ['path'],
            },
          },
          {
            name: 'backend__run_sql',
            description: 'Run a read-only SELECT query against the connected database. Only SELECT statements are permitted.',
            inputSchema: {
              type: 'object',
              properties: { sql: { type: 'string', description: 'A SELECT SQL query' } },
              required: ['sql'],
            },
          },
        ],
      },
    });
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments ?? {};
    try {
      const result = await callTool(toolName, args);
      return send({
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) }] },
      });
    } catch (err) {
      return send({
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: `Error: ${err.message ?? String(err)}` }], isError: true },
      });
    }
  }

  // Unknown method
  send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
});

// ---------- tool implementations ----------

async function callTool(name: string, args: Record<string, any>): Promise<string> {
  switch (name) {
    case 'backend__list_endpoints': {
      if (!manifest.endpoints?.length) return 'No endpoints found in manifest.';
      return manifest.endpoints.map((e: any) => `${e.method} ${e.path}`).join('\n');
    }

    case 'backend__describe_entity': {
      const entity = manifest.entities?.find(
        (e: any) => e.name.toLowerCase() === String(args.name ?? '').toLowerCase(),
      );
      if (!entity) {
        const names = manifest.entities?.map((e: any) => e.name).join(', ') || '(none)';
        return `Entity "${args.name}" not found. Known entities: ${names}`;
      }
      const fields = entity.fields?.map((f: any) => `${f.name} (${f.type})`).join('\n  ') || '(no fields parsed)';
      return `Entity: ${entity.name}\nSource: ${entity.source}\nFields:\n  ${fields}`;
    }

    case 'backend__sample_response': {
      if (!live.enabled) throw new Error('Live tap is not enabled for this project.');
      const baseUrl = live.baseUrl?.replace(/\/$/, '') ?? '';
      if (!baseUrl) throw new Error('No baseUrl configured in backend live settings.');
      const apiPath = String(args.path ?? '').replace(/^([^/])/, '/$1');
      const qs = args.query ? `?${args.query}` : '';
      const url = `${baseUrl}${apiPath}${qs}`;

      const headers: Record<string, string> = { 'User-Agent': 'open-design-backend-mcp/1.0' };

      // Fetch auth secret from Doppler if configured.
      if (live.dopplerProject && live.dopplerConfig && live.secretKey) {
        try {
          const { stdout } = await execFileP('doppler', [
            'secrets', 'get', live.secretKey,
            '--project', live.dopplerProject,
            '--config', live.dopplerConfig,
            '--plain',
          ]);
          const secret = stdout.trim();
          if (secret) {
            if (live.authMode === 'bearer') {
              headers['Authorization'] = `Bearer ${secret}`;
            } else if (live.authMode === 'cookie') {
              headers['Cookie'] = `access_code=${secret}`;
            }
          }
        } catch {
          // Doppler unavailable — proceed without auth
        }
      }

      const resp = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
      const text = await resp.text();
      const truncated = text.length > 4096 ? text.slice(0, 4096) + '\n…(truncated)' : text;
      return `HTTP ${resp.status} ${resp.statusText}\n\n${truncated}`;
    }

    case 'backend__run_sql': {
      if (!live.enabled) throw new Error('Live tap is not enabled for this project.');
      if (!live.dbUrl) throw new Error('No dbUrl configured in backend live settings.');
      const sql = String(args.sql ?? '').trim();
      if (!/^SELECT\b/i.test(sql)) throw new Error('Only SELECT queries are permitted.');
      // Use psql for Postgres URLs; sqlite3 for file paths.
      if (live.dbUrl.startsWith('postgres') || live.dbUrl.startsWith('postgresql')) {
        const { stdout } = await execFileP('psql', [live.dbUrl, '-c', sql, '--tuples-only', '--csv'], {
          timeout: 15_000,
        });
        return stdout.slice(0, 8192);
      }
      throw new Error('dbUrl scheme not supported (only postgresql:// is currently implemented).');
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
