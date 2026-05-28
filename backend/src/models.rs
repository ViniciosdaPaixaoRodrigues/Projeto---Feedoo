use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

// ============================================
// USUÁRIO (Cliente)
// ============================================

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Usuario {
    pub id: i32,
    pub nome: String,
    pub email: String,
    pub senha: String,
    pub telefone: Option<String>,
    pub endereco: Option<String>,
    pub status_usuario: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUsuarioRequest {
    pub nome: String,
    pub email: String,
    pub senha: String,
    pub telefone: Option<String>,
    pub endereco: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub senha: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub id: i32,
    pub nome: String,
    pub email: String,
    pub token: String,
}

// ============================================
// EMPRESA (Perfil Empresa)
// ============================================

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PerfilEmpresa {
    pub id: i32,
    pub nome: String,
    pub email: String,
    pub senha: String,
    pub tipo: String, // PF ou PJ
    pub cnpj: Option<String>,
    pub cpf: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateEmpresaRequest {
    pub nome: String,
    pub email: String,
    pub senha: String,
    pub tipo: String, // "PF" ou "PJ"
    pub cnpj: Option<String>,
    pub cpf: Option<String>,
}

// ============================================
// LOJA
// ============================================

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Loja {
    pub id: i32,
    pub empresa_id: i32,
    pub nome: String,
    pub descricao: Option<String>,
    pub telefone: Option<String>,
    pub email: Option<String>,
    pub cep: Option<String>,
    pub logradouro: Option<String>,
    pub numero: Option<String>,
    pub complemento: Option<String>,
    pub bairro: Option<String>,
    pub cidade: Option<String>,
    pub estado: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub horario_abertura: Option<chrono::NaiveTime>,
    pub horario_fechamento: Option<chrono::NaiveTime>,
    pub ativa: bool,
    pub aceita_pedidos: bool,
    pub data_cadastro: DateTime<Utc>,
    pub ultima_atualizacao: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateLojaRequest {
    pub nome: String,
    pub descricao: Option<String>,
    pub telefone: Option<String>,
    pub email: Option<String>,
    pub cep: Option<String>,
    pub logradouro: Option<String>,
    pub numero: Option<String>,
    pub bairro: Option<String>,
    pub cidade: Option<String>,
    pub estado: Option<String>,
    pub horario_abertura: Option<String>,
    pub horario_fechamento: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateLojaRequest {
    pub nome: Option<String>,
    pub descricao: Option<String>,
    pub telefone: Option<String>,
    pub email: Option<String>,
    pub cep: Option<String>,
    pub logradouro: Option<String>,
    pub numero: Option<String>,
    pub bairro: Option<String>,
    pub cidade: Option<String>,
    pub estado: Option<String>,
    pub horario_abertura: Option<String>,
    pub horario_fechamento: Option<String>,
    pub ativa: Option<bool>,
}

// ============================================
// PRODUTO
// ============================================

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Produto {
    pub id: i32,
    pub loja_id: i32,
    pub nome: String,
    pub descricao: Option<String>,
    pub preco: sqlx::types::Decimal,
    pub quantidade: Option<i32>,
    pub aviso_reposicao: Option<i32>,
    pub disponivel: Option<bool>,
    pub categoria: Option<String>,
    pub imagem_url: String,
    pub total_vendas: Option<i32>,
    pub tempo_preparo: Option<i32>,
    pub data_cadastro: Option<DateTime<Utc>>,
    pub ultima_atualizacao: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProdutoRequest {
    pub nome: String,
    pub descricao: Option<String>,
    pub preco: f64,
    pub quantidade: Option<i32>,
    pub aviso_reposicao: Option<i32>,
    pub categoria: Option<String>,
    pub imagem_url: Option<String>,
    pub tempo_preparo: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProdutoRequest {
    pub nome: Option<String>,
    pub descricao: Option<String>,
    pub preco: Option<f64>,
    pub quantidade: Option<i32>,
    pub aviso_reposicao: Option<i32>,
    pub categoria: Option<String>,
    pub imagem_url: Option<String>,
    pub tempo_preparo: Option<i32>,
    pub disponivel: Option<bool>,
}

// ============================================
// RESPOSTA GENÉRICA
// ============================================

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}

impl<T> ApiResponse<T> {
    pub fn ok(message: String, data: T) -> Self {
        ApiResponse {
            success: true,
            message,
            data: Some(data),
        }
    }

    pub fn error(message: String) -> Self {
        ApiResponse {
            success: false,
            message,
            data: None,
        }
    }
}
