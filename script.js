// Dados das alianças - Adicione o 'world'
const aliancas = [
    { nome: "OTAN1", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "OTAN2", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "OTAN3", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "OTAN4", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "OTAN5", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "OTAN6", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "OTAN7", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "OTAN8", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "OTAN9", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "OTAN10", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "OTAN11", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "OTAN12", vit: 0, der: 0, pts: 0, world: "#104" },
    { nome: "OTAN13", vit: 0, der: 0, pts: 0, world: "#101" },
    { nome: "OTAN14", vit: 0, der: 0, pts: 0, world: "#102" },
    { nome: "OTAN15", vit: 0, der: 0, pts: 0, world: "#103" },
    { nome: "OTAN16", vit: 0, der: 0, pts: 0, world: "#104" },
];

let duelosRealizados = {};
let semanas = 4;
// Aumentado o número de duelos por semana. Com 16 alianças,
// podemos ter no máximo 8 duelos por semana (16 alianças / 2 por duelo).
// Se você quiser que todas as alianças joguem toda semana, defina para 8.
let duelosPorSemana = 8; // Aumentado para 8 para incluir mais grupos/duelos

document.addEventListener('DOMContentLoaded', () => {
    gerarDuelos();
    atualizarRanking();
});

function gerarDuelos() {
    // Para garantir que duelos não se repitam em uma semana
    // E que cada aliança jogue apenas uma vez por semana
    // Resetar aliancasParaEstaSemana a cada nova semana
    let aliancasParaEstaSemana = [...aliancas]; 
    const duelosGeradosGlobal = {}; // Para controlar duelos que já aconteceram entre quaisquer duas alianças ao longo das semanas

    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        weekContainer.innerHTML = ''; // Limpa duelos anteriores

        let aliancasDisponiveisParaDuelo = [...aliancasParaEstaSemana]; // Copia para uso nesta semana
        let duelosSemanaAtual = 0;
        let aliancasJaDuelaramNestaSemana = new Set(); // Para garantir que uma aliança só duele uma vez por semana

        while (duelosSemanaAtual < duelosPorSemana && aliancasDisponiveisParaDuelo.length >= 2) {
            let alianca1, alianca2;
            let idx1, idx2;
            let tentativaSegura = 0;
            const maxTentativas = 100; // Limite para evitar loop infinito em cenários complexos

            do {
                // Tenta selecionar a primeira aliança que ainda não duelou nesta semana
                idx1 = Math.floor(Math.random() * aliancasDisponiveisParaDuelo.length);
                alianca1 = aliancasDisponiveisParaDuelo[idx1];
                tentativaSegura++;
            } while (aliancasJaDuelaramNestaSemana.has(alianca1.nome) && tentativaSegura < maxTentativas);

            if (tentativaSegura >= maxTentativas) {
                console.warn(`Não foi possível encontrar uma primeira aliança disponível para o duelo na semana ${s}.`);
                break; // Sai do loop se não conseguir encontrar uma aliança válida
            }

            // Remove alianca1 da lista disponível para evitar que ela seja selecionada como alianca2
            aliancasDisponiveisParaDuelo.splice(idx1, 1);

            tentativaSegura = 0; // Resetar para a segunda aliança
            do {
                // Tenta selecionar a segunda aliança que ainda não duelou nesta semana
                idx2 = Math.floor(Math.random() * aliancasDisponiveisParaDuelo.length);
                alianca2 = aliancasDisponiveisParaDuelo[idx2];
                tentativaSegura++;
            } while (aliancasJaDuelaramNestaSemana.has(alianca2.nome) && tentativaSegura < maxTentativas);
            
            if (tentativaSegura >= maxTentativas) {
                console.warn(`Não foi possível encontrar uma segunda aliança disponível para o duelo na semana ${s}.`);
                // Recoloca alianca1 se alianca2 não for encontrada
                aliancasDisponiveisParaDuelo.push(alianca1);  // Recoloca alianca1
                break; // Sai do loop
            }

            // Cria uma chave única para o duelo (ordem não importa)
            const dueloKey = [alianca1.nome, alianca2.nome].sort().join('-');

            // Verifica se o duelo já foi gerado globalmente
            if (!duelosGeradosGlobal[dueloKey] && alianca1.nome !== alianca2.nome) {
                duelosGeradosGlobal[dueloKey] = true;
                const matchElement = criarElementoDuelo(s, alianca1, alianca2);
                weekContainer.appendChild(matchElement);
                duelosSemanaAtual++;
                
                // Marca as alianças como dueladas nesta semana
                aliancasJaDuelaramNestaSemana.add(alianca1.nome);
                aliancasJaDuelaramNestaSemana.add(alianca2.nome);

                // Remove as alianças da lista disponível para esta semana
                // (alianca1 já foi removida, agora remove alianca2)
                aliancasDisponiveisParaDuelo.splice(idx2, 1);

            } else {
                // Se o duelo já existe ou alianças são as mesmas, recoloca-as e tenta novamente
                // Como já removemos alianca1, precisamos recolocá-la aqui
                aliancasDisponiveisParaDuelo.push(alianca1, alianca2); // Recoloca ambas
            }
        }
        // Ao final de cada semana, aliancasDisponiveisParaDuelo terá as alianças que não duelaram
        // ou as que foram recolocadas.
        // Para a próxima semana, queremos que todas as alianças estejam disponíveis novamente.
        aliancasParaEstaSemana = [...aliancas]; // Reseta para a próxima semana
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
    // Criar uma chave de duelo consistente independentemente da ordem dos nomes
    const dueloKey = [aliancaNome1, aliancaNome2].sort().join('-');
    const weekId = `week-${semana}`;

    // Inicializa a estrutura para a semana se ainda não existir
    if (!duelosRealizados[weekId]) {
        duelosRealizados[weekId] = {};
    }

    // Verifica se o duelo já foi registrado para esta semana
    if (duelosRealizados[weekId][dueloKey] !== undefined) {
        // Duelo já foi registrado, previne duplo clique
        return;
    }

    // Desabilitar todos os botões do duelo
    const parentDiv = clickedButton.closest('.match');
    const buttons = parentDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    // Marcar o botão do vencedor
    clickedButton.classList.add('selected-winner');

    // Atualizar pontuação e vitórias/derrotas
    const aliancaVencedora = aliancas.find(a => a.nome === vencedorNome);
    const aliancaPerdedora = aliancas.find(a => a.nome === (vencedorNome === aliancaNome1 ? aliancaNome2 : aliancaNome1));

    if (aliancaVencedora) {
        aliancaVencedora.vit++;
        aliancaVencedora.pts += 3; // +3 pontos pela vitória
    }
    if (aliancaPerdedora) {
        aliancaPerdedora.der++;
        aliancaPerdedora.pts += 1; // +1 ponto pela derrota (participação)
    }

    // Registrar o duelo como realizado
    duelosRealizados[weekId][dueloKey] = vencedorNome;

    atualizarRanking();
}

