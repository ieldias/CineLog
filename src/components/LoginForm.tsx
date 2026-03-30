import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const { signIn, setScreen } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <>
      <h2>ENTRAR</h2>
      <p>Bem-vindo de volta. Acesse sua conta.</p>

      <div className="form-group">
        <label className="form-label">E-mail</label>
        <input
          className="form-input"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Senha</label>
        <input
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      {error && <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 8 }}>{error}</p>}

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <div className="auth-switch">
        Não tem conta?{' '}
        <button onClick={() => { setScreen('register'); setError(''); }}>Cadastrar-se</button>
      </div>
    </>
  );
}
