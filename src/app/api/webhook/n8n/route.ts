import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { sendWhatsApp } from "@/lib/evolution";
import { tryReserveAlert, removeAlert } from "@/lib/dedup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type N8nErrorPayload = {
  execution?: {
    id?: string;
    error?: { message?: string; node?: { name?: string } };
    startedAt?: string;
  };
  workflow?: { id?: string; name?: string };
};

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== env.cronSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as N8nErrorPayload;

  const workflowName = body.workflow?.name ?? "Workflow desconhecido";
  const workflowId = body.workflow?.id ?? "unknown";
  const executionId = body.execution?.id ?? `manual-${Date.now()}`;
  const errorMessage = body.execution?.error?.message ?? "Erro desconhecido";
  const failedNode = body.execution?.error?.node?.name;
  const startedAt = body.execution?.startedAt ?? new Date().toISOString();

  const reserve = await tryReserveAlert("n8n", executionId, {
    workflowId,
    workflowName,
    errorMessage,
  });

  if (!reserve.fresh) {
    return NextResponse.json({ ignored: true, reason: "already alerted" });
  }

  const brTime = new Date(startedAt).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const link = `${env.n8nBaseUrl.replace(/\/$/, "")}/workflow/${workflowId}/executions/${executionId}`;

  const lines = [
    "🚨 *N8N workflow falhou*",
    "",
    `⚙️ *Workflow:* ${workflowName}`,
    failedNode ? `🔴 *Nó que falhou:* ${failedNode}` : null,
    `❌ *Erro:* ${errorMessage.slice(0, 200)}`,
    `🕒 *Quando:* ${brTime}`,
    "",
    `🔗 ${link}`,
  ].filter(Boolean);

  const result = await sendWhatsApp(lines.join("\n"));
  if (!result.ok) {
    await removeAlert(reserve.id);
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ alerted: true, executionId, workflowName });
}
