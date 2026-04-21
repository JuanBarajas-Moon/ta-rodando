# PRD — ta-rodando

> Fonte da verdade do que está sendo construído. Claude deve ler este arquivo antes de propor qualquer código. Plano de execução detalhado vive em `docs/plano.md`.

## Problema

Integrações que quebram silenciosamente na Moon Ventures. Dezenas de scripts Python e workflows N8N rodando em produção e quando um falha, ninguém sabe até aparecer reclamação de cliente ou dado sumir do dashboard. O time de dados perde horas investigando o que quebrou, quando quebrou e por quê, em vez de trabalhar no que importa.

## Usuário

**Quem vai usar**: time de dados + Business Ops da Moon Ventures. Pessoas que mantêm as integrações Python e workflows N8N em produção e hoje só descobrem falhas quando o cliente reclama ou o dashboard some com os números.

**O que fazem hoje pra resolver (workaround)**: abrem manualmente o painel do N8N (Atlas) e a aba Actions do GitHub, ou esperam um cliente abrir ticket. Tempo médio de detecção: horas a dias.

## Objetivo

Um agente que monitora continuamente os workflows N8N self-hosted (Atlas) e as GitHub Actions da Moon, detecta falhas silenciosas e envia alertas automáticos com link direto no WhatsApp via Evolution API — antes que alguém precise reclamar.

## Requisitos críticos (o que PRECISA ter hoje)

- [ ] `POST /api/webhook/github` recebe eventos `workflow_run` e alerta no WhatsApp quando `conclusion=failure`, validando a assinatura HMAC do GitHub.
- [ ] `GET /api/cron/poll-n8n` lista executions com status `error` da última hora via API do N8N e alerta no WhatsApp, executando a cada 15min via Vercel Cron.
- [ ] Dedup persistido em Supabase (tabela `alerts_sent`) — a mesma falha nunca gera 2 alertas.
- [ ] Mensagens formatadas com contexto: repo/workflow, branch/execution, ator, link direto, horário BR.
- [ ] Deploy em produção na Vercel com todas as envs configuradas.

## Fora do escopo (NÃO vai ter hoje)

- Auto-diagnóstico com IA (Claude lendo stack trace e sugerindo causa)
- Dashboard web com histórico de falhas
- Comando reverso "status" via WhatsApp
- Agrupamento de múltiplos alertas em 1 mensagem
- Silenciar workflow temporariamente
- Autenticação de usuários
- Mobile responsivo polido (praticamente não tem UI)
- Testes automatizados
- Deploy no servidor Moon (fica pra semana que vem se vingar)

## Métrica de sucesso

**Durante o pitch, quebro uma GitHub Action ao vivo (repo `ta-rodando-demo`) e em menos de 30 segundos chega no WhatsApp um alerta formatado com nome do repo, workflow, branch, ator e link do run.**

Se isso funciona end-to-end em produção, o produto está pronto.

## Stack

- **Hosting**: Vercel (serverless functions + Cron Jobs)
- **Linguagem/framework**: Next.js 14 (App Router) + TypeScript
- **DB**: Supabase (Postgres) — tabela `alerts_sent` pra dedup
- **WhatsApp**: Evolution API self-hosted
- **Monitorados**: GitHub Actions (via webhook) + N8N Atlas (via polling da API)

## Decisões de arquitetura (append ao longo do dia)

- **11h30** — Stack Next.js/TS escolhida em detrimento de Python/FastAPI: menos atrito na Vercel, Vercel Cron nativo, Claude escreve TS bem. O Python do plano original fica pra eventual migração depois.
- **11h30** — Dedup em Supabase (obrigatório do bootcamp) em vez de SQLite local do plano original.
- **11h30** — Deploy Vercel hoje (regra do bootcamp). Deploy no servidor Moon fica pra depois se o projeto vingar.
- **11h30** — Scheduler via Vercel Cron `*/15 * * * *`. Plano B: GitHub Action agendada batendo no endpoint caso Hobby não ative cron.
- **11h30** — Service role do Supabase usada diretamente pelo backend (routes `/api/*` rodam server-side). Sem RLS no MVP — a tabela só é acessada pelo backend.
- **11h30** — Webhook GitHub validado via HMAC SHA256 com `GITHUB_WEBHOOK_SECRET`. Cron endpoint protegido com `CRON_SECRET` via header `Authorization: Bearer <secret>`.
