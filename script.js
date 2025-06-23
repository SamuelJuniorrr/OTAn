document.addEventListener('DOMContentLoaded', () => {
    const round1 = document.getElementById('round1');
    const round2 = document.getElementById('round2');
    const round3 = document.getElementById('round3');
    const round4 = document.getElementById('round4');

    // Exemplo de dados iniciais
    const alliances = [
        'Aliança A', 'Aliança B', 'Aliança C', 'Aliança D',
        'Aliança E', 'Aliança F', 'Aliança G', 'Aliança H',
        'Aliança I', 'Aliança J', 'Aliança K', 'Aliança L',
        'Aliança M', 'Aliança N', 'Aliança O', 'Aliança P'
    ];

    let results = {
        round1: [],
        round2: [],
        round3: [],
        round4: []
    };

    function createMatch(alliance1, alliance2, round) {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        matchDiv.innerHTML = `
            <div>${alliance1}</div>
            <div>vs</div>
            <div>${alliance2}</div>
            <button onclick="selectWinner('${alliance1}', '${alliance2}', '${round}')">Selecionar Vencedor</button>
        `;
        return matchDiv;
    }

    function populateRound(roundElement, alliances) {
        roundElement.innerHTML = ''; // Limpa os confrontos anteriores
        for (let i = 0; i < alliances.length; i += 2) {
            const match = createMatch(alliances[i], alliances[i + 1], roundElement.id);
            roundElement.appendChild(match);
        }
    }

    function selectWinner(alliance1, alliance2, round) {
        const winner = prompt(`Quem venceu? ${alliance1} ou ${alliance2}`);
        if (winner === alliance1 || winner === alliance2) {
            alert(`Vencedor: ${winner}`);
            updateNextRound(winner, round);
        } else {
            alert('Seleção inválida.');
        }
    }

    function updateNextRound(winner, round) {
        const nextRound = getNextRound(round);
        results[round].push(winner);
        if (results[round].length === 8) {
            populateRound(document.getElementById(nextRound), results[round]);
            results[round] = [];
        }
    }

    function getNextRound(currentRound) {
        switch (currentRound) {
            case 'round1':
                return 'round2';
            case 'round2':
                return 'round3';
            case 'round3':
                return 'round4';
            default:
                return null;
        }
    }

    // Populando a primeira rodada com os dados iniciais
    populateRound(round1, alliances);
});
