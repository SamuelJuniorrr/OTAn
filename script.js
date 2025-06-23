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
let currentWeek = 1;

// Novo: Armazenamento global para o HTML dos duelos de cada semana
let allGeneratedMatchesHTML = {}; 

document.addEventListener('DOMContentLoaded', () => {
    inicializarTorneio();
});

function inicializarTorneio() {
    gerarDuelos(); // Gera e armazena todos os duelos internamente
    exibirDuelosDaSemana(currentWeek); // Exibe apenas os duelos da semana inicial
    atualizarRanking();
    
    // Oculta o rank final e garante que os módulos de semana estejam visíveis, mas com duelos vazios inicialmente para semanas futuras
    document.getElementById('final-ranking').classList.add('hidden-module'); // Nova classe para ocultar
    for(let s = 1; s <= semanas; s++) {
        document.getElementById(`week-${s}`).classList.remove('hidden-module'); // Garante visibilidade do card
        if (s > currentWeek) {
            document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = ''; // Limpa duelos de semanas futuras
        }
    }
}

function resetarTorneio() {
    aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
    duelosRealizados = {};
    currentWeek = 1;
    allGeneratedMatchesHTML = {}; // Reseta os duelos armazenados

    // Limpa todos os containers de duelos
    for (let s = 1; s <= semanas; s++) {
        document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
    }
    
    // Oculta o rank final novamente
    document.getElementById('final-ranking').classList.add('hidden-module'); 

    inicializarTorneio(); // Re-inicializa o torneio
}

/**
 * Gera todos os duelos para todas as semanas e os armazena em `allGeneratedMatchesHTML`.
 * Não insere no DOM neste momento.
 */
function gerarDuelos() {
    const duelosGeradosGlobal = new Set();
    // Inicializa a estrutura para armazenar os duelos de cada semana
    for (let s = 1; s <= semanas; s++) {
        allGeneratedMatchesHTML[s] = []; 
    }

    for (let s = 1; s <= semanas; s++) {
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

            // Armazena o HTML do duelo para ser inserido no DOM posteriormente
            const matchElementHTML = criarElementoDueloHTML(s, alianca1, alianca2); 
            allGeneratedMatchesHTML[s].push(matchElementHTML);
            
            duelosSemanaAtual++;

            aliancasJaDuelaramNestaSemana.add(alianca1.nome);
            aliancasJaDuelaramNestaSemana.add(alianca2.nome);

            aliancasDisponiveisParaDuelo = aliancasDisponiveisParaDuelo.filter(
                a => a.nome !== alianca1.nome && a.nome !== alianca2.nome
            );
        }
    }
}

/**
 * Cria e retorna a string HTML de um duelo.
 * As funções `onclick` são configuradas para chamar `registrarVencedor`.
 */
function criarElementoDueloHTML(semana, alianca1, alianca2) {
    // Escapa aspas simples nos nomes para uso seguro no atributo onclick
    const alianca1NameEscaped = alianca1.nome.replace(/'/g, "\\'");
    const alianca2NameEscaped = alianca2.nome.replace(/'/g, "\\'");

    return `
        <div class="match">
            <p>${alianca1.nome} vs ${alianca2.nome}</p>
            <button onclick="registrarVencedor(${semana}, '${alianca1NameEscaped}', '${alianca2NameEscaped}', '${alianca1NameEscaped}', this)">${alianca1.nome} <span class="alliance-world-card-inline">${alianca1.world}</span></button>
            <button onclick="registrarVencedor(${semana}, '${alianca1NameEscaped}', '${alianca2NameEscaped}', '${alianca2NameEscaped}', this)">${alianca2.nome} <span class="alliance-world-card-inline">${alianca2.world}</span></button>
        </div>
    `;
}

/**
 * Insere os duelos de uma semana específica no DOM e limpa as demais semanas.
 */
function exibirDuelosDaSemana(weekNum) {
    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        weekContainer.innerHTML = ''; // Limpa quaisquer duelos existentes

        if (s === weekNum) {
            // Insere os duelos da semana atual
            if (allGeneratedMatchesHTML[weekNum]) {
                allGeneratedMatchesHTML[weekNum].forEach(matchHTML => {
                    weekContainer.innerHTML += matchHTML;
                });
            }
        }
        // As semanas futuras já são limpas em inicializarTorneio/resetarTorneio
        // para garantir que estejam vazias se não forem a currentWeek
    }
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

    // Verifica se todos os duelos da *semana ativa atual* foram concluídos
    const totalMatchesInCurrentWeek = allGeneratedMatchesHTML[currentWeek] ? allGeneratedMatchesHTML[currentWeek].length : 0;
    const completedMatchesInCurrentWeek = Object.keys(duelosRealizados[`week-${currentWeek}`] || {}).length;

    if (completedMatchesInCurrentWeek === totalMatchesInCurrentWeek) {
        // Se todos os duelos da semana ativa foram concluídos, avança para a próxima
        if (currentWeek < semanas) {
            currentWeek++;
            exibirDuelosDaSemana(currentWeek); // Exibe os duelos da próxima semana
        } else {
            // Todas as semanas foram concluídas, exibe o ranking final
            document.getElementById('final-ranking').classList.remove('hidden-module');
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
