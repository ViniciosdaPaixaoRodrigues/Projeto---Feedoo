# Projeto Rust + MySQL

Este é um projeto exemplo em Rust que demonstra como se conectar a um banco de dados MySQL utilizando as bibliotecas `sqlx`, `tokio` e `dotenvy`.

## Pré-requisitos

1.  **Rust**: Certifique-se de ter o Rust instalado.
2.  **MySQL**: Um servidor MySQL rodando com o schema criado conforme o script fornecido.
3.  **Dependências do Sistema**: No Linux, você pode precisar de `libssl-dev` e `libmysqlclient-dev`.

## Configuração

1.  Edite o arquivo `.env` e insira as credenciais do seu banco de dados na variável `DATABASE_URL`.

## Como Executar

Para rodar o projeto:
```bash
cargo run
```

Observação:
    Ao cadastrar um usuário, não será possível escolher nenhum produto disponível até que as tabelas de 
produtos sejam atualizadas. Para isto, faça uma das opções:
1. Cadastre uma conta de Empresa (Simples e intuitiva)
    1.1. Cadastre uma Loja
    1.2. Cadastre pelo menos 1 produto
    1.3. Deslogue e entre como um usuário, será possível adicionar itens ao carrinho normalmente.
2. No MySQL, insira manualmente através de scripts.
    2.1. Primeiro, insira com um INSERT uma Loja conectada a um perfil_empresa
    2.2. Depois, insira pelo menos 1 produto conectada a esta loja.
    2.3. Desloque e entre como um usuário, se tudo correr bem, será possível adicionar carrinhos normalmente
## Estrutura do Projeto

- `src/main.rs`: Contém a lógica de conexão, inserção e consulta.
- `Cargo.toml`: Gerenciamento de dependências.
- `.env`: Arquivo de configuração (não deve ser enviado para o controle de versão).

## Funcionalidades Implementadas

- Conexão assíncrona com MySQL usando Pool de conexões.
- Inserção de dados na tabela `perfil_empresa`.
- Consulta e listagem de registros da tabela `perfil_empresa`.
- Tratamento básico de erros.
- Edição individual de produtos usando loop ao estar logado como empresa.
- Edição individual de informações do perfil ao estar logado como usuario.

## Funcionalidades à serem Implementadas

- Funcionalidade de compra de produtos e atualização da quantidade dos produtos nas tabelas apropriadas
- Ao logar na empresa, poder ver um relatório de cada loja, caso a quantidade de um produto esteja no limitador para aviso, aparecerá um sinal de alerta ("[!]" em vermelho de preferência) avisando a falta de produto.
- Caso algum produto não tenha nenhuma quantidade, ou seja, esgotado, o usuário não poderá adicionar itens no carrinho e o item aparecerá como "Esgotado"