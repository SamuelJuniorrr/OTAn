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
// Isso é necessário porque os duelos são gerados dinamicamente semana a semana,
// mas precisamos re-popular as semanas anteriores com seus duelos originais ao carregar/resetar.
let allGeneratedMatchesHTML = {};

document.addEventListener('DOMContentLoaded', () => {
    carregarEstado(); // Tenta carregar o estado salvo do localStorage
    inicializarTorneio();
});

/**
 * Salva o estado atual do torneio (alianças, duelosRealizados, currentWeek) no localStorage.
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
            
            // Reconstroi allGeneratedMatchesHTML a partir de duelosRealizados para semanas já jogadas
            // Isso é crucial para que `restaurarEstadoDuelos` possa encontrar os duelos.
            for (let s = 1; s <= currentWeek; s++) {
                if (duelosRealizados[`week-${s}`]) {
                    // Temporariamente gera os duelos para esta semana para que o HTML esteja disponível
                    // e possa ser restaurado. O gerarDuelosParaSemana já armazena em allGeneratedMatchesHTML.
                    gerarDuelosParaSemana(s); 
                }
            }

        } else {
            // Se não houver estado salvo, inicializa com dados originais
            aliancas = JSON.parse(JSON.stringify(aliancasOriginal));
            duelosRealizados = {};
            currentWeek = 1;
        }
    } catch (e) {
        console.error("Erro ao carregar estado do localStorage:", e);
        alert("Não foi possível carregar o progresso do torneio. Iniciando um novo torneio.");
        // Em caso de erro, força um reset para evitar dados corrompidos
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
            // Gera (ou regera) os duelos para esta semana.
            // A função `gerarDuelosParaSemana` já armazena o HTML em `allGeneratedMatchesHTML`.
            gerarDuelosParaSemana(s); 
            
            const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
            weekContainer.innerHTML = ''; // Limpa antes de popular

            if (allGeneratedMatchesHTML[s]) {
                allGeneratedMatchesHTML[s].forEach(matchHTML => {
                    weekContainer.innerHTML += matchHTML;
                });
            }
            restaurarEstadoDuelos(s); // Restaura o estado (vencedor destacado) para esta semana
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

    localStorage.clear(); // Limpa completamente o localStorage relacionado ao torneio

    // Limpa todos os containers de duelos
    for (let s = 1; s <= semanas; s++) {
        document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
    }
    
    // Oculta o rank final novamente
    document.getElementById('final-ranking').classList.add('hidden-module'); 

    inicializarTorneio(); // Re-inicializa o torneio, que irá chamar salvarEstado
}

/**
 * Gera os duelos para uma semana específica.
 * Para a Semana 1, usa uma definição manual.
 * Para Semanas > 1, implementa uma lógica de pareamento dinâmico.
 * Armazena o HTML gerado em `allGeneratedMatchesHTML[weekNum]`.
 */
