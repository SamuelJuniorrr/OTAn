const aliançasIniciais = [
  "OTAn", "AZ", "AB", "AC",
  "AD", "AE", "AF", "AG",
  "AH", "AI", "AJ", "AK",
  "AL", "AM", "AN", "AO"
];

let ranking = [...aliançasIniciais];
let semanaAtual = 1;
const totalSemanas = 4;
let resultadosSemana = []; // Armazena vencedores da semana

function atualizarRankingVisual() {
  const ul = document.getElementById("ranking-list");
  ul.innerHTML = "";
  ranking.forEach((alianca, index) => {
    const li = document.createElement("li");
    li.textContent = alianca;
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

    const btn2 = document.createElement("button");
    btn2.textContent = a2;
    btn2.onclick = () => selecionarVencedor(i, a2, btn2, btn1);

    div.appendChild(btn1);
    div.appendChild(document.createTextNode("vs"));
    div.appendChild(btn2);

    container.appendChild(div);
  }

  document.getElementById("semana-title").textContent = `Semana ${semanaAtual}`;
}

function selecionarVencedor(index, vencedor, btnVencedor, btnPerdedor) {
  btnVencedor.classList.add("selected");
  btnPerdedor.classList.remove("selected");
  resultadosSemana[index] = vencedor;
}

function proximaSemana() {
  const totalConfrontos = ranking.length / 2;

  // Verifica se todos os confrontos foram marcados
  const completos = resultadosSemana.filter(Boolean).length === totalConfrontos;
  if (!completos) {
    alert("Marque todos os vencedores antes de avançar!");
    return;
  }

  // Atualiza o ranking:
  const novosRanking = [];
  for (let i = 0; i < ranking.length; i += 2) {
    const vencedor = resultadosSemana[i];
    const perdedor = ranking[i] === vencedor ? ranking[i + 1] : ranking[i];
    novosRanking.push(vencedor);
    novosRanking.push(perdedor);
  }

  ranking = [...novosRanking];

  atualizarRankingVisual();
  semanaAtual++;

  if (semanaAtual > totalSemanas) {
    alert("Torneio finalizado!");
    document.getElementById("semana-title").textContent = `Torneio Finalizado`;
    document.getElementById("confrontos").innerHTML = "";
    document.getElementById("proxima-semana").style.display = "none";
    return;
  }

  gerarConfrontos();
}

// Inicializa
atualizarRankingVisual();
gerarConfrontos();
 
