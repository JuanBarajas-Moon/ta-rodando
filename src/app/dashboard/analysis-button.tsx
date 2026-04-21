"use client";

import { useState } from "react";

const ANALYSIS_ENABLED = true;

export default function AnalysisButton({ alertId }: { alertId: string }) {
  if (!ANALYSIS_ENABLED) return null;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (analysis) {
      setOpen((v) => !v);
      return;
    }
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analysis/${alertId}`);
      const data = (await res.json()) as { analysis?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Erro ao analisar");
      setAnalysis(data.analysis ?? "");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="text-purple-400 hover:text-purple-300 text-xs transition-colors whitespace-nowrap"
      >
        {loading ? "Analisando..." : "✨ Ver análise IA"}
      </button>

      {open && (analysis || error) && (
        <div className="mt-3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 leading-relaxed max-w-xl whitespace-pre-wrap">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            analysis
          )}
          <button
            onClick={() => setOpen(false)}
            className="block mt-2 text-gray-600 hover:text-gray-400"
          >
            fechar
          </button>
        </div>
      )}
    </div>
  );
}
