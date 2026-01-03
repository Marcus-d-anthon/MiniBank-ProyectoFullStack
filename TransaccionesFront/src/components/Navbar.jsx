import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const getDisplayName = () => {
    if (!user?.nombre) return 'Usuario';

    if (typeof user.nombre === 'object') {
      const { primer_nombre, primer_apellido } = user.nombre;
      return `${primer_nombre || ''} ${primer_apellido || ''}`.trim() || 'Usuario';
    }

    return user.nombre;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
      <div className="container-fluid px-4">
        <span className="navbar-brand fw-bold text-primary fs-4">
          <i className="bi bi-shield-check me-2"></i>MINI BANK
        </span>
        
        <div className="d-flex align-items-center">
          <div className="text-end me-3 d-none d-sm-block">
            {/* Aquí aplicamos la función corregida */}
            <div className="fw-bold mb-0 text-dark">
              {getDisplayName()}
            </div>
            <small className="text-muted" style={{ fontSize: '0.8rem' }}>
              {user?.rol?.toUpperCase() || 'CLIENTE'}
            </small>
          </div>
          
          <div className="dropdown">
            <button 
              className="btn btn-light rounded-circle p-2 shadow-sm" 
              type="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle fs-4"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li>
                <button className="dropdown-item py-2 text-danger" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;