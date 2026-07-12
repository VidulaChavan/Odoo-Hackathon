import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
      <div className="max-w-2xl w-full grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="hidden lg:flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-accent/10 via-transparent to-accent/5 border border-border p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-secondary mb-3">Fleet command</p>
            <h2 className="text-3xl font-semibold text-text mb-3">Welcome back to your dispatch control center.</h2>
            <p className="text-muted leading-relaxed">Sign in and keep your fleet moving with intuitive trip dispatch, status tracking, and performance insights.</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-surface border border-border p-4">
              <p className="text-xs uppercase text-muted tracking-[0.25em] mb-2">Designed for</p>
              <p className="text-text text-sm">Dispatchers, fleet managers, and operations teams.</p>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-4">
              <p className="text-xs uppercase text-muted tracking-[0.25em] mb-2">Ready for action</p>
              <p className="text-text text-sm">Fast login, seamless backend sync, and real-time trip updates.</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-8 rounded-[32px] shadow-lg w-full">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-secondary mb-2">Secure sign in</p>
            <h1 className="text-3xl font-semibold text-text">Login</h1>
            <p className="text-muted text-sm mt-2">Enter your credentials to access Odoo fleet operations.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-danger text-sm mb-4 text-center">{error}</p>
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-elevated text-text p-3 rounded-xl mb-4 placeholder:text-muted"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-elevated text-text p-3 rounded-xl mb-6 placeholder:text-muted"
            />

            <button
              type="submit"
              className="w-full bg-accent text-white p-3 rounded-xl font-semibold transition hover:bg-accent/90"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-5 text-muted">
            Don't have an account?
            <Link to="/signup" className="text-secondary ml-2 font-semibold hover:text-text">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}