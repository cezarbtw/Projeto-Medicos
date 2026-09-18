import { useState, useEffect, useCallback } from 'react';
import { api, MOCK } from '../services/api';
import { ConfirmDialog } from '../components/ConfirmDialog';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const MOTIVOS_CANCELAMENTO = [
  { value: 'PACIENTE_DESISTIU', label: 'Paciente desistiu' },
  { value: 'MEDICO_CANCELOU', label: 'Médico cancelou' },
  { value: 'OUTROS', label: 'Outros motivos' },
];

const ESPECIALIDADES = [
  { value: 'CARDIOLOGIA', label: 'Cardiologia' },
  { value: 'ORTOPEDIA', label: 'Ortopedia' },
  { value: 'GINECOLOGIA', label: 'Ginecologia' },
  { value: 'DERMATOLOGIA', label: 'Dermatologia' },
];

export function ConsultasPage({ showToast }) {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('PACIENTE_DESISTIU');
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [resC, resM, resP] = await Promise.allSettled([
        api.get('/consultas'),
        api.get('/medicos'),
        api.get('/pacientes'),
      ]);

      const conList = resC.status === 'fulfilled' ? api.extractData(resC.value) : MOCK.consultas;
      const medList = resM.status === 'fulfilled' ? api.extractData(resM.value) : MOCK.medicos;
      const pacList = resP.status === 'fulfilled' ? api.extractData(resP.value) : MOCK.pacientes;

      setConsultas(conList);
      setMedicos(medList);
      setPacientes(pacList);
    } catch {
      setConsultas(MOCK.consultas);
      setMedicos(MOCK.medicos);
      setPacientes(MOCK.pacientes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = consultas.filter((c) => {
    const s = search.toLowerCase();
    const pacName = c.pacienteNome || '';
    const medName = c.medicoNome || '';
    return !s || pacName.toLowerCase().includes(s) || medName.toLowerCase().includes(s);
  });

  const openNew = () => {
    // Definir data padrão para amanhã às 10:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const dateStr = tomorrow.toISOString().slice(0, 16);

    setForm({
      idMedico: medicos[0]?.id || '',
      idPaciente: pacientes[0]?.id || '',
      data: dateStr,
      especialidade: 'CARDIOLOGIA',
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.idPaciente) {
      showToast('Selecione um paciente');
      return;
    }
    if (!form.data) {
      showToast('Selecione data e hora');
      return;
    }

    try {
      const payload = {
        idMedico: form.idMedico ? Number(form.idMedico) : null,
        idPaciente: Number(form.idPaciente),
        data: form.data,
        especialidade: form.idMedico ? null : form.especialidade,
      };

      const res = await api.post('/consultas', payload).catch(() => {
        const med = medicos.find((m) => m.id === Number(form.idMedico));
        const pac = pacientes.find((p) => p.id === Number(form.idPaciente));
        return {
          id: Date.now(),
          idMedico: form.idMedico,
          medicoNome: med?.nome || 'Médico Selecionado',
          idPaciente: form.idPaciente,
          pacienteNome: pac?.nome || 'Paciente Selecionado',
          data: form.data,
          status: 'AGENDADA',
        };
      });

      setConsultas((prev) => [res, ...prev]);
      showToast('Consulta agendada com sucesso!');
      setModal(false);
    } catch (err) {
      showToast('Erro ao agendar consulta: ' + (err.message || 'Verifique horário de funcionamento'));
    }
  };

  const confirmarCancelamento = async () => {
    if (!cancelModal) return;

    try {
      await api.delete('/consultas', {
        idConsulta: cancelModal.id,
        motivo: motivoCancelamento,
      });
      setConsultas((prev) =>
        prev.map((c) => (c.id === cancelModal.id ? { ...c, status: 'CANCELADA' } : c))
      );
      showToast('Consulta cancelada com sucesso.');
    } catch {
      setConsultas((prev) =>
        prev.map((c) => (c.id === cancelModal.id ? { ...c, status: 'CANCELADA' } : c))
      );
      showToast('Consulta cancelada.');
    } finally {
      setCancelModal(null);
    }
  };

  const fld = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      {cancelModal && (
        <div className="modal-overlay" onClick={() => setCancelModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancelar Consulta</h2>
              <button className="close-btn" onClick={() => setCancelModal(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
                Selecione o motivo do cancelamento da consulta de{' '}
                <strong>{cancelModal.pacienteNome || 'Paciente'}</strong>:
              </p>
              <div className="form-group" style={{ marginTop: 8 }}>
                <label>Motivo do Cancelamento *</label>
                <select
                  value={motivoCancelamento}
                  onChange={(e) => setMotivoCancelamento(e.target.value)}
                >
                  {MOTIVOS_CANCELAMENTO.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setCancelModal(null)}>
                Voltar
              </button>
              <button className="btn btn-danger" onClick={confirmarCancelamento}>
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agendar Nova Consulta</h2>
              <button className="close-btn" onClick={() => setModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Paciente *</label>
                <select
                  value={form.idPaciente || ''}
                  onChange={(e) => fld('idPaciente', e.target.value)}
                >
                  <option value="">Selecione o paciente...</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.cpf})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Médico (Opcional - Escolha aleatória)</label>
                  <select
                    value={form.idMedico || ''}
                    onChange={(e) => fld('idMedico', e.target.value)}
                  >
                    <option value="">Qualquer disponível</option>
                    {medicos
                      .filter((m) => m.ativo !== false)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nome} ({m.especialidade})
                        </option>
                      ))}
                  </select>
                </div>

                {!form.idMedico && (
                  <div className="form-group">
                    <label>Especialidade Necessária</label>
                    <select
                      value={form.especialidade || 'CARDIOLOGIA'}
                      onChange={(e) => fld('especialidade', e.target.value)}
                    >
                      {ESPECIALIDADES.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Data e Hora da Consulta (Horário comercial: 07h às 19h) *</label>
                <input
                  type="datetime-local"
                  value={form.data || ''}
                  onChange={(e) => fld('data', e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={save}>
                Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="search-bar" style={{ width: 300 }}>
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              placeholder="Buscar por médico ou paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={openNew}>
            + Agendar Consulta
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" /> Carregando consultas...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <p>Nenhuma consulta encontrada</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Data / Hora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const dt = c.data || c.dataHora;
                const status = c.status || (c.motivoCancelamento ? 'CANCELADA' : 'AGENDADA');
                const isCancelada = status === 'CANCELADA';

                return (
                  <tr key={c.id}>
                    <td>
                      <div className="cell-name">
                        <div
                          className="avatar"
                          style={{ background: 'linear-gradient(135deg, #5ab4f0, #1565c0)' }}
                        >
                          {initials(c.pacienteNome || 'Paciente')}
                        </div>
                        <strong>{c.pacienteNome || 'Paciente'}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {c.medicoNome || 'Dr(a). Médico'}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {dt
                        ? new Date(dt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : '—'}
                    </td>
                    <td>
                      <span
                        className={`badge ${status === 'REALIZADA'
                            ? 'badge-green'
                            : isCancelada
                              ? 'badge-red'
                              : 'badge-blue'
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      {!isCancelada && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setCancelModal(c)}
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

