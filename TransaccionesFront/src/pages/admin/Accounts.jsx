import { useEffect, useState } from 'react';
import api from '../../api/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el detalle de la cuenta
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountLogs, setAccountLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resAcc = await api.get('/accounts');
      setAccounts(resAcc.data.accounts || resAcc.data.data || []);
    } catch (err) {
      console.error("Error al cargar cuentas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // FUNCIÓN PARA VER DETALLES Y CARGAR LOGS
  const handleViewDetails = async (acc) => {
    setSelectedAccount(acc);
    setLoadingLogs(true);
    setAccountLogs([]); // Limpiar logs anteriores

    try {
      // Obtenemos todas las transacciones globales
      const resTrans = await api.get('/transactions');
      const allTrans = resTrans.data.transactions || resTrans.data.data || [];

      // Filtramos las transacciones donde la cuenta seleccionada sea origen o destino
      const filtered = allTrans.filter(t => 
        (t.cuenta_origen?._id === acc._id || t.cuenta_origen === acc._id) ||
        (t.cuenta_destino?._id === acc._id || t.cuenta_destino === acc._id)
      );
      
      setAccountLogs(filtered);
    } catch (err) {
      console.error("Error al cargar logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleCreateAccount = async () => {
    const userId = window.prompt("Ingresa el ID del usuario para la nueva cuenta:");
    if (!userId) return;
    try {
      await api.post('/accounts', { user_id: userId });
      alert("✅ Cuenta creada exitosamente");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear cuenta");
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark"><i className="bi bi-bank me-2 text-primary"></i>Control de Cuentas</h2>
        <button className="btn btn-success rounded-pill px-4" onClick={handleCreateAccount}>
          <i className="bi bi-plus-lg me-2"></i>Nueva Cuenta
        </button>
      </div>

      <div className="row">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : accounts.map(acc => (
          <div className="col-md-6 col-lg-4 mb-4" key={acc._id}>
            <div className="card border-0 shadow-sm h-100 rounded-4 border-top border-primary border-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-light text-primary border">{acc.numero_cuenta}</span>
                  <span className={`badge ${acc.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>{acc.estado}</span>
                </div>
                <h2 className="fw-bold mb-3">${acc.saldo_actual?.toLocaleString()} <small className="fs-6 text-muted">{acc.moneda}</small></h2>
                
                <div className="p-2 bg-light rounded-3 small mb-4">
                  <div className="fw-bold text-dark">
                    <i className="bi bi-person-circle me-2"></i>
                    {acc.user_id?.nombre?.primer_nombre} {acc.user_id?.nombre?.primer_apellido || 'Usuario'}
                  </div>
                  <div className="text-muted ms-4">{acc.user_id?.email || 'ID: ' + acc.user_id}</div>
                </div>

                <button 
                  className="btn btn-primary w-100 rounded-pill fw-bold"
                  data-bs-toggle="modal" 
                  data-bs-target="#modalDetalles"
                  onClick={() => handleViewDetails(acc)}
                >
                  Ver Detalles y Logs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE DETALLES --- */}
      <div className="modal fade" id="modalDetalles" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-dark text-white border-0 py-3">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-info-circle me-2"></i>
                Detalles de Cuenta: {selectedAccount?.numero_cuenta}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              {selectedAccount && (
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="mb-1 text-muted small fw-bold text-uppercase">Titular</p>
                    <h5 className="fw-bold">{selectedAccount.user_id?.nombre?.primer_nombre} {selectedAccount.user_id?.nombre?.primer_apellido}</h5>
                    <p className="text-muted">{selectedAccount.user_id?.email}</p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="mb-1 text-muted small fw-bold text-uppercase">Saldo Disponible</p>
                    <h2 className="text-primary fw-bold">${selectedAccount.saldo_actual?.toLocaleString()}</h2>
                  </div>
                </div>
              )}

              <hr />
              <h6 className="fw-bold mb-3"><i className="bi bi-list-task me-2"></i>Log de Transacciones ({accountLogs.length})</h6>
              
              <div className="table-responsive" style={{ maxHeight: '300px' }}>
                {loadingLogs ? (
                  <div className="text-center p-4"><div className="spinner-border text-primary spinner-border-sm"></div></div>
                ) : accountLogs.length > 0 ? (
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Concepto</th>
                        <th className="text-end">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountLogs.map(log => {
                        const esSalida = log.cuenta_origen?._id === selectedAccount?._id || log.cuenta_origen === selectedAccount?._id;
                        return (
                          <tr key={log._id}>
                            <td className="small">{new Date(log.fecha_creacion).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${esSalida ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                {esSalida ? 'EGRESO' : 'INGRESO'}
                              </span>
                            </td>
                            <td className="small text-muted">{log.concepto || 'Transferencia'}</td>
                            <td className={`text-end fw-bold ${esSalida ? 'text-danger' : 'text-success'}`}>
                              {esSalida ? '-' : '+'}${log.monto}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-4 text-muted small">No se registran transacciones para esta cuenta.</div>
                )}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;