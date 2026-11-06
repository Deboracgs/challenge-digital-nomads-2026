# Cidade Resiliente

Projeto do grupo **Digital Nomads** · Front-End Design · Challenge Sprint 2 · Juiz de Fora/MG.

App de prevenção a desastres para moradores de áreas de risco e para a Defesa Civil. Este repositório é o protótipo de alta fidelidade em código: HTML semântico, CSS e JavaScript puro, sem framework e sem etapa de build.

- **Protótipo publicado:** https://deboracgs.github.io/challenge-digital-nomads-2026/
- **Design system e materiais da Sprint 1:** https://claude.ai/artifact/G4qN849nvuuydiSgA1apmD
- **Fluxos, componentes por página e fluxograma:** [docs/fluxos.md](docs/fluxos.md)
- **Componentes e estados:** [componentes.html](componentes.html)
- **PDF da entrega:** abra [docs/entrega.html](docs/entrega.html), preencha nomes, RMs e o link do vídeo e use “Salvar como PDF”

## Como executar

Não há dependências para instalar.

**Opção 1 · Abrir direto:** dê dois cliques em `index.html`, ou abra qualquer `.html` no navegador.

**Opção 2 · Servidor local:** recomendado, porque se comporta igual ao site publicado.

```bash
git clone https://github.com/Deboracgs/challenge-digital-nomads-2026.git
cd challenge-digital-nomads-2026
python3 -m http.server 8000
# ou: npx serve .
```

Depois, acesse http://localhost:8000.

**Para ver como no celular** (o viewport prioritário): abra as ferramentas do navegador (F12), clique no ícone de celular e use 390 px de largura.

## Como publicar

O site é estático, então qualquer serviço serve. Escolha um:

- **GitHub Pages:** no repositório, vá em *Settings → Pages → Build and deployment*, escolha *Deploy from a branch*, a branch `main` e a pasta `/ (root)`. O endereço fica `https://deboracgs.github.io/challenge-digital-nomads-2026/`.
- **Vercel:** importe o repositório em *Add New → Project*, deixe o *Framework Preset* em *Other* e publique (não precisa de comando de build).
- **Netlify:** use *Add new site → Import an existing project*, com o campo de build vazio e a pasta de publicação `.`.

Antes de entregar, abra o link numa janela anônima.

## Os três fluxos

Para navegar pelo protótipo, comece pelo rodapé de qualquer tela, onde estão os atalhos.

| Fluxo | Persona | Caminho |
|---|---|---|
| **1 · Cadastro (principal)** | Cláudia | `cadastro.html` → `avatar.html` → `index.html` |
| **2 · Alerta e abrigo** | Cláudia / Seu Joaquim | `alerta.html` (no rodapé: "Simular alerta") → rota → `seguranca.html`. Alternativo: `letra-grande.html` |
| **3 · Missão dos bueiros** | Cláudia | `index.html` → `missao.html` → `perfil.html#ranking` |

A descrição de cada fluxo (tarefa, caminhos alternativos e pontos de falha) está em [docs/fluxos.md](docs/fluxos.md).

**Roteiro para testar os erros**
- **Cadastro e avatar:** toque em Continuar com tudo vazio. Depois, digite um celular sem DDD.
- **Missão:** toque em Registrar bueiro com o formulário vazio.
- **Missão sem internet:** desligue a internet (F12 → *Network* → *Offline*) e registre um bueiro. O cartão fica em erro, com "Tentar de novo".
- **Painel:** os filtros, "Acionar vigias" e "Validar/Descartar" funcionam.

O nome, o avatar e o progresso da missão ficam salvos no navegador (`localStorage`). Para apresentar de novo, use **Recomeçar demonstração** no fim da missão ou limpe os dados do site.

## Acessibilidade e navegação por teclado

- **Pular para o conteúdo:** o primeiro Tab de cada página mostra esse link.
- **Landmarks:** `header`, `nav` (com `aria-label`), `main` e `footer` em todas as telas. Há um `h1` por página e os headings seguem a ordem, sem pular níveis.
- **Foco:** contorno de 3 px em teal em todo elemento focável, branco no cabeçalho escuro do painel. Nenhum `outline` é removido sem um substituto visível. No cartão interativo, o foco aparece em volta do cartão inteiro.
- **Erros:** sempre ícone + texto, com `aria-invalid` e `aria-describedby`. O foco vai para o primeiro campo com problema.
- **Botões desabilitados:** usam `aria-disabled="true"` e continuam no Tab.
- **Mensagens de resultado:** usam `role="status"`, e o cartão de alerta usa `role="alert"`.
- **Alvo de toque:** todo elemento tocável tem pelo menos 48 px.

