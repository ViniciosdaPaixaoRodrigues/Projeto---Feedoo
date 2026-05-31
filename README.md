# Elite Delivery - Projeto Acadêmico

> Um projeto de faculdade que demonstra competências avançadas em **Rust**, **Arquitetura de Sistemas**, **Integração com Bancos de Dados** e **Desenvolvimento Full-Stack**.

---

## Sobre o Projeto

**Elite Delivery** é uma plataforma de delivery desenvolvida como projeto acadêmico com foco em aplicar conceitos fundamentais e avançados de engenharia de software. O projeto integra um **backend robusto em Rust** com um **frontend responsivo em HTML/CSS/JavaScript**, demonstrando a capacidade de trabalhar em todas as camadas de uma aplicação web moderna.

### Objetivo Acadêmico

Criar um sistema web completo que permita:
- **Usuários (Clientes)**: Cadastro, autenticação e navegação por restaurantes
- **Empreendedores (Empresas)**: Gerenciamento dinâmico de múltiplas lojas com produtos, preços e informações customizáveis
- **Administração**: CRUD completo de lojas, produtos e horários de funcionamento

---

## Equipe de Desenvolvimento

| Nome | Função |
|------|--------|
| **Guilherme Melo Martins** | Design e Prototipação no Figma |
| **Júlia Beatriz Nascimento da Silva** | Foco em Design no Figma |
| **Jorge Lucas Cruz Barbosa de Oliveira** | Frontend / UI/UX |
| **Paulo Henrique de Sousa Alves Correia** | Banco de Dados / Testes / Documentação |
| **Vinicios da Paixão Rodrigues** | Integração MySQLx / Arquitetura Backend / Rust|

