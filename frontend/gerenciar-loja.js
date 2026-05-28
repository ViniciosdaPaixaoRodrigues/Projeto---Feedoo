// ============================================
// GERENCIAR LOJA - PRODUTOS
// ============================================

let lojaId = null;
let produtoEditando = null;

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Pegar loja_id da URL
  const params = new URLSearchParams(window.location.search);
  lojaId = params.get('id');

  if (!lojaId) {
    alert('Loja não encontrada!');
    window.location.href = 'dashboard-empresa.html';
    return;
  }

  // Carregar produtos ao abrir a página
  loadProdutos();

  // Configurar tabs
  setupTabs();
});

// ============================================
// TABS
// ============================================

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      // Remove active de todos
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Adiciona active no clicado
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });
}

// ============================================
// CARREGAR PRODUTOS
// ============================================

async function loadProdutos() {
  try {
    const produtos = await apiGetProdutos(lojaId);
    renderProdutos(produtos);
    renderEstoqueBaixo(produtos);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    showToast('Erro ao carregar produtos', 'error');
  }
}

// ============================================
// RENDERIZAR PRODUTOS
// ============================================

function renderProdutos(produtos) {
  const grid = document.getElementById('produtosGrid');
  const totalSpan = document.getElementById('totalProdutos');

  totalSpan.textContent = produtos.length;

  if (produtos.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">Nenhum produto cadastrado</p>';
    return;
  }

  grid.innerHTML = produtos.map(produto => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${produto.nome}</h3>
          <p class="card-subtitle">${produto.categoria || 'Sem categoria'}</p>
        </div>
        <span class="badge ${produto.disponivel ? 'badge-success' : 'badge-danger'}">
          ${produto.disponivel ? 'Disponível' : 'Indisponível'}
        </span>
      </div>

      <div class="card-content" style="font-size: 13px; color: var(--text-light); line-height: 1.8;">
        <p>${produto.descricao || 'Sem descrição'}</p>
        <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
        <p><strong>Estoque:</strong> ${produto.quantidade || 0} unidades</p>
        <p><strong>Tempo de preparo:</strong> ${produto.tempo_preparo || '--'} min</p>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline" onclick="editProduto(${produto.id})">Editar</button>
        <button class="btn btn-outline" onclick="deleteProduto(${produto.id})">Deletar</button>
      </div>
    </div>
  `).join('');
}

// ============================================
// RENDERIZAR ESTOQUE BAIXO
// ============================================

function renderEstoqueBaixo(produtos) {
  const grid = document.getElementById('estoqueGrid');
  const estoqueBaixo = produtos.filter(p => p.quantidade <= (p.aviso_reposicao || 5));

  if (estoqueBaixo.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">Nenhum produto com estoque baixo</p>';
    return;
  }

  grid.innerHTML = estoqueBaixo.map(produto => `
    <div class="card" style="border-left: 4px solid var(--color-danger);">
      <div class="card-header">
        <div>
          <h3 class="card-title">${produto.nome}</h3>
          <p class="card-subtitle">${produto.categoria || 'Sem categoria'}</p>
        </div>
      </div>

      <div class="card-content" style="font-size: 13px; color: var(--text-light);">
        <p><strong>Estoque atual:</strong> ${produto.quantidade || 0} unidades</p>
        <p><strong>Aviso:</strong> ${produto.aviso_reposicao || 5} unidades</p>
      </div>

      <div class="card-footer">
        <button class="btn btn-primary" onclick="editProduto(${produto.id})">Repor Estoque</button>
      </div>
    </div>
  `).join('');
}

// ============================================
// MODAL - NOVO PRODUTO
// ============================================

function openNovoProdutoModal() {
  produtoEditando = null;
  document.getElementById('modalProdutoTitle').textContent = 'Criar Novo Produto';
  document.getElementById('formProduto').reset();
  openModal('modalProduto');
}

// ============================================
// MODAL - EDITAR PRODUTO
// ============================================

async function editProduto(produtoId) {
  try {
    const produto = await apiGetProduto(lojaId, produtoId);
    produtoEditando = produto;

    // Preencher formulário
    document.getElementById('prod-nome').value = produto.nome;
    document.getElementById('prod-descricao').value = produto.descricao || '';
    document.getElementById('prod-categoria').value = produto.categoria || '';
    document.getElementById('prod-preco').value = produto.preco;
    document.getElementById('prod-quantidade').value = produto.quantidade || 0;
    document.getElementById('prod-aviso').value = produto.aviso_reposicao || 0;
    document.getElementById('prod-tempo').value = produto.tempo_preparo || 15;
    document.getElementById('prod-imagem').value = produto.imagem_url || '';

    document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
    openModal('modalProduto');
  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    showToast('Erro ao carregar produto', 'error');
  }
}

// ============================================
// SALVAR PRODUTO
// ============================================

async function handleSaveProduto(event) {
  event.preventDefault();

  const dados = {
    nome: document.getElementById('prod-nome').value,
    descricao: document.getElementById('prod-descricao').value || null,
    categoria: document.getElementById('prod-categoria').value || null,
    preco: parseFloat(document.getElementById('prod-preco').value),
    quantidade: parseInt(document.getElementById('prod-quantidade').value) || 0,
    aviso_reposicao: parseInt(document.getElementById('prod-aviso').value) || 0,
    tempo_preparo: parseInt(document.getElementById('prod-tempo').value) || 15,
    imagem_url: document.getElementById('prod-imagem').value || ''
  };

  try {
    if (produtoEditando) {
      // Atualizar
      await apiUpdateProduto(lojaId, produtoEditando.id, dados);
      showToast('Produto atualizado com sucesso', 'success');
    } else {
      // Criar
      await apiCreateProduto(lojaId, dados);
      showToast('Produto criado com sucesso', 'success');
    }

    closeModal('modalProduto');
    loadProdutos();
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    showToast(error.message || 'Erro ao salvar produto', 'error');
  }
}

// ============================================
// DELETAR PRODUTO
// ============================================

async function deleteProduto(produtoId) {
  if (!confirm('Tem certeza que deseja deletar este produto?')) {
    return;
  }

  try {
    await apiDeleteProduto(lojaId, produtoId);
    showToast('Produto deletado com sucesso', 'success');
    loadProdutos();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    showToast(error.message || 'Erro ao deletar produto', 'error');
  }
}

// ============================================
// MODAL - FUNÇÕES AUXILIARES
// ============================================

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// ============================================
// TOAST - NOTIFICAÇÕES
// ============================================

function showToast(message, type = 'info') {
  // Se você tem uma biblioteca de toast, use aqui
  // Caso contrário, console.log é suficiente por enquanto
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Opcional: Mostrar alert simples
  // alert(message);
}

// ============================================
// HORÁRIOS (PLACEHOLDER)
// ============================================

function saveHorarios() {
  alert('Funcionalidade de horários será implementada em breve');
}
