// Dashboard Empresa - JavaScript (MYSQL + REGRAS CPF/CNPJ)

let lojas = [];
let editingLojaId = null;
let isSaving = false;
let submitBtn = null;

// ============================================
// UTIL: tipo de empresa
// ============================================

function getTipoEmpresa(empresa) {
  if (empresa.cnpj && empresa.cnpj.trim() !== '') return 'PJ';
  return 'PF';
}

// ============================================
// CARREGAR LOJAS
// ============================================

async function loadLojas() {
  try {
    const empresaId = localStorage.getItem('empresa_id');

    if (!empresaId) {
      alert('Você precisa estar logado como empresa');
      window.location.href = 'login-empresa.html';
      return;
    }

    const response = await fetch(
      `http://localhost:3001/api/empresas/${empresaId}/lojas`
    );

    if (!response.ok) throw new Error('Erro ao carregar lojas');

    const data = await response.json();
    lojas = data.data || data || [];

    renderLojas();
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar lojas: ' + error.message);
  }
}

// ============================================
// RENDER LOJAS
// ============================================

function renderLojas() {
  const grid = document.getElementById('lojasGrid');
  const totalLojas = document.getElementById('totalLojas');

  if (!grid) return;

  if (totalLojas) totalLojas.textContent = lojas.length;

  if (lojas.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="color: var(--text-light); margin-bottom: 20px;">
          Você ainda não tem nenhuma loja cadastrada
        </p>
        <button class="btn btn-primary" onclick="openNovaLojaModal()">
          Criar Primeira Loja
        </button>
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

      <div class="card-content">
        <p>📍 ${loja.logradouro || '--'}, ${loja.numero || '--'}</p>
        <p>${loja.cidade || '--'}, ${loja.estado || '--'}</p>
        <p>📞 ${loja.telefone || '--'}</p>
        <p>📧 ${loja.email || '--'}</p>
        <p>🕐 ${loja.horario_abertura || '--'} - ${loja.horario_fechamento || '--'}</p>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline" onclick="editLoja(${loja.id})">Editar</button>
        <button class="btn btn-outline" onclick="deleteLoja(${loja.id})">Deletar</button>
      </div>

      <button class="btn btn-secondary" style="width: 100%; margin-top: 10px;"
        onclick="window.location.href='gerenciar-loja.html?id=${loja.id}'">
        Gerenciar Produtos
      </button>
    </div>
  `).join('');
}

// ============================================
// PERFIL EMPRESA
// ============================================

async function openEmpresaPerfil() {
  try {
    const empresaId = localStorage.getItem('empresa_id');
    if (!empresaId) return;

    const response = await fetch(
      `http://localhost:3001/api/empresas/${empresaId}`
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    const empresa = result.data;

    document.getElementById('emp-nome').value = empresa.nome || '';
    document.getElementById('emp-email').value = empresa.email || '';
    document.getElementById('emp-cnpj').value = empresa.cnpj || '';
    document.getElementById('emp-cpf').value = empresa.cpf || '';

    aplicarRegrasPerfilEmpresa(empresa);

    openModal('modalEmpresa');

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar perfil');
  }
}

// ============================================
// CPF / CNPJ (REGRA FINAL)
// ============================================

function aplicarRegrasPerfilEmpresa(empresa) {
  const cnpj = document.getElementById('emp-cnpj');
  const cpf = document.getElementById('emp-cpf');

  const isPJ = !!empresa.cnpj;

  if (isPJ) {
    cpf.value = '';
    cpf.disabled = true;
    cpf.classList.add('campo-bloqueado');

    cnpj.disabled = false;
    cnpj.classList.remove('campo-bloqueado');
  } else {
    cnpj.value = '';
    cnpj.disabled = true;
    cnpj.classList.add('campo-bloqueado');

    cpf.disabled = false;
    cpf.classList.remove('campo-bloqueado');
  }
}

// ============================================
// LOJA - NOVA
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
// EDITAR LOJA
// ============================================

