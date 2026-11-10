/* ==========================================================================
   Guardiões JF · Painel das autoridades da Defesa Civil (painel.html)
   Interações da Sprint 2, feitas com os conceitos vistos em aula:
   function, if/else, document.getElementById(), onclick/onchange e alert().

   As funções ficam soltas no arquivo (globais) porque são chamadas direto
   pelo HTML, por exemplo: <button onclick="atualizarPainel()">.
   Os filtros por nível, "Acionar vigias" e a validação de relatos
   continuam em js/app.js.

   1. Utilidades
   2. Atualizar os indicadores
   3. Situação dos abrigos (atualizar e filtrar)
   4. Ocorrências (filtrar e avançar o atendimento)
   5. Formulário: registrar ocorrência
   6. Emitir alerta (mensagem conforme a opção escolhida)
   7. Mostrar e ocultar seções
   ========================================================================== */

/* 1. UTILIDADES ------------------------------------------------------------ */

/* Devolve a hora atual no formato usado no painel, por exemplo "21h52". */
function horaAgora() {
  var agora = new Date();
  var horas = String(agora.getHours()).padStart(2, '0');
  var minutos = String(agora.getMinutes()).padStart(2, '0');
  return horas + 'h' + minutos;
}

/* Lê um número escrito com ponto de milhar ("18.420") e devolve 18420. */
function lerNumero(id) {
  return Number(document.getElementById(id).textContent.replace(/\./g, ''));
}

/* Escreve um número com ponto de milhar no elemento indicado. */
function escreverNumero(id, numero) {
  document.getElementById(id).textContent = numero.toLocaleString('pt-BR');
}

/* Avisa o leitor de tela do que mudou (região role="status", invisível). */
function avisar(texto) {
  document.getElementById('status-painel').textContent = texto;
}

/* Sorteia um número inteiro entre minimo e maximo (incluindo os dois). */
function sortear(minimo, maximo) {
  return minimo + Math.floor(Math.random() * (maximo - minimo + 1));
}

/* 2. ATUALIZAR OS INDICADORES ------------------------------------------------ */

/* Chamada pelo onclick de "Atualizar painel".
   Simula dados novos: mais moradores confirmam que estão em segurança,
   então "Sem confirmação" diminui na mesma quantidade. */
function atualizarPainel() {
  var semConfirmacao = lerNumero('ind-sem-confirmacao');
  var novasConfirmacoes = Math.min(sortear(20, 90), semConfirmacao); /* não deixa ficar negativo */

  escreverNumero('ind-confirmados', lerNumero('ind-confirmados') + novasConfirmacoes);
  escreverNumero('ind-sem-confirmacao', semConfirmacao - novasConfirmacoes);
  document.getElementById('hora-painel').textContent = horaAgora();

  if (semConfirmacao - novasConfirmacoes === 0) {
    /* Todo mundo confirmou: o indicador deixa de ser crítico */
    document.getElementById('ind-sem-confirmacao-caixa').classList.remove('indicador--critico');
    alert('Todos os moradores das áreas de risco confirmaram que estão em segurança.');
  } else {
    avisar('Painel atualizado às ' + horaAgora() + '. Mais ' + novasConfirmacoes + ' moradores confirmaram segurança.');
  }
}

/* 3. SITUAÇÃO DOS ABRIGOS ---------------------------------------------------- */

/* Decide a situação do abrigo pela lotação, usando if/else:
   cheio = "Lotado"; 80% ou mais = "Quase cheio"; abaixo disso = "Com vagas". */
function situacaoDoAbrigo(ocupadas, total) {
  if (ocupadas >= total) {
    return 'Lotado';
  } else if (ocupadas >= total * 0.8) {
    return 'Quase cheio';
  } else {
    return 'Com vagas';
  }
}

/* Escreve na tela os números, a barra e a situação de um abrigo.
   O número do abrigo (1 a 4) monta os ids: "abrigo-1-numeros" etc. */
