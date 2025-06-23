// Dados iniciais das alianças
const aliancasOriginal = [
    { nome: "4oLK", vit: 0, der: 0, pts: 0, world: "#99" },
    { nome: "Swr", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "DEEP", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "SAV2", vit: 0, der: 0, pts: 0, world: "#97" },
    { nome: "TEGs", vit: 0, der: 0, pts: 0, world: "#99" },
    { nome: "HGZ", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "RICO", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "MEH.", vit: 0, der: 0, pts: 0, world: "#97" },
    { nome: "BP-2", vit: 0, der: 0, pts: 0, world: "#100" },
    { nome: "TWID", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "ESP^", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "LPD", vit: 0, der: 0, pts: 0, world: "#98" },
    { nome: "JH4", vit: 0, der: 0, pts: 0, world: "#100" },
    { nome: "OTAn", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "VNL", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "SA7", vit: 0, der: 0, pts: 0, world: "#98" },
];

// Define a estrutura de chaveamento (bracket) para um torneio de 16 equipes em 4 semanas,
// para determinar todas as 16 posições.
// Cada partida é identificada por um ID único (ex: W1M1 para Semana 1, Partida 1).
// Os participantes são nomes de alianças (Semana 1) ou referências a resultados de partidas anteriores (WIN/LOSE).
const tournamentBracket = {
    1: [ // Semana 1: 8 partidas iniciais
        { id: "W1M1", teams: ["4oLK", "Swr"] },
        { id: "W1M2", teams: ["DEEP", "SAV2"] },
        { id: "W1M3", teams: ["TEGs", "HGZ"] },
        { id: "W1M4", teams: ["RICO", "MEH."] },
        { id: "W1M5", teams: ["BP-2", "TWID"] },
        { id: "W1M6", teams: ["ESP^", "LPD"] },
        { id: "W1M7", teams: ["JH4", "OTAn"] },
        { id: "W1M8", teams: ["VNL", "SA7"] },
    ],
    2: [ // Semana 2: Vencedores vs Vencedores, Perdedores vs Perdedores (8 partidas)
        // Caminho dos Vencedores da Semana 1
        { id: "W2M1", teams: ["W1M1_WIN", "W1M2_WIN"] }, // Vencedor W1M1 vs Vencedor W1M2
        { id: "W2M2", teams: ["W1M3_WIN", "W1M4_WIN"] },
        { id: "W2M3", teams: ["W1M5_WIN", "W1M6_WIN"] },
        { id: "W2M4", teams: ["W1M7_WIN", "W1M8_WIN"] },
        // Caminho dos Perdedores da Semana 1
        { id: "W2M5", teams: ["W1M1_LOSE", "W1M2_LOSE"] },
        { id: "W2M6", teams: ["W1M3_LOSE", "W1M4_LOSE"] },
        { id: "W2M7", teams: ["W1M5_LOSE", "W1M6_LOSE"] },
        { id: "W2M8", teams: ["W1M7_LOSE", "W1M8_LOSE"] },
    ],
    3: [ // Semana 3: (8 partidas para filtrar para as classificações finais)
        // Caminho para 1º-4º lugares (vencedores de W2M1-W2M4)
        { id: "W3M1", teams: ["W2M1_WIN", "W2M2_WIN"] }, // Leva ao jogo de 1º/2º lugar
        { id: "W3M2", teams: ["W2M3_WIN", "W2M4_WIN"] }, // Leva ao jogo de 1º/2º lugar
        // Caminho para 5º-8º lugares (perdedores de W2M1-W2M4 jogando vencedores de W2M5-W2M8)
        // Este é um caminho comum para preencher um chaveamento de consolação para 16 equipes.
        { id: "W3M3", teams: ["W2M1_LOSE", "W2M5_WIN"] }, // Perdedor W2M1 vs Vencedor W2M5
        { id: "W3M4", teams: ["W2M2_LOSE", "W2M6_WIN"] },
        { id: "W3M5", teams: ["W2M3_LOSE", "W2M7_WIN"] },
        { id: "W3M6", teams: ["W2M4_LOSE", "W2M8_WIN"] },
        // Caminho para 9º-12º lugares (perdedores de W2M5-W2M8 jogando vencedores de W3M7-W3M8)
        { id: "W3M7", teams: ["W2M5_LOSE", "W2M6_LOSE"] },
        { id: "W3M8", teams: ["W2M7_LOSE", "W2M8_LOSE"] },
    ],
    4: [ // Semana 4: Partidas Finais de Classificação (8 partidas)
        // Partida de 1º Lugar
        { id: "W4M1", teams: ["W3M1_WIN", "W3M2_WIN"] },
        // Partida de 3º Lugar
        { id: "W4M2", teams: ["W3M1_LOSE", "W3M2_LOSE"] },
        // Partida de 5º Lugar
        { id: "W4M3", teams: ["W3M3_WIN", "W3M4_WIN"] },
        // Partida de 7º Lugar
        { id: "W4M4", teams: ["W3M3_LOSE", "W3M4_LOSE"] },
        // Partida de 9º Lugar
        { id: "W4M5", teams: ["W3M5_WIN", "W3M6_WIN"] },
        // Partida de 11º Lugar
        { id: "W4M6", teams: ["W3M5_LOSE", "W3M6_LOSE"] },
        // Partida de 13º Lugar
        { id: "W4M7", teams: ["W3M7_WIN", "W3M8_WIN"] },
        // Partida de 15º Lugar
        { id: "W4M8", teams: ["W3M7_LOSE", "W3M8_LOSE"] },
    ]
};

