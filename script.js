// Lista inicial das 16 alianças
const initialTeams = [
  "Aliança 1", "Aliança 2", "Aliança 3", "Aliança 4",
  "Aliança 5", "Aliança 6", "Aliança 7", "Aliança 8",
  "Aliança 9", "Aliança 10", "Aliança 11", "Aliança 12",
  "Aliança 13", "Aliança 14", "Aliança 15", "Aliança 16"
];

// Armazena os times classificados em cada rodada
const rounds = {
  1: [],
  2: [],
  3: [],
  4: []
};

/**
 * Cria um elemento de duelo (match) com dois times (teamA e teamB)
 */
function createMatch(round, matchIndex, teamA, teamB) {
  const div = document.createElement("div");
  div.className = "match";
  div.dataset.round = round;
  div.dataset.match = matchIndex;

  const btnA = document.createElement("button");
  btnA.className = "team";
  btnA.textContent = teamA;
  btnA.dataset.team = teamA;

  const btnB = document.createElement("button");
  btnB.className = "team";
  btnB.textContent = teamB;
  btnB.dataset.team = teamB;

  // Evento ao clicar para escolher o vencedor
  btnA.onclick = () => selectWinner(round, matchIndex, teamA, btnA, btnB);
  btnB.onclick = () => selectWinner(round, matchIndex, teamB, btnB, btnA);

  div.appendChild(btnA);
  div.appendChild(document.createTextNode(" vs "));
  div.appendChild(btnB);

  return div;
}

/**
 * Seleciona o vencedor de um duelo, marca visualmente e atualiza próximas rodadas
 */
function selectWinner(round, matchIndex, winner, winnerBtn, loserBtn) {
  const matchDiv = winnerBtn.parentElement;
  const buttons = matchDiv.querySelectorAll(".team");

  // Remove marcação anterior
  buttons.forEach(btn => btn.classList.remove("selected"));
  // Marca o vencedor
  winnerBtn.classList.add("selected");

  // Armazena o vencedor na rodada atual
  rounds[round][matchIndex] = winner;

  // Atualiza próxima rodada, se não for a final
  if (round < 4) {
    updateNextRound(round);
  } else {
    // Final do torneio: exibe campeão
    document.getElementById("final-result").textContent = `🏆 Campeão: ${winner} 🏆`;
  }
}

/**
 * Atualiza a próxima rodada com os vencedores da rodada atual
 */
function updateNextRound(currentRound) {
  const winners = rounds[currentRound].filter(Boolean);

  // Atualiza dados da próxima rodada
  rounds[currentRound + 1] = [];

  const nextRoundDiv = document.getElementById(`round-${currentRound + 1}`);
  nextRoundDiv.innerHTML = `<h2>Semana ${currentRound + 1}</h2>`;

  // Cria duelos na próxima rodada (cada dois vencedores formam um duelo)
  for (let i = 0; i < winners.length; i += 2) {
    const teamA = winners[i];
    const teamB = winners[i + 1];
    if (teamB) {
      const matchEl = createMatch(currentRound + 1, i / 2, teamA, teamB);
      nextRoundDiv.appendChild(matchEl);
    }
  }

  // Limpa rodadas seguintes após a próxima
  for (let r = currentRound + 2; r <= 4; r++) {
    const roundDiv = document.getElementById(`round-${r}`);
    roundDiv.innerHTML = `<h2>Semana ${r}</h2>`;
    rounds[r] = [];
  }

  // Limpa resultado final enquanto não houver campeão
  document.getElementById("final-result").textContent = "";
}

/**
 * Inicializa a primeira rodada com duelos aleatórios
 */
function initialize() {
  // Embaralha as alianças
  const shuffledTeams = initialTeams
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  rounds[1] = new Array(8).fill(null);

  const round1Div = document.getElementById("round-1");
  round1Div.innerHTML = `<h2>Semana 1</h2>`;

  for (let i = 0; i < 16; i += 2) {
    const matchEl = createMatch(1, i / 2, shuffledTeams[i], shuffledTeams[i + 1]);
    round1Div.appendChild(matchEl);
  }
}

initialize();
