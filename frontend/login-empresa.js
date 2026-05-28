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
    console.log('📋 Resposta da API:', data);

    if (!response.ok) {
      alert('Erro: ' + (data.message || 'Credenciais inválidas'));
      return;
    }

    // ✅ SALVAR DADOS NO LOCALSTORAGE
    const user = data.data || data;
    
    console.log('✅ Login bem-sucedido!');
    console.log('User data:', user);
    
    localStorage.setItem('user_type', 'empresa');
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('empresa_tipo', tipo);
    localStorage.setItem('empresa_id', user.id);  // ✅ IMPORTANTE!
    localStorage.setItem('user_token', user.token);

    console.log('Dados salvos no localStorage:');
    console.log('  empresa_id:', localStorage.getItem('empresa_id'));
    console.log('  user_email:', localStorage.getItem('user_email'));

    alert('Login realizado com sucesso!');
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
