import api from '../api/api';

export const createTransaction = (data) =>
  api.post('/transactions', data);

export const getTransactions = () =>
  api.get('/transactions');
