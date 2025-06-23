document.addEventListener('DOMContentLoaded', () => {
    // ## Configuração das Alianças (Fácil de Alterar)
    // Defina suas 16 alianças aqui. A ordem inicial pode ser aleatória,
    // pois a Semana 1 embaralha.
    let alliances = [
        "Aliança Alpha", "Aliança Beta", "Aliança Gamma", "Aliança Delta",
        "Aliança Epsilon", "Aliança Zeta", "Aliança Eta", "Aliança Theta",
        "Aliança Iota", "Aliança Kappa", "Aliança Lambda", "Aliança Mu",
        "Aliança Nu", "Aliança Xi", "Aliança Omicron", "Aliança Pi"
    ];

    let currentWeek = 1;
    let weekMatches = {}; // Armazena os duelos de cada semana
    let winnersByWeek = {}; // Armazena os vencedores de cada semana
    let finalRanking = [];

    const totalWeeks = 4;

    // --- Funções Auxiliares ---

    // Função para embaralhar um array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Função para criar duelos a partir de uma lista de participantes
    function createMatches(participants) {
        const matches = [];
        for (let i = 0; i < participants.length; i += 2) {
            matches.push([participants[i], participants[i + 1]]);
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

        // Habilita os botões da semana atual e desabilita as anteriores
        updateButtonStates(weekNumber);
    }

    // Função para lidar com a seleção do vencedor
    function handleWinnerSelection(event, weekNumber, matchIndex) {
        const selectedButton = event.target;
        const winner = selectedButton.dataset.winner;
        const matchDiv = selectedButton.closest('.match');

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
        winnersByWeek[weekNumber][matchIndex] = winner;

        // Verifica se todos os duelos da semana foram decididos para avançar
        const allMatchesDecided = weekMatches[weekNumber].every((_, i) => winnersByWeek[weekNumber][i]);
        if (allMatchesDecided) {
            progressToNextWeek();
        }
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

    // Função para calcular os confrontos da próxima semana
    function calculateNextWeekMatches(previousWeekNumber) {
        const winners = Object.values(winnersByWeek[previousWeekNumber]);
        let nextWeekParticipants = [];

        if (previousWeekNumber === 1) {
            // Semana 2: 1º vs 2º, 3º vs 4º, etc. (Baseado na ordem de vitória)
            // Para simplificar, vamos ordenar os vencedores e depois parear
            // Em um sistema real, você precisaria de um critério de classificação mais robusto
            winners.sort(); // Apenas para ter uma ordem consistente
            nextWeekParticipants = winners;
        } else if (previousWeekNumber > 1 && previousWeekNumber < totalWeeks) {
            // Para semanas 3 e 4, a lógica de 1º vs 2º, etc. se mantém
            // Os vencedores da semana anterior já estão na ordem correta para pareamento
            winners.sort(); // Para manter a consistência no exemplo
            nextWeekParticipants = winners;
        }

        return createMatches(nextWeekParticipants);
    }

    // Função para progredir para a próxima semana
    function progressToNextWeek() {
        if (currentWeek < totalWeeks) {
            currentWeek++;
            const nextWeekParticipants = Object.values(winnersByWeek[currentWeek - 1]);

            // Se for a Semana 2, garantimos o pareamento 1º vs 2º, etc.
            // Para as semanas subsequentes, a ordem dos vencedores já é a base
            let participantsForNextWeek;
            if (currentWeek === 2) {
                // Para a Semana 2, os vencedores da Semana 1 precisam ser ordenados
                // Idealmente, você teria um ranking baseado em performance.
                // Aqui, vamos apenas usar a ordem alfabética para simular um "ranking" simples
                nextWeekParticipants.sort();
                participantsForNextWeek = nextWeekParticipants;
            } else {
                // Para as semanas 3 e 4, a ordem em que os vencedores apareceram na semana anterior já é a base
                participantsForNextWeek = nextWeekParticipants;
            }

            weekMatches[currentWeek] = createMatches(participantsForNextWeek);
            displayMatches(currentWeek, weekMatches[currentWeek]);
            document.getElementById(`week-${currentWeek}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (currentWeek === totalWeeks) {
            // Fim do torneio, gerar classificação final
            generateFinalRanking();
        }
    }

    // Função para gerar a classificação final
    function generateFinalRanking() {
        // Os vencedores da última semana são os 8 primeiros colocados
        // Para uma classificação completa, precisaríamos rastrear os perdedores de cada rodada
        // ou ter um sistema de repescagem.
        // Neste exemplo simplificado, os 8 vencedores da Semana 4 serão o top 8.
        const week4Winners = Object.values(winnersByWeek[totalWeeks]);

        // Para ter os 16 participantes no ranking final, precisaríamos de uma lógica
        // mais complexa para incluir os perdedores.
        // Por simplicidade, vamos listar os vencedores da última semana primeiro.
        // Para ter os 16, precisaríamos armazenar todos os participantes e eliminá-los/classificá-los.

        // Exemplo simplificado: Apenas os vencedores da última semana são "finalistas"
        finalRanking = week4Winners;
        // Para preencher o resto, você precisaria de uma lógica mais elaborada
        // que rastreie os eliminados de cada rodada e sua ordem de eliminação.
        // Por exemplo, os perdedores da Semana 4 são do 9º ao 16º lugar.

        const finalRankingList = document.getElementById('ranking-list');
        finalRankingList.innerHTML = ''; // Limpa a lista anterior

        // Ordena os vencedores para uma apresentação mais consistente
        finalRanking.sort();

        finalRanking.forEach((alliance, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}º Lugar: ${alliance}`;
            finalRankingList.appendChild(listItem);
        });

        document.getElementById('final-ranking').style.display = 'block';
        document.getElementById('final-ranking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Inicialização do Torneio ---

    function initializeTournament() {
        // Semana 1: Embaralha as alianças e cria os duelos
        let initialParticipants = [...alliances]; // Cria uma cópia para não alterar o original
        shuffleArray(initialParticipants);
        weekMatches[1] = createMatches(initialParticipants);
        displayMatches(1, weekMatches[1]);
    }

    initializeTournament();
});
