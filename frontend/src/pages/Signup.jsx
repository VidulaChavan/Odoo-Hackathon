import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DISPATCHER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/auth/register', { email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
      <div className="max-w-2xl w-full grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="hidden lg:flex flex-col justify-between rounded-[32px] bg-surface border border-border p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-secondary mb-3">Create your account</p>
            <h2 className="text-3xl font-semibold text-text mb-3">Get started with smart fleet dispatch.</h2>
            <p className="text-muted leading-relaxed">Register the right role and access dispatch, report, and vehicle data with secure backend connectivity.</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-accent/5 border border-border p-4">
              <p className="text-xs uppercase text-secondary tracking-[0.25em] mb-2">Role based</p>
              <p className="text-text text-sm">Choose the role that matches your workflow and get the right dashboard experience.</p>
            </div>
            <div className="rounded-2xl bg-accent/5 border border-border p-4">
              <p className="text-xs uppercase text-secondary tracking-[0.25em] mb-2">Secure by default</p>
              <p className="text-text text-sm">Account creation is backed by the same auth system used across the app.</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-8 rounded-[32px] shadow-lg w-full">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-secondary mb-2">New user registration</p>
            <h1 className="text-3xl font-semibold text-text">Sign Up</h1>
            <p className="text-muted text-sm mt-2">Create an account and start managing trips, vehicles, and fleet performance.</p>
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
              className="w-full border border-border bg-elevated text-text p-3 rounded-xl mb-4 placeholder:text-muted"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-border bg-elevated text-text p-3 rounded-xl mb-6"
            >
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="DISPATCHER">Dispatcher</option>
              <option value="SAFETY_OFFICER">Safety Officer</option>
              <option value="FINANCIAL_ANALYST">Financial Analyst</option>
            </select>

            <button
              type="submit"
              className="w-full bg-accent text-white p-3 rounded-xl font-semibold transition hover:bg-accent/90"
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-5 text-muted">
            Already have an account?
            <Link to="/login" className="text-secondary ml-2 font-semibold hover:text-text">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}