function mostrarAbrigo(numero, ocupadas, total) {
  var prefixo = 'abrigo-' + numero;
  var situacao = situacaoDoAbrigo(ocupadas, total);
  var etiqueta = document.getElementById(prefixo + '-situacao');
  var barra = document.getElementById(prefixo + '-barra');

  document.getElementById(prefixo).dataset.ocupadas = ocupadas;
  document.getElementById(prefixo).dataset.situacao = situacao;
  document.getElementById(prefixo + '-numeros').textContent = ocupadas + ' de ' + total;
  barra.setAttribute('aria-valuenow', ocupadas);
  barra.querySelector('span').style.width = Math.round((ocupadas / total) * 100) + '%';

  etiqueta.textContent = situacao;
  if (situacao === 'Lotado') {
    etiqueta.className = 'situacao situacao--critico';
  } else if (situacao === 'Quase cheio') {
    etiqueta.className = 'situacao situacao--atencao';
  } else {
    etiqueta.className = 'situacao situacao--ok';
  }
}

/* Chamada pelo onclick de "Atualizar lotação".
   Cada abrigo recebe de 0 a 25 pessoas (sem passar do total). Se algum
   abrigo lotar, um alert() avisa a equipe para redirecionar as pessoas. */
function atualizarAbrigos() {
  var lotados = [];

  for (var numero = 1; numero <= 4; numero++) {
    var abrigo = document.getElementById('abrigo-' + numero);
    var total = Number(abrigo.dataset.total);
    var ocupadas = Math.min(Number(abrigo.dataset.ocupadas) + sortear(0, 25), total);
    var estavaLotado = abrigo.dataset.situacao === 'Lotado';

    mostrarAbrigo(numero, ocupadas, total);

    if (ocupadas >= total && !estavaLotado) {
      lotados.push(abrigo.querySelector('strong').textContent);
    }
  }

  document.getElementById('hora-abrigos').textContent = horaAgora();
  filtrarAbrigosPainel(); /* reaplica o filtro escolhido com os números novos */

  if (lotados.length > 0) {
    alert('Abrigo lotado: ' + lotados.join(', ') + '. Redirecione os moradores para outro abrigo.');
  } else {
    avisar('Lotação dos abrigos atualizada às ' + horaAgora() + '.');
  }
}

/* Chamada pelo onchange do filtro de abrigos: mostra só os abrigos
   cuja situação (data-situacao) é igual à opção escolhida. */
function filtrarAbrigosPainel() {
  var filtro = document.getElementById('filtro-abrigos-painel').value;
  var visiveis = 0;

  for (var numero = 1; numero <= 4; numero++) {
    var abrigo = document.getElementById('abrigo-' + numero);
    var mostrar = filtro === 'todos' || abrigo.dataset.situacao === filtro;
    abrigo.hidden = !mostrar;
    if (mostrar) {
      visiveis = visiveis + 1;
    }
  }

  document.getElementById('abrigos-painel-vazio').hidden = visiveis > 0;
}

/* 4. OCORRÊNCIAS -------------------------------------------------------------- */

/* Chamada pelo onchange dos filtros "Tipo" e "Situação".
   Uma ocorrência aparece só se combinar com os dois filtros ao mesmo tempo. */
function filtrarOcorrencias() {
  var tipo = document.getElementById('filtro-tipo').value;
  var status = document.getElementById('filtro-status').value;
  var itens = document.querySelectorAll('.ocorrencia');
  var visiveis = 0;

  for (var i = 0; i < itens.length; i++) {
    var item = itens[i];
    var tipoCombina = tipo === 'todos' || item.dataset.tipo === tipo;
    var statusCombina = status === 'todos' || item.dataset.status === status;

    if (tipoCombina && statusCombina) {
      item.hidden = false;
      visiveis = visiveis + 1;
    } else {
      item.hidden = true;
    }
  }

  document.getElementById('ocorrencias-vazio').hidden = visiveis > 0;
  document.getElementById('contagem-ocorrencias').textContent = visiveis + ' na lista';
}

/* Conta as ocorrências ainda abertas e atualiza o indicador do topo. */
function contarOcorrenciasAbertas() {
  var abertas = document.querySelectorAll('.ocorrencia[data-status="aberta"]').length;
  document.getElementById('ind-ocorrencias').textContent = abertas;
}

