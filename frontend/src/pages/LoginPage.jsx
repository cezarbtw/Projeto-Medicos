import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, cadastrar, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'cadastro'
  const [loginName, setLoginName] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginName || !senha) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (mode === 'cadastro') {
      if (senha.length < 6) {
        setError('A senha deve conter no mínimo 6 caracteres.');
        return;
      }
      if (senha !== confirmarSenha) {
        setError('As senhas não coincidem. Verifique a digitação.');
        return;
      }

      const res = await cadastrar(loginName, senha);
      if (!res.success) {
        setError(res.error || 'Erro ao realizar cadastro.');
      } else {
        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
      }
    } else {
      const res = await login(loginName, senha);
      if (!res.success) {
        setError(res.error || 'Erro ao efetuar login. Verifique os dados.');
      }
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
          <p>{mode === 'login' ? 'Acesse o sistema com suas credenciais' : 'Crie sua conta para acessar o sistema'}</p>
        </div>

        {/* Alternador de Abas */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('login')}
            disabled={loading}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'cadastro' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('cadastro')}
            disabled={loading}
          >
            Cadastre-se
          </button>
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

        {successMsg && (
          <div className="login-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMsg}</span>
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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          {mode === 'cadastro' && (
            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <input
                id="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff' }} />
                {mode === 'login' ? 'Autenticando...' : 'Cadastrando...'}
              </>
            ) : mode === 'login' ? (
              'Entrar no Sistema'
            ) : (
              'Cadastrar e Entrar'
            )}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13 }}>
          {mode === 'login' ? (
            <span style={{ color: 'var(--text-muted)' }}>
              Não possui uma conta?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('cadastro')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Cadastre-se aqui
              </button>
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              Já possui conta cadastrada?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Faça login
              </button>
            </span>
          )}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <p>API REST protegida por JWT (Spring Security 6)</p>
        </div>
      </div>
    </div>
  );
}
