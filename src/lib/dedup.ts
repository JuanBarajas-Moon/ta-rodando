import type { PostgrestError } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

export type AlertSource = "github" | "n8n";

export type ReserveResult = { fresh: true; id: string } | { fresh: false };

function isUniqueViolation(error: PostgrestError): boolean {
  if (error.code === "23505") return true;
  return /duplicate key|unique constraint/i.test(error.message);
}

export async function tryReserveAlert(
  source: AlertSource,
  externalId: string,
  payload: Record<string, unknown> = {},
): Promise<ReserveResult> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("alerts_sent")
    .insert({ source, external_id: externalId, payload })
    .select("id")
    .single();

  if (!error) {
    return { fresh: true, id: data.id };
  }

  if (isUniqueViolation(error)) {
    return { fresh: false };
  }

  throw error;
}

export async function removeAlert(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("alerts_sent").delete().eq("id", id);
  if (error) throw error;
}
