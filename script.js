// Dados iniciais das alianças
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

// --- Duelos DEFINIDOS para a Semana 1 ---
// IMPORTANTE: Certifique-se de que cada aliança apareça exatamente uma vez por duelo,
// e que todos os duelos necessários para a semana sejam listados (8 duelos para 16 alianças).
const semana1DuelosDefinidos = [
    ["Aliança Alpha", "Legião Beta"],
    ["Guerreiros Gamma", "Clã Delta"],
    ["Força Épsilon", "Vanguard Omega"],
    ["Sentinelas Orion", "Destruidores Zeta"],
    ["União Sigma", "Guardiões Rho"],
    ["Templários Tau", "Mestres Phi"],
    ["Ascensão Chi", "Cruzados Psi"],
    ["Fênix Ómicron", "Defensores Kappa"],
];

// Variáveis de estado do torneio
let aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
let duelosRealizados = {}; // { "week-1": { "AliancaA-AliancaB": "AliancaA" }, ... }
let semanas = 4; // Número total de semanas
let duelosPorSemana = aliancasOriginal.length / 2; // (16 alianças / 2 = 8 duelos)
let currentWeek = 1; // A semana atual ativa para registro de resultados

// Armazenamento global para o HTML dos duelos de CADA semana (populado dinamicamente)
let allGeneratedMatchesHTML = {};

document.addEventListener('DOMContentLoaded', () => {
    carregarEstado(); // Tenta carregar o estado salvo
    inicializarTorneio();
});

/**
 * Salva o estado atual do torneio (alianças, duelosRealizados, currentWeek) no localStorage.
 */
function salvarEstado() {
    localStorage.setItem('aliancas', JSON.stringify(aliancas));
    localStorage.setItem('duelosRealizados', JSON.stringify(duelosRealizados));
    localStorage.setItem('currentWeek', currentWeek.toString());
}

/**
 * Carrega o estado do torneio do localStorage.
 */
function carregarEstado() {
    const savedAliancas = localStorage.getItem('aliancas');
    const savedDuelosRealizados = localStorage.getItem('duelosRealizados');
    const savedCurrentWeek = localStorage.getItem('currentWeek');

    if (savedAliancas && savedDuelosRealizados && savedCurrentWeek) {
        aliancas = JSON.parse(savedAliancas);
        duelosRealizados = JSON.parse(savedDuelosRealizados);
        currentWeek = parseInt(savedCurrentWeek);
    } else {
        // Se não houver estado salvo, garante que o currentWeek seja 1 e os dados originais
        aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
        duelosRealizados = {};
        currentWeek = 1;
    }
}

/**
 * Inicializa ou reinicializa o torneio, populando duelos e restaurando estados.
 */
function inicializarTorneio() {
    // Esconde o rank final no início
    document.getElementById('final-ranking').classList.add('hidden-module');

    // Popula e restaura o estado de TODAS as semanas já jogadas (ou a semana atual)
    for (let s = 1; s <= semanas; s++) {
        // Se a semana já foi jogada ou é a semana atual
        if (s <= currentWeek) {
            gerarDuelosParaSemana(s); // Gera (ou regera) os duelos para esta semana
            const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
            weekContainer.innerHTML = ''; // Limpa antes de popular

            if (allGeneratedMatchesHTML[s]) {
                allGeneratedMatchesHTML[s].forEach(matchHTML => {
                    weekContainer.innerHTML += matchHTML;
                });
            }
            restaurarEstadoDuelos(s); // Restaura o estado (vencedor destacado)
        } else {
            // Semanas futuras devem estar visivelmente vazias (apenas o card)
            document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
        }
        document.getElementById(`week-${s}`).classList.remove('hidden-module'); // Garante que o card da semana esteja visível
    }

    // Se currentWeek ultrapassou o número total de semanas, significa que o torneio terminou
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
    allGeneratedMatchesHTML = {}; // Reseta os duelos armazenados

    localStorage.clear(); // Limpa o localStorage

    // Limpa todos os containers de duelos
    for (let s = 1; s <= semanas; s++) {
        document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
    }
    
    // Oculta o rank final novamente
    document.getElementById('final-ranking').classList.add('hidden-module'); 

    inicializarTorneio(); // Re-inicializa o torneio
    salvarEstado(); // Salva o estado inicial limpo
}

/**
 * Gera os duelos para uma semana específica, usando definição manual para a Semana 1
 * e lógica dinâmica para as semanas seguintes.
 * Armazena o HTML gerado em `allGeneratedMatchesHTML[weekNum]`.
 */
