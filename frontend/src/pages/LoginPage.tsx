import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import axios from 'axios';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '../api/axiosClient';
import Layout from '../components/Layout';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login({ username, password });
      localStorage.setItem('token', response.token);
      navigate('/game');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Username or Password is invalid');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Guess Number" subtitle="Login to play the 1 to 5 guessing game.">
      <section className="mx-auto max-w-md rounded-lg bg-panel p-6 shadow-sm ring-1 ring-slate-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          {successMessage && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          No account?{' '}
          <Link className="font-semibold text-accent hover:text-blue-700" to="/register">
            Register
          </Link>
        </p>
      </section>
    </Layout>
  );
}
