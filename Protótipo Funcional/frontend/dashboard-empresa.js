// Dashboard Empresa - JavaScript

// Dados de exemplo (será integrado com MySQLx de Rust)
let lojas = [
  {
    id: 1,
    nome: 'Feedoo Centro',
    descricao: 'Nossa loja principal no centro da cidade',
    telefone: '(11) 99999-0001',
    email: 'centro@feedoo.com',
    cep: '01310100',
    logradouro: 'Avenida Paulista',
    numero: '1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    horario_abertura: '10:00',
    horario_fechamento: '23:00',
    ativa: true
  }
];

let editingLojaId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  renderLojas();
  setupTabFunctionality();
});

function renderLojas() {
  const grid = document.getElementById('lojasGrid');
  const totalLojas = document.getElementById('totalLojas');
  
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
          <p class="card-subtitle">${loja.descricao}</p>
        </div>
        <span class="badge ${loja.ativa ? 'badge-success' : 'badge-danger'}">
          ${loja.ativa ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      <div class="card-content" style="font-size: 13px; color: var(--text-light); line-height: 1.8;">
        <p>📍 ${loja.logradouro}, ${loja.numero} - ${loja.bairro}</p>
        <p>${loja.cidade}, ${loja.estado}</p>
        <p>📞 ${loja.telefone}</p>
        <p>📧 ${loja.email}</p>
        <p>🕐 ${loja.horario_abertura} - ${loja.horario_fechamento}</p>
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

function openNovaLojaModal() {
  editingLojaId = null;
  document.getElementById('modalTitle').textContent = 'Criar Nova Loja';
  document.getElementById('formLoja').reset();
  document.getElementById('loja-abertura').value = '10:00';
  document.getElementById('loja-fechamento').value = '23:00';
  openModal('modalLoja');
}

function editLoja(id) {
  const loja = lojas.find(l => l.id === id);
  if (!loja) return;

  editingLojaId = id;
  document.getElementById('modalTitle').textContent = 'Editar Loja';
  
  document.getElementById('loja-nome').value = loja.nome;
  document.getElementById('loja-descricao').value = loja.descricao;
  document.getElementById('loja-telefone').value = loja.telefone;
  document.getElementById('loja-email').value = loja.email;
  document.getElementById('loja-cep').value = loja.cep;
  document.getElementById('loja-logradouro').value = loja.logradouro;
  document.getElementById('loja-numero').value = loja.numero;
  document.getElementById('loja-bairro').value = loja.bairro;
  document.getElementById('loja-cidade').value = loja.cidade;
  document.getElementById('loja-estado').value = loja.estado;
  document.getElementById('loja-abertura').value = loja.horario_abertura;
  document.getElementById('loja-fechamento').value = loja.horario_fechamento;

  openModal('modalLoja');
}

function deleteLoja(id) {
  if (confirm('Tem certeza que deseja deletar esta loja?')) {
    lojas = lojas.filter(l => l.id !== id);
    renderLojas();
    alert('Loja deletada com sucesso!');
  }
}

function handleSaveLoja(event) {
  event.preventDefault();

  const nome = document.getElementById('loja-nome').value;
  const email = document.getElementById('loja-email').value;

  if (!nome || !email) {
    alert('Preencha os campos obrigatórios');
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

  if (editingLojaId) {
    // Atualizar loja existente
    const index = lojas.findIndex(l => l.id === editingLojaId);
    if (index !== -1) {
      lojas[index] = { ...lojas[index], ...lojaData };
      alert('Loja atualizada com sucesso!');
    }
  } else {
    // Criar nova loja
    const newId = Math.max(...lojas.map(l => l.id), 0) + 1;
    lojas.push({ id: newId, ...lojaData });
    alert('Loja criada com sucesso!');
  }

  closeModal('modalLoja');
  renderLojas();
}

function handleLogout() {
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_email');
  localStorage.removeItem('empresa_tipo');
  localStorage.removeItem('empresa_id');
  window.location.href = 'login-empresa.html';
}

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function setupTabFunctionality() {
  // Tabs já estão funcionando via CSS
}
