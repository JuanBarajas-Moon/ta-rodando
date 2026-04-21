import { getSupabase } from "./supabase";

export type AlertSource = "github" | "n8n";

export async function hasBeenAlerted(
  source: AlertSource,
  externalId: string,
): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("alerts_sent")
    .select("id")
    .eq("source", source)
    .eq("external_id", externalId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export async function markAlerted(
  source: AlertSource,
  externalId: string,
  payload: Record<string, unknown> = {},
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("alerts_sent").insert({
    source,
    external_id: externalId,
    payload,
  });

  if (error && !error.message.includes("duplicate")) {
    throw error;
  }
}
