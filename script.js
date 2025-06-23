// Dados das alianças - Adicione o 'world'
const aliancasOriginal = [
    { nome: "Aliança Alpha", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "Legião Beta", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "Guerreiros Gamma", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "Clã Delta", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "Força Épsilon", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "Vanguard Omega", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "Sentinelas Orion", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "Destruidores Zeta", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "União Sigma", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "Guardiões Rho", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "Templários Tau", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "Mestres Phi", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "Ascensão Chi", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "Cruzados Psi", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "Fênix Ómicron", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "Defensores Kappa", vit: 0, der: 0, pts: 0, world: "#104" },
];

let aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
let duelosRealizados = {};
let semanas = 4;
let duelosPorSemana = 8;
let currentWeek = 1; // Nova variável para a semana atual

document.addEventListener('DOMContentLoaded', () => {
    inicializarTorneio();
});

function inicializarTorneio() {
    gerarDuelos(); // Gera todos os duelos
    mostrarSemanaAtual(); // Exibe apenas a semana inicial
    atualizarRanking();
}

function resetarTorneio() {
    aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
    duelosRealizados = {};
    currentWeek = 1; // Reseta para a primeira semana

    // Limpa os elementos HTML dos duelos de todas as semanas
    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        weekContainer.innerHTML = '';
        // Garante que todos os módulos de semana estejam ocultos antes de exibir a primeira
        document.getElementById(`week-${s}`).classList.add('hidden-week');
    }
    // Oculta o rank final também, se ele for um módulo separado
    document.getElementById('final-ranking').classList.add('hidden-week');


    inicializarTorneio(); // Reutiliza a função de inicialização
}

/**
 * Controla a visibilidade dos módulos de semana.
 * Apenas a 'currentWeek' e o rank final (se for o caso) são visíveis.
 */
function mostrarSemanaAtual() {
    for (let s = 1; s <= semanas; s++) {
        const weekModule = document.getElementById(`week-${s}`);
        if (s === currentWeek) {
            weekModule.classList.remove('hidden-week');
        } else {
            weekModule.classList.add('hidden-week');
        }
    }
    // O ranking final só é visível na última semana ou após todas as semanas
    const finalRankingModule = document.getElementById('final-ranking');
    if (currentWeek > semanas) { // Se todas as semanas foram concluídas
        finalRankingModule.classList.remove('hidden-week');
    } else {
        finalRankingModule.classList.add('hidden-week');
    }
}


function gerarDuelos() {
    const duelosGeradosGlobal = new Set();

    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        // A limpeza de innerHTML já é feita pelo resetarTorneio() antes de chamar esta função,
        // mas é bom garantir que não haja acúmulo de duelos caso esta função seja chamada de outra forma.
        // weekContainer.innerHTML = ''; // Não necessário aqui, pois resetarTorneio já limpa

        let aliancasDisponiveisParaDuelo = [...aliancas];
        let duelosSemanaAtual = 0;
        let aliancasJaDuelaramNestaSemana = new Set();

        aliancasDisponiveisParaDuelo.sort(() => Math.random() - 0.5);

        while (duelosSemanaAtual < duelosPorSemana && aliancasDisponiveisParaDuelo.length >= 2) {
            let alianca1 = null;
            let alianca2 = null;
            let indexAlianca1 = -1;
            let currentDueloKey = '';

            for (let i = 0; i < aliancasDisponiveisParaDuelo.length; i++) {
                if (!aliancasJaDuelaramNestaSemana.has(aliancasDisponiveisParaDuelo[i].nome)) {
                    alianca1 = aliancasDisponiveisParaDuelo[i];
                    indexAlianca1 = i;
                    break;
                }
            }

            if (!alianca1) {
                break;
            }

            let foundAlianca2 = false;
            let tempAliancasParaAlianca2 = [...aliancasDisponiveisParaDuelo].filter(a => a.nome !== alianca1.nome);
            tempAliancasParaAlianca2.sort(() => Math.random() - 0.5);

            for (let i = 0; i < tempAliancasParaAlianca2.length; i++) {
                const potentialAlianca2 = tempAliancasParaAlianca2[i];

                if (aliancasJaDuelaramNestaSemana.has(potentialAlianca2.nome)) {
                    continue;
                }

                const tempKey = [alianca1.nome, potentialAlianca2.nome].sort().join('-');
                
                if (!duelosGeradosGlobal.has(tempKey)) {
                    alianca2 = potentialAlianca2;
                    currentDueloKey = tempKey;
                    foundAlianca2 = true;
                    break;
                }
            }

            if (!foundAlianca2) {
                aliancasDisponiveisParaDuelo.splice(indexAlianca1, 1);
                continue;
            }

            duelosGeradosGlobal.add(currentDueloKey);

            const matchElement = criarElementoDuelo(s, alianca1, alianca2);
            weekContainer.appendChild(matchElement);
            duelosSemanaAtual++;

            aliancasJaDuelaramNestaSemana.add(alianca1.nome);
            aliancasJaDuelaramNestaSemana.add(alianca2.nome);

            aliancasDisponiveisParaDuelo = aliancasDisponiveisParaDuelo.filter(
                a => a.nome !== alianca1.nome && a.nome !== alianca2.nome
            );
        }
    }
}

