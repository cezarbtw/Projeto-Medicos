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
        title = "[Clínica & PEP] Prontuário Eletrônico do Paciente (PEP) e Histórico Clínico"
        label = "enhancement,backend,frontend,clinical"
        body = @"
### Descrição
Em sistemas de gestão hospitalar, o acompanhamento do paciente exige o registro das evoluções médicas realizadas durante as consultas. Atualmente, a consulta é apenas agendada ou cancelada, sem armazenamento de diagnósticos, anamnese ou conduta terapêutica.

### Passo a Passo Técnico
- [ ] Criar migration `V9__create-table-prontuarios.sql` com campos de atendimento e histórico clínico.
- [ ] Criar entidade `Prontuario` e repositório JPA com ordenação cronológica.
- [ ] Criar `ProntuarioService` e DTOs de cadastro e detalhamento.
- [ ] Criar `ProntuarioController` com endpoints protegidos por perfil (`MEDICO`/`ADMIN`).
- [ ] Implementar visualização da linha do tempo clínica e modal de registro de atendimento no frontend.
- [ ] Implementar testes unitários e de integração (`ProntuarioServiceTest`, `ProntuarioControllerTest`).

### Critérios de Aceite
- Médicos conseguem registrar evolução clínica vinculada a consultas e pacientes.
- O histórico completo do paciente é consultável em ordem cronológica reversa.
"@
    },
    @{
        title = "[Documentos & PDF] Geração e Emissão de Receitas e Atestados Médicos em PDF"
        label = "enhancement,frontend,clinical"
        body = @"
### Descrição
Disponibilizar a emissão e o download instantâneo de documentos médicos oficiais em formato PDF (Receituário Médico e Atestado de Comparecimento), formatados em papel timbrado com identidade visual da clínica MediClin.

### Passo a Passo Técnico
- [ ] Definir modelos formais de Receituário e Atestado Médico com cabeçalho institucional.
- [ ] Criar modal `DocumentoModal.jsx` para preenchimento de posologia, repouso e orientações.
- [ ] Criar folha de estilo para impressão e download de PDF de alta fidelidade visual.
- [ ] Adicionar botão de ação rápida na tabela de consultas e na tela de prontuário.
- [ ] Validar renderização em formato A4 em navegadores e dispositivos móveis.

### Critérios de Aceite
- O médico emite receita ou atestado em menos de 3 cliques a partir de uma consulta.
- Documento formatado em folha timbrada pronto para impressão ou envio ao paciente.
"@
    },
    @{
        title = "[Frontend & UX] Visão de Agenda em Calendário Interativo Semanal/Mensal"
        label = "enhancement,frontend,ux"
        body = @"
### Descrição
A visualização atual de consultas em formato de tabela é eficiente para buscas, mas não oferece a percepção visual de horários vagos e ocupados. Esta issue implementa uma visão alternativa em Calendário Interativo.

### Passo a Passo Técnico
- [ ] Adicionar alternador de visualização (Tabela vs Calendário) na tela de consultas.
- [ ] Criar componente `CalendarView.jsx` com navegação semanal e mensal.
- [ ] Mapear as consultas da API nas células de data com badges coloridos por especialidade.
- [ ] Permitir agendamento direto ao clicar em um horário vago.
- [ ] Permitir visualização e cancelamento rápido ao clicar em uma consulta agendada.
- [ ] Adicionar filtro por médico no calendário.

### Critérios de Aceite
- Alternância fluida entre visualização de lista e calendário.
- Consultas reais da API renderizadas nos dias e horários corretos.
"@
    },
    @{
        title = "[Comunicação] Disparo Automático de E-mails de Confirmação e Cancelamento"
        label = "enhancement,backend,notification"
        body = @"
### Descrição
Notificar pacientes e médicos por e-mail automaticamente sempre que uma consulta for agendada ou cancelada, garantindo redução na taxa de absenteísmo (no-show) e maior confiabilidade no sistema.

### Passo a Passo Técnico
- [ ] Adicionar `spring-boot-starter-mail` e configurar propriedades de SMTP.
- [ ] Criar `EmailService` com templates HTML responsivos para confirmação e cancelamento.
- [ ] Configurar execução assíncrona (`@Async`) para não onerar o tempo de resposta da API.
- [ ] Adicionar serviço do Mailpit no `docker-compose.yml` para testes locais de e-mail.
- [ ] Criar testes unitários com mock de `JavaMailSender`.

### Critérios de Aceite
- Disparo assíncrono de e-mails em agendamentos e cancelamentos.
- Ambiente de desenvolvimento local com Mailpit na porta 8025.
"@
    },
    @{
        title = "[Analytics] Métricas Avançadas, Gráficos no Dashboard e Exportação CSV"
        label = "enhancement,fullstack,analytics"
        body = @"
### Descrição
Expandir o painel administrativo da clínica com métricas analíticas detalhadas, gráficos visuais de desempenho operacional e funcionalidade de exportação de dados em CSV.

### Passo a Passo Técnico
- [ ] Criar endpoint `GET /dashboard/metricas` com distribuição por especialidade e motivos de cancelamento.
- [ ] Implementar gráficos visuais de barras e status no `DashboardPage.jsx`.
- [ ] Criar utilitário `csvExport.js` e botões de exportação nas telas de Médicos, Pacientes e Consultas.
- [ ] Adicionar seletor de período no Dashboard (7 dias, 30 dias, anual).
- [ ] Criar testes para o endpoint de métricas e download de relatórios.

### Critérios de Aceite
- Dashboard com gráficos interativos em tempo real.
- Download de arquivos CSV com suporte a UTF-8.
"@
    },
    @{
        title = "[Compliance & DB] Auditoria de Operações e Rastreabilidade de Modificações (LGPD)"
        label = "security,backend,compliance"
        body = @"
### Descrição
Para atender aos padrões de conformidade da LGPD e normas do Conselho Federal de Medicina (CFM), todas as entidades de dados sensíveis devem manter histórico de quem criou, quem modificou e os carimbos de data/hora de cada alteração.

### Passo a Passo Técnico
- [ ] Criar migration `V10__add-audit-columns.sql` adicionando colunas de auditoria nas tabelas principais.
- [ ] Criar classe `@MappedSuperclass EntidadeAuditavel` com anotações de auditoria do Spring Data JPA.
- [ ] Implementar `AuditorAware` para capturar o usuário logado automaticamente.
- [ ] Exibir dados de auditoria discretos no frontend para administradores.
- [ ] Testar preenchimento automático das informações de auditoria na gravação de registros.

### Critérios de Aceite
- Toda alteração em entidades armazena automaticamente o usuário e data/hora da operação.
"@
    }
)

foreach ($issue in $issues) {
    Write-Host "Criando issue: $($issue.title)..." -ForegroundColor Green
    gh issue create --repo $repo --title $issue.title --body $issue.body --label $issue.label
}

Write-Host "`nTodas as novas issues foram processadas com sucesso!" -ForegroundColor Cyan
