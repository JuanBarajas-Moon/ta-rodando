import { getSupabaseServer } from "@/lib/supabase-server";

type Alert = {
  id: string;
  source: "github" | "n8n";
  external_id: string;
  payload: Record<string, string>;
  sent_at: string;
};

function brTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();

  const { data: alerts } = await supabase
    .from("alerts_sent")
    .select("id, source, external_id, payload, sent_at")
    .order("sent_at", { ascending: false })
    .limit(50);

  const github = (alerts ?? []).filter((a: Alert) => a.source === "github");
  const n8n = (alerts ?? []).filter((a: Alert) => a.source === "n8n");

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tá Rodando?</h1>
        <p className="text-gray-400 text-sm">Últimas 50 falhas detectadas</p>
      </div>

      <Section title="GitHub Actions" emoji="📦" alerts={github} renderRow={renderGithub} />
      <Section title="N8N Workflows" emoji="⚙️" alerts={n8n} renderRow={renderN8n} />
    </main>
  );
}

function Section({
  title,
  emoji,
  alerts,
  renderRow,
}: {
  title: string;
  emoji: string;
  alerts: Alert[];
  renderRow: (a: Alert) => React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-3">
        {emoji} {title}
        <span className="ml-2 text-sm font-normal text-gray-500">
          {alerts.length} alertas
        </span>
      </h2>

      {alerts.length === 0 ? (
        <p className="text-gray-600 text-sm">Nenhuma falha registrada.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-800">
              {alerts.map((a) => renderRow(a))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function renderGithub(a: Alert) {
  return (
    <tr key={a.id} className="hover:bg-gray-900 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-200">
        {a.payload.repo ?? "—"}
      </td>
      <td className="px-4 py-3 text-gray-400">{a.payload.workflow ?? "—"}</td>
      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
        {brTime(a.sent_at)}
      </td>
      <td className="px-4 py-3">
        {a.payload.runUrl ? (
          <a
            href={a.payload.runUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-xs"
          >
            Ver run →
          </a>
        ) : null}
      </td>
    </tr>
  );
}

function renderN8n(a: Alert) {
  const n8nBase = process.env.N8N_BASE_URL ?? "";
  const link = a.payload.workflowId
    ? `${n8nBase}/workflow/${a.payload.workflowId}/executions/${a.external_id}`
    : null;

  return (
    <tr key={a.id} className="hover:bg-gray-900 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-200">
        {a.payload.workflowName ?? a.payload.workflowId ?? "—"}
      </td>
      <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">
        {a.payload.errorMessage ?? "—"}
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
        {brTime(a.sent_at)}
      </td>
      <td className="px-4 py-3">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-xs"
          >
            Ver execução →
          </a>
        ) : null}
      </td>
    </tr>
  );
}
