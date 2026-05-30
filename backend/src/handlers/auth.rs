use actix_web::{web, HttpResponse};
use sqlx::MySql;
use sqlx::Pool;

use argon2::{
    password_hash::{
        PasswordHash,
        PasswordHasher,
        PasswordVerifier,
        SaltString,
        rand_core::OsRng,
    },
    Argon2,
};

use crate::models::{
    CreateEmpresaRequest,
    CreateUsuarioRequest,
    UpdateUsuarioRequest,
    UsuarioResponse,
    LoginRequest,
    LoginResponse,
    PerfilEmpresa,
    Usuario,
    ApiResponse,
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
    let salt = SaltString::generate(&mut OsRng);

    let senha_hash = Argon2::default()
        .hash_password(req.senha.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let result = sqlx::query(
        "INSERT INTO usuario (nome, email, senha, telefone, endereco, status_usuario) VALUES (?, ?, ?, ?, ?, 'Ativo')",
    )
    .bind(&req.nome)
    .bind(&req.email)
    .bind(senha_hash)
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
        "SELECT id, nome, email, senha, telefone, endereco, status_usuario
         FROM usuario
         WHERE email = ?"
    )
    .bind(&req.email)
    .fetch_optional(pool.get_ref())
    .await;

    match user {
        Ok(Some(u)) => {

            let parsed_hash = match PasswordHash::new(&u.senha) {
                Ok(hash) => hash,
                Err(_) => {
                    return HttpResponse::InternalServerError().json(
                        ApiResponse::<()>::error(
                            "Erro ao processar senha".to_string()
                        )
                    );
                }
            };

            let senha_valida = Argon2::default()
                .verify_password(
                    req.senha.as_bytes(),
                    &parsed_hash,
                )
                .is_ok();

            if !senha_valida {
                return HttpResponse::Unauthorized().json(
                    ApiResponse::<()>::error(
                        "Credenciais inválidas".to_string()
                    )
                );
            }

            let response = LoginResponse {
                id: u.id,
                nome: u.nome,
                email: u.email,
                token: format!("token_cliente_{}", u.id), // Trocar por JWT futuramente
            };

            HttpResponse::Ok().json(
                ApiResponse::ok(
                    "Login realizado".to_string(),
                    response,
                )
            )
        }

        Ok(None) => HttpResponse::Unauthorized().json(
            ApiResponse::<()>::error(
                "Credenciais inválidas".to_string()
            )
        ),

        Err(_) => HttpResponse::InternalServerError().json(
            ApiResponse::<()>::error(
                "Erro ao fazer login".to_string()
            )
        ),
    }
}

// ============================================
// COLECT INFO CLIENTE
// ============================================
pub async fn get_cliente(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<i32>,
) -> HttpResponse {

    let id = path.into_inner();

    let result = sqlx::query_as::<_, Usuario>(
        "SELECT id, nome, email, senha, telefone, endereco, status_usuario
         FROM usuario
         WHERE id = ?"
    )
    .bind(id)
    .fetch_optional(pool.get_ref())
    .await;

    match result {
    Ok(Some(usuario)) => {

        let response = UsuarioResponse {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            endereco: usuario.endereco,
            status_usuario: usuario.status_usuario,
        };

        HttpResponse::Ok().json(
            ApiResponse::ok(
                "Usuário encontrado".to_string(),
                response
            )
        )
    },

    Ok(None) => HttpResponse::NotFound().json(
        ApiResponse::<()>::error(
            "Usuário não encontrado".to_string()
        )
    ),

    Err(_) => HttpResponse::InternalServerError().json(
        ApiResponse::<()>::error(
            "Erro ao buscar usuário".to_string()
        )
    )
}
}

// ============================================
// UPDATE CLIENTE
// ============================================

pub async fn update_cliente(
    pool: web::Data<Pool<MySql>>,
    path: web::Path<i32>,
    req: web::Json<UpdateUsuarioRequest>,
) -> HttpResponse {

    let id = path.into_inner();

    let senha_hash = if let Some(senha) = &req.senha {

        let salt = SaltString::generate(&mut OsRng);

        Some(
            Argon2::default()
                .hash_password(senha.as_bytes(), &salt)
                .unwrap()
                .to_string()
        )

    } else {
        None
    };

    let result = sqlx::query(
        r#"
        UPDATE usuario
        SET
            nome = COALESCE(?, nome),
            email = COALESCE(?, email),
            telefone = COALESCE(?, telefone),
            endereco = COALESCE(?, endereco),
            senha = COALESCE(?, senha)
        WHERE id = ?
        "#
    )
    .bind(&req.nome)
    .bind(&req.email)
    .bind(&req.telefone)
    .bind(&req.endereco)
    .bind(&senha_hash)
    .bind(id)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().json(
            ApiResponse::ok(
                "Perfil atualizado".to_string(),
                serde_json::json!({})
            )
        ),

        Err(_) => HttpResponse::InternalServerError().json(
            ApiResponse::<()>::error(
                "Erro ao atualizar perfil".to_string()
            )
        )
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
    let salt = SaltString::generate(&mut OsRng);

    let senha_hash = Argon2::default()
        .hash_password(req.senha.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let result = sqlx::query(
        "INSERT INTO perfil_empresa (nome, email, senha, tipo, cnpj, cpf) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&req.nome)
    .bind(&req.email)
    .bind(senha_hash)
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
        "SELECT id, nome, email, senha, tipo, cnpj, cpf
         FROM perfil_empresa
         WHERE email = ?"
    )
    .bind(&req.email)
    .fetch_optional(pool.get_ref())
    .await;

    match empresa {
        Ok(Some(e)) => {

            let parsed_hash = match PasswordHash::new(&e.senha) {
                Ok(hash) => hash,
                Err(_) => {
                    return HttpResponse::InternalServerError().json(
                        ApiResponse::<()>::error(
                            "Erro ao processar senha".to_string()
                        )
                    );
                }
            };

            let senha_valida = Argon2::default()
                .verify_password(
                    req.senha.as_bytes(),
                    &parsed_hash,
                )
                .is_ok();

            if !senha_valida {
                return HttpResponse::Unauthorized().json(
                    ApiResponse::<()>::error(
                        "Credenciais inválidas".to_string()
                    )
                );
            }

            let response = LoginResponse {
                id: e.id,
                nome: e.nome,
                email: e.email,
                token: format!("token_empresa_{}", e.id), // Trocar por JWT futuramente
            };

            HttpResponse::Ok().json(
                ApiResponse::ok(
                    "Login realizado".to_string(),
                    response,
                )
            )
        }

        Ok(None) => HttpResponse::Unauthorized().json(
            ApiResponse::<()>::error(
                "Credenciais inválidas".to_string()
            )
        ),

        Err(_) => HttpResponse::InternalServerError().json(
            ApiResponse::<()>::error(
                "Erro ao fazer login".to_string()
            )
        ),
    }
}