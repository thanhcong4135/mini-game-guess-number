import axiosClient from './axiosClient';
import type { AuthRequest, AuthResponse } from '../types/auth';
import type { MeResponse } from '../types/game';

export const authApi = {
  register(payload: AuthRequest) {
    return axiosClient.post<MeResponse>('/register', payload).then((res) => res.data);
  },
  login(payload: AuthRequest) {
    return axiosClient.post<AuthResponse>('/login', payload).then((res) => res.data);
  },
};
