// Gerenciar Loja - JavaScript

// Dados de exemplo (será integrado com MySQLx de Rust)
let produtos = [
  {
    id: 1,
    nome: 'X-Burger',
    descricao: 'Hambúrguer suculento com queijo derretido',
    preco: 18.00,
    quantidade: 50,
    aviso_reposicao: 10,
    categoria: 'Lanches',
    imagem_url: 'https://via.placeholder.com/200',
    tempo_preparo: 15,
    disponivel: true
  },
  {
    id: 2,
    nome: 'Batata Pequena',
    descricao: 'Batata frita crocante',
    preco: 10.00,
    quantidade: 100,
    aviso_reposicao: 20,
    categoria: 'Acompanhamentos',
    imagem_url: 'https://via.placeholder.com/200',
    tempo_preparo: 5,
    disponivel: true
  }
];

let editingProdutoId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  setupTabs();
  renderProdutos();
  renderEstoqueBaixo();
});

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });

  document.querySelector('.tab-btn').classList.add('active');
}

function renderProdutos() {
  const grid = document.getElementById('produtosGrid');
  const total = document.getElementById('totalProdutos');
  
  total.textContent = produtos.length;

  if (produtos.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="color: var(--text-light); margin-bottom: 20px;">Nenhum produto cadastrado</p>
        <button class="btn btn-primary" onclick="openNovoProdutoModal()">Criar Primeiro Produto</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = produtos.map(produto => `
    <div class="card">
      <div class="card-image">
        <img src="${produto.imagem_url}" alt="${produto.nome}">
      </div>

      <div class="card-content">
        <h3 class="card-title">${produto.nome}</h3>
        <p class="card-subtitle">${produto.descricao}</p>
      </div>

      <div style="font-size: 13px; color: var(--text-light); line-height: 1.8; padding: 10px 0;">
        <div style="display: flex; justify-content: space-between;">
          <span>Preço:</span>
          <span style="font-weight: 600; color: var(--primary);">R$ ${produto.preco.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Estoque:</span>
          <span style="font-weight: 600; color: ${produto.quantidade <= produto.aviso_reposicao ? '#dc2626' : '#059669'};">
            ${produto.quantidade}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Categoria:</span>
          <span style="font-weight: 500;">${produto.categoria}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Preparo:</span>
          <span>${produto.tempo_preparo} min</span>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline" onclick="editProduto(${produto.id})">Editar</button>
        <button class="btn btn-outline" onclick="deleteProduto(${produto.id})">Deletar</button>
      </div>
    </div>
  `).join('');
}

function renderEstoqueBaixo() {
  const grid = document.getElementById('estoqueGrid');
  const produtosBaixo = produtos.filter(p => p.quantidade <= p.aviso_reposicao);

  if (produtosBaixo.length === 0) {
    grid.innerHTML = `
      <div class="card" style="text-align: center; padding: 30px;">
        <p style="color: var(--text-light);">✓ Todos os produtos têm estoque adequado</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = produtosBaixo.map(produto => `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 class="card-title">${produto.nome}</h3>
          <p class="card-subtitle">Estoque: ${produto.quantidade} (Mínimo: ${produto.aviso_reposicao})</p>
        </div>
        <button class="btn btn-primary" onclick="editProduto(${produto.id})">Repor</button>
      </div>
    </div>
  `).join('');
}

function openNovoProdutoModal() {
  editingProdutoId = null;
  document.getElementById('modalProdutoTitle').textContent = 'Criar Novo Produto';
  document.getElementById('formProduto').reset();
  document.getElementById('prod-categoria').value = 'Lanches';
  document.getElementById('prod-tempo').value = '15';
  openModal('modalProduto');
}

function editProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  editingProdutoId = id;
  document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
  
  document.getElementById('prod-nome').value = produto.nome;
  document.getElementById('prod-descricao').value = produto.descricao;
  document.getElementById('prod-categoria').value = produto.categoria;
  document.getElementById('prod-preco').value = produto.preco;
  document.getElementById('prod-quantidade').value = produto.quantidade;
  document.getElementById('prod-aviso').value = produto.aviso_reposicao;
  document.getElementById('prod-tempo').value = produto.tempo_preparo;
  document.getElementById('prod-imagem').value = produto.imagem_url;

  openModal('modalProduto');
}

function deleteProduto(id) {
  if (confirm('Tem certeza que deseja deletar este produto?')) {
    produtos = produtos.filter(p => p.id !== id);
    renderProdutos();
    renderEstoqueBaixo();
    alert('Produto deletado com sucesso!');
  }
}

function handleSaveProduto(event) {
  event.preventDefault();

  const nome = document.getElementById('prod-nome').value;
  const preco = parseFloat(document.getElementById('prod-preco').value);

  if (!nome || !preco) {
    alert('Preencha os campos obrigatórios');
    return;
  }

  const produtoData = {
    nome,
    descricao: document.getElementById('prod-descricao').value,
    categoria: document.getElementById('prod-categoria').value,
    preco,
    quantidade: parseInt(document.getElementById('prod-quantidade').value) || 0,
    aviso_reposicao: parseInt(document.getElementById('prod-aviso').value) || 0,
    tempo_preparo: parseInt(document.getElementById('prod-tempo').value) || 15,
    imagem_url: document.getElementById('prod-imagem').value,
    disponivel: true
  };

  if (editingProdutoId) {
    const index = produtos.findIndex(p => p.id === editingProdutoId);
    if (index !== -1) {
      produtos[index] = { ...produtos[index], ...produtoData };
      alert('Produto atualizado com sucesso!');
    }
  } else {
    const newId = Math.max(...produtos.map(p => p.id), 0) + 1;
    produtos.push({ id: newId, ...produtoData });
    alert('Produto criado com sucesso!');
  }

  closeModal('modalProduto');
  renderProdutos();
  renderEstoqueBaixo();
}

function saveHorarios() {
  const abertura = document.getElementById('horario-abertura').value;
  const fechamento = document.getElementById('horario-fechamento').value;

  console.log('Horários salvos:', { abertura, fechamento });
  alert('Horários salvos com sucesso!');
}

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}
