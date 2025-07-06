# backend_growtwitter

# GrowTwitter - API REST

Esta é a API REST que desenvolvi inspirada no Twitter, utilizando Node.js, Express, Prisma ORM e PostgreSQL.  
Implementei funcionalidades como cadastro e login de usuários, criação de tweets e respostas, sistema de seguidores, curtidas (likes), feed personalizado e documentação com Swagger.

---

## 🚀 Tecnologias que utilizei

- **Node.js** com **Express**  
- **TypeScript**  
- **Prisma ORM**  
- **PostgreSQL**  
- **JWT** para autenticação  
- **BCrypt** para hashing de senhas  
- **Swagger Autogen** para documentação da API  
- **Jest** para testes automatizados  
- **dotenv** para variáveis de ambiente  

---

## 📚 Funcionalidades que implementei

### 👤 Usuários

- Cadastro de usuários (`/sign-up`)  
- Login com retorno de token JWT (`/login`)  
- Listagem de usuários (`/user`)  
- Buscar usuário por ID (`/user/{id}`)  
- Atualizar dados do usuário (`PUT /user/{id}`)  
- Excluir usuário (`DELETE /user/{id}`)  

### 📝 Tweets

- Criar tweet (`POST /tweets`)  
- Listar todos os tweets (`GET /tweets`)  
- Listar tweets por ID de usuário (`GET /tweets/{id}`)  
- Criar resposta a tweet (`POST /tweets/{id}/reply`)  
- Atualizar tweet (`PUT /tweets/{id}`)  
- Deletar tweet (`DELETE /tweets/{id}`)  

### 🧵 Feed

- Feed personalizado com tweets dos usuários seguidos (`GET /feed`)  

### 🤝 Seguidores

- Seguir outros usuários  
- Listar seguidores  

### ❤️ Likes

- Curtir tweets  
- Atualizar curtidas  
- Listar curtidas  
- Deletar curtidas  

---

## 🧪 Testes Automatizados

- Cobertura de código superior a **88%** (`statements`, `branches`, `functions`, `lines`)  
- Testes **unitários** em todos os serviços da aplicação (`services`)  
- Uso de **mocks** para `prismaClient`, `bcrypt` e `jwt`  
- Validações com múltiplos `asserts` (`toBeDefined`, `toThrow`, `toEqual`, `not.toHaveProperty`, etc.)  
