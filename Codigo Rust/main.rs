use dialoguer::{theme::ColorfulTheme, Input, Password, Select};
use dotenvy::dotenv;
use sqlx::mysql::MySqlPoolOptions;
use sqlx::types::Decimal;
use sqlx::{MySql, Pool, Row};
use std::env;

// --- Modelos ---

#[derive(Debug, sqlx::FromRow)]
struct Usuario {
    id: i32,
    nome: String,
    email: Option<String>,
    senha: String,
}

#[derive(Debug, sqlx::FromRow)]
struct PerfilEmpresa {
    id: i32,
    nome: String,
    email: String,
    senha: String,
}

#[derive(Debug, sqlx::FromRow)]
struct Loja {
    id: i32,
    nome: String,
}

#[derive(Debug, sqlx::FromRow)]
struct Produto {
    id: i32,
    nome: String,
    preco: Decimal,
}

enum Sessao {
    Nenhuma,
    Usuario(i32, String), // ID, Nome
    Empresa(i32, String), // ID, Nome
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "mysql://root:password@localhost:3306/bd_semnome".to_string());
    
    // Nota: Em um ambiente real, o pool falharia aqui se o banco não estivesse rodando.
    // Para fins de entrega do código, vamos assumir que o usuário rodará com o banco ativo.
    let pool = MySqlPoolOptions::new().max_connections(5).connect(&database_url).await?;

    let mut sessao = Sessao::Nenhuma;

    loop {
        match sessao {
            Sessao::Nenhuma => {
                let opcoes = &["Cadastrar-se", "Entrar", "Sair"];
                let selecao = Select::with_theme(&ColorfulTheme::default())
                    .with_prompt("Menu Principal")
                    .items(opcoes)
                    .default(0)
                    .interact()?;

                match selecao {
                    0 => cadastrar(&pool).await?,
                    1 => {
                        if let Some(s) = entrar(&pool).await? {
                            sessao = s;
                        }
                    }
                    _ => break,
                }
            }
            Sessao::Usuario(id, ref nome) => {
                let opcoes = &[
                    "Editar Perfil",
                    "Ver Produtos e Adicionar ao Carrinho",
                    "Ver Meu Carrinho",
                    "Sair da Conta",
                ];
                let selecao = Select::with_theme(&ColorfulTheme::default())
                    .with_prompt(format!("Olá, {}! O que deseja fazer?", nome))
                    .items(opcoes)
                    .interact()?;

                match selecao {
                    0 => editar_perfil_usuario(&pool, id).await?,
                    1 => adicionar_ao_carrinho(&pool, id).await?,
                    2 => ver_carrinho(&pool, id).await?,
                    _ => sessao = Sessao::Nenhuma,
                }
            }
            Sessao::Empresa(id, ref nome) => {
                let opcoes = &[
                    "Editar Perfil Empresa",
                    "Cadastrar Nova Loja",
                    "Gerenciar Produtos das Lojas",
                    "Sair da Conta",
                ];
                let selecao = Select::with_theme(&ColorfulTheme::default())
                    .with_prompt(format!("Painel Empresa: {}", nome))
                    .items(opcoes)
                    .interact()?;

                match selecao {
                    0 => println!("Funcionalidade de edição em breve..."),
                    1 => cadastrar_loja(&pool, id).await?,
                    2 => gerenciar_produtos(&pool, id).await?,
                    _ => sessao = Sessao::Nenhuma,
                }
            }
        }
    }

    Ok(())
}

// --- Funções de Fluxo ---

