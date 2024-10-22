import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove,
    push
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAXDfdRG9H2rK2mEnCUaXLMVuHObWfvCsE",
    authDomain: "testes-19dc4.firebaseapp.com",
    projectId: "testes-19dc4",
    storageBucket: "testes-19dc4.appspot.com",
    messagingSenderId: "400866154921",
    appId: "1:400866154921:web:ba0e427bf2243030334cb8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("Firebase inicializado:", app);

// Referências aos modais e botões
var loginModalAddPresent = document.getElementById("loginModalAddPresent");
var loginModalUpdatePayments = document.getElementById("loginModalUpdatePayments");
var addPresentModal = document.getElementById("addPresentModal");
var confirmModal = document.getElementById("confirmModal");
var pixModal = document.getElementById("pixModal");
var paymentsModal = document.getElementById("paymentsModal");
var searchModal = document.getElementById("searchModal");
var addPresentBtn = document.getElementById("addPresentBtn");
var updatePaymentsBtn = document.getElementById("updatePaymentsBtn");
var searchInfoBtn = document.getElementById("searchInfoBtn");
var closeButtons = document.getElementsByClassName("close");
var idcrementa = 1;
var comprasPendentes = [];
var selectedPresent = {};

function idgerador() {
    idcrementa++;
    return idcrementa;
}

// Abrir o modal de login para adicionar presentes
addPresentBtn.onclick = function () {
    console.log("Botão de adicionar presente clicado");
    loginModalAddPresent.style.display = "flex";
}

// Abrir o modal de login para atualizar pagamentos
updatePaymentsBtn.onclick = function () {
    console.log("Botão de atualizar pagamentos clicado");
    loginModalUpdatePayments.style.display = "flex";
}

// Abrir o modal de busca de informações
searchInfoBtn.onclick = function () {
    console.log("Botão de busca de informações clicado");
    searchModal.style.display = "flex";
}

// Fechar qualquer modal ao clicar no botão de fechar
for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function () {
        console.log("Fechando modal");
        loginModalAddPresent.style.display = "none";
        loginModalUpdatePayments.style.display = "none";
        addPresentModal.style.display = "none";
        confirmModal.style.display = "none";
        pixModal.style.display = "none";
        paymentsModal.style.display = "none";
        searchModal.style.display = "none";
        document.getElementById("copyConfirmation").style.display = "none"; // Ocultar mensagem de cópia
    }
}

// Fechar modal ao clicar fora dele
window.onclick = function (event) {
    if (event.target == loginModalAddPresent) loginModalAddPresent.style.display = "none";
    if (event.target == loginModalUpdatePayments) loginModalUpdatePayments.style.display = "none";
    if (event.target == addPresentModal) addPresentModal.style.display = "none";
    if (event.target == confirmModal) confirmModal.style.display = "none";
    if (event.target == pixModal) pixModal.style.display = "none";
    if (event.target == paymentsModal) paymentsModal.style.display = "none";
    if (event.target == searchModal) searchModal.style.display = "none";
}

