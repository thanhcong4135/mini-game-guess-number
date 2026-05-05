export interface MeResponse {
  username: string;
  score: number;
  turns: number;
}

export interface GuessResponse {
  guessedNumber: number;
  serverNumber: number;
  win: boolean;
  currentScore: number;
  remainingTurns: number;
  message: string;
}

export interface TurnsResponse {
  turns: number;
  message: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}
