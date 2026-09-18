import { useState, useEffect, useCallback } from 'react';
import { api, MOCK } from '../services/api';
import { ConfirmDialog } from '../components/ConfirmDialog';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export function PacientesPage({ showToast }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/pacientes');
      setPacientes(api.extractData(res));
    } catch {
      setPacientes(MOCK.pacientes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = pacientes.filter(
    (p) =>
      p.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf?.includes(search) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm({
      endereco: {
        logradouro: 'Avenida Brasil',
        bairro: 'Jardins',
        cep: '12345678',
        cidade: 'São Paulo',
        uf: 'SP',
        numero: '50',
        complemento: '',
      },
    });
    setModal('new');
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      endereco: p.endereco || {
        logradouro: 'Avenida Brasil',
        bairro: 'Jardins',
        cep: '12345678',
        cidade: 'São Paulo',
        uf: 'SP',
        numero: '50',
        complemento: '',
      },
    });
    setModal('edit');
  };

  const formatCpf = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const save = async () => {
    try {
      if (modal === 'new') {
        const payload = {
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          cpf: formatCpf(form.cpf || '12345678900'),
          endereco: form.endereco,
        };
        const novo = await api.post('/pacientes', payload).catch(() => ({
          ...form,
          id: Date.now(),
        }));
        setPacientes((prev) => [...prev, novo]);
        showToast('Paciente cadastrado com sucesso!');
      } else {
        const payload = {
          id: form.id,
          nome: form.nome,
          telefone: form.telefone,
          endereco: form.endereco,
        };
        const upd = await api.put('/pacientes', payload).catch(() => form);
        setPacientes((prev) => prev.map((x) => (x.id === form.id ? { ...x, ...upd } : x)));
        showToast('Paciente atualizado com sucesso!');
      }
      setModal(null);
    } catch (err) {
      showToast('Erro ao salvar paciente: ' + (err.message || 'Verifique os dados'));
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/pacientes/${id}`);
      setPacientes((prev) => prev.filter((x) => x.id !== id));
      showToast('Paciente inativado/removido.');
    } catch {
      setPacientes((prev) => prev.filter((x) => x.id !== id));
      showToast('Paciente removido.');
    } finally {
      setConfirm(null);
    }
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const fEnd = (k, v) =>
    setForm((p) => ({
      ...p,
      endereco: { ...(p.endereco || {}), [k]: v },
    }));

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg={`Deseja realmente inativar/excluir o paciente "${confirm.nome}"?`}
          onConfirm={() => del(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'new' ? 'Novo Paciente' : 'Editar Paciente'}</h2>
              <button className="close-btn" onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome completo *</label>
                <input
                  placeholder="Nome Sobrenome"
                  value={form.nome || ''}
                  onChange={(e) => f('nome', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    placeholder="000.000.000-00"
                    value={form.cpf || ''}
                    disabled={modal === 'edit'}
                    onChange={(e) => f('cpf', formatCpf(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    placeholder="(00) 00000-0000"
                    value={form.telefone || ''}
                    onChange={(e) => f('telefone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  placeholder="paciente@email.com"
                  value={form.email || ''}
                  disabled={modal === 'edit'}
                  onChange={(e) => f('email', e.target.value)}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                  Endereço (Obrigatório na API)
                </span>
                <div className="form-row" style={{ marginTop: 8 }}>
                  <div className="form-group">
                    <label>Logradouro</label>
                    <input
                      placeholder="Rua / Avenida"
                      value={form.endereco?.logradouro || ''}
                      onChange={(e) => fEnd('logradouro', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Número</label>
                    <input
                      placeholder="50"
                      value={form.endereco?.numero || ''}
                      onChange={(e) => fEnd('numero', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: 8 }}>
                  <div className="form-group">
                    <label>Bairro</label>
                    <input
                      placeholder="Bairro"
                      value={form.endereco?.bairro || ''}
                      onChange={(e) => fEnd('bairro', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cidade / UF</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 6 }}>
                      <input
                        placeholder="Cidade"
                        value={form.endereco?.cidade || ''}
                        onChange={(e) => fEnd('cidade', e.target.value)}
                      />
                      <input
                        placeholder="SP"
                        maxLength={2}
                        value={form.endereco?.uf || ''}
                        onChange={(e) => fEnd('uf', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={save}>
                {modal === 'new' ? 'Cadastrar Paciente' : 'Salvar Alterações'}
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
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={openNew}>
            + Novo Paciente
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" /> Carregando pacientes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👤</div>
            <p>Nenhum paciente encontrado</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>CPF</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="cell-name">
                      <div
                        className="avatar"
                        style={{ background: 'linear-gradient(135deg, #5ab4f0, #1565c0)' }}
                      >
                        {initials(p.nome)}
                      </div>
                      <strong>{p.nome}</strong>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-muted)' }}>
                    {p.cpf || '—'}
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {p.email || '—'}
                    <br />
                    {p.telefone || ''}
                  </td>
                  <td>
                    <span className="badge badge-green">Ativo</span>
                  </td>
                  <td>
                    <div className="tag-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(p)}>
                        Inativar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

