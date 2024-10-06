// Função para buscar todos os planetas e criar os botões
async function fetchPlanets() {
  try {
    const response = await fetch('https://swapi.dev/api/planets/?format=json');
    const data = await response.json();
    createButtons(data.results);
  } catch (error) {
    console.log('Erro ao buscar planetas:', error);
  }
}

// Função para criar botões dos planetas na tela
function createButtons(planets) {
  const buttonsContainer = document.getElementById('buttons-container');
  buttonsContainer.innerHTML = ''; // Limpa botões anteriores

  planets.forEach(planet => {
    const button = document.createElement('button');
    button.textContent = planet.name;
    button.classList.add('planet-button');
    buttonsContainer.appendChild(button);

    // Quando clicar no botão, mostra as informações do planeta
    button.addEventListener('click', function () {
      displayPlanetInfo(planet);
    });
  });
}

// Função para mostrar as informações do planeta
function displayPlanetInfo(planet) {
  const planetInfoDiv = document.getElementById('planet-info');
  planetInfoDiv.innerHTML = `
    <h2>${planet.name}</h2>
    <p><strong>Clima:</strong> ${planet.climate !== 'unknown' ? planet.climate : 'Desconhecido'}</p>
    <p><strong>População:</strong> ${planet.population !== 'unknown' ? planet.population : 'Desconhecida'}</p>
    <p><strong>Terreno:</strong> ${planet.terrain !== 'unknown' ? planet.terrain : 'Desconhecido'}</p>
  `;

  if (planet.residents.length > 0) {
    showResidents(planet.residents);
  } else {
    planetInfoDiv.innerHTML += '<p>Não há residentes conhecidos neste planeta.</p>';
  }
}

// Função para buscar e mostrar os residentes
async function showResidents(residents) {
  const planetInfoDiv = document.getElementById('planet-info');
  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Data de Nascimento</th>
    </tr>
  `;
  planetInfoDiv.appendChild(table);

  // Buscar cada residente e adicionar na tabela
  for (const residentURL of residents) {
    try {
      const response = await fetch(residentURL + '?format=json');
      const resident = await response.json();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${resident.name}</td>
        <td>${resident.birth_year !== 'unknown' ? resident.birth_year : 'Desconhecido'}</td>
      `;
      table.appendChild(row);
    } catch (error) {
      console.log('Erro ao buscar residente:', error);
    }
  }
}

// Função para buscar um planeta pelo nome
async function searchPlanet() {
  const planetName = document.getElementById('search-input').value;
  if (planetName.trim() === '') {
    alert('Digite o nome de um planeta!');
    return;
  }

  try {
    const response = await fetch(`https://swapi.dev/api/planets/?search=${planetName}&format=json`);
    const data = await response.json();

    if (data.results.length > 0) {
      displayPlanetInfo(data.results[0]);
    } else {
      alert('Planeta não encontrado.');
    }
  } catch (error) {
    console.log('Erro ao buscar planeta:', error);
  }
}

// Evento para buscar o planeta pelo nome
document.getElementById('search-button').addEventListener('click', searchPlanet);

// Busca todos os planetas quando a página carrega
fetchPlanets();
