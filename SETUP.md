# Setup do Claude Code — Windows e Mac

> Guia do bootcamp. Se você nunca instalou nada disso, segue passo a passo sem pular. Tempo total: 15-20 minutos.

## Visão geral — 3 fases

1. **Instalar 3 programas** (Node.js, Git, VS Code)
2. **Instalar Claude Code** dentro do VS Code
3. **Colar a chave de API** e começar

Pronto. O resto é só seguir os passos abaixo.

---

## Fase 1 — Instalar os pré-requisitos

### Se você usa Windows

Instala estes 3 programas, nesta ordem:

1. **Node.js LTS**
   - Link: https://nodejs.org
   - Baixa o botão que diz **"LTS"** (não o "Current")
   - Abre o `.msi` baixado → clica **Next** em tudo → **Install** → pede senha do Windows, digita → **Finish**

2. **Git for Windows**
   - Link: https://git-scm.com/download/win
   - Baixa o `.exe` → executa
   - Na instalação, **aceita todos os defaults** (só clica Next até terminar). Isso instala o Git Bash junto, que é importante.

3. **VS Code**
   - Link: https://code.visualstudio.com
   - Baixa, instala normalmente. Durante a instalação marca a opção **"Add to PATH"** se aparecer.

Depois dos 3 instalados: **feche tudo e abra o VS Code.**

---

### Se você usa Mac

Instala estes 2 programas:

1. **VS Code**
   - Link: https://code.visualstudio.com
   - Baixa, descompacta (se vier como .zip), arrasta o ícone pra pasta **Applications**

2. **Node.js LTS**
   - Link: https://nodejs.org
   - Baixa o botão **"LTS"**
   - Abre o `.pkg` → clica Continuar → Instalar → pede senha do Mac, digita → Fechar

O Mac já vem com Git instalado. Se por acaso pedir pra instalar, aceita (vai baixar "Xcode Command Line Tools").

Depois dos 2 instalados: **abre o VS Code.**

---

## Fase 2 — Configurar o terminal do VS Code

### Windows — passo crítico

Esse passo é **obrigatório pra Windows** (no Mac pula).

1. Abre o VS Code
2. Aperta `Ctrl` + `Shift` + `P` (abre a paleta de comandos no topo)
3. Digita: `Terminal: Select Default Profile`
4. Clica na sugestão que aparece
5. Escolhe: **Git Bash**

Agora abre um terminal novo:

- Menu superior: **Terminal** → **New Terminal**
- Um painel abre na parte de baixo do VS Code
- Verifica: o prompt deve parecer algo como `username@MACHINE MINGW64 ~$` — isso confirma que é o Git Bash.

> **Se abrir PowerShell** (aparece `PS C:\Users\...>`) ou **CMD** (aparece `C:\Users\...>`), repita o passo 3-5 acima. É essencial.

### Mac

1. Abre o VS Code
2. Menu superior: **Terminal** → **New Terminal**
3. Pronto. O Mac já vem com zsh ou bash, funciona direto.

---

## Fase 3 — Instalar o Claude Code

No terminal do VS Code (que você acabou de abrir), cola este comando e aperta Enter:

```bash
npm install -g @anthropic-ai/claude-code
```

Aguarda. Vai demorar entre 30 segundos e 2 minutos. Vai aparecer várias linhas de texto — **é normal**. Quando o prompt voltar em branco, terminou.

### Se der erro "permission denied" ou "EACCES"

**No Mac:**
```bash
sudo npm install -g @anthropic-ai/claude-code
```
Vai pedir a senha do Mac — digita (não aparece nada enquanto você digita, é normal) e aperta Enter.

**No Windows:**
- Fecha o VS Code
- Clica com botão direito no ícone do VS Code → **Executar como administrador**
- Abre o terminal de novo (Git Bash) → tenta o `npm install` de novo

### Se der "npm: command not found"

Node.js não está no PATH. Fecha e reabre o VS Code. Se continuar, reinstala Node.js.

---

