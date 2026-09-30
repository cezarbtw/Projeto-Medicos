import { useState } from 'react';

const NOTICIAS = [
  {
    id: 1,
    tag: 'Campanha',
    tipoTag: 'badge-sky',
    titulo: 'Campanha de Prevenção Cardiovascular & Check-up Integrado 2026',
    data: 'Hoje às 09:30',
    autor: 'Diretoria Clínica',
    resumo:
      'Todas as unidades da rede MediClin iniciaram hoje o mutirão de exames preventivos, eletrocardiogramas e triagem de pressão arterial sem necessidade de agendamento prévio para pacientes conveniados.',
    tempoLeitura: '3 min',
  },
  {
    id: 2,
    tag: 'Tecnologia',
    tipoTag: 'badge-indigo',
    titulo: 'Modernização de Prontuários e Integração com Inteligência Artificial',
    data: 'Ontem às 16:45',
    autor: 'Coordenação de TI Hospitalar',
    resumo:
      'Concluímos a migração dos sistemas para prontuários eletrônicos ultrarrápidos e seguros. Médicos agora contam com transcrição assistida e alertas imediatos sobre interações medicamentosas.',
    tempoLeitura: '4 min',
  },
  {
    id: 3,
    tag: 'Operacional',
    tipoTag: 'badge-green',
    titulo: 'Novo Protocolo Manchester Reduz Tempo de Espera no Pronto-Atendimento em 38%',
    data: '28 de Setembro',
    autor: 'Comitê de Emergência',
    resumo:
      'A reformulação das salas de triagem e o aumento de plantonistas na Unidade Central garantiram tempo recorde de atendimento para casos de média e alta complexidade nesta última semana.',
    tempoLeitura: '2 min',
  },
  {
    id: 4,
    tag: 'Aviso',
    tipoTag: 'badge-amber',
    titulo: 'Inauguração da Nova Ala de Cuidados Intensivos na Unidade Jardins',
    data: '25 de Setembro',
    autor: 'Gestão de Infraestrutura',
    resumo:
      'Entram em operação 20 novos leitos de UTI humanizada equipados com monitoramento hemodinâmico contínuo e filtros de ar de padrão internacional HEPA.',
    tempoLeitura: '5 min',
  },
];

const UNIDADES = [
  {
    id: 'central',
    nome: 'Hospital Central MediClin - Unidade Jardins',
    endereco: 'Av. Paulista, 1800 - Bela Vista, São Paulo - SP',
    telefone: '(11) 3100-8000',
    emergencia: 'Pronto-Socorro 24h Adulto e Infantil',
    leitos: '190 leitos (35 UTI)',
    status: 'Operando normalmente',
    tempoEspera: '12 min',
    especialidades: ['Cardiologia', 'Neurologia', 'Cirurgia Geral', 'UTI'],
  },
  {
    id: 'campinas',
    nome: 'Hospital Regional Paulista - Campinas',
    endereco: 'Rua Barão de Itapura, 950 - Guanabara, Campinas - SP',
    telefone: '(19) 3750-4000',
    emergencia: 'Pronto-Atendimento Ortopédico e Cirúrgico',
    leitos: '130 leitos (25 UTI)',
    status: 'Fluxo estável',
    tempoEspera: '18 min',
    especialidades: ['Ortopedia', 'Traumatologia', 'Diagnóstico por Imagem'],
  },
  {
    id: 'abc',
    nome: 'Centro Médico Avançado - Unidade Santo André',
    endereco: 'Av. Portugal, 450 - Centro, Santo André - SP',
    telefone: '(11) 4990-2500',
    emergencia: 'Ambulatório Especializado & Telemedicina',
    leitos: '80 leitos dia',
    status: 'Atendimento rápido',
    tempoEspera: '6 min',
    especialidades: ['Ginecologia', 'Pediatria', 'Dermatologia', 'Exames'],
  },
];

