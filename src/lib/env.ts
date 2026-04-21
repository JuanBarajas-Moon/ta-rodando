function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get n8nBaseUrl() {
    return required("N8N_BASE_URL");
  },
  get n8nApiKey() {
    return required("N8N_API_KEY");
  },
  get evolutionApiUrl() {
    return required("EVOLUTION_API_URL");
  },
  get evolutionApiKey() {
    return required("EVOLUTION_API_KEY");
  },
  get evolutionInstance() {
    return required("EVOLUTION_INSTANCE");
  },
  get whatsappTarget() {
    return required("WHATSAPP_TARGET");
  },
  get githubWebhookSecret() {
    return required("GITHUB_WEBHOOK_SECRET");
  },
  get cronSecret() {
    return required("CRON_SECRET");
  },
};