## Fase 4 — Clonar o template do projeto

Ainda no terminal do VS Code, cola esses comandos **um por vez**:

```bash
cd ~
mkdir -p moon-bootcamp
cd moon-bootcamp
git clone https://github.com/gjpuliti/moon-ventures-bootcamp meu-projeto
cd meu-projeto
code .
```

O último comando (`code .`) abre a pasta do projeto dentro do VS Code. Um VS Code novo vai abrir com os arquivos.

> Se aparecer **"Do you trust the authors of the files in this folder?"** → clica **Yes, I trust the authors**.

---

## Fase 5 — Rodar o Claude e colar a sua chave

Abre o terminal de novo dentro do **novo VS Code** (Terminal → New Terminal). Digita:

```bash
claude
```

Na primeira vez, o Claude pergunta como você quer fazer login:

```
How would you like to log in?
> Claude account (recommended)
  Anthropic Console (API key)
```

- Usa a **seta pra baixo** no teclado
- Seleciona **Anthropic Console (API key)**
- Aperta **Enter**

Ele pede a chave:

```
Paste your API key:
```

- **Cola a chave que você recebeu** (começa com `sk-ant-api03-...`)
- Aperta **Enter**

Pronto. Claude está autenticado e aberto.

> A chave fica salva em `~/.claude/` — você não precisa colar de novo nas próximas vezes.

---

## Fase 6 — Primeiro prompt

Dentro da tela do Claude, digita:

```
Execute o comando /startup
```

Ele vai te fazer 7 perguntas (nome, área, email, GitHub, problema, slug do projeto, hipótese de solução). Responde uma por uma.

No final, ele personaliza todos os arquivos e faz o primeiro commit local. Você fica pronto pra começar a construir.

---

## Troubleshooting — erros comuns

### "npm: command not found" / "git: command not found"

Um dos programas da Fase 1 não instalou direito, ou o VS Code ainda não pegou o PATH novo.

**Solução:**
1. Fecha o VS Code completamente
2. Abre de novo
3. Tenta de novo

Se persistir, reinstala o programa que falta.

### "claude: command not found" depois do npm install

O npm instalou o Claude mas o terminal não achou ainda.

**Solução (Windows):** fecha e reabre o VS Code.

**Solução (Mac):** reabre o terminal do VS Code, ou digita:
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Erro EACCES ao rodar npm install

Permissão de escrita.

- **Mac:** usa `sudo npm install -g @anthropic-ai/claude-code`
- **Windows:** VS Code aberto como administrador

### Claude abre mas diz "Invalid API key"

1. Confere que você copiou a chave INTEIRA (começa com `sk-ant-api03-` e termina normalmente com `AA`)
2. Roda `claude /logout` → `claude` → cola de novo

### Git pede usuário e senha ao clonar

Você tentou clonar um repo privado. O template do bootcamp é público — confere que a URL é `https://github.com/gjpuliti/moon-ventures-bootcamp` (sem `git@`).

### Terminal do VS Code abre PowerShell em vez de Git Bash (Windows)

Refaz a Fase 2:
- `Ctrl+Shift+P` → **Terminal: Select Default Profile** → **Git Bash**
- Fecha o terminal e abre um novo

### Nada funciona e perdi 30 minutos

Chama o Cláudio ou o Guiga no canal `#bootcamp-claude-code` com **print da tela inteira e mensagem de erro completa**. Não descreva só "deu erro" — colar o texto exato economiza 10min.

---

## Próximos passos

Depois do `/startup`:

1. **Configurar Vercel:** https://vercel.com/signup → login com GitHub
2. **Configurar Supabase:** https://supabase.com → novo projeto → copia `SUPABASE_URL` e `SUPABASE_ANON_KEY` pro arquivo `.env`
3. **Faz o `git push`** pra subir o setup inicial
4. **Às 13h:** abre `docs/prd.md` e preenche por 15min **sem o Claude**
5. **13h15:** volta pro Claude e começa a construir

Boa sorte. 🚀
