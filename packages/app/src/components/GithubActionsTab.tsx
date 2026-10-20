import { useState, useEffect, useMemo } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { scmAuthApiRef } from '@backstage/integration-react';
import {
  githubActionsApiRef,
  GITHUB_ACTIONS_ANNOTATION,
} from '@backstage/plugin-github-actions';
import {
  InfoCard,
  Table,
  TableColumn,
  Progress,
  Link,
  StatusOK,
  StatusError,
  StatusPending,
  StatusRunning,
  StatusAborted,
  StatusWarning,
} from '@backstage/core-components';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { DateTime } from 'luxon';

type WorkflowRun = {
  id: number;
  name?: string | null;
  display_title?: string | null;
  head_branch?: string | null;
  head_sha?: string | null;
  run_number?: number;
  event?: string | null;
  status?: string | null;
  conclusion?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  run_started_at?: string | null;
  html_url?: string | null;
  workflow_id?: number;
};

type WorkflowJob = {
  id: number;
  name?: string | null;
  status?: string | null;
  conclusion?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  html_url?: string | null;
};

function StatusIcon({
  status,
  conclusion,
}: {
  status?: string | null;
  conclusion?: string | null;
}) {
  const s = (status || '').toLowerCase();
  const c = (conclusion || '').toLowerCase();
  let node;
  if (s === 'queued') node = <StatusPending />;
  else if (s === 'in_progress') node = <StatusRunning />;
  else if (s === 'completed') {
    if (c === 'failure' || c === 'cancelled') {
      node = <StatusError />;
    } else if (c === 'skipped') {
      node = <StatusAborted />;
    } else if (c === 'timed_out') {
      node = <StatusWarning />;
    } else if (c === 'success' || c === 'neutral') {
      node = <StatusOK />;
    } else {
      node = <StatusWarning />;
    }
  } else node = <StatusPending />;
  return <>{node} {c || s}</>;
}

function normalizeError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  const dt = DateTime.fromISO(iso);
  return dt.isValid ? dt.toLocaleString(DateTime.DATETIME_MED) : iso;
}

function duration(startIso?: string | null, endIso?: string | null) {
  if (!startIso) return '—';
  const start = DateTime.fromISO(startIso);
  const end = DateTime.fromISO(endIso || startIso);
  if (!start.isValid || !end.isValid) return '—';
  const secs = Math.max(0, Math.floor(end.diff(start, 'seconds').seconds));
  const min = Math.floor(secs / 60);
  const sec = secs % 60;
  return `${min}m ${sec}s`;
}

/*
 * GH job names look like "truenorth / build (amd-znver2)" — the reusable
 * workflow's job-name prefix, then the stage (and matrix variant, if any).
 * Strip the prefix shared by ALL jobs of a run so the matrix variants and
 * check names stand out.
 */
function commonJobPrefix(jobs: WorkflowJob[]): string {
  if (jobs.length < 2) return '';
  const first = jobs[0].name || '';
  const idx = first.indexOf(' / ');
  if (idx === -1) return '';
  const prefix = first.slice(0, idx + 3);
  return jobs.every(j => (j.name || '').startsWith(prefix)) ? prefix : '';
}

function stripPrefix(name: string | null | undefined, prefix: string): string {
  const n = name || '—';
  return prefix && n.startsWith(prefix) ? n.slice(prefix.length) : n;
}

