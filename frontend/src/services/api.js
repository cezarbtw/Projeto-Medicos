const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const TOKEN_STORAGE_KEY = 'vollmed_jwt_token';
export const USER_STORAGE_KEY = 'vollmed_user';

let onUnauthorizedCallback = null;

export function registerOnUnauthorized(callback) {
  onUnauthorizedCallback = callback;
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  }

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = response.statusText;
    }
    const error = new Error(
      (errorData && errorData.message) || response.statusText || 'Erro na requisição'
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path) => request(path, { method: 'GET', headers: getHeaders(false) }),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(body),
    }),
  delete: (path, body) =>
    request(path, {
      method: 'DELETE',
      headers: getHeaders(!!body),
      body: body ? JSON.stringify(body) : undefined,
    }),

  // Normalizador para respostas paginadas do Spring Data (Page<T>)
  extractData: (res) => {
    if (res && Array.isArray(res.content)) {
      return res.content;
    }
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  },
};

// Dados Mock de contingência quando a API estiver offline
export const MOCK = {
  medicos: [
    { id: 1, nome: "Dr. Carlos Mendes", crm: "123456", especialidade: "CARDIOLOGIA", email: "carlos@clinica.com", telefone: "(11) 99999-1111", ativo: true },
    { id: 2, nome: "Dra. Ana Paula Lima", crm: "678901", especialidade: "PEDIATRIA", email: "ana@clinica.com", telefone: "(11) 99999-2222", ativo: true },
    { id: 3, nome: "Dr. Roberto Silva", crm: "112233", especialidade: "ORTOPEDIA", email: "roberto@clinica.com", telefone: "(21) 98888-3333", ativo: false },
  ],
  pacientes: [
    { id: 1, nome: "Maria Oliveira", cpf: "123.456.789-00", dataNascimento: "1985-03-15", email: "maria@email.com", telefone: "(11) 97777-4444", convenio: "Unimed" },
    { id: 2, nome: "João Pereira", cpf: "987.654.321-00", dataNascimento: "1972-07-22", email: "joao@email.com", telefone: "(11) 96666-5555", convenio: "SulAmérica" },
    { id: 3, nome: "Fernanda Costa", cpf: "555.444.333-22", dataNascimento: "1995-11-08", email: "fernanda@email.com", telefone: "(11) 95555-6666", convenio: "Particular" },
  ],
  consultas: [
    { id: 1, idMedico: 1, medicoNome: "Dr. Carlos Mendes", idPaciente: 1, pacienteNome: "Maria Oliveira", data: "2026-09-20T09:00", status: "AGENDADA", especialidade: "CARDIOLOGIA" },
    { id: 2, idMedico: 2, medicoNome: "Dra. Ana Paula Lima", idPaciente: 2, pacienteNome: "João Pereira", data: "2026-09-20T10:30", status: "REALIZADA", especialidade: "PEDIATRIA" },
    { id: 3, idMedico: 1, medicoNome: "Dr. Carlos Mendes", idPaciente: 3, pacienteNome: "Fernanda Costa", data: "2026-09-21T14:00", status: "AGENDADA", especialidade: "CARDIOLOGIA" },
  ],
};

