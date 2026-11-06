/* ==========================================================================
   Cidade Resiliente · Digital Nomads
   JavaScript único do projeto, sem framework. Cada bloco só age se a página
   tiver os elementos dele, então o mesmo arquivo é carregado em todas as telas.

   1. Dados salvos no navegador
   2. Personalização (nome e avatar)
   3. Validação de formulários
   4. Missão: registrar bueiros
   5. Letra grande: ouvir aviso
   6. Painel da Defesa Civil
   ========================================================================== */
(function () {
  'use strict';

  /* 1. DADOS SALVOS NO NAVEGADOR ------------------------------------------ */
  /* O protótipo guarda nome, avatar e progresso no localStorage. Se o
     navegador bloquear (janela anônima, por exemplo), tudo segue funcionando
     com os dados de exemplo. */
  var PREFIXO = 'cidade-resiliente:';

  function ler(chave) {
    try {
      return JSON.parse(localStorage.getItem(PREFIXO + chave));
    } catch (e) {
      return null;
    }
  }

  function gravar(chave, valor) {
    try {
      localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    } catch (e) {
      /* sem armazenamento: segue sem salvar */
    }
  }

  var AVATARES = ['claudia', 'lucas', 'joaquim', 'ana', 'bia', 'teo'];

  /* 2. PERSONALIZAÇÃO ------------------------------------------------------ */
  var usuario = ler('usuario') || {};

  if (usuario.nome) {
    document.querySelectorAll('[data-usuario="nome"]').forEach(function (el) {
      el.textContent = usuario.nome.split(' ')[0];
    });
  }

  if (AVATARES.indexOf(usuario.avatar) !== -1) {
    document.querySelectorAll('[data-usuario="rosto"]').forEach(function (img) {
      img.src = 'img/avatares/' + usuario.avatar + '-rosto.svg';
    });
    var radioSalvo = document.querySelector('input[name="avatar"][value="' + usuario.avatar + '"]');
    if (radioSalvo) radioSalvo.checked = true;
  }

  /* 3. VALIDAÇÃO DE FORMULÁRIOS ------------------------------------------- */
  /* Formulários com data-validar="nome-da-acao". Cada campo validado tem
     data-erro="id-da-mensagem"; grupos de opções são <fieldset data-erro>. */

  function mensagemDoCampo(entrada) {
    var valor = entrada.value.trim();

    if (entrada.required && !valor) {
      return entrada.dataset.erroVazio || 'Preencha este campo.';
    }
    if (valor && entrada.type === 'tel') {
      var digitos = valor.replace(/\D/g, '');
      if (digitos.length < 10 || digitos.length > 11) {
        return 'Digite o celular com DDD. Exemplo: (32) 99999-0000.';
      }
    }
    if (valor && entrada.minLength > 0 && valor.length < entrada.minLength) {
      return entrada.dataset.erroCurto || 'Use pelo menos ' + entrada.minLength + ' letras.';
    }
    return '';
  }

  function mostrarErro(caixa, mensagem) {
    if (!caixa) return;
    caixa.querySelector('span').textContent = mensagem;
    caixa.hidden = !mensagem;
  }

  function validarEntrada(entrada) {
    var mensagem = mensagemDoCampo(entrada);
    if (mensagem) {
      entrada.setAttribute('aria-invalid', 'true');
    } else {
      entrada.removeAttribute('aria-invalid');
    }
    mostrarErro(document.getElementById(entrada.dataset.erro), mensagem);
    return !mensagem;
  }

  function validarGrupo(grupo) {
    var valido = !!grupo.querySelector('input:checked');
    grupo.classList.toggle('grupo--erro', !valido);
    mostrarErro(document.getElementById(grupo.dataset.erro), valido ? '' : grupo.dataset.erroVazio);
    return valido;
  }

  function validar(el) {
    return el.matches('fieldset') ? validarGrupo(el) : validarEntrada(el);
  }

  /* Valida tudo e leva o foco ao primeiro problema */
  function validarFormulario(form) {
    var primeiro = null;
    form.querySelectorAll('[data-erro]').forEach(function (el) {
      if (!validar(el) && !primeiro) {
        primeiro = el.matches('fieldset') ? el.querySelector('input:not(:disabled)') : el;
      }
    });
    if (primeiro) primeiro.focus();
    return !primeiro;
  }

  function irPara(form) {
    window.location.href = form.getAttribute('action');
  }

  var acoes = {
    cadastro: function (form) {
      var dados = new FormData(form);
      usuario.nome = dados.get('nome').trim();
      usuario.celular = dados.get('celular').trim();
      usuario.bairro = dados.get('bairro');
      usuario.avisos = dados.getAll('avisos');
      gravar('usuario', usuario);
      irPara(form);
    },
    avatar: function (form) {
      usuario.avatar = new FormData(form).get('avatar');
      gravar('usuario', usuario);
      irPara(form);
    },
    missao: function (form) {
      registrarBueiro(form);
    }
  };

  document.querySelectorAll('form[data-validar]').forEach(function (form) {
    var tentou = false;
    form.noValidate = true; /* as mensagens são do próprio app, não do navegador */

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      tentou = true;
      if (validarFormulario(form)) acoes[form.dataset.validar](form);
    });

    /* Depois da primeira tentativa, o erro some assim que a pessoa corrige */
    function revalidar(evento) {
      if (!tentou) return;
      var alvo = evento.target.closest('[data-erro]');
      if (alvo) validar(alvo);
    }
    form.addEventListener('input', revalidar);
    form.addEventListener('change', revalidar);
  });

  /* 4. MISSÃO: REGISTRAR BUEIROS ------------------------------------------ */
  var META_BUEIROS = 5;
  var JA_REGISTRADOS = 2; /* os dois bueiros de exemplo que já vêm no HTML */
  var registros = ler('bueiros');
  if (!Array.isArray(registros)) registros = [];

  function totalBueiros() {
    return Math.min(JA_REGISTRADOS + registros.length, META_BUEIROS);
  }

  function atualizarProgresso() {
    var total = totalBueiros();
    document.querySelectorAll('[data-progresso="bueiros"]').forEach(function (bloco) {
      var barra = bloco.querySelector('[role="progressbar"]');
      barra.setAttribute('aria-valuenow', total);
      barra.querySelector('span').style.width = (total / META_BUEIROS) * 100 + '%';
      bloco.querySelector('[data-progresso-texto]').textContent =
        total + ' de ' + META_BUEIROS + ' bueiros registrados';
    });
  }

  function anunciar(regiao, texto, tipo) {
    regiao.dataset.tipo = tipo || 'sucesso';
    regiao.textContent = texto;
  }

  function criarCartaoBueiro(registro) {
    var item = document.createElement('li');
    item.className = 'cartao';
    var titulo = document.createElement('h3');
    titulo.textContent = registro.local;
    var detalhe = document.createElement('p');
    detalhe.className = 'texto-apoio';
    detalhe.textContent = registro.situacao + ' · agora';
    item.append(titulo, detalhe);
    return item;
  }

  /* Sem internet: o cartão fica em estado de erro com "Tentar de novo" */
  function marcarComoPendente(item, enviar, status) {
    item.classList.add('cartao--erro');

    var erro = document.createElement('p');
    erro.className = 'mensagem-erro';
    var icone = document.createElement('img');
    icone.src = 'img/icones/erro.svg';
    icone.alt = '';
    icone.width = 18;
    icone.height = 18;
    var texto = document.createElement('span');
    texto.textContent = 'Não enviado: sem internet. Ficou salvo no celular.';
    erro.append(icone, texto);

    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'btn btn--secundario';
    botao.dataset.estado = 'erro';
    botao.textContent = 'Tentar de novo';
    botao.addEventListener('click', function () {
      if (!navigator.onLine) {
        anunciar(status, 'Ainda sem internet. Tente de novo daqui a pouco.', 'erro');
        return;
      }
      item.classList.remove('cartao--erro');
      erro.remove();
      botao.remove();
      enviar();
    });

    item.append(erro, botao);
  }

  function mostrarMissaoConcluida() {
    var form = document.getElementById('form-bueiro');
    var concluida = document.getElementById('missao-concluida');
    if (!form || !concluida) return;
    form.hidden = true;
    concluida.hidden = false;
  }

  function registrarBueiro(form) {
    var lista = document.getElementById('lista-bueiros');
    var status = document.getElementById('status-missao');
    var registro = {
      local: form.elements.local.value.trim(),
      situacao: form.elements.situacao.selectedOptions[0].text
    };
    var item = criarCartaoBueiro(registro);
    lista.prepend(item);
    form.reset();

    function enviar() {
      registros.push(registro);
      gravar('bueiros', registros);
      atualizarProgresso();
      if (totalBueiros() >= META_BUEIROS) {
        anunciar(status, 'Missão concluída! +40 pontos para o Parque Burnier.');
        mostrarMissaoConcluida();
        document.getElementById('titulo-concluida').focus();
      } else {
        anunciar(status, 'Bueiro registrado! Faltam ' + (META_BUEIROS - totalBueiros()) + '.');
      }
    }

    if (navigator.onLine) {
      enviar();
    } else {
      marcarComoPendente(item, enviar, status);
      anunciar(status, 'Sem internet. O registro ficou salvo e pode ser enviado depois.', 'erro');
    }
  }

  if (document.querySelector('[data-progresso="bueiros"]')) {
    var listaBueiros = document.getElementById('lista-bueiros');
    if (listaBueiros) {
      registros.forEach(function (registro) {
        listaBueiros.prepend(criarCartaoBueiro(registro));
      });
    }
    atualizarProgresso();
    if (totalBueiros() >= META_BUEIROS) mostrarMissaoConcluida();
  }

  var reiniciar = document.getElementById('reiniciar-missao');
  if (reiniciar) {
    reiniciar.addEventListener('click', function () {
      gravar('bueiros', []);
      window.location.reload();
    });
  }

  /* 5. LETRA GRANDE: OUVIR AVISO ------------------------------------------ */
  document.querySelectorAll('[data-ouvir]').forEach(function (botao) {
    var alvo = document.getElementById(botao.dataset.ouvir);
    var erro = document.getElementById(botao.dataset.erro);

    botao.addEventListener('click', function () {
      if (!('speechSynthesis' in window)) {
        botao.dataset.estado = 'erro';
        mostrarErro(erro, 'Este navegador não lê em voz alta. Peça ajuda à Cláudia ou ligue 199.');
        return;
      }
      window.speechSynthesis.cancel();
      var fala = new SpeechSynthesisUtterance(alvo.textContent.replace(/\s+/g, ' ').trim());
      fala.lang = 'pt-BR';
      fala.rate = 0.9;
      window.speechSynthesis.speak(fala);
    });
  });

  /* 6. PAINEL DA DEFESA CIVIL --------------------------------------------- */
  var statusPainel = document.getElementById('status-painel');

  /* Filtros por nível: só um ativo por vez (aria-pressed) */
  var filtros = document.querySelectorAll('.filtro[data-filtro]');
  filtros.forEach(function (filtro) {
    filtro.addEventListener('click', function () {
      var nivel = filtro.dataset.filtro;
      var visiveis = 0;

      filtros.forEach(function (outro) {
        outro.setAttribute('aria-pressed', String(outro === filtro));
      });
      document.querySelectorAll('.lista-acoes [data-nivel]').forEach(function (item) {
        var mostrar = nivel === 'todos' || item.dataset.nivel === nivel;
        item.hidden = !mostrar;
        if (mostrar) visiveis++;
      });
      document.getElementById('acoes-vazio').hidden = visiveis > 0;
      statusPainel.textContent = visiveis + (visiveis === 1 ? ' bairro na lista.' : ' bairros na lista.');
    });
  });

  /* "Acionar vigias" vira desabilitado depois do clique, mas continua no Tab */
  document.querySelectorAll('[data-acionar]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      if (botao.getAttribute('aria-disabled') === 'true') return;
      botao.setAttribute('aria-disabled', 'true');
      botao.textContent = 'Vigias acionados';
      statusPainel.textContent = 'Vigias de ' + botao.dataset.acionar + ' acionados.';
    });
  });

  /* Validar ou descartar relato: o item sai da lista e o foco vai para o próximo */
  document.querySelectorAll('.relato [data-relato]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var relato = botao.closest('.relato');
      var proximo = relato.nextElementSibling || relato.previousElementSibling;
      var nome = relato.querySelector('strong').textContent;
      relato.remove();

      var restantes = document.querySelectorAll('.relato').length;
      document.getElementById('relatos-vazio').hidden = restantes > 0;
      statusPainel.textContent = nome + (botao.dataset.relato === 'validar' ? ': validado.' : ': descartado.');

      var destino = proximo && proximo.classList.contains('relato')
        ? proximo.querySelector('button')
        : document.getElementById('titulo-relatos');
      destino.focus();
    });
  });
})();