export function LobbyPage({ onNavigate }) {
  const [filtroTag, setFiltroTag] = useState('TODOS');
  const [search, setSearch] = useState('');

  const noticiasFiltradas = NOTICIAS.filter((n) => {
    const matchFiltro = filtroTag === 'TODOS' || n.tag.toUpperCase() === filtroTag;
    const matchSearch =
      n.titulo.toLowerCase().includes(search.toLowerCase()) ||
      n.resumo.toLowerCase().includes(search.toLowerCase());
    return matchFiltro && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Banner do Lobby */}
      <div className="lobby-hero">
        <div className="lobby-hero-content">
          <div className="lobby-badge">
            <span className="live-dot" />
            Portal da Rede Hospitalar · Informações em Tempo Real
          </div>
          <h1>Central de Notícias & Unidades da Rede MediClin</h1>
          <p>
            Acompanhe comunicados oficiais, capacidade de atendimento das unidades e avisos operacionais de toda a nossa rede hospitalar integrada.
          </p>

          <div className="lobby-stats-row">
            <div className="lobby-metric">
              <strong>98.6%</strong>
              <span>Índice de Satisfação</span>
            </div>
            <div className="lobby-metric-divider" />
            <div className="lobby-metric">
              <strong>400+</strong>
              <span>Leitos Operacionais</span>
            </div>
            <div className="lobby-metric-divider" />
            <div className="lobby-metric">
              <strong>24h</strong>
              <span>Pronto-Atendimento Ativo</span>
            </div>
            <div className="lobby-metric-divider" />
            <div className="lobby-metric">
              <strong>12 min</strong>
              <span>Tempo Médio Triagem</span>
            </div>
          </div>
        </div>

        <div className="lobby-hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate('consultas')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Agendar Consulta
          </button>
          <button
            className="btn btn-outline"
            onClick={() => onNavigate && onNavigate('dashboard')}
          >
            Ver Painel Clínico
          </button>
        </div>
      </div>

      {/* Grid Principal: Mural de Notícias + Unidades Hospitalares */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        {/* Coluna da Esquerda: Mural de Notícias & Avisos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="card-title">Mural de Comunicados & Notícias</span>
                <span className="badge badge-indigo">{noticiasFiltradas.length} publicações</span>
              </div>

              {/* Filtro por Categoria */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['TODOS', 'CAMPANHA', 'TECNOLOGIA', 'OPERACIONAL', 'AVISO'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFiltroTag(tag)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      transition: 'all 0.15s ease',
                      background: filtroTag === tag ? 'var(--primary)' : '#ffffff',
                      color: filtroTag === tag ? '#ffffff' : 'var(--text-muted)',
                      borderColor: filtroTag === tag ? 'var(--primary)' : 'var(--border)',
                    }}
                  >
                    {tag === 'TODOS' ? 'Todas' : tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Notícias */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {noticiasFiltradas.map((n) => (
                <article key={n.id} className="news-item">
                  <div className="news-item-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge ${n.tipoTag}`}>{n.tag}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-light)' }}>· {n.data}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                      Tempo de leitura: {n.tempoLeitura}
                    </span>
                  </div>

                  <h3 className="news-item-title">{n.titulo}</h3>
                  <p className="news-item-summary">{n.resumo}</p>

                  <div className="news-item-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="author-avatar">{n.autor[0]}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{n.autor}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Comunicado Oficial da Rede
                    </span>
                  </div>
                </article>
              ))}

              {noticiasFiltradas.length === 0 && (
                <div className="empty-state">
                  <div className="icon">📢</div>
                  <p>Nenhuma notícia encontrada com os filtros selecionados.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Unidades Hospitalares e Status ao Vivo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Unidades da Rede Integrada</span>
              <span className="badge badge-green">3 Unidades Online</span>
            </div>

            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {UNIDADES.map((u) => (
                <div key={u.id} className="hospital-unit-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                      {u.nome}
                    </h4>
                    <span className="badge badge-green" style={{ fontSize: 10, flexShrink: 0 }}>
                      {u.status}
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    📍 {u.endereco}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10, fontSize: 12, color: '#334155' }}>
                    <span><strong>📞</strong> {u.telefone}</span>
                    <span><strong>🛏️</strong> {u.leitos}</span>
                    <span><strong>⏱️</strong> Espera: <strong>{u.tempoEspera}</strong></span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {u.especialidades.map((esp) => (
                      <span key={esp} style={{ background: '#f1f5f9', color: '#475569', fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plantão de Emergência & Links Rápidos */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff7f7 100%)', borderColor: '#fecaca', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  🚨
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#991b1b' }}>Central de Emergência & SAMU</h4>
                  <small style={{ color: '#b91c1c' }}>Acionamento rápido 24 horas</small>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: '#7f1d1d', lineHeight: 1.5, marginBottom: 16 }}>
                Linha direta com o centro de triagem avançado para encaminhamento prioritário de ambulâncias e leitos de choque.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href="tel:192"
                  className="btn btn-danger btn-sm"
                  style={{ textDecoration: 'none', fontWeight: 700, padding: '8px 14px' }}
                >
                  Ligar 192 (SAMU)
                </a>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ background: '#ffffff', borderColor: '#fca5a5', color: '#991b1b' }}
                  onClick={() => alert('Ramal Interno de Emergência: 1001 / Código Azul: 1002')}
                >
                  Ramais Internos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