// Função para validar o login para adicionar presente
document.getElementById("loginBtnAddPresent").onclick = function () {
    var username = document.getElementById("usernameAdd").value;
    var password = document.getElementById("passwordAdd").value;

    console.log("Tentando login para adicionar presente");

    // Simulação de login fictício
    if (username === "admin" && password === "1234") {
        console.log("Login bem-sucedido para adicionar presente");
        loginModalAddPresent.style.display = "none"; // Fecha o modal de login
        addPresentModal.style.display = "flex"; // Abre o modal de adicionar presente
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

// Função para validar o login para atualizar pagamentos
document.getElementById("loginBtnUpdatePayments").onclick = function () {
    var username = document.getElementById("usernameUpdate").value;
    var password = document.getElementById("passwordUpdate").value;

    console.log("Tentando login para atualizar pagamentos");

    // Simulação de login fictício
    if (username === "financeiro" && password === "12345") {
        console.log("Login bem-sucedido para atualizar pagamentos");
        loginModalUpdatePayments.style.display = "none"; // Fecha o modal de login
        listarComprasPendentes(); // Lista as compras pendentes
        paymentsModal.style.display = "flex"; // Abre o modal de pagamentos
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

// Salvar presente na lista
document.getElementById("savePresentBtn").onclick = async function () {
    var id = idgerador();
    var nomePresente = document.getElementById("presente").value;
    var preco = document.getElementById("price").value;
    console.log("Salvando presente:", nomePresente, preco);

    const presenteref = ref(database, `Presente/${id}`)
    await set(presenteref, {
        nome: nomePresente,
        preco: preco
    });
}

// Função para buscar dados do Firebase e listar presentes
async function buscardados() {
    try {
        console.log("Buscando dados dos presentes...");
        const presenteref = ref(database, 'Presente'); // Referência ao caminho no banco de dados
        const snapshot = await get(presenteref); // Obtém os dados do caminho referenciado
        console.log("Snapshot obtido:", snapshot.val());

        var lista = document.getElementById("collection"); // Seleciona o elemento da lista
        lista.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

        if (snapshot.exists()) {
            const dados = snapshot.val(); // Obtém os dados
            for (const [key, value] of Object.entries(dados)) { // Itera sobre os dados
                var li = document.createElement("li"); // Cria um novo item de lista
                li.textContent = `${value.nome} R$ ${value.preco}`; // Define o texto do item
                console.log("Item de lista criado:", li.textContent);

                // Cria um botão "Selecionar"
                const button = document.createElement("button");
                button.textContent = "Selecionar";
                button.onclick = () => {
                    selecionarPresente(value.nome, value.preco); // Chama uma função para abrir o modal
                };

                lista.appendChild(li); // Adiciona o item à lista
                lista.appendChild(button); // Adiciona o botão ao item da lista
            }
        } else {
            const li = document.createElement("li");
            li.textContent = "Nenhum dado disponível";
            lista.appendChild(li);
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}

// Selecionar presente e abrir modal de confirmação
function selecionarPresente(nome, preco) {
    console.log("Presente selecionado:", nome, preco);
    selectedPresent = { nome, preco };
    document.getElementById("confirmText").innerText = `Você selecionou o presente: ${nome} - R$ ${preco}`;
    confirmModal.style.display = "flex"; // Abre o modal de confirmação
}

// Confirmar compra
document.getElementById("confirmPurchaseBtn").onclick = async function () {
    const key = idgerador();
    var fullName = document.getElementById("fullName").value;
    var phoneNumber = document.getElementById("phoneNumber").value;

    console.log("Confirmando compra:", fullName, phoneNumber);

    if (fullName && phoneNumber) {
        const comprasref = ref(database, `Compras/${key}`);
        await set(comprasref, {
            nome: fullName,
            telefone: phoneNumber,
            presente: selectedPresent.nome,
            preco: selectedPresent.preco,
            status: "pendente"
        });

        comprasPendentes.push({
            nome: fullName,
            telefone: phoneNumber,
            presente: selectedPresent.nome,
            preco: selectedPresent.preco,
            status: "pendente"
        });

        // Fechar o modal de confirmação e abrir o de pagamento
        confirmModal.style.display = "none";
        pixModal.style.display = "flex";
    } else {
        alert("Por favor, insira o nome completo e o número de telefone.");
    }
}

// Listar compras pendentes
async function listarComprasPendentes() {
    try {
        console.log("Listando compras pendentes...");
        const comprasref = ref(database, 'Compras');
        const snapshot = await get(comprasref);
        const listaPagamentos = document.getElementById("pendingPaymentsList");
        listaPagamentos.innerHTML = '';

        if (snapshot.exists()) {
            const compras = snapshot.val();
            for (const [key, compra] of Object.entries(compras)) {
                if (compra.status === "pendente") {
                    var li = document.createElement("li");
                    li.textContent = `${compra.nome} - ${compra.presente} - R$ ${compra.preco} - Pendente`;
                    listaPagamentos.appendChild(li);

                    const button = document.createElement("button");
                    button.textContent = "Confirmar Pagamento";
                    button.onclick = async () => {
                        await update(ref(database, `Compras/${key}`), { status: "pagamento concluído" });
                        listarComprasPendentes(); // Atualiza a lista após confirmar
                    };

                    listaPagamentos.appendChild(button);
                }
            }
        } else {
            var li = document.createElement("li");
            li.textContent = "Nenhuma compra pendente.";
            listaPagamentos.appendChild(li);
        }
    } catch (error) {
        console.error("Erro ao listar compras pendentes:", error);
    }
}

// Função de inicialização
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM totalmente carregado");
    buscardados();
});
