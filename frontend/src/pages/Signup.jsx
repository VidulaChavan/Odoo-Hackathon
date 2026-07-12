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
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-surface border border-border p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-text">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="text-danger text-sm mb-4 text-center">{error}</p>
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border bg-elevated text-text p-3 rounded-lg mb-4"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-elevated text-text p-3 rounded-lg mb-4"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-border bg-elevated text-text p-3 rounded-lg mb-6"
          >
            <option value="FLEET_MANAGER">Fleet Manager</option>
            <option value="DISPATCHER">Dispatcher</option>
            <option value="SAFETY_OFFICER">Safety Officer</option>
            <option value="FINANCIAL_ANALYST">Financial Analyst</option>
          </select>

          <button
            type="submit"
            className="w-full bg-accent text-white p-3 rounded-lg hover:opacity-90"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-5 text-muted">
          Already have an account?
          <Link to="/login" className="text-secondary ml-2">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}