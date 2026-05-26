# Elite Delivery - HTML/CSS/JavaScript

Sistema de delivery com interface para clientes e empresas, desenvolvido em HTML/CSS/JavaScript puro.

## 📁 Arquivos

```
feedoo-delivery-html/
├── index.html                 # Home page (opcional)
├── login-cliente.html         # Login para clientes
├── login-cliente.js           # Lógica do login cliente
├── login-empresa.html         # Login para empresas (PF/PJ)
├── login-empresa.js           # Lógica do login empresa
├── dashboard-empresa.html     # Dashboard de gestão de lojas
├── dashboard-empresa.js       # Lógica do dashboard
├── gerenciar-loja.html        # Gestão de produtos da loja
├── gerenciar-loja.js          # Lógica da gestão de loja
├── style.css                  # Estilos globais
└── README.md                  # Este arquivo
```

## 🚀 Como Usar

### 1. Abrir no Navegador

Simplesmente abra qualquer arquivo `.html` no seu navegador:

```bash
# Linux/Mac
open login-cliente.html

# Windows
start login-cliente.html
```

### 2. Usar um Servidor Local (Recomendado)

Para evitar problemas de CORS, use um servidor local:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000/login-cliente.html`

## 📄 Páginas

### Login Cliente (`login-cliente.html`)
- Autenticação de clientes
- Campos: Email, Senha
- Redireciona para home após login

### Login Empresa (`login-empresa.html`)
- Autenticação de empresas
- Abas para Pessoa Física (PF) e Pessoa Jurídica (PJ)
- Campos: Email, Senha
- Redireciona para dashboard após login

### Dashboard Empresa (`dashboard-empresa.html`)
- Listagem de lojas em cards
- CRUD completo de lojas:
  - ✅ Criar nova loja
  - ✅ Editar loja existente
  - ✅ Deletar loja
  - ✅ Visualizar informações
- Botão para gerenciar produtos de cada loja

### Gerenciar Loja (`gerenciar-loja.html`)
- 3 abas principais:
  1. **Produtos** - CRUD de produtos
  2. **Horários** - Configurar horário de funcionamento
  3. **Estoque Baixo** - Alertas de produtos com estoque baixo
- Campos de produto:
  - Nome, Descrição, Categoria
  - Preço, Quantidade, Aviso de Reposição
  - Tempo de Preparo, URL da Imagem

## 🎨 Design

**Estilo:** Modern Minimalist
- **Tipografia:** Poppins (títulos) + Inter (corpo)
- **Cores Principais:**
  - Vermelho: `#ea1d2c` (CTAs e destaque)
  - Azul: `#0066cc` (Informações)
  - Neutros: Cinzas claros e escuros
- **Componentes:**
  - Cards elevados com sombras suaves
  - Botões com transições suaves
  - Modais com animações
  - Responsivo (mobile-first)

## 🔧 Integração com Backend

Todos os dados atualmente são simulados em JavaScript. Para integrar com seu backend MySQLx de Rust:

### 1. Substituir Dados Simulados

**Antes (dados locais):**
```javascript
let lojas = [
  { id: 1, nome: 'Feedoo Centro', ... }
];
```

**Depois (chamada à API):**
```javascript
async function loadLojas() {
  const response = await fetch('http://seu-backend/api/lojas');
  lojas = await response.json();
  renderLojas();
}
```

### 2. Integrar Endpoints

Substitua as funções de CRUD:

```javascript
// Criar loja
async function handleSaveLoja(event) {
  event.preventDefault();
  
  const response = await fetch('http://seu-backend/api/lojas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lojaData)
  });
  
  if (response.ok) {
    alert('Loja criada com sucesso!');
    loadLojas();
  }
}
```

### 3. Adicionar Autenticação

```javascript
// Login
async function handleLogin(event) {
  event.preventDefault();
  
  const response = await fetch('http://seu-backend/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
    window.location.href = 'dashboard-empresa.html';
  }
}
```

## 📱 Responsividade

Todos os componentes são responsivos e funcionam em:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (até 767px)

## 🔐 Segurança

**Importante:** Este é um protótipo frontend. Para produção:

1. **Nunca** armazene senhas em localStorage
2. Use JWT tokens com expiração
3. Implemente HTTPS
4. Valide dados no backend
5. Implemente CORS corretamente
6. Use variáveis de ambiente para URLs da API

## 📝 Estrutura de Dados

### Lojas (perfil_empresa)
```javascript
{
  id: 1,
  nome: "Feedoo Centro",
  descricao: "Descrição",
  telefone: "(11) 99999-0000",
  email: "loja@email.com",
  cep: "01310100",
  logradouro: "Avenida Paulista",
  numero: "1000",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
  horario_abertura: "10:00",
  horario_fechamento: "23:00",
  ativa: true
}
```

### Produtos (produtos)
```javascript
{
  id: 1,
  nome: "X-Burger",
  descricao: "Hambúrguer com queijo",
  preco: 18.00,
  quantidade: 50,
  aviso_reposicao: 10,
  categoria: "Lanches",
  imagem_url: "https://...",
  tempo_preparo: 15,
  disponivel: true
}
```

## 🐛 Troubleshooting

### Problema: Modais não abrem
**Solução:** Verifique se o ID do modal corresponde ao chamado em `openModal()`

### Problema: Dados não persistem após recarregar
**Solução:** Use `localStorage` ou integre com backend

### Problema: Estilos não carregam
**Solução:** Certifique-se de que `style.css` está no mesmo diretório

## 📞 Suporte

Para integrar com seu backend MySQLx de Rust, consulte a documentação da sua API e adapte as funções de fetch nos arquivos `.js`.

---

**Desenvolvido com ❤️ para Elite Delivery**
