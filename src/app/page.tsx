export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Tá Rodando?</h1>
      <p className="text-lg text-gray-400 mb-8">
        Monitor de GitHub Actions e workflows N8N da Moon Ventures.
      </p>
      <section className="space-y-4 text-gray-300">
        <p>
          Quando algo quebra em produção, você recebe um alerta no WhatsApp —
          antes que alguém precise reclamar.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Webhook do GitHub em{" "}
            <code className="bg-gray-800 px-1 rounded">
              /api/webhook/github
            </code>
          </li>
          <li>
            Polling do N8N a cada 15min em{" "}
            <code className="bg-gray-800 px-1 rounded">
              /api/cron/poll-n8n
            </code>
          </li>
          <li>Dedup via Supabase. Envio via Evolution API.</li>
        </ul>
      </section>
    </main>
  );
}
