import { env } from "./env";

const WHATSAPP_ENABLED = false;

type SendResult = { ok: true } | { ok: false; error: string };

export async function sendWhatsApp(
  message: string,
  target: string = env.whatsappTarget,
): Promise<SendResult> {
  if (!WHATSAPP_ENABLED) return { ok: true };
  const url = `${env.evolutionApiUrl.replace(/\/$/, "")}/message/sendText/${env.evolutionInstance}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: env.evolutionApiKey,
    },
    body: JSON.stringify({
      number: target,
      text: message,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `HTTP ${response.status}: ${body}` };
  }

  return { ok: true };
}
