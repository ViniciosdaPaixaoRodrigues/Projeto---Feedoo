use axum::{
    routing::{get, post},
    Router, Json,
};
use serde::{Serialize, Deserialize};
use tower_http::cors::CorsLayer;

#[derive(Serialize)]
struct Produto {
    id: i32,
    nome: String,
    preco: f64,
    imagem: String,
}

#[derive(Deserialize)]
struct Carrinho {
    produto_id: i32,
}

async fn listar_produtos() -> Json<Vec<Produto>> {
    Json(vec![
        Produto {
            id: 1,
            nome: "Hambúrguer".into(),
            preco: 25.0,
            imagem: "https://via.placeholder.com/200".into(),
        },
        Produto {
            id: 2,
            nome: "Pizza".into(),
            preco: 40.0,
            imagem: "https://via.placeholder.com/200".into(),
        },
    ])
}

async fn adicionar_carrinho(Json(payload): Json<Carrinho>) {
    println!("Produto {} adicionado ao carrinho", payload.produto_id);
}

use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/produtos", get(listar_produtos))
        .route("/carrinho", post(adicionar_carrinho))
        .layer(CorsLayer::permissive());

    println!("🚀 Rodando em http://localhost:3000");

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}