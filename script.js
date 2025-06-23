const rankingInputs = document.getElementById("ranking-inputs");
const confrontosDiv = document.getElementById("confrontos");
const rankingList = document.getElementById("ranking-atual");
const confrontosSection = document.getElementById("confrontos-section");
const rankingSection = document.getElementById("ranking-section");

let ranking = [];

// Cria 16 campos de entrada
for (let i = 1; i <= 16; i++) {
  const input = document.createElement("input");
  input.placeholder = `Posição ${i}`;
  rankingInputs.appendChild(input);
}

function iniciarTorneio() {
  const inputs = rankingInputs.querySelectorAll("input");
  ranking = Array.from(inputs).map(i => i.value.trim()).filter(v => v);
  if (ranking.length !== 16) {
    alert("Preencha os 16 nomes das alianças.");
    return;
  }
  renderRanking();
  gerarConfrontos();
  confrontosSection.style.display = 'block';
  rankingSection.style.display = 'block';
}

function gerarConfrontos() {
  confrontosDiv.innerHTML = "";
  for (let i = 0; i < ranking.length; i += 2) {
    const card = document.createElement("div");
    card.className = "match-card";

    const team1 = document.createElement("div");
    team1.className = "team";
    team1.textContent = ranking[i];

    const team2 = document.createElement("div");
    team2.className = "team";
    team2.textContent = ranking[i + 1];

    team1.onclick = () => marcarVencedor(card, team1, team2);
    team2.onclick = () => marcarVencedor(card, team2, team1);

    card.appendChild(team1);
    card.appendChild(document.createTextNode("vs"));
    card.appendChild(team2);

    confrontosDiv.appendChild(card);
  }
}

function marcarVencedor(card, vencedor, perdedor) {
  vencedor.classList.add("selected");
  perdedor.classList.remove("selected");
}

function renderRanking() {
  rankingList.innerHTML = "";
  ranking.forEach((nome, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}º - ${nome}`;
    if (nome.toUpperCase() === "OTAN") li.classList.add("highlight");
    rankingList.appendChild(li);
  });
}
