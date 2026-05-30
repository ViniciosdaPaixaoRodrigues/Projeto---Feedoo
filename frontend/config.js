// config.js - Configuração Central da API

const API_URL = 'http://localhost:3001';

// ============================================
// AUTENTICAÇÃO
// ============================================

async function apiLoginCliente(email, senha ) {
  const response = await fetch(`${API_URL}/api/auth/login-cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao fazer login');
  }
  
  return await response.json();
}

async function apiCadastroCliente(dados) {
  const response = await fetch(`${API_URL}/api/auth/cadastro-cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao cadastrar');
  }
  
  return await response.json();
}

async function apiLoginEmpresa(email, senha) {
  const response = await fetch(`${API_URL}/api/auth/login-empresa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao fazer login');
  }
  
  return await response.json();
}

async function apiCadastroEmpresa(dados) {
  const response = await fetch(`${API_URL}/api/auth/cadastro-empresa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao cadastrar');
  }
  
  return await response.json();
}

function getClienteLogado() {
  return JSON.parse(
    localStorage.getItem('cliente')
  );
}

function isClienteLogado() {
  return getClienteLogado() !== null;
}

function logoutCliente() {
  localStorage.removeItem('cliente');
  window.location.href = 'login-cliente.html';
}

// ============================================
// LOJAS
// ============================================

async function apiGetLojas(empresaId) {
  const response = await fetch(`${API_URL}/api/empresas/${empresaId}/lojas`);
  
  if (!response.ok) {
    throw new Error('Erro ao carregar lojas');
  }
  
  const data = await response.json();
  return data.data || data; // Retorna os dados da resposta
}

async function apiGetLoja(empresaId, lojaId) {
  const response = await fetch(`${API_URL}/api/empresas/${empresaId}/lojas/${lojaId}`);
  
  if (!response.ok) {
    throw new Error('Erro ao carregar loja');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiCreateLoja(empresaId, dados) {
  const response = await fetch(`${API_URL}/api/empresas/${empresaId}/lojas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar loja');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiUpdateLoja(empresaId, lojaId, dados) {
  const response = await fetch(`${API_URL}/api/empresas/${empresaId}/lojas/${lojaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao atualizar loja');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiDeleteLoja(empresaId, lojaId) {
  const response = await fetch(`${API_URL}/api/empresas/${empresaId}/lojas/${lojaId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao deletar loja');
  }
  
  return true;
}

// ============================================
// PRODUTOS
// ============================================

async function apiGetProdutos(lojaId) {
  const response = await fetch(`${API_URL}/api/lojas/${lojaId}/produtos`);
  
  if (!response.ok) {
    throw new Error('Erro ao carregar produtos');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiGetProduto(lojaId, produtoId) {
  const response = await fetch(`${API_URL}/api/lojas/${lojaId}/produtos/${produtoId}`);
  
  if (!response.ok) {
    throw new Error('Erro ao carregar produto');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiCreateProduto(lojaId, dados) {
  const response = await fetch(`${API_URL}/api/lojas/${lojaId}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar produto');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiUpdateProduto(lojaId, produtoId, dados) {
  const response = await fetch(`${API_URL}/api/lojas/${lojaId}/produtos/${produtoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao atualizar produto');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function apiDeleteProduto(lojaId, produtoId) {
  const response = await fetch(`${API_URL}/api/lojas/${lojaId}/produtos/${produtoId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao deletar produto');
  }
  
  return true;
}
