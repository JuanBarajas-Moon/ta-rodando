# Plano de Execução — `ta-rodando`

> Documento-mestre do dia. Referência durante toda a execução. Atualizar se alguma decisão mudar.
> **Data**: 2026-04-21 (1 dia de bootcamp)
> **Pitch**: 18h-19h (2min cronometrados)
> **Entrega até**: 17h30

---

## Objetivo

Construir um agente que monitora continuamente os workflows N8N self-hosted (Atlas) e as GitHub Actions da Moon Ventures, detecta falhas silenciosas e envia alertas automáticos com diagnóstico no WhatsApp via Evolution API — antes que alguém precise reclamar.

---

## Decisões confirmadas

| Item | Decisão | Motivo |
|---|---|---|
| **Linguagem** | Next.js 14 (App Router) + TypeScript | Plug-and-play na Vercel, menos atrito de infra, Claude escreve TS bem |
| **Hosting** | Vercel | Obrigatória do bootcamp |
| **DB** | Supabase (Postgres) | Obrigatória do bootcamp; serve pra dedup de alertas |
| **WhatsApp** | Evolution API | Infra já existente da Moon |
| **Scheduler** | Vercel Cron Jobs | Nativo, `*/15 * * * *` no Hobby basta |
| **Repo remoto** | Novo repo `ta-rodando` na conta `@JuanBarajas-Moon` | Casa com o slug do projeto |
| **Styling** | Tailwind (default Next.js) | Default, sem decisão adicional |

---

## Arquitetura

```
┌─────────────────────┐
│  GitHub Actions     │──webhook──┐
│  (workflows Moon)   │           │
└─────────────────────┘           │
                                  ▼
┌─────────────────────┐   ┌──────────────────┐   ┌──────────────┐
│  N8N self-hosted    │──▶│   Tá Rodando     │──▶│ Evolution    │──▶ WhatsApp
│  (Atlas)            │   │ Next.js @ Vercel │   │     API      │
└─────────────────────┘   └──────────────────┘   └──────────────┘
         ▲                        │
         │                        ▼
         │                 ┌──────────────┐
         └──cron 15min─────│   Supabase   │ (dedup: alerts_sent)
                           └──────────────┘
```

**Endpoints:**
- `POST /api/webhook/github` — recebe eventos `workflow_run` do GitHub
- `GET /api/cron/poll-n8n` — chamado pelo Vercel Cron a cada 15min

**Módulos (`src/lib/`):**
- `supabase.ts` — client Supabase (service role)
- `evolution.ts` — `sendWhatsApp(message, target)`
- `n8n.ts` — cliente da API N8N (listExecutions)
- `dedup.ts` — `hasBeenAlerted(source, externalId)` / `markAlerted(source, externalId)`
- `format.ts` — templates de mensagem (GitHub, N8N)

---

## Pré-requisitos (BLOCKER)

Sem isso não roda. Juntar no almoço, colocar no `.env` local e depois no painel Vercel.

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `N8N_BASE_URL` (ex: `https://n8n.moonventures-atlas.com.br`)
- [ ] `N8N_API_KEY`
- [ ] `GITHUB_WEBHOOK_SECRET` (string aleatória escolhida agora)
- [ ] `EVOLUTION_API_URL`
- [ ] `EVOLUTION_API_KEY`
- [ ] `EVOLUTION_INSTANCE`
- [ ] `WHATSAPP_TARGET` (ex: `5511999999999@s.whatsapp.net` ou chatId de grupo)
- [ ] `CRON_SECRET` (string aleatória pra proteger o endpoint de cron)

**Contas/recursos:**
- [ ] Repo `ta-rodando` criado no GitHub (vazio)
- [ ] Repo `ta-rodando-demo` com Action `exit 1` pra quebrar no pitch
- [ ] Workflow N8N dummy no Atlas que falha sob demanda
- [ ] Conta Vercel (login via GitHub)
- [ ] Projeto Supabase novo

---

## Cronograma

### FASE 0 — Setup estrutura (antes das 13h, sem credencial)

Feito pelo Claude enquanto você almoça.

- [ ] `npm init` + Next.js 14 App Router + TypeScript + Tailwind
- [ ] Estrutura de pastas:
  - `src/app/api/webhook/github/route.ts`
  - `src/app/api/cron/poll-n8n/route.ts`
  - `src/lib/{supabase,evolution,n8n,dedup,format}.ts`
  - `supabase/schema.sql`
- [ ] `.env.example` completo
- [ ] `.gitignore` ajustado pra Next.js
- [ ] `vercel.json` com cron config
- [ ] Atualizar `docs/prd.md` com requisitos críticos e fora do escopo
- [ ] Commit: "fase 0: setup nextjs + estrutura base"

### FASE 1 — Fundação (13h → 14h)