function gerarDuelosParaSemana(weekNum) {
    let duelosGeradosParaEstaSemana = [];
    let aliancasDisponiveis = [...aliancas]; // Cópia para manipulação de disponibilidade
    let aliancasJaDuelaramNestaSemana = new Set();
    const duelosGlobaisJaOcorridos = new Set(); // Para evitar repetições globais

    // Popula duelosGlobaisJaOcorridos com base no `duelosRealizados` para semanas anteriores/atuais
    for (let s = 1; s <= weekNum; s++) {
        if (duelosRealizados[`week-${s}`]) {
            for (const key in duelosRealizados[`week-${s}`]) {
                duelosGlobaisJaOcorridos.add(key);
            }
        }
    }

    if (weekNum === 1) {
        // --- Lógica para Semana 1 (definida manualmente) ---
        for (const [nome1, nome2] of semana1DuelosDefinidos) {
            const alianca1 = aliancas.find(a => a.nome === nome1);
            const alianca2 = aliancas.find(a => a.nome === nome2);
            if (alianca1 && alianca2) {
                const matchHTML = criarElementoDueloHTML(weekNum, alianca1, alianca2);
                duelosGeradosParaEstaSemana.push(matchHTML);
            }
        }
    } else {
        // --- Lógica para Semanas > 1 (geração dinâmica baseada em resultados) ---
        // Ordena as alianças pela pontuação atual (descendente) para tentar parear por força
        aliancasDisponiveis.sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.vit !== a.vit) return b.vit - a.vit;
            return a.der - b.der;
        });

        let tentativasMaximas = aliancasDisponiveis.length * aliancasDisponiveis.length; // Limite para evitar loop infinito
        let tentativas = 0;

        while (duelosGeradosParaEstaSemana.length < duelosPorSemana && aliancasDisponiveis.length >= 2 && tentativas < tentativasMaximas) {
            tentativas++;

            let alianca1 = null;
            let indexAlianca1 = -1;

            // Encontra a primeira aliança disponível que ainda não duelou nesta semana
            for (let i = 0; i < aliancasDisponiveis.length; i++) {
                if (!aliancasJaDuelaramNestaSemana.has(aliancasDisponiveis[i].nome)) {
                    alianca1 = aliancasDisponiveis[i];
                    indexAlianca1 = i;
                    break;
                }
            }

            if (!alianca1) {
                break; // Nenhuma aliança disponível para Alianca1
            }

            let foundAlianca2 = false;
            // Tenta encontrar um par. Começa do início da lista para pegar o mais próximo em rank/pontos.
            let tempAliancasParaAlianca2 = [...aliancasDisponiveis].filter(a => a.nome !== alianca1.nome);
            tempAliancasParaAlianca2.sort(() => Math.random() - 0.5); // Randomiza a busca entre os disponíveis para evitar sempre os mesmos pares

            for (let i = 0; i < tempAliancasParaAlianca2.length; i++) {
                const potentialAlianca2 = tempAliancasParaAlianca2[i];

                if (aliancasJaDuelaramNestaSemana.has(potentialAlianca2.nome)) {
                    continue; // Já duelou nesta semana, pule
                }

                const dueloKey = [alianca1.nome, potentialAlianca2.nome].sort().join('-');
                if (!duelosGlobaisJaOcorridos.has(dueloKey)) {
                    // Encontrou um par válido que não duelou antes e não duelou nesta semana
                    duelosGeradosParaEstaSemana.push(criarElementoDueloHTML(weekNum, alianca1, potentialAlianca2));
                    aliancasJaDuelaramNestaSemana.add(alianca1.nome);
                    aliancasJaDuelaramNestaSemana.add(potentialAlianca2.nome);
                    duelosGlobaisJaOcorridos.add(dueloKey); // Adiciona para evitar repetição futura
                    foundAlianca2 = true;
                    break;
                }
            }

            if (!foundAlianca2) {
                // Se Alianca1 não encontra um par, remove-a da lista de disponíveis para tentar na próxima iteração do while
                // isso evita que ela trave o loop se não tiver parceiro válido
                aliancasDisponiveis.splice(indexAlianca1, 1);
            }
        }
    }
    allGeneratedMatchesHTML[weekNum] = duelosGeradosParaEstaSemana; // Armazena os duelos gerados
}

/**
 * Cria e retorna a string HTML de um duelo.
 * Adiciona atributos `data-` para facilitar a restauração do estado.
 */
