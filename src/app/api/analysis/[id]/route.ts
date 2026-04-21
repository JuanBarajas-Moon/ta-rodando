import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { analyzeWithGemini } from "@/lib/gemini";
import { getRunContext } from "@/lib/github-logs";
import { getExecutionDetail } from "@/lib/n8n-execution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type AlertRow = {
  id: string;
  source: "github" | "n8n";
  external_id: string;
  payload: Record<string, string>;
  analysis_text: string | null;
  analysis_at: string | null;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    return await handleAnalysis(params.id);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}

async function handleAnalysis(id: string) {
  const supabase = getSupabase();

  const { data: alert, error } = await supabase
    .from("alerts_sent")
    .select("id, source, external_id, payload, analysis_text, analysis_at")
    .eq("id", id)
    .single();

  if (error || !alert) {
    return NextResponse.json({ error: "Alert não encontrado" }, { status: 404 });
  }

  const row = alert as AlertRow;

  if (row.analysis_text) {
    return NextResponse.json({ analysis: row.analysis_text, cached: true });
  }

  let analysis = "";

  if (row.source === "github") {
    const runUrl = row.payload.runUrl ?? "";
    const { logs, workflowYaml } = await getRunContext(runUrl);

    const prompt = `Você é um especialista em DevOps e GitHub Actions. Analise a falha abaixo e explique em português:

1. O que aconteceu (causa raiz)
2. Por que falhou
3. Como corrigir

**Workflow YAML:**
\`\`\`yaml
${workflowYaml || "Não disponível"}
\`\`\`

**Logs do run (últimas linhas):**
\`\`\`
${logs}
\`\`\`

Seja direto e prático. Máximo 300 palavras.`;

    analysis = await analyzeWithGemini(prompt);
  }

  if (row.source === "n8n") {
    const workflowId = row.payload.workflowId ?? "";
    const executionId = row.external_id;

    const detail = await getExecutionDetail(executionId, workflowId);

    const prompt = `Você é um especialista em N8N e automações. Analise a falha abaixo e explique em português:

1. O que aconteceu (causa raiz)
2. Por que o nó falhou
3. Como corrigir

**Workflow:** ${detail.workflowName || row.payload.workflowName || workflowId}
**Nó que falhou:** ${detail.errorNode || row.payload.errorMessage || "desconhecido"}
**Mensagem de erro:** ${detail.errorMessage || row.payload.errorMessage || "sem detalhes"}

**Dados da execução:**
\`\`\`json
${detail.executionData}
\`\`\`

Seja direto e prático. Máximo 300 palavras.`;

    analysis = await analyzeWithGemini(prompt);
  }

  await supabase
    .from("alerts_sent")
    .update({ analysis_text: analysis, analysis_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ analysis, cached: false });
}
