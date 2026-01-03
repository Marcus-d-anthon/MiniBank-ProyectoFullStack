import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import api from '../../api/api';

const Profile = () => {
  const { user, updateUserInfo } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    primer_nombre: '', 
    segundo_nombre: '', 
    primer_apellido: '', 
    segundo_apellido: '',
    telefono: '', 
    password: ''
  });

  // Sincronizar datos del usuario al cargar o actualizar
  useEffect(() => {
    if (user) {
      setFormData({
        primer_nombre: user.nombre?.primer_nombre || '',
        segundo_nombre: user.nombre?.segundo_nombre || '',
        primer_apellido: user.nombre?.primer_apellido || '',
        segundo_apellido: user.nombre?.segundo_apellido || '',
        telefono: user.telefono || '',
        password: ''
      });
    }
  }, [user]);

  // Obtener el ID limpio (String) para la URL de la API
  const getCleanId = () => {
    if (!user) return '';
    return user._id?.$oid || user._id || user.id;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // REGLA: No permite que el primer carácter sea un espacio
    if (value.startsWith(' ')) return;
    
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // VALIDACIÓN: El nombre y apellido deben tener contenido real (no solo espacios)
    if (!formData.primer_nombre.trim() || !formData.primer_apellido.trim()) {
      return alert("El primer nombre y el primer apellido son obligatorios y no pueden ser solo espacios.");
    }

    setLoading(true);
    try {
      const updateData = {
        nombre: {
          primer_nombre: formData.primer_nombre.trim(),
          segundo_nombre: formData.segundo_nombre.trim(),
          primer_apellido: formData.primer_apellido.trim(),
          segundo_apellido: formData.segundo_apellido.trim()
        },
        telefono: formData.telefono.trim()
      };

      // Solo incluimos la contraseña si el usuario escribió al menos una letra
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      // IMPORTANTE: Asegúrate de que el Backend ahora use findById con este ID
      const res = await api.put(`/usuarios/${getCleanId()}`, updateData);
      
      if (res.data) {
        // Actualizamos el contexto con el objeto usuario que devuelve el server
        updateUserInfo(res.data.usuario || res.data);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: '' })); // Limpiar campo password
        alert("¡Perfil actualizado con éxito!");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert(err.response?.data?.message || "Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Estilo para el correo: Grisado, sin selección y sin permitir copia
  const emailStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    MozUserSelect: 'none',
    backgroundColor: '#e9ecef', // Gris claro
    color: '#6c757d',           // Texto gris
    cursor: 'not-allowed',
    border: '1px solid #ced4da',
    pointerEvents: 'none'       // Evita interacción de mouse
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '700px', borderRadius: '15px' }}>
        <div className="card-header bg-primary text-white text-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
          <h4 className="mb-0 fw-bold">Configuración de Perfil</h4>
          <small className="font-monospace opacity-75">ID: {getCleanId()}</small>
        </div>

        <div className="card-body p-4">
          {!isEditing ? (
            /* --- VISTA DE VISUALIZACIÓN --- */
            <div className="row g-4">
              <div className="col-md-6">
                <label className="text-muted small d-block">Nombres</label>
                <p className="fw-bold border-bottom pb-1">
                  {user?.nombre?.primer_nombre} {user?.nombre?.segundo_nombre || ''}
                </p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small d-block">Apellidos</label>
                <p className="fw-bold border-bottom pb-1">
                  {user?.nombre?.primer_apellido} {user?.nombre?.segundo_apellido || ''}
                </p>
              </div>
              <div className="col-md-12">
                <label className="text-muted small d-block">Correo Electrónico (Protegido)</label>
                <div className="p-2 rounded mt-1 shadow-sm" style={emailStyle}>
                  {user?.email}
                </div>
              </div>
              <div className="col-md-6">
                <label className="text-muted small d-block">Teléfono</label>
                <p className="fw-bold border-bottom pb-1">{user?.telefono || '---'}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small d-block">Seguridad</label>
                <p className="fw-bold border-bottom pb-1">***********</p>
              </div>
              <div className="col-12">
                <button onClick={() => setIsEditing(true)} className="btn btn-primary w-100 mt-2 py-2 fw-bold rounded-pill shadow-sm">
                  <i className="bi bi-pencil-square me-2"></i> Editar Perfil
                </button>
              </div>
            </div>
          ) : (
            /* --- FORMULARIO DE EDICIÓN --- */
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Primer Nombre</label>
                  <input type="text" name="primer_nombre" className="form-control" value={formData.primer_nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Segundo Nombre</label>
                  <input type="text" name="segundo_nombre" className="form-control" value={formData.segundo_nombre} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Primer Apellido</label>
                  <input type="text" name="primer_apellido" className="form-control" value={formData.primer_apellido} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Segundo Apellido</label>
                  <input type="text" name="segundo_apellido" className="form-control" value={formData.segundo_apellido} onChange={handleChange} />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Correo Electrónico (No editable)</label>
                  <input type="text" className="form-control" value={user?.email} style={emailStyle} readOnly disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Teléfono</label>
                  <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-primary">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control border-primary" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Escriba para cambiar"
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-5">
                <button type="submit" className="btn btn-success flex-grow-1 py-2 fw-bold rounded-pill shadow" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Guardando...</>
                  ) : 'Confirmar Cambios'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light border py-2 px-4 rounded-pill">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;