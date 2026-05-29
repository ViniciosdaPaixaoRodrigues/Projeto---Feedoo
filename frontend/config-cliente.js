

Atualizar

Compartilhar
Lite
Finalizei as implementações solicitadas para o projeto Feedoo. Criei a tela de configurações do cliente, onde ele pode editar suas informações e desativar a conta sem excluir os dados do banco de dados, seguindo o padrão visual do seu projeto.
Principais Alterações:
Componente
Arquivos Modificados/Criados
Descrição
Backend (Rust)
models.rs, main.rs, usuarios.rs
Adição de rotas GET e PUT para o perfil do usuário e lógica de status.
Frontend (HTML)
configuracoes-cliente.html
Nova interface para gerenciamento de conta e zona de perigo.
Frontend (JS)
configuracoes-cliente.js, config.js
Lógica de preenchimento automático, atualização de dados e desativação.
Ajustes de Fluxo
login-cliente.js, index.js, index.html
Correção no login para persistir a sessão e exibição dinâmica no menu principal.
Nota sobre a Desativação: Quando o cliente clica em "Desativar Conta", o sistema altera o campo status_usuario para 'Fechado' no banco de dados. Isso impede o acesso mas preserva o histórico, conforme solicitado.
Os arquivos estão anexados para você revisar e aplicar ao seu projeto. Se precisar de mais algum ajuste, estou à disposição!
configuracoes-cliente.html
Código · 3.60 KB
configuracoes-cliente.js
Código · 3.06 KB
usuarios.rs
Código · 2.42 KB
models.rs
Código · 5.59 KB
main.rs
Código · 3.56 KB
config.js
Código · 6.47 KB
login-cliente.js
Código · 816 B
index.html
Código · 4.48 KB
index.js
Código · 1.02 KB
Ver todos os arquivos nesta tarefa
Tarefa concluída
Como foi este resultado?
Sugestões de acompanhamento



Computadores na nuvem
Novo

Todos os arquivos nesta tarefa
Hoje

configuracoes-cliente.js
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
Envio de Arquivos RussT para Iniciar Trabalho - Manus
