const PRODUTOS_POR_PAGINA = 10;

let paginaAtual = 1;
let produtosFiltrados = [];
let categoriaAtual = "Todos";
let termoBusca = "";

let produtos = [];

async function carregarProdutos() {
  try {

    const response = await fetch(
      'http://localhost:3001/api/produtos'
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Erro ao carregar produtos'
      );
    }

    produtos = result.data || [];

    aplicarFiltros();

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar catálogo');
  }
}

const carrinho =
JSON.parse(localStorage.getItem("carrinho")) || [];

const produtosContainer =
document.getElementById("produtos");

function renderProdutos(lista){

  produtosContainer.innerHTML = "";

  if(lista.length === 0){

    produtosContainer.innerHTML = `
      <div class="card">
        <div class="card-content">
          <h3>Nenhum produto encontrado</h3>
          <p>Tente alterar os filtros.</p>
        </div>
      </div>
    `;

    return;
  }

  lista.forEach(produto=>{

    produtosContainer.innerHTML += `
      <div class="card">

        <div class="card-image">
          <img src="${produto.imagem_url}">
        </div>

        <div class="card-content">

          <h3>${produto.nome}</h3>

          <p>${produto.descricao}</p>

          <h4>R$ ${parseFloat(produto.preco).toFixed(2)}</h4>

        </div>

        <div class="card-footer">

          <button
            class="btn btn-primary"
            onclick="addCarrinho(${produto.id})">

            Adicionar

          </button>

        </div>

      </div>
    `;
  });
}

function renderPagina() {

  const inicio =
    (paginaAtual - 1) * PRODUTOS_POR_PAGINA;

  const fim =
    inicio + PRODUTOS_POR_PAGINA;

  const produtosPagina =
    produtosFiltrados.slice(inicio, fim);

  renderProdutos(produtosPagina);

  atualizarPaginacao();
}

function aplicarFiltros() {

  produtosFiltrados = produtos.filter(produto => {

    const atendeCategoria =
      categoriaAtual === "Todos" ||
      (produto.categoria || "") === categoriaAtual;

    const atendeBusca =
      (produto.nome || "")
  .toLowerCase()
  .includes(termoBusca.toLowerCase())

    return atendeCategoria && atendeBusca;
  });

  paginaAtual = 1;
  renderPagina();
}

function atualizarPaginacao() {

  const totalPaginas =
    Math.ceil(
      produtosFiltrados.length /
      PRODUTOS_POR_PAGINA
    );

  document.getElementById("pagina-info")
    .textContent =
    `Página ${paginaAtual} de ${Math.max(totalPaginas,1)}`;

  document.getElementById("btn-anterior")
    .disabled =
    paginaAtual === 1;

  document.getElementById("btn-proxima")
    .disabled =
    paginaAtual === totalPaginas ||
    totalPaginas === 0;
}

document
.getElementById("btn-anterior")
.addEventListener("click", () => {

  if(paginaAtual > 1){

    paginaAtual--;
    renderPagina();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
});

document
.getElementById("btn-proxima")
.addEventListener("click", () => {

  const totalPaginas =
    Math.ceil(
      produtosFiltrados.length /
      PRODUTOS_POR_PAGINA
    );

  if(paginaAtual < totalPaginas){

    paginaAtual++;
    renderPagina();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
});

function addCarrinho(id){

  const produto =
    produtos.find(p => p.id === id);

    if(!produto){
      return;
    }

  carrinho.push({
    ...produto,
    preco: parseFloat(produto.preco)
  });

  localStorage.setItem(
    "carrinho",
    JSON.stringify(carrinho)
  );

  atualizarCarrinho();
}

function removerUmaUnidade(id){

  const index =
  carrinho.findIndex(item => item.id === id);

  if(index !== -1){

    carrinho.splice(index,1);

    localStorage.setItem(
      "carrinho",
      JSON.stringify(carrinho)
    );
  }

  atualizarCarrinho();
}

function atualizarCarrinho(){

  const cartItems =
  document.getElementById("cart-items");

  const cartCount =
  document.getElementById("cart-count");

  const cartTotal =
  document.getElementById("cart-total");

  const btnFinalizar =
  document.getElementById("btn-finalizar");

  cartItems.innerHTML = "";

  if(carrinho.length === 0){

    cartItems.innerHTML = `
      <div class="carrinho-vazio">

        <div class="carrinho-vazio-icon">
          🛒
        </div>

        <h4>Seu carrinho está vazio</h4>

        <p>
          Adicione produtos para começar seu pedido.
        </p>

      </div>
    `;

    cartCount.innerText = 0;
    cartTotal.innerText = "0.00";

    btnFinalizar.classList.add("hidden");

    return;
  }

  let total = 0;

  const itensAgrupados = {};

  carrinho.forEach(item => {

    if(!itensAgrupados[item.id]){
      itensAgrupados[item.id] = {
        ...item,
        quantidade: 0
      };
    }

    itensAgrupados[item.id].quantidade++;
  });

  Object.values(itensAgrupados).forEach(item => {

    const subtotal =
    item.preco * item.quantidade;

    total += subtotal;

    cartItems.innerHTML += `
      <div class="item-carrinho">

        <span>
          ${item.nome}
          x${item.quantidade}
          - R$ ${subtotal.toFixed(2)}
        </span>

        <button
          class="btn-remover"
          onclick="removerUmaUnidade(${item.id})">

          ✕

        </button>

      </div>
    `;
  });

  cartCount.innerText =
  carrinho.length;

  cartTotal.innerText =
  total.toFixed(2);

  btnFinalizar.classList.remove("hidden");
}

document
.getElementById("busca")
.addEventListener("input", function(){

  termoBusca = this.value;
  aplicarFiltros();
});

document
.getElementById("btn-finalizar")
.addEventListener("click", () => {

  if(carrinho.length === 0){
    return;
  }

  window.location.href =
  "checkout.html";

});

const botoesCategoria =
document.querySelectorAll(".categoria");

botoesCategoria.forEach(botao => {

  botao.addEventListener("click", () => {

    document
      .querySelector(".categoria.active")
      ?.classList.remove("active");

    botao.classList.add("active");

    const categoria =
    botao.textContent.trim();

    categoriaAtual = categoria;
    aplicarFiltros();
  });

});

carregarProdutos();
atualizarCarrinho();