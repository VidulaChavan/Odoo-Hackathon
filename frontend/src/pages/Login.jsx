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
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-surface border border-border p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-text">Login</h1>

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
            className="w-full border border-border bg-elevated text-text p-3 rounded-lg mb-6"
          />

          <button
            type="submit"
            className="w-full bg-accent text-white p-3 rounded-lg hover:opacity-90"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-5 text-muted">
          Don't have an account?
          <Link to="/signup" className="text-secondary ml-2">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}