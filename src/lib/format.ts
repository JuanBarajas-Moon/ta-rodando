const BR_TZ = "America/Sao_Paulo";

function brTime(iso: string | Date = new Date()): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("pt-BR", {
    timeZone: BR_TZ,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type GithubFailurePayload = {
  repo: string;
  workflow: string;
  branch: string;
  actor: string;
  runUrl: string;
  startedAt?: string;
};

export function formatGithubFailure(p: GithubFailurePayload): string {
  return [
    "🚨 *GitHub Action quebrou*",
    "",
    `📦 *Repo:* ${p.repo}`,
    `⚙️ *Workflow:* ${p.workflow}`,
    `🌿 *Branch:* ${p.branch}`,
    `👤 *Por:* ${p.actor}`,
    `🕒 *Quando:* ${brTime(p.startedAt)}`,
    "",
    `🔗 ${p.runUrl}`,
  ].join("\n");
}

export type N8nFailurePayload = {
  workflowName?: string;
  workflowId: string;
  executionId: string;
  startedAt: string;
  n8nBaseUrl: string;
};

export function formatN8nFailure(p: N8nFailurePayload): string {
  const link = `${p.n8nBaseUrl.replace(/\/$/, "")}/workflow/${p.workflowId}/executions/${p.executionId}`;
  return [
    "🚨 *N8N workflow falhou*",
    "",
    `⚙️ *Workflow:* ${p.workflowName ?? p.workflowId}`,
    `🆔 *Execution:* ${p.executionId}`,
    `🕒 *Quando:* ${brTime(p.startedAt)}`,
    "",
    `🔗 ${link}`,
  ].join("\n");
}
