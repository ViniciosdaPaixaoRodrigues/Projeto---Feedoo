const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let carrinho = [];

/* DADOS (SIMULANDO BANCO) */
const cardapio = {
  lanches: [
    { nome: "X-Burger", preco: 18, img: "https://via.placeholder.com/100" },
    { nome: "X-Salada", preco: 20, img: "https://via.placeholder.com/100" },
    { nome: "X-Bacon", preco: 22, img: "https://via.placeholder.com/100" },
    { nome: "X-Tudo", preco: 28, img: "https://via.placeholder.com/100" },
    { nome: "Cheeseburger", preco: 17, img: "https://via.placeholder.com/100" }
  ],

  acompanhamentos: [
    { nome: "Batata Pequena", preco: 10, img: "https://via.placeholder.com/100" },
    { nome: "Batata Média", preco: 14, img: "https://via.placeholder.com/100" },
    { nome: "Batata Grande", preco: 18, img: "https://via.placeholder.com/100" },
    { nome: "Onion Rings", preco: 16, img: "https://via.placeholder.com/100" }
  ],

  bebidas: [
    { nome: "Coca-Cola Lata", preco: 6, img: "https://via.placeholder.com/100" },
    { nome: "Guaraná Lata", preco: 6, img: "https://via.placeholder.com/100" },
    { nome: "Suco Natural", preco: 8, img: "https://via.placeholder.com/100" },
    { nome: "Água", preco: 4, img: "https://via.placeholder.com/100" }
  ]
};

/* CARREGAR RESTAURANTE */
async function carregar() {
  const res = await fetch("http://localhost:3000/produtos");
  const produtos = await res.json();

  const restaurante = produtos.find(p => p.id == id);

  document.getElementById("nomeRestaurante").innerText = restaurante.nome;
  document.getElementById("capaImg").src = restaurante.imagem;

  renderLista("listaLanches", cardapio.lanches);
  renderLista("listaAcompanhamentos", cardapio.acompanhamentos);
  renderLista("listaBebidas", cardapio.bebidas);
}

/* RENDER LISTA */
function renderLista(idDiv, lista) {
  const div = document.getElementById(idDiv);
  div.innerHTML = "";

  lista.forEach(p => {
    div.innerHTML += `
      <div class="item" onclick="adicionar('${p.nome}', ${p.preco})">
        <div>
          <h3>${p.nome}</h3>
          <p>Produto delicioso preparado na hora</p>
          <strong>R$ ${p.preco}</strong>
        </div>
        <img src="${p.img}">
      </div>
    `;
  });
}

/* ADICIONAR */
function adicionar(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
}

/* SCROLL */
function scrollPara(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

/* CARRINHO */
function toggleCarrinho() {
  document.getElementById("carrinho").classList.toggle("hidden");
}

function atualizarCarrinho() {
  const itens = document.getElementById("itens");
  itens.innerHTML = "";

  let total = 0;

  carrinho.forEach(p => {
    total += p.preco;
    itens.innerHTML += `<p>${p.nome} - R$ ${p.preco}</p>`;
  });

  document.getElementById("total").innerText = "Total: R$ " + total.toFixed(2);
}

function finalizarPedido() {
  alert("Pedido enviado com sucesso!");
  carrinho = [];
  atualizarCarrinho();
}

function voltar() {
  window.location.href = "index.html";
}

carregar();
