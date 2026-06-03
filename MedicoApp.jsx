import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8080";

const COLORS = {
  primary: "#1a6b3c",
  primaryLight: "#2d8f54",
  primaryDark: "#0f4426",
  accent: "#4caf78",
  bg: "#f0f7f3",
  surface: "#ffffff",
  border: "#c8e6d5",
  text: "#1a2e22",
  textMuted: "#5a7a66",
  danger: "#c0392b",
  dangerLight: "#fdecea",
  warning: "#e67e22",
  warningLight: "#fef4e8",
  success: "#27ae60",
  successLight: "#eafaf1",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${COLORS.bg};
    color: ${COLORS.text};
    min-height: 100vh;
  }

  .sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: 240px;
    background: ${COLORS.primary};
    display: flex;
    flex-direction: column;
    z-index: 100;
    padding: 0;
  }

  .sidebar-logo {
    padding: 28px 24px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  .sidebar-logo h1 {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.3px;
    line-height: 1.2;
  }

  .sidebar-logo span {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    font-weight: 400;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    padding: 16px 12px 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    color: rgba(255,255,255,0.75);
    font-size: 14px;
    font-weight: 400;
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;
  }

  .nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .nav-item.active { background: rgba(255,255,255,0.18); color: #fff; font-weight: 500; }

  .nav-item .icon { font-size: 18px; width: 20px; flex-shrink: 0; }

  .main {
    margin-left: 240px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    background: ${COLORS.surface};
    border-bottom: 1px solid ${COLORS.border};
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .topbar-title {
    font-size: 18px;
    font-weight: 500;
    color: ${COLORS.text};
  }

  .topbar-actions { display: flex; align-items: center; gap: 12px; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }

  .btn-primary {
    background: ${COLORS.primary};
    color: #fff;
  }
  .btn-primary:hover { background: ${COLORS.primaryLight}; }

  .btn-outline {
    background: transparent;
    color: ${COLORS.primary};
    border: 1px solid ${COLORS.border};
  }
  .btn-outline:hover { background: ${COLORS.bg}; }

  .btn-danger {
    background: ${COLORS.dangerLight};
    color: ${COLORS.danger};
    border: none;
  }
  .btn-danger:hover { background: #f5c6c2; }

  .btn-sm { padding: 5px 10px; font-size: 12px; border-radius: 6px; }

  .content { padding: 28px 32px; flex: 1; }

  .card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    overflow: hidden;
  }

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid ${COLORS.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-title {
    font-size: 15px;
    font-weight: 500;
    color: ${COLORS.text};
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: ${COLORS.bg};
  }

  .stat-value {
    font-size: 28px;
    font-weight: 600;
    font-family: 'Lora', serif;
    color: ${COLORS.primary};
    line-height: 1;
  }

  .stat-label {
    font-size: 12px;
    color: ${COLORS.textMuted};
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: ${COLORS.textMuted};
    background: ${COLORS.bg};
    border-bottom: 1px solid ${COLORS.border};
  }
  tbody tr {
    border-bottom: 1px solid #f0f5f2;
    transition: background 0.1s;
  }
  tbody tr:hover { background: #fafcfb; }
  tbody tr:last-child { border-bottom: none; }
  td {
    padding: 12px 16px;
    font-size: 13.5px;
    color: ${COLORS.text};
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
  }
  .badge-green { background: ${COLORS.successLight}; color: #1a6b3c; }
  .badge-blue { background: #e8f4fd; color: #1565c0; }
  .badge-amber { background: ${COLORS.warningLight}; color: #b35c00; }
  .badge-red { background: ${COLORS.dangerLight}; color: ${COLORS.danger}; }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.primary});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
  }

  .cell-name { display: flex; align-items: center; gap: 10px; }
  .cell-name strong { font-weight: 500; display: block; font-size: 13.5px; }
  .cell-name small { color: ${COLORS.textMuted}; font-size: 12px; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 30, 15, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: ${COLORS.surface};
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .modal-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid ${COLORS.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-header h2 { font-size: 16px; font-weight: 600; color: ${COLORS.text}; }

  .modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }

  .modal-footer {
    padding: 16px 24px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  label { font-size: 12px; font-weight: 500; color: ${COLORS.textMuted}; }

  input, select, textarea {
    padding: 9px 12px;
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: ${COLORS.text};
    background: #fff;
    outline: none;
    transition: border 0.15s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: ${COLORS.primaryLight};
    box-shadow: 0 0 0 3px rgba(45, 143, 84, 0.12);
  }

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-bar input { padding-left: 34px; }
  .search-icon {
    position: absolute;
    left: 10px;
    font-size: 16px;
    color: ${COLORS.textMuted};
  }

  .empty-state {
    padding: 48px;
    text-align: center;
    color: ${COLORS.textMuted};
  }
  .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state p { font-size: 14px; }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${COLORS.primary};
    color: #fff;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    z-index: 999;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    animation: toastIn 0.25s ease;
  }
  @keyframes toastIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: ${COLORS.textMuted};
    padding: 2px 6px;
    border-radius: 6px;
    line-height: 1;
  }
  .close-btn:hover { background: ${COLORS.bg}; color: ${COLORS.text}; }

  .page-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tag-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.15s; }
  tr:hover .tag-actions { opacity: 1; }

  .confirm-dialog {
    background: ${COLORS.surface};
    border-radius: 12px;
    padding: 24px;
    max-width: 360px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  }
  .confirm-dialog h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
  .confirm-dialog p { font-size: 13.5px; color: ${COLORS.textMuted}; margin-bottom: 20px; }
  .confirm-dialog .btns { display: flex; gap: 10px; justify-content: center; }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: ${COLORS.textMuted};
    font-size: 14px;
    gap: 10px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid ${COLORS.border};
    border-top-color: ${COLORS.primary};
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── Helpers ─────────────────────────────────────────────────────────────────
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-dialog">
        <h3>Confirmar exclusão</h3>
        <p>{msg}</p>
        <div className="btns">
          <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

const StatIcon = ({ type }) => {
  const icons = {
    medicos: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6m-3-3v6M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z"/></svg>,
    pacientes: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 11h6M19 8v6"/></svg>,
    consultas: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    realizadas: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>,
  };
  return icons[type] || null;
};
// ── API Layer ────────────────────────────────────────────────────────────────
const api = {
  get: async (path) => {
    const r = await fetch(API_BASE + path);
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  },
  post: async (path, body) => {
    const r = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  },
  put: async (path, body) => {
    const r = await fetch(API_BASE + path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  },
  delete: async (path) => {
    const r = await fetch(API_BASE + path, { method: "DELETE" });
    if (!r.ok) throw new Error(r.statusText);
    return r.status !== 204 ? r.json() : null;
  },
};

// ── MOCK DATA (fallback quando API estiver offline) ───────────────────────────
const MOCK = {
  medicos: [
    { id: 1, nome: "Dr. Carlos Mendes", crm: "12345-SP", especialidade: "Cardiologia", email: "carlos@clinica.com", telefone: "(11) 99999-1111", ativo: true },
    { id: 2, nome: "Dra. Ana Paula Lima", crm: "67890-SP", especialidade: "Pediatria", email: "ana@clinica.com", telefone: "(11) 99999-2222", ativo: true },
    { id: 3, nome: "Dr. Roberto Silva", crm: "11223-RJ", especialidade: "Ortopedia", email: "roberto@clinica.com", telefone: "(21) 98888-3333", ativo: false },
  ],
  pacientes: [
    { id: 1, nome: "Maria Oliveira", cpf: "123.456.789-00", dataNascimento: "1985-03-15", email: "maria@email.com", telefone: "(11) 97777-4444", convenio: "Unimed" },
    { id: 2, nome: "João Pereira", cpf: "987.654.321-00", dataNascimento: "1972-07-22", email: "joao@email.com", telefone: "(11) 96666-5555", convenio: "SulAmérica" },
    { id: 3, nome: "Fernanda Costa", cpf: "555.444.333-22", dataNascimento: "1995-11-08", email: "fernanda@email.com", telefone: "(11) 95555-6666", convenio: "Particular" },
  ],
  consultas: [
    { id: 1, medicoId: 1, medicoNome: "Dr. Carlos Mendes", pacienteId: 1, pacienteNome: "Maria Oliveira", dataHora: "2025-05-20T09:00", status: "AGENDADA", observacoes: "Consulta de rotina" },
    { id: 2, medicoId: 2, medicoNome: "Dra. Ana Paula Lima", pacienteId: 2, pacienteNome: "João Pereira", dataHora: "2025-05-20T10:30", status: "REALIZADA", observacoes: "Check-up anual" },
    { id: 3, medicoId: 1, medicoNome: "Dr. Carlos Mendes", pacienteId: 3, pacienteNome: "Fernanda Costa", dataHora: "2025-05-21T14:00", status: "AGENDADA", observacoes: "" },
  ],
};

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ counts }) {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20, textTransform: "capitalize" }}>{today}</p>

      <div className="stats-grid">
        {[
          { type: "medicos", label: "Médicos", value: counts.medicos, color: COLORS.primary },
          { type: "pacientes", label: "Pacientes", value: counts.pacientes, color: "#1565c0" },
          { type: "consultas", label: "Consultas", value: counts.consultas, color: "#b35c00" },
          { type: "realizadas", label: "Realizadas", value: counts.realizadas, color: COLORS.success },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ color: s.color }}><StatIcon type={s.type} /></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Consultas de Hoje</span></div>
          <div style={{ padding: 16 }}>
            {counts.consultasHoje.length === 0
              ? <p style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: "16px 0" }}>Nenhuma consulta hoje</p>
              : counts.consultasHoje.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div className="avatar">{initials(c.pacienteNome)}</div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 13.5, display: "block" }}>{c.pacienteNome}</strong>
                    <small style={{ color: COLORS.textMuted, fontSize: 12 }}>{c.medicoNome} · {new Date(c.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</small>
                  </div>
                  <span className={`badge ${c.status === "REALIZADA" ? "badge-green" : c.status === "CANCELADA" ? "badge-red" : "badge-blue"}`}>{c.status}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Status das Consultas</span></div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Agendadas", key: "AGENDADA", color: "#1565c0", bg: "#e8f4fd" },
              { label: "Realizadas", key: "REALIZADA", color: COLORS.success, bg: COLORS.successLight },
              { label: "Canceladas", key: "CANCELADA", color: COLORS.danger, bg: COLORS.dangerLight },
            ].map(({ label, key, color, bg }) => {
              const n = counts.consultasPorStatus?.[key] || 0;
              const pct = counts.consultas > 0 ? Math.round((n / counts.consultas) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span>{label}</span>
                    <span style={{ color, fontWeight: 500 }}>{n} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: COLORS.bg, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.5s" }} />
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

// ── MÉDICOS ──────────────────────────────────────────────────────────────────
function MedicosPage({ showToast }) {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const ESPECIALIDADES = ["Cardiologia","Clínica Geral","Dermatologia","Ginecologia","Neurologia","Oftalmologia","Ortopedia","Pediatria","Psiquiatria","Urologia","Outro"];

  const load = useCallback(async () => {
    setLoading(true);
    try { setMedicos(await api.get("/medicos")); }
    catch { setMedicos(MOCK.medicos); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = medicos.filter((m) =>
    m.nome?.toLowerCase().includes(search.toLowerCase()) ||
    m.especialidade?.toLowerCase().includes(search.toLowerCase()) ||
    m.crm?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm({ ativo: true }); setModal("new"); };
  const openEdit = (m) => { setForm({ ...m }); setModal("edit"); };

  const save = async () => {
    try {
      if (modal === "new") {
        const novo = await api.post("/medicos", form).catch(() => ({ ...form, id: Date.now() }));
        setMedicos((p) => [...p, novo]);
        showToast("Médico cadastrado com sucesso!");
      } else {
        const upd = await api.put(`/medicos/${form.id}`, form).catch(() => form);
        setMedicos((p) => p.map((m) => (m.id === upd.id ? upd : m)));
        showToast("Médico atualizado com sucesso!");
      }
      setModal(null);
    } catch {}
  };

  const del = async (id) => {
    await api.delete(`/medicos/${id}`).catch(() => {});
    setMedicos((p) => p.filter((m) => m.id !== id));
    showToast("Médico removido.");
    setConfirm(null);
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg={`Deseja excluir o médico "${confirm.nome}"?`}
          onConfirm={() => del(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "new" ? "Novo Médico" : "Editar Médico"}</h2>
              <button className="close-btn" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome completo *</label>
                <input placeholder="Dr. Nome Sobrenome" value={form.nome || ""} onChange={(e) => f("nome", e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CRM *</label>
                  <input placeholder="00000-UF" value={form.crm || ""} onChange={(e) => f("crm", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Especialidade</label>
                  <select value={form.especialidade || ""} onChange={(e) => f("especialidade", e.target.value)}>
                    <option value="">Selecione...</option>
                    {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="email@clinica.com" value={form.email || ""} onChange={(e) => f("email", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input placeholder="(00) 00000-0000" value={form.telefone || ""} onChange={(e) => f("telefone", e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="ativo" style={{ width: "auto" }} checked={form.ativo ?? true} onChange={(e) => f("ativo", e.target.checked)} />
                <label htmlFor="ativo" style={{ margin: 0, cursor: "pointer" }}>Médico ativo</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>
                {modal === "new" ? "Cadastrar" : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="search-bar" style={{ width: 280 }}>
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input placeholder="Buscar por nome, CRM, especialidade..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Médico</button>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /> Carregando médicos...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="icon" style={{fontSize:14,color:COLORS.textMuted}}>Nenhum médico encontrado</div><p></p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Médico</th>
                <th>CRM</th>
                <th>Especialidade</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="cell-name">
                      <div className="avatar">{initials(m.nome)}</div>
                      <div><strong>{m.nome}</strong></div>
                    </div>
                  </td>
                  <td style={{ color: COLORS.textMuted, fontFamily: "monospace", fontSize: 13 }}>{m.crm}</td>
                  <td><span className="badge badge-blue">{m.especialidade || "—"}</span></td>
                  <td style={{ fontSize: 12.5, color: COLORS.textMuted }}>{m.email || "—"}<br />{m.telefone || ""}</td>
                  <td>
                    <span className={`badge ${m.ativo ? "badge-green" : "badge-amber"}`}>
                      {m.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="tag-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(m)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(m)}>Excluir</button>
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

// ── PACIENTES ────────────────────────────────────────────────────────────────
function PacientesPage({ showToast }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setPacientes(await api.get("/pacientes")); }
    catch { setPacientes(MOCK.pacientes); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = pacientes.filter((p) =>
    p.nome?.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf?.includes(search) ||
    p.convenio?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm({}); setModal("new"); };
  const openEdit = (p) => { setForm({ ...p }); setModal("edit"); };

  const save = async () => {
    try {
      if (modal === "new") {
        const novo = await api.post("/pacientes", form).catch(() => ({ ...form, id: Date.now() }));
        setPacientes((p) => [...p, novo]);
        showToast("Paciente cadastrado!");
      } else {
        const upd = await api.put(`/pacientes/${form.id}`, form).catch(() => form);
        setPacientes((p) => p.map((x) => (x.id === upd.id ? upd : x)));
        showToast("Paciente atualizado!");
      }
      setModal(null);
    } catch {}
  };

  const del = async (id) => {
    await api.delete(`/pacientes/${id}`).catch(() => {});
    setPacientes((p) => p.filter((x) => x.id !== id));
    showToast("Paciente removido.");
    setConfirm(null);
  };

  const idade = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    const anos = new Date().getFullYear() - d.getFullYear();
    return `${anos} anos`;
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg={`Deseja excluir o paciente "${confirm.nome}"?`}
          onConfirm={() => del(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "new" ? "Novo Paciente" : "Editar Paciente"}</h2>
              <button className="close-btn" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome completo *</label>
                <input placeholder="Nome Sobrenome" value={form.nome || ""} onChange={(e) => f("nome", e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CPF *</label>
                  <input placeholder="000.000.000-00" value={form.cpf || ""} onChange={(e) => f("cpf", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Data de nascimento</label>
                  <input type="date" value={form.dataNascimento || ""} onChange={(e) => f("dataNascimento", e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="email@email.com" value={form.email || ""} onChange={(e) => f("email", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input placeholder="(00) 00000-0000" value={form.telefone || ""} onChange={(e) => f("telefone", e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Convênio</label>
                <input placeholder="Ex: Unimed, SulAmérica, Particular..." value={form.convenio || ""} onChange={(e) => f("convenio", e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>
                {modal === "new" ? "Cadastrar" : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="search-bar" style={{ width: 280 }}>
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input placeholder="Buscar por nome, CPF, convênio..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Paciente</button>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /> Carregando pacientes...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="icon" style={{fontSize:14,color:COLORS.textMuted}}>Nenhum paciente encontrado</div><p></p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>CPF</th>
                <th>Idade</th>
                <th>Contato</th>
                <th>Convênio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="cell-name">
                      <div className="avatar" style={{ background: "linear-gradient(135deg, #5ab4f0, #1565c0)" }}>{initials(p.nome)}</div>
                      <strong>{p.nome}</strong>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 13, color: COLORS.textMuted }}>{p.cpf || "—"}</td>
                  <td>{idade(p.dataNascimento)}</td>
                  <td style={{ fontSize: 12.5, color: COLORS.textMuted }}>{p.email || "—"}<br />{p.telefone || ""}</td>
                  <td>{p.convenio ? <span className="badge badge-green">{p.convenio}</span> : "—"}</td>
                  <td>
                    <div className="tag-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(p)}>Excluir</button>
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

// ── CONSULTAS ────────────────────────────────────────────────────────────────
const STATUS_OPTS = ["AGENDADA", "REALIZADA", "CANCELADA", "REMARCADA"];

function ConsultasPage({ showToast }) {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, m, p] = await Promise.all([
        api.get("/consultas"),
        api.get("/medicos"),
        api.get("/pacientes"),
      ]);
      setConsultas(c); setMedicos(m); setPacientes(p);
    } catch {
      setConsultas(MOCK.consultas);
      setMedicos(MOCK.medicos);
      setPacientes(MOCK.pacientes);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = consultas.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = !s || c.pacienteNome?.toLowerCase().includes(s) || c.medicoNome?.toLowerCase().includes(s);
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusBadge = (s) => {
    const map = { AGENDADA: "badge-blue", REALIZADA: "badge-green", CANCELADA: "badge-red", REMARCADA: "badge-amber" };
    return <span className={`badge ${map[s] || "badge-blue"}`}>{s}</span>;
  };

  const openNew = () => { setForm({ status: "AGENDADA" }); setModal("new"); };
  const openEdit = (c) => { setForm({ ...c }); setModal("edit"); };

  const enrichForm = (f) => {
    const med = medicos.find((m) => m.id === Number(f.medicoId));
    const pac = pacientes.find((p) => p.id === Number(f.pacienteId));
    return { ...f, medicoNome: med?.nome || "", pacienteNome: pac?.nome || "" };
  };

  const save = async () => {
    const enriched = enrichForm(form);
    try {
      if (modal === "new") {
        const nova = await api.post("/consultas", enriched).catch(() => ({ ...enriched, id: Date.now() }));
        setConsultas((p) => [...p, nova]);
        showToast("Consulta agendada!");
      } else {
        const upd = await api.put(`/consultas/${form.id}`, enriched).catch(() => enriched);
        setConsultas((p) => p.map((x) => (x.id === upd.id ? upd : x)));
        showToast("Consulta atualizada!");
      }
      setModal(null);
    } catch {}
  };

  const del = async (id) => {
    await api.delete(`/consultas/${id}`).catch(() => {});
    setConsultas((p) => p.filter((x) => x.id !== id));
    showToast("Consulta removida.");
    setConfirm(null);
  };

  const fld = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg="Deseja cancelar/remover esta consulta?"
          onConfirm={() => del(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "new" ? "Agendar Consulta" : "Editar Consulta"}</h2>
              <button className="close-btn" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Médico *</label>
                  <select value={form.medicoId || ""} onChange={(e) => fld("medicoId", e.target.value)}>
                    <option value="">Selecione...</option>
                    {medicos.filter((m) => m.ativo !== false).map((m) => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Paciente *</label>
                  <select value={form.pacienteId || ""} onChange={(e) => fld("pacienteId", e.target.value)}>
                    <option value="">Selecione...</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Data e hora *</label>
                  <input type="datetime-local" value={form.dataHora || ""} onChange={(e) => fld("dataHora", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status || "AGENDADA"} onChange={(e) => fld("status", e.target.value)}>
                    {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Observações</label>
                <textarea rows={3} placeholder="Informações adicionais..." value={form.observacoes || ""} onChange={(e) => fld("observacoes", e.target.value)} style={{ resize: "vertical" }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>
                {modal === "new" ? "Agendar" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-bar" style={{ width: 250 }}>
              <span className="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </span>
              <input placeholder="Buscar médico ou paciente..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 140 }}>
              <option value="">Todos status</option>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Agendar Consulta</button>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /> Carregando consultas...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="icon" style={{fontSize:14,color:COLORS.textMuted}}>Nenhuma consulta encontrada</div><p></p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Data / Hora</th>
                <th>Status</th>
                <th>Observações</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="cell-name">
                      <div className="avatar" style={{ background: "linear-gradient(135deg, #5ab4f0, #1565c0)" }}>{initials(c.pacienteNome)}</div>
                      <strong>{c.pacienteNome}</strong>
                    </div>
                  </td>
                  <td style={{ color: COLORS.textMuted, fontSize: 13 }}>{c.medicoNome}</td>
                  <td style={{ fontSize: 13 }}>
                    {c.dataHora ? new Date(c.dataHora).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td>{statusBadge(c.status)}</td>
                  <td style={{ fontSize: 12.5, color: COLORS.textMuted, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.observacoes || "—"}
                  </td>
                  <td>
                    <div className="tag-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(c)}>Excluir</button>
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

// ── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [counts, setCounts] = useState({
    medicos: 0, pacientes: 0, consultas: 0, realizadas: 0,
    consultasHoje: [], consultasPorStatus: {},
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [med, pac, con] = await Promise.all([
          api.get("/medicos"),
          api.get("/pacientes"),
          api.get("/consultas"),
        ]);
        const today = new Date().toDateString();
        const hoje = con.filter((c) => new Date(c.dataHora).toDateString() === today);
        const porStatus = con.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {});
        setCounts({
          medicos: med.length,
          pacientes: pac.length,
          consultas: con.length,
          realizadas: con.filter((c) => c.status === "REALIZADA").length,
          consultasHoje: hoje.slice(0, 5),
          consultasPorStatus: porStatus,
        });
      } catch {
        const con = MOCK.consultas;
        const today = new Date().toDateString();
        const porStatus = con.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {});
        setCounts({
          medicos: MOCK.medicos.length,
          pacientes: MOCK.pacientes.length,
          consultas: con.length,
          realizadas: con.filter((c) => c.status === "REALIZADA").length,
          consultasHoje: con.filter((c) => new Date(c.dataHora).toDateString() === today),
          consultasPorStatus: porStatus,
        });
      }
    };
    loadStats();
  }, []);

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: "medicos", label: "Médicos", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6m-3-3v6M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z"/></svg> },
    { id: "pacientes", label: "Pacientes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 11h6M19 8v6"/></svg> },
    { id: "consultas", label: "Consultas", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  ];

  const titles = {
    dashboard: "Dashboard",
    medicos: "Gerenciar Médicos",
    pacientes: "Gerenciar Pacientes",
    consultas: "Agendamento de Consultas",
  };

  return (
    <>
      <style>{css}</style>
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>MediClin</h1>
          <span>Sistema de Gestão</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
            MediClin v1.0<br />Spring Boot API
          </p>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <span className="topbar-title">{titles[page]}</span>
          <div className="topbar-actions">
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="content">
          {page === "dashboard" && <Dashboard counts={counts} />}
          {page === "medicos" && <MedicosPage showToast={showToast} />}
          {page === "pacientes" && <PacientesPage showToast={showToast} />}
          {page === "consultas" && <ConsultasPage showToast={showToast} />}
        </div>
      </div>

      {toast && <Toast msg={toast} />}
    </>
  );
}
