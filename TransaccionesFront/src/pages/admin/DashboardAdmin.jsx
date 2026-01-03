import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h1 className="fw-bold text-dark">Panel de Control Admin</h1>
        <span className="badge rounded-pill bg-danger px-3">Administrador</span>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary"><i className="bi bi-people-fill"></i> Usuarios</h5>
              <p className="card-text text-muted small">Gestionar, buscar por email y eliminar clientes.</p>
              <button onClick={() => navigate('/admin/users')} className="btn btn-primary w-100">
                Ir a Usuarios
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success"><i className="bi bi-bank"></i> Cuentas Bancarias</h5>
              <p className="card-text text-muted small">Crear nuevas cuentas y administración general.</p>
              <button onClick={() => navigate('/admin/accounts')} className="btn btn-success w-100">
                Ver Cuentas
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-dark"><i className="bi bi-arrow-left-right"></i> Transacciones</h5>
              <p className="card-text text-muted small">Historial global y creación de transferencias.</p>
              <button onClick={() => navigate('/admin/transactions')} className="btn btn-dark w-100">
                Ver Movimientos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;