/* Chamada pelo onclick do botão de cada ocorrência.
   Avança o atendimento em etapas: Aberta → Em atendimento → Resolvida.
   Depois de resolvida, o botão fica desabilitado. */
function avancarOcorrencia(id) {
  var item = document.getElementById(id);
  var etiqueta = document.getElementById(id + '-status');
  var botao = document.getElementById(id + '-botao');
  var titulo = item.querySelector('strong').textContent;

  if (item.dataset.status === 'aberta') {
    item.dataset.status = 'atendimento';
    etiqueta.textContent = 'Em atendimento';
    etiqueta.className = 'situacao situacao--atencao';
    botao.textContent = 'Marcar como resolvida';
    botao.className = 'btn btn--secundario';
    avisar(titulo + ': equipe a caminho.');
  } else if (item.dataset.status === 'atendimento') {
    item.dataset.status = 'resolvida';
    etiqueta.textContent = 'Resolvida';
    etiqueta.className = 'situacao situacao--ok';
    botao.textContent = 'Concluída';
    botao.setAttribute('aria-disabled', 'true');
    avisar(titulo + ': resolvida.');
  } else {
    alert('Esta ocorrência já foi resolvida.');
    return;
  }

  contarOcorrenciasAbertas();
  filtrarOcorrencias(); /* se houver filtro ativo, a ocorrência pode sair da lista */
}

/* 5. FORMULÁRIO: REGISTRAR OCORRÊNCIA ---------------------------------------- */

/* Nomes que aparecem na lista para cada tipo escolhido no formulário. */
var NOMES_DOS_TIPOS = {
  alagamento: 'Alagamento',
  deslizamento: 'Deslizamento de terra',
  arvore: 'Árvore caída',
  bueiro: 'Bueiro entupido',
  outro: 'Outro'
};

var proximoId = 6; /* as ocorrências 1 a 5 já vêm no HTML */

/* Chamada pelo onsubmit do formulário.
   1) event.preventDefault() impede a página de recarregar;
   2) if/else confere se tipo e bairro foram escolhidos (se não, alert());
   3) cria o item novo no topo da lista, como "Aberta". */
function registrarOcorrencia(event) {
  event.preventDefault();

  var campoTipo = document.getElementById('ocorrencia-tipo');
  var campoBairro = document.getElementById('ocorrencia-bairro');
  var gravidade = document.getElementById('ocorrencia-gravidade').value;
  var descricao = document.getElementById('ocorrencia-descricao').value.trim();

  if (campoTipo.value === '') {
    alert('Escolha o tipo da ocorrência.');
    campoTipo.setAttribute('aria-invalid', 'true');
    campoTipo.focus();
    return;
  } else {
    campoTipo.removeAttribute('aria-invalid');
  }

  if (campoBairro.value === '') {
    alert('Escolha o bairro da ocorrência.');
    campoBairro.setAttribute('aria-invalid', 'true');
    campoBairro.focus();
    return;
  } else {
    campoBairro.removeAttribute('aria-invalid');
  }

  var id = 'oc-' + proximoId;
  proximoId = proximoId + 1;

  /* Monta o item com createElement e textContent: o texto digitado entra
     como texto puro, sem virar HTML. */
  var item = document.createElement('li');
  item.className = 'ocorrencia';
  item.id = id;
  item.dataset.tipo = campoTipo.value;
  item.dataset.status = 'aberta';

  var resumo = document.createElement('span');
  var titulo = document.createElement('strong');
  titulo.textContent = NOMES_DOS_TIPOS[campoTipo.value];
  var detalhe = document.createElement('small');
  detalhe.textContent = campoBairro.value + ' · gravidade ' + gravidade + ' · ' + horaAgora();
  resumo.append(titulo, document.createElement('br'), detalhe);
  if (descricao !== '') {
    var texto = document.createElement('small');
    texto.textContent = descricao;
    resumo.append(document.createElement('br'), texto);
  }

  var etiqueta = document.createElement('span');
  etiqueta.className = 'situacao situacao--critico';
  etiqueta.id = id + '-status';
  etiqueta.textContent = 'Aberta';

  var botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'btn btn--primario';
  botao.id = id + '-botao';
  botao.textContent = 'Iniciar atendimento';
  botao.onclick = function () {
    avancarOcorrencia(id);
  };

  item.append(resumo, etiqueta, botao);
  document.getElementById('lista-ocorrencias').prepend(item);

  alert('Ocorrência registrada: ' + titulo.textContent + ' em ' + campoBairro.value + '.');
  document.getElementById('form-ocorrencia').reset();
  contarOcorrenciasAbertas();
  filtrarOcorrencias();
}

