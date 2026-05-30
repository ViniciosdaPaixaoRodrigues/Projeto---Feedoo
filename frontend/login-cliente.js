// Login Cliente - JavaScript

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos');
    return;
  }

  if (senha.length < 6) {
    alert('Senha deve ter no mínimo 6 caracteres');
    return;
  }

  try {
    const result = await apiLoginCliente(email, senha);

    localStorage.setItem(
      'cliente',
      JSON.stringify(result.data)
    );

    localStorage.setItem(
      'token',
      result.data.token
    );

    window.location.href = 'index.html';

  } catch (error) {
    alert('Erro: ' + error.message);
  }
}
