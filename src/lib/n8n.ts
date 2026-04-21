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

export async function listRecentErrors(
  lookbackMinutes: number = 60,
): Promise<N8nExecution[]> {
  const url = `${env.n8nBaseUrl.replace(/\/$/, "")}/api/v1/executions?status=error&limit=50`;

  const response = await fetch(url, {
    headers: {
      "X-N8N-API-KEY": env.n8nApiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`N8N API ${response.status}: ${await response.text()}`);
  }

  const payload = (await response.json()) as { data?: N8nExecution[] };
  const executions = payload.data ?? [];

  const cutoff = Date.now() - lookbackMinutes * 60 * 1000;
  return executions.filter((e) => new Date(e.startedAt).getTime() >= cutoff);
}
