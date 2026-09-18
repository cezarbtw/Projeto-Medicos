# 📋 Backlog de Issues - Voll Med / MediClin

Este documento contém o detalhamento de todas as issues propostas para a evolução do projeto, prontas para serem abertas no GitHub ou organizadas em um GitHub Project / Kanban.

---

## 📌 Issue #1: [Frontend] Estruturar projeto React com Vite e implementar autenticação JWT

- **Tipo:** `enhancement`, `frontend`, `security`
- **Prioridade:** Alta

### Descrição
Atualmente, o arquivo `MedicoApp.jsx` está solto na raiz do repositório Maven e opera apenas com dados mockados. As rotas da API Spring Boot são protegidas e exigem um cabeçalho `Authorization: Bearer <token>`, o que causa falhas silenciosas de requisição no frontend atual.

### Tarefas
- [ ] Inicializar uma aplicação React usando Vite na pasta `frontend/` (`npm create vite@latest frontend -- --template react`).
- [ ] Configurar Axios ou Fetch Wrapper com interceptor para injetar o header `Authorization: Bearer ${token}` automaticamente.
- [ ] Criar uma tela/modal de Login consumindo o endpoint `POST /login`.
- [ ] Implementar contexto de autenticação (`AuthContext`) para gerenciar o estado da sessão e persistir o token no `localStorage`.
- [ ] Adicionar botão de Logout e exibição do usuário autenticado no topo da aplicação.

### Critérios de Aceite
- Ao abrir o app deslogado, o usuário é direcionado para a tela de autenticação.
- Após o login com credenciais válidas, o token JWT retornado pela API é salvo e enviado em todas as chamadas subsequentes.
- Em caso de token expirado ou erro 403, o app redireciona para a tela de login.

---

## 📌 Issue #2: [Backend] Configurar CORS e modernizar SecurityConfigurations para Spring Security 6

- **Tipo:** `enhancement`, `backend`, `security`
- **Prioridade:** Alta

### Descrição
Em `SecurityConfigurations.java`, a configuração de segurança utiliza métodos encadeados (`.and()`, `.sessionManagement()`) que foram depreciados no Spring Security 6 / Spring Boot 3. Além disso, não há configuração de CORS (`CorsConfigurationSource`), fazendo com que qualquer requisição vinda de navegadores em origens locais (ex: `http://localhost:5173`) seja rejeitada.

### Tarefas
- [ ] Refatorar a classe `SecurityConfigurations` adotando a sintaxe moderna de Lambdas do Spring Security 6 (`AbstractHttpConfigurer::disable`, `sm -> sm.sessionCreationPolicy(...)`).
- [ ] Criar um `@Bean` de `CorsConfigurationSource` liberando requisições de origens permitidas (`http://localhost:5173`, `http://localhost:3000`), com métodos `GET, POST, PUT, DELETE, OPTIONS` e cabeçalhos adequados.
- [ ] Habilitar `.cors(Customizer.withDefaults())` no `SecurityFilterChain`.
- [ ] Atualizar o artefato do conector MySQL no `pom.xml` de `mysql:mysql-connector-java` para `com.mysql:mysql-connector-j`.

### Critérios de Aceite
- A aplicação frontend consegue realizar requisições para `http://localhost:8080` sem receber erros de CORS no console do navegador.
- O código do Spring Security não exibe warnings de depreciação.

---

## 📌 Issue #3: [Backend] Implementar endpoint GET /consultas com filtros e paginação

- **Tipo:** `enhamento`, `backend`
- **Prioridade:** Alta

### Descrição
O `ConsultaController` atual possui apenas os métodos de agendamento (`POST`) e cancelamento (`DELETE`). O frontend tenta consumir `GET /consultas` para popular a lista de agendamentos e estatísticas do dashboard, resultando em erro `405 Method Not Allowed`.

### Tarefas
- [ ] Criar o DTO `DadosListagemConsulta` contendo: id, idMedico, nomeMedico, especialidade, idPaciente, nomePaciente, data, motivoCancelamento (se houver).
- [ ] Implementar o método `@GetMapping` em `ConsultaController` recebendo `@PageableDefault` e parâmetros de filtro opcionais (ex: data inicial, status, idMedico).
- [ ] Adicionar método de busca paginada no `ConsultaRepository` (ex: consultas futuras, ativas ou por intervalo de datas).
- [ ] Implementar endpoint de detalhamento `@GetMapping("/{id}")` retornando `DadosDetalhamentoConsulta`.

### Critérios de Aceite
- Requisições autenticadas para `GET /consultas` retornam status `200 OK` com a lista paginada de consultas.
- O dashboard e a tabela de consultas conseguem renderizar dados reais vindos do banco de dados.

---

## 📌 Issue #4: [Frontend & Backend] Harmonizar DTOs e formulários (Endereço, Agendamento e Edição)

- **Tipo:** `bug`, `backend`, `frontend`
- **Prioridade:** Média-Alta

### Descrição
Existem divergências entre os dados que o frontend envia e os dados que a API Spring Boot valida:
1. **Endereço**: `DadosCadastroMedico` e `DadosCadastroPaciente` exigem `@NotNull @Valid DadosEndereco endereco`. O formulário do frontend não envia esses dados, causando erro 400 Bad Request.
2. **Campos da Consulta**: A API espera `{ idMedico, idPaciente, data, especialidade }` com `data` no futuro (`@Future`). O frontend enviava `{ medicoId, dataHora, observacoes }`.
3. **Paginação**: A API devolve um objeto `Page<T>` (`{ content: [...] }`), mas o frontend esperava um Array plano.
4. **Edição**: `PUT /medicos` e `PUT /pacientes` recebem o ID no corpo JSON e não na URL (`/medicos/{id}`).

