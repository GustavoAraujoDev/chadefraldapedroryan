import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8pm4uG001PSBB7isdxVXCP97UjkS3Ip0",
  authDomain: "chadefraldapedroryan.firebaseapp.com",
  projectId: "chadefraldapedroryan",
  storageBucket: "chadefraldapedroryan.appspot.com",
  messagingSenderId: "773248475181",
  appId: "1:773248475181:web:202384eea8ff4479f7d8a4",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("Firebase inicializado:", app);

document.addEventListener("DOMContentLoaded", async function () {
  // Referências aos modais e botões
  var loginModalAddPresent = document.getElementById("loginModalAddPresent");
  var loginModalUpdatePayments = document.getElementById(
    "loginModalUpdatePayments"
  );
  var addPresentModal = document.getElementById("addPresentModal");
  var confirmModal = document.getElementById("confirmModal");
  var pixModal = document.getElementById("pixModal");
  var paymentsModal = document.getElementById("paymentsModal");
  var searchModal = document.getElementById("searchModal");
  var addPresentBtn = document.getElementById("addPresentBtn");
  var updatePaymentsBtn = document.getElementById("updatePaymentsBtn");
  var searchInfoBtn = document.getElementById("searchInfoBtn");
  var searchBtn = document.getElementById("searchBtn");
  var closeButtons = document.getElementsByClassName("close");
  var copybtnchave = document.getElementById("copy-btnchave");
  var copybtncopia = document.getElementById("copy-btncopia");
  var pixKey = document.getElementById("pixKey");
  var pixCopyPaste = document.getElementById("pixCopyPaste");
  // Seleção de elementos
  var imageUpload = document.getElementById("imageUpload");
  var imagePreview = document.getElementById("preview");

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
  };

  // Abrir o modal de login para atualizar pagamentos
  updatePaymentsBtn.onclick = function () {
    console.log("Botão de atualizar pagamentos clicado");
    loginModalUpdatePayments.style.display = "flex";
  };

  // Abrir o modal de busca de informações
  searchInfoBtn.onclick = function () {
    console.log("Botão de busca de informações clicado");
    searchModal.style.display = "flex";
  };

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
    };
  }

  // Fechar modal ao clicar fora dele
  window.onclick = function (event) {
    if (event.target == loginModalAddPresent)
      loginModalAddPresent.style.display = "none";
    if (event.target == loginModalUpdatePayments)
      loginModalUpdatePayments.style.display = "none";
    if (event.target == addPresentModal) addPresentModal.style.display = "none";
    if (event.target == confirmModal) confirmModal.style.display = "none";
    if (event.target == pixModal) pixModal.style.display = "none";
    if (event.target == paymentsModal) paymentsModal.style.display = "none";
    if (event.target == searchModal) searchModal.style.display = "none";
  };

  // Função para validar o login para adicionar presente
  loginBtnAddPresent.onclick = function () {
    var username = document.getElementById("usernameAdd").value;
    var password = document.getElementById("passwordAdd").value;

    console.log("Tentando login para adicionar presente");

    // Simulação de login fictício
    if (username === "admin" && password === "1234") {
      toastr.success("Login bem-sucedido para adicionar presente");
      loginModalAddPresent.style.display = "none"; // Fecha o modal de login
      addPresentModal.style.display = "flex"; // Abre o modal de adicionar presente
    } else {
      toastr.error("Usuário ou senha incorretos.");
    }
  };

  // Função para validar o login para atualizar pagamentos
  document.getElementById("loginBtnUpdatePayments").onclick = function () {
    var username = document.getElementById("usernameUpdate").value;
    var password = document.getElementById("passwordUpdate").value;

    console.log("Tentando login para atualizar pagamentos");

    // Simulação de login fictício
    if (username === "financeiro" && password === "12345") {
      toastr.success("Login bem-sucedido para atualizar pagamentos");
      loginModalUpdatePayments.style.display = "none"; // Fecha o modal de login
      listarComprasPendentes(); // Lista as compras pendentes
      listarComprasConcluidas();
      listadepresentesprivado();
      paymentsModal.style.display = "flex"; // Abre o modal de pagamentos
    } else {
      toastr.error("Usuário ou senha incorretos.");
    }
  };

  // Função para validar os campos de entrada
  function validateInputs(nomePresente, preco, base64Image) {
    if (!nomePresente) {
      toastr.error("Por favor, insira o nome do presente.");
      return false;
    }
    if (!preco) {
      toastr.error("Por favor, insira o preço do presente.");
      return false;
    }
    if (isNaN(preco) || parseFloat(preco) <= 0) {
      toastr.error("Por favor, insira um preço válido e maior que zero.");
      return false;
    }
    if (!base64Image || base64Image.includes(".vercel.app")) {
      toastr.error("Por favor, adicione uma imagem do presente.");
      return false;
    }
    return true;
  }

  // Salvar presente na lista
  document.getElementById("savePresentBtn").onclick = async function () {
    var id = idgerador();
    var nomePresente = document.getElementById("presente").value.trim();
    var preco = document.getElementById("price").value.trim();
    var base64Image = imagePreview.src;

    // Validar entradas
    if (!validateInputs(nomePresente, preco, base64Image)) {
      return; // Interrompe se a validação falhar
    }

    console.log("Salvando presente:", nomePresente, preco);

    try {
      const presenteref = ref(database, `Presente/${id}`);
      await set(presenteref, {
        nome: nomePresente,
        preco: parseFloat(preco), // Armazena o preço como um número
        image: base64Image,
      });

      // Fecha o modal e mostra sucesso
      addPresentModal.style.display = "none";
      toastr.success("Presente adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar o presente:", error);
      toastr.error("Erro ao salvar o presente. Tente novamente mais tarde.");
    }
  };

  async function listadepresentesprivado() {
    // Lista de presentes de exemplo
    console.log("Buscando dados dos presentes...");
    const presenteref = ref(database, "Presente"); // Referência ao caminho no banco de dados
    const snapshot = await get(presenteref); // Obtém os dados do caminho referenciado
    console.log("Snapshot obtido:", snapshot.val());

    var lista = document.getElementById("presentesList"); // Seleciona o elemento da lista
    lista.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    if (snapshot.exists()) {
      const dados = snapshot.val(); // Obtém os dados
      for (const [key, value] of Object.entries(dados)) {
        // Itera sobre os dados
        var h3 = document.createElement("h3"); // Cria um novo item de lista
        var img = document.createElement("img");
        var p = document.createElement("p");
        // Corrige a referência para acessar a imagem corretamente
        img.src = value.image; // Acessa a imagem no valor atual
        img.alt = "Imagem do presente"; // Texto alternativo para a imagem
        img.style.maxWidth = "200px"; // Limita o tamanho da imagem
        console.log(img);
        h3.textContent = `${value.nome}`; // Define o texto do item
        p.textContent = `R$ ${parseFloat(value.preco).toFixed(2)}`;
        console.log("Item de lista criado:", h3.textContent);
        // Cria um botão "Selecionar"
        const button = document.createElement("button");

        button.textContent = "Excluir";
        button.onclick = () => {
          deletepresentes(key); // Chama uma função para abrir o modal
        };
        lista.appendChild(img);
        lista.appendChild(h3); // Adiciona o item à lista
        lista.appendChild(p); // Adiciona o item à lista
        lista.appendChild(button); // Adiciona o botão ao item da lista
      }
    }
  }

  async function deletepresentes(id) {
    const presenteref = ref(database, `Presente/${id}`); // Referência ao caminho no banco de dados
    const confirmacao = window.confirm("tem certeza confimar o pagamento?");
    if (confirmacao) {
      try {
        await remove(presenteref); // Obtém os dados do caminho referenciado
        paymentsModal.style.display = "none";
        toastr.success("Presente deletado com sucesso");
      } catch (error) {
        toastr.error("error ao deletar");
        console.error(error);
      }
    }
  }

  async function buscardados() {
    // Lista de presentes de exemplo
    console.log("Buscando dados dos presentes...");
    const presenteref = ref(database, "Presente"); // Referência ao caminho no banco de dados
    const snapshot = await get(presenteref); // Obtém os dados do caminho referenciado
    console.log("Snapshot obtido:", snapshot.val());

    var lista = document.getElementById("collection-item"); // Seleciona o elemento da lista
    lista.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    if (snapshot.exists()) {
      const dados = snapshot.val(); // Obtém os dados
      for (const [key, value] of Object.entries(dados)) {
        // Itera sobre os dados
        var h3 = document.createElement("h3"); // Cria um novo item de lista
        var img = document.createElement("img");
        var p = document.createElement("p");
        // Corrige a referência para acessar a imagem corretamente
        img.src = value.image; // Acessa a imagem no valor atual
        img.alt = "Imagem do presente"; // Texto alternativo para a imagem
        img.style.maxWidth = "200px"; // Limita o tamanho da imagem
        console.log(img);
        h3.textContent = `${value.nome}`; // Define o texto do item
        p.textContent = `R$ ${parseFloat(value.preco).toFixed(2)}`;
        console.log("Item de lista criado:", h3.textContent);
        // Cria um botão "Selecionar"
        const button = document.createElement("button");

        button.textContent = "Selecionar";
        button.onclick = () => {
          selecionarPresente(value.nome, value.preco); // Chama uma função para abrir o modal
        };
        lista.appendChild(img);
        lista.appendChild(h3); // Adiciona o item à lista
        lista.appendChild(p); // Adiciona o item à lista
        lista.appendChild(button); // Adiciona o botão ao item da lista
      }
    }
  }

  await buscardados();

  // Selecionar presente e abrir modal de confirmação
  function selecionarPresente(nome, preco) {
    console.log("Presente selecionado:", nome, preco);
    selectedPresent = { nome, preco };
    console.log(selectedPresent);
    document.getElementById(
      "confirmText"
    ).textContent = `Você selecionou o presente: ${nome} - R$ ${preco}`;
    confirmModal.style.display = "flex"; // Abre o modal de confirmação
  }

  // Função para validar os campos de compra
  function validatePurchaseInputs(fullName, phoneNumber) {
    // Verifica se o nome completo foi inserido e contém pelo menos dois componentes
    const nomeDividido = fullName.trim().split(" ");
    if (nomeDividido.length < 2) {
      toastr.error("Por favor, insira seu nome completo (nome e sobrenome).");
      return false;
    }
    // Verifica se o número de telefone foi inserido
    if (!fullName) {
      toastr.error("Por favor, insira seu nome completo.");
      return false;
    }

    // Verifica se o número de telefone foi inserido
    if (!phoneNumber) {
      toastr.error("Por favor, insira seu número de telefone.");
      return false;
    }

    // Validação do formato do número de telefone (aceita números com 8 ou 9 dígitos)
    const phonePattern = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Exemplo: (11) 91234-5678 ou (11) 1234-5678
    if (!phonePattern.test(phoneNumber)) {
      toastr.error(
        "Por favor, insira um número de telefone válido no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX."
      );
      return false;
    }

    return true; // Se tudo estiver certo, retorna verdadeiro
  }

  // Confirmar compra
  document.getElementById("confirmPurchaseBtn").onclick = async function () {
    const key = idgerador();
    var fullName = document.getElementById("fullName").value.trim();
    var phoneNumber = document.getElementById("phoneNumber").value.trim();

    // Validar entradas
    if (!validatePurchaseInputs(fullName, phoneNumber)) {
      return; // Interrompe se a validação falhar
    }

    console.log("Confirmando compra:", fullName, phoneNumber);

    try {
      const comprasref = ref(database, `Compras/${key}`);
      await set(comprasref, {
        nome: fullName,
        telefone: phoneNumber,
        presente: selectedPresent.nome,
        preco: selectedPresent.preco,
        status: "pendente",
      });

      comprasPendentes.push({
        nome: fullName,
        telefone: phoneNumber,
        presente: selectedPresent.nome,
        preco: selectedPresent.preco,
        status: "pendente",
      });

      // Fechar o modal de confirmação e abrir o de pagamento
      confirmModal.style.display = "none";
      pixModal.style.display = "flex";
      toastr.success("Compra salva com sucesso!"); // Corrigido para 'success'
    } catch (error) {
      console.error("Erro ao salvar a compra:", error);
      toastr.error("Erro ao salvar a compra. Tente novamente mais tarde.");
    }
  };

  // Listar compras pendentes
  async function listarComprasPendentes() {
    try {
      console.log("Listando compras pendentes...");
      const comprasref = ref(database, "Compras");
      const snapshot = await get(comprasref);
      const listaPagamentos = document.getElementById("pendingPaymentsList");
      listaPagamentos.innerHTML = "";

      if (snapshot.exists()) {
        const compras = snapshot.val();
        for (const [key, compra] of Object.entries(compras)) {
          if (compra.status === "pendente") {
            var li = document.createElement("li");
            li.textContent = `${compra.nome} - ${compra.presente} - R$ ${compra.preco} - ${compra.telefone} - ${compra.status}`;
            listaPagamentos.appendChild(li);
            window;
            const button = document.createElement("button");
            button.textContent = "Confirmar Pagamento";

            button.onclick = async () => {
              const confirmacao = window.confirm(
                "tem certeza confimar o pagamento?"
              );
              if (confirmacao) {
                try {
                  await update(ref(database, `Compras/${key}`), {
                    status: "pagamento concluído",
                  });
                  listarComprasPendentes(); // Atualiza a lista após confirmar
                  toastr.success("Pagamento confirmado com sucesso!"); // Mensagem de sucesso
                } catch (error) {
                  console.error("Erro ao atualizar o status da compra:", error);
                  toastr.error(
                    "Erro ao atualizar o status. Tente novamente mais tarde."
                  ); // Mensagem de erro
                }
              }
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

  // Listar compras pendentes
  async function listarComprasConcluidas() {
    try {
      console.log("Listando compras Concluidas...");
      const comprasref = ref(database, "Compras");
      const snapshot = await get(comprasref);
      const listaPagamentos = document.getElementById("checkPaymentsList");
      listaPagamentos.innerHTML = "";

      if (snapshot.exists()) {
        const compras = snapshot.val();
        for (const [key, compra] of Object.entries(compras)) {
          if (compra.status === "pagamento concluído") {
            var li = document.createElement("li");
            // Crie elementos separados para nome, presente, preço, telefone e status
            var nomeSpan = document.createElement("span");
            var presenteSpan = document.createElement("span");
            var precoSpan = document.createElement("span");
            var telefoneSpan = document.createElement("span");
            var statusSpan = document.createElement("span");

            // Adicione o conteúdo formatado para cada elemento
            nomeSpan.textContent = `${compra.nome}`;
            presenteSpan.textContent = ` - ${compra.presente}`;
            precoSpan.textContent = ` - R$ ${compra.preco}`;
            telefoneSpan.textContent = ` - ${compra.telefone}`;
            statusSpan.textContent = ` - ${compra.status}`;

            // Estilize os elementos individualmente, se necessário
            nomeSpan.style.fontWeight = "bold"; // Negrito para o nome
            precoSpan.style.color = "#007bff"; // Azul para o preço
            statusSpan.style.fontStyle = "italic"; // Itálico para o status

            // Adicione os elementos <span> ao <li>
            li.appendChild(nomeSpan);
            li.appendChild(presenteSpan);
            li.appendChild(precoSpan);
            li.appendChild(telefoneSpan);
            li.appendChild(statusSpan);
            listaPagamentos.appendChild(li);
          }
        }
      } else {
        var li = document.createElement("li");
        li.textContent = "Nenhuma compra pendente.";
        listaPagamentos.appendChild(li);
      }
    } catch (error) {
      console.error("Erro ao listar compras Concluidas:", error);
      toast.error("Erro ao listar compras Concluidas:", error);
    }
  }

  // Listar compras Concluidas
  searchBtn.onclick = async function () {
    try {
      console.log("Listando infomações pelo telefone...");
      const comprasref = ref(database, "Compras");
      const snapshot = await get(comprasref);
      const listaPagamentos = document.getElementById("phonePaymentsList");
      listaPagamentos.innerHTML = "";
      const searchPhoneNumber =
        document.getElementById("searchPhoneNumber").value;
      // Validação simples para o formato do número de telefone
      const phonePattern = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Exemplo: (11) 91234-5678
      if (!phonePattern.test(searchPhoneNumber)) {
        toastr.error(
          "Por favor, insira um número de telefone válido no formato (XX) XXXXX-XXXX."
        );
        return false;
      }
      if (snapshot.exists()) {
        const compras = snapshot.val();
        for (const [key, compra] of Object.entries(compras)) {
          if (compra.telefone === searchPhoneNumber) {
            var li = document.createElement("li");
            // Crie elementos separados para nome, presente, preço, telefone e status
            var nomeSpan = document.createElement("span");
            var presenteSpan = document.createElement("span");
            var precoSpan = document.createElement("span");
            var telefoneSpan = document.createElement("span");
            var statusSpan = document.createElement("span");

            // Adicione o conteúdo formatado para cada elemento
            nomeSpan.textContent = `${compra.nome}`;
            presenteSpan.textContent = ` - ${compra.presente}`;
            precoSpan.textContent = ` - R$ ${compra.preco}`;
            telefoneSpan.textContent = ` - ${compra.telefone}`;
            statusSpan.textContent = ` - ${compra.status}`;

            // Estilize os elementos individualmente, se necessário
            nomeSpan.style.fontWeight = "bold"; // Negrito para o nome
            precoSpan.style.color = "#007bff"; // Azul para o preço
            statusSpan.style.fontStyle = "italic"; // Itálico para o status

            // Adicione os elementos <span> ao <li>
            li.appendChild(nomeSpan);
            li.appendChild(presenteSpan);
            li.appendChild(precoSpan);
            li.appendChild(telefoneSpan);
            li.appendChild(statusSpan);
            listaPagamentos.appendChild(li);
          }
        }
      } else {
        var li = document.createElement("li");
        li.textContent = "Nenhuma compra encontrada.";
        listaPagamentos.appendChild(li);
      }
    } catch (error) {
      console.error("Erro ao listar compras encontrada:", error);
    }
  };

  // Função para copiar o texto
  copybtnchave.onclick = function () {
    pixKey.select();
    pixKey.setSelectionRange(0, 99999); // Para dispositivos móveis
    document.execCommand("copy");
    toastr.success("Copiado: " + pixKey.value);
  };

  copybtncopia.onclick = function () {
    pixCopyPaste.select();
    pixCopyPaste.setSelectionRange(0, 99999); // Para dispositivos móveis
    document.execCommand("copy");
    toastr.success("Copiado: " + pixCopyPaste.value);
  };

  // Função para pré-visualizar a imagem
  imageUpload.addEventListener("change", function (event) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block"; // Exibe a imagem
      };
      reader.readAsDataURL(file); // Converte a imagem para base64
    } else {
      imagePreview.style.display = "none"; // Oculta a pré-visualização se não houver imagem
    }
  });

  function aplicarMascaraTelefone(event) {
    let input = event.target;
    let valor = input.value.replace(/\D/g, ""); // Remove tudo que não é número

    // Limita o número de dígitos a 11 (2 para o DDD + 9 para o número de telefone)
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    let valorFormatado = "";

    if (valor.length > 0) {
      valorFormatado = "(" + valor.substring(0, 2); // Adiciona o DDD
    }
    if (valor.length >= 3) {
      valorFormatado += ") " + valor.substring(2, 7); // Adiciona espaço e primeiros cinco números
    }
    if (valor.length >= 8) {
      valorFormatado += "-" + valor.substring(7, 11); // Adiciona o hífen e últimos quatro números
    }

    input.value = valorFormatado; // Atualiza o valor do input
  }

  document
    .getElementById("searchPhoneNumber")
    .addEventListener("input", aplicarMascaraTelefone);
  document
    .getElementById("phoneNumber")
    .addEventListener("input", aplicarMascaraTelefone);
});
