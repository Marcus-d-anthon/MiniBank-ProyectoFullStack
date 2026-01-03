import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h1 className="fw-bold text-dark">Mi Banca Virtual</h1>
        <span className="badge rounded-pill bg-info text-dark px-3">Cliente</span>
      </div>

      <div className="row g-4">
        {/* Mapeo a Profile.jsx */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-primary mb-2"><i className="bi bi-person-badge"></i></div>
              <h5>Mis Datos</h5>
              <p className="text-muted small">Consulta tu información y actualiza tu perfil.</p>
              <button onClick={() => navigate('/user/profile')} className="btn btn-outline-primary w-100">
                Ver Perfil
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-success mb-2"><i className="bi bi-wallet2"></i></div>
              <h5>Mis Cuentas</h5>
              <p className="text-muted small">Crea y gestiona tus cuentas bancarias personales.</p>
              <button onClick={() => navigate('/user/my-accounts')} className="btn btn-outline-success w-100">
                Gestionar Cuentas
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-warning mb-2"><i className="bi bi-clock-history"></i></div>
              <h5>Movimientos</h5>
              <p className="text-muted small">Historial de transferencias y nuevos envíos.</p>
              <button onClick={() => navigate('/user/my-transactions')} className="btn btn-outline-warning w-100 text-dark">
                Historial y Envíos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;