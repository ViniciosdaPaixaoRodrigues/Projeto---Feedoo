// Cadastro Cliente - JavaScript

function handleCadastro(event) {
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

  // Simulando cadastro (será integrado com MySQLx de Rust)
  // Aqui você faria uma chamada POST para sua API:
  // fetch('http://seu-backend/api/usuarios/cadastro', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(dadosCadastro)
  // })

  // Armazenar dados de sessão
  localStorage.setItem('user_type', 'cliente');
  localStorage.setItem('user_email', email);
  localStorage.setItem('user_id', '1'); // Será dinâmico com API real
  localStorage.setItem('user_name', nome);

  alert('Conta criada com sucesso! Bem-vindo ao Feedoo!');
  window.location.href = 'index.html';
}
