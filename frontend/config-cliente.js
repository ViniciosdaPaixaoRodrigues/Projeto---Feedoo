document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('cliente_id');
    
    if (!userId) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login-cliente.html';
        return;
    }

    // Elementos do formulário
    const formPerfil = document.getElementById('formPerfil');
    const inputNome = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const inputTelefone = document.getElementById('telefone');
    const inputEndereco = document.getElementById('endereco');
    const inputSenha = document.getElementById('senha');

    // Carregar dados iniciais
    try {
        const perfil = await apiGetPerfil(userId);
        inputNome.value = perfil.nome || '';
        inputEmail.value = perfil.email || '';
        inputTelefone.value = perfil.telefone || '';
        inputEndereco.value = perfil.endereco || '';
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar dados do perfil.');
    }

    // Salvar alterações
    formPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            nome: inputNome.value,
            email: inputEmail.value,
            telefone: inputTelefone.value,
            endereco: inputEndereco.value
        };

        if (inputSenha.value) {
            dados.senha = inputSenha.value;
        }

        try {
            await apiUpdatePerfil(userId, dados);
            alert('Perfil atualizado com sucesso!');
            inputSenha.value = ''; // Limpa o campo de senha
        } catch (error) {
            alert('Erro ao atualizar perfil: ' + error.message);
        }
    });

    // Modal de Desativação
    const modalDesativar = document.getElementById('modalDesativar');
    const btnDesativar = document.getElementById('btnDesativar');
    const btnConfirmarDesativar = document.getElementById('confirmarDesativar');
    const closes = document.querySelectorAll('.modal-close');

    btnDesativar.addEventListener('click', () => {
        modalDesativar.classList.remove('hidden');
    });

    closes.forEach(btn => {
        btn.addEventListener('click', () => {
            modalDesativar.classList.add('hidden');
        });
    });

    btnConfirmarDesativar.addEventListener('click', async () => {
        try {
            // 'Fechado' é um dos valores do ENUM status_usuario no banco
            await apiUpdatePerfil(userId, { status_usuario: 'Fechado' });
            alert('Sua conta foi desativada com sucesso.');
            logout();
        } catch (error) {
            alert('Erro ao desativar conta: ' + error.message);
        }
    });

    // Logout
    document.getElementById('btnLogout').addEventListener('click', logout);

    function logout() {
        localStorage.removeItem('cliente_id');
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
        window.location.href = 'index.html';
    }
});
