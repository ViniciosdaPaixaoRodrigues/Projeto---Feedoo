// Login Empresa - JavaScript

// Tabs functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tabName = this.dataset.tab;
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Remove active class from all content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked button and corresponding content
    this.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// Set first tab as active
document.querySelector('.tab-btn').classList.add('active');

function handleLogin(event, tipo) {
  event.preventDefault();

  let email, senha;

  if (tipo === 'PF') {
    email = document.getElementById('email-pf').value;
    senha = document.getElementById('senha-pf').value;
  } else {
    email = document.getElementById('email-pj').value;
    senha = document.getElementById('senha-pj').value;
  }

  // Validação básica
  if (!email || !senha) {
    alert('Por favor, preencha todos os campos');
    return;
  }

  if (senha.length < 6) {
    alert('Senha deve ter no mínimo 6 caracteres');
    return;
  }

  // Simulando login (será integrado com MySQLx de Rust)
  console.log('Login Empresa:', { email, senha, tipo });

  // Armazenar dados de sessão
  localStorage.setItem('user_type', 'empresa');
  localStorage.setItem('user_email', email);
  localStorage.setItem('empresa_tipo', tipo);
  localStorage.setItem('empresa_id', '1'); // Será dinâmico com API real

  // Redirecionar para dashboard
  alert('Login realizado com sucesso!');
  window.location.href = 'dashboard-empresa.html';
}
