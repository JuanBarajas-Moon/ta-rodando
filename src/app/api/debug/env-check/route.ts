import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUIRED = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "N8N_BASE_URL",
  "N8N_API_KEY",
  "GITHUB_WEBHOOK_SECRET",
  "EVOLUTION_API_URL",
  "EVOLUTION_API_KEY",
  "EVOLUTION_INSTANCE",
  "WHATSAPP_TARGET",
  "CRON_SECRET",
] as const;

export async function GET() {
  const present = REQUIRED.filter((k) => Boolean(process.env[k]));
  const missing = REQUIRED.filter((k) => !process.env[k]);
  return NextResponse.json({
    ok: missing.length === 0,
    missing,
    present,
  });
}
