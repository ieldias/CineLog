import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function RegisterForm() {
  const { register, setScreen } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const err = register(name, email, password);
    if (err) setError(err);
  };

  return (
    <>
      <h2>CADASTRO</h2>
      <p>Crie sua conta gratuita agora.</p>

      <div className="form-group">
        <label className="form-label">Nome</label>
        <input
          className="form-input"
          placeholder="Seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

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

      <button className="btn-primary" onClick={handleSubmit}>Criar Conta</button>

      <div className="auth-switch">
        Já tem conta?{' '}
        <button onClick={() => { setScreen('login'); setError(''); }}>Entrar</button>
      </div>
    </>
  );
}
