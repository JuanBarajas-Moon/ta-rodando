import { env } from "./env";

export type N8nExecution = {
  id: string;
  workflowId: string;
  workflowName?: string;
  status: string;
  startedAt: string;
  stoppedAt?: string;
  finished: boolean;
};

function headers() {
  return { "X-N8N-API-KEY": env.n8nApiKey, Accept: "application/json" };
}

async function fetchWorkflowName(workflowId: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${env.n8nBaseUrl.replace(/\/$/, "")}/api/v1/workflows/${workflowId}`,
      { headers: headers() },
    );
    if (!res.ok) return undefined;
    const data = (await res.json()) as { name?: string };
    return data.name;
  } catch {
    return undefined;
  }
}

export async function listRecentErrors(
  lookbackMinutes: number = 60,
): Promise<N8nExecution[]> {
  const url = `${env.n8nBaseUrl.replace(/\/$/, "")}/api/v1/executions?status=error&limit=50`;

  const response = await fetch(url, { headers: headers() });

  if (!response.ok) {
    throw new Error(`N8N API ${response.status}: ${await response.text()}`);
  }

  const payload = (await response.json()) as { data?: N8nExecution[] };
  const executions = payload.data ?? [];

  const cutoff = Date.now() - lookbackMinutes * 60 * 1000;
  const recent = executions.filter(
    (e) => new Date(e.startedAt).getTime() >= cutoff,
  );

  if (recent.length === 0) return [];

  // Busca nomes em batch: 1 chamada por workflowId único
  const uniqueIds = Array.from(new Set(recent.map((e) => e.workflowId)));
  const names = await Promise.all(uniqueIds.map(fetchWorkflowName));
  const nameMap = Object.fromEntries(
    uniqueIds.map((id, i) => [id, names[i]]),
  );

  return recent.map((e) => ({
    ...e,
    workflowName: e.workflowName ?? nameMap[e.workflowId],
  }));
}
