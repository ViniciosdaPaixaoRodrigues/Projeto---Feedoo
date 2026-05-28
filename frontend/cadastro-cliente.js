// Cadastro Cliente - JavaScript

async function handleCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const endereco = document.getElementById('endereco').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const termos = document.getElementById('termos').checked;

  // Validações
  if (!nome || !email || !telefone || !endereco || !senha || !confirmarSenha) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  if (senha.length < 6) {
    alert('Senha deve ter no mínimo 6 caracteres');
    return;
  }

  if (senha !== confirmarSenha) {
    alert('As senhas não conferem');
    return;
  }

  if (!termos) {
    alert('Você deve concordar com os Termos de Serviço');
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email inválido');
    return;
  }

  // Validar telefone (básico)
  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length < 10) {
    alert('Telefone inválido');
    return;
  }
  // Dados do cadastro
  const dadosCadastro = {
    nome,
    email,
    telefone,
    endereco,
    senha, // Em produção, NUNCA enviar senha em texto plano
    status_usuario: 'Ativo'
  };

  console.log('Cadastro Cliente:', dadosCadastro);
  // FAZER CHAMADA À API
  try {
    const response = await fetch('http://localhost:3001/api/auth/cadastro-cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosCadastro )
    });

    const result = await response.json();

    if (!response.ok) {
      alert('Erro ao cadastrar: ' + (result.message || 'Erro desconhecido'));
      return;
    }

    // Armazenar dados de sessão
    localStorage.setItem('user_type', 'usuario');
    localStorage.setItem('user_email', dadosCadastro.email);

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor: ' + error.message);
  }
}

 document
  .getElementById("cadastroForm")
  .addEventListener("submit", handleCadastro);