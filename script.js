document.addEventListener('DOMContentLoaded', () => {
    // ## Configuração das Alianças (Ordem é o Ranking Inicial Fixo)
    // A ordem aqui define o ranking inicial para a Semana 1
    let alliances = [
        "Aliança Alpha", "Aliança Beta", "Aliança Gamma", "Aliança Delta",
        "Aliança Epsilon", "Aliança Zeta", "Aliança Eta", "Aliança Theta",
        "Aliança Iota", "Aliança Kappa", "Aliança Lambda", "Aliança Mu",
        "Aliança Nu", "Aliança Xi", "Aliança Omicron", "Aliança Pi"
    ];

    // Estrutura para armazenar o estado de cada aliança
    // { name: "Aliança X", initialRank: 1, wins: 0, losses: 0, currentRank: 1 }
    let allianceData = alliances.map((name, index) => ({
        name: name,
        initialRank: index + 1, // Posição inicial fixa
        wins: 0,
        losses: 0,
        currentRank: index + 1 // Ranking atual, atualizado semanalmente
    }));

    let currentWeek = 1;
    let weekMatches = {}; // Armazena os duelos de cada semana
    let winnersByWeek = {}; // Armazena os vencedores de cada duelo para cada semana

    const totalWeeks = 4;

    // --- Funções Auxiliares ---

    // Função para criar duelos com base no ranking atual das alianças
    function createMatchesBasedOnRank(alliancesRanked) {
        const matches = [];
        // Ordena as alianças pelo ranking atual
        alliancesRanked.sort((a, b) => a.currentRank - b.currentRank);

        for (let i = 0; i < alliancesRanked.length; i += 2) {
            // Duels: 1st vs 2nd, 3rd vs 4th, etc.
            matches.push([alliancesRanked[i].name, alliancesRanked[i + 1].name]);
        }
        return matches;
    }

    // Função para exibir os duelos em uma semana específica
    function displayMatches(weekNumber, matches) {
        const weekDiv = document.getElementById(`week-${weekNumber}`);
        const matchesContainer = weekDiv.querySelector('.matches');
        matchesContainer.innerHTML = ''; // Limpa os duelos anteriores

        matches.forEach((match, index) => {
            const [alliance1, alliance2] = match;
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.setAttribute('data-match-id', `week${weekNumber}-match${index}`);

            matchDiv.innerHTML = `
                <p>${alliance1} vs ${alliance2}</p>
                <button data-winner="${alliance1}">${alliance1}</button>
                <button data-winner="${alliance2}">${alliance2}</button>
            `;
            matchesContainer.appendChild(matchDiv);

            // Adiciona event listeners aos botões de vencedor
            matchDiv.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', (event) => {
                    handleWinnerSelection(event, weekNumber, index);
                });
            });
        });

        // Habilita os botões da semana atual e desabilita as anteriores/futuras
        updateButtonStates(weekNumber);
    }

    // Função para lidar com a seleção do vencedor
    function handleWinnerSelection(event, weekNumber, matchIndex) {
        const selectedButton = event.target;
        const winnerName = selectedButton.dataset.winner;
        const matchDiv = selectedButton.closest('.match');

        // Determina o perdedor
        const opponentButton = Array.from(matchDiv.querySelectorAll('button')).find(
            btn => btn !== selectedButton
        );
        const loserName = opponentButton.dataset.winner;

        // Desseleciona qualquer botão que já tenha sido selecionado neste confronto
        matchDiv.querySelectorAll('button').forEach(button => {
            button.classList.remove('selected-winner');
            button.disabled = true; // Desabilita todos os botões do duelo após a seleção
        });

        // Marca o botão do vencedor
        selectedButton.classList.add('selected-winner');

        // Armazena o vencedor para esta semana e confronto
        if (!winnersByWeek[weekNumber]) {
            winnersByWeek[weekNumber] = {};
        }
        winnersByWeek[weekNumber][matchIndex] = winnerName;

        // Atualiza as vitórias/derrotas das alianças
        updateAllianceStats(winnerName, loserName);

        // Verifica se todos os duelos da semana foram decididos para avançar
        const allMatchesDecided = weekMatches[weekNumber].every((_, i) => winnersByWeek[weekNumber][i]);
        if (allMatchesDecided) {
            progressToNextWeek();
        }
    }

    // Função para atualizar as estatísticas de vitórias/derrotas de uma aliança
    function updateAllianceStats(winnerName, loserName) {
        const winnerAlliance = allianceData.find(a => a.name === winnerName);
        const loserAlliance = allianceData.find(a => a.name === loserName);

        if (winnerAlliance) {
            winnerAlliance.wins++;
        }
        if (loserAlliance) {
            loserAlliance.losses++;
        }
        // console.log("Stats updated:", allianceData);
    }

    // Função para atualizar o estado dos botões (habilitar/desabilitar)
    function updateButtonStates(activeWeek) {
        document.querySelectorAll('.week').forEach(weekDiv => {
            const weekNumber = parseInt(weekDiv.id.replace('week-', ''));
            const buttons = weekDiv.querySelectorAll('.match button');

            buttons.forEach(button => {
                const matchId = button.closest('.match').dataset.matchId;
                const matchIndex = parseInt(matchId.split('match')[1]);

                if (weekNumber === activeWeek) {
                    // Habilita se ainda não houver vencedor para este duelo
                    if (!winnersByWeek[weekNumber] || !winnersByWeek[weekNumber][matchIndex]) {
                        button.disabled = false;
                    } else {
                        // Se já houver vencedor, desabilita e marca o vencedor
                        button.disabled = true;
                        if (button.dataset.winner === winnersByWeek[weekNumber][matchIndex]) {
                            button.classList.add('selected-winner');
                        }
                    }
                } else {
                    button.disabled = true; // Desabilita botões de semanas passadas/futuras
                }
            });
        });
    }

    // Função para calcular o ranking da próxima semana e seus confrontos
    function calculateNextWeekMatchesAndRank() {
        // Lógica de ranking: Pode ser por vitórias, depois por diferença de vitórias/derrotas,
        // e depois pelo rank inicial se houver empate.
        allianceData.sort((a, b) => {
            // 1. Mais vitórias primeiro
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            // 2. Menos derrotas depois (ou maior diferença wins - losses)
            const diffA = a.wins - a.losses;
            const diffB = b.wins - b.losses;
            if (diffB !== diffA) {
                return diffB - diffA;
            }
            // 3. Critério de desempate final: ranking inicial
            return a.initialRank - b.initialRank;
        });

        // Atualiza o currentRank de cada aliança com base na nova ordem
        allianceData.forEach((alliance, index) => {
            alliance.currentRank = index + 1;
        });

        // Agora, crie os novos duelos com base no currentRank atualizado
        return createMatchesBasedOnRank(allianceData);
    }

    // Função para progredir para a próxima semana
    function progressToNextWeek() {
        if (currentWeek < totalWeeks) {
            currentWeek++;
            weekMatches[currentWeek] = calculateNextWeekMatchesAndRank();
            displayMatches(currentWeek, weekMatches[currentWeek]);
            document.getElementById(`week-${currentWeek}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (currentWeek === totalWeeks) {
            // Fim do torneio, gerar classificação final
            generateFinalRanking();
        }
    }

    // Função para gerar a classificação final
    function generateFinalRanking() {
        // O ranking final é simplesmente o ranking atual das alianças após a última semana
        // recalculamos o ranking uma última vez para garantir a ordem final
        allianceData.sort((a, b) => {
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            const diffA = a.wins - a.losses;
            const diffB = b.wins - b.losses;
            if (diffB !== diffA) {
                return diffB - diffA;
            }
            return a.initialRank - b.initialRank;
        });

        const finalRankingList = document.getElementById('ranking-list');
        finalRankingList.innerHTML = ''; // Limpa a lista anterior

        allianceData.forEach((alliance, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}º Lugar: ${alliance.name} (V: ${alliance.wins}, D: ${alliance.losses})`;
            finalRankingList.appendChild(listItem);
        });

        document.getElementById('final-ranking').style.display = 'block';
        document.getElementById('final-ranking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Inicialização do Torneio ---

    function initializeTournament() {
        // Semana 1: Duelos fixos baseados no rank inicial (1º vs 2º, 3º vs 4º, etc.)
        weekMatches[1] = createMatchesBasedOnRank(allianceData);
        displayMatches(1, weekMatches[1]);
    }

    initializeTournament();
});
