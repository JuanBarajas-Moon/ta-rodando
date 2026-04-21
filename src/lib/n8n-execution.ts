import { env } from "./env";

export type N8nExecutionDetail = {
  workflowName: string;
  errorMessage: string;
  errorNode: string;
  executionData: string;
};

export async function getExecutionDetail(
  executionId: string,
  workflowId: string,
): Promise<N8nExecutionDetail> {
  const base = env.n8nBaseUrl.replace(/\/$/, "");
  const headers = {
    "X-N8N-API-KEY": env.n8nApiKey,
    Accept: "application/json",
  };

  let workflowName = "";
  let errorMessage = "";
  let errorNode = "";
  let executionData = "";

  const execRes = await fetch(
    `${base}/api/v1/executions/${executionId}?includeData=true`,
    { headers },
  );
  if (execRes.ok) {
    const data = (await execRes.json()) as {
      status?: string;
      data?: { resultData?: { error?: { message?: string; node?: { name?: string } } } };
    };
    errorMessage = data.data?.resultData?.error?.message ?? "";
    errorNode = data.data?.resultData?.error?.node?.name ?? "";
    executionData = JSON.stringify(data, null, 2).slice(0, 3000);
  }

  const wfRes = await fetch(`${base}/api/v1/workflows/${workflowId}`, { headers });
  if (wfRes.ok) {
    const wf = (await wfRes.json()) as { name?: string };
    workflowName = wf.name ?? "";
  }

  return {
    workflowName,
    errorMessage,
    errorNode,
    executionData,
  };
}
