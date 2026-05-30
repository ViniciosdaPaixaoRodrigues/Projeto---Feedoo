// Login Empresa - JavaScript

async function handleLogin(event, tipo) {
  event.preventDefault();

  let email, senha;

  if (tipo === 'PF') {
    email = document.getElementById('email-pf').value;
    senha = document.getElementById('senha-pf').value;
  } else if (tipo === 'PJ') {
    email = document.getElementById('email-pj').value;
    senha = document.getElementById('senha-pj').value;
  }

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos');
    return;
  }

  try {
    console.log('Tentando fazer login...');
    
    const response = await fetch('http://localhost:3001/api/auth/login-empresa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha } )
    });

    const data = await response.json();
    console.log('Resposta da API:', data);

    if (!response.ok) {
      alert('Erro: ' + (data.message || 'Credenciais inválidas'));
      return;
    }

    // SALVAR DADOS NO LOCALSTORAGE
    const user = data.data || data;

    localStorage.setItem(
      'empresa',
      JSON.stringify(user)
    );

    localStorage.setItem(
      'token',
      user.token
    );

    // Compatibilidade com código já existente
    localStorage.setItem(
      'empresa_id',
      user.id
    );

    localStorage.setItem(
      'user_email',
      user.email
    );

    localStorage.setItem(
      'empresa_tipo',
      tipo
    );

    window.location.href = 'dashboard-empresa.html';

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor: ' + error.message);
  }
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

function goToSignup() {
  window.location.href = 'cadastro-empresa.html';
}

function goToHome() {
  window.location.href = 'index.html';
}

// ============================================
// TABS - TROCAR ENTRE PF E PJ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
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
});
