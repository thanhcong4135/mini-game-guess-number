import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gameApi } from '../api/gameApi';
import { getErrorMessage } from '../api/axiosClient';
import Layout from '../components/Layout';
import type { LeaderboardEntry } from '../types/game';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    gameApi
      .leaderboard()
      .then(setEntries)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Leaderboard" subtitle="Top 10 players by score.">
      <section className="rounded-lg bg-panel p-6 shadow-sm ring-1 ring-slate-200">
        <button
          type="button"
          onClick={() => navigate('/game')}
          className="mb-5 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back to Game
        </button>

        {loading && <p className="text-slate-600">Loading leaderboard...</p>}
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 && (
                  <tr>
                    <td className="px-4 py-5 text-center text-slate-500" colSpan={3}>
                      No players yet.
                    </td>
                  </tr>
                )}
                {entries.map((entry) => (
                  <tr key={`${entry.rank}-${entry.username}`} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        {entry.rank <= 3 && <Trophy size={16} className="text-amber-500" />}
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{entry.username}</td>
                    <td className="px-4 py-3 text-right font-bold">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
