// Login Cliente - JavaScript

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

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
  console.log('Login Cliente:', { email, senha });

  // Armazenar dados de sessão
  localStorage.setItem('user_type', 'cliente');
  localStorage.setItem('user_email', email);
  localStorage.setItem('user_id', '1'); // Será dinâmico com API real

  // Redirecionar para home/restaurantes
  alert('Login realizado com sucesso!');
  window.location.href = 'index.html';
}
