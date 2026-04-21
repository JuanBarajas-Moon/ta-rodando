import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const base = env.evolutionApiUrl.replace(/\/$/, "");
  const instance = env.evolutionInstance;

  const endpoints = [
    { name: "connectionState", url: `${base}/instance/connectionState/${instance}` },
    { name: "fetchInstances", url: `${base}/instance/fetchInstances?instanceName=${instance}` },
  ];

  const results: Record<string, unknown> = {};
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        headers: { apikey: env.evolutionApiKey, Accept: "application/json" },
      });
      const body = await res.text();
      results[ep.name] = {
        status: res.status,
        body: tryParseJson(body),
      };
    } catch (e) {
      results[ep.name] = { error: (e as Error).message };
    }
  }

  return NextResponse.json({
    instance,
    baseUrl: base,
    whatsappTargetConfigured: env.whatsappTarget,
    checks: results,
  });
}

function tryParseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