// Variáveis de estado do torneio
let aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
// duelosRealizados agora armazena resultados por matchId, e inclui vencedor/perdedor
let duelosRealizados = {}; // { "week-1": { "W1M1": { winner: "AllianceX", loser: "AllianceY" } }, ... }
let semanas = Object.keys(tournamentBracket).length; // Número total de semanas baseado na chave
let duelosPorSemana = aliancasOriginal.length / 2; // (16 alianças / 2 = 8 duelos)
let currentWeek = 1; // A semana atual ativa para registro de resultados

// Armazenamento global para o HTML dos duelos de CADA semana (populado dinamicamente)
let allGeneratedMatchesHTML = {};

document.addEventListener('DOMContentLoaded', () => {
    // Limpa o localStorage ao carregar a página para sempre iniciar do zero
    localStorage.clear(); 
    
    carregarEstado(); 
    inicializarTorneio(); 
});

/**
 * Salva o estado atual do torneio no localStorage.
 */
function salvarEstado() {
    try {
        localStorage.setItem('aliancas', JSON.stringify(aliancas));
        localStorage.setItem('duelosRealizados', JSON.stringify(duelosRealizados));
        localStorage.setItem('currentWeek', currentWeek.toString());
    } catch (e) {
        console.error("Erro ao salvar estado no localStorage:", e);
        alert("Não foi possível salvar o progresso do torneio no seu navegador. Por favor, verifique as configurações de privacidade ou espaço de armazenamento.");
    }
}

/**
 * Carrega o estado do torneio do localStorage.
 */
