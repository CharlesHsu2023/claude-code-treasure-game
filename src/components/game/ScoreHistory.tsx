import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { apiGet } from '../../api/client';

interface Session {
  id: number;
  final_score: number;
  won: number;
  boxes_opened: number;
  played_at: string;
}

interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  totalScore: number;
}

interface Props {
  refresh: boolean;
}

export default function ScoreHistory({ refresh }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiGet('/api/scores/me')
      .then(data => {
        setSessions(data.sessions);
        setStats(data.stats);
      })
      .catch(() => {});
  }, [refresh]);

  if (!stats || stats.totalGames === 0) return null;

  return (
    <Card className="mt-6 border-2 border-amber-300 w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-amber-900 text-lg">Your Score History</CardTitle>
        <div className="flex gap-4 text-sm text-amber-800 flex-wrap">
          <span>Total Games: <strong>{stats.totalGames}</strong></span>
          <span>Wins: <strong className="text-green-700">{stats.wins}</strong></span>
          <span>Losses: <strong className="text-red-700">{stats.losses}</strong></span>
          <span>Total Score: <strong className={stats.totalScore >= 0 ? 'text-green-700' : 'text-red-700'}>${stats.totalScore}</strong></span>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-amber-700 border-b border-amber-200">
              <th className="text-left py-1">Date</th>
              <th className="text-center py-1">Result</th>
              <th className="text-center py-1">Boxes</th>
              <th className="text-right py-1">Score</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} className="border-b border-amber-100 last:border-0">
                <td className="py-1 text-amber-700">
                  {new Date(s.played_at).toLocaleString()}
                </td>
                <td className="py-1 text-center">
                  {s.won ? '🎉 Win' : '💀 Loss'}
                </td>
                <td className="py-1 text-center text-amber-800">{s.boxes_opened}</td>
                <td className={`py-1 text-right font-medium ${s.final_score >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${s.final_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
