const apiKey = '97876b0a84msh6ccc3c5e9360db5p143954jsn042d7f49114b';
        const apiUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search';

        // Função para pesquisar o artista
        const pesquisar = async () => {
          const searchTerm = document.getElementById('pesquisar').value;
          
          const url = `${apiUrl}?q=${searchTerm}`;
          const options = {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
          };
          
          try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Elemento da introdução
            const introducao = document.querySelector('.introdução');

            // Elemento do título
            const titulo = document.getElementById('titulo');

            // Verifica se há resultados da pesquisa
            if (result.data && result.data.length > 0) {
              // Oculta a seção de introdução
              introducao.style.display = 'none';

              // Atualiza o título
              titulo.textContent = 'Encontradas';

              // Elemento do resultado da pesquisa
              const resultadoPesquisa = document.getElementById('resultadoPesquisa');

              // Limpa os elementos existentes
              resultadoPesquisa.innerHTML = '';

              // Atualiza os elementos HTML com as informações dos resultados
              for (let i = 0; i < result.data.length; i++) {
                const music = result.data[i];
                const albumImage = music.album.cover_medium;
                const songTitle = music.title;
                const artistName = music.artist.name;
                const previewUrl = music.preview;

                // Atualiza os elementos HTML com as informações da música
                resultadoPesquisa.innerHTML += `
                  <div class="col-md-4 col-sm-6">
                    <div class="card mb-3">
                      <img src="${albumImage}" class="card-img-top" alt="Album Image">
                      <div class="card-body">
                        <h5 class="card-title">${songTitle}</h5>
                        <p class="card-text">${artistName}</p>
                        <audio controls>
                          <source src="${previewUrl}" type="audio/mp3">
                        </audio>
                      </div>
                    </div>
                  </div>
                `;
              }

              // Mostra os cards
              resultadoPesquisa.style.display = 'flex';
            } else {
              // Exibe uma mensagem se não houver resultados da pesquisa
              resultadoPesquisa.innerHTML = '<p>Nenhum resultado encontrado.</p>';

              // Oculta os cards
              resultadoPesquisa.style.display = 'none';

              // Exibe a seção de introdução
              introducao.style.display = 'block';

              // Limpa o título
              titulo.textContent = '';
            }
          } catch (error) {
            console.error(error);
          }
        };

        // Chama a função de pesquisa quando o usuário clicar no botão "Pesquisar"
        document.getElementById('lupa').addEventListener('click', pesquisar);

        // Chama a função de pesquisa quando o usuário pressionar a tecla "Enter"
        document.getElementById('pesquisar').addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            pesquisar();
          }
        });