# 🩺 Voll Med API

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

### Clonar o projeto

```bash
git clone https://github.com/cezarbtw/Projeto-Medicos.git
```

### Entrar na pasta

```bash
cd Projeto-Medicos
```

### Configurar o banco de dados

Editar o arquivo:

```properties
application.properties
```

Configurando:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
```

### Executar

```bash
mvn spring-boot:run
```

ou executar a classe:

```java
ApiApplication.java
```

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
(adicione seu LinkedIn aqui)
