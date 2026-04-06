-- ======================================
-- INSERÇÃO DE DADOS (CORRIGIDA)
-- ======================================

-- USUÁRIOS (CORREÇÃO: Status_usuario deve ser um dos valores do ENUM e Telefone como String)
INSERT INTO Usuario (Nome, Email, Telefone, Endereço, Senha, Data_registro, Status_usuario)
VALUES ('Ana Pereira', 'ana.costa@email.com', '11988881111', 'Rua das Orquídeas, 50, SP', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', '2026-04-04', 'Ativo');

INSERT INTO Usuario (Nome, Email, Telefone, Endereço, Senha, Data_registro, Status_usuario)
VALUES ('Bruno Costa', 'bruno.costa@email.com', '11988882222', 'Av. das Palmeiras, 200, SP', 'p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1', '2026-04-05', 'Ativo');

INSERT INTO Usuario (Nome, Email, Telefone, Endereço, Senha, Data_registro, Status_usuario)
VALUES ('Carla Martins', 'carla.martins@email.com', '11988883333', 'Rua dos Lírios, 75, SP', '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p', '2026-04-06', 'Ativo');

-- CORREÇÃO: 'Pix' não é um status válido para usuário. Alterado para 'Ativo'.
INSERT INTO Usuario (Nome, Email, Telefone, Endereço, Senha, Data_registro, Status_usuario)
VALUES ('Creber', 'crebersouincrivel@hotmail.com', '1140028922', 'Rua do eu sou muito louco, 10, MS', '1a23bc4d5e6f7g8h9i0j1k2l3m4n50wp', '2026-04-05', 'Ativo');

-- PERFIL_EMPRESA
INSERT INTO Perfil_Empresa (Nome, Email, Tipo, CNPJ, Descricao, Logo_URL)
VALUES ('Hamburgueria Bom Sabor Ltda', 'contato@bomsabor.com', 'PJ', '22334455000177', 'Hambúrgueres artesanais de alta qualidade', 'https://exemplo.com/logo_bomsabor.png');

INSERT INTO Perfil_Empresa (Nome, Email, Tipo, CNPJ, Descricao, Logo_URL)
VALUES ('Café Expresso SA', 'contato@cafeexpresso.com', 'PJ', '33445566000188', 'Cafés e lanches especiais', 'https://exemplo.com/logo_cafeexpresso.png');

INSERT INTO Perfil_Empresa (Nome, Email, Tipo, CNPJ, Descricao, Logo_URL)
VALUES ('Sorveteria Gelato ME', 'contato@sorveteriagelato.com', 'PJ', '44556677000199', 'Sorvetes artesanais variados', 'https://exemplo.com/logo_gelato.png');

-- LOJAS
INSERT INTO Lojas (Empresa_ID, Nome, Descricao, Telefone, Email, CEP, Logradouro, Numero, Bairro, Cidade, Estado, Horario_Abertura, Horario_Fechamento, Ativa, Aceita_Pedidos)
VALUES (1, 'Bom Sabor Centro', 'Loja principal de hambúrgueres', '11977771111', 'centro@bomsabor.com', '01002000', 'Rua dos Hambúrgueres', '10', 'Centro', 'São Paulo', 'SP', '12:00', '23:00', TRUE, TRUE);

INSERT INTO Lojas (Empresa_ID, Nome, Descricao, Telefone, Email, CEP, Logradouro, Numero, Bairro, Cidade, Estado, Horario_Abertura, Horario_Fechamento, Ativa, Aceita_Pedidos)
VALUES (1, 'Bom Sabor Norte', 'Loja na Zona Norte', '11977772222', 'norte@bomsabor.com', '02003000', 'Av. Norte', '100', 'Vila Norte', 'São Paulo', 'SP', '12:00', '23:00', TRUE, TRUE);

INSERT INTO Lojas (Empresa_ID, Nome, Descricao, Telefone, Email, CEP, Logradouro, Numero, Bairro, Cidade, Estado, Horario_Abertura, Horario_Fechamento, Ativa, Aceita_Pedidos)
VALUES (2, 'Café Expresso Jardim', 'Loja no bairro Jardim', '11966661111', 'jardim@cafeexpresso.com', '03004000', 'Rua do Café', '150', 'Jardim', 'São Paulo', 'SP', '08:00', '20:00', TRUE, TRUE);

INSERT INTO Lojas (Empresa_ID, Nome, Descricao, Telefone, Email, CEP, Logradouro, Numero, Bairro, Cidade, Estado, Horario_Abertura, Horario_Fechamento, Ativa, Aceita_Pedidos)
VALUES (3, 'Gelato Centro', 'Sorveteria central', '11955551111', 'centro@sorveteriagelato.com', '04005000', 'Rua dos Sorvetes', '20', 'Centro', 'São Paulo', 'SP', '10:00', '22:00', TRUE, TRUE);

INSERT INTO Lojas (Empresa_ID, Nome, Descricao, Telefone, Email, CEP, Logradouro, Numero, Bairro, Cidade, Estado, Horario_Abertura, Horario_Fechamento, Ativa, Aceita_Pedidos)
VALUES (3, 'Gelato Shopping', 'Loja no Shopping Central', '11955552222', 'shopping@sorveteriagelato.com', '04006000', 'Av. Shopping', '200', 'Shopping', 'São Paulo', 'SP', '10:00', '22:00', TRUE, TRUE);

-- PRODUTOS
INSERT INTO Produtos (Loja_ID, Nome, Descricao, Preco, Quantidade, Aviso_reposicao, Disponivel, Categoria, Imagem_URL, Tempo_Preparo)
VALUES (1, 'X-Burger Especial', 'Hambúrguer artesanal com queijo e bacon', 25.00, 20, 5, TRUE, 'Hambúrguer', 'https://exemplo.com/xburger_especial.png', 20);

INSERT INTO Produtos (Loja_ID, Nome, Descricao, Preco, Quantidade, Aviso_reposicao, Disponivel, Categoria, Imagem_URL, Tempo_Preparo)
VALUES (1, 'X-Salada Tropical', 'Hambúrguer com salada fresca', 22.50, 15, 5, TRUE, 'Hambúrguer', 'https://exemplo.com/xsalada_tropical.png', 18);

INSERT INTO Produtos (Loja_ID, Nome, Descricao, Preco, Quantidade, Aviso_reposicao, Disponivel, Categoria, Imagem_URL, Tempo_Preparo)
VALUES (1, 'Batata Frita Média', 'Porção de batata frita', 12.00, 40, 10, TRUE, 'Acompanhamento', 'https://exemplo.com/batata_media.png', 0);

-- MÉTODOS DE PAGAMENTO
INSERT INTO Metodos_Pagamento (usuario_ID, tipo, final_cartao, bandeira)
VALUES (1, 'pix', NULL, NULL);

INSERT INTO Metodos_Pagamento (usuario_ID, tipo, final_cartao, bandeira)
VALUES (2, 'cartao_credito', '4321', 'MasterCard');

-- CARRINHOS
INSERT INTO Carrinho (Usuario_ID, Valor_total)
VALUES (1, 31.00);

INSERT INTO Carrinho (Usuario_ID, Valor_total)
VALUES (2, 29.50);

-- CARRINHO_ITENS
INSERT INTO Carrinho_Itens (Carrinho_ID, Produto_ID, Quantidade, Preco_Unitario)
VALUES (1, 1, 1, 25.00);

INSERT INTO Carrinho_Itens (Carrinho_ID, Produto_ID, Quantidade, Preco_Unitario)
VALUES (1, 3, 1, 6.00);