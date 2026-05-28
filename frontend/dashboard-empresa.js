// Dashboard Empresa - JavaScript (ADAPTADO PARA MYSQL)

let lojas = [];
let editingLojaId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando dashboard...');
  loadLojas();
  setupTabFunctionality();
});

// ============================================
// CARREGAR LOJAS DO BANCO DE DADOS
// ============================================

async function loadLojas() {
  try {
    const empresaId = localStorage.getItem('empresa_id');
    
    if (!empresaId) {
      alert('Você precisa estar logado como empresa');
      window.location.href = 'login-empresa.html';
      return;
    }
    
    console.log('Carregando lojas da API...');
    
    const response = await fetch(`http://localhost:3001/api/empresas/${empresaId}/lojas` );
    
    if (!response.ok) {
      throw new Error('Erro ao carregar lojas');
    }
    
    const data = await response.json();
    console.log('Resposta da API:', data);
    
    // Extrair dados da resposta
    lojas = data.data || data || [];
    
    console.log('Lojas carregadas:', lojas);
    renderLojas();
  } catch (error) {
    console.error('Erro ao carregar lojas:', error);
    alert('Erro ao carregar lojas: ' + error.message);
  }
}

// ============================================
// RENDERIZAR LOJAS NA TELA
// ============================================

function renderLojas() {
  const grid = document.getElementById('lojasGrid');
  const totalLojas = document.getElementById('totalLojas');
  
  if (!grid) {
    console.error('Elemento #lojasGrid não encontrado no HTML');
    return;
  }
  
  totalLojas.textContent = lojas.length;
  
  if (lojas.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="color: var(--text-light); margin-bottom: 20px;">Você ainda não tem nenhuma loja cadastrada</p>
        <button class="btn btn-primary" onclick="openNovaLojaModal()">Criar Primeira Loja</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = lojas.map(loja => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${loja.nome}</h3>
          <p class="card-subtitle">${loja.descricao || 'Sem descrição'}</p>
        </div>
        <span class="badge ${loja.ativa ? 'badge-success' : 'badge-danger'}">
          ${loja.ativa ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      <div class="card-content" style="font-size: 13px; color: var(--text-light); line-height: 1.8;">
        <p>📍 ${loja.logradouro || '--'}, ${loja.numero || '--'} - ${loja.bairro || '--'}</p>
        <p>${loja.cidade || '--'}, ${loja.estado || '--'}</p>
        <p>📞 ${loja.telefone || '--'}</p>
        <p>📧 ${loja.email || '--'}</p>
        <p>🕐 ${loja.horario_abertura || '--'} - ${loja.horario_fechamento || '--'}</p>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline" onclick="editLoja(${loja.id})">Editar</button>
        <button class="btn btn-outline" onclick="deleteLoja(${loja.id})">Deletar</button>
      </div>

      <button class="btn btn-secondary" style="width: 100%; margin-top: 10px;" onclick="window.location.href='gerenciar-loja.html?id=${loja.id}'">
        Gerenciar Produtos
      </button>
    </div>
  `).join('');
}

// ============================================
// MODAL: CRIAR NOVA LOJA
// ============================================

function openNovaLojaModal() {
  editingLojaId = null;
  document.getElementById('modalTitle').textContent = 'Criar Nova Loja';
  document.getElementById('formLoja').reset();
  document.getElementById('loja-abertura').value = '10:00';
  document.getElementById('loja-fechamento').value = '23:00';
  openModal('modalLoja');
}

// ============================================
// MODAL: EDITAR LOJA
// ============================================

function editLoja(id) {
  const loja = lojas.find(l => l.id === id);
  if (!loja) {
    alert('Loja não encontrada');
    return;
  }

  editingLojaId = id;
  document.getElementById('modalTitle').textContent = 'Editar Loja';
  
  // Preencher formulário com dados da loja
  document.getElementById('loja-nome').value = loja.nome || '';
  document.getElementById('loja-descricao').value = loja.descricao || '';
  document.getElementById('loja-telefone').value = loja.telefone || '';
  document.getElementById('loja-email').value = loja.email || '';
  document.getElementById('loja-cep').value = loja.cep || '';
  document.getElementById('loja-logradouro').value = loja.logradouro || '';
  document.getElementById('loja-numero').value = loja.numero || '';
  document.getElementById('loja-bairro').value = loja.bairro || '';
  document.getElementById('loja-cidade').value = loja.cidade || '';
  document.getElementById('loja-estado').value = loja.estado || '';
  document.getElementById('loja-abertura').value = loja.horario_abertura || '10:00';
  document.getElementById('loja-fechamento').value = loja.horario_fechamento || '23:00';

  openModal('modalLoja');
}

// ============================================
// SALVAR LOJA (CREATE OU UPDATE)
// ============================================

async function handleSaveLoja(event) {
  event.preventDefault();

  const empresaId = localStorage.getItem('empresa_id');
  const nome = document.getElementById('loja-nome').value;
  const email = document.getElementById('loja-email').value;

  if (!nome || !email) {
    alert('Preencha os campos obrigatórios (Nome e Email)');
    return;
  }

  const lojaData = {
    nome,
    descricao: document.getElementById('loja-descricao').value,
    telefone: document.getElementById('loja-telefone').value,
    email,
    cep: document.getElementById('loja-cep').value,
    logradouro: document.getElementById('loja-logradouro').value,
    numero: document.getElementById('loja-numero').value,
    bairro: document.getElementById('loja-bairro').value,
    cidade: document.getElementById('loja-cidade').value,
    estado: document.getElementById('loja-estado').value,
    horario_abertura: document.getElementById('loja-abertura').value,
    horario_fechamento: document.getElementById('loja-fechamento').value,
    ativa: true
  };

  try {
    let response;
    let method;
    let url;

    if (editingLojaId) {
      // ATUALIZAR LOJA EXISTENTE
      console.log('Atualizando loja:', editingLojaId);
      method = 'PUT';
      url = `http://localhost:3001/api/empresas/${empresaId}/lojas/${editingLojaId}`;
    } else {
      // CRIAR NOVA LOJA
      console.log('Criando nova loja' );
      method = 'POST';
      url = `http://localhost:3001/api/empresas/${empresaId}/lojas`;
    }

    response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lojaData )
    });

    const result = await response.json();
    console.log('📋 Resposta da API:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao salvar loja');
    }

    alert(editingLojaId ? 'Loja atualizada com sucesso!' : 'Loja criada com sucesso!');
    
    closeModal('modalLoja');
    loadLojas(); // Recarregar lista do banco de dados

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao salvar loja: ' + error.message);
  }
}

