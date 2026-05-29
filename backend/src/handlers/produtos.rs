use actix_web::{web, HttpResponse};
use sqlx::MySql;
use sqlx::Pool;

use crate::models::{CreateProdutoRequest, Produto, UpdateProdutoRequest, ApiResponse};

// ============================================
// GET - LISTAR PRODUTOS DE UMA LOJA
// ============================================

pub async fn get_produtos(
    pool: web::Data<Pool<MySql>>,
    loja_id: web::Path<i32>,
) -> HttpResponse {
    let loja_id = loja_id.into_inner();

    let produtos = sqlx::query_as::<_, Produto>(
        "SELECT id, loja_id, nome, descricao, Preco as preco, quantidade, aviso_reposicao, disponivel, categoria, imagem_url, total_vendas, tempo_preparo, data_cadastro, ultima_atualizacao FROM produtos WHERE loja_id = ?",
    )
    .bind(loja_id)
    .fetch_all(pool.get_ref())
    .await;

    match produtos {
        Ok(produtos) => HttpResponse::Ok().json(ApiResponse::ok(
            "Produtos carregados com sucesso".to_string(),
            produtos,
        )),
        Err(e) => {
            println!("Erro ao carregar produtos: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao carregar produtos: {}", e),
            ))
        }
    }
}

// ============================================
// GET - OBTER PRODUTO POR ID
// ============================================

pub async fn get_produto(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<(i32, i32)>,
) -> HttpResponse {
    let (loja_id, produto_id) = path.into_inner();

    let produto = sqlx::query_as::<_, Produto>(
        "SELECT id, loja_id, nome, descricao, Preco as preco, quantidade, aviso_reposicao, disponivel, categoria, imagem_url, total_vendas, tempo_preparo, data_cadastro, ultima_atualizacao FROM produtos WHERE id = ? AND loja_id = ?",
    )
    .bind(produto_id)
    .bind(loja_id)
    .fetch_optional(pool.get_ref())
    .await;

    match produto {
        Ok(Some(produto)) => HttpResponse::Ok().json(ApiResponse::ok(
            "Produto encontrado".to_string(),
            produto,
        )),
        Ok(None) => HttpResponse::NotFound().json(ApiResponse::<()>::error(
            "Produto não encontrado".to_string(),
        )),
        Err(e) => {
            println!("Erro ao buscar produto: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao buscar produto: {}", e),
            ))
        }
    }
}
// ============================================================
// GET - COLETAR TODOS OS PRODUTOS SEM SEPARAÇÃO DE LOJA
// ============================================================
pub async fn get_todos_produtos(
    pool: web::Data<Pool<MySql>>,
) -> HttpResponse {

    let produtos = sqlx::query_as::<_, Produto>(
        "SELECT
            id,
            loja_id,
            nome,
            descricao,
            Preco as preco,
            quantidade,
            aviso_reposicao,
            disponivel,
            categoria,
            imagem_url,
            total_vendas,
            tempo_preparo,
            data_cadastro,
            ultima_atualizacao
        FROM produtos
        WHERE disponivel = true"
    )
    .fetch_all(pool.get_ref())
    .await;

    match produtos {
        Ok(produtos) => HttpResponse::Ok().json(
            ApiResponse::ok(
                "Produtos carregados com sucesso".to_string(),
                produtos
            )
        ),

        Err(e) => {
            println!("Erro ao carregar produtos: {:?}", e);

            HttpResponse::InternalServerError().json(
                ApiResponse::<()>::error(
                    format!("Erro ao carregar produtos: {}", e)
                )
            )
        }
    }
}

// ============================================
// POST - CRIAR PRODUTO
// ============================================

pub async fn create_produto(
    pool: web::Data<Pool<MySql>>,
    loja_id: web::Path<i32>,
    req: web::Json<CreateProdutoRequest>,
) -> HttpResponse {
    let loja_id = loja_id.into_inner();

    let result = sqlx::query(
        "INSERT INTO produtos (loja_id, nome, descricao, Preco, quantidade, aviso_reposicao, disponivel, categoria, imagem_url, tempo_preparo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(loja_id)
    .bind(&req.nome)
    .bind(&req.descricao)
    .bind(req.preco)
    .bind(req.quantidade.unwrap_or(0))
    .bind(req.aviso_reposicao.unwrap_or(0))
    .bind(true)
    .bind(&req.categoria)
    .bind(&req.imagem_url)
    .bind(req.tempo_preparo.unwrap_or(15))
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Created().json(ApiResponse::ok(
            "Produto criado com sucesso".to_string(),
            serde_json::json!({"nome": req.nome}),
        )),
        Err(e) => {
            println!("Erro ao criar produto: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao criar produto: {}", e),
            ))
        }
    }
}