function editLoja(id) {
  const loja = lojas.find(l => Number(l.id) === Number(id));
  if (!loja) return alert('Loja não encontrada');

  editingLojaId = id;

  document.getElementById('modalTitle').textContent = 'Editar Loja';

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
// SALVAR LOJA
// ============================================

async function handleSaveLoja(event) {
  event.preventDefault();

  if (isSaving) return;

  try {
    isSaving = true;

    submitBtn = document.querySelector('#formLoja button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const empresaId = localStorage.getItem('empresa_id');

    const lojaData = {
      nome: document.getElementById('loja-nome').value,
      email: document.getElementById('loja-email').value,
      descricao: document.getElementById('loja-descricao').value,
      telefone: document.getElementById('loja-telefone').value,
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

    const isEdit = !!editingLojaId;

    const url = isEdit
      ? `http://localhost:3001/api/empresas/${empresaId}/lojas/${editingLojaId}`
      : `http://localhost:3001/api/empresas/${empresaId}/lojas`;

    const response = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lojaData)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.message || 'Erro ao salvar loja');

    alert(isEdit ? 'Loja atualizada!' : 'Loja criada!');

    closeModal('modalLoja');
    loadLojas();

  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    isSaving = false;
    if (submitBtn) submitBtn.disabled = false;
  }
}

// ============================================
// DELETE LOJA
// ============================================

async function deleteLoja(id) {
  if (!confirm('Tem certeza?')) return;

  try {
    const empresaId = localStorage.getItem('empresa_id');

    const response = await fetch(
      `http://localhost:3001/api/empresas/${empresaId}/lojas/${id}`,
      { method: 'DELETE' }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao deletar loja');
    }

    alert('Loja deletada!');
    loadLojas();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// ============================================
// SALVAR EMPRESA
// ============================================

async function handleSaveEmpresa(event) {
  event.preventDefault();

  try {
    const empresaId = localStorage.getItem('empresa_id');

    const empresaData = {
      nome: document.getElementById('emp-nome').value,
      email: document.getElementById('emp-email').value,
      cnpj: document.getElementById('emp-cnpj').value,
      cpf: document.getElementById('emp-cpf').value,
      senha: document.getElementById('emp-senha').value
    };

    const response = await fetch(
      `http://localhost:3001/api/empresas/${empresaId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaData)
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Erro ao salvar perfil');

    alert('Perfil atualizado!');
    closeModal('modalEmpresa');

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// ============================================
// SOFT DELETE (FECHAR CONTA)
// ============================================

async function handleFecharContaEmpresa() {
  const confirm1 = confirm(
    'Tem certeza que deseja encerrar sua conta? Você poderá restaurá-la apenas entrando em contato com o suporte.'
  );

  if (!confirm1) return;

  try {
    const empresaId = localStorage.getItem('empresa_id');

    const response = await fetch(
      `http://localhost:3001/api/empresas/${empresaId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'fechada'
        })
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao encerrar conta');
    }

    alert('Conta encerrada com sucesso.');

    localStorage.clear();
    window.location.href = 'login-empresa.html';

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// ============================================
// MODAIS
// ============================================

function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

// ============================================
// LOGOUT
// ============================================

function handleLogout() {
  localStorage.clear();
  window.location.href = 'login-empresa.html';
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('empresa_id')) {
    window.location.href = 'login-empresa.html';
    return;
  }

  loadLojas();
});

// ============================================
// EXPORTS
// ============================================

window.loadLojas = loadLojas;
window.openNovaLojaModal = openNovaLojaModal;
window.handleSaveLoja = handleSaveLoja;
window.editLoja = editLoja;
window.deleteLoja = deleteLoja;
window.handleLogout = handleLogout;
window.openModal = openModal;
window.closeModal = closeModal;
window.openEmpresaPerfil = openEmpresaPerfil;
window.handleFecharContaEmpresa = handleFecharContaEmpresa;
