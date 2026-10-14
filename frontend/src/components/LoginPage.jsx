import { useState } from 'react';
import { FileText, LogIn } from 'lucide-react';
import { loginUser, registerUser } from '../services/authApi.js';
import '../styles/auth.css';

export default function LoginPage({ onAuthenticated }) {
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = registering
        ? await registerUser(form)
        : await loginUser(form.email, form.password);
      onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon"><FileText /></div>
          <div><b>PDF Vault</b><small>DOCUMENT WORKSPACE</small></div>
        </div>
        <p className="eyebrow">{registering ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</p>
        <h1>{registering ? 'Create your account' : 'Sign in to PDF Vault'}</h1>
        <p className="auth-subtitle">
          {registering ? 'Create a private space for your documents.' : 'Access your personal document library.'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {registering && (
            <label>Username<input name="username" value={form.username} onChange={update} minLength="3" required /></label>
          )}
          <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={update} minLength="8" required /></label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary auth-submit" disabled={busy}>
            <LogIn size={17} /> {busy ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button className="auth-switch" onClick={() => { setRegistering(!registering); setError(''); }}>
          {registering ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
      </section>
    </main>
  );
}
