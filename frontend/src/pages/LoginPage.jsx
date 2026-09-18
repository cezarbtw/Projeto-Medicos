import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, loading } = useAuth();
  const [loginName, setLoginName] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loginName || !senha) {
      setError('Preencha todos os campos.');
      return;
    }

    const res = await login(loginName, senha);
    if (!res.success) {
      setError(res.error || 'Erro ao efetuar login. Verifique os dados.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6m-3-3v6M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z" />
            </svg>
          </div>
          <h1>Voll.med / MediClin</h1>
          <p>Acesse o sistema com suas credenciais</p>
        </div>

        {error && (
          <div className="login-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login">Usuário ou E-mail</label>
            <input
              id="login"
              type="text"
              placeholder="ex: admin@voll.med"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff' }} />
                Autenticando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <p>API REST protegida por JWT (Spring Security 6)</p>
        </div>
      </div>
    </div>
  );
}

