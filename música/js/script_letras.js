function mostrarLetra(data, artista, musica, arrayid) {
  if (!arrayid) arrayid = 0;

  if (data.type == 'exact' || data.type == 'aprox') {
    // Exibir texto da letra
    $('#letra .text').text(data.mus[arrayid].text);

    // Mostrar botões para abrir a tradução original e em português
    if (data.mus[arrayid].translate) {
      $('#letra .text').prepend('<input id="traduzir" type="button" value="Português" onClick="$(document).trigger(\'traduzir\')"><br><br/>');
      $(document).one('traduzir', function() {
        $('#letra .text').text(data.mus[arrayid].translate[0].text);
        $('#letra .text').prepend('<input type="button" id="traduzir" value="Original" onClick="$(document).trigger(\'original\')"><br><br/>');
        $(document).one('original', function() {
          mostrarLetra(data, artista, musica, arrayid);
        });
      });
    }

    // Se não for correspondência exata (ex: U2 / Beautiful)
    if (data.type == 'aprox' && !$('#aprox').is('div')) {
      $('#letra').prepend('<div id="aprox">Encontramos algo similar<br/><span class="songname">"' + data.mus[arrayid].name + '"</span></div>');

      // Se o Vagalume encontrou mais de uma correspondência possível
      if (data.mus.length > 0) {
        var html = '<select class="songselect">';
        for (var i = 0; i < data.mus.length; i++) {
          html += '<option value="' + i + '"' + (i == arrayid ? ' selected' : '') + '>' + data.mus[i].name + '</option>';
        }
        html += '</select>';
        $('#aprox span.songname').html(html);
        $('#aprox select.songselect').change(function() {
          var aID = $('option:selected', this).val();
          mostrarLetra(data, artista, musica, aID);
        });
      }
    }
  } else if (data.type == 'song_notfound') {
    // Música não encontrada, mas o artista foi encontrado
    // Exibir link para pesquisa no Vagalume
    $('#letra .text').text('Letra não encontrada. Deseja pesquisar por ' + musica + ' no Vagalume?');
    $('#letra .text').append('<br/><br/><a target="_blank" href="http://www.vagalume.com.br/search.php?art=' + artista + '&amp;mus=' + musica + '">Clique aqui</a> para pesquisar.');
  } else {
    // Artista não encontrado ou erro
    $('#letra .text').text('Artista não encontrado ou ocorreu um erro na busca.');
  }
}

function buscarLetra() {
  var artista = $('#artista').val();
  var musica = $('#musica').val();

  // Limpar campo da letra
  $('#letra .text').text('');

  // Verificar se os campos estão preenchidos
  if (artista.length > 0 && musica.length > 0) {
    // Fazer a requisição AJAX
    $.getJSON('http://api.vagalume.com.br/search.php?mus=' + musica + '&art=' + artista + '&extra=artpic&apikey={ed118af46c162a972a659ac8534acdaa}', function(data) {
      mostrarLetra(data, artista, musica);
    });
  }
}

$(document).ready(function() {
  // Associar evento de pressionar Enter aos campos de texto
  $('#artista, #musica').keypress(function(event) {
    if (event.which == 13) {
      buscarLetra();
    }
  });
});