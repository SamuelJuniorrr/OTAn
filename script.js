const rankingInputsDiv = document.getElementById("ranking-inputs");
const rankingForm = document.getElementById("ranking-form");
const rankingList = document.getElementById("ranking-list");
const confrontosContainer = document.getElementById("confrontos-container");
const semanaNumSpan = document.getElementById("semana-num");
const rankingPrevisto = document.getElementById("ranking-previsto");
const simulacaoRankingSection = document.getElementById("simulacao-ranking");
const btnConfirmarSemana = document.getElementById("btn-confirmar");
const historicoList = document.getElementById("historico-list");
const graficoOTAnSection = document.getElementById("grafico-otan-section");
const ctxGrafico = document.getElementById("grafico-otan").getContext("2d");

let ranking = [];
let resultadosSemana = [];
let historico = [];
let semanaAtual = 1;
const totalSemanas = 4;
let trajetoriaOTAn = [];
let graficoOTAn;

// Cria inputs para ranking inicial
function criarInputsRanking() {
  rankingInputsDiv.innerHTML = "";
  for(let i = 1; i <= 16; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Posição ${i}`;
    input.maxLength = 20;
    input.autocomplete = "off";
    rankingInputsDiv.appendChild(input);
  }
}
criarInputsRanking();

// Ao enviar ranking inicial
rankingForm.addEventListener("submit", e => {
  e.preventDefault();
  const inputs = rankingInputsDiv.querySelectorAll("input");
  const nomes = [];
  for (let inp of inputs) {
    const val = inp.value.trim();
    if(!val) {
      alert("Preencha todas as posições do ranking.");
      return;
    }
    nomes.push(val);
  }
  ranking = nomes;
  semanaAtual = 1;
  trajetoriaOTAn = [ranking.indexOf("OTAn") + 1];
  historico = [];
  resultadosSemana = [];

  document.getElementById("input-ranking").classList.add("hidden");
  document.getElementById("ranking-atual").classList.remove("hidden");
  document.getElementById("confrontos-semana").classList.remove("hidden");
  simulacaoRankingSection.classList.add("hidden");
  document.getElementById("historico-semanas").classList.remove("hidden");
  graficoOTAnSection.classList.add("hidden");

  atualizarRankingVisual();
  semanaNumSpan.textContent = `Semana ${semanaAtual}`;
  gerarConfrontos();
});

// Atualiza visual do ranking atual
function atualizarRankingVisual(prevRanking) {
  rankingList.innerHTML = "";
  ranking.forEach((alianca, i) => {
    const li = document.createElement("li");
    li.textContent = alianca;
    if(alianca.toUpperCase() === "OTAN") li.classList.add("otan");
    if(prevRanking) {
      const posAnterior = prevRanking.indexOf(alianca);
      if(posAnterior > i) li.classList.add("subiu");
      else if(posAnterior < i) li.classList.add("desceu");
    }
    rankingList.appendChild(li);
  });
}

// Gera cards dos confrontos da semana
function gerarConfrontos() {
  confrontosContainer.innerHTML = "";
  resultadosSemana = new Array(ranking.length / 2);

  for(let i = 0; i < ranking.length; i += 2) {
    const alianca1 = ranking[i];
    const alianca2 = ranking[i+1];

    const card = document.createElement("div");
    card.className = "card-confronto";

    const btn1 = document.createElement("div");
    btn1.className = "alianca-nome";
    btn1.textContent = alianca1;
    if(alianca1.toUpperCase() === "OTAN") btn1.classList.add("otan");
    btn1.onclick = () => selecionarVencedor(i/2, alianca1, btn1, btn2);

    const vsSpan = document.createElement("span");
    vsSpan.textContent = "vs";
    vsSpan.style.textAlign = "center";
    vsSpan.style.fontWeight = "700";
    vsSpan.style.color = "#00caff";

    const btn2 = document.createElement("div");
    btn2.className = "alianca-nome";
    btn2.textContent = alianca2;
    if(alianca2.toUpperCase() === "OTAN") btn2.classList.add("otan");
    btn2.onclick = () => selecionarVencedor(i/2, alianca2, btn2, btn1);

    card.appendChild(btn1);
    card.appendChild(vsSpan);
    card.appendChild(btn2);

    confrontosContainer.appendChild(card);
  }
}

// Marca vencedor visualmente
function selecionarVencedor(indexConfronto, vencedor, btnV, btnP) {
  btnV.classList.add("selected");
  btnP.classList.remove("selected");
  resultadosSemana[indexConfronto] = vencedor;
}

// Simula ranking previsto da próxima semana
function simularRanking() {
  if(resultadosSemana.filter(Boolean).length !== ranking.length / 2) {
    alert("Marque todos os vencedores para simular.");
    return;
  }

  let rankingPrevistoArr = [];

  for(let i = 0; i < resultadosSemana.length; i++) {
    // vencedor
    const vencedor = resultadosSemana[i];
    // perdedor é quem não foi vencedor no confronto i
    const idx1 = i * 2;
    const idx2 = idx1 + 1;
    const alianca1 = ranking[idx1];
    const alianca2 = ranking[idx2];
    const perdedor = (alianca1 === vencedor) ? alianca2 : alianca1;
    rankingPrevistoArr.push(vencedor, perdedor);
  }

  rankingPrevisto.innerHTML = "";
  rankingPrevistoArr.forEach((alianca, i) => {
    const li = document.createElement("li");
    li.textContent = alianca;
    if(alianca.toUpperCase() === "OTAN") li.classList.add("otan");
    const posAtual = ranking.indexOf(alianca);
    if(posAtual > i) li.classList.add("subiu");
    else if(posAtual < i) li.classList.add("desceu");
    rankingPrevisto.appendChild(li);
  });

  simulacaoRankingSection.classList.remove("hidden");
  btnConfirmarSemana.style.display = "block";
  btnConfirmarSemana.onclick = confirmarSemana;
}

// Confirma semana e atualiza ranking e histórico
function confirmarSemana() {
  let rankingPrevistoArr = [];

  for(let i = 0; i < resultadosSemana.length; i++) {
    const vencedor = resultadosSemana[i];
    const idx1 = i * 2;
    const idx2 = idx1 + 1;
    const alianca1 = ranking[idx1];
    const alianca2 = ranking[idx2];
    const perdedor = (alianca1 === vencedor) ? alianca2 : alianca1;
    rankingPrevistoArr.push(vencedor, perdedor);
  }

  historico.push({
    semana: semanaAtual,
    resultados: [...resultadosSemana],
    confrontos: [...ranking]
  });

  const rankingAnterior = [...ranking];
  ranking = [...rankingPrevistoArr];
  semanaAtual++;
  trajetoriaOTAn.push(ranking.indexOf("OTAn") + 1);

  atualizarRankingVisual(rankingAnterior);
  gerarConfrontos();
  simulacaoRankingSection.classList.add("hidden");

  if (semanaAtual <= totalSemanas) {
    semanaNumSpan.textContent = `Semana ${semanaAtual}`;
  } else {
    semanaNumSpan.textContent = "🏁 Torneio Finalizado";
    confrontosContainer.innerHTML = "";
    btnConfirmarSemana.style.display = "none";
    renderHistorico();
    desenharGraficoOTAn();
    graficoOTAnSection.classList.remove("hidden");
  }

  renderHistorico();
}

// Renderiza histórico das vitórias
function renderHistorico() {
  historicoList.innerHTML = "";
  historico.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>Semana ${item.semana}</strong><br>`;
    for(let i = 0; i < item.resultados.length; i++) {
      const vencedor = item.resultados[i];
      const idx = i * 2;
      const perdedor = item.confrontos[idx] === vencedor ? item.confrontos[idx + 1] : item.confrontos[idx];
      div.innerHTML += `${vencedor} venceu ${perdedor}<br>`;
    }
    historicoList.appendChild(div);
  });
}