function criarElementoDueloHTML(semana, alianca1, alianca2) {
    // Escapa aspas simples nos nomes para uso seguro no atributo onclick e data-
    const alianca1NameEscaped = alianca1.nome.replace(/'/g, "\\'");
    const alianca2NameEscaped = alianca2.nome.replace(/'/g, "\\'");

    return `
        <div class="match" data-semana="${semana}" data-alianca1="${alianca1NameEscaped}" data-alianca2="${alianca2NameEscaped}">
            <p>${alianca1.nome} vs ${alianca2.nome}</p>
            <button onclick="registrarVencedor(${semana}, '${alianca1NameEscaped}', '${alianca2NameEscaped}', '${alianca1NameEscaped}', this)">${alianca1.nome} <span class="alliance-world-card-inline">${alianca1.world}</span></button>
            <button onclick="registrarVencedor(${semana}, '${alianca1NameEscaped}', '${alianca2NameEscaled}', '${alianca2NameEscaped}', this)">${alianca2.nome} <span class="alliance-world-card-inline">${alianca2.world}</span></button>
        </div>
    `;
}

/**
 * Restaura o estado (vencedor selecionado, botões desabilitados) dos duelos de uma semana.
 * É chamada ao carregar a semana no DOM.
 */
function restaurarEstadoDuelos(weekNum) {
    const weekId = `week-${weekNum}`;
    const weekContainer = document.getElementById(weekId).querySelector('.matches');
    const matchesInWeek = weekContainer.querySelectorAll('.match');

    if (!duelosRealizados[weekId]) {
        return; // Nenhum duelo registrado para esta semana
    }

    matchesInWeek.forEach(matchDiv => {
        const aliancaNome1 = matchDiv.getAttribute('data-alianca1');
        const aliancaNome2 = matchDiv.getAttribute('data-alianca2');
        const dueloKey = [aliancaNome1, aliancaNome2].sort().join('-');

        const vencedorNome = duelosRealizados[weekId][dueloKey];

        if (vencedorNome) { // Se um vencedor está registrado para este duelo
            const buttons = matchDiv.querySelectorAll('button');
            buttons.forEach(button => {
                // Obtém o nome da aliança do texto do botão (antes do world card)
                const buttonAllianceName = button.textContent.trim().split('#')[0].trim(); 
                if (buttonAllianceName === vencedorNome) {
                    button.classList.add('selected-winner');
                }
                button.disabled = true; // Desabilita todos os botões neste duelo concluído
            });
        }
    });
}


function registrarVencedor(semana, aliancaNome1, aliancaNome2, vencedorNome, clickedButton) {
    // Apenas permite registrar se o duelo pertence à semana ativa
    if (semana !== currentWeek) {
        alert("Por favor, finalize os duelos da semana atual antes de prosseguir!");
        return; 
    }

    const dueloKey = [aliancaNome1, aliancaNome2].sort().join('-');
    const weekId = `week-${semana}`;

    if (!duelosRealizados[weekId]) {
        duelosRealizados[weekId] = {};
    }

    // Evita registrar o mesmo duelo múltiplas vezes
    if (duelosRealizados[weekId][dueloKey] !== undefined) {
        return; 
    }

    // Desabilita os botões do duelo e marca o vencedor
    const parentDiv = clickedButton.closest('.match');
    const buttons = parentDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
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
        aliancaPerdedora.pts += 1;
    }

    // Registra o duelo como realizado para esta semana
    duelosRealizados[weekId][dueloKey] = vencedorNome;

    atualizarRanking();
    salvarEstado(); // Salva o estado após cada registro de vencedor

    // Verifica se todos os duelos da *semana ativa atual* foram concluídos
    // totalMatchesInCurrentWeek agora vem do tamanho do array em allGeneratedMatchesHTML
    const totalMatchesInCurrentWeek = allGeneratedMatchesHTML[currentWeek] ? allGeneratedMatchesHTML[currentWeek].length : 0;
    const completedMatchesInCurrentWeek = Object.keys(duelosRealizados[`week-${currentWeek}`] || {}).length;

    if (completedMatchesInCurrentWeek === totalMatchesInCurrentWeek) {
        // Se todos os duelos da semana ativa foram concluídos, avança para a próxima
        if (currentWeek < semanas) {
            currentWeek++;
            
            // Gera os duelos para a PRÓXIMA semana
            gerarDuelosParaSemana(currentWeek); 

            const nextWeekContainer = document.getElementById(`week-${currentWeek}`).querySelector('.matches');
            nextWeekContainer.innerHTML = ''; // Limpa antes de popular

            // Popula os duelos da próxima semana no DOM
            if (allGeneratedMatchesHTML[currentWeek]) {
                allGeneratedMatchesHTML[currentWeek].forEach(matchHTML => {
                    nextWeekContainer.innerHTML += matchHTML;
                });
            }
            salvarEstado(); // Salva o estado após avançar de semana e gerar novos duelos
        } else {
            // Todas as semanas foram concluídas, exibe o ranking final
            document.getElementById('final-ranking').classList.remove('hidden-module');
            salvarEstado(); // Salva o estado final
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
