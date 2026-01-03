import api from '../api/api';

export const getUsers = () =>
  api.get('/usuarios');

export const getUserByEmail = (email) =>
  api.get(`/usuarios/${email}`);

export const updateUser = (email, data) =>
  api.put(`/usuarios/${email}`, data);

export const deleteUser = (email) =>
  api.delete(`/usuarios/${email}`);
