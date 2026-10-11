# Herrmann — Portfolio

Portfólio de **Herrmann** (nome completo: Gabriel Herrmann Grecchi — Lead AI Engineer · Fullstack & Frontend Specialist): landing em cenas em quatro idiomas, páginas de case em `/work/[slug]`, resumo para ouvir e apresentação em vídeo gerados no navegador, e um painel `/admin` para editar tudo sem tocar em código.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Motion for React · Lucide · dnd-kit · Zod.
**Persistência:** um arquivo JSON + pasta de uploads no servidor (sem banco de dados).
**Identidade:** verde Herrmann IT — `#0A7C15 → #A8D965`, menta `#58AE8D`, amarelo-sinal `#EACE43` sobre quase-preto `#07100C` (as mesmas cores do README do GitHub). Tipos: Big Shoulders Display, Inter Tight e JetBrains Mono, servidos localmente (Fontsource).

---

## 1. Rodar localmente

Requisitos: Node 20+.

```bash
npm install
cp .env.example .env.local      # defina ADMIN_PASSWORD e SESSION_SECRET
npm run dev                      # http://localhost:3000  ·  painel em /admin
```

Gerar um `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Na primeira execução o site cria `storage/content.json` com o conteúdo inicial (CV + imagens pesquisadas).

Scripts: `npm run dev` · `npm run build` · `npm start` · `npm run lint` · `npm run typecheck` · `npm run media:localize`.

## 2. Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `ADMIN_PASSWORD` | sim (para o admin) | Senha do `/admin`. Mínimo 12 caracteres. Sem ela o painel fica desativado e avisa por quê. |
| `SESSION_SECRET` | sim (para o admin) | Assina o cookie de sessão (HMAC-SHA256). Mínimo 32 caracteres. |
| `NEXT_PUBLIC_SITE_URL` | recomendado | URL pública — SEO, sitemap e Open Graph. |
| `STORAGE_DIR` | não | Onde ficam `content.json` e `uploads/`. Padrão: `./storage`. |
| `CONTENT_READONLY` | não | `1` bloqueia gravações (ativado automaticamente na Vercel). |
| `ALLOW_INSECURE_COOKIE` | não | `1` permite login via `http://` em `npm start` local (em produção real use HTTPS e deixe vazio). |

## 3. O painel `/admin`

- **Oportunidades & projetos** — três tipos: *Experiência/oportunidade* (empregos), *Cliente* (trabalhos via Herrmann IT) e *Projeto* (open source, Projeto Dev…). Criar, editar, excluir, publicar/ocultar (olho), destacar em *Selected work* (estrela) e arrastar para reordenar — a ordem vale para o site todo.
- **Editor** — empresa, cargo, "via", período (vazio = atual), local, slug, cor de destaque, resumo, descrição, destaques, produtos, setores, tecnologias, resultados (métricas) e links.
- **Imagens de cada projeto** — logo, capa e **galeria**: adicionar por upload (arrastar/selecionar, com barra de progresso), por link, ou da biblioteca; remover com o ×; arrastar para reordenar.
- **Imagens (biblioteca)** — upload, adicionar por link, texto alternativo, filtro (no servidor / remotas / não usadas), ver onde cada imagem é usada. Imagem em uso não pode ser excluída.
- **Configurações** — foto, nome do hero, cargos que "digitam", intro, bio, números, stack, formação, certificações, idiomas, contato, selo *Open to work* e SEO. Há também "Restaurar conteúdo inicial".

Uploads aceitos: PNG, JPG, WEBP, GIF, AVIF e SVG até 15 MB — validados pelo conteúdo do arquivo (magic bytes), não pela extensão.

## 4. Imagens pesquisadas (remotas)

O conteúdo inicial já vem com logos, capas e galerias reais tirados dos sites públicos de cada empresa (Zup, Deal, TaqTaq, CI&T, Pharmalink/InterPlayers, PicPay, upLexis, Pernambucanas, Milvus, Pacto) e cards do GitHub para os repositórios. Elas entram como **remotas** (link para o site de origem) e mostram a fonte no admin.

Links externos podem mudar ou sair do ar. Para guardar cópias locais:

- no admin: **Imagens → Baixar todas as remotas** (ou "Baixar para o servidor" em cada uma); ou
- no terminal, com o servidor parado: `npm run media:localize`.

Se um site bloquear o download, a imagem continua como link — e, se o link quebrar, o site mostra uma capa gerada com as iniciais e a cor de destaque, nunca uma imagem quebrada.

