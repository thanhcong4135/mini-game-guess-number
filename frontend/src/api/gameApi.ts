import axiosClient from './axiosClient';
import type { GuessResponse, LeaderboardEntry, MeResponse, TurnsResponse } from '../types/game';

export const gameApi = {
  me() {
    return axiosClient.get<MeResponse>('/me').then((res) => res.data);
  },
  guess(number: number) {
    return axiosClient.post<GuessResponse>('/guess', { number }).then((res) => res.data);
  },
  buyTurns() {
    return axiosClient.post<TurnsResponse>('/buy-turns').then((res) => res.data);
  },
  leaderboard() {
    return axiosClient.get<LeaderboardEntry[]>('/leaderboard').then((res) => res.data);
  },
};
