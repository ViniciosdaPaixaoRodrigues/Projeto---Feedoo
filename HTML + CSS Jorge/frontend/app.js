let produtos = [];
let carrinho = [];
let selecionado = null;

/* ELEMENTOS */
const container = document.getElementById("produtos");
const busca = document.getElementById("busca");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalNome = document.getElementById("modalNome");
const modalPreco = document.getElementById("modalPreco");

const carrinhoEl = document.getElementById("carrinho");
const itens = document.getElementById("itens");
const totalEl = document.getElementById("total");

/* CARREGAR PRODUTOS */
async function carregar() {
  mostrarSkeleton();

  try {
    const res = await fetch("http://localhost:3000/produtos");
    produtos = await res.json();

    render(produtos);
  } catch (erro) {
    container.innerHTML = "<p>Erro ao carregar produtos</p>";
    console.error(erro);
  }
}

/* RENDER */
function render(lista) {
  container.innerHTML = "";

  lista.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="irParaRestaurante(${p.id})">
        <img src="${p.imagem}">
        <div class="card-content">
          <h3>${p.nome}</h3>
          <div class="info">
            <span>⭐ 4.8</span>
            <span>30-40 min</span>
          </div>
          <p class="preco">R$ ${p.preco}</p>
        </div>
      </div>
    `;
  });
}

/* REDIRECIONAMENTO */
function irParaRestaurante(id) {
  window.location.href = `restaurante.html?id=${id}`;
}

/* BUSCA */
busca.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  render(filtrados);
});

/* MODAL */
function abrir(id) {
  selecionado = produtos.find(p => p.id === id);

  modalImg.src = selecionado.imagem;
  modalNome.innerText = selecionado.nome;
  modalPreco.innerText = "R$ " + selecionado.preco;

  modal.classList.add("ativo");
}

function fecharModal() {
  modal.classList.remove("ativo");
}

modal.addEventListener("click", (e) => {
  if (e.target.id === "modal") {
    fecharModal();
  }
});

/* CARRINHO */
function adicionarCarrinho() {
  if (!selecionado) return;

  carrinho.push(selecionado);
  atualizarCarrinho();
  fecharModal();
}

function toggleCarrinho() {
  carrinhoEl.classList.toggle("hidden");
}

function atualizarCarrinho() {
  itens.innerHTML = "";

  let total = 0;

  carrinho.forEach(p => {
    total += p.preco;
    itens.innerHTML += `<p>${p.nome} - R$ ${p.preco}</p>`;
  });

  totalEl.innerText = "Total: R$ " + total.toFixed(2);
}

function finalizarPedido() {
  if (carrinho.length === 0) return alert("Carrinho vazio");

  alert("Pedido realizado com sucesso!");
  carrinho = [];
  atualizarCarrinho();
}

/* SKELETON */
function mostrarSkeleton() {
  container.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    container.innerHTML += `<div class="skeleton"></div>`;
  }
}

/* INIT */
carregar();