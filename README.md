# Guardiões JF

App de prevenção a desastres para Juiz de Fora/MG. Ele avisa os moradores de áreas de risco antes de chuvas fortes e leva cada um até o abrigo mais próximo. Quando não há risco, o app mantém o bairro preparado com missões simples. Do outro lado, a Defesa Civil acompanha tudo por um painel.

🔗 **Acesse:** https://deboracgs.github.io/challenge-digital-nomads-2026/

Projeto do grupo **Digital Nomads** para a disciplina de Front-End Design.

## O que dá para fazer

**Morador**
- **Cadastro:** a pessoa informa nome, celular, bairro e por onde quer receber os alertas (app, SMS ou ligação de voz), e depois escolhe um avatar.
- **Início (modo bairro):** mostra o nível de risco do bairro agora, a trilha de missões da semana, a rede de vizinhos e o ranking dos bairros.
- **Missões:** registrar os bueiros da rua, com o progresso salvo. Sem internet, o registro fica guardado e pode ser enviado depois.
- **Alerta (modo emergência):**
  - mostra o que fazer agora e o abrigo mais próximo, com a rota a pé;
  - tem o botão "Confirmar que estou em segurança";
  - tem o botão "Pedir socorro", que liga para o 199.
- **Letra grande:** versão simplificada para quem tem baixa visão, com leitura do aviso em voz alta.
- **Perfil:** nível, conquistas e posição do bairro no ranking.

**Defesa Civil**
- **Painel:** mapa de calor da cidade, filtros por nível de risco, bairros onde agir primeiro, acionamento de vigias, lotação dos abrigos e validação de relatos de moradores.

Os dados são fictícios e não há back-end: os envios são simulados no navegador.

## Como executar

Não há dependências nem etapa de build. É HTML, CSS e JavaScript puro.

```bash
git clone https://github.com/Deboracgs/challenge-digital-nomads-2026.git
cd challenge-digital-nomads-2026
python3 -m http.server 8000
```

Abra http://localhost:8000. No lugar do Python, também funciona `npx serve .`, ou dar dois cliques em `index.html`.

O app foi pensado primeiro para o celular. Para ver como no celular, abra as ferramentas do navegador (F12), ative o modo de dispositivo e use 390 px de largura.

O site publicado usa o GitHub Pages e se atualiza sozinho a cada push na branch `main`.

## Navegando pelo protótipo

| Caminho | Telas |
|---|---|
| Cadastro | `cadastro.html` → `avatar.html` → `index.html` |
| Alerta e abrigo | `alerta.html` → rota → `seguranca.html` (alternativo: `letra-grande.html`) |
| Missão dos bueiros | `index.html` → `missao.html` → `perfil.html#ranking` |

O rodapé de todas as telas tem atalhos para o cadastro, para simular um alerta, para o painel da Defesa Civil e para a página de componentes.

O nome, o avatar e o progresso da missão ficam salvos no navegador (`localStorage`). Para começar do zero, use **Recomeçar demonstração** no fim da missão ou limpe os dados do site.

Detalhes de cada fluxo (personas, caminhos alternativos e pontos de falha) e o fluxograma de navegação estão em [docs/fluxos.md](docs/fluxos.md).

## Estrutura

```
├── index.html          Início do morador (modo bairro)
├── cadastro.html       Cadastro, passo 1: dados e canais de alerta
├── avatar.html         Cadastro, passo 2: escolha do avatar
├── missao.html         Missão: registrar bueiros
├── perfil.html         Perfil, conquistas e ranking
├── alerta.html         Alerta da Defesa Civil e rota até o abrigo
├── seguranca.html      Confirmação "estou em segurança"
├── letra-grande.html   Modo letra grande
├── mapa.html           Mapa do bairro e abrigos
├── painel.html         Painel da Defesa Civil
├── componentes.html    Componentes do design system com todos os estados
├── css/style.css       Estilos: tokens, componentes, páginas e desktop
├── js/app.js           Comportamento: validação, missão, painel, leitura em voz alta
├── docs/               Documentação dos fluxos
└── img/                Logo, mascote Teto, selo e avatares
    ├── icones/         Ícones da interface
    └── mapas/          Mapa da rota e mapa do painel
```

## Design system

O design system completo está em https://claude.ai/artifact/G4qN849nvuuydiSgA1apmD.

- **Tokens:** cores, tamanhos de texto, espaços e raios ficam como variáveis CSS em `:root`, no início de `css/style.css`.
- **Níveis de risco:** sempre combinam forma, cor e palavra (círculo Normal, triângulo Atenção, losango Alerta, octógono Emergência). Assim, quem não distingue cores também entende.
- **Cores de risco:** só aparecem quando há risco. Erros de formulário usam uma cor própria (`--cor-erro`), sempre com ícone e texto.
- **Roxo (`--cor-conquista`):** fica reservado para a parte de jogo, ou seja, nível, selos e "seu bairro".
- **Estados:** cada componente interativo tem default, hover, focus, active, disabled e erro, e todos podem ser vistos juntos em [componentes.html](componentes.html).
- **Mobile first:** o estilo base é o do celular, e a partir de 900 px o layout passa a duas colunas com menu no topo.

## Acessibilidade

- **Fonte:** Atkinson Hyperlegible, feita para baixa visão.
- **Pular para o conteúdo:** esse link aparece no primeiro Tab de cada página.
- **HTML semântico:** `header`, `nav`, `main` e `footer` em todas as telas, e um `h1` por página com os títulos em ordem.
- **Foco visível:** todo elemento focável recebe um contorno de 3 px.
- **Erros de formulário:** aparecem com ícone e texto, e o foco vai para o primeiro campo com problema.
- **Toque:** todo elemento tocável tem pelo menos 48 px.
- **Teclado:** tudo funciona só com o teclado, inclusive o seletor de avatar, os filtros e os botões do painel.

## Próximos passos

- Ligar o app a um back-end e às notificações reais da Defesa Civil.
- Trocar o mapa ilustrativo por um mapa real, por exemplo Leaflet + OpenStreetMap, com os limites dos bairros da Prefeitura. Hoje o mapa do painel usa o contorno oficial do município (IBGE), mas a posição dos bairros é aproximada.
- Carregar a fonte localmente para o app funcionar 100% sem internet.
- Liberar "Adicionar vizinho" e o canal de WhatsApp, que hoje aparecem como "em breve".
