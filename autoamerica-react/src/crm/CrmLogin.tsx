import { useState } from 'react';
import type { FormEvent } from 'react';
import { LoaderCircle, LogIn, ShieldCheck } from 'lucide-react';
import { api } from './api';
import type { CrmUser } from './api';

export default function CrmLogin({ onLogin }: { onLogin: (user: CrmUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user } = await api.login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
      setBusy(false);
    }
  }

  return <div className="crm-login-page">
    <form className="crm-login-card" onSubmit={submit}>
      <img className="crm-login-logo" src="/assets/logo-autoamerica.png" alt="Autoamérica" />
      <span className="crm-eyebrow">AUTOAMÉRICA / ADMINISTRACIÓN</span>
      <h1>CRM Autoamérica</h1>
      <p>Inicia sesión para administrar precios, fotografías, videos y publicaciones del sitio.</p>
      {error && <div className="crm-alert" role="alert">{error}</div>}
      <label>Correo corporativo<input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} placeholder="admin@autoamerica.com" /></label>
      <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="••••••••" /></label>
      <button className="crm-btn primary" disabled={busy}>{busy ? <LoaderCircle className="crm-spin" size={17} /> : <LogIn size={17} />} {busy ? 'Verificando…' : 'Entrar al CRM'}</button>
      <small><ShieldCheck size={13} /> Sesión con cookie HttpOnly · dura 8 horas</small>
    </form>
  </div>;
}
