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

## Fase 5 — Configurar a chave de API e rodar o Claude

**IMPORTANTE — leia antes de digitar `claude`:**

As versões atuais do Claude Code **não mostram mais** a opção "colar API key" na tela inicial — elas tentam te jogar pra login no browser (Claude account ou Anthropic Console via web). Pra usar a chave do bootcamp, a gente define ela como **variável de ambiente** ANTES de rodar `claude`. Com a variável setada, o Claude abre direto sem pedir login.

Abre o terminal de novo dentro do **novo VS Code** (Terminal → New Terminal).

### Passo 1 — Criar o arquivo `.env` com a chave

No terminal, digita:

```bash
cp .env.example .env
```

Isso cria o arquivo `.env` a partir do modelo. Agora edita ele:

- Na lista de arquivos do VS Code (lado esquerdo), clica no arquivo chamado **`.env`** (não no `.env.example`)
- Vai aparecer uma linha: `ANTHROPIC_API_KEY=sk-ant-...`
- **Apaga tudo depois do `=`** e **cola a sua chave inteira** (começa com `sk-ant-api03-...`)
- A linha deve ficar assim: `ANTHROPIC_API_KEY=sk-ant-api03-SUACHAVEINTEIRAAQUI`
- **Não coloca aspas** na chave. Não coloca espaço antes nem depois do `=`.
- Salva com `Ctrl+S` (Windows) ou `Cmd+S` (Mac)

### Passo 2 — Exportar a chave no terminal

No terminal, cola **este comando exato** e aperta Enter:

```bash
export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d= -f2)
```

Isso lê a chave do `.env` e coloca no ambiente do terminal. Não aparece nada como resposta — **é normal**, funcionou.

**Confere** que deu certo:

```bash
echo $ANTHROPIC_API_KEY
```

Deve imprimir a sua chave começando com `sk-ant-api03-...`. Se imprimir linha vazia, algo deu errado no Passo 1 — abre o `.env` e revisa.

### Passo 3 — Rodar o Claude

Agora sim:

```bash
claude
```

Como a variável de ambiente está setada, o Claude **não vai pedir login** — abre direto pronto pra uso.

> Se ele **ainda** mostrar a tela de "Claude account / Anthropic Console": a variável não foi lida. Aperta `Ctrl+C` pra sair, refaz o Passo 2 **no mesmo terminal** (a variável só vale no terminal onde você exportou — se abrir outro, tem que exportar de novo) e roda `claude` de novo.

### Toda vez que abrir um terminal novo

A variável `ANTHROPIC_API_KEY` só vale **no terminal atual**. Se fechar o VS Code ou abrir um terminal novo, você precisa rodar o export de novo antes de `claude`:

```bash
export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d= -f2)
claude
```

### Opcional — persistir pra não exportar toda vez

Se quer que a chave carregue automaticamente em todo terminal novo, roda **uma vez**:

**No Mac (zsh):**
```bash
echo 'export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY ~/moon-bootcamp/meu-projeto/.env | cut -d= -f2)' >> ~/.zshrc
source ~/.zshrc
```

**No Windows (Git Bash):**
```bash
echo 'export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY ~/moon-bootcamp/meu-projeto/.env | cut -d= -f2)' >> ~/.bashrc
source ~/.bashrc
```

Agora a chave é carregada automaticamente em todo terminal novo.

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

### Claude abre a tela "How would you like to log in?" mesmo depois do export

A variável de ambiente não foi lida. Aperta `Ctrl+C` pra sair. Depois:

1. Confere que você está no diretório certo: `pwd` deve mostrar algo como `.../moon-bootcamp/meu-projeto`
2. Confere que o `.env` existe e tem a chave: `cat .env | grep ANTHROPIC` deve imprimir a linha com a chave
3. Roda de novo o export no **mesmo terminal**: `export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d= -f2)`
4. Confere: `echo $ANTHROPIC_API_KEY` deve imprimir a chave
5. Agora sim: `claude`

Se abriu um terminal novo depois do export, a variável some — tem que exportar de novo **no terminal em que você vai rodar `claude`**.

### Claude abre mas diz "Invalid API key" ou "Authentication failed"

1. Confere que você copiou a chave INTEIRA (começa com `sk-ant-api03-` e termina em `AA`)
2. Abre o `.env` e verifica: não tem aspas, não tem espaço antes ou depois do `=`, nenhum caractere estranho
3. Refaz o export: `export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d= -f2)`
4. `claude` de novo

Se persistir, chama no canal — a chave pode ter sido revogada.

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
