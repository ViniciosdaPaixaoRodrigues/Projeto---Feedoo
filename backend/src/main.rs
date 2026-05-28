mod handlers;
mod models;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use actix_files::Files;
use dotenvy::dotenv;
use sqlx::mysql::MySqlPoolOptions;
use std::env;

use handlers::{auth, lojas, produtos};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Carregar variáveis de ambiente
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL não encontrada");
        //.unwrap_or_else(|_| "mysql://root:password@localhost:3306/bd_semnome".to_string());
    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let server_port = env::var("SERVER_PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse::<u16>()
        .unwrap_or(3001);
    let cors_origin = env::var("CORS_ORIGIN").unwrap_or_else(|_| "http://localhost:8000".to_string());

    // Criar pool de conexões
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Erro ao conectar ao banco de dados");

    println!("Conectado ao banco de dados");
    println!("Servidor iniciando em http://{}:{}", server_host, server_port);

    // Iniciar servidor HTTP
    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(&cors_origin)
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec!["Content-Type", "Authorization"])
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(pool.clone()))
    .wrap(cors)
    
    // ============================================
    // ROTAS DE API (PRIMEIRO!)
    // ============================================
    .route("/api/auth/cadastro-cliente", web::post().to(auth::cadastro_cliente))
    .route("/api/auth/login-cliente", web::post().to(auth::login_cliente))
    .route("/api/auth/cadastro-empresa", web::post().to(auth::cadastro_empresa))
    .route("/api/auth/login-empresa", web::post().to(auth::login_empresa))
    
    .route("/api/empresas/{empresa_id}/lojas", web::get().to(lojas::get_lojas))
    .route("/api/empresas/{empresa_id}/lojas", web::post().to(lojas::create_loja))
    .route("/api/empresas/{empresa_id}/lojas/{loja_id}", web::get().to(lojas::get_loja))
    .route("/api/empresas/{empresa_id}/lojas/{loja_id}", web::put().to(lojas::update_loja))
    .route("/api/empresas/{empresa_id}/lojas/{loja_id}", web::delete().to(lojas::delete_loja))
    
    .route("/api/lojas/{loja_id}/produtos", web::get().to(produtos::get_produtos))
    .route("/api/lojas/{loja_id}/produtos", web::post().to(produtos::create_produto))
    .route("/api/lojas/{loja_id}/produtos/{produto_id}", web::get().to(produtos::get_produto))
    .route("/api/lojas/{loja_id}/produtos/{produto_id}", web::put().to(produtos::update_produto))
    .route("/api/lojas/{loja_id}/produtos/{produto_id}", web::delete().to(produtos::delete_produto))

    .route("/health", web::get().to(|| async { "OK" }))
    
    // ============================================
    // SERVIR ARQUIVOS ESTÁTICOS (POR ÚLTIMO!)
    // ============================================
    .service(Files::new("/", "./Frontend")
        .index_file("index.html")
        .use_last_modified(true))
    })
    .bind((server_host.as_str(), server_port))?
    .run()
    .await
}