## Estrutura

```
├── index.html          Início do morador (modo bairro) · Fluxos 1 e 3
├── cadastro.html       Cadastro passo 1: dados e canais de alerta · Fluxo 1
├── avatar.html         Cadastro passo 2: seletor de avatar · Fluxo 1
├── missao.html         Missão: registrar bueiros · Fluxo 3
├── perfil.html         Perfil, conquistas e ranking · Fluxo 3
├── alerta.html         Cartão de alerta e rota até o abrigo · Fluxo 2
├── seguranca.html      Confirmação "estou em segurança" · Fluxo 2
├── letra-grande.html   Modo letra grande (Seu Joaquim) · Fluxo 2 alternativo
├── mapa.html           Mapa do bairro e abrigos
├── painel.html         Painel da Defesa Civil (Renata)
├── componentes.html    Componentes com todos os estados
├── css/style.css       Único CSS: tokens, componentes, páginas e desktop
├── js/app.js           Único JS: validação, missão, painel, leitura em voz alta
├── docs/fluxos.md      Documentação dos fluxos e fluxograma
├── docs/entrega.html   Página para gerar o PDF da entrega (capa, fluxos, links)
└── img/                Logo, mascote Teto, selo e avatares (SVG)
    ├── icones/         Ícones da interface (níveis, legenda, tabbar, erro…)
    └── mapas/          Mapa da rota até o abrigo e mapa do painel (base + rótulos)
```

## Componentes com estados

Os estados ficam em `css/style.css` e aparecem juntos em [componentes.html](componentes.html).

| Componente | Classe | Onde aparece no fluxo principal |
|---|---|---|
| Botão (primário, secundário, socorro) | `.btn` | Continuar, Voltar, Concluir cadastro |
| Campo de texto | `.campo` + `.campo__entrada` | Nome, celular, referência |
| Seleção | `select.campo__entrada` | Bairro |
| Cartão / Cartão de opção | `.cartao`, `.cartao-opcao` | Canais de alerta |
| Seletor de avatar (composto) | `.avatares` + `.avatar-opcao` | Passo 2 do cadastro |

Cada um tem **default, hover, focus, active, disabled e erro**. As classes `.is-hover`, `.is-focus` e `.is-active` existem só para congelar esses estados na página de documentação. No app, os estados vêm das pseudo-classes reais (`:hover`, `:focus-visible`, `:active`).

## CSS e tokens

O CSS é **mobile first**: o estilo base é o do celular, e as regras de desktop ficam no fim do arquivo, dentro de `@media (min-width: 900px)`.

- **Celular:** uma coluna e a barra de navegação inferior (`.tabbar`).
- **Desktop:** duas colunas e o menu no topo (`.nav-principal`). A barra inferior some.

Todas as cores, tamanhos de texto, espaços e raios estão como variáveis CSS em `:root`. Use sempre as variáveis, nunca o hexadecimal solto.

Regras que não podem quebrar:
- As cores de risco (`--cor-normal`, `--cor-atencao`, `--cor-alerta`, `--cor-emergencia`) só aparecem quando há risco. Erros de formulário usam `--cor-erro`, sempre com ícone e texto.
- Em `--cor-atencao` e `--cor-alerta`, o texto é **sempre navy**.
- O roxo (`--cor-conquista`) é só do modo bairro: nível, selos e "seu bairro".
- Todo elemento tocável tem pelo menos 48 px (`--alvo-toque`).

Os ícones são arquivos SVG em `img/`, carregados com `<img>`. Como uma imagem não herda a cor do texto, cada ícone já vem com a cor do lugar onde é usado. Por isso a barra inferior tem as versões `tab-*-ativo.svg`.

## Fonte

Atkinson Hyperlegible, carregada do Google Fonts no `<head>`. Para funcionar sem internet, baixe os arquivos `.woff2` (pesos 400 e 700), coloque em `fonts/` e troque o `<link>` por um `@font-face` no topo do CSS.

## O que é provisório

- Nomes, bairros e números são **exemplos fictícios**. Não há back-end: os envios são simulados no navegador.
- O alerta chega por notificação no app real. No protótipo, ele é aberto pelo link "Simular alerta".
- O mapa do painel usa o **contorno oficial do município (IBGE)**, mas a posição dos bairros é aproximada. Na versão final, troquem por um mapa real (por exemplo, Leaflet + OpenStreetMap) com os limites dos bairros da Prefeitura.
- "Adicionar vizinho" e o canal WhatsApp aparecem desabilitados de propósito: estão previstos para a próxima versão.
