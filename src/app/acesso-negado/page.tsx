export default function AcessoNegado() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Acesso negado</h1>
        <p className="text-gray-400">
          Só e-mails @moonventures.com.br, @minimalclub.com.br e @hoomy.com.br
          têm acesso.
        </p>
        <a href="/login" className="mt-4 inline-block text-blue-400 hover:underline">
          Voltar ao login
        </a>
      </div>
    </main>
  );
}
