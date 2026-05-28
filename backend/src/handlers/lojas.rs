use actix_web::{web, HttpResponse};
use sqlx::MySql;
use sqlx::Pool;

use crate::models::{CreateLojaRequest, Loja, UpdateLojaRequest, ApiResponse};

// ============================================
// GET - LISTAR LOJAS DE UMA EMPRESA
// ============================================

pub async fn get_lojas(
    pool: web::Data<Pool<MySql>>,
    empresa_id: web::Path<i32>,
) -> HttpResponse {
    let lojas = sqlx::query_as::<_, Loja>(
        "SELECT id, empresa_id, nome, descricao, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, latitude, longitude, horario_abertura, horario_fechamento, ativa, aceita_pedidos, data_cadastro, ultima_atualizacao FROM lojas WHERE empresa_id = ?",
    )
    .bind(empresa_id.into_inner())
    .fetch_all(pool.get_ref())
    .await;

    match lojas {
        Ok(lojas) => HttpResponse::Ok().json(ApiResponse::ok(
            "Lojas carregadas com sucesso".to_string(),
            lojas,
        )),
        Err(e) => {
            println!("Erro ao carregar lojas: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao carregar lojas: {}", e),
            ))
        }
    }
}

// ============================================
// GET - OBTER LOJA POR ID
// ============================================

pub async fn get_loja(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<(i32, i32)>,
) -> HttpResponse {
    let (empresa_id, loja_id) = path.into_inner();

    let loja = sqlx::query_as::<_, Loja>(
        "SELECT id, empresa_id, nome, descricao, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, latitude, longitude, horario_abertura, horario_fechamento, ativa, aceita_pedidos, data_cadastro, ultima_atualizacao FROM lojas WHERE id = ? AND empresa_id = ?",
    )
    .bind(loja_id)
    .bind(empresa_id)
    .fetch_optional(pool.get_ref())
    .await;

    match loja {
        Ok(Some(loja)) => HttpResponse::Ok().json(ApiResponse::ok(
            "Loja encontrada".to_string(),
            loja,
        )),
        Ok(None) => HttpResponse::NotFound().json(ApiResponse::<()>::error(
            "Loja não encontrada".to_string(),
        )),
        Err(e) => {
            println!("Erro ao buscar loja: {:?}", e);
            HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                format!("Erro ao buscar loja: {}", e),
            ))
        }
    }
}

// ============================================
// POST - CRIAR LOJA
// ============================================

pub async fn create_loja(
    pool: web::Data<Pool<MySql>>,
    empresa_id: web::Path<i32>,
    req: web::Json<CreateLojaRequest>,
) -> HttpResponse {
    let result = sqlx::query(
        "INSERT INTO lojas (empresa_id, nome, descricao, telefone, email, cep, logradouro, numero, bairro, cidade, estado, horario_abertura, horario_fechamento, ativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)",
    )
    .bind(empresa_id.into_inner())
    .bind(&req.nome)
    .bind(&req.descricao)
    .bind(&req.telefone)
    .bind(&req.email)
    .bind(&req.cep)
    .bind(&req.logradouro)
    .bind(&req.numero)
    .bind(&req.bairro)
    .bind(&req.cidade)
    .bind(&req.estado)
    .bind(&req.horario_abertura)
    .bind(&req.horario_fechamento)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Created().json(ApiResponse::ok(
            "Loja criada com sucesso".to_string(),
            serde_json::json!({"nome": req.nome}),
        )),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao criar loja".to_string(),
        )),
    }
}

// ============================================
// PUT - ATUALIZAR LOJA
// ============================================

pub async fn update_loja(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<(i32, i32)>,
    req: web::Json<UpdateLojaRequest>,
) -> HttpResponse {
    let (empresa_id, loja_id) = path.into_inner();

    // Construir query dinâmica
    let mut query = "UPDATE lojas SET ".to_string();
    let mut updates = Vec::new();

    if req.nome.is_some() {
        updates.push("nome = ?");
    }
    if req.descricao.is_some() {
        updates.push("descricao = ?");
    }
    if req.telefone.is_some() {
        updates.push("telefone = ?");
    }
    if req.email.is_some() {
        updates.push("email = ?");
    }
    if req.cep.is_some() {
        updates.push("cep = ?");
    }
    if req.logradouro.is_some() {
        updates.push("logradouro = ?");
    }
    if req.numero.is_some() {
        updates.push("numero = ?");
    }
    if req.bairro.is_some() {
        updates.push("bairro = ?");
    }
    if req.cidade.is_some() {
        updates.push("cidade = ?");
    }
    if req.estado.is_some() {
        updates.push("estado = ?");
    }
    if req.horario_abertura.is_some() {
        updates.push("horario_abertura = ?");
    }
    if req.horario_fechamento.is_some() {
        updates.push("horario_fechamento = ?");
    }
    if req.ativa.is_some() {
        updates.push("ativa = ?");
    }

    if updates.is_empty() {
        return HttpResponse::BadRequest().json(ApiResponse::<()>::error(
            "Nenhum campo para atualizar".to_string(),
        ));
    }

    query.push_str(&updates.join(", "));
    query.push_str(" WHERE id = ? AND empresa_id = ?");

    // Executar query (simplificado - em produção, usar query builder)
    let result = sqlx::query(&query)
        .bind(&req.nome)
        .bind(&req.descricao)
        .bind(&req.telefone)
        .bind(&req.email)
        .bind(&req.cep)
        .bind(&req.logradouro)
        .bind(&req.numero)
        .bind(&req.bairro)
        .bind(&req.cidade)
        .bind(&req.estado)
        .bind(&req.horario_abertura)
        .bind(&req.horario_fechamento)
        .bind(req.ativa)
        .bind(loja_id)
        .bind(empresa_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(r) if r.rows_affected() > 0 => HttpResponse::Ok().json(ApiResponse::ok(
            "Loja atualizada com sucesso".to_string(),
            serde_json::json!({"id": loja_id}),
        )),
        Ok(_) => HttpResponse::NotFound().json(ApiResponse::<()>::error(
            "Loja não encontrada".to_string(),
        )),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao atualizar loja".to_string(),
        )),
    }
}

// ============================================
// DELETE - DELETAR LOJA
// ============================================

pub async fn delete_loja(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<(i32, i32)>,
) -> HttpResponse {
    let (empresa_id, loja_id) = path.into_inner();

    let result = sqlx::query("DELETE FROM lojas WHERE id = ? AND empresa_id = ?")
        .bind(loja_id)
        .bind(empresa_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(r) if r.rows_affected() > 0 => HttpResponse::Ok().json(ApiResponse::ok(
            "Loja deletada com sucesso".to_string(),
            serde_json::json!({"id": loja_id}),
        )),
        Ok(_) => HttpResponse::NotFound().json(ApiResponse::<()>::error(
            "Loja não encontrada".to_string(),
        )),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao deletar loja".to_string(),
        )),
    }
}