Logos e marcas pertencem às respectivas empresas; estão aqui para identificar onde você trabalhou. Troque qualquer uma pelo painel se preferir material próprio (prints de telas que você construiu, por exemplo — respeitando NDAs).

## 5. Onde o conteúdo fica

```
storage/
├── content.json     tudo o que o admin edita (validado com Zod em toda gravação)
└── uploads/         arquivos enviados ou baixados
```

Gravações são serializadas e atômicas (arquivo temporário → rename). Faça backup copiando a pasta `storage/`.

## 6. Deploy

**Com admin editando online** — precisa de disco persistente: Railway, Render, Fly.io ou VPS. Monte um volume e aponte `STORAGE_DIR` para ele. O `Dockerfile` incluso já faz isso (`/app/storage`).

```bash
docker build -t herrmann-portfolio .
docker run -p 3000:3000 -v $(pwd)/storage:/app/storage \
  -e ADMIN_PASSWORD=... -e SESSION_SECRET=... -e NEXT_PUBLIC_SITE_URL=https://seu-dominio \
  herrmann-portfolio
```

**Vercel** — o disco é efêmero, então o admin entra em modo somente leitura e avisa. A pasta `storage/` fica fora do Git (`.gitignore`), então a Vercel serve o conteúdo de `src/lib/seed*.ts`. Para publicar edições feitas no admin local, versione o conteúdo explicitamente (`git add -f storage/content.json storage/uploads`) ou leve as mudanças para o seed. Sem `ADMIN_PASSWORD`/`SESSION_SECRET` configurados o `/admin` fica desativado — o recomendado na Vercel.

## 7. Estrutura

```
src/
├── app/
│   ├── (site)/              landing, /work/[slug]
│   ├── admin/               login, painel (oportunidades, imagens, configurações), server actions
│   ├── api/admin/upload/    upload com validação
│   ├── media/[...path]/     serve os uploads
│   ├── sitemap.ts · robots.ts · not-found.tsx
├── components/
│   ├── site/                Hero, LogoMarquee, SelectedWork, Archive, Stack, About, Contact, Nav
│   ├── media/               Img (com fallback), BrandCover, Logo, Gallery (lightbox)
│   └── admin/               WorksBoard, WorkEditor, MediaPicker, MediaLibrary, Uploader, SettingsEditor
├── lib/                     types (Zod), store, seed, queries, session, media-server
└── middleware.ts            protege /admin e /api/admin
scripts/localize-media.mjs   baixa imagens remotas para storage/uploads
tests/e2e.mjs                teste ponta a ponta do admin + site
```

## 8. Seções do site

1. **Hero** — "Herrmann" gigante com cursor piscando e o nome completo logo abaixo, botões para ouvir o resumo e ver a apresentação, cargos digitados no estilo terminal, relógio de Novo Hamburgo, retrato numa janela de editor e barra de status ("⎇ main · ✓ build passing").
2. **Faixa de logos** das empresas e clientes.
3. **Selected work** (`Shipped to prod`) — os destaques alternam quatro layouts: capa 21:9, split com bloco verde, cartão de código (`export const zup = {…}`) e split invertido.
4. **Archive** (`git log --all`) — todas as experiências, clientes e projetos com filtro por tipo e setor, ordenação e prévia da capa seguindo o cursor.
5. **Stack** (`package.json`) e idiomas.
6. **About** — bio, nome completo, números, formação e certificações.
7. **Recomendações** — as 12 recomendações do LinkedIn no idioma original, com tradução rotulada e botão "ver original".
8. **Contact** — tela verde cheia com e-mail e links.

### Idiomas

Inglês, português, espanhol e chinês. O idioma vem do cookie `locale` (definido pelas bandeiras no topo) ou, na primeira visita, do `Accept-Language` do navegador; sem correspondência, inglês. A interface está em `src/lib/i18n/dictionaries.ts`; o conteúdo é escrito em inglês e cada item tem `i18n.pt/es/zh` com os campos traduzidos (`src/lib/seed-i18n.ts`). Campo sem tradução cai para o inglês.

### Ouvir e assistir

Botão de fone no menu e no hero. Gera no navegador do visitante, a partir do conteúdo do site, um resumo em três tamanhos (curto, médio, completo) para **ler**, **ouvir** (Web Speech API, voz e velocidade ajustáveis, parágrafo atual destacado), copiar, baixar em .txt e imprimir/salvar em PDF — e uma **apresentação em vídeo** desenhada em canvas, narrada e legendada, que toca na hora e pode ser baixada em WebM (com legendas embutidas; navegadores não gravam voz sintetizada). Nada é enviado a servidores. Código em `src/lib/summary.ts` e `src/components/site/studio/`.

