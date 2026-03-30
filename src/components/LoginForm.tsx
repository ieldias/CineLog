import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const { login, setScreen } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const err = login(email, password);
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

      <button className="btn-primary" onClick={handleSubmit}>Entrar</button>

      <p style={{ fontSize: 12, color: 'var(--txt-muted)', marginTop: 10, textAlign: 'center' }}>
        Demo: demo@cinelog.com / 123456
      </p>

      <div className="auth-switch">
        Não tem conta?{' '}
        <button onClick={() => { setScreen('register'); setError(''); }}>Cadastrar-se</button>
      </div>
    </>
  );
}