// ============================================
// DELETAR LOJA
// ============================================

async function deleteLoja(id) {
  if (!confirm('Tem certeza que deseja deletar esta loja?')) {
    return;
  }

  try {
    const empresaId = localStorage.getItem('empresa_id');
    console.log('Deletando loja:', id);
    
    const response = await fetch(`http://localhost:3001/api/empresas/${empresaId}/lojas/${id}`, {
      method: 'DELETE'
    } );

    const result = await response.json();
    console.log('Resposta da API:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao deletar loja');
    }

    alert('Loja deletada com sucesso!');
    loadLojas(); // Recarregar lista do banco de dados

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao deletar loja: ' + error.message);
  }
}

// ============================================
// LOGOUT
// ============================================

function handleLogout() {
  console.log('Fazendo logout...');
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_email');
  localStorage.removeItem('empresa_tipo');
  localStorage.removeItem('empresa_id');
  localStorage.removeItem('user_token');
  window.location.href = 'login-empresa.html';
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function setupTabFunctionality() {
  // Tabs já estão funcionando via CSS
}

// ============================================
// EXPOR FUNÇÕES GLOBALMENTE (PARA HTML)
// ============================================

window.renderLojas = renderLojas;
window.loadLojas = loadLojas;
window.openNovaLojaModal = openNovaLojaModal;
window.handleSaveLoja = handleSaveLoja;
window.editLoja = editLoja;
window.deleteLoja = deleteLoja;
window.handleLogout = handleLogout;
window.openModal = openModal;
window.closeModal = closeModal;