### Protótipo no Figma
🔗 [Clique aqui para visualizar](https://www.figma.com/design/ODJj9y1Wb8uMD1uF3hCZL4/Expo-tech?node-id=0-1&t=Aauw0AnnWJnUnCdC-1)

---

## Como Executar

### Pré-requisitos
- Rust 1.70+
- MySQL 8.0+
- Cargo

### Instalação

# 1. Clone o repositório
```bash
git clone https://github.com/ViniciosdaPaixaoRodrigues/Projeto-Elite-Delivery
```

# 2. Configure o banco de dados
Execute o script SQL em: Projeto-Elite-Delivery/MySQL/Script do MySQL.sql

# 3. Configure as variáveis de ambiente
Renomeie o arquivo .envExample para ".env" no seu computador.

Edite o arquivo .env com suas credenciais

# 4. Navegue para a pasta correta.
```bash
cd backend
```

# 5. Instale as dependências
```bash
cargo build
```
# 6. Execute o servidor
```bash
cargo run
```

O servidor estará disponível em: **http://localhost:3001**

---

## Habilidades Demonstradas

### 1. **Programação em Rust** 
- Pattern Matching
- Error Handling com Result/Option
- Async/Await com Tokio

### 2. **Arquitetura de Software** 
- Separação de responsabilidades (Handlers, Models, Configs)
- RESTful API Design
- Connection Pooling

### 3. **Integração com Banco de Dados** 
- SQLx com Type-Safety
- Queries parametrizadas (prevenção de SQL Injection)
- Relacionamentos entre tabelas

### 4. **Desenvolvimento Full-Stack** 
- Frontend responsivo e acessível
- Comunicação Cliente-Servidor via HTTP
- Autenticação e Sessões
- Validação de dados (frontend e backend)
- Tratamento de erros

### 5. **Trabalho em Equipe** 
- Divisão clara de responsabilidades
- Comunicação efetiva
- Versionamento com Git

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTML/CSS/JS - Interface Responsiva                  │   │
│  │  • Login (Cliente/Empresa)                           │   │
│  │  • Cadastro (Cliente/Empresa)                        │   │
│  │  • Dashboard de Lojas                                │   │
│  │  • Gerenciamento de Produtos                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  SERVIDOR (Rust + Actix)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Handlers (Rotas)                                    │   │
│  │  • /api/auth/* - Autenticação                        │   │
│  │  • /api/empresas/{id}/lojas/* - CRUD Lojas           │   │
│  │  • /api/lojas/{id}/produtos/* - CRUD Produtos        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Models (Estruturas de Dados)                        │   │
│  │  • Usuario, PerfilEmpresa, Loja, Produto             │   │
│  │  • Requests/Responses com Serde                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware                                          │   │
│  │  • CORS para requisições cross-origin                │   │
│  │  • Tratamento de erros                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS (MySQL)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tabelas:                                            │   │
│  │  • usuario (Clientes)                                │   │
│  │  • perfil_empresa (Empresas)                         │   │
│  │  • lojas (Lojas das Empresas)                        │   │
│  │  • produtos (Produtos das Lojas)                     │   │
│  │  • carrinho, carrinho_itens (Compras)                │   │
│  │  • metodos_pagamento (Formas de Pagamento)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Funcionalidades Implementadas

### Autenticação
- [x] Cadastro de Cliente (com validação)
- [x] Login de Cliente
- [x] Cadastro de Empresa (PF/PJ)
- [x] Login de Empresa
- [x] Sessões com LocalStorage

### Gerenciamento de Lojas
- [x] Criar loja
- [x] Listar lojas da empresa
- [x] Atualizar informações da loja
- [x] Deletar loja
- [x] Horários de funcionamento

### Gerenciamento de Produtos
- [x] Adicionar produtos à loja
- [x] Listar produtos
- [x] Atualizar preço e quantidade
- [x] Deletar produtos
- [x] Controle de estoque

### Interface do Usuário
- [x] Landing page responsiva
- [x] Formulários com validação
- [x] Dashboard intuitivo
- [x] Navegação fluida
- [x] Feedback visual (alerts, toasts)

---

## Conceitos Aplicados

### 1. **Type Safety em Rust**
```rust
// SQLx garante type-safety em compile-time
let usuario = sqlx::query_as::<_, Usuario>(
    "SELECT id, nome, email, senha FROM usuario WHERE email = ?"
)
.bind(&email)
.fetch_optional(pool)
.await?;
```

### 2. **Async/Await com Tokio**
```rust
// Múltiplas requisições simultâneas sem bloqueio
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
    // ...
}
```

### 4. **Error Handling Robusto**
```rust
match result {
    Ok(loja) => HttpResponse::Ok().json(ApiResponse::ok("Sucesso", loja)),
    Err(e) => HttpResponse::InternalServerError()
        .json(ApiResponse::<()>::error(format!("Erro: {}", e))),
}
```

---

## Segurança Implementada

- **SQL Injection Prevention**: Queries parametrizadas com SQLx
- **Input Validation**: Validação em frontend e backend
- **Error Handling**: Mensagens genéricas para usuários
- **Connection Pooling**: Limite de conexões simultâneas

### Melhorias Futuras de Segurança
- Hash de senhas com bcrypt
- Rate limiting
- HTTPS/TLS
- Autenticação OAuth2

---

## 📋 Endpoints da API

### Autenticação (5 endpoints)
```
POST   /api/auth/cadastro-cliente
POST   /api/auth/login-cliente
POST   /api/auth/cadastro-empresa
POST   /api/auth/login-empresa
GET    /health
```

### Lojas (5 endpoints)
```
GET    /api/empresas/{empresa_id}/lojas
POST   /api/empresas/{empresa_id}/lojas
GET    /api/empresas/{empresa_id}/lojas/{loja_id}
PUT    /api/empresas/{empresa_id}/lojas/{loja_id}
DELETE /api/empresas/{empresa_id}/lojas/{loja_id}
```

**Total: 10 endpoints RESTful**

---

## Testes e Validação

### Testes Manuais com cURL

```bash
# Cadastro de Cliente
curl -X POST http://localhost:3001/api/auth/cadastro-cliente \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-0000",
    "endereco": "Rua A, 123",
    "senha": "senha123"
  }'

# Login de Cliente
curl -X POST http://localhost:3001/api/auth/login-cliente \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# Listar Lojas
curl -X GET http://localhost:3001/api/empresas/1/lojas

# Criar Loja
curl -X POST http://localhost:3001/api/empresas/1/lojas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Elite Centro",
    "telefone": "(11) 3333-3333",
    "horario_abertura": "10:00",
    "horario_fechamento": "23:00"
  }'
```

---

## Aprendizados Principais

### Rust
- Programação assíncrona com Tokio
- Tratamento de erros
- Macros e type system

### Arquitetura
- Design de APIs RESTful
- Separação de responsabilidades

### Banco de Dados
- Modelagem relacional
- Queries
- Type-safe queries com SQLx
- Connection pooling

### Trabalho em Equipe
- Comunicação efetiva
- Divisão de tarefas
- Code review

---

## Melhorias Futuras

- [ ] Implementar autenticação JWT
- [X] Adicionar hash de senhas - Já realizado!
- [ ] Sistema de pedidos completo
- [ ] Notificações em tempo real (WebSockets)
- [ ] Dashboard com gráficos (Recharts)
- [ ] Testes unitários e integração
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em produção (Docker)
- [ ] Documentação com Swagger/OpenAPI
- [ ] Suporte a múltiplos idiomas

---

## Licença

Este projeto é desenvolvido como trabalho acadêmico. Todos os direitos reservados aos membros da equipe.

---

<div align="center">

### Projeto Acadêmico - Faculdade de Análise e Desenvolvimento de Sistemas

**Desenvolvido com dedicação, aprendizado e muito café ☕**

![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=visualstudiocode&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-1.70+-orange?style=flat-square&logo=rust)
![Actix-web](https://img.shields.io/badge/Actix--web-4.x-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?style=flat-square&logo=mysql)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/design/ODJj9y1Wb8uMD1uF3hCZL4/Expo-tech?node-id=0-1&t=Aauw0AnnWJnUnCdC-1)
[![Trello](https://img.shields.io/badge/Trello-0052CC?logo=trello&logoColor=fff)](#)

</div>
