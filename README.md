# FullStack Users - Sistema de Login

Um projeto fullstack completo com frontend React e backend Django, focado em autenticação de usuários com tema dark elegante.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Jest** para testes unitários
- **Cypress** para testes e2e

### Backend
- **Django 5.2** com Python 3.11
- **Django REST Framework** para API
- **JWT** para autenticação
- **CORS** para comunicação frontend-backend
- **SQLite** como banco de dados (desenvolvimento)

## 📁 Estrutura do Projeto

```
fullstack-users/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Contextos React (Auth)
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── backend/                 # API Django
│   ├── core/               # Configurações do projeto
│   ├── users/              # App de usuários
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml      # Orquestração dos serviços
└── README.md
```

## 🛠️ Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)

### 1. Usando Docker (Recomendado)

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd fullstack-users

# Executar com Docker Compose
docker-compose up --build
```

O projeto estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

### 2. Desenvolvimento Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 🔐 Funcionalidades de Autenticação

### Cadastro de Usuário
- Nome de usuário único
- Email único
- Senha com hash seguro
- Validação de dados

### Login
- Autenticação por email/senha
- Token JWT para sessão
- Redirecionamento automático

### Dashboard
- Área protegida para usuários autenticados
- Informações do usuário
- Logout seguro

## 🎨 Tema Dark

O projeto utiliza um tema dark elegante com:
- Cores personalizadas em tons escuros
- Componentes estilizados com Tailwind CSS
- Transições suaves
- Interface moderna e responsiva

## 🧪 Testes

### Testes Unitários (Jest)
```bash
cd frontend
npm test
```

### Testes E2E (Cypress)
```bash
cd frontend
npm run cypress:open
```

## 📊 Usuário de Teste

Para testar a aplicação, use as credenciais:
- **Email**: admin@example.com
- **Senha**: admin123

## 🔧 Configurações

### Variáveis de Ambiente
- `DEBUG`: Modo debug do Django
- `NODE_ENV`: Ambiente do Node.js
- `DJANGO_SETTINGS_MODULE`: Módulo de configurações Django

### Portas
- Frontend: 3000
- Backend: 8000

## 🚀 Deploy

### Produção
1. Alterar `DEBUG = False` em `backend/core/settings.py`
2. Configurar banco de dados PostgreSQL
3. Configurar variáveis de ambiente
4. Usar `docker-compose.prod.yml` para produção

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório.
