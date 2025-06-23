// Variáveis globais
let ranking = [];
let semanaAtual = 1;
const totalSemanas = 4;
let resultadosSemana = [];
let historico = [];
let posicoesAntigas = [];
let trajetoriaOTAn = [];

// DOM
const rankingInputsDiv = document.getElementById("ranking-inputs");
const rankingForm = document.getElementById("ranking-form");
const rankingContainer = document.getElementById("ranking-container");
const rankingList = document.getElementById("ranking-list");
const semanaTitle = document.getElementById("semana-title");
const confrontosDiv = document.getElementById("confrontos");
const simulacaoContainer = document.getElementById("simulacao-container");
const rankingPrevisto = document.getElementById("ranking-previsto");
const verificarRankingBtn = document.getElementById("verificar-ranking");
const historicoContainer = document.getElementById("historico-container");
const historicoDiv = document.getElementById("historico");
const graficoContainer = document.getElementById("grafico-container");

const ctxGrafico = document.getElementById("grafico-otan").getContext("2d");
let graficoOTAn;

// Função para criar inputs do ranking inicial
function criarInputsRanking() {
  rankingInputsDiv.innerHTML = "";
  for(let i = 1; i <= 16; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Posição ${i}`;
    input.required = true;
    input.maxLength = 20;
    input.autocomplete = "off";
    input.dataset.pos = i;
    rankingInputsDiv.appendChild(input);
  }
}

// Inicializa inputs no carregamento
criarInputsRanking();

// Evento ao enviar o ranking inicial
rankingForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // Ler os valores digitados e montar o ranking
  const inputs = rankingInputsDiv.querySelectorAll("input");
  let nomes = [];
  for (let inp of inputs) {
    let nome = inp.value.trim();
    if(nome === "") {
      alert("Preencha todas as posições do ranking.");
      return;
    }
    nomes.push(nome);
  }

  ranking = nomes;
  posicoesAntigas = [...ranking];
  trajetoriaOTAn = [ranking.indexOf("OTAn") + 1]; // posição inicial OTAn
  semanaAtual = 1;
  resultadosSemana = [];
  historico = [];

  // Oculta o form e mostra a área principal
  document.getElementById("input-container").classList.add("hidden");
  rankingContainer.classList.remove("hidden");
  semanaTitle.textContent = `🗓 Semana ${semanaAtual}`;
  document.getElementById("semana-info").classList.remove("hidden");
  confrontosDiv.classList.remove("hidden");
  verificarRankingBtn.classList.remove("hidden");
  historicoContainer.classList.remove("hidden");
  graficoContainer.classList.add("hidden");

  atualizarRankingVisual();
  gerarConfrontos();
});

// Atualiza visual do ranking com destaque e setas de subida/descida
function atualizarRankingVisual(prevRanking) {
  rankingList.innerHTML = "";
  for (let i = 0; i < ranking.length; i++) {
    const li = document.createElement("li");
    li.textContent = ranking[i];
    if (ranking[i].toUpperCase() === "OTAN") {
      li.classList.add("otan");
    }
    if (prevRanking) {
      const posAntiga = prevRanking.indexOf(ranking[i]);
      if (posAntiga > i) li.classList.add("subiu");
      else if (posAntiga < i) li.classList.add("desceu");
    }
    rankingList.appendChild(li);
  }
}

// Gera confrontos pares para a semana atual
function gerarConfrontos() {
  confrontosDiv.innerHTML = "";
  resultadosSemana = [];

  for (let i = 0; i < ranking.length; i += 2) {
    const alianca1 = ranking[i];
    const alianca2 = ranking[i + 1];

    const div = document.createElement("div");
    div.className = "confronto";
    div.dataset.index = i;

    const btn1 = document.createElement("button");
    btn1.textContent = alianca1;
    btn1.onclick = () => selecionarVencedor(i, alianca1, btn1, btn2);
    if (alianca1.toUpperCase() === "OTAN") btn1.classList.add("otan");

    const btn2 = document.createElement("button");
    btn2.textContent = alianca2;
    btn2.onclick = () => selecionarVencedor(i, alianca2, btn2, btn1);
    if (alianca2.toUpperCase() === "OTAN") btn2.classList.add("otan");

    div.appendChild(btn1);
    div.appendChild(document.createTextNode(" vs "));
    div.appendChild(btn2);

    confrontosDiv.appendChild(div);
  }
}

// Marca o vencedor e desmarca o outro
function selecionarVencedor(index, vencedor, btnV, btnP) {
  btnV.classList.add("selected");
  btnP.classList.remove("selected");
  resultadosSemana[index] = vencedor;
}

// Simula o ranking previsto com base nos vencedores selecionados
function simularRanking() {
  const totalConfrontos = ranking.length / 2;
  if (resultadosSemana.filter(Boolean).length !== totalConfrontos) {
    alert("Marque todos os vencedores para simular.");
    return;
  }

  // Cria ranking previsto com vencedores subindo na frente dos perdedores
  let rankingPrevistoArr = [];
  for (let i = 0; i < ranking.length; i += 2) {
    const vencedor = resultadosSemana[i];
    const perdedor = ranking[i] === vencedor ? ranking[i + 1] : ranking[i];
    rankingPrevistoArr.push(vencedor, perdedor);
  }

  // Atualiza UI simulação
  rankingPrevisto.innerHTML = "";
  rankingPrevistoArr.forEach((alianca, i) => {
    const li = document.createElement("li");
    li.textContent = alianca;
    if (alianca.toUpperCase() === "OTAN") li.classList.add("otan");
    // compara posições para setas
    const posAtual = ranking.indexOf(alianca);
    if (posAtual > i) li.classList.add("subiu");
    else if (posAtual < i) li.classList.add("desceu");
    rankingPrevisto.appendChild(li);
  });

  simulacaoContainer.classList.remove("hidden");
  verificarRankingBtn.style.display = "none";
}

// Confirma a simulação e avança a semana
function confirmarSemana() {
  // Recalcula ranking com base nos resultados da semana
  let rankingPrevistoArr = [];
  for (let i = 0; i < ranking.length; i += 2) {
    const vencedor = resultadosSemana[i];
    const perdedor = ranking[i] === vencedor ? ranking[i + 1] : ranking[i];
    rankingPrevistoArr.push(vencedor, perdedor);
  }

  historico.push({
    semana: semanaAtual,
    resultados: resultadosSemana.slice(),
    confrontos: [...ranking]
  });

  posicoesAntigas = [...ranking];
  ranking = [...rankingPrevistoArr];
  semanaAtual++;
  trajetoriaOTAn.push(ranking.indexOf("OTAn") + 1);

  // Atualiza visualizações
  atualizarRankingVisual(posicoesAntigas);
  gerarConfrontos();
  simulacaoContainer.classList.add("hidden");
  verificarRankingBtn.style.display = "block";
  semanaTitle.textContent = semanaAtual <= totalSemanas ? `🗓 Semana ${semanaAtual}` : "✅ Torneio Finalizado";

  renderHistorico();

  if (semanaAtual > totalSemanas) {
    // Finaliza torneio
    confrontosDiv.innerHTML = "";
    verificarRankingBtn.style.display = "none";
    desenharGraficoOTAn();
    graficoContainer.classList.remove("hidden");
  }
}

// Renderiza histórico de vitórias
function renderHistorico() {
  historicoDiv.innerHTML = "";
  historico.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>Semana ${item.semana}:</strong><br>`;
