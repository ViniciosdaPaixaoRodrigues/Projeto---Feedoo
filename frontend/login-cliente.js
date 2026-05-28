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

  async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos');
    return;
  }

  try {
    const usuario = await apiLoginCliente(email, senha);
    alert('Login realizado com sucesso!');
    window.location.href = 'index.html';
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

  // Redirecionar para home/restaurantes
  alert('Login realizado com sucesso!');
  window.location.href = 'index.html';
}
