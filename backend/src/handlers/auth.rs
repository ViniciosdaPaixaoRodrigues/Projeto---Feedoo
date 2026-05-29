use actix_web::{web, HttpResponse};
use sqlx::MySql;
use sqlx::Pool;

use crate::models::{
    CreateEmpresaRequest, CreateUsuarioRequest, LoginRequest, LoginResponse, PerfilEmpresa,
    Usuario, ApiResponse,
};

// ============================================
// CADASTRO CLIENTE
// ============================================

pub async fn cadastro_cliente(
    pool: web::Data<Pool<MySql>>,
    req: web::Json<CreateUsuarioRequest>,
) -> HttpResponse {
    // Validar se email já existe
    let existing = sqlx::query_as::<_, Usuario>(
        "SELECT id, nome, email, senha, telefone, endereco, status_usuario FROM usuario WHERE email = ?",
    )
    .bind(&req.email)
    .fetch_optional(pool.get_ref())
    .await;

    match existing {
        Ok(Some(_)) => {
            return HttpResponse::BadRequest().json(ApiResponse::<()>::error(
                "Email já cadastrado".to_string(),
            ))
        }
        Err(_) => {
            return HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                "Erro ao verificar email".to_string(),
            ))
        }
        _ => {}
    }

    // Inserir novo usuário
    let result = sqlx::query(
        "INSERT INTO usuario (nome, email, senha, telefone, endereco, status_usuario) VALUES (?, ?, ?, ?, ?, 'Ativo')",
    )
    .bind(&req.nome)
    .bind(&req.email)
    .bind(&req.senha) // Em produção, usar bcrypt!
    .bind(&req.telefone)
    .bind(&req.endereco)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Created().json(ApiResponse::ok(
            "Usuário cadastrado com sucesso".to_string(),
            serde_json::json!({"email": req.email}),
        )),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao cadastrar usuário".to_string(),
        )),
    }
}

// ============================================
// LOGIN CLIENTE
// ============================================

pub async fn login_cliente(
    pool: web::Data<Pool<MySql>>,
    req: web::Json<LoginRequest>,
) -> HttpResponse {
    let user = sqlx::query_as::<_, Usuario>(
        "SELECT id, nome, email, senha, telefone, endereco, status_usuario FROM usuario WHERE email = ? AND senha = ?",
    )
    .bind(&req.email)
    .bind(&req.senha)
    .fetch_optional(pool.get_ref())
    .await;

    match user {
        Ok(Some(u)) => {
            let response = LoginResponse {
                id: u.id,
                nome: u.nome,
                email: u.email,
                token: format!("token_cliente_{}", u.id), // Em produção, usar JWT!
            };
            HttpResponse::Ok().json(ApiResponse::ok("Login realizado".to_string(), response))
        }
        Ok(None) => HttpResponse::Unauthorized().json(ApiResponse::<()>::error(
            "Credenciais inválidas".to_string(),
        )),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao fazer login".to_string(),
        )),
    }
}

// ============================================
// CADASTRO EMPRESA
// ============================================

pub async fn cadastro_empresa(
    pool: web::Data<Pool<MySql>>,
    req: web::Json<CreateEmpresaRequest>,
) -> HttpResponse {
    // Validar se email já existe
    let existing = sqlx::query_as::<_, PerfilEmpresa>(
        "SELECT id, nome, email, senha, tipo, cnpj, cpf FROM perfil_empresa WHERE email = ?",
    )
    .bind(&req.email)
    .fetch_optional(pool.get_ref())
    .await;

    match existing {
        Ok(Some(_)) => {
            return HttpResponse::BadRequest().json(ApiResponse::<()>::error(
                "Email já cadastrado".to_string(),
            ))
        }
        Err(_) => {
            return HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
                "Erro ao verificar email".to_string(),
            ))
        }
        _ => {}
    }

    // Inserir nova empresa
    let result = sqlx::query(
        "INSERT INTO perfil_empresa (nome, email, senha, tipo, cnpj, cpf) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&req.nome)
    .bind(&req.email)
    .bind(&req.senha) // Em produção, usar bcrypt!
    .bind(&req.tipo)
    .bind(&req.cnpj)
    .bind(&req.cpf)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(r) => {
            let id = r.last_insert_id();

            HttpResponse::Created().json(ApiResponse::ok(
                "Empresa cadastrada com sucesso".to_string(),
                serde_json::json!({"id": id, "email": req.email}),
            )
        )
    }
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao cadastrar empresa".to_string(),
        )),
    }
}

// ============================================
// LOGIN EMPRESA
// ============================================

pub async fn login_empresa(
    pool: web::Data<Pool<MySql>>,
    req: web::Json<LoginRequest>,
) -> HttpResponse {
    let empresa = sqlx::query_as::<_, PerfilEmpresa>(
        "SELECT id, nome, email, senha, tipo, cnpj, cpf FROM perfil_empresa WHERE email = ? AND senha = ?",
    )
    .bind(&req.email)
    .bind(&req.senha)
    .fetch_optional(pool.get_ref())
    .await;

    match empresa {
        Ok(Some(e)) => {
            let response = LoginResponse {
                id: e.id,
                nome: e.nome,
                email: e.email,
                token: format!("token_empresa_{}", e.id), // Em produção, usar JWT!
            };
            HttpResponse::Ok().json(ApiResponse::ok("Login realizado".to_string(), response))
        }
        Ok(None) => HttpResponse::Unauthorized().json(ApiResponse::<()>::error(
            "Credenciais inválidas".to_string(),
        )),
        Err(_) => HttpResponse::InternalServerError().json(ApiResponse::<()>::error(
            "Erro ao fazer login".to_string(),
        )),
    }
}