async fn cadastrar(pool: &Pool<MySql>) -> Result<(), Box<dyn std::error::Error>> {
    let tipos = &["Usuário", "Empresa"];
    let tipo = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Tipo de cadastro")
        .items(tipos)
        .interact()?;

    let nome: String = Input::new().with_prompt("Nome").interact_text()?;
    let email: String = Input::new().with_prompt("Email").interact_text()?;
    let senha = Password::new().with_prompt("Senha").interact()?;

    if tipo == 0 {
        let telefone: String = Input::new().with_prompt("Telefone").interact_text()?;
        let endereco: String = Input::new().with_prompt("Endereço").interact_text()?;
        
        sqlx::query("INSERT INTO usuario (nome, email, senha, telefone, endereco, status_usuario) VALUES (?, ?, ?, ?, ?, 'Ativo')")
            .bind(nome).bind(email).bind(senha).bind(telefone).bind(endereco)
            .execute(pool).await?;
        println!("Usuário cadastrado com sucesso!");
    } else {
        let tipo_empresa = Select::with_theme(&ColorfulTheme::default())
            .with_prompt("Tipo de Empresa")
            .items(&["PJ", "PF"])
            .interact()?;
        let doc_label = if tipo_empresa == 0 { "CNPJ" } else { "CPF" };
        let documento: String = Input::new().with_prompt(doc_label).interact_text()?;

        sqlx::query("INSERT INTO perfil_empresa (nome, email, senha, tipo, cnpj, cpf) VALUES (?, ?, ?, ?, ?, ?)")
            .bind(nome).bind(email).bind(senha).bind(if tipo_empresa == 0 { "PJ" } else { "PF" })
            .bind(if tipo_empresa == 0 { Some(documento.clone()) } else { None })
            .bind(if tipo_empresa == 1 { Some(documento) } else { None })
            .execute(pool).await?;
        println!("Empresa cadastrada com sucesso!");
    }
    Ok(())
}

async fn entrar(pool: &Pool<MySql>) -> Result<Option<Sessao>, Box<dyn std::error::Error>> {
    let tipos = &["Usuário", "Empresa"];
    let tipo = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Entrar como")
        .items(tipos)
        .interact()?;

    let email: String = Input::new().with_prompt("Email").interact_text()?;
    let senha = Password::new().with_prompt("Senha").interact()?;

    if tipo == 0 {
        let user = sqlx::query_as::<_, Usuario>("SELECT id, nome, email, senha FROM usuario WHERE email = ? AND senha = ?")
            .bind(email).bind(senha).fetch_optional(pool).await?;
        
        if let Some(u) = user {
            return Ok(Some(Sessao::Usuario(u.id, u.nome)));
        }
    } else {
        let emp = sqlx::query_as::<_, PerfilEmpresa>("SELECT id, nome, email, senha FROM perfil_empresa WHERE email = ? AND SENHA = ?")
            .bind(email).bind(senha).fetch_optional(pool).await?;
        
        if let Some(e) = emp {
            return Ok(Some(Sessao::Empresa(e.id, e.nome)));
        }
    }

    println!("Credenciais inválidas!");
    Ok(None)
}

// --- Funcionalidades Usuário ---

async fn editar_perfil_usuario(pool: &Pool<MySql>, id: i32) -> Result<(), Box<dyn std::error::Error>> {
    let opcoes = &[
        "Editar email", 
        "Trocar senha", 
        "Editar telefone", 
        "Editar endereço", 
        "Métodos de Pagamento"
        ];
    let opcao = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Gerenciar Opções do Cadastro")
        .items(opcoes)
        .interact()?;

    match opcao {
        0 => {
            let novo_email: String = Input::new().with_prompt("Novo Email").interact_text()?;
            sqlx::query("UPDATE usuario SET email = ? WHERE id = ?")
                .bind(novo_email).bind(id).execute(pool).await?;
        },
        1 => {
            let nova_senha = Password::new().with_prompt("Nova Senha").interact()?;
            sqlx::query("UPDATE usuario SET senha = ? WHERE id = ?")
                .bind(nova_senha).bind(id).execute(pool).await?;
        },
        2 => {
            let tel: String = Input::new().with_prompt("Novo Telefone").interact_text()?;
            sqlx::query("UPDATE usuario SET telefone = ? WHERE id = ?")
                .bind(tel).bind(id).execute(pool).await?;
        },
        3 => {
            let end: String = Input::new().with_prompt("Novo Endereço").interact_text()?;
            sqlx::query("UPDATE usuario SET endereco = ? WHERE id = ?")
                .bind(end).bind(id).execute(pool).await?;
        },
        4 => {
            let tipos = &["cartao_credito", "boleto", "pix"];
            let tipo_idx = Select::with_theme(&ColorfulTheme::default())
                .with_prompt("Tipo de Pagamento")
                .items(tipos)
                .interact()?;
    
                sqlx::query("INSERT INTO metodos_pagamento (usuario_id, tipo) VALUES (?, ?)")
                    .bind(id).bind(tipos[tipo_idx]).execute(pool).await?;
                println!("Método de pagamento adicionado!");
        },
        _ => unreachable!(),
    }
    println!("Perfil atualizado!");
    Ok(())
}

