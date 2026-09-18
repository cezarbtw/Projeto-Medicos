# Script para criação automática das issues no GitHub utilizando o GitHub CLI (gh)
# Pré-requisito: gh auth login

$repo = "cezarbtw/Projeto-Medicos"

Write-Host "Verificando autenticação com GitHub CLI..." -ForegroundColor Cyan
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Você precisa fazer login no GitHub CLI primeiro. Execute: gh auth login" -ForegroundColor Yellow
    exit
}

$issues = @(
    @{
        title = "[Frontend] Estruturar projeto React com Vite e implementar autenticação JWT"
        label = "enhancement,frontend,security"
        body = @"
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
"@
    },
    @{
        title = "[Backend] Configurar CORS e modernizar SecurityConfigurations para Spring Security 6"
        label = "enhancement,backend,security"
        body = @"
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
"@
    },
    @{
        title = "[Backend] Implementar endpoint GET /consultas com filtros e paginação"
        label = "enhancement,backend"
        body = @"
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
"@
    },
    @{
        title = "[Frontend & Backend] Harmonizar DTOs e formulários (Endereço, Agendamento e Edição)"
        label = "bug,backend,frontend"
        body = @"
### Descrição
Existem divergências entre os dados que o frontend envia e os dados que a API Spring Boot valida:
1. **Endereço**: `DadosCadastroMedico` e `DadosCadastroPaciente` exigem `@NotNull @Valid DadosEndereco endereco`. O formulário do frontend não envia esses dados, causando erro 400 Bad Request.
2. **Campos da Consulta**: A API espera `{ idMedico, idPaciente, data, especialidade }` com `data` no futuro (`@Future`). O frontend enviava `{ medicoId, dataHora, observacoes }`.
3. **Paginação**: A API devolve um objeto `Page<T>` (`{ content: [...] }`), mas o frontend esperava um Array plano.
4. **Edição**: `PUT /medicos` e `PUT /pacientes` recebem o ID no corpo JSON e não na URL (`/medicos/{id}`).

### Tarefas
- [ ] Adicionar campos de endereço nos modais de cadastro no frontend ou ajustar a obrigatoriedade na API.
- [ ] Ajustar o payload de agendamento no frontend para enviar exatamente o formato esperado por `DadosAgendamentoConsulta`.
- [ ] Tratar a resposta paginada do Spring Data no frontend (`res.data.content || res.data`).
- [ ] Ajustar as chamadas de atualização `PUT` no frontend para enviar a rota e corpo compatíveis com os Controllers.
"@
    },
    @{
        title = "[Backend] Implementar camada de Service para Médicos e Pacientes"
        label = "refactor,backend"
        body = @"
### Descrição
Atualmente, `MedicoController` e `PacienteController` interagem diretamente com os repositórios JPA e contêm lógica de manipulação de entidades nos métodos de controller. Para manter a coerência arquitetural do projeto (que já utiliza `AgendaDeConsultas`), deve-se introduzir classes de serviço dedicadas.

### Tarefas
- [ ] Criar `MedicoService` para encapsular cadastro, listagem, atualização, inativação e regras de negócio de médicos.
- [ ] Criar `PacienteService` para encapsular cadastro, listagem, atualização e inativação de pacientes.
- [ ] Injetar as classes de Service nos respectivos Controllers.
- [ ] Garantir que o tratamento de exceções de negócio continue sendo capturado pelo `TratadorDeErros`.
"@
    },
    @{
        title = "[DevOps] Criar Dockerfile multi-stage e docker-compose.yml para API e MySQL"
        label = "devops,enhancement"
        body = @"
### Descrição
Configurar o ambiente local atualmente exige que o desenvolvedor tenha MySQL instalado e configurado manualmente com usuário/senha compatíveis. O uso de Docker padroniza o ambiente de desenvolvimento e facilita o onboarding e testes.

### Tarefas
- [ ] Criar um `Dockerfile` multi-stage para a API Spring Boot (build com Maven e runtime leve com `eclipse-temurin:17-jre-alpine`).
- [ ] Criar um `docker-compose.yml` contendo serviços para MySQL 8 e para a API com variáveis de ambiente configuradas.
- [ ] Adicionar instruções no `README.md` sobre como rodar `docker compose up -d`.
"@
    },
    @{
        title = "[CI/CD] Configurar GitHub Actions para validação e build contínuo"
        label = "ci/cd,devops"
        body = @"
### Descrição
Automatizar a verificação do código a cada `push` e `pull request`, garantindo que novas alterações não quebrem o build e que todos os testes passem antes do merge.

### Tarefas
- [ ] Criar o arquivo `.github/workflows/ci.yml`.
- [ ] Configurar job para Java 17 (Temurin) e cache de dependências Maven.
- [ ] Executar testes automatizados via `mvn clean verify`.
- [ ] Adicionar badge de status de build no `README.md`.
"@
    },
    @{
        title = "[Testes] Ampliar cobertura de testes unitários para regras de negócio e controllers"
        label = "test,quality"
        body = @"
### Descrição
O projeto possui testes para `ConsultaController`, `MedicoController` e `MedicoRepository`, mas as regras críticas de agendamento/cancelamento (validadores) e o `PacienteController` ainda não possuem cobertura automatizada.

### Tarefas
- [ ] Criar testes unitários para os validadores de agendamento (`ValidadorHorarioFuncionamentoClinicaTest`, `ValidadorHorarioAntecedenciaTest`, etc.).
- [ ] Criar testes para os validadores de cancelamento de consulta.
- [ ] Criar `PacienteControllerTest` cobrindo cenários de sucesso e validação (HTTP 200, 400).
- [ ] Criar testes unitários para `TokenService`.
"@
    }
)

foreach ($issue in $issues) {
    Write-Host "Criando issue: $($issue.title)..." -ForegroundColor Green
    gh issue create --repo $repo --title $issue.title --body $issue.body --label $issue.label
}

Write-Host "`nTodas as issues foram processadas com sucesso!" -ForegroundColor Cyan

