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

// --- Duelos DEFINIDOS para a Semana 1 ---
// IMPORTANTE: Certifique-se de que cada aliança apareça exatamente uma vez por duelo,
// e que todos os duelos necessários para a semana sejam listados (8 duelos para 16 alianças).
const semana1DuelosDefinidos = [
    ["4oLK", "Swr"],
    ["DEEP", "SAV2"],
    ["TEGs", "HGZ"],
    ["RICO", "MEH."],
    ["BP-2", "TWID"],
    ["ESP^", "LPD"],
    ["JH4", "OTAn"],
    ["VNL", "SA7"],
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
    // Limpa o localStorage ao carregar a página para sempre iniciar do zero
    localStorage.clear(); 
    
    carregarEstado(); // Carrega o estado (que agora estará vazio, efetivamente reiniciando)
    inicializarTorneio(); // Inicializa o torneio com o estado carregado (ou padrão)
});

/**
 * Salva o estado atual do torneio (alianças, duelosRealizados, currentWeek) no localStorage.
 * Esta função agora é chamada *apenas* para persistir o progresso DURANTE a sessão
 * ou ao usar o botão de reset (que limpa e depois salva o estado inicial).
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
 * Com a nova lógica, esta função será chamada após o `localStorage.clear()` no DOMContentLoaded,
 * então ela efetivamente carregará um estado vazio (o que é o objetivo para "iniciar do 0").
 * Ela ainda é útil para manter a estrutura, caso no futuro você queira reverter para salvar o progresso.
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
            for (let s = 1; s <= currentWeek; s++) {
                if (duelosRealizados[`week-${s}`]) {
                    gerarDuelosParaSemana(s); 
                }
            }

        } else {
            // Se não houver estado salvo (que é o que acontecerá agora após o clear)
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
    // Esconde o rank final no início
    document.getElementById('final-ranking').classList.add('hidden-module');

    // Popula e restaura o estado de TODAS as semanas já jogadas (ou a semana atual)
    for (let s = 1; s <= semanas; s++) {
        // Se a semana já foi jogada ou é a semana atual
        if (s <= currentWeek) {
            gerarDuelosParaSemana(s); 
            
            const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
            weekContainer.innerHTML = ''; 

            if (allGeneratedMatchesHTML[s]) {
                allGeneratedMatchesHTML[s].forEach(matchHTML => {
                    weekContainer.innerHTML += matchHTML;
                });
            }
            restaurarEstadoDuelos(s); 
        } else {
            // Semanas futuras devem estar visivelmente vazias (apenas o card)
            document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
        }
        document.getElementById(`week-${s}`).classList.remove('hidden-module'); 
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
    allGeneratedMatchesHTML = {}; 

    localStorage.clear(); // Limpa completamente o localStorage ao resetar manualmente

    // Limpa todos os containers de duelos no DOM
    for (let s = 1; s <= semanas; s++) {
        document.getElementById(`week-${s}`).querySelector('.matches').innerHTML = '';
    }
    
    // Oculta o rank final novamente
    document.getElementById('final-ranking').classList.add('hidden-module'); 

    inicializarTorneio(); // Re-inicializa o torneio, que irá carregar um estado vazio
    salvarEstado(); // Salva o estado inicial limpo para que ele comece a persistir DURANTE a sessão
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

        // Loop para gerar os duelos da semana
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
                break; // Nenhuma aliança disponível para Alianca1
            }

            let foundAlianca2 = false;
            let potentialOpponents = [...aliancasDisponiveisParaPareamento].filter(a => a.nome !== alianca1.nome);
            
            // Prioriza oponentes que não duelaram com alianca1 e que ainda não duelaram nesta semana.
            // Randomiza um pouco a ordem para evitar o mesmo pareamento rígido a cada vez que a semana é gerada.
            potentialOpponents.sort(() => Math.random() - 0.5); 
            potentialOpponents.sort((a, b) => Math.abs(a.pts - alianca1.pts) - Math.abs(b.pts - alianca1.pts)); // Ordem secundária por proximidade de pontos

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
                    break; 
                }
            }

            if (!foundAlianca2) {
                // Se alianca1 não conseguiu um par válido, ela pode ser "pulada" para a próxima iteração
                // do loop WHILE para tentar com outras alianças disponíveis, ou se for o último, quebrar.
                aliancasDisponiveisParaPareamento.splice(indexAlianca1, 1);
                aliancasDisponiveisParaPareamento.push(alianca1); // Adiciona de volta ao final para uma nova tentativa
            }
            
            // Se todas as alianças disponíveis já duelaram nesta semana, ou não há mais pares únicos
            if (aliancasJaDuelaramNestaSemana.size === aliancasOriginal.length || duelosGeradosParaEstaSemana.length === duelosPorSemana) {
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
