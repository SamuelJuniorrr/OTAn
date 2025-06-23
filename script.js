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
// Isso garante que 'aliancas' possa ser modificado, mas 'aliancasOriginal' permaneça intocada para o reset.

let duelosRealizados = {}; // Armazena o estado dos duelos já decididos
let semanas = 4;
let duelosPorSemana = 8; // Número de duelos a serem gerados por semana

document.addEventListener('DOMContentLoaded', () => {
    inicializarTorneio(); // Chamada inicial para configurar o torneio ao carregar a página
});

/**
 * Inicializa ou reinicializa o torneio, gerando duelos e atualizando o ranking.
 */
function inicializarTorneio() {
    gerarDuelos();
    atualizarRanking();
}

/**
 * Reseta o estado completo do torneio para o início.
 */
function resetarTorneio() {
    // 1. Resetar os dados das alianças para os valores originais
    aliancas = JSON.parse(JSON.stringify(aliancasOriginal)); // Cria uma nova cópia limpa dos dados originais

    // 2. Limpar os duelos realizados
    duelosRealizados = {};

    // 3. Limpar os elementos HTML dos duelos de todas as semanas
    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');
        weekContainer.innerHTML = ''; // Limpa os duelos exibidos na interface
    }

    // 4. Gerar novos duelos e atualizar o ranking
    inicializarTorneio(); // Reutiliza a função de inicialização para um novo começo
}

/**
 * Gera os duelos para todas as semanas do torneio, garantindo que alianças não se repitam
 * na mesma semana e que duelos não se repitam globalmente.
 */
function gerarDuelos() {
    const duelosGeradosGlobal = new Set(); // Rastreia todos os duelos já gerados (pares de alianças)

    for (let s = 1; s <= semanas; s++) {
        const weekContainer = document.getElementById(`week-${s}`).querySelector('.matches');

        let aliancasDisponiveisParaDuelo = [...aliancas]; // Cópia de todas as alianças para serem usadas nesta semana
        let duelosSemanaAtual = 0;
        let aliancasJaDuelaramNestaSemana = new Set(); // Rastreia quem já duelou nesta semana

        // Embaralha as alianças no início de cada semana para aleatoriedade
        aliancasDisponiveisParaDuelo.sort(() => Math.random() - 0.5);

        // Tenta gerar duelos até atingir o limite ou esgotar as opções
        while (duelosSemanaAtual < duelosPorSemana && aliancasDisponiveisParaDuelo.length >= 2) {
            let alianca1 = null;
            let alianca2 = null;
            let indexAlianca1 = -1;
            let currentDueloKey = ''; // <-- Variável declarada aqui, no escopo correto

            // Encontrar uma Aliança 1 que ainda não duelou nesta semana
            for (let i = 0; i < aliancasDisponiveisParaDuelo.length; i++) {
                if (!aliancasJaDuelaramNestaSemana.has(aliancasDisponiveisParaDuelo[i].nome)) {
                    alianca1 = aliancasDisponiveisParaDuelo[i];
                    indexAlianca1 = i;
                    break;
                }
            }

            if (!alianca1) { // Se não encontrou aliança 1 disponível, não há mais duelos possíveis para esta semana
                break;
            }

            // Encontrar uma Aliança 2 para Alianca 1
            let foundAlianca2 = false;
            // Cria uma cópia temporária e embaralha para buscar um parceiro aleatório para alianca1
            let tempAliancasParaAlianca2 = [...aliancasDisponiveisParaDuelo].filter(a => a.nome !== alianca1.nome);
            tempAliancasParaAlianca2.sort(() => Math.random() - 0.5);

            for (let i = 0; i < tempAliancasParaAlianca2.length; i++) {
                const potentialAlianca2 = tempAliancasParaAlianca2[i];

                // Verifica se a potencial Aliança 2 já duelou nesta semana
                if (aliancasJaDuelaramNestaSemana.has(potentialAlianca2.nome)) {
                    continue;
                }

                const tempKey = [alianca1.nome, potentialAlianca2.nome].sort().join('-');
                
                // Verifica se este par já duelou em alguma semana anterior
                if (!duelosGeradosGlobal.has(tempKey)) {
                    alianca2 = potentialAlianca2;
                    currentDueloKey = tempKey; // <-- Atribuição à variável no escopo correto
                    foundAlianca2 = true;
                    break;
                }
            }

            if (!foundAlianca2) { // Se Alianca1 não consegue encontrar um par válido, ela não duela nesta rodada
                aliancasDisponiveisParaDuelo.splice(indexAlianca1, 1); // Remove Alianca1 para que não tente mais com ela nesta iteração
                continue; // Tenta gerar o próximo duelo com as alianças restantes
            }

            // Duelo válido encontrado
            duelosGeradosGlobal.add(currentDueloKey); // <-- Usando a variável no escopo correto

            const matchElement = criarElementoDuelo(s, alianca1, alianca2);
            weekContainer.appendChild(matchElement);
            duelosSemanaAtual++;

            // Marca ambas as alianças como dueladas nesta semana
            aliancasJaDuelaramNestaSemana.add(alianca1.nome);
            aliancasJaDuelaramNestaSemana.add(alianca2.nome);

            // Remove as alianças dueladas da lista de disponíveis para a semana atual,
            // para que não sejam selecionadas novamente nesta mesma semana.
            aliancasDisponiveisParaDuelo = aliancasDisponiveisParaDuelo.filter(
                a => a.nome !== alianca1.nome && a.nome !== alianca2.nome
            );
        }
    }
}