async fn adicionar_ao_carrinho(pool: &Pool<MySql>, user_id: i32) -> Result<(), Box<dyn std::error::Error>> {
    let produtos = sqlx::query_as::<_, Produto>("SELECT id, nome, preco FROM produtos WHERE disponivel = 1")
        .fetch_all(pool).await?;
    
    if produtos.is_empty() {
        println!("Nenhum produto disponível no momento.");
        return Ok(());
    }

    let nomes: Vec<String> = produtos.iter().map(|p| format!("{} - R${:.2}", p.nome, p.preco)).collect();
    let selecao = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Escolha um produto para o carrinho")
        .items(&nomes).interact()?;
    
    let prod = &produtos[selecao];
    let qtd: i32 = Input::new().with_prompt("Quantidade").default(1).interact_text()?;

    let carrinho = sqlx::query("SELECT id FROM carrinho WHERE usuario_id = ?")
        .bind(user_id).fetch_optional(pool).await?;
    
    let carrinho_id = match carrinho {
        Some(c) => c.get::<i32, _>("id"),
        None => {
            let res = sqlx::query("INSERT INTO carrinho (usuario_id, valor_total) VALUES (?, 0)")
                .bind(user_id).execute(pool).await?;
            res.last_insert_id() as i32
        }
    };

    sqlx::query("INSERT INTO carrinho_itens (carrinho_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)")
        .bind(carrinho_id).bind(prod.id).bind(qtd).bind(prod.preco)
        .execute(pool).await?;
    
    println!("Produto adicionado ao carrinho!");
    Ok(())
}

async fn ver_carrinho(pool: &Pool<MySql>, user_id: i32) -> Result<(), Box<dyn std::error::Error>> {
    let itens = sqlx::query(
        "SELECT p.nome, ci.quantidade, ci.preco_unitario FROM carrinho_itens ci 
         JOIN produtos p ON ci.produto_id = p.id 
         JOIN carrinho c ON ci.carrinho_id = c.id 
         WHERE c.usuario_id = ?"
    ).bind(user_id).fetch_all(pool).await?;

    println!("\n--- Seu Carrinho ---");
    for item in itens {
        let nome: String = item.get("nome");
        let qtd: i32 = item.get("quantidade");
        let preco: sqlx::types::Decimal = item.get("preco_unitario");
        println!("{} x {} - Subtotal: R${:.2}", qtd, nome, (sqlx::types::Decimal::from(qtd) * preco));
    }
    println!("--------------------\n");
    Ok(())
}

// --- Funcionalidades Empresa ---

async fn cadastrar_loja(pool: &Pool<MySql>, empresa_id: i32) -> Result<(), Box<dyn std::error::Error>> {
    let nome: String = Input::new().with_prompt("Nome da Loja").interact_text()?;
    sqlx::query("INSERT INTO lojas (empresa_id, nome) VALUES (?, ?)")
        .bind(empresa_id).bind(nome).execute(pool).await?;
    println!("Loja cadastrada!");
    Ok(())
}

async fn gerenciar_produtos(pool: &Pool<MySql>, empresa_id: i32) -> Result<(), Box<dyn std::error::Error>> {
    let lojas = sqlx::query_as::<_, Loja>("SELECT id, nome FROM lojas WHERE empresa_id = ?")
        .bind(empresa_id).fetch_all(pool).await?;
    
    if lojas.is_empty() {
        println!("Você precisa cadastrar uma loja primeiro!");
        return Ok(());
    }

    let nomes_lojas: Vec<String> = lojas.iter().map(|l| l.nome.clone()).collect();
    let loja_idx = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Escolha a loja para gerenciar produtos")
        .items(&nomes_lojas).interact()?;
    
    let loja_id = lojas[loja_idx].id;

    let opcoes = &["Ver produtos", "Adicionar produtos", "Remover produtos", "Editar produtos", "Voltar"];
    let selecaoprod = Select::with_theme(&ColorfulTheme::default())
                    .with_prompt("Menu Principal")
                    .items(opcoes)
                    .default(0)
                    .interact()?;
    match selecaoprod {
        0 => {
            let produtos = sqlx::query(
        "SELECT p.id, p.nome, p.preco, p.quantidade FROM produtos p WHERE loja_id = ?"
            ).bind(empresa_id).fetch_all(pool).await?;

            println!("\n--- Seus Produtos ---");
            println!("ID | Nome do produto | Preço | Quantidade");
            for produto in produtos {
                let id_prod: i32 = produto.get("id");
                let nome: String = produto.get("nome");
                let qtd: i32 = produto.get("quantidade");
                let preco: sqlx::types::Decimal = produto.get("preco");
                println!("{} | {} | {} | {}", id_prod, nome, preco, qtd);
            }
            println!("--------------------\n");
        },
        1 => {
            let nome_prod: String = Input::new().with_prompt("Nome do Produto").interact_text()?;
            let preco: Decimal = Input::new().with_prompt("Preço").interact_text()?;
            let img: String = Input::new().with_prompt("URL da Imagem").interact_text()?;

            sqlx::query("INSERT INTO produtos (loja_id, nome, preco, imagem_url) VALUES (?, ?, ?, ?)")
                .bind(loja_id).bind(nome_prod).bind(preco).bind(img)
                .execute(pool).await?;
            println!("Produto cadastrado na loja!");
        },

        2 => {
            let id_prod: String = Input::new().with_prompt("id do Produto").interact_text()?;

            sqlx::query("DELETE FROM produtos WHERE id = ? AND loja_id = ?")
                .bind(id_prod)
                .bind(empresa_id)
                .execute(pool).await?;
            println!("Produto removido da loja!");
        },
        3 => {
            let id_prod: i32 = Input::new().with_prompt("ID do produto: ").interact_text()?;
            menu_editar_produto(pool, id_prod).await?;
        }
        _ => todo!(),
    }
    Ok(())
}