// Desenha gráfico da trajetória OTAn
function desenharGraficoOTAn() {
  const labels = trajetoriaOTAn.map((_, i) => `Semana ${i + 1}`);
  const dadosInvertidos = trajetoriaOTAn.map(pos => 17 - pos);

  if (graficoOTAn) graficoOTAn.destroy();

  graficoOTAn = new Chart(ctxGrafico, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Posição OTAn (1º melhor)',
        data: dadosInvertidos,
        borderColor: '#ffd700',
        backgroundColor: '#ffd700',
        fill: false,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        pointBackgroundColor: '#ffd700',
        pointBorderColor: '#fff'
      }]
    },
    options: {
      scales: {
        y: {
          reverse: true,
          min: 1,
          max: 16,
          ticks: {
            stepSize: 1,
            color: '#00ffc8'
          },
          grid: {
            color: '#333'
          },
          title: {
            display: true,
            text: 'Posição',
            color: '#00ffc8',
            font: { size: 14 }
          }
        },
        x: {
          ticks: {
            color: '#00ffc8'
          },
          grid: {
            color: '#333'
          },
          title: {
            display: true,
            text: 'Semana',
            color: '#00ffc8',
            font: { size: 14 }
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffd700'
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#222',
          titleColor: '#ffd700',
          bodyColor: '#e0e0e0'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Eventos extras: simular quando algum botão de confronto for clicado
document.getElementById("confrontos-container").addEventListener("click", simularRanking);
