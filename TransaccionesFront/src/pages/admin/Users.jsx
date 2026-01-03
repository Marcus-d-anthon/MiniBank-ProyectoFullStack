import { useEffect, useState } from 'react';
import api from '../../api/api'; 

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsers(res.data.usuarios || []);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (user) => {
    const nuevoEstado = user.estado === 'activo' ? 'inactivo' : 'activo';
    if (!window.confirm(`¿Seguro que deseas cambiar el estado de este usuario a ${nuevoEstado}?`)) return;

    try {
      // Asumiendo que tienes una ruta PUT /usuarios/:id para actualizar
      await api.put(`/usuarios/${user._id}`, { estado: nuevoEstado });
      alert("Usuario actualizado");
      fetchUsers();
    } catch (err) {
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <h2 className="mb-4 fw-bold">Gestión de Usuarios</h2>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-dark text-white">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="py-3">Rol</th>
              <th className="py-3">Estado</th>
              <th className="py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="px-4">
                  <div className="fw-bold">{u.nombre?.primer_nombre} {u.nombre?.primer_apellido}</div>
                  <div className="small text-muted">{u.email}</div>
                </td>
                <td>
                  <span className={`badge rounded-pill ${u.rol === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
                    {u.rol}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                    {u.estado}
                  </span>
                </td>
                <td className="text-center">
                  <div className="btn-group shadow-sm rounded">
                    <button className="btn btn-white btn-sm border" title="Ver Perfil">
                      <i className="bi bi-eye text-info"></i>
                    </button>
                    <button className="btn btn-white btn-sm border" title="Editar">
                      <i className="bi bi-pencil text-warning"></i>
                    </button>
                    <button 
                      className="btn btn-white btn-sm border" 
                      onClick={() => handleToggleStatus(u)}
                      title={u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      <i className={`bi ${u.estado === 'activo' ? 'bi-person-x text-danger' : 'bi-person-check text-success'}`}></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;