#### Narração por IA e comercial em motion graphics (pré-gerados)

O site toca áudios e um **comercial** gerados offline:

- **Resumo narrado** (primeira pessoa) — gerado do mesmo conteúdo do site, em três tamanhos.
- **Comercial** (~90 s, narrador em terceira pessoa) — roteiro escrito à mão em `src/lib/commercial.ts` nos quatro idiomas: gancho → origem (2014, Novo Hamburgo) → escala (super app bancário, −50% no tempo de carregamento) → apps do dia a dia → repertório e IA → o que dizem os colegas → líder e executor → revelação do nome → chamada. Cada fala entra no início de um compasso de uma trilha original (100 BPM, com bateria, sidechain, riser e impacto na revelação) e as animações pulsam no tempo da música.

| Passo | Comando | Gera |
|---|---|---|
| 1. Roteiro | `npm run studio:script` | `.studio/script.json` — resumos frase a frase + dados do comercial nos 4 idiomas |
| 2. Vozes + trilha | `npm run studio:audio` | `public/studio/<idioma>/{short,medium,full}.mp3`, `commercial-voice.mp3`, `commercial-music.mp3` e `manifest.json` com o tempo de cada frase e de cada bloco. Vozes **Kokoro-82M** (IA open-source, Apache-2.0, local, sem chave); música sintetizada em numpy, sem nada a licenciar |
| 3. Vídeo | `npm run studio:render` | `public/studio/<idioma>/commercial.mp4` (1080p) + `commercial.jpg`, renderizados com **Remotion** (`remotion/Commercial.tsx`) |

Voz de estúdio opcional: com `STUDIO_TTS=elevenlabs` e `ELEVENLABS_API_KEY` (opcionalmente `ELEVENLABS_VOICE_ID`) no ambiente, o passo 2 usa a ElevenLabs no lugar do Kokoro. A chave é lida só da variável de ambiente e nunca é gravada.

Tudo de uma vez: `npm run studio`. Para ajustar o vídeo ao vivo: `npm run studio:preview`.

O passo 3 também roda no GitHub Actions (`.github/workflows/studio-render.yml`): ao enviar novas narrações (`public/studio/**/*.mp3`) ou mudar `remotion/`, o workflow renderiza os quatro vídeos em Linux e faz commit dos MP4 — útil em máquinas Windows com Smart App Control, que bloqueia o ffmpeg do Remotion. Também dá para disparar manualmente em *Actions → Render presentation videos*.

Requisitos do passo 2 (só para gerar, não para rodar o site): Python 3.12 e `python -m pip install -r scripts/studio/requirements.txt` (GPU NVIDIA opcional — instale o `torch` com CUDA antes). Cada frase fica em cache em `.studio/cache`, então regerar após editar um texto só sintetiza o que mudou.

O manifesto guarda um hash da narração: se o conteúdo for editado no admin e os áudios não forem regerados, o site percebe a diferença e volta a usar a voz do navegador — nunca toca uma gravação desatualizada. Remotion é gratuito para pessoas físicas e empresas de até 3 pessoas ([licença](https://www.remotion.dev/license)).

### Acessibilidade

Auditado com axe-core (home e páginas de case): zero violações. Link "pular para o conteúdo", `lang` correto por idioma (inclusive nas citações traduzidas), diálogos modais com foco preso e Esc, abas navegáveis por setas, contraste AA, regiões roláveis acessíveis por teclado, legendas e alternativa em texto para o vídeo, `prefers-reduced-motion` respeitado.

Sem *scroll hijacking*; tudo respeita `prefers-reduced-motion`.

## 9. Verificação feita

`tsc` e ESLint sem erros · `next build` de produção OK · teste em navegador (`tests/e2e.mjs`, 18 verificações) contra o build de produção: redirecionamento sem sessão, senha errada/certa, criar oportunidade, upload com progresso e rejeição de arquivo inválido, galeria, salvar, página pública do case, imagem servida de `/media/uploads`, lightbox (abrir/Esc), aparece no Archive, bloqueio de exclusão de imagem em uso, remover imagem, ocultar item (404), configurações persistindo, excluir, filtro do Archive e nenhum erro de JavaScript. Sem overflow horizontal em 390 px e 1440 px.

Para rodar o teste: `npm run build && npm start` em um terminal, e `ADMIN_PASSWORD=sua-senha node tests/e2e.mjs http://localhost:3000` em outro. Se o Playwright pedir o navegador, rode `npx playwright install chromium` antes.