/* 6. EMITIR ALERTA ------------------------------------------------------------ */

/* Chamada pelo onchange dos campos "Bairro" e "Nível".
   Com if/else, monta a mensagem que os moradores vão receber e troca
   o selo de nível da prévia. */
function atualizarPreviaAlerta() {
  var bairro = document.getElementById('alerta-bairro').value;
  var nivel = document.getElementById('alerta-nivel').value;
  var mensagem = '';
  var nomeDoNivel = '';

  if (nivel === 'atencao') {
    nomeDoNivel = 'Atenção';
    mensagem = 'Atenção, ' + bairro + ': previsão de chuva forte. Deixe documentos e remédios à mão e acompanhe o app.';
  } else if (nivel === 'alerta') {
    nomeDoNivel = 'Alerta';
    mensagem = 'Alerta para ' + bairro + ': chuva forte nas próximas horas. Quem mora em encosta ou perto de rio deve ir para o abrigo.';
  } else if (nivel === 'emergencia') {
    nomeDoNivel = 'Emergência';
    mensagem = 'EMERGÊNCIA em ' + bairro + ': saia agora e vá para o abrigo mais próximo. Em perigo, ligue 199.';
  } else {
    nomeDoNivel = 'Normal';
    mensagem = 'Fim do alerta em ' + bairro + ': a chuva diminuiu. Só volte para casa se a Defesa Civil liberar a sua rua.';
  }

  document.getElementById('previa-texto').textContent = mensagem;
  document.getElementById('previa-nivel').textContent = nomeDoNivel;
  document.getElementById('previa-selo').className = 'nivel nivel--' + nivel;
  document.getElementById('previa-icone').src = 'img/icones/nivel-' + nivel + '.svg';
  document.getElementById('previa-alerta').dataset.nivel = nivel;
}

/* Chamada pelo onclick de "Enviar alerta".
   Simula o envio: mostra um alert() de confirmação e registra o envio
   na lista "Alertas enviados neste plantão". */
function enviarAlerta() {
  var bairro = document.getElementById('alerta-bairro').value;
  var nivel = document.getElementById('alerta-nivel').value;
  var nomeDoNivel = document.getElementById('previa-nivel').textContent;

  if (nivel === 'normal') {
    alert('Aviso de fim de alerta enviado para os moradores de ' + bairro + '.');
  } else if (nivel === 'emergencia') {
    alert('ALERTA DE EMERGÊNCIA enviado para ' + bairro + ' por app, SMS e ligação de voz. Os vigias do bairro também foram avisados.');
  } else {
    alert('Alerta de nível ' + nomeDoNivel + ' enviado para ' + bairro + '.');
  }

  var item = document.createElement('li');
  var hora = document.createElement('strong');
  hora.textContent = horaAgora();
  item.append(hora, ' · ' + nomeDoNivel + ' · ' + bairro);
  document.getElementById('alertas-enviados').prepend(item);
  avisar('Alerta enviado para ' + bairro + '.');
}

/* 7. MOSTRAR E OCULTAR SEÇÕES ------------------------------------------------- */

/* Chamada pelo onclick dos botões "Ocultar/Mostrar detalhes".
   Se a seção está visível, esconde; se está escondida, mostra.
   O texto do botão e o aria-expanded acompanham a mudança. */
function alternarSecao(idBotao, idConteudo) {
  var botao = document.getElementById(idBotao);
  var conteudo = document.getElementById(idConteudo);

  if (conteudo.hidden) {
    conteudo.hidden = false;
    botao.textContent = 'Ocultar detalhes';
    botao.setAttribute('aria-expanded', 'true');
  } else {
    conteudo.hidden = true;
    botao.textContent = 'Mostrar detalhes';
    botao.setAttribute('aria-expanded', 'false');
  }
}
