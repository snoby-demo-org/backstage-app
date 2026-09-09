import { useState, useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
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

function RunStatus({ run }: { run: WorkflowRun }) {
  const status = (run.status || '').toLowerCase();
  const conclusion = (run.conclusion || '').toLowerCase();
  let node;
  if (status === 'queued') node = <StatusPending />;
  else if (status === 'in_progress') node = <StatusRunning />;
  else if (status === 'completed') {
    if (conclusion === 'failure' || conclusion === 'cancelled') {
      node = <StatusError />;
    } else if (conclusion === 'skipped') {
      node = <StatusAborted />;
    } else if (conclusion === 'timed_out') {
      node = <StatusWarning />;
    } else if (conclusion === 'success' || conclusion === 'neutral') {
      node = <StatusOK />;
    } else {
      node = <StatusWarning />;
    }
  } else node = <StatusPending />;
  return <>{node} {conclusion || status}</>;
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

export const GithubActionsTab = () => {
  const { entity } = useEntity();
  const theme = useTheme();
  const api = useApi(githubActionsApiRef);
  const annotation = entity.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION] ?? '/';
  const [owner, repo] = annotation.split('/');

  // Derive hostname (github.com or enterprise) from the entity source location.
  // Backstage stores the value as a location string like "url:https://github.com/…"
  // (or file:/dir:.), so strip any protocol prefix before parsing.
  let hostname: string | undefined;
  const srcUrl = entity.metadata.annotations?.['backstage.io/source-location']
    ?? entity.metadata.annotations?.['backstage.io/managed-by-location'];
  if (srcUrl) {
    try {
      const clean = srcUrl.replace(/^(url|file|dir):/, '');
      const parsed = new URL(clean);
      hostname = parsed.hostname || undefined;
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
      render: row => <RunStatus run={row} />,
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
      />
    );
  }

  return (
    <InfoCard title="GitHub Actions Runs" subheader={`${owner}/${repo}`}>
      {content}
    </InfoCard>
  );
};
