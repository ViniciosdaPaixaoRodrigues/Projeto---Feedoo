/*======================================
		   Tabelas necessárias
========================================
É necessário as seguintes tabelas:
	Usuário → Tabela Pai, sem chave estrangeira.
    É onde as informações básicas do usuário ficam e outras
tabelas se conectam com ela para interagir com outras funções.
Exemplos: Carrinho, Métodos de Pagamento, acompanhar pedido, etc.

	Carrinho → Tabela Filha (Usuário e Produtos). Responsável por guardar
informações dos produtos que estão adicionados no 
carrinho.

	Métodos de Pagamento → Tabela Filha (Usuário). Responsável por
guardar informações dos métodos de pagamentos cadastrados. Como
chaves pix, cartão de crédito, etc.

	Pedidos → Tabela filha (Usuário e Produtos). Também permite que o usuário
consiga acompanhar informações do pedido, como status de entrega e prazo.
Além de detalhar qual loja foi feito o pedido.

	Perfil_Empresa → Tabela pai. Também tem poderes administrativos sobre
os perfís que a loja cria. Ao cadastrar lojas e produtos, consegue alterar
informações. Como produtos cadastrados, tirar e adicionar produtos, alterar
preço, etc.
	
    Lojas → Tabela filha de Perfil_Empresa, onde inclui informações mais específicas
como endereço da loja, horário de atendimento, se conecta com a tabela produtos para
poder gerenciar estoques.
    
    Produtos → Tabela filha (Lojas), onde guarda informações dos produtos cadastrados
junto com a tabela Lojas, permite gerenciar estoque.
Também deve ser possível guardar informação da categoria do produto, para facilitar
busca futura.*/

CREATE SCHEMA IF NOT EXISTS bd_semnome; 
USE bd_semnome;

-- 1. Perfil_Empresa
CREATE TABLE IF NOT EXISTS Perfil_Empresa (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Tipo ENUM('PJ', 'PF') NOT NULL,
    CNPJ CHAR(18),
    CPF CHAR(14),
    
    Descricao TEXT,
    Logo_URL VARCHAR(255),
    
    Data_Cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    Ultima_Atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /*----------------------------------------
			Explicação do Constraint
    ------------------------------------------
    O Constraint impede que por exemplo, uma
    pessoa do tipo PJ cadastre um CPF ou deixe
    de cadastar um CNPJ por exemplo.
    */
    CONSTRAINT chk_documento CHECK (
        (Tipo = 'PJ' AND CNPJ IS NOT NULL) OR 
        (Tipo = 'PF' AND CPF IS NOT NULL)
    )
);

-- 2. Lojas
CREATE TABLE IF NOT EXISTS Lojas (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Empresa_ID INT NOT NULL,
    Nome VARCHAR(150) NOT NULL,
    Descricao TEXT,
    Telefone VARCHAR(20),
    Email VARCHAR(255),
    CEP CHAR(8),
    Logradouro VARCHAR(150),
    Numero VARCHAR(10),
    Complemento VARCHAR(100),
    Bairro VARCHAR(100),
    Cidade VARCHAR(100),
    Estado CHAR(2),
    Latitude DECIMAL(10,8),
    Longitude DECIMAL(11,8),
    Horario_Abertura TIME,
    Horario_Fechamento TIME,
    Ativa BOOLEAN DEFAULT TRUE,
    Aceita_Pedidos BOOLEAN DEFAULT TRUE,
    Data_Cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    Ultima_Atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Empresa_ID) REFERENCES Perfil_Empresa(ID)
);

-- 3. Produtos
CREATE TABLE IF NOT EXISTS Produtos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Loja_ID INT NOT NULL,
    Nome VARCHAR(150) NOT NULL,
    Descricao TEXT,
    Preco DECIMAL(10,2) NOT NULL,
    /*----------------------
	-- Estoque
    Quantidade define quantas
    unidades de um produto 
    estão disponíveis
    
    Já Aviso_reposicao define
    um alerta, para quando a
    quantidade estiver baixa,
    haver um alerta no 
    aplicativo/site
    ----------------------*/
    Quantidade INT DEFAULT 0,
    Aviso_reposicao INT DEFAULT 0,
    
    Disponivel BOOLEAN DEFAULT TRUE,
    Categoria VARCHAR(100),
    Imagem_URL VARCHAR(255) NOT NULL,
    
    Total_Vendas INT DEFAULT 0,
    Tempo_Preparo INT,
    
    Data_Cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    Ultima_Atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Loja_ID) REFERENCES Lojas(ID)
);

-- 4. Usuario (CORREÇÃO: Removida vírgula extra e ajustado tipo do Telefone)
CREATE TABLE IF NOT EXISTS Usuario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Telefone VARCHAR(20) NOT NULL, -- Alterado de INT para VARCHAR para suportar números longos e DDD
    Endereço VARCHAR(255) NOT NULL,
    Senha CHAR(32) NOT NULL,
    Data_registro DATE,
    Status_usuario ENUM('Ativo', 'Fechado', 'Suspenso', 'Banido') NOT NULL
);

-- 5. Metodos_Pagamento
CREATE TABLE IF NOT EXISTS Metodos_Pagamento (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    usuario_ID INT NOT NULL,
    tipo ENUM('cartao_credito', 'boleto', 'pix') NOT NULL,
    final_cartao CHAR(4),
    bandeira VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_ID) REFERENCES Usuario(ID)
);

-- 6. Carrinho (CORREÇÃO: Adicionado AUTO_INCREMENT)
CREATE TABLE IF NOT EXISTS Carrinho (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_ID INT NOT NULL,
    Valor_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Usuario_ID) REFERENCES Usuario(ID)
);

-- 7. Carrinho_Itens
CREATE TABLE IF NOT EXISTS Carrinho_Itens (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Carrinho_ID INT NOT NULL,
    Produto_ID INT NOT NULL,
    
    Quantidade INT NOT NULL DEFAULT 1,
    Preco_Unitario DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) GENERATED ALWAYS AS (Quantidade * Preco_Unitario) STORED,
    /*SOBRE O GENERATED AWAYS AS:
    Esse valor é sempre gerado automaticamente usando essa fórmula

	Você não pode fazer INSERT manual nele.*/
    
    FOREIGN KEY (Carrinho_ID) REFERENCES Carrinho(ID),
    FOREIGN KEY (Produto_ID) REFERENCES Produtos(ID)
);