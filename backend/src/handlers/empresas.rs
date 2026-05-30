use actix_web::{web, HttpResponse, Responder};
use sqlx::MySqlPool;
use crate::models::{ApiResponse, UpdateEmpresaRequest};
use argon2::{Argon2, PasswordHasher};
use password_hash::{SaltString, rand_core::OsRng};

use crate::models::*;

pub async fn get_empresa(
    pool: web::Data<MySqlPool>,
    path: web::Path<i32>,
) -> HttpResponse {
    let id = path.into_inner();

    let empresa = sqlx::query_as!(
        PerfilEmpresa,
        r#"
        SELECT id, nome, email, senha, tipo, cnpj, cpf
        FROM perfil_empresa
        WHERE id = ?
        "#,
        id
    )
    .fetch_one(pool.get_ref())
    .await;

    match empresa {
        Ok(emp) => HttpResponse::Ok().json(
            ApiResponse::ok("Empresa encontrada".to_string(), emp)
        ),
        Err(_) => HttpResponse::NotFound().json(
            ApiResponse::<()>::error("Empresa não encontrada".to_string())
        ),
    }
}

pub async fn update_empresa(
    pool: web::Data<MySqlPool>,
    path: web::Path<i32>,
    body: web::Json<UpdateEmpresaRequest>,
) -> HttpResponse {
    let id = path.into_inner();
    let data = body.into_inner();

    // 1. Buscar empresa atual
    let empresa = match sqlx::query!(
        r#"SELECT id, nome, email, senha, cnpj, cpf FROM perfil_empresa WHERE id = ?"#,
        id
    )
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(e) => e,
        Err(_) => {
            return HttpResponse::NotFound().json(
                ApiResponse::<()>::error("Empresa não encontrada".to_string())
            );
        }
    };

    // 2. Campos finais (update parcial)
    let nome = data.nome.unwrap_or(empresa.nome);
    let email = data.email.unwrap_or(empresa.email);
    let cnpj = data.cnpj.or(empresa.cnpj);
    let cpf = data.cpf.or(empresa.cpf);

    // 3. Senha (opcional)
    let senha_hash = if let Some(senha) = data.senha {
        let salt = SaltString::generate(&mut OsRng);

        match Argon2::default().hash_password(senha.as_bytes(), &salt) {
            Ok(hash) => Some(hash.to_string()),
            Err(_) => {
                return HttpResponse::InternalServerError().json(
                    ApiResponse::<()>::error("Erro ao gerar senha".to_string())
                );
            }
        }
    } else {
        None
    };

    // 4. UPDATE LIMPO
    let result = sqlx::query(
        r#"
        UPDATE perfil_empresa
        SET
            nome = ?,
            email = ?,
            senha = COALESCE(?, senha),
            cnpj = ?,
            cpf = ?
        WHERE id = ?
        "#
    )
    .bind(nome)
    .bind(email)
    .bind(senha_hash)
    .bind(cnpj)
    .bind(cpf)
    .bind(id)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().json(
            ApiResponse::ok("Empresa atualizada com sucesso".to_string(), ())
        ),
        Err(e) => HttpResponse::InternalServerError().json(
            ApiResponse::<()>::error(e.to_string())
        ),
    }
}

#[derive(serde::Deserialize)]
pub struct StatusPayload {
    status: String,
}

pub async fn alterar_status_empresa(
    pool: web::Data<MySqlPool>,
    path: web::Path<i32>,
    body: web::Json<StatusPayload>,
) -> impl Responder {
    let empresa_id = path.into_inner();

    let result = sqlx::query!(
        r#"
        UPDATE perfil_empresa
        SET status_empresa = ?
        WHERE id = ?
        "#,
        body.status,
        empresa_id
    )
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({
            "message": "Empresa atualizada com sucesso"
        })),
        Err(e) => {
            eprintln!("Erro SQL: {:?}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "message": "Erro ao atualizar empresa"
            }))
        }
    }
}