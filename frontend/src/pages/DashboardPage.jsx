import { useState, useEffect } from 'react';
import { api, MOCK } from '../services/api';
import { StatIcon } from '../components/StatIcon';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    medicos: 0,
    pacientes: 0,
    consultas: 0,
    realizadas: 0,
    consultasHoje: [],
    consultasPorStatus: {},
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const [resMed, resPac, resCon] = await Promise.allSettled([
          api.get('/medicos'),
          api.get('/pacientes'),
          api.get('/consultas'),
        ]);

        const medList = resMed.status === 'fulfilled' ? api.extractData(resMed.value) : MOCK.medicos;
        const pacList = resPac.status === 'fulfilled' ? api.extractData(resPac.value) : MOCK.pacientes;
        const conList = resCon.status === 'fulfilled' ? api.extractData(resCon.value) : MOCK.consultas;

        const today = new Date().toDateString();
        const hoje = conList.filter((c) => {
          const dateStr = c.data || c.dataHora;
          return dateStr && new Date(dateStr).toDateString() === today;
        });

        const porStatus = conList.reduce((acc, c) => {
          const st = c.status || 'AGENDADA';
          acc[st] = (acc[st] || 0) + 1;
          return acc;
        }, {});

        if (isMounted) {
          setCounts({
            medicos: medList.length,
            pacientes: pacList.length,
            consultas: conList.length,
            realizadas: conList.filter((c) => c.status === 'REALIZADA').length,
            consultasHoje: hoje.slice(0, 5),
            consultasPorStatus: porStatus,
          });
        }
      } catch {
        if (isMounted) {
          setCounts({
            medicos: MOCK.medicos.length,
            pacientes: MOCK.pacientes.length,
            consultas: MOCK.consultas.length,
            realizadas: MOCK.consultas.filter((c) => c.status === 'REALIZADA').length,
            consultasHoje: MOCK.consultas.slice(0, 3),
            consultasPorStatus: { AGENDADA: 2, REALIZADA: 1, CANCELADA: 0 },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Carregando dados do painel...
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid">
        {[
          { type: 'medicos', label: 'Médicos', value: counts.medicos, color: 'var(--primary)' },
          { type: 'pacientes', label: 'Pacientes', value: counts.pacientes, color: '#1565c0' },
          { type: 'consultas', label: 'Consultas', value: counts.consultas, color: '#b35c00' },
          { type: 'realizadas', label: 'Realizadas', value: counts.realizadas, color: 'var(--success)' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ color: s.color }}>
              <StatIcon type={s.type} />
            </div>
            <div className="stat-value" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Consultas de Hoje</span>
          </div>
          <div style={{ padding: 16 }}>
            {counts.consultasHoje.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                Nenhuma consulta agendada para hoje
              </p>
            ) : (
              counts.consultasHoje.map((c) => {
                const dt = c.data || c.dataHora;
                const status = c.status || 'AGENDADA';
                return (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div className="avatar">{initials(c.pacienteNome || 'Paciente')}</div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 13.5, display: 'block' }}>
                        {c.pacienteNome || 'Paciente'}
                      </strong>
                      <small style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {c.medicoNome || 'Médico'} ·{' '}
                        {dt
                          ? new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </small>
                    </div>
                    <span
                      className={`badge ${status === 'REALIZADA'
                          ? 'badge-green'
                          : status === 'CANCELADA'
                            ? 'badge-red'
                            : 'badge-blue'
                        }`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Status das Consultas</span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Agendadas', key: 'AGENDADA', color: '#1565c0' },
              { label: 'Realizadas', key: 'REALIZADA', color: 'var(--success)' },
              { label: 'Canceladas', key: 'CANCELADA', color: 'var(--danger)' },
            ].map(({ label, key, color }) => {
              const n = counts.consultasPorStatus?.[key] || 0;
              const pct = counts.consultas > 0 ? Math.round((n / counts.consultas) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span>{label}</span>
                    <span style={{ color, fontWeight: 500 }}>
                      {n} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 4,
                        transition: 'width 0.5s',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

