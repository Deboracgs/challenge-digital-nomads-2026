/* ==========================================================================
   Guardiões JF · Dashboard do morador (dashboard.html)
   Interações da Sprint 2, feitas com os conceitos vistos em aula:
   function, if/else, document.getElementById(), onclick/onchange e alert().

   As funções ficam soltas no arquivo (globais) porque são chamadas direto
   pelo HTML, por exemplo: <button onclick="atualizarDashboard()">.

   1. Utilidades
   2. Mensagem de alerta conforme o nível escolhido
   3. Mostrar e ocultar informações
   4. Mapa: trocar o abrigo exibido
   5. Filtro de abrigos
   6. Atualizar informações
   ========================================================================== */

/* 1. UTILIDADES ------------------------------------------------------------ */

/* Devolve a hora atual no formato usado no app, por exemplo "21h52". */
function horaAgora() {
  var agora = new Date();
  var horas = String(agora.getHours()).padStart(2, '0');
  var minutos = String(agora.getMinutes()).padStart(2, '0');
  return horas + 'h' + minutos;
}

/* Escreve uma mensagem na faixa de aviso do topo (região role="status"),
   que também é lida em voz alta por leitores de tela. */
function avisar(texto) {
  document.getElementById('status-dashboard').textContent = texto;
}

/* 2. MENSAGEM DE ALERTA CONFORME O NÍVEL ESCOLHIDO ---------------------------- */

/* Chamada pelo onchange do <select id="escolha-nivel">.
   Lê o nível escolhido e, com if/else, troca o título, o texto e o selo
   do cartão. Na emergência, além disso, mostra um alert() na tela. */
function mudarNivel() {
  var nivel = document.getElementById('escolha-nivel').value;
  var titulo = document.getElementById('titulo-orientacao');
  var texto = document.getElementById('texto-orientacao');
  var nomeDoNivel = '';

  if (nivel === 'normal') {
    nomeDoNivel = 'Normal';
    titulo.textContent = 'Sem risco agora';
    texto.textContent = 'Aproveite o tempo bom para conhecer o caminho até o abrigo e deixar a mochila de emergência pronta.';
  } else if (nivel === 'atencao') {
    nomeDoNivel = 'Atenção';
    titulo.textContent = 'Fique de olho na chuva';
    texto.textContent = 'Pode chover forte nas próximas horas. Deixe documentos e remédios à mão e mantenha o celular carregado.';
  } else if (nivel === 'alerta') {
    nomeDoNivel = 'Alerta';
    titulo.textContent = 'Prepare-se para sair';
    texto.textContent = 'Risco alto de alagamento e deslizamento. Se você mora em encosta ou perto do rio, vá para o abrigo antes de a chuva apertar.';
  } else {
    nomeDoNivel = 'Emergência';
    titulo.textContent = 'Saia agora';
    texto.textContent = 'Vá imediatamente para o abrigo mais próximo pelo caminho indicado. Não volte para buscar objetos. Em perigo, ligue 199.';
    alert('EMERGÊNCIA: saia agora e vá para o abrigo mais próximo. Em caso de perigo, ligue 199.');
  }

  /* O selo combina forma (ícone), cor (classe) e palavra, como no design system */
  document.getElementById('selo-nivel').className = 'nivel nivel--grande nivel--' + nivel;
  document.getElementById('selo-nivel-icone').src = 'img/icones/nivel-' + nivel + '.svg';
  document.getElementById('selo-nivel-texto').textContent = nomeDoNivel;
  /* data-nivel muda a cor da borda do cartão (ver .alerta[data-nivel] no CSS) */
  document.getElementById('cartao-nivel').dataset.nivel = nivel;
}

/* 3. MOSTRAR E OCULTAR INFORMAÇÕES ------------------------------------------- */

/* Usada por todos os botões "Mostrar ...": recebe o id do botão e o id do
   conteúdo. Se o conteúdo está escondido, mostra; se não, esconde.
   O texto do botão troca "Mostrar" por "Ocultar" (e vice-versa), e o
   aria-expanded avisa o leitor de tela se o conteúdo está aberto. */
function alternarInformacao(idBotao, idConteudo) {
  var botao = document.getElementById(idBotao);
  var conteudo = document.getElementById(idConteudo);

  if (conteudo.hidden) {
    conteudo.hidden = false;
    botao.textContent = botao.textContent.replace('Mostrar', 'Ocultar');
    botao.setAttribute('aria-expanded', 'true');
  } else {
    conteudo.hidden = true;
    botao.textContent = botao.textContent.replace('Ocultar', 'Mostrar');
    botao.setAttribute('aria-expanded', 'false');
  }
}

/* 4. MAPA: TROCAR O ABRIGO EXIBIDO -------------------------------------------- */

