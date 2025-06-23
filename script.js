// Dados das alianças - Adicione o 'world'
// É BOM TER UMA CÓPIA ORIGINAL DOS DADOS PARA RESETAR FACILMENTE
const aliancasOriginal = [ // Nova constante para os dados originais
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

let aliancas = JSON.parse(JSON.stringify(aliancasOriginal)); // Usamos uma cópia mutável

let duelosRealizados = {};
let semanas = 4;
let duelosPorSemana = 8;

document.addEventListener('DOMContentLoaded', () => {
    inicializarTorneio(); // Chamada inicial
});

function inicializarTorneio() {
    gerarDuelos();
    atualizarRanking();
}

function resetarTorneio() {
    // 1. Resetar os dados das alianças para os valores originais
    aliancas = JSON.parse(JSON.stringify(aliancasOriginal)); // Cria uma nova cópia limpa

    // 2. Limpar os duelos realizados
    duelosRealizados = {};

    // 3. Limpar os elementos HTML dos duelos de todas as semanas
    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        weekContainer.innerHTML = '';
    }

    // 4. Gerar novos duelos e atualizar o ranking
    inicializarTorneio(); // Reutiliza a função de inicialização
}


function gerarDuelos() {
    // Para garantir que duelos não se repitam em uma semana
    // E que cada aliança jogue apenas uma vez por semana
    const duelosGeradosGlobal = new Set(); // Usa um Set para melhor performance na verificação

    // Se já existem duelos realizados de uma sessão anterior (antes de um reset),
    // é bom popular duelosGeradosGlobal com eles para evitar repetição ao gerar novos.
    // Isso é mais crítico se o reset não limpar duelosRealizados completamente,
    // mas com o `resetarTorneio` limpando, isso é menos essencial para duelos já feitos.
    // No entanto, para evitar que o algoritmo tente gerar duelos que já foram "pensados"
    // no passado (mesmo que não clicados), manter o tracking de duelos globais é bom.
    // Para um reset completo, basta que `duelosGeradosGlobal` comece vazio.

    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        // weekContainer.innerHTML = ''; // Já limpo pelo resetarTorneio, ou estaria aqui

        let aliancasDisponiveisParaDuelo = [...aliancas]; // Todas as alianças disponíveis para esta semana
        let duelosSemanaAtual = 0;
        let aliancasJaDuelaramNestaSemana = new Set();

        // Embaralha as alianças para uma seleção mais aleatória
        aliancasDisponiveisParaDuelo.sort(() => Math.random() - 0.5);

        while (duelosSemanaAtual < duelosPorSemana && aliancasDisponiveisParaDuelo.length >= 2) {
            let alianca1 = null;
            let alianca2 = null;
            let indexAlianca1 = -1;
            let indexAlianca2 = -1;

            // Encontrar alianca1 que ainda não duelou nesta semana
            for (let i = 0; i < aliancasDisponiveisParaDuelo.length; i++) {
                if (!aliancasJaDuelaramNestaSemana.has(aliancasDisponiveisParaDuelo[i].nome)) {
                    alianca1 = aliancasDisponiveisParaDuelo[i];
                    indexAlianca1 = i;
                    break;
                }
            }

            if (!alianca1) { // Se não encontrou aliança 1 disponível, sai
                break;
            }

            // Encontrar alianca2
            // Tentar encontrar uma aliança que não tenha duelado com alianca1 antes E que não tenha duelado nesta semana
            let foundAlianca2 = false;
            for (let i = 0; i < aliancasDisponiveisParaDuelo.length; i++) {
                alianca2 = aliancasDisponiveisParaDuelo[i];
                if (alianca1.nome === alianca2.nome || aliancasJaDuelaramNestaSemana.has(alianca2.nome)) {
                    continue; // Pula se for a mesma aliança ou se já duelou esta semana
                }

                const dueloKey = [alianca1.nome, alianca2.nome].sort().join('-');
                if (!duelosGeradosGlobal.has(dueloKey)) {
                    indexAlianca2 = i;
                    foundAlianca2 = true;
                    break;
                }
            }

            if (!foundAlianca2) { // Se não encontrou uma aliança 2 válida para este alianca1
                // Remove alianca1 da lista de aliançasDisponiveisParaDuelo para esta semana,
                // para que ela não seja selecionada novamente nesta semana para um duelo,
                // se ela não conseguir encontrar um par.
                // Mas isso pode fazer com que alianças não dulem se os pares válidos forem poucos.
                // Para simplificar, vou manter como estava antes, mas a lógica de reembaralhar pode ser útil.
                // aliancasDisponiveisParaDuelo.splice(indexAlianca1, 1); // Remover alianca1 que não encontrou par
                continue; // Tenta com a próxima aliança1
            }

            const dueloKey = [alianca1.nome, alianca2.nome].sort().join('-');
            duelosGeradosGlobal.add(dueloKey); // Adiciona ao Set global de duelos já gerados

            const matchElement = criarElementoDuelo(s, alianca1, alianca2);
            weekContainer.appendChild(matchElement);
            duelosSemanaAtual++;

            aliancasJaDuelaramNestaSemana.add(alianca1.nome);
            aliancasJaDuelaramNestaSemana.add(alianca2.nome);

            // Remove as alianças da lista disponível para esta semana para não serem selecionadas novamente
            // É importante remover na ordem correta para não bagunçar os índices
            const aliancasRemover = [alianca1.nome, alianca2.nome];
            aliancasDisponiveisParaDuelo = aliancasDisponiveisParaDuelo.filter(
                a => !aliancasJaDuelaramNestaSemana.has(a.nome)
            );
            // Re-embaralhar pode ajudar a encontrar novos pares mais facilmente
            aliancasDisponiveisParaDuelo.sort(() => Math.random() - 0.5);
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
