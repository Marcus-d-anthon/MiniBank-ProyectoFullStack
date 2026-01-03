import { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../auth/AuthContext';

const MyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Función para obtener la lista de cuentas
  const fetchMyAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/my-accounts');
      const dataParaSetear = res.data.accounts || res.data.cuentas || res.data.data || res.data;
      setAccounts(Array.isArray(dataParaSetear) ? dataParaSetear : []);
    } catch (err) {
      console.error("Error al obtener mis cuentas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyAccounts();
  }, [user]);

  // NUEVA FUNCIÓN: Maneja la creación de una cuenta automática
  const handleCreateAccount = async () => {
    // Confirmación simple para evitar creaciones accidentales
    if (!window.confirm("¿Deseas abrir una nueva cuenta con un saldo inicial de $10.00?")) return;

    setLoading(true);
    try {
      // Realizamos el POST al endpoint de creación
      // El backend ahora genera el número ABC-XXXXXX y el saldo_actual: 10 automáticamente
      const res = await api.post('/accounts', {}); 

      if (res.data.status === 'success') {
        alert(`✅ ¡Cuenta ${res.data.account.numero_cuenta} creada exitosamente!`);
        // Volvemos a pedir las cuentas para que aparezca la nueva tarjeta en el front
        await fetchMyAccounts(); 
      }
    } catch (err) {
      console.error("Error al crear cuenta:", err);
      alert(err.response?.data?.message || "No se pudo crear la cuenta en este momento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Mis Cuentas</h2>
          <p className="text-muted">Resumen de tus productos financieros activos</p>
        </div>
        {/* BOTÓN VINCULADO A handleCreateAccount */}
        <button 
          className="btn btn-primary btn-lg shadow-sm"
          onClick={handleCreateAccount}
          disabled={loading}
        >
          <i className="bi bi-plus-lg me-2"></i>
          {loading ? 'Procesando...' : 'Nueva Cuenta'}
        </button>
      </div>

      <hr className="mb-4 opacity-10" />

      {loading && accounts.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-grow text-primary" role="status"></div>
          <p className="mt-3 text-muted fw-bold">Actualizando saldos...</p>
        </div>
      ) : (
        <div className="row">
          {accounts.length > 0 ? (
            accounts.map(acc => (
              <div className="col-md-6 col-lg-4 mb-4" key={acc._id}>
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                        <i className="bi bi-wallet2 fs-3 text-primary"></i>
                      </div>
                      <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                        {acc.estado || 'activo'}
                      </span>
                    </div>

                    <h6 className="text-muted small text-uppercase fw-bold mb-1">Saldo Disponible</h6>
                    <h2 className="fw-bold mb-4">
                      {acc.saldo_actual?.toLocaleString('es-US', { style: 'currency', currency: acc.moneda || 'USD' })}
                    </h2>

                    <div className="bg-light p-3 rounded-3 mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">Número de Cuenta</span>
                        <span className="fw-bold small">{acc.numero_cuenta}</span>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-dark border-2 fw-bold py-2">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-light d-inline-block p-5 rounded-circle mb-4">
                <i className="bi bi-search fs-1 text-muted"></i>
              </div>
              <h4 className="fw-bold">No encontramos cuentas asociadas</h4>
              <p className="text-muted">Aún no tienes productos financieros.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAccounts;