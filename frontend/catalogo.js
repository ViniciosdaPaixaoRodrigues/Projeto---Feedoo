const produtos = [
  {
    id:1,
    nome:"X-Burger Especial",
    descricao:"Pão brioche, cheddar e bacon",
    preco:24.90,
    categoria:"Lanches",
    imagem:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
  },

  {
    id:2,
    nome:"Batata Frita",
    descricao:"Porção crocante",
    preco:15.90,
    categoria:"Acompanhamentos",
    imagem:"https://images.unsplash.com/photo-1576107232684-1279f390859f"
  },

  {
    id:3,
    nome:"Refrigerante",
    descricao:"Lata 350ml",
    preco:7.00,
    categoria:"Bebidas",
    imagem:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },

  {
    id:4,
    nome:"Brownie",
    descricao:"Chocolate artesanal",
    preco:12.00,
    categoria:"Doces",
    imagem:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c"
  },

  {
    id:5,
    nome:"Salada Caesar",
    descricao:"Alface, frango e parmesão",
    preco:22.90,
    categoria:"Saudável",
    imagem:"https://images.unsplash.com/photo-1546793665-c74683f339c1"
  },

  {
    id:6,
    nome:"X-Bacon",
    descricao:"Hambúrguer artesanal com bacon",
    preco:29.90,
    categoria:"Lanches",
    imagem:"https://images.unsplash.com/photo-1550547660-d9450f859349"
  }
];

const carrinho =
JSON.parse(localStorage.getItem("carrinho")) || [];

const produtosContainer =
document.getElementById("produtos");

function renderProdutos(lista){

  produtosContainer.innerHTML = "";

  lista.forEach(produto=>{

    produtosContainer.innerHTML += `
      <div class="card">

        <div class="card-image">
          <img src="${produto.imagem}">
        </div>

        <div class="card-content">

          <h3>${produto.nome}</h3>

          <p>${produto.descricao}</p>

          <h4>R$ ${produto.preco.toFixed(2)}</h4>

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

function addCarrinho(id){

  const produto =
  produtos.find(p => p.id === id);

  carrinho.push(produto);

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

  const termo =
  this.value.toLowerCase();

  const filtrados =
  produtos.filter(produto =>
    produto.nome.toLowerCase().includes(termo)
  );

  renderProdutos(filtrados);
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

    if(categoria === "Todos"){

      renderProdutos(produtos);

      return;
    }

    const filtrados =
    produtos.filter(produto =>
      produto.categoria === categoria
    );

    renderProdutos(filtrados);
  });

});

renderProdutos(produtos);
atualizarCarrinho();