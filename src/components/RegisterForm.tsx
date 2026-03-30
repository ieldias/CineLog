import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function RegisterForm() {
  const { signUp, setScreen } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const err = await signUp(email, password, name);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      // Supabase envia e-mail de confirmação por padrão
      // Se desativado no dashboard, o login ocorre automaticamente
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <h2>VERIFIQUE SEU E-MAIL</h2>
        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
          Enviamos um link de confirmação para <strong>{email}</strong>.
          Clique no link e depois faça o login.
        </p>
        <button
          className="btn-primary"
          style={{ marginTop: 24 }}
          onClick={() => { setScreen('login'); setSuccess(false); }}
        >
          Ir para o Login
        </button>
      </div>
    );
  }

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
          placeholder="mínimo 6 caracteres"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      {error && <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 8 }}>{error}</p>}

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>

      <div className="auth-switch">
        Já tem conta?{' '}
        <button onClick={() => { setScreen('login'); setError(''); }}>Entrar</button>
      </div>
    </>
  );
}
