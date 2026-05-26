// Cadastro Empresa - JavaScript

// Tabs functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tabName = this.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    this.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// Set first tab as active
document.querySelector('.tab-btn').classList.add('active');

function handleCadastro(event, tipo) {
  event.preventDefault();

  let dadosCadastro = {
    tipo_usuario: tipo,
    status_usuario: 'Ativo'
  };

  if (tipo === 'PF') {
    const nome = document.getElementById('nome-pf').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email-pf').value;
    const telefone = document.getElementById('telefone-pf').value;
    const descricao = document.getElementById('descricao-pf').value;
    const senha = document.getElementById('senha-pf').value;
    const confirmarSenha = document.getElementById('confirmar-pf').value;
    const termos = document.getElementById('termos-pf').checked;

    // Validações
    if (!nome || !cpf || !email || !telefone || !senha || !confirmarSenha) {
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

    // Validar CPF (básico)
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      alert('CPF inválido');
      return;
    }

    dadosCadastro = {
      ...dadosCadastro,
      nome,
      cpf,
      email,
      telefone,
      descricao,
      senha
    };

  } else if (tipo === 'PJ') {
    const nomeEmpresa = document.getElementById('nome-empresa').value;
    const cnpj = document.getElementById('cnpj').value;
    const email = document.getElementById('email-pj').value;
    const telefone = document.getElementById('telefone-pj').value;
    const responsavel = document.getElementById('responsavel').value;
    const descricao = document.getElementById('descricao-pj').value;
    const senha = document.getElementById('senha-pj').value;
    const confirmarSenha = document.getElementById('confirmar-pj').value;
    const termos = document.getElementById('termos-pj').checked;

    // Validações
    if (!nomeEmpresa || !cnpj || !email || !telefone || !responsavel || !senha || !confirmarSenha) {
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

    // Validar CNPJ (básico)
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      alert('CNPJ inválido');
      return;
    }

    dadosCadastro = {
      ...dadosCadastro,
      nome_empresa: nomeEmpresa,
      cnpj,
      email,
      telefone,
      responsavel,
      descricao,
      senha
    };
  }

  console.log('Cadastro Empresa:', dadosCadastro);

  // Simulando cadastro (será integrado com MySQLx de Rust)
  // Aqui você faria uma chamada POST para sua API:
  // fetch('http://seu-backend/api/empresas/cadastro', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(dadosCadastro)
  // })

  // Armazenar dados de sessão
  localStorage.setItem('user_type', 'empresa');
  localStorage.setItem('user_email', dadosCadastro.email);
  localStorage.setItem('empresa_tipo', tipo);
  localStorage.setItem('empresa_id', '1'); // Será dinâmico com API real

  alert('Conta de empresa criada com sucesso! Bem-vindo ao Feedoo!');
  window.location.href = 'dashboard-empresa.html';
}