/* Dados de cada abrigo usados no mapa: o nome e o endereço que o Google
   Maps procura. Os abrigos são de exemplo; os bairros são de Juiz de Fora. */
var ABRIGOS = {
  escola: { nome: 'Escola Municipal (exemplo)', endereco: 'Parque Burnier, Juiz de Fora - MG' },
  igreja: { nome: 'Igreja do bairro (exemplo)', endereco: 'Igreja, Parque Burnier, Juiz de Fora - MG' },
  centro: { nome: 'Centro Comunitário (exemplo)', endereco: 'Linhares, Juiz de Fora - MG' },
  salao: { nome: 'Salão Paroquial (exemplo)', endereco: 'Grama, Juiz de Fora - MG' }
};

/* Chamada pelo onclick dos botões "Ver no mapa".
   Troca o endereço do mapa incorporado (iframe) e o link da rota a pé,
   atualiza a legenda e rola a tela até o mapa. */
function mostrarNoMapa(idAbrigo) {
  var abrigo = ABRIGOS[idAbrigo];
  var endereco = encodeURIComponent(abrigo.endereco); /* troca espaços e acentos por códigos aceitos na URL */

  document.getElementById('mapa-google').src =
    'https://maps.google.com/maps?q=' + endereco + '&z=15&output=embed';
  document.getElementById('link-rota').href =
    'https://www.google.com/maps/dir/?api=1&destination=' + endereco + '&travelmode=walking';
  document.getElementById('mapa-legenda').textContent = 'Mostrando: ' + abrigo.nome + ' · ' + abrigo.endereco;

  document.getElementById('mapa').scrollIntoView();
  avisar('Mapa mostrando ' + abrigo.nome + '.');
}

/* 5. FILTRO DE ABRIGOS ------------------------------------------------------- */

/* Chamada pelo onchange do <select id="filtro-abrigos">.
   Cada cartão de abrigo guarda suas características em atributos data-*
   (data-aberto, data-vagas, data-acessivel, data-animais). A função passa
   por todos os cartões e, com if/else, decide quem aparece. */
function filtrarAbrigos() {
  var filtro = document.getElementById('filtro-abrigos').value;
  var cartoes = document.querySelectorAll('.abrigo-item');
  var visiveis = 0;

  for (var i = 0; i < cartoes.length; i++) {
    var cartao = cartoes[i];
    var aberto = cartao.dataset.aberto === 'sim';
    var mostrar = false;

    if (filtro === 'todos') {
      mostrar = true;
    } else if (filtro === 'vagas') {
      mostrar = aberto && Number(cartao.dataset.vagas) > 0;
    } else if (filtro === 'acessivel') {
      mostrar = aberto && cartao.dataset.acessivel === 'sim';
    } else if (filtro === 'animais') {
      mostrar = aberto && cartao.dataset.animais === 'sim';
    }

    cartao.hidden = !mostrar;
    if (mostrar) {
      visiveis = visiveis + 1;
    }
  }

  /* Se nenhum abrigo sobrou, mostra a mensagem de lista vazia */
  document.getElementById('abrigos-vazio').hidden = visiveis > 0;
}

/* 6. ATUALIZAR INFORMAÇÕES --------------------------------------------------- */

/* Chamada pelo onclick do botão "Atualizar informações".
   Simula a chegada de dados novos: cada abrigo aberto recebe de 0 a 12
   pessoas, as vagas livres diminuem e o horário de atualização muda.
   Quando um abrigo enche, o texto vira "Lotado". */
function atualizarDashboard() {
  var cartoes = document.querySelectorAll('.abrigo-item');
  var lotados = 0;

  for (var i = 0; i < cartoes.length; i++) {
    var cartao = cartoes[i];
    if (cartao.dataset.aberto !== 'sim') {
      continue; /* abrigo fechado não muda */
    }

    var chegaram = Math.floor(Math.random() * 13); /* número inteiro de 0 a 12 */
    var vagas = Math.max(Number(cartao.dataset.vagas) - chegaram, 0);
    cartao.dataset.vagas = vagas;

    var texto = cartao.querySelector('[data-vagas-texto]');
    if (vagas === 0) {
      texto.textContent = 'Lotado';
      lotados = lotados + 1;
    } else if (vagas === 1) {
      texto.textContent = '1 vaga livre';
    } else {
      texto.textContent = vagas + ' vagas livres';
    }
  }

  document.getElementById('hora-atualizacao').textContent = horaAgora();
  filtrarAbrigos(); /* reaplica o filtro escolhido com as vagas novas */

  if (lotados > 0) {
    avisar('Atualizado às ' + horaAgora() + '. Atenção: ' + lotados + ' abrigo(s) lotado(s). Procure outro abrigo da lista.');
  } else {
    avisar('Informações atualizadas às ' + horaAgora() + '.');
  }
}