- [ ] Configurar Supabase local (criar tabela `alerts_sent` via `schema.sql`)
- [ ] Implementar `src/lib/supabase.ts`
- [ ] Implementar `src/lib/evolution.ts` + teste "hello world" pro seu WhatsApp
- [ ] Implementar `src/lib/dedup.ts`
- [ ] Trocar remote Git pro repo `ta-rodando` novo; primeiro push
- [ ] Commit: "fase 1: supabase + evolution + dedup funcionando"

### FASE 2 — GitHub Webhook (14h → 15h)

- [ ] `POST /api/webhook/github` com validação do `X-Hub-Signature-256`
- [ ] Parser de `workflow_run` (só `conclusion=failure`)
- [ ] Montar mensagem: repo, workflow, branch, ator, link do run
- [ ] Dedup via `run_id`
- [ ] Configurar webhook no repo `ta-rodando-demo` (evento: `workflow_run`)
- [ ] **TESTE E2E**: push que quebra action → WhatsApp chega
- [ ] Commit: "fase 2: github webhook → whatsapp funcionando"

### FASE 3 — N8N Poller (15h → 16h)

- [ ] `src/lib/n8n.ts` com `listRecentErrors(lookbackMinutes)`
- [ ] `GET /api/cron/poll-n8n` protegido por `CRON_SECRET`
- [ ] Dedup via `execution_id`
- [ ] `vercel.json` com cron `*/15 * * * *` → `/api/cron/poll-n8n`
- [ ] **TESTE E2E**: forçar erro em workflow N8N → WhatsApp chega no próximo ciclo
- [ ] Commit: "fase 3: n8n poller detecta erros automaticamente"

### FASE 4 — Deploy produção + polimento (16h → 16h45)

- [ ] `vercel --prod` + configurar todas as envs no painel
- [ ] Testar webhook real apontado pra URL de produção
- [ ] Testar 1 ciclo de cron real
- [ ] Polir mensagens: emoji, horário BR (`America/Sao_Paulo`), link direto
- [ ] Página home simples (`src/app/page.tsx`) explicando o que é o projeto
- [ ] Commit: "fase 4: deploy prod + mensagens formatadas"

### FASE 5 — Pitch (16h45 → 17h30)

- [ ] Preencher `docs/pitch.md`:
  - Problema (20s)
  - Solução + stack (40s)
  - Demo roteirizada (50s) — quebrar action ao vivo + WhatsApp chegando
  - URL Vercel + próximos passos (10s)
- [ ] Atualizar `context/briefing.md` seção "Lições"
- [ ] Ensaiar 2min cronometrado
- [ ] Gravar vídeo backup de 30s (caso Evolution caia no palco)
- [ ] **Commit final + push**

---

## Fora do escopo HOJE

Explicitamente NÃO vamos fazer. Cada item aqui é 1-2h salvas.

- Auto-diagnóstico com IA (Claude lendo stack trace e sugerindo causa)
- Dashboard web com histórico semanal
- Comando reverso "status" via WhatsApp
- Agrupamento de alertas (10 falhas em 5min → 1 mensagem)
- Silenciar workflow temporariamente
- Deploy no servidor Moon (fica pra semana que vem se vingar)
- Testes automatizados
- Autenticação de usuário
- Mobile responsivo polido

---

## Métrica de sucesso

> **"Durante o pitch, quebro uma GitHub Action ao vivo e em menos de 30 segundos chega um alerta formatado no meu WhatsApp com link do run quebrado."**

Se funciona, o produto está pronto. O resto é narrativa.

---

## Riscos + plano B

| Risco | Plano B |
|---|---|
| Vercel Cron não dispara no Hobby | GitHub Action agendada no próprio repo batendo em `/api/cron/poll-n8n` |
| Evolution API cai no pitch | Vídeo de 30s gravado na Fase 5 |
| Webhook GitHub demora a propagar | Disparar `workflow_run` manualmente via `gh api` no ensaio |
| Token Claude estoura antes das 17h | Sem refactors desnecessários; reutilizar código; commits frequentes pra não perder progresso |
| N8N Poller trava por complexidade | Cortar N8N do MVP e ir só com GitHub webhook — pitch continua de pé |
| Build Next.js quebra na Vercel | Revert pro último commit que deployou + debug incremental |

---

## Red lines (nunca durante o dia)

- `git push -f` em qualquer remote
- Commitar arquivo com credencial (sempre conferir `git status` antes do `add`)
- Subir `.env` pro git
- Mandar mensagem WhatsApp pra número que não seja o de teste até confirmar formatação
- Gastar token Claude em refactor estético — a avaliação é funcional

---

## Log de decisões (append ao longo do dia)

- **11h50** — Stack confirmada: Next.js/TS + Vercel + Supabase + Evolution.
- **11h50** — Repo remoto: `ta-rodando` novo (não o `meu-projeto` clonado do template).
- **11h50** — Ambiente de teste GitHub: `ta-rodando-demo` com Action que falha sob demanda.
- **11h50** — Ambiente de teste N8N: workflow dummy no Atlas com HTTP Request inválido.
