import { useEffect, useState } from 'react';
import { LogOut, Medal, RefreshCw, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gameApi } from '../api/gameApi';
import { getErrorMessage } from '../api/axiosClient';
import Layout from '../components/Layout';
import type { GuessResponse, MeResponse } from '../types/game';

export default function GamePage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [lastGuess, setLastGuess] = useState<GuessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [guessing, setGuessing] = useState<number | null>(null);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  async function loadMe() {
    setError('');
    const profile = await gameApi.me();
    setMe(profile);
  }

  useEffect(() => {
    loadMe()
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleGuess(number: number) {
    setGuessing(number);
    setError('');
    try {
      const response = await gameApi.guess(number);
      setLastGuess(response);
      setMe((current) =>
        current ? { ...current, score: response.currentScore, turns: response.remainingTurns } : current,
      );
    } catch (err) {
      setError(getErrorMessage(err));
      await loadMe().catch(() => undefined);
    } finally {
      setGuessing(null);
    }
  }

  async function handleBuyTurns() {
    setBuying(true);
    setError('');
    try {
      const response = await gameApi.buyTurns();
      setMe((current) => (current ? { ...current, turns: response.turns } : current));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBuying(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  if (loading) {
    return (
      <Layout title="Game">
        <div className="rounded-lg bg-panel p-6 text-slate-600 shadow-sm ring-1 ring-slate-200">Loading game...</div>
      </Layout>
    );
  }

  const noTurns = !me || me.turns <= 0;

  return (
    <Layout title="Game" subtitle="Pick a number from 1 to 5. Each guess costs one turn.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg bg-panel p-6 shadow-sm ring-1 ring-slate-200">
          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Player" value={me?.username ?? '-'} />
            <Stat label="Score" value={String(me?.score ?? 0)} />
            <Stat label="Turns" value={String(me?.turns ?? 0)} />
          </div>

          {noTurns && (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You need more turns before guessing.
            </div>
          )}

          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((number) => (
              <button
                key={number}
                type="button"
                disabled={noTurns || guessing !== null}
                onClick={() => handleGuess(number)}
                className="aspect-square rounded-md bg-slate-900 text-xl font-bold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:bg-slate-300"
                title={`Guess ${number}`}
              >
                {guessing === number ? '...' : number}
              </button>
            ))}
          </div>

          {lastGuess && (
            <div
              className={`mt-6 rounded-lg p-5 ring-1 ${
                lastGuess.win ? 'bg-emerald-50 text-emerald-900 ring-emerald-200' : 'bg-slate-50 text-slate-800 ring-slate-200'
              }`}
            >
              <p className="text-lg font-bold">{lastGuess.win ? 'Win' : 'Loss'}</p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p>Guessed: {lastGuess.guessedNumber}</p>
                <p>Server: {lastGuess.serverNumber}</p>
                <p>Current score: {lastGuess.currentScore}</p>
                <p>Remaining turns: {lastGuess.remainingTurns}</p>
              </div>
              <p className="mt-3 text-sm">{lastGuess.message}</p>
            </div>
          )}
        </section>

        <aside className="rounded-lg bg-panel p-6 shadow-sm ring-1 ring-slate-200">
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleBuyTurns}
              disabled={buying}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart size={18} />
              {buying ? 'Buying...' : 'Buy 5 Turns'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <Medal size={18} />
              Leaderboard
            </button>
            <button
              type="button"
              onClick={() => loadMe().catch((err) => setError(getErrorMessage(err)))}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-700 transition hover:bg-red-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-mist px-4 py-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
