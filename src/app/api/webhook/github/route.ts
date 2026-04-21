import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { sendWhatsApp } from "@/lib/evolution";
import { tryReserveAlert, removeAlert } from "@/lib/dedup";
import { formatGithubFailure } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", env.githubWebhookSecret);
  const digest = `sha256=${hmac.update(body).digest("hex")}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event !== "workflow_run") {
    return NextResponse.json({ ignored: true, reason: "not workflow_run" });
  }

  const payload = JSON.parse(rawBody) as {
    action: string;
    workflow_run: {
      id: number;
      name: string;
      conclusion: string | null;
      status: string;
      html_url: string;
      head_branch: string;
      actor: { login: string };
      run_started_at: string;
    };
    repository: { full_name: string };
  };

  if (payload.action !== "completed" || payload.workflow_run.conclusion !== "failure") {
    return NextResponse.json({ ignored: true, reason: "not a failure" });
  }

  const runId = String(payload.workflow_run.id);

  const reserve = await tryReserveAlert("github", runId, {
    repo: payload.repository.full_name,
    workflow: payload.workflow_run.name,
    runUrl: payload.workflow_run.html_url,
  });

  if (!reserve.fresh) {
    return NextResponse.json({ ignored: true, reason: "already alerted" });
  }

  const message = formatGithubFailure({
    repo: payload.repository.full_name,
    workflow: payload.workflow_run.name,
    branch: payload.workflow_run.head_branch,
    actor: payload.workflow_run.actor.login,
    runUrl: payload.workflow_run.html_url,
    startedAt: payload.workflow_run.run_started_at,
  });

  const result = await sendWhatsApp(message);
  if (!result.ok) {
    await removeAlert(reserve.id);
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ alerted: true, runId });
}