function gerarDuelosParaSemana(weekNum) {
    let duelosGeradosParaEstaSemana = [];
    let aliancasDisponiveisParaPareamento = [...aliancas]; // Cópia para manipulação de disponibilidade
    let aliancasJaDuelaramNestaSemana = new Set(); // Controla quem já duelou NESTA semana

    // Conjunto de chaves de duelos que já ocorreram em QUALQUER semana anterior ou na atual
    const duelosGlobaisJaOcorridos = new Set();
    for (let s = 1; s < weekNum; s++) { // Para semanas anteriores
        if (duelosRealizados[`week-${s}`]) {
            for (const key in duelosRealizados[`week-${s}`]) {
                duelosGlobaisJaOcorridos.add(key);
            }
        }
    }
    // Adiciona duelos da semana atual se já existirem (útil ao recarregar a página)
    if (duelosRealizados[`week-${weekNum}`]) {
        for (const key in duelosRealizados[`week-${weekNum}`]) {
            duelosGlobaisJaOcorridos.add(key);
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
            } else {
                console.warn(`Aliança não encontrada na Semana 1: ${nome1} ou ${nome2}`);
            }
        }
    } else {
        // --- Lógica para Semanas > 1 (geração dinâmica baseada em resultados) ---
        // Ordena as alianças pela pontuação atual (descendente) para tentar parear por força
        // Isso ajuda a parear alianças com desempenhos semelhantes.
        aliancasDisponiveisParaPareamento.sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.vit !== a.vit) return b.vit - a.vit;
            return a.der - b.der;
        });

        // Limite para evitar loop infinito em casos de pareamento impossível
        let tentativasMaximasPorAlianca = aliancasDisponiveisParaPareamento.length; 

        while (duelosGeradosParaEstaSemana.length < duelosPorSemana && aliancasDisponiveisParaPareamento.length >= 2) {
            let alianca1 = null;
            let indexAlianca1 = -1;

            // Encontra a próxima aliança disponível para ser alianca1
            for (let i = 0; i < aliancasDisponiveisParaPareamento.length; i++) {
                const current = aliancasDisponiveisParaPareamento[i];
                if (!aliancasJaDuelaramNestaSemana.has(current.nome)) {
                    alianca1 = current;
                    indexAlianca1 = i;
                    break;
                }
            }

            if (!alianca1) {
                // Todas as alianças disponíveis já duelaram nesta semana ou não há mais pares
                break; 
            }

            let foundAlianca2 = false;
            // Cria uma lista temporária de possíveis oponentes para alianca1, excluindo alianca1
            let potentialOpponents = [...aliancasDisponiveisParaPareamento].filter(a => a.nome !== alianca1.nome);
            
            // Ordena os potenciais oponentes por proximidade de pontos a alianca1 para um pareamento mais "justo"
            potentialOpponents.sort((a, b) => Math.abs(a.pts - alianca1.pts) - Math.abs(b.pts - alianca1.pts));

            for (let i = 0; i < potentialOpponents.length; i++) {
                const alianca2 = potentialOpponents[i];

                if (aliancasJaDuelaramNestaSemana.has(alianca2.nome)) {
                    continue; // Alianca2 já duelou nesta semana
                }

                const dueloKey = [alianca1.nome, alianca2.nome].sort().join('-');
                if (!duelosGlobaisJaOcorridos.has(dueloKey)) {
                    // Encontrou um par válido!
                    duelosGeradosParaEstaSemana.push(criarElementoDueloHTML(weekNum, alianca1, alianca2));
                    aliancasJaDuelaramNestaSemana.add(alianca1.nome);
                    aliancasJaDuelaramNestaSemana.add(alianca2.nome);
                    
                    foundAlianca2 = true;
                    break; // Sai do loop de busca por alianca2
                }
            }

            if (!foundAlianca2) {
                // Se alianca1 não conseguiu um par nesta iteração, move-a para o final
                // ou a remove da lista temporariamente para tentar outro `alianca1`
                aliancasDisponiveisParaPareamento.splice(indexAlianca1, 1); 
                aliancasDisponiveisParaPareamento.push(alianca1); // Coloca no final para tentar depois
            }
            
            // Isso previne loops infinitos se não houver pares válidos suficientes
            if (duelosGeradosParaEstaSemana.length >= duelosPorSemana) break;
            if (aliancasJaDuelaramNestaSemana.size === aliancasDisponiveisParaPareamento.length && duelosGeradosParaEstaSemana.length < duelosPorSemana) {
                 // Caso todas as alianças disponíveis já duelaram na semana, mas não atingimos duelosPorSemana,
                 // significa que não há mais pares únicos ou válidos.
                 break;
            }
        }
    }
    allGeneratedMatchesHTML[weekNum] = duelosGeradosParaEstaSemana; // Armazena os duelos gerados para esta semana
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
            <button onclick="registrarVencedor(${semana}, '${alianca1NameEscaped}', '${alianca2NameEscaped}', '${alianca2NameEscaped}', this)">${alianca2.nome} <span class="alliance-world-card-inline">${alianca2.world}</span></button>
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
        aliancaPerdedora.pts += 1; // Ponto de participação ou derrota
    }

    // Registra o duelo como realizado para esta semana
    duelosRealizados[weekId][dueloKey] = vencedorNome;

    atualizarRanking();
    salvarEstado(); // Salva o estado após cada registro de vencedor

    // Verifica se todos os duelos da *semana ativa atual* foram concluídos
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
            // Não é necessário chamar restaurarEstadoDuelos para a próxima semana aqui
            // porque ela estará "limpa" de duelos registrados inicialmente.
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