### Tarefas
- [ ] Adicionar campos de endereço (logradouro, bairro, cep, cidade, uf, numero, complemento) nos modais de cadastro de médico e paciente no frontend, ou tornar o endereço opcional na API caso não seja requisito obrigatório de negócio.
- [ ] Ajustar o payload de agendamento no frontend para enviar exatamente o formato esperado por `DadosAgendamentoConsulta`.
- [ ] Tratar a resposta paginada do Spring Data no frontend (`res.data.content || res.data`).
- [ ] Ajustar as chamadas de atualização `PUT` no frontend para enviar a rota e corpo compatíveis com os Controllers.

### Critérios de Aceite
- Novos médicos e pacientes são salvos no banco com sucesso e validados pelo Bean Validation.
- Consultas são agendadas e listadas com sucesso através da interface web.

---

## 📌 Issue #5: [Backend] Implementar camada de Service para Médicos e Pacientes

- **Tipo:** `refactor`, `backend`
- **Prioridade:** Média

### Descrição
Atualmente, `MedicoController` e `PacienteController` interagem diretamente com os repositórios JPA e contêm lógica de manipulação de entidades nos métodos de controller. Para manter a coerência arquitetural do projeto (que já utiliza `AgendaDeConsultas` para gerenciar regras de consulta), deve-se introduzir classes de serviço dedicadas.

### Tarefas
- [ ] Criar `MedicoService` para encapsular cadastro, listagem, atualização, inativação e regras de negócio de médicos.
- [ ] Criar `PacienteService` para encapsular cadastro, listagem, atualização e inativação de pacientes.
- [ ] Injetar as classes de Service nos respectivos Controllers, mantendo os Controllers enxutos e focados apenas no transporte HTTP.
- [ ] Garantir que o tratamento de exceções de negócio continue sendo capturado pelo `TratadorDeErros`.

### Critérios de Aceite
- Nenhum repositório de médico ou paciente deve ser injetado diretamente em controllers.
- Todos os testes existentes continuam passando com sucesso.

---

## 📌 Issue #6: [DevOps] Criar Dockerfile multi-stage e docker-compose.yml para API e MySQL

- **Tipo:** `devops`, `enhancement`
- **Prioridade:** Média

### Descrição
Configurar o ambiente local atualmente exige que o desenvolvedor tenha MySQL instalado e configurado manualmente com usuário/senha compatíveis. O uso de Docker padroniza o ambiente de desenvolvimento e facilita o onboarding e testes.

### Tarefas
- [ ] Criar um `Dockerfile` multi-stage para a API Spring Boot (estágio de build com Maven e estágio final leve com `eclipse-temurin:17-jre-alpine`).
- [ ] Criar um `docker-compose.yml` contendo:
  - Serviço do MySQL 8 com healthcheck, volume persistente e criação da base `vollmed_api`.
  - Serviço da API dependente do banco de dados, configurando variáveis de ambiente (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`).
- [ ] Adicionar instruções no `README.md` sobre como rodar `docker compose up -d`.

### Critérios de Aceite
- Ao clonar o repositório e executar `docker compose up --build`, a aplicação e o banco iniciam corretamente e as migrations do Flyway rodam sem falhas.

---

## 📌 Issue #7: [CI/CD] Configurar GitHub Actions para validação e build contínuo

- **Tipo:** `ci/cd`, `devops`
- **Prioridade:** Média

### Descrição
Automatizar a verificação do código a cada `push` e `pull request`, garantindo que novas alterações não quebrem o build e que todos os testes passem antes do merge.

### Tarefas
- [ ] Criar o arquivo `.github/workflows/ci.yml`.
- [ ] Configurar job para configurar Java 17 (Temurin) e cache de dependências Maven.
- [ ] Executar serviço de MySQL no workflow ou rodar os testes unitários/mockados via `mvn clean verify`.
- [ ] Adicionar badge de status de build no `README.md`.

### Critérios de Aceite
- Pull requests e commits na branch principal disparam o workflow e reportam status verde/vermelho no GitHub.

---

## 📌 Issue #8: [Testes] Ampliar cobertura de testes unitários para regras de negócio e controllers

- **Tipo:** `test`, `quality`
- **Prioridade:** Média

### Descrição
O projeto possui testes para `ConsultaController`, `MedicoController` e `MedicoRepository`, mas as regras críticas de agendamento/cancelamento (validadores) e o `PacienteController` ainda não possuem cobertura automatizada.

### Tarefas
- [ ] Criar testes unitários para os validadores de agendamento:
  - `ValidadorHorarioFuncionamentoClinicaTest`
  - `ValidadorHorarioAntecedenciaTest`
  - `ValidadorPacienteAtivoTest`
  - `ValidadorMedicoAtivoTest`
  - `ValidadorPacienteSemOutraConsultaNoDiaTest`
  - `ValidadorMedicoComOutraConsultaNoMesmoHorarioTest`
- [ ] Criar testes para os validadores de cancelamento de consulta.
- [ ] Criar `PacienteControllerTest` cobrindo cenários de sucesso e validação (HTTP 200, 400).
- [ ] Criar testes unitários para `TokenService` (geração e validação de token JWT).

### Critérios de Aceite
- Todos os cenários de erro e sucesso das regras de negócio são validados por testes unitários sem necessidade de subir o banco MySQL.

