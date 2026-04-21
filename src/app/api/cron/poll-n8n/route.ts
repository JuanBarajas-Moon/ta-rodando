import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { listRecentErrors } from "@/lib/n8n";
import { sendWhatsApp } from "@/lib/evolution";
import { tryReserveAlert, removeAlert } from "@/lib/dedup";
import { formatN8nFailure } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${env.cronSecret}`;
  if (authHeader !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const errors = await listRecentErrors(60);
  let alerted = 0;
  let skipped = 0;

  for (const execution of errors) {
    const reserve = await tryReserveAlert("n8n", execution.id, {
      workflowId: execution.workflowId,
      workflowName: execution.workflowName,
    });

    if (!reserve.fresh) {
      skipped++;
      continue;
    }

    const message = formatN8nFailure({
      workflowName: execution.workflowName,
      workflowId: execution.workflowId,
      executionId: execution.id,
      startedAt: execution.startedAt,
      n8nBaseUrl: env.n8nBaseUrl,
    });

    const result = await sendWhatsApp(message);
    if (!result.ok) {
      await removeAlert(reserve.id);
      return NextResponse.json({ error: result.error, alerted, skipped }, { status: 502 });
    }

    alerted++;
  }

  return NextResponse.json({ checked: errors.length, alerted, skipped });
}
