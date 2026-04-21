# PRD — ta-rodando

> Esqueleto criado pelo `/startup`. Completar em 15min às 13h, ANTES de abrir o Claude pra codar.
> **Regra**: Claude deve ler este arquivo antes de propor qualquer código.

## Problema

Integrações que quebram silenciosamente na Moon Ventures. Dezenas de scripts Python e workflows N8N rodando em produção e quando um falha, ninguém sabe até aparecer reclamação de cliente ou dado sumir do dashboard. O time de dados perde horas investigando o que quebrou, quando quebrou e por quê, em vez de trabalhar no que importa.

## Usuário

**Quem vai usar essa ferramenta?** (preencher às 13h)

*Ex: "Analistas do time de dados que hoje ficam sabendo das falhas só quando o cliente reclama ou o dashboard some com os números."*

**O que o usuário faz hoje pra resolver isso (manual/workaround)?** (preencher às 13h)

## Objetivo

Um agente inteligente que monitora continuamente os scripts Python e workflows N8N da Moon Ventures, detecta falhas silenciosas e envia alertas automáticos com diagnóstico no WhatsApp antes que alguém precise reclamar.

## Requisitos (o que PRECISA ter pra funcionar)

*Preencher às 13h. Máximo 5 — se passou disso, cortar escopo.*

- [ ] Requisito crítico 1
- [ ] Requisito crítico 2
- [ ] Requisito crítico 3

## Fora do escopo (o que NÃO vai ter hoje)

*Preencher às 13h. Ser explícito. Cada item aqui é 1h salva.*

- Login social (Google/GitHub) — usar só email/senha ou Supabase magic link
- Mobile responsivo polido — ok se quebrar no celular
- Integrações com sistemas reais (TOTVS, HubSpot) — simular com mock
- Testes automatizados
- <adicione os seus>

## Métrica de sucesso

**Como você vai saber que funciona?** 1 frase concreta com ação + resultado.

*Ex: "Um script Python falha em produção, em menos de 2 minutos chega no WhatsApp do responsável um alerta com o nome do script, o erro e o horário — sem ninguém ter precisado abrir nenhum painel."*

## Stack

- **Hosting**: Vercel
- **Banco + auth**: Supabase
- **Linguagem/framework**: _____ (preencher quando decidir — sugestão: Next.js + TypeScript)
- **Outras libs**: _____ (preencher conforme for usando)

## Decisões de arquitetura (append ao longo do dia)

*Use essa seção pra registrar escolhas técnicas importantes à medida que aparecem.*

- <ex: "decidi usar Supabase Auth em vez de rolar JWT próprio — economiza 2h">
