# 🩺 Voll Med API / MediClin

[![CI](https://github.com/cezarbtw/Projeto-Medicos/actions/workflows/ci.yml/badge.svg)](https://github.com/cezarbtw/Projeto-Medicos/actions/workflows/ci.yml)

API REST desenvolvida com Java e Spring Boot para gerenciamento de médicos, pacientes e consultas médicas.

O projeto implementa autenticação e autorização com JWT, validações de negócio, persistência de dados com JPA/Hibernate e documentação automática da API utilizando Swagger/OpenAPI.

---

##  Tecnologias Utilizadas

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (JSON Web Token)
- Flyway
- MySQL
- Lombok
- Maven
- Swagger / OpenAPI

---

##  Funcionalidades

### Médicos
- Cadastro de médicos
- Listagem paginada
- Atualização de dados
- Exclusão lógica (inativação)
- Controle por especialidade

### Pacientes
- Cadastro de pacientes
- Listagem paginada
- Atualização de dados
- Exclusão lógica (inativação)

### Consultas
- Agendamento de consultas
- Cancelamento de consultas
- Regras de validação para agendamento
- Controle de horários disponíveis

### Segurança
- Login de usuários
- Geração de Token JWT
- Rotas protegidas
- Controle de autenticação via Spring Security

---

##  Arquitetura

O projeto segue uma arquitetura em camadas:

```text
Controller
   ↓
Service / Regras de Negócio
   ↓
Repository
   ↓
Banco de Dados
```

Estrutura principal:

```text
src/main/java

├── controller
├── domain
│   ├── medico
│   ├── paciente
│   ├── consulta
│   ├── usuario
│   └── endereco
├── infra
│   ├── security
│   ├── exception
│   └── springdoc
```

---

##  Autenticação

A API utiliza autenticação baseada em JWT.

Fluxo:

1. Usuário realiza login
2. API gera um token JWT
3. Token é enviado no Header das requisições

Exemplo:

```http
Authorization: Bearer SEU_TOKEN
```

---

##  Documentação

Após iniciar a aplicação, a documentação Swagger pode ser acessada em:

```text
http://localhost:8080/swagger-ui.html
```

ou

```text
http://localhost:8080/swagger-ui/index.html
```

---

## ⚙️ Como Executar

### 🐳 Opção 1: Com Docker Compose (Recomendado)

Com o Docker instalado, você pode subir tanto o banco de dados MySQL quanto a API Spring Boot com um único comando:

```bash
docker compose up -d --build
```

O compose configura automaticamente:
- Container **MySQL 8** com *healthcheck* e volume persistente.
- Container da **API Spring Boot** com build multi-stage, conectando-se ao banco e rodando as migrações do Flyway.

Para acompanhar os logs da API:
```bash
docker compose logs -f api
```

Para encerrar os serviços:
```bash
docker compose down
```

---

### 💻 Opção 2: Execução Local Tradicional

#### Clonar o projeto

```bash
git clone https://github.com/cezarbtw/Projeto-Medicos.git
cd Projeto-Medicos
```

#### Configurar o banco de dados MySQL local

Editar o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost/vollmed_api
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

#### Executar a aplicação

```bash
./mvnw spring-boot:run
```

ou executar a classe principal `ApiApplication.java` pela sua IDE.

---

##  Principais Conceitos Aplicados

- API REST
- CRUD completo
- DTOs
- Validação de dados
- Paginação
- Tratamento global de exceções
- Autenticação JWT
- Spring Security
- Migrações com Flyway
- Documentação OpenAPI
- Boas práticas de arquitetura

---

##  Screenshots

### Swagger

Adicione aqui uma captura da documentação da API.

### Banco de Dados

Adicione aqui uma captura das tabelas e relacionamentos.

---

##  Melhorias Futuras

- Frontend em React
- Dashboard administrativo
- Dockerização da aplicação
- Deploy em nuvem
- Testes unitários e integração
- Recuperação de senha
- Controle de perfis de usuário

---

##  Autor

ABRAAO CEZAR INACIO LEOPOLDINO

GitHub:
https://github.com/cezarbtw

LinkedIn:
https://www.linkedin.com/in/cezarinaciol/
