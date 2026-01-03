import api from '../api/api';

export const loginRequest = (data) =>
  api.post('/auth/login', data);

export const registerRequest = (data) =>
  api.post('/usuarios', data);