function atualizarRanking() {
    aliancas.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts; // Maior pontuação primeiro
        if (b.vit !== a.vit) return b.vit - a.vit; // Mais vitórias segundo
        return a.der - b.der; // Menos derrotas terceiro
    });

    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    aliancas.forEach((alianca, index) => {
        const li = document.createElement('li');
        const rank = index + 1;
        li.setAttribute('data-rank', rank); // Usar data-attribute para o CSS

        let trophyHtml = '';
        if (rank === 1) {
            trophyHtml = '<i class="fas fa-trophy trophy gold"></i>';
        } else if (rank === 2) {
            trophyHtml = '<i class="fas fa-trophy trophy silver"></i>';
        } else if (rank === 3) {
            trophyHtml = '<i class="fas fa-trophy trophy bronze"></i>';
        }

        // Adiciona a largura da barra de progresso dinamicamente
        // Calcula a largura da barra de progresso baseada na porcentagem de vitórias em relação ao máximo de vitórias possível
        const maxVitorias = Math.max(...aliancas.map(a => a.vit), 1); // Garante que não divida por zero
        let barWidth = (alianca.vit / maxVitorias) * 100;
        
        // Ajuste para garantir uma barra mínima visível para alianças com poucas vitórias
        if (barWidth < 10 && alianca.vit > 0) barWidth = 10; // Adicionado para alianças com vitórias, mas porcentagem baixa
        else if (alianca.vit === 0) barWidth = 0; // Para 0 vitórias, barra 0%

        li.style.setProperty('--bar-width', `${barWidth}%`);

        li.innerHTML = `
            ${trophyHtml} <span class="rank-position">${rank}</span>
            <span class="alliance-name-wrapper">
                <span class="alliance-name">${alianca.nome}</span>
                <span class="alliance-world-card">${alianca.world}</span>
            </span>
            <span class="alliance-stats">V: ${alianca.vit} D: ${alianca.der} P: ${alianca.pts}</span>
        `;
        rankingList.appendChild(li);
    });
}
