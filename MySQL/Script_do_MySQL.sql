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

	perfil_empresa → Tabela pai. Também tem poderes administrativos sobre
os perfís que a loja cria. Ao cadastrar lojas e produtos, consegue alterar
informações. Como produtos cadastrados, tirar e adicionar produtos, alterar
preço, etc.
	
    Lojas → Tabela filha de perfil_empresa, onde inclui informações mais específicas
como endereço da loja, horário de atendimento, se conecta com a tabela produtos para
poder gerenciar estoques.
    
    Produtos → Tabela filha (Lojas), onde guarda informações dos produtos cadastrados
junto com a tabela Lojas, permite gerenciar estoque.
Também deve ser possível guardar informação da categoria do produto, para facilitar
busca futura.*/

CREATE SCHEMA IF NOT EXISTS bd_semnome; 
USE bd_semnome;

-- 1. perfil_empresa
CREATE TABLE IF NOT EXISTS perfil_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha CHAR(32) NOT NULL,
    tipo ENUM('PJ', 'PF') NOT NULL,
    cnpj CHAR(18),
    cpf CHAR(14),
    
    descricao TEXT,
    logo_url VARCHAR(255),
    
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    /*----------------------------------------
			Explicação do Constraint
    ------------------------------------------
    O Constraint impede que por exemplo, uma
    pessoa do tipo PJ cadastre um CPF ou deixe
    de cadastar um CNPJ por exemplo.
    */
    CONSTRAINT chk_documento CHECK (
        (Tipo = 'PJ' AND cnpj IS NOT NULL) OR 
        (Tipo = 'PF' AND cpf IS NOT NULL)
    )
);

-- 2. Lojas
CREATE TABLE IF NOT EXISTS lojas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    cep CHAR(8),
    logradouro VARCHAR(150),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    horario_abertura TIME,
    horario_fechamento TIME,
    ativa BOOLEAN DEFAULT TRUE,
    aceita_pedidos BOOLEAN DEFAULT TRUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES perfil_empresa(id)
);

-- 3. Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loja_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    Preco DECIMAL(10,2) NOT NULL,
    /*----------------------
	-- Estoque
    quantidade define quantas
    unidades de um produto 
    estão disponíveis
    
    Já Aviso_reposicao define
    um alerta, para quando a
    quantidade estiver baixa,
    haver um alerta no 
    aplicativo/site
    ----------------------*/
    quantidade INT DEFAULT 0,
    aviso_reposicao INT DEFAULT 0,
    
    disponivel BOOLEAN DEFAULT TRUE,
    categoria VARCHAR(100),
    imagem_url VARCHAR(255) NOT NULL,
    
    total_vendas INT DEFAULT 0,
    tempo_preparo INT,
    
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (loja_id) REFERENCES Lojas(id)
);

-- 4. Usuario (CORREÇÃO: Removida vírgula extra e ajustado tipo do telefone)
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20) NOT NULL, -- Alterado de INT para VARCHAR para suportar números longos e DDD
    endereco VARCHAR(255) NOT NULL,
    senha CHAR(32) NOT NULL,
    data_registro DATE,
    status_usuario ENUM('Ativo', 'Fechado', 'Suspenso', 'Banido') NOT NULL
);

-- 5. Metodos_Pagamento
CREATE TABLE IF NOT EXISTS metodos_pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('cartao_credito', 'boleto', 'pix') NOT NULL,
    final_cartao CHAR(4),
    bandeira VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- 6. Carrinho (CORREÇÃO: Adicionado AUTO_INCREMENT)
CREATE TABLE IF NOT EXISTS carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- 7. Carrinho_Itens
CREATE TABLE IF NOT EXISTS carrinho_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrinho_id INT NOT NULL,
    produto_id INT NOT NULL,
    
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED,
    /*SOBRE O GENERATED AWAYS AS:
    Esse valor é sempre gerado automaticamente usando essa fórmula

	Você não pode fazer INSERT manual nele.*/
    
    FOREIGN KEY (carrinho_id) REFERENCES carrinho(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);