const RunJobsPanel = ({
  run,
  hostname,
  owner,
  repo,
}: {
  run: WorkflowRun;
  hostname?: string;
  owner: string;
  repo: string;
}) => {
  const theme = useTheme();
  const scmAuth = useApi(scmAuthApiRef);
  const fetchApi = useApi(fetchApiRef);
  const [state, setState] = useState<{
    jobs: WorkflowJob[];
    loading: boolean;
    error?: Error;
  }>({ jobs: [], loading: true });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setState({ jobs: [], loading: true });
      try {
        const host = hostname ?? 'github.com';
        const creds = await scmAuth.getCredentials({
          url: `https://${host}/${owner}/${repo}`,
        });
        const res = await fetchApi.fetch(
          `https://${host}/repos/${owner}/${repo}/actions/runs/${run.id}/jobs?per_page=100`,
          {
            headers: {
              Authorization: `Bearer ${creds?.token}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
        if (!res.ok) {
          throw new Error(`jobs fetch failed: HTTP ${res.status}`);
        }
        const data = (await res.json()) as { jobs?: WorkflowJob[] };
        if (!active) return;
        setState({ jobs: data.jobs ?? [], loading: false });
      } catch (e) {
        if (!active) return;
        setState({ jobs: [], loading: false, error: normalizeError(e) });
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [scmAuth, fetchApi, hostname, owner, repo, run.id]);

  const prefix = useMemo(() => commonJobPrefix(state.jobs), [state.jobs]);

  const columns: TableColumn<WorkflowJob>[] = [
    {
      title: 'Stage (matrix variant)',
      field: 'name',
      render: row => {
        const label = stripPrefix(row.name, prefix);
        return row.html_url ? (
          <Link to={row.html_url} target="_blank" rel="noopener noreferrer">
            {label}
          </Link>
        ) : (
          <>{label}</>
        );
      },
    },
    {
      title: 'Status',
      field: 'conclusion',
      render: row => <StatusIcon status={row.status} conclusion={row.conclusion} />,
    },
    {
      title: 'Duration',
      render: row => duration(row.started_at, row.completed_at),
    },
    {
      title: 'Started',
      field: 'started_at',
      render: row => formatDate(row.started_at),
    },
  ];

  let content;
  if (state.loading) {
    content = <Progress />;
  } else if (state.error) {
    content = (
      <Typography style={{ color: theme.palette.status.error, padding: 8 }}>
        Failed to load jobs: {state.error.message}
      </Typography>
    );
  } else {
    content = (
      <Table<WorkflowJob>
        title={`Jobs — run #${run.run_number ?? run.id}`}
        options={{ search: false, paging: false }}
        columns={columns}
        data={state.jobs}
      />
    );
  }

  return <div style={{ padding: '8px 16px' }}>{content}</div>;
};

export const GithubActionsTab = () => {
  const { entity } = useEntity();
  const theme = useTheme();
  const api = useApi(githubActionsApiRef);
  const annotation = entity.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION] ?? '/';
  const [owner, repo] = annotation.split('/');

  // Derive hostname (github.com or enterprise) from the entity source location.
  let hostname: string | undefined;
  // source-location is a LOCATION STRING (url:<https-url>), not a bare URL.
  const rawSrcUrl = entity.metadata.annotations?.['backstage.io/source-location']
    ?? entity.metadata.annotations?.['backstage.io/managed-by-location'];
  const srcUrl = rawSrcUrl?.replace(/^(url|file|dir):/, '');
  if (srcUrl) {
    try {
      const parsed = new URL(srcUrl);
      hostname = parsed.hostname;
    } catch {
      hostname = undefined;
    }
  }

  const [state, setState] = useState<{
    runs: WorkflowRun[];
    loading: boolean;
    error?: Error;
  }>({ runs: [], loading: true });

  useEffect(() => {
    let active = true;
    setState({ runs: [], loading: true });
    api
      .listWorkflowRuns({ hostname, owner, repo, pageSize: 20, page: 1 })
      .then(data => {
        if (!active) return;
        const runs = (data.workflow_runs ?? []).map(r => r as WorkflowRun);
        setState({ runs, loading: false });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({ runs: [], loading: false, error: normalizeError(error) });
      });
    return () => {
      active = false;
    };
  }, [api, hostname, owner, repo]);

  const columns: TableColumn<WorkflowRun>[] = [
    {
      title: 'Workflow',
      field: 'name',
      render: row =>
        row.html_url ? (
          <Link to={row.html_url} target="_blank" rel="noopener noreferrer">
            {row.name || row.display_title || '—'}
          </Link>
        ) : (
          <>{row.name || row.display_title || '—'}</>
        ),
    },
    {
      title: 'Run #',
      field: 'run_number',
      render: row => `#${row.run_number}`,
    },
    {
      title: 'Branch',
      field: 'head_branch',
      render: row => row.head_branch || '—',
    },
    {
      title: 'Commit',
      field: 'head_sha',
      render: row => (row.head_sha ? row.head_sha.slice(0, 7) : '—'),
    },
    {
      title: 'Status',
      field: 'status',
      render: row => (
        <StatusIcon status={row.status} conclusion={row.conclusion} />
      ),
    },
    {
      title: 'Started',
      field: 'run_started_at',
      render: row => formatDate(row.run_started_at || row.created_at),
    },
    {
      title: 'Duration',
      render: row => {
        const end =
          row.status === 'completed' ? row.updated_at : DateTime.now().toISO();
        return duration(row.run_started_at || row.created_at, end);
      },
    },
  ];

  let content;
  if (state.loading) {
    content = <Progress />;
  } else if (state.error) {
    content = (
      <p style={{ color: theme.palette.status.error }}>
        Failed to load runs: {state.error.message}
      </p>
    );
  } else {
    content = (
      <Table<WorkflowRun>
        title=""
        options={{ search: true, paging: true, pageSize: 10 }}
        columns={columns}
        data={state.runs}
        detailPanel={({ rowData }: { rowData: WorkflowRun }) => (
          <RunJobsPanel
            run={rowData}
            hostname={hostname}
            owner={owner}
            repo={repo}
          />
        )}
      />
    );
  }

  return (
    <InfoCard
      title="GitHub Actions Runs"
      subheader={`${owner}/${repo} — expand a run to see its check matrix and job results`}
    >
      {content}
    </InfoCard>
  );
};