function carregarEstado() {
    try {
        const savedAliancas = localStorage.getItem('aliancas');
        const savedDuelosRealizados = localStorage.getItem('duelosRealizados');
        const savedCurrentWeek = localStorage.getItem('currentWeek');

        if (savedAliancas && savedDuelosRealizados && savedCurrentWeek) {
            aliancas = JSON.parse(savedAliancas);
            duelosRealizados = JSON.parse(savedDuelosRealizados);
            currentWeek = parseInt(savedCurrentWeek);
            
            // Reconstruir allGeneratedMatchesHTML a partir de duelosRealizados para semanas já jogadas
            for (let s = 1; s <= currentWeek; s++) {
                // Se a semana tem duelos definidos na bracket e ainda não foi gerada
                if (tournamentBracket[s] && !allGeneratedMatchesHTML[s]) {
                    gerarDuelosParaSemana(s); 
                }
            }

        } else {
            // Se não houver estado salvo ou erro, inicializa com dados originais
            aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
            duelosRealizados = {};
            currentWeek = 1;
        }
    } catch (e) {
        console.error("Erro ao carregar estado do localStorage:", e);
        alert("Não foi possível carregar o progresso do torneio. Iniciando um novo torneio.");
        aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
        duelosRealizados = {};
        currentWeek = 1;
    }
}

/**
 * Inicializa ou reinicializa o torneio, populando duelos e restaurando estados.
 */
function inicializarTorneio() {
    document.getElementById('final-ranking').classList.add('hidden-module');

    for (let s = 1; s <= semanas; s++) {
        const weekContainerElement = document.getElementById(`week-${s}`);
        const matchesContainer = weekContainerElement.querySelector('.matches');
        matchesContainer.innerHTML = ''; // Limpa o conteúdo de duelos anterior

        if (s <= currentWeek) {
            // Gera ou regenera o HTML dos duelos para a semana atual e semanas passadas
            // Esta chamada preenche 'allGeneratedMatchesHTML[s]'
            gerarDuelosParaSemana(s); 

            // Adiciona o HTML gerado ao DOM
            if (allGeneratedMatchesHTML[s]) {
                allGeneratedMatchesHTML[s].forEach(matchHTML => {
                    matchesContainer.innerHTML += matchHTML;
                });
            }
            restaurarEstadoDuelos(s); // Restaura o estado para os duelos populados
        }
        weekContainerElement.classList.remove('hidden-module'); // Garante que o card da semana esteja visível
    }

    if (currentWeek > semanas) {
        document.getElementById('final-ranking').classList.remove('hidden-module');
    }

    atualizarRanking();
}

/**
 * Reseta o estado completo do torneio para o início e limpa o localStorage.
 */
function resetarTorneio() {
    aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
    duelosRealizados = {};
    currentWeek = 1;
    allGeneratedMatchesHTML = {}; 

    localStorage.clear(); 

    for (let s = 1; s <= semanas; s++) {
        document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
    }
    
    document.getElementById('final-ranking').classList.add('hidden-module'); 

    inicializarTorneio(); 
    salvarEstado(); 
}

/**
 * Resolve o nome de uma aliança a partir de uma referência no bracket (ex: "W1M1_WIN").
 * @param {string} ref A string de referência (nome da aliança ou "MATCHID_RESULT").
 * @returns {object|null} O objeto da aliança correspondente ou null se não for encontrada/resolvida.
 */
function resolveParticipant(ref) {
    // Se é um nome de aliança direto
    if (!ref.includes("_")) {
        return aliancas.find(a => a.nome === ref);
    }

    const [prevMatchId, type] = ref.split('_'); // Ex: "W1M1", "WIN"
    const prevWeek = parseInt(prevMatchId.substring(1, 2)); // Ex: 1 de "W1M1"
    const prevWeekId = `week-${prevWeek}`;

    // Busca o resultado da partida anterior
    if (duelosRealizados[prevWeekId] && duelosRealizados[prevWeekId][prevMatchId]) {
        const result = duelosRealizados[prevWeekId][prevMatchId];
        const participantName = (type === "WIN") ? result.winner : result.loser;
        return aliancas.find(a => a.nome === participantName);
    }
    return null; // Partida anterior não jogada ou dados ausentes
}

/**
 * Gera os duelos para uma semana específica com base na estrutura do bracket.
 * @param {number} weekNum O número da semana.
 */