function criarElementoDuelo(semana, alianca1, alianca2) {
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match');
    matchDiv.innerHTML = `
        <p>${alianca1.nome} vs ${alianca2.nome}</p>
        <button onclick="registrarVencedor(${semana}, '${alianca1.nome}', '${alianca2.nome}', '${alianca1.nome}', this)">${alianca1.nome} <span class="alliance-world-card-inline">${alianca1.world}</span></button>
        <button onclick="registrarVencedor(${semana}, '${alianca1.nome}', '${alianca2.nome}', '${alianca2.nome}', this)">${alianca2.nome} <span class="alliance-world-card-inline">${alianca2.world}</span></button>
    `;
    return matchDiv;
}

function registrarVencedor(semana, aliancaNome1, aliancaNome2, vencedorNome, clickedButton) {
    const dueloKey = [aliancaNome1, aliancaNome2].sort().join('-');
    const weekId = `week-${semana}`;

    if (!duelosRealizados[weekId]) {
        duelosRealizados[weekId] = {};
    }

    if (duelosRealizados[weekId][dueloKey] !== undefined) {
        return;
    }

    const parentDiv = clickedButton.closest('.match');
    const buttons = parentDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    clickedButton.classList.add('selected-winner');

    const aliancaVencedora = aliancas.find(a => a.nome === vencedorNome);
    const aliancaPerdedora = aliancas.find(a => a.nome === (vencedorNome === aliancaNome1 ? aliancaNome2 : aliancaNome1));

    if (aliancaVencedora) {
        aliancaVencedora.vit++;
        aliancaVencedora.pts += 3;
    }
    if (aliancaPerdedora) {
        aliancaPerdedora.der++;
        aliancaPerdedora.pts += 1;
    }

    duelosRealizados[weekId][dueloKey] = vencedorNome;

    atualizarRanking();

    // Verifica se todos os duelos da semana atual foram concluídos
    if (semana === currentWeek) {
        const weekMatchesContainer = document.getElementById(`week-${currentWeek}`).querySelector('.matches');
        const totalMatchesInWeek = weekMatchesContainer.querySelectorAll('.match').length;
        const completedMatchesInWeek = Object.keys(duelosRealizados[`week-${currentWeek}`] || {}).length;

        if (completedMatchesInWeek === totalMatchesInWeek) {
            // Se todos os duelos desta semana foram concluídos, avança para a próxima
            currentWeek++;
            mostrarSemanaAtual(); // Mostra a próxima semana ou o rank final
        }
    }
}

function atualizarRanking() {
    aliancas.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.vit !== a.vit) return b.vit - a.vit;
        return a.der - b.der;
    });

    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    aliancas.forEach((alianca, index) => {
        const li = document.createElement('li');
        const rank = index + 1;
        li.setAttribute('data-rank', rank);

        let trophyHtml = '';
        if (rank === 1) {
            trophyHtml = '<i class="fas fa-trophy trophy gold"></i>';
        } else if (rank === 2) {
            trophyHtml = '<i class="fas fa-trophy trophy silver"></i>';
        } else if (rank === 3) {
            trophyHtml = '<i class="fas fa-trophy trophy bronze"></i>';
        }

        const maxVitorias = Math.max(...aliancas.map(a => a.vit), 1);
        let barWidth = (alianca.vit / maxVitorias) * 100;
        
        if (barWidth < 10 && alianca.vit > 0) barWidth = 10;
        else if (alianca.vit === 0) barWidth = 0;

        li.style.setProperty('--bar-width', `${barWidth}%`);

        li.innerHTML = `
            ${trophyHtml}
            <span class="rank-position">${rank}</span>
            <span class="alliance-name-wrapper">
                <span class="alliance-name">${alianca.nome}</span>
                <span class="alliance-world-card">${alianca.world}</span>
            </span>
            <span class="alliance-stats">V: ${alianca.vit} D: ${alianca.der} P: ${alianca.pts}</span>
        `;
        rankingList.appendChild(li);
    });
}
