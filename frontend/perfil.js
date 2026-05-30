document.addEventListener('DOMContentLoaded', () => {
  iniciarPerfil();

  document
    .getElementById('formPerfil')
    .addEventListener('submit', salvarPerfil);
});

async function iniciarPerfil() {
  const cliente = JSON.parse(localStorage.getItem('cliente'));

  if (!cliente) {
    window.location.href = 'login-cliente.html';
    return;
  }

  await carregarPerfil(cliente.id);
}

async function carregarPerfil(id) {
  try {
    const response = await fetch(`${API_URL}/api/clientes/${id}`);
    const result = await response.json();

    preencherFormulario(result.data);
  } catch (error) {
    alert('Erro ao carregar perfil');
    console.error(error);
  }
}

function preencherFormulario(usuario) {
  document.getElementById('nome').value = usuario.nome || '';
  document.getElementById('email').value = usuario.email || '';
  document.getElementById('telefone').value = usuario.telefone || '';
  document.getElementById('endereco').value = usuario.endereco || '';
  document.getElementById('status').value = usuario.status_usuario || '';
}

async function salvarPerfil(event) {
  event.preventDefault();

  const cliente = JSON.parse(localStorage.getItem('cliente'));

  const senha = document.getElementById('senha').value;
  const confirmar = document.getElementById('confirmar_senha').value;

  if (senha || confirmar) {
    if (senha !== confirmar) {
      alert('As senhas não coincidem');
      return;
    }
  }

  const dados = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    endereco: document.getElementById('endereco').value,
  };

  if (senha) {
    dados.senha = senha;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/clientes/${cliente.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert('Perfil atualizado!');
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

function logout() {
  localStorage.removeItem('cliente');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}