function gerarDuelosParaSemana(weekNum) {
    let duelosGeradosParaEstaSemana = [];
    const matchesForThisWeek = tournamentBracket[weekNum];

    if (!matchesForThisWeek) {
        console.warn(`Nenhuma definição de bracket para a Semana ${weekNum}`);
        return;
    }

    matchesForThisWeek.forEach(matchDef => {
        const alianca1 = resolveParticipant(matchDef.teams[0]);
        const alianca2 = resolveParticipant(matchDef.teams[1]);

        // Apenas gera o duelo se ambos os participantes puderem ser resolvidos.
        // Isso impede que duelos de semanas futuras apareçam se suas dependências não foram jogadas.
        if (alianca1 && alianca2) {
            const matchHTML = criarElementoDueloHTML(weekNum, matchDef.id, alianca1, alianca2);
            duelosGeradosParaEstaSemana.push(matchHTML);
        } else {
            // Se um participante não pode ser resolvido (ex: partida anterior não jogada),
            // não geramos o HTML para este duelo ainda. Ele será gerado quando as dependências forem resolvidas.
            console.log(`Duelo ${matchDef.id} (Semana ${weekNum}) não gerado: participantes não resolvidos (${matchDef.teams[0]}, ${matchDef.teams[1]})`);
        }
    });
    allGeneratedMatchesHTML[weekNum] = duelosGeradosParaEstaSemana; // Armazena os duelos gerados para esta semana
}

/**
 * Cria e retorna a string HTML de um duelo.
 * Adiciona atributos `data-` para facilitar a restauração do estado e identificação do duelo.
 */
