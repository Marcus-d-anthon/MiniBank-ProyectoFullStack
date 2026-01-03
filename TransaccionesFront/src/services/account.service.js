import api from '../api/api';

export const createAccount = (data) =>
  api.post('/accounts', data);

export const getAccounts = () =>
  api.get('/accounts');

export const getAccountById = (id) =>
  api.get(`/accounts/${id}`);

export const updateAccount = (id, data) =>
  api.put(`/accounts/${id}`, data);

export const deleteAccount = (id) =>
  api.delete(`/accounts/${id}`);