/**
 * Cria o elemento HTML para um duelo.
 * @param {number} semana - O número da semana.
 * @param {object} alianca1 - Objeto da primeira aliança.
 * @param {object} alianca2 - Objeto da segunda aliança.
 * @returns {HTMLElement} O elemento <div> do duelo.
 */
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

/**
 * Registra o vencedor de um duelo, atualiza os pontos das alianças
 * e desabilita os botões do duelo.
 * @param {number} semana - O número da semana do duelo.
 * @param {string} aliancaNome1 - Nome da primeira aliança no duelo.
 * @param {string} aliancaNome2 - Nome da segunda aliança no duelo.
 * @param {string} vencedorNome - Nome da aliança vencedora.
 * @param {HTMLButtonElement} clickedButton - O botão que foi clicado.
 */
function registrarVencedor(semana, aliancaNome1, aliancaNome2, vencedorNome, clickedButton) {
    // Cria uma chave de duelo consistente (ordem dos nomes não importa)
    const dueloKey = [aliancaNome1, aliancaNome2].sort().join('-');
    const weekId = `week-${semana}`;

    // Inicializa a estrutura para a semana se ainda não existir
    if (!duelosRealizados[weekId]) {
        duelosRealizados[weekId] = {};
    }

    // Verifica se o duelo já foi registrado para esta semana para evitar reprocessamento
    if (duelosRealizados[weekId][dueloKey] !== undefined) {
        return; // Duelo já foi registrado, não faz nada
    }

    // Desabilitar todos os botões do duelo
    const parentDiv = clickedButton.closest('.match'); // Encontra o div pai do duelo
    const buttons = parentDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true); // Desabilita todos os botões do duelo

    // Marca o botão do vencedor com a classe 'selected-winner'
    clickedButton.classList.add('selected-winner');

    // Atualiza pontuação e vitórias/derrotas das alianças
    const aliancaVencedora = aliancas.find(a => a.nome === vencedorNome);
    const aliancaPerdedora = aliancas.find(a => a.nome === (vencedorNome === aliancaNome1 ? aliancaNome2 : aliancaNome1));

    if (aliancaVencedora) {
        aliancaVencedora.vit++; // Incrementa vitórias
        aliancaVencedora.pts += 3; // Adiciona 3 pontos pela vitória
    }
    if (aliancaPerdedora) {
        aliancaPerdedora.der++; // Incrementa derrotas
        aliancaPerdedora.pts += 1; // Adiciona 1 ponto pela participação (derrota)
    }

    // Registra o duelo como realizado para esta semana
    duelosRealizados[weekId][dueloKey] = vencedorNome;

    atualizarRanking(); // Atualiza o ranking na interface
}

/**
 * Atualiza a lista de ranking final com base nos pontos, vitórias e derrotas das alianças.
 */
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
        const rank = index + 1; // Posição no ranking
        li.setAttribute('data-rank', rank); // Define um atributo de dado para possível estilização CSS

        let trophyHtml = '';
        // Adiciona o ícone de troféu para as 3 primeiras posições
        if (rank === 1) {
            trophyHtml = '<i class="fas fa-trophy trophy gold"></i>';
        } else if (rank === 2) {
            trophyHtml = '<i class="fas fa-trophy trophy silver"></i>';
        } else if (rank === 3) {
            trophyHtml = '<i class="fas fa-trophy trophy bronze"></i>';
        }

        // Calcula a largura da barra de progresso baseada na porcentagem de vitórias
        // Encontra o número máximo de vitórias entre todas as alianças (garante que 100% seja o máximo real)
        const maxVitorias = Math.max(...aliancas.map(a => a.vit), 1); // Garante que não divida por zero (minimo 1)
        let barWidth = (alianca.vit / maxVitorias) * 100;
        
        // Ajuste para garantir uma barra mínima visível para alianças com vitórias, mas porcentagem baixa
        if (barWidth < 10 && alianca.vit > 0) barWidth = 10;
        else if (alianca.vit === 0) barWidth = 0; // Para 0 vitórias, a barra é 0%

        li.style.setProperty('--bar-width', `${barWidth}%`); // Define a variável CSS customizada

        // Preenche o item da lista com as informações da aliança
        li.innerHTML = `
            ${trophyHtml} <span class="rank-position">${rank}</span>
            <span class="alliance-name-wrapper">
                <span class="alliance-name">${alianca.nome}</span>
                <span class="alliance-world-card">${alianca.world}</span>
            </span>
            <span class="alliance-stats">V: ${alianca.vit} D: ${alianca.der} P: ${alianca.pts}</span>
        `;
        rankingList.appendChild(li); // Adiciona o item à lista de ranking
    });
}