async fn menu_editar_produto(pool: &Pool<MySql>, id_prod: i32) -> Result<(), Box<dyn std::error::Error>> {
    // Esta função ativa um Menu que permite editar os produtos de uma loja, contanto que seja entregue uma variável
    // de pool e uma do id do produto, contextualizando assim o menu e permitindo-o rodar normalmente.
    let opcoes_edicao = &[
        "Nome", 
        "Preço", 
        "Quantidade", 
        "Aviso de Reposição", 
        "Categoria", 
        "URL da Imagem", 
        "Tempo de Preparo", 
        "Finalizar Edição"
    ];

    loop {
        let selecao = Select::with_theme(&ColorfulTheme::default())
            .with_prompt("O que você deseja editar?")
            .items(opcoes_edicao)
            .interact()?;

        match selecao {
            0 => {
                // Nome produto
                let novo_nome: String = Input::new().with_prompt("Novo Nome: ").interact_text()?;
                sqlx::query("UPDATE produtos SET nome = ? WHERE id = ?").bind(novo_nome).bind(id_prod).execute(pool).await?;
            },
            1 => {
                // Preço
                let novo_preco: Decimal = Input::new().with_prompt("Novo Preço: ").interact_text()?;
                sqlx::query("UPDATE produtos SET preco = ? WHERE id = ?").bind(novo_preco).bind(id_prod).execute(pool).await?;
            },
            2 => {
                // Quantidade
                let nova_qtd: i32 = Input::new().with_prompt("Nova quantidade: ").interact_text()?;
                sqlx::query("UPDATE produtos SET quantidade = ? WHERE id = ?").bind(nova_qtd).bind(id_prod).execute(pool).await?;
            },
            3 => {
                // Aviso reposição
                let novo_aviso: i32 = Input::new().with_prompt("Qual a nova quantidade para aviso: ").interact_text()?;
                sqlx::query("UPDATE produtos SET aviso_reposicao = ? WHERE id = ?").bind(novo_aviso).bind(id_prod).execute(pool).await?;
            },
            4 => {
                // Categoria
                let nova_categoria: String = Input::new().with_prompt("Qual a nova categoria:  ").interact_text()?;
                sqlx::query("UPDATE produtos SET categoria = ? WHERE id = ?").bind(nova_categoria).bind(id_prod).execute(pool).await?;
            },
            5 => {
                // URL Imagem
                let nova_url: String = Input::new().with_prompt(("Qual a nova URL da imagem: ")).interact_text()?;
                sqlx::query("UPDATE produtos SET imagem_url = ? WHERE id = ?").bind(nova_url).bind(id_prod).execute(pool).await?;
            },
            6 => {
                // Tempo de Preparo
                let novo_tempo_preparo: i32 = Input::new().with_prompt("Qual o novo tempo de preparo: ").interact_text()?;
                sqlx::query("UPDATE produtos SET tempo_preparo = ? WHERE id = ?").bind(novo_tempo_preparo).bind(id_prod).execute(pool).await?;
            }
            7 => break, // Sai do loop e volta para o menu anterior
            _ => unreachable!(),
        }
        println!("Campo atualizado com sucesso!");
    }
    Ok(())
}