function criarElementoDueloHTML(semana, matchId, alianca1, alianca2) {
    const alianca1NameEscaped = alianca1.nome.replace(/'/g, "\\'");
    const alianca2NameEscaped = alianca2.nome.replace(/'/g, "\\'");

    return `
        <div class="match" data-semana="${semana}" data-match-id="${matchId}" data-alianca1="${alianca1NameEscaped}" data-alianca2="${alianca2NameEscaped}">
            <p>${alianca1.nome} vs ${alianca2.nome}</p>
            <button onclick="registrarVencedor(${semana}, '${matchId}', '${alianca1NameEscaped}', '${alianca2NameEscaped}', '${alianca1NameEscaped}', this)">${alianca1.nome} <span class="alliance-world-card-inline">${alianca1.world}</span></button>
            <button onclick="registrarVencedor(${semana}, '${matchId}', '${alianca1NameEscaped}', '${alianca2NameEscaped}', '${alianca2NameEscaped}', this)">${alianca2.nome} <span class="alliance-world-card-inline">${alianca2.world}</span></button>
        </div>
    `;
}

/**
 * Restaura o estado (vencedor selecionado, botões desabilitados) dos duelos de uma semana.
 */
function restaurarEstadoDuelos(weekNum) {
    const weekId = `week-${weekNum}`;
    const weekContainer = document.getElementById(weekId).querySelector('.matches');
    const matchesInWeek = weekContainer.querySelectorAll('.match');

    if (!duelosRealizados[weekId]) {
        return; 
    }

    matchesInWeek.forEach(matchDiv => {
        const matchId = matchDiv.getAttribute('data-match-id');

        if (duelosRealizados[weekId][matchId]) { // Se um vencedor está registrado para este duelo
            const vencedorNome = duelosRealizados[weekId][matchId].winner;
            const buttons = matchDiv.querySelectorAll('button');
            buttons.forEach(button => {
                const buttonAllianceName = button.textContent.trim().split('#')[0].trim(); 
                if (buttonAllianceName === vencedorNome) {
                    button.classList.add('selected-winner'); // Adiciona a classe para destacar o vencedor
                }
                button.disabled = true; // Desabilita todos os botões neste duelo concluído
            });
        }
    });
}


function registrarVencedor(semana, matchId, aliancaNome1, aliancaNome2, vencedorNome, clickedButton) {
    if (semana !== currentWeek) {
        alert("Por favor, finalize os duelos da semana atual antes de prosseguir!");
        return; 
    }

    const weekId = `week-${semana}`;

    if (!duelosRealizados[weekId]) {
        duelosRealizados[weekId] = {};
    }

    // Evita registrar o mesmo duelo múltiplas vezes
    if (duelosRealizados[weekId][matchId] !== undefined) {
        return; 
    }

    // Desabilita os botões do duelo
    const parentDiv = clickedButton.closest('.match');
    const buttons = parentDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Adiciona a classe 'selected-winner' apenas ao botão do vencedor
    clickedButton.classList.add('selected-winner');

    // Atualiza pontuação e vitórias/derrotas das alianças
    const aliancaVencedora = aliancas.find(a => a.nome === vencedorNome);
    const aliancaPerdedora = aliancas.find(a => a.nome === (vencedorNome === aliancaNome1 ? aliancaNome2 : aliancaNome1));

    if (aliancaVencedora) {
        aliancaVencedora.vit++;
        aliancaVencedora.pts += 3;
    }
    if (aliancaPerdedora) {
        aliancaPerdedora.der++;
        aliancaPerdedora.pts += 1; // Ponto de participação ou derrota
    }

    // Registra o resultado completo do duelo (vencedor, perdedor)
    duelosRealizados[weekId][matchId] = {
        winner: vencedorNome,
        loser: (vencedorNome === aliancaNome1 ? aliancaNome2 : aliancaNome1),
    };

    atualizarRanking();
    salvarEstado(); // Salva o estado após cada registro de vencedor

    // Verifica se todos os duelos que *deveriam* ser gerados para a semana atual foram concluídos
    // Contamos os duelos que foram de fato gerados e estão no DOM (allGeneratedMatchesHTML)
    const totalMatchesGeneratedForCurrentWeek = allGeneratedMatchesHTML[currentWeek] ? allGeneratedMatchesHTML[currentWeek].length : 0;
    const completedMatchesInCurrentWeek = Object.keys(duelosRealizados[`week-${currentWeek}`] || {}).length;

    if (completedMatchesInCurrentWeek === totalMatchesGeneratedForCurrentWeek) {
        // Se todos os duelos da semana ativa foram concluídos, avança para a próxima
        if (currentWeek < semanas) {
            currentWeek++;
            
            // Força a regeneração dos duelos da PRÓXIMA semana para que dependências sejam resolvidas
            gerarDuelosParaSemana(currentWeek); 

            const nextWeekContainer = document.getElementById(`week-${currentWeek}`).querySelector('.matches');
            nextWeekContainer.innerHTML = ''; 

            if (allGeneratedMatchesHTML[currentWeek]) {
                allGeneratedMatchesHTML[currentWeek].forEach(matchHTML => {
                    nextWeekContainer.innerHTML += matchHTML;
                });
            }
            salvarEstado(); 
        } else {
            // Todas as semanas foram concluídas, exibe o ranking final
            document.getElementById('final-ranking').classList.remove('hidden-module');
            salvarEstado(); 
        }
    }
}

function atualizarRanking() {
    // Ordena as alianças: 1º por pontos (desc), 2º por vitórias (desc), 3º por derrotas (asc)
    aliancas.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.vit !== a.vit) return b.vit - a.vit;
        return a.der - b.der;
    });

    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ''; // Limpa a lista antes de reconstruí-la

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

        const maxVitorias = Math.max(...aliancas.map(a => a.vit)); // Encontra a maior quantidade de vitórias
        let barWidth = 0;
        if (maxVitorias > 0) { // Evita divisão por zero
            barWidth = (alianca.vit / maxVitorias) * 100;
        }
        
        if (barWidth < 10 && alianca.vit > 0) barWidth = 10; // Garante uma barra mínima para quem tem vitórias
        else if (alianca.vit === 0) barWidth = 0; // Se não tem vitórias, a barra é 0

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
