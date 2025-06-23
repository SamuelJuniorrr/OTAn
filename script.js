const aliançasIniciais = [
  "OTAn", "AZ", "AB", "AC",
  "AD", "AE", "AF", "AG",
  "AH", "AI", "AJ", "AK",
  "AL", "AM", "AN", "AO"
];

let ranking = [...aliançasIniciais];
let semanaAtual = 1;
const totalSemanas = 4;
let resultadosSemana = [];
let historico = [];

function atualizarRankingVisual() {
  const ul = document.getElementById("ranking-list");
  ul.innerHTML = "";
  ranking.forEach((alianca) => {
    const li = document.createElement("li");
    li.textContent = alianca;
    if (alianca.toUpperCase() === "OTAN") li.classList.add("otan");
    ul.appendChild(li);
  });
}

function gerarConfrontos() {
  const container = document.getElementById("confrontos");
  container.innerHTML = "";
  resultadosSemana = [];

  for (let i = 0; i < ranking.length; i += 2) {
    const a1 = ranking[i];
    const a2 = ranking[i + 1];

    const div = document.createElement("div");
    div.className = "confronto";
    div.dataset.index = i;

    const btn1 = document.createElement("button");
    btn1.textContent = a1;
    btn1.onclick = () => selecionarVencedor(i, a1, btn1, btn2);
    if (a1.toUpperCase() === "OTAN") btn1.classList.add("otan");

    const btn2 = document.createElement("button");
    btn2.textContent = a2;
    btn2.onclick = () => selecionarVencedor(i, a2, btn2, btn1);
    if (a2.toUpperCase() === "OTAN") btn2.classList.add("otan");

    div.appendChild(btn1);
    div.appendChild(document.createTextNode("vs"));
    div.appendChild(btn2);

    container.appendChild(div);
  }

  document.getElementById("semana-title").textContent = `🗓 Semana ${semanaAtual}`;
}

function selecionarVencedor(index, vencedor, btnV, btnP) {
  btnV.classList.add("selected");
  btnP.classList.remove("selected");
  resultadosSemana[index] = vencedor;
}

function proximaSemana() {
  const totalConfrontos = ranking.length / 2;

  const completos = resultadosSemana.filter(Boolean).length === totalConfrontos;
  if (!completos) {
    alert("Marque todos os vencedores antes de avançar!");
    return;
  }

  const novosRanking = [];
  const resumoSemana = [];

  for (let i = 0; i < ranking.length; i += 2) {
    const vencedor = resultadosSemana[i];
    const perdedor = ranking[i] === vencedor ? ranking[i + 1] : ranking[i];
    novosRanking.push(vencedor);
    novosRanking.push(perdedor);

    resumoSemana.push(`${vencedor} venceu ${perdedor}`);
  }

  ranking = [...novosRanking];

  historico.push({
    semana: semanaAtual,
    confrontos: resumoSemana
  });

  atualizarRankingVisual();
  renderHistorico();

  semanaAtual++;
  if (semanaAtual > totalSemanas) {
    alert("Torneio finalizado!");
    document.getElementById("semana-title").textContent = `✅ Torneio Finalizado`;
    document.getElementById("confrontos").innerHTML = "";
    document.getElementById("proxima-semana").style.display = "none";
    return;
  }

  gerarConfrontos();
}

function renderHistorico() {
  const div = document.getElementById("historico");
  div.innerHTML = "";

  historico.forEach(h => {
    const semanaDiv = document.createElement("div");
    semanaDiv.innerHTML = `<strong>Semana ${h.semana}:</strong><br>${h.confrontos.join("<br>")}`;
    div.appendChild(semanaDiv);
  });
}

// Inicialização
atualizarRankingVisual();
gerarConfrontos();
