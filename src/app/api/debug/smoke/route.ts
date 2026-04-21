import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import { sendWhatsApp } from "@/lib/evolution";
import { tryReserveAlert, removeAlert } from "@/lib/dedup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // 1) Supabase conecta
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("alerts_sent").select("id");
    if (error) throw new Error(error.message);
    results.supabase = "ok";
  } catch (e) {
    results.supabase = `FAIL — ${(e as Error).message}`;
    return NextResponse.json(results, { status: 500 });
  }

  // 2) Reserve + dedup atômico via UNIQUE constraint
  const testExternalId = `smoke-${Date.now()}`;
  try {
    const first = await tryReserveAlert("github", testExternalId, { smoke: true });
    if (!first.fresh) throw new Error("primeira reserva deveria ser fresh");

    const second = await tryReserveAlert("github", testExternalId, { smoke: true });
    if (second.fresh) throw new Error("segunda reserva deveria ser duplicate");

    await removeAlert(first.id);
    results.dedup = "ok";
  } catch (e) {
    results.dedup = `FAIL — ${(e as Error).message}`;
    return NextResponse.json(results, { status: 500 });
  }

  // 3) WhatsApp chega
  try {
    const now = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    const message = `✅ *Tá Rodando?* — smoke test Fase 1\n\n${now}\n\nSe você recebeu, Supabase + dedup atômico + Evolution funcionam. Pode seguir pra Fase 2.`;
    const result = await sendWhatsApp(message);
    if (!result.ok) throw new Error(result.error);
    results.whatsapp = "ok";
  } catch (e) {
    results.whatsapp = `FAIL — ${(e as Error).message}`;
    return NextResponse.json(results, { status: 500 });
  }

  return NextResponse.json({
    ...results,
    summary: "tudo verde — confira o WhatsApp",
  });
}