// ============================================
// PUT - ATUALIZAR PRODUTO
// ============================================

pub async fn update_produto(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<(i32, i32)>,
    req: web::Json<UpdateProdutoRequest>,
) -> HttpResponse {
    let (loja_id, produto_id) = path.into_inner();

    let mut query = "UPDATE produtos SET ".to_string();
    let mut updates = Vec::new();

    if req.nome.is_some() {
        updates.push("nome = ?");
    }
    if req.descricao.is_some() {
        updates.push("descricao = ?");
    }
    if req.preco.is_some() {
        updates.push("Preco = ?");
    }
    if req.quantidade.is_some() {
        updates.push("quantidade = ?");
    }
    if req.aviso_reposicao.is_some() {
        updates.push("aviso_reposicao = ?");
    }
    if req.categoria.is_some() {
        updates.push("categoria = ?");
    }
    if req.imagem_url.is_some() {
        updates.push("imagem_url = ?");
    }
    if req.tempo_preparo.is_some() {
        updates.push("tempo_preparo = ?");
    }
    if req.disponivel.is_some() {
        updates.push("disponivel = ?");
    }

    if updates.is_empty() {
        return HttpResponse::BadRequest().json(ApiResponse::<()>::error(
            "Nenhum campo para atualizar".to_string(),
        ));
    }

    query.push_str(&updates.join(", "));
    query.push_str(" WHERE id = ? AND loja_id = ?");

    let mut query_builder = sqlx::query(&query);

    if let Some(nome) = &req.nome {
        query_builder = query_builder.bind(nome);
    }
    if let Some(descricao) = &req.descricao {
        query_builder = query_builder.bind(descricao);
    }
    if let Some(preco) = req.preco {
        query_builder = query_builder.bind(preco);
    }
    if let Some(quantidade) = req.quantidade {
        query_builder = query_builder.bind(quantidade);
    }
    if let Some(aviso) = req.aviso_reposicao {
        query_builder = query_builder.bind(aviso);
    }
    if let Some(categoria) = &req.categoria {
        query_builder = query_builder.bind(categoria);
    }
    if let Some(imagem) = &req.imagem_url {
        query_builder = query_builder.bind(imagem);
    }
    if let Some(tempo) = req.tempo_preparo {
        query_builder = query_builder.bind(tempo);
    }
    if let Some(disponivel) = req.disponivel {
        query_builder = query_builder.bind(disponivel);
    }

    let result = query_builder
        .bind(produto_id)
        .bind(loja_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(r) if r.rows_affected() > 0 => HttpResponse::Ok().json(ApiResponse::ok(
            "Produto atualizado com sucesso".to_string(),
            serde_json::json!({"id": produto_id}),
        )),
        Ok(_) => HttpResponse::NotFound().json(ApiResponse::<()>::error(
            "Produto não encontrado".to_string(),
        )),
        Err(e) => {
            println!("Erro ao atualizar produto: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao atualizar produto: {}", e),
            ))
        }
    }
}

// ============================================
// DELETE - DELETAR PRODUTO
// ============================================

pub async fn delete_produto(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<(i32, i32)>,
) -> HttpResponse {
    let (loja_id, produto_id) = path.into_inner();

    let result = sqlx::query("DELETE FROM produtos WHERE id = ? AND loja_id = ?")
        .bind(produto_id)
        .bind(loja_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(r) if r.rows_affected() > 0 => HttpResponse::Ok().json(ApiResponse::ok(
            "Produto deletado com sucesso".to_string(),
            serde_json::json!({"id": produto_id}),
        )),
        Ok(_) => HttpResponse::NotFound().json(ApiResponse::<()>::error(
            "Produto não encontrado".to_string(),
        )),
        Err(e) => {
            println!("Erro ao deletar produto: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao deletar produto: {}", e),
            ))
        }